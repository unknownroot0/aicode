import { Router } from "express";
import { authenticate, authorizeAdmin, optionalAuthenticate } from "../../middleware/auth";
import {
  createCheckoutOrderController,
  createOrderController,
  getUserOrdersController,
  getOrderController,
  retryOnlinePaymentController,
  updateOrderStatusController,
  getAllOrdersController,
} from "./order.controller";

// NOTE: SSLCommerz payment callbacks (/payment/success, /payment/fail, /payment/cancel,
// /payment/ipn) are registered in app.ts BEFORE the CORS middleware. Do NOT add them
// here — browsers send Origin: null on gateway redirects and the CORS layer would block
// them before this router is reached.

const router = Router();

router.post("/checkout", optionalAuthenticate, createCheckoutOrderController);
router.post("/", authenticate, createOrderController);
router.get("/", authenticate, getUserOrdersController);

// Admin routes
router.get("/all", authenticate, authorizeAdmin, getAllOrdersController);
router.put("/:id/status", authenticate, authorizeAdmin, updateOrderStatusController);

router.post("/:id/payment/retry", optionalAuthenticate, retryOnlinePaymentController);
router.get("/:id", optionalAuthenticate, getOrderController);

export default router;
