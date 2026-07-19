import { asyncHandler } from "../../middleware/asyncHandler";
import { sendSuccess } from "../../utils/response";
import { BadRequestError } from "../../utils/errors";
import {
  checkoutOrderSchema,
  createOrderSchema,
  retryPaymentSchema,
  updateOrderStatusSchema,
} from "./order.validation";
import {
  createCheckoutOrder,
  createOrder,
  getUserOrders,
  getOrder,
  handleSslcommerzFailure,
  handleSslcommerzSuccess,
  retryOnlinePayment,
  updateOrderStatus,
  getAllOrders,
} from "./order.service";

export const createOrderController = asyncHandler(async (req: any, res) => {
  const result = createOrderSchema.safeParse(req.body);

  if (!result.success) {
    throw new BadRequestError(result.error.issues[0].message);
  }

  const order = await createOrder(req.user.userId, result.data);
  sendSuccess(res, 201, order, "Order created successfully");
});

export const createCheckoutOrderController = asyncHandler(async (req: any, res) => {
  const result = checkoutOrderSchema.safeParse(req.body);

  if (!result.success) {
    throw new BadRequestError(result.error.issues[0].message);
  }

  const checkout = await createCheckoutOrder(req.user?.userId, result.data);
  sendSuccess(res, 201, checkout, "Checkout order created successfully");
});

export const getUserOrdersController = asyncHandler(async (req: any, res) => {
  const orders = await getUserOrders(req.user.userId);
  sendSuccess(res, 200, orders, "Orders retrieved successfully");
});

export const getOrderController = asyncHandler(async (req: any, res) => {
  const order = await getOrder(
    req.user?.userId,
    req.params.id as string,
    req.query.viewToken as string | undefined
  );
  sendSuccess(res, 200, order, "Order retrieved successfully");
});

export const retryOnlinePaymentController = asyncHandler(async (req: any, res) => {
  const result = retryPaymentSchema.safeParse({
    viewToken: req.body?.viewToken || req.query?.viewToken,
  });

  if (!result.success) {
    throw new BadRequestError(result.error.issues[0].message);
  }

  const payment = await retryOnlinePayment(req.user?.userId, req.params.id as string, result.data);
  sendSuccess(res, 200, payment, "Payment retry session created successfully");
});

export const updateOrderStatusController = asyncHandler(async (req: any, res) => {
  const result = updateOrderStatusSchema.safeParse(req.body);

  if (!result.success) {
    throw new BadRequestError(result.error.issues[0].message);
  }

  const order = await updateOrderStatus(req.params.id as string, result.data);
  sendSuccess(res, 200, order, "Order updated successfully");
});

export const getAllOrdersController = asyncHandler(async (req: any, res) => {
  const orders = await getAllOrders();
  sendSuccess(res, 200, orders, "All orders retrieved successfully");
});

const webUrl = () => process.env.WEB_URL || "http://localhost:3000";

// These three handlers are called by SSLCommerz (browser redirect or server POST).
// They MUST always respond with a redirect — never JSON — so the browser lands
// on a friendly page regardless of what happens.

export const sslcommerzSuccessController = async (req: any, res: any) => {
  try {
    const order = await handleSslcommerzSuccess({ ...req.query, ...req.body });
    const dest = new URL("/order-confirmation", webUrl());
    if (order && order.id) dest.searchParams.set("orderId", order.id);
    if (order && order.viewToken) dest.searchParams.set("viewToken", order.viewToken);
    return res.redirect(303, dest.toString());
  } catch (err) {
    console.error("[SSLCommerz success error]", err);
    return res.redirect(303, new URL("/payment/failed", webUrl()).toString());
  }
};

export const sslcommerzFailController = async (req: any, res: any) => {
  try {
    const order = await handleSslcommerzFailure({ ...req.query, ...req.body });
    const dest = new URL("/payment/failed", webUrl());
    if (order && order.id) {
      dest.searchParams.set("orderId", order.id);
    }
    if (order && order.viewToken) {
      dest.searchParams.set("viewToken", order.viewToken);
    }
    return res.redirect(303, dest.toString());
  } catch (err) {
    console.error("[SSLCommerz fail error]", err);
    return res.redirect(303, new URL("/payment/failed", webUrl()).toString());
  }
};
// IPN is a server-to-server POST from SSLCommerz. Always respond 200 — any non-2xx
// causes SSLCommerz to retry indefinitely. Errors are logged but not re-thrown.
export const sslcommerzIpnController = async (req: any, res: any) => {
  try {
    await handleSslcommerzSuccess({ ...req.query, ...req.body });
    res.status(200).json({ received: true });
  } catch (err) {
    console.error("[SSLCommerz IPN error]", err);
    res.status(200).json({ received: true, note: "processed with errors" });
  }
};
