import { DiscountType } from "@prisma/client";
import prisma from "../../config/database";

export const createCoupon = async (data: any) => {
  return await prisma.coupon.create({
    data: {
      ...data,
      code: data.code.toUpperCase(),
    },
  });
};

export const getAllCoupons = async () => {
  return await prisma.coupon.findMany({
    include: {
      product: {
        select: {
          id: true,
          name: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

export const getCouponByCode = async (code: string) => {
  return await prisma.coupon.findUnique({
    where: { code: code.toUpperCase() },
    include: { product: true },
  });
};

export const getCouponById = async (id: string) => {
  return await prisma.coupon.findUnique({
    where: { id },
    include: { product: true },
  });
};

export const updateCoupon = async (id: string, data: any) => {
  return await prisma.coupon.update({
    where: { id },
    data,
  });
};

export const deleteCoupon = async (id: string) => {
  return await prisma.coupon.delete({
    where: { id },
  });
};

export const validateAndCalculateDiscount = async (code: string, items: { productId: string; quantity: number }[]) => {
  const coupon = await getCouponByCode(code);

  if (!coupon) {
    throw new Error("Invalid coupon code");
  }

  if (!coupon.isActive) {
    throw new Error("Coupon is not active");
  }

  const now = new Date();
  if (coupon.startDate && now < coupon.startDate) {
    throw new Error("Coupon is not yet active");
  }
  if (coupon.endDate && now > coupon.endDate) {
    throw new Error("Coupon has expired");
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw new Error("Coupon usage limit reached");
  }

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((item) => item.productId) }, isActive: true },
    select: { id: true, name: true, price: true },
  });
  const productById = new Map(products.map((product) => [product.id, product]));

  const pricedItems = items.map((item) => {
    const product = productById.get(item.productId);
    if (!product) {
      throw new Error("Cart contains an unavailable product");
    }

    return {
      ...item,
      price: Number(product.price),
      productName: product.name,
    };
  });

  let subtotal = pricedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (coupon.minOrderAmount && subtotal < Number(coupon.minOrderAmount)) {
    throw new Error(`Minimum order amount of TK. ${coupon.minOrderAmount} required`);
  }

  let discountAmount = 0;

  if (coupon.productId) {
    // Product-specific coupon
    const item = pricedItems.find((i) => i.productId === coupon.productId);
    if (!item) {
      throw new Error(`This is not a valid coupon for this product.`);
    }

    const itemTotal = item.price * item.quantity;
    if (coupon.discountType === DiscountType.PERCENTAGE) {
      discountAmount = (itemTotal * Number(coupon.discountValue)) / 100;
      if (coupon.maxDiscount && discountAmount > Number(coupon.maxDiscount)) {
        discountAmount = Number(coupon.maxDiscount);
      }
    } else {
      discountAmount = Number(coupon.discountValue);
    }
  } else {
    // Global coupon
    if (coupon.discountType === DiscountType.PERCENTAGE) {
      discountAmount = (subtotal * Number(coupon.discountValue)) / 100;
      if (coupon.maxDiscount && discountAmount > Number(coupon.maxDiscount)) {
        discountAmount = Number(coupon.maxDiscount);
      }
    } else {
      discountAmount = Number(coupon.discountValue);
    }
  }

  // Ensure discount doesn't exceed subtotal
  if (discountAmount > subtotal) {
    discountAmount = subtotal;
  }

  return {
    couponId: coupon.id,
    code: coupon.code,
    discountAmount,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    isGlobal: !coupon.productId,
    productId: coupon.productId,
  };
};
