import prisma from "../../config/database";
import { BadRequestError, NotFoundError } from "../../utils/errors";
import { AddToCartInput, UpdateCartItemInput } from "./cart.validation";

const ensureUserExists = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new NotFoundError("User not found");
  }
};

export const getCart = async (userId: string) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!cart) {
    await ensureUserExists(userId);

    cart = await prisma.cart.create({
      data: {
        user: {
          connect: { id: userId },
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  }

  return cart;
};

export const addToCart = async (userId: string, input: AddToCartInput) => {
  // Verify product exists
  const product = await prisma.product.findUnique({
    where: { id: input.productId },
  });

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  if (input.quantity > product.stock) {
    throw new BadRequestError("Insufficient stock");
  }

  // Get or create cart
  let cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    await ensureUserExists(userId);

    cart = await prisma.cart.create({
      data: {
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  // Add or update item
  let cartItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId: input.productId,
      },
    },
  });

  if (cartItem) {
    const nextQuantity = cartItem.quantity + input.quantity;
    if (nextQuantity > product.stock) {
      throw new BadRequestError("Insufficient stock");
    }

    cartItem = await prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity: nextQuantity },
      include: { product: true },
    });
  } else {
    cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: input.productId,
        quantity: input.quantity,
      },
      include: { product: true },
    });
  }

  return cartItem;
};

export const updateCartItem = async (
  userId: string,
  cartItemId: string,
  input: UpdateCartItemInput
) => {
  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: cartItemId,
      cart: { userId },
    },
    include: { product: true },
  });

  if (!cartItem) {
    throw new NotFoundError("Cart item not found");
  }

  if (input.quantity > cartItem.product.stock) {
    throw new BadRequestError("Insufficient stock");
  }

  return prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity: input.quantity },
    include: { product: true },
  });
};

export const removeFromCart = async (userId: string, cartItemId: string) => {
  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: cartItemId,
      cart: { userId },
    },
  });

  if (!cartItem) {
    throw new NotFoundError("Cart item not found");
  }

  return prisma.cartItem.delete({
    where: { id: cartItemId },
  });
};

export const clearCart = async (userId: string) => {
  return prisma.cartItem.deleteMany({
    where: {
      cart: { userId },
    },
  });
};
