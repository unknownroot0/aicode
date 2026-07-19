import { Response } from "express";
import { AuthRequest } from "../../types";
import { asyncHandler } from "../../middleware/asyncHandler";
import { signupSchema, loginSchema } from "./auth.validation";
import { signup, login, getMe, updateProfile, changePassword } from "./auth.service";
import { sendSuccess } from "../../utils/response";
import { BadRequestError } from "../../utils/errors";
import { clearAuthCookie, setAuthCookie } from "../../utils/cookies";

export const signupController = asyncHandler(async (req, res, next) => {
  const result = signupSchema.safeParse(req.body);

  if (!result.success) {
    throw new BadRequestError(result.error.issues[0].message);
  }

  const data = await signup(result.data);
  setAuthCookie(res, data.token);
  sendSuccess(res, 201, { user: data.user }, "Signup successful");
});

export const loginController = asyncHandler(async (req, res, next) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    throw new BadRequestError(result.error.issues[0].message);
  }

  const data = await login(result.data);
  setAuthCookie(res, data.token);
  sendSuccess(res, 200, { user: data.user }, "Login successful");
});

export const logoutController = asyncHandler(async (_req, res) => {
  clearAuthCookie(res);
  sendSuccess(res, 200, null, "Logout successful");
});

export const getMeController = asyncHandler(async (req: AuthRequest, res, next) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new BadRequestError("User ID not found in request");
  }

  const user = await getMe(userId);
  sendSuccess(res, 200, user, "User profile retrieved successfully");
});

export const updateProfileController = asyncHandler(async (req: AuthRequest, res, next) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new BadRequestError("User ID not found in request");
  }

  const user = await updateProfile(userId, req.body);
  sendSuccess(res, 200, user, "Profile updated successfully");
});

export const changePasswordController = asyncHandler(async (req: AuthRequest, res, next) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new BadRequestError("User ID not found in request");
  }

  await changePassword(userId, req.body);
  sendSuccess(res, 200, null, "Password changed successfully");
});
