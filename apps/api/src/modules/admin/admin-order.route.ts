import { Router } from "express";
import { authenticate, authorizeAdmin } from "../../middleware/auth";
import {
  listAllOrdersController,
  updateOrderStatusController,
} from "./admin-order.controller";

const router = Router();

router.get("/", authenticate, authorizeAdmin, listAllOrdersController);
router.patch("/:id/status", authenticate, authorizeAdmin, updateOrderStatusController);

export default router;
