import prisma from "../../config/database";
import { NotFoundError, ConflictError } from "../../utils/errors";
import { CreateProductInput, UpdateProductInput } from "./admin-product.validation";

export const listAllProductsAdmin = async () => {
  return prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
};

export const createProduct = async (input: CreateProductInput) => {
  // If an SKU was provided, ensure it's unique to avoid DB unique constraint errors (P2002).
  if (input.sku) {
    const existing = await prisma.product.findUnique({ where: { sku: input.sku } });
    if (existing) {
      throw new ConflictError("SKU already in use for another product");
    }
  }
  return prisma.product.create({
    data: {
      name: input.name,
      description: input.description,
      price: input.price,
      stock: input.stock,
      thumbnail: input.thumbnail,
      images: input.images || [],
      ...(input.category ? { category: input.category } : {}),
      ...(input.players ? { players: input.players } : {}),
      ...(input.playTime ? { playTime: input.playTime } : {}),
      ...(input.sku ? { sku: input.sku } : {}),
      ...(input.cardMaterial ? { cardMaterial: input.cardMaterial } : {}),
      ...(input.shippingInfo ? { shippingInfo: input.shippingInfo } : {}),
      ...(input.howToPlayUrl ? { howToPlayUrl: input.howToPlayUrl } : {}),
    },
  });
};

export const updateProduct = async (id: string, input: UpdateProductInput) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  return prisma.product.update({
    where: { id },
    data: {
      ...input,
    },
  });
};

export const deleteProduct = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  try {
    return await prisma.product.delete({
      where: { id },
    });
  } catch (error) {
    return prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }
};
