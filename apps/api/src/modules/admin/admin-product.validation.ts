import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  stock: z.number().int().nonnegative().default(0),
  thumbnail: z.string().optional(),
  images: z.array(z.string()).optional(),
  category: z.string().optional(),
  players: z.string().optional(),
  playTime: z.string().optional(),
  sku: z.string().optional(),
  cardMaterial: z.string().optional(),
  shippingInfo: z.string().optional(),
  howToPlayUrl: z.string().url().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
