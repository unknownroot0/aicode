import { asyncHandler } from "../../middleware/asyncHandler";
import { sendSuccess } from "../../utils/response";
import { listAllUsers, getAdminStats } from "./admin-user.service";

export const listAllUsersController = asyncHandler(async (req, res) => {
  const users = await listAllUsers();
  sendSuccess(res, 200, users, "Users retrieved successfully");
});

export const getAdminStatsController = asyncHandler(async (req, res) => {
  const stats = await getAdminStats();
  sendSuccess(res, 200, stats, "Stats retrieved successfully");
});
