import axios from "axios";
import crypto from "crypto";
import prisma from "../../config/database";
import {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} from "../../utils/errors";
import {
  CheckoutOrderInput,
  CreateOrderInput,
  RetryPaymentInput,
  UpdateOrderStatusInput,
} from "./order.validation";
import { validateAndCalculateDiscount } from "../coupon/coupon.service";
import { findOrCreateCheckoutUser } from "../auth/auth.service";
import { env } from "../../utils/env";

const SHIPPING_COST_BY_ZONE: Record<CheckoutOrderInput["shippingZone"], number> = {
  inside: 70,
  sub: 110,
  outside: 130,
};

const RETRY_TRANSACTION_SEPARATOR = "__retry_";

type CreateOrderOptions = {
  clearCart?: boolean;
  paymentMethod?: string;
  shippingCharge?: number;
  shippingAddressSnapshot?: string;
  couponId?: string;
  discountAmount?: number;
  countCouponUsageNow?: boolean;
};

type SslcommerzInitInput = {
  orderId: string;
  orderNumber: string;
  amount: number;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  customerAddress: string;
};

const createOrderNumber = () =>
  `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 11).toUpperCase()}`;

const createRetryTransactionId = (orderNumber: string) =>
  `${orderNumber}${RETRY_TRANSACTION_SEPARATOR}${Date.now()}`;

const orderNumberFromGatewayTransaction = (transactionId: string) =>
  transactionId.includes(RETRY_TRANSACTION_SEPARATOR)
    ? transactionId.split(RETRY_TRANSACTION_SEPARATOR)[0]
    : transactionId;

const normalizeEmail = (email?: string) => {
  const trimmed = email?.trim();
  return trimmed ? trimmed : undefined;
};

const getWebUrl = () => process.env.WEB_URL || process.env.CLIENT_URL || "http://localhost:3000";
const getApiUrl = () => process.env.API_URL || `http://localhost:${process.env.PORT || 5050}`;

const buildWebRedirectUrl = (path: string, orderId: string) => {
  const url = new URL(path, getWebUrl());
  url.searchParams.set("orderId", orderId);
  return url.toString();
};

const buildApiCallbackUrl = (path: string) => new URL(path, getApiUrl()).toString();

const parseShippingAddressSnapshot = (snapshot?: string | null) => {
  const lines = snapshot?.split("\n") || [];
  const value = (label: string) => {
    const line = lines.find((item) => item.startsWith(`${label}:`));
    return line ? line.replace(`${label}:`, "").trim() : "";
  };

  return {
    name: value("Name"),
    phone: value("Phone"),
    email: value("Email"),
    address: value("Address"),
  };
};

export const createOrder = async (
  userId: string,
  input: CreateOrderInput,
  options: CreateOrderOptions = {}
) => {
  const clearCart = options.clearCart ?? true;
  const shippingCharge = options.shippingCharge ?? 0;
  const discountAmount = options.discountAmount ?? 0;

  const order = await prisma.$transaction(async (tx: any) => {
    const address = await tx.address.findFirst({
      where: {
        id: input.shippingAddressId,
        userId,
      },
    });

    if (!address) {
      throw new NotFoundError("Shipping address not found");
    }

    const cart = await tx.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestError("Cart is empty");
    }

    const itemsTotal = cart.items.reduce((total: number, item: any) => {
      return total + Number(item.product.price) * item.quantity;
    }, 0);
    const totalAmount = Math.max(0, itemsTotal + shippingCharge - discountAmount);

    for (const item of cart.items) {
      const updated = await tx.product.updateMany({
        where: {
          id: item.productId,
          isActive: true,
          stock: { gte: item.quantity },
        },
        data: {
          stock: { decrement: item.quantity },
        },
      });

      if (updated.count !== 1) {
        throw new BadRequestError(`Insufficient stock for ${item.product.name}`);
      }
    }

    const createdOrder = await tx.order.create({
      data: {
        orderNumber: createOrderNumber(),
        userId,
        status: "PENDING",
        paymentStatus: "PENDING",
        totalAmount,
        discountAmount,
        couponId: options.couponId,
        shippingAddressId: input.shippingAddressId,
        shippingAddress: options.shippingAddressSnapshot,
        notes: input.notes,
        viewToken: crypto.randomBytes(24).toString("hex"),
        items: {
          create: cart.items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        items: {
          include: { product: true },
        },
        payment: true,
      },
    });

    await tx.payment.create({
      data: {
        orderId: createdOrder.id,
        amount: totalAmount,
        status: "PENDING",
        paymentMethod: options.paymentMethod,
      },
    });

    if (options.countCouponUsageNow && options.couponId) {
      await tx.coupon.update({
        where: { id: options.couponId },
        data: { usedCount: { increment: 1 } },
      });
    }

    if (clearCart) {
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    return createdOrder;
  });

  return prisma.order.findUniqueOrThrow({
    where: { id: order.id },
    include: {
      items: {
        include: { product: true },
      },
      payment: true,
    },
  });
};

const clearUserCart = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!cart) return;

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });
};

const replaceUserCartItems = async (
  userId: string,
  items: { productId: string; quantity: number }[]
) => {
  const cart = await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: {
      user: {
        connect: { id: userId },
      },
    },
  });

  await prisma.$transaction(async (tx: any) => {
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    for (const item of items) {
      await tx.cartItem.create({
        data: {
          cartId: cart.id,
          productId: item.productId,
          quantity: item.quantity,
        },
      });
    }
  });
};

const restoreOrderStock = async (tx: any, orderId: string) => {
  const orderItems = await tx.orderItem.findMany({
    where: { orderId },
    select: { productId: true, quantity: true },
  });

  for (const item of orderItems) {
    await tx.product.update({
      where: { id: item.productId },
      data: { stock: { increment: item.quantity } },
    });
  }
};

const removeFailedCheckoutOrder = async (orderId: string, addressId: string) => {
  await prisma.$transaction(async (tx: any) => {
    await restoreOrderStock(tx, orderId);
    await tx.order.delete({ where: { id: orderId } });
    await tx.address.delete({ where: { id: addressId } });
  });
};

const markOnlineOrderFailed = async (gatewayTransactionId: string) => {
  const orderNumber = orderNumberFromGatewayTransaction(gatewayTransactionId);
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { payment: true },
  });

  if (!order || order.paymentStatus !== "PENDING") {
    return order;
  }

  return prisma.$transaction(async (tx: any) => {
    await restoreOrderStock(tx, order.id);
    const updated = await tx.order.update({
      where: { id: order.id },
      data: {
        status: "CANCELLED",
        paymentStatus: "FAILED",
      },
      include: { payment: true },
    });

    await tx.payment.update({
      where: { orderId: order.id },
      data: { status: "FAILED" },
    });

    return updated;
  });
};

const reserveOrderStock = async (tx: any, order: any) => {
  for (const item of order.items) {
    const updated = await tx.product.updateMany({
      where: {
        id: item.productId,
        isActive: true,
        stock: { gte: item.quantity },
      },
      data: {
        stock: { decrement: item.quantity },
      },
    });

    if (updated.count !== 1) {
      throw new BadRequestError(`Insufficient stock for ${item.product.name}`);
    }
  }
};

const createSslcommerzSession = async (input: SslcommerzInitInput) => {
  const storeId = process.env.SSLCOMMERZ_STORE_ID;
  const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD;

  if (!storeId || !storePassword) {
    throw new InternalServerError("SSLCommerz credentials are not configured");
  }

  const form = new URLSearchParams({
    store_id: storeId,
    store_passwd: storePassword,
    total_amount: String(Math.round(input.amount)),
    currency: "BDT",
    tran_id: input.orderNumber,
    success_url: buildApiCallbackUrl("/api/orders/payment/success"),
    fail_url: buildApiCallbackUrl("/api/orders/payment/fail"),
    cancel_url: buildApiCallbackUrl("/api/orders/payment/fail"),
    ipn_url: buildApiCallbackUrl("/api/orders/payment/ipn"),
    product_name: `Order-${input.orderNumber}`,
    product_category: "General",
    product_profile: "general",
    cus_name: input.customerName,
    cus_email: input.customerEmail || "",
    cus_add1: input.customerAddress,
    cus_city: "",
    cus_country: "Bangladesh",
    cus_phone: input.customerPhone,
  });

  const response = await axios.post(
    process.env.SSLCOMMERZ_API_URL || "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
    form.toString(),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      timeout: 15000,
    }
  );

  const data = response.data;
  if (!data || data.status !== "SUCCESS" || typeof data.GatewayPageURL !== "string") {
    const message = data?.failedreason || data?.status || "SSLCommerz session creation failed";
    throw new BadRequestError(`SSLCommerz error: ${message}`);
  }

  return data.GatewayPageURL as string;
};

type SslcommerzValidationResult =
  | { ok: true; bankTranId: string; amount: number; raw: any }
  | { ok: false; reason: string; raw?: any };

const callSslcommerzValidationApi = async (valId: string): Promise<SslcommerzValidationResult> => {
  const storeId = process.env.SSLCOMMERZ_STORE_ID;
  const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD;

  if (!storeId || !storePassword) {
    return { ok: false, reason: "SSLCommerz credentials are not configured" };
  }

  const baseUrl = env.SSLCOMMERZ_VALIDATION_URL;

  const url = new URL(baseUrl);
  url.searchParams.set("val_id", valId);
  url.searchParams.set("Store_Id", storeId);
  url.searchParams.set("Store_Passwd", storePassword);
  url.searchParams.set("v", "1");
  url.searchParams.set("format", "json");

  let raw: any;
  try {
    const res = await axios.get(url.toString(), { timeout: 30000 });
    raw = res.data;
  } catch (err: any) {
    return { ok: false, reason: `Validation API unreachable: ${err?.message}` };
  }

  if (!raw || typeof raw !== "object") {
    return { ok: false, reason: "Invalid JSON from SSLCommerz validation API", raw };
  }

  const apiStatus = String(raw.status || "").toUpperCase();
  const validStatuses = ["VALID", "VALIDATED"];
  const amount = Number(raw.amount ?? raw.currency_amount ?? 0);
  const riskLevel = Number(raw.risk_level ?? 1);
  const bankTranId = String(raw.bank_tran_id || raw.tran_id || "");

  if (!validStatuses.includes(apiStatus)) {
    return { ok: false, reason: `API status '${raw.status}' not in [VALID, VALIDATED]`, raw };
  }
  if (riskLevel !== 0) {
    return { ok: false, reason: `Risk level ${riskLevel} (expected 0/Safe)`, raw };
  }

  return { ok: true, bankTranId, amount, raw };
};

export const createCheckoutOrder = async (userId: string | undefined, input: CheckoutOrderInput) => {
  const customerEmail = normalizeEmail(input.email);
  if (!userId && !customerEmail) {
    throw new BadRequestError("Email is required for guest checkout");
  }

  const checkoutUser = userId
    ? await prisma.user.findUnique({ where: { id: userId } })
    : await findOrCreateCheckoutUser(customerEmail as string);

  if (!checkoutUser) {
    throw new NotFoundError("Customer not found");
  }

  if (!userId && (!input.items || input.items.length === 0)) {
    throw new BadRequestError("Cart is empty");
  }

  if (!userId && input.items) {
    await replaceUserCartItems(checkoutUser.id, input.items);
  }

  const shippingCharge = SHIPPING_COST_BY_ZONE[input.shippingZone];
  const couponCode = input.couponCode?.trim();
  let couponId: string | undefined;
  let discountAmount = 0;

  if (couponCode) {
    const cart = await prisma.cart.findUnique({
      where: { userId: checkoutUser.id },
      include: {
        items: {
          select: {
            productId: true,
            quantity: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestError("Cart is empty");
    }

    const discount = await validateAndCalculateDiscount(couponCode, cart.items);
    couponId = discount.couponId;
    discountAmount = discount.discountAmount;
  }

  const shippingAddressSnapshot = [
    `Name: ${input.fullName}`,
    `Phone: ${input.phone}`,
    customerEmail ? `Email: ${customerEmail}` : undefined,
    `Address: ${input.fullAddress}`,
    `Shipping zone: ${input.shippingZone}`,
  ]
    .filter(Boolean)
    .join("\n");

  const address = await prisma.address.create({
    data: {
      userId: checkoutUser.id,
      street: input.fullAddress,
      city: "",
      zipCode: "",
      country: "Bangladesh",
    },
  });

  let order;
  try {
    order = await createOrder(
      checkoutUser.id,
      {
        shippingAddressId: address.id,
        notes: input.notes,
      },
      {
        clearCart: input.paymentMethod === "cod",
        paymentMethod: input.paymentMethod === "cod" ? "Cash on Delivery" : "SSLCommerz",
        shippingCharge,
        shippingAddressSnapshot,
        couponId,
        discountAmount,
        countCouponUsageNow: input.paymentMethod === "cod",
      }
    );
  } catch (error) {
    await prisma.address.delete({ where: { id: address.id } }).catch(() => undefined);
    throw error;
  }

  if (input.paymentMethod === "cod") {
    const tokenParam = order.viewToken ? `&viewToken=${order.viewToken}` : "";
    return {
      order,
      redirectUrl: `/order-confirmation?orderId=${order.id}${tokenParam}`,
    };
  }

  let gatewayUrl: string;
  try {
    gatewayUrl = await createSslcommerzSession({
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: Number(order.totalAmount),
      customerName: input.fullName,
      customerEmail: customerEmail || checkoutUser.email,
      customerPhone: input.phone,
      customerAddress: input.fullAddress,
    });
  } catch (error) {
    await removeFailedCheckoutOrder(order.id, address.id);
    throw error;
  }

  await clearUserCart(checkoutUser.id);

  return {
    order,
    redirectUrl: gatewayUrl,
  };
};

export const retryOnlinePayment = async (
  userId: string | undefined,
  orderId: string,
  input: RetryPaymentInput = {}
) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: true,
      payment: true,
      items: { include: { product: true } },
    },
  });

  if (!order) {
    throw new NotFoundError("Order not found");
  }

  const isOwner = userId && order.userId === userId;
  const hasValidToken = input.viewToken && order.viewToken === input.viewToken;

  if (!isOwner && !hasValidToken) {
    throw new NotFoundError("Order not found");
  }

  if (order.payment?.paymentMethod !== "SSLCommerz") {
    throw new BadRequestError("Only online payments can be retried");
  }

  if (order.paymentStatus === "COMPLETED") {
    throw new BadRequestError("Payment is already completed");
  }

  if (order.paymentStatus === "REFUNDED") {
    throw new BadRequestError("Refunded orders cannot be retried");
  }

  const shouldReserveStock =
    order.paymentStatus === "FAILED" || order.status === "CANCELLED";
  let reservedForRetry = false;

  if (shouldReserveStock) {
    await prisma.$transaction(async (tx: any) => {
      const claimed = await tx.order.updateMany({
        where: {
          id: order.id,
          OR: [
            { paymentStatus: "FAILED" },
            { status: "CANCELLED" },
          ],
        },
        data: {
          status: "PENDING",
          paymentStatus: "PENDING",
        },
      });

      if (claimed.count !== 1) {
        return;
      }

      await reserveOrderStock(tx, order);
      await tx.payment.update({
        where: { orderId: order.id },
        data: {
          status: "PENDING",
          stripePaymentId: null,
          paidAt: null,
        },
      });
      reservedForRetry = true;
    });
  }

  const contact = parseShippingAddressSnapshot(order.shippingAddress);

  try {
    const redirectUrl = await createSslcommerzSession({
      orderId: order.id,
      orderNumber: createRetryTransactionId(order.orderNumber),
      amount: Number(order.totalAmount),
      customerName: contact.name || [order.user.firstName, order.user.lastName].filter(Boolean).join(" ") || "Customer",
      customerEmail: contact.email || order.user.email,
      customerPhone: contact.phone,
      customerAddress: contact.address || order.shippingAddress || "",
    });

    return {
      orderId: order.id,
      redirectUrl,
    };
  } catch (error) {
    if (reservedForRetry) {
      await markOnlineOrderFailed(order.orderNumber);
    }
    throw error;
  }
};

export const handleSslcommerzSuccess = async (payload: any) => {
  const gatewayStatus = String(payload.status || "").toUpperCase();
  const gatewayTransactionId = String(payload.tran_id || "");
  const orderNumber = orderNumberFromGatewayTransaction(gatewayTransactionId);
  const valId = String(payload.val_id || "");

  // Must have an order number to do anything
  if (!gatewayTransactionId) {
    throw new BadRequestError("Missing transaction ID (tran_id) in SSLCommerz callback");
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { payment: true },
  });

  if (!order) {
    throw new NotFoundError(`Order not found for tran_id: ${orderNumber}`);
  }

  // Idempotency — IPN may have already completed this before the browser redirect
  if (order.paymentStatus === "COMPLETED") {
    console.log(`[SSLCommerz] Order ${orderNumber} already completed — skipping duplicate processing`);
    return order;
  }

  // Handle FAILED / CANCELLED from gateway (no validation needed)
  if (["FAILED", "CANCELLED"].includes(gatewayStatus)) {
    await markOnlineOrderFailed(orderNumber);
    throw new BadRequestError(`Payment ${gatewayStatus.toLowerCase()} by SSLCommerz`);
  }

  // For VALID status we must have val_id to verify
  if (!valId) {
    throw new BadRequestError("Missing val_id in SSLCommerz callback");
  }

  // Call SSLCommerz validation API
  const validation = await callSslcommerzValidationApi(valId);

  if (!validation.ok) {
    console.error(`[SSLCommerz] Validation failed for order ${orderNumber}: ${validation.reason}`, validation.raw);
    await markOnlineOrderFailed(orderNumber);
    throw new BadRequestError(`Payment validation failed: ${validation.reason}`);
  }

  // Amount check with 0.01 tolerance for float rounding
  const orderAmount = Number(order.totalAmount);
  if (validation.amount < orderAmount - 0.01) {
    const reason = `Amount mismatch: SSLCommerz returned ${validation.amount}, order total ${orderAmount}`;
    console.error(`[SSLCommerz] ${reason} for order ${orderNumber}`);
    await markOnlineOrderFailed(orderNumber);
    throw new BadRequestError(reason);
  }

  // All checks passed — mark order as paid
  return prisma.$transaction(async (tx: any) => {
    const updated = await tx.order.update({
      where: { id: order.id },
      data: { status: "PROCESSING", paymentStatus: "COMPLETED" },
      include: { payment: true },
    });

    await tx.payment.update({
      where: { orderId: order.id },
      data: {
        status: "COMPLETED",
        stripePaymentId: validation.bankTranId || valId, // prefer bank_tran_id
        paidAt: new Date(),
      },
    });

    if (order.couponId) {
      await tx.coupon.update({
        where: { id: order.couponId },
        data: { usedCount: { increment: 1 } },
      });
    }

    console.log(`[SSLCommerz] Order ${orderNumber} marked COMPLETED (bank_tran_id: ${validation.bankTranId})`);
    return updated;
  });
};

export const handleSslcommerzFailure = async (payload: any) => {
  const gatewayTransactionId = String(payload.tran_id || "");
  const orderNumber = orderNumberFromGatewayTransaction(gatewayTransactionId);
  const gatewayStatus = String(payload.status || "FAILED").toUpperCase();

  if (!gatewayTransactionId) {
    console.warn("[SSLCommerz] Failure callback received with no tran_id", payload);
    return undefined;
  }

  console.log(`[SSLCommerz] Payment ${gatewayStatus} for order ${orderNumber}`);
  try {
    const result = await markOnlineOrderFailed(gatewayTransactionId);
    return result;
  } catch (err) {
    console.error(`[SSLCommerz] Failed to mark order ${orderNumber} as failed:`, err);
    return undefined;
  }
};

export const getUserOrders = async (userId: string) => {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: { product: true },
      },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getOrder = async (
  userId: string | undefined,
  orderId: string,
  viewToken?: string
) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { product: true } },
      payment: true,
    },
  });

  if (!order) throw new NotFoundError("Order not found");

  const isOwner = userId && order.userId === userId;
  const hasValidToken = viewToken && order.viewToken === viewToken;

  if (!isOwner && !hasValidToken) throw new NotFoundError("Order not found");

  return order;
};

export const updateOrderStatus = async (
  orderId: string,
  input: UpdateOrderStatusInput
) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new NotFoundError("Order not found");
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status: input.status },
    include: {
      items: {
        include: { product: true },
      },
      payment: true,
    },
  });
};

export const getAllOrders = async () => {
  return prisma.order.findMany({
    include: {
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
      items: {
        include: { product: true },
      },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });
};
