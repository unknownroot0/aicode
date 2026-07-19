import { asyncHandler } from "../../middleware/asyncHandler";
import { sendSuccess } from "../../utils/response";
import { BadRequestError, ConflictError } from "../../utils/errors";
import { assertSafeImageUpload } from "../../middleware/upload";
import { createProductSchema, updateProductSchema } from "./admin-product.validation";
import {
  listAllProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./admin-product.service";

export const listAllProductsController = asyncHandler(async (req, res) => {
  const products = await listAllProductsAdmin();
  sendSuccess(res, 200, products, "Products retrieved successfully");
});

export const createProductController = asyncHandler(async (req, res) => {
  const result = createProductSchema.safeParse(req.body);

  if (!result.success) {
    throw new BadRequestError(result.error.issues[0].message);
  }

  try {
    const product = await createProduct(result.data);
    sendSuccess(res, 201, product, "Product created successfully");
  } catch (err: any) {
    // Convert Prisma unique constraint error into a ConflictError for a friendly response
    if (err && err.code === "P2002") {
      const target = err.meta?.target ? String(err.meta.target) : "unique field";
      throw new ConflictError(`Duplicate value for ${target}`);
    }

    throw err;
  }
});

export const updateProductController = asyncHandler(async (req, res) => {
  const result = updateProductSchema.safeParse(req.body);

  if (!result.success) {
    throw new BadRequestError(result.error.issues[0].message);
  }

  const product = await updateProduct(req.params.id as string, result.data);
  sendSuccess(res, 200, product, "Product updated successfully");
});

export const deleteProductController = asyncHandler(async (req, res) => {
  const product = await deleteProduct(req.params.id as string);
  sendSuccess(res, 200, product, "Product deleted successfully");
});

export const uploadProductImageController = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new BadRequestError("No image file provided");
  }

  await assertSafeImageUpload(req.file);

  const imageUrl = `/uploads/products/${req.file.filename}`;
  sendSuccess(res, 201, { imageUrl }, "Image uploaded successfully");
});
