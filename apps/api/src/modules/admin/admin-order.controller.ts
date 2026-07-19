import { asyncHandler } from "../../middleware/asyncHandler";
import { sendSuccess } from "../../utils/response";
import { BadRequestError } from "../../utils/errors";
import { listAllOrders, updateOrderStatus } from "./admin-order.service";

export const listAllOrdersController = asyncHandler(async (req, res) => {
  const orders = await listAllOrders();
  sendSuccess(res, 200, orders, "Orders retrieved successfully");
});

export const updateOrderStatusController = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status) {
    throw new BadRequestError("Status is required");
  }

  const order = await updateOrderStatus(req.params.id as string, status);
  sendSuccess(res, 200, order, "Order status updated successfully");
});
