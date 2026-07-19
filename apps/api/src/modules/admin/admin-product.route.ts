import { Router } from "express";
import { authenticate, authorizeAdmin } from "../../middleware/auth";
import { upload } from "../../middleware/upload";
import { rateLimit } from "../../middleware/rateLimit";
import {
  listAllProductsController,
  createProductController,
  updateProductController,
  deleteProductController,
  uploadProductImageController,
} from "./admin-product.controller";

const router = Router();

router.get("/", authenticate, authorizeAdmin, listAllProductsController);
router.post("/", authenticate, authorizeAdmin, createProductController);
router.post(
  "/upload",
  rateLimit({ windowMs: 15 * 60 * 1000, max: 30, keyPrefix: "upload" }),
  authenticate,
  authorizeAdmin,
  upload.single("image"),
  uploadProductImageController
);
router.put("/:id", authenticate, authorizeAdmin, updateProductController);
router.delete("/:id", authenticate, authorizeAdmin, deleteProductController);

export default router;
