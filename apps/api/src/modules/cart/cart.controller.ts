import { asyncHandler } from "../../middleware/asyncHandler";
import { sendSuccess } from "../../utils/response";
import { BadRequestError } from "../../utils/errors";
import { AuthRequest } from "../../types";
import { addToCartSchema, updateCartItemSchema } from "./cart.validation";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} from "./cart.service";

export const getCartController = asyncHandler(async (req: AuthRequest, res) => {
  const cart = await getCart(req.user!.userId);
  sendSuccess(res, 200, cart, "Cart retrieved successfully");
});

export const addToCartController = asyncHandler(async (req: AuthRequest, res) => {
  const result = addToCartSchema.safeParse(req.body);

  if (!result.success) {
    throw new BadRequestError(result.error.issues[0].message);
  }

  const cartItem = await addToCart(req.user!.userId, result.data);
  sendSuccess(res, 201, cartItem, "Item added to cart successfully");
});

export const updateCartItemController = asyncHandler(async (req: AuthRequest, res) => {
  const result = updateCartItemSchema.safeParse(req.body);

  if (!result.success) {
    throw new BadRequestError(result.error.issues[0].message);
  }

  const cartItem = await updateCartItem(
    req.user!.userId,
    req.params.id as string,
    result.data
  );
  sendSuccess(res, 200, cartItem, "Cart item updated successfully");
});

export const removeFromCartController = asyncHandler(async (req: AuthRequest, res) => {
  await removeFromCart(req.user!.userId, req.params.id as string);
  sendSuccess(res, 204, null, "Item removed from cart successfully");
});
