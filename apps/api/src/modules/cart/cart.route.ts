import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import {
  getCartController,
  addToCartController,
  updateCartItemController,
  removeFromCartController,
} from "./cart.controller";

const router = Router();

router.get("/", authenticate, getCartController);
router.post("/items", authenticate, addToCartController);
router.put("/items/:id", authenticate, updateCartItemController);
router.delete("/items/:id", authenticate, removeFromCartController);

export default router;
