import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { sendSuccess, sendError } from "../../utils/response";
import * as CouponService from "./coupon.service";
import { createCouponSchema, updateCouponSchema, validateCouponSchema } from "./coupon.validation";

export const createCouponController = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = createCouponSchema.parse(req.body);
  const coupon = await CouponService.createCoupon(validatedData);
  sendSuccess(res, 201, coupon, "Coupon created successfully");
});

export const getAllCouponsController = asyncHandler(async (req: Request, res: Response) => {
  const coupons = await CouponService.getAllCoupons();
  sendSuccess(res, 200, coupons, "Coupons retrieved successfully");
});

export const getCouponByCodeController = asyncHandler(async (req: Request, res: Response) => {
  const { code } = req.params;
  const coupon = await CouponService.getCouponByCode(code as string);
  if (!coupon) {
    return sendError(res, 404, "Coupon not found");
  }
  sendSuccess(res, 200, coupon, "Coupon retrieved successfully");
});

export const getCouponByIdController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const coupon = await CouponService.getCouponById(id as string);
  if (!coupon) {
    return sendError(res, 404, "Coupon not found");
  }
  sendSuccess(res, 200, coupon, "Coupon retrieved successfully");
});

export const updateCouponController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const validatedData = updateCouponSchema.parse(req.body);
  const coupon = await CouponService.updateCoupon(id as string, validatedData);
  sendSuccess(res, 200, coupon, "Coupon updated successfully");
});

export const deleteCouponController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await CouponService.deleteCoupon(id as string);
  sendSuccess(res, 200, null, "Coupon deleted successfully");
});

export const validateCouponController = asyncHandler(async (req: Request, res: Response) => {
  const { code, items } = validateCouponSchema.parse(req.body);

  try {
    const result = await CouponService.validateAndCalculateDiscount(code, items);
    sendSuccess(res, 200, result, "Coupon validated successfully");
  } catch (error: any) {
    sendError(res, 400, error.message || "Failed to validate coupon");
  }
});
