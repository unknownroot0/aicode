import { asyncHandler } from "../../middleware/asyncHandler";
import { sendSuccess } from "../../utils/response";
import { listProducts, getProduct } from "./product.service";

export const listProductsController = asyncHandler(async (req, res) => {
  const products = await listProducts();
  sendSuccess(res, 200, products, "Products retrieved successfully");
});

export const getProductController = asyncHandler(async (req, res) => {
  const product = await getProduct(req.params.id as string);
  sendSuccess(res, 200, product, "Product retrieved successfully");
});
