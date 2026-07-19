import { z } from "zod";

export const createOrderSchema = z.object({
  shippingAddressId: z.string().min(1, "Shipping address is required"),
  notes: z.string().optional(),
});

export const checkoutOrderSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  phone: z.string().trim().min(10, "Phone number is required").max(20, "Phone number is too long"),
  email: z.string().trim().email("Invalid email address").optional().or(z.literal("")),
  fullAddress: z.string().trim().min(1, "Full address is required"),
  notes: z.string().trim().optional(),
  paymentMethod: z.enum(["cod", "online"]),
  shippingZone: z.enum(["inside", "sub", "outside"]),
  couponCode: z.string().trim().min(3).max(20).optional(),
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.number().int().positive(),
  })).optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"]),
});

export const retryPaymentSchema = z.object({
  viewToken: z.string().trim().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type CheckoutOrderInput = z.infer<typeof checkoutOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type RetryPaymentInput = z.infer<typeof retryPaymentSchema>;
