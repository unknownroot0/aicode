import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, CouponValidationResult } from "../types";

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  appliedCoupon: CouponValidationResult | null;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setItems: (items: CartItem[]) => void;
  setLoading: (loading: boolean) => void;
  setAppliedCoupon: (coupon: CouponValidationResult | null) => void;
  getSubtotal: () => number;
  getDiscount: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      appliedCoupon: null,
      addItem: (item) => {
        const { items } = get();
        const existingItem = items.find((i) => i.productId === item.productId);
        if (existingItem) {
          set({
            items: items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ items: [...items, item] });
        }
      },
      removeItem: (itemId) => {
        set({ items: get().items.filter((i) => i.id !== itemId) });
      },
      updateQuantity: (itemId, quantity) => {
        set({
          items: get().items.map((i) =>
            i.id === itemId ? { ...i, quantity } : i
          ),
        });
      },
      clearCart: () => set({ items: [], appliedCoupon: null }),
      setItems: (items) => set({ items }),
      setLoading: (loading) => set({ isLoading: loading }),
      setAppliedCoupon: (coupon) => set({ appliedCoupon: coupon }),

      getSubtotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
      },

      getDiscount: () => {
        const { items, appliedCoupon } = get();
        if (!appliedCoupon) return 0;

        const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);

        if (appliedCoupon.discountType === "PERCENTAGE") {
          if (appliedCoupon.isGlobal) {
            return (subtotal * appliedCoupon.discountValue) / 100;
          } else {
            const item = items.find(i => i.productId === appliedCoupon.productId);
            if (!item) return 0;
            return (item.product.price * item.quantity * appliedCoupon.discountValue) / 100;
          }
        } else {
          if (appliedCoupon.isGlobal) {
            return Math.min(appliedCoupon.discountValue, subtotal);
          } else {
            const item = items.find(i => i.productId === appliedCoupon.productId);
            if (!item) return 0;
            return Math.min(appliedCoupon.discountValue, item.product.price * item.quantity);
          }
        }
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        return Math.max(0, subtotal - discount);
      },
    }),
    {
      name: "guest-cart",
      partialize: (state) => ({ items: state.items, appliedCoupon: state.appliedCoupon }),
    }
  )
);
