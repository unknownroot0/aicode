import prisma from "../../config/database";
import { NotFoundError } from "../../utils/errors";

export const listProducts = async () => {
  return prisma.product.findMany({
    where: { isActive: true },
  });
};

export const getProduct = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  return product;
};
