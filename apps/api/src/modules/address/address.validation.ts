import { z } from "zod";

export const createAddressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
});

export type CreateAddressInput = z.infer<typeof createAddressSchema>;
