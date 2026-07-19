export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  thumbnail?: string;
  images?: string[];
  category?: string;
  players?: string;
  playTime?: string;
  sku?: string;
  cardMaterial?: string;
  shippingInfo?: string;
  howToPlayUrl?: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CartItem = {
  id: string;
  cartId: string;
  productId: string;
  product: Product;
  quantity: number;
  createdAt: string;
  updatedAt: string;
};

export type Cart = {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
};

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  createdAt: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  userId: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  totalAmount: number;
  discountAmount: number;
  shippingAddress?: string;
  notes?: string;
  couponId?: string;
  coupon?: Coupon;
  items: OrderItem[];
  payment?: Payment;
  createdAt: string;
  updatedAt: string;
};

export type Payment = {
  id: string;
  orderId: string;
  stripePaymentId?: string;
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  paymentMethod?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: "CUSTOMER" | "ADMIN";
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  user: User;
};

export type DiscountType = "PERCENTAGE" | "FIXED";

export type Coupon = {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  productId?: string;
  product?: Product;
  createdAt: string;
  updatedAt: string;
};

export type CouponValidationResult = {
  couponId: string;
  code: string;
  discountAmount: number;
  discountType: DiscountType;
  discountValue: number;
  isGlobal: boolean;
  productId?: string;
};
