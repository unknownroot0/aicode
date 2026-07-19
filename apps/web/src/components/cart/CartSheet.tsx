"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCartStore } from "@/store/cartStore";
import { useCartSheetStore } from "@/store/cartSheetStore";
import { getProductImageUrl } from "@/lib/utils";
import { Minus, Plus, Trash2, X, Ticket, BadgePercent } from "lucide-react";
import { toast } from "sonner";
import { cartAPI, couponAPI } from "@/lib/services";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function CartSheet() {
  const router = useRouter();
  const { isOpen, onClose } = useCartSheetStore();
  const {
    items,
    setItems,
    removeItem,
    updateQuantity,
    getSubtotal,
    getDiscount,
    getTotal,
    appliedCoupon,
    setAppliedCoupon,
  } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [validating, setValidating] = useState(false);

  // Sync with API when sheet opens (authenticated users only)
  useEffect(() => {
    if (isOpen && user) {
      loadCart();
    }
  }, [isOpen, user]);

  const loadCart = async () => {
    setLoading(true);
    try {
      const data = await cartAPI.getCart();
      setItems(data.items);
    } catch (err) {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    if (!user || itemId.startsWith("guest-")) {
      updateQuantity(itemId, newQuantity);
      return;
    }
    try {
      await cartAPI.updateItem(itemId, { quantity: newQuantity });
      updateQuantity(itemId, newQuantity);
    } catch (err) {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!user || itemId.startsWith("guest-")) {
      removeItem(itemId);
      toast.success("Item removed from cart");
      return;
    }
    try {
      await cartAPI.removeItem(itemId);
      removeItem(itemId);
      toast.success("Item removed from cart");
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setValidating(true);
    try {
      const simplifiedItems = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));
      const result = await couponAPI.validate(couponCode, simplifiedItems);
      setAppliedCoupon(result);
      toast.success(`Coupon "${result.code}" applied!`);
      setShowCouponInput(false);
      setCouponCode("");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Invalid coupon code");
    } finally {
      setValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    toast.info("Coupon removed");
  };

  const handlePlaceOrder = () => {
    onClose();
    router.push("/checkout");
  };

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const total = getTotal();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="inset-y-4 right-4 w-full max-w-105 max-h-[calc(100vh-2rem)] bg-linear-to-b from-[#0E271A] to-[#0B1C13] border border-[#FFFFFF2B] rounded-2xl flex flex-col h-full [&>button]:hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#FFFFFF1A]">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl uppercase text-[#FEF5DE] font-medium">
              CART
            </h2>
            <span className="bg-[#007310] text-white text-xs font-semibold px-3 py-1 rounded-full">
              {items.length} {items.length === 1 ? "item" : "items"}
            </span>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="cursor-pointer hover:scale-150 active:scale-95 transition-all"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {items?.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="size-16 rounded-full bg-[#1A2E23] flex items-center justify-center mb-4">
                <Trash2 className="size-8 text-[#FEF5DE]" />
              </div>
              <h2 className="text-base sm:text-lg font-medium text-[#FEF5DE]">
                Your cart is empty
              </h2>
              <p className="text-sm text-[#CDCDCD]">
                Add some games to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {items?.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  {/* Product Image */}
                  <div className="relative size-20 shrink-0 bg-[#1A2E23] rounded-[10px] overflow-hidden border border-[#FFFFFF42]">
                    {(() => {
                      const imgPath = item.product.thumbnail || (item.product.images && item.product.images.length > 0 ? item.product.images[0] : undefined);
                      return (
                        <img
                          src={getProductImageUrl(imgPath) || "/images/product-img.png"}
                          alt={item.product.name}
                          className="object-cover w-full h-full"
                        />
                      );
                    })()}
                  </div>

                  {/* Product Info */}
                  <div className="grow flex items-center justify-between gap-2">
                    <div className="grow flex flex-col justify-between">
                      <h3 className="text-base sm:text-lg font-medium text-[#FEF5DE] uppercase">
                        {item.product.name}
                      </h3>

                      <div className="flex items-center gap-3">
                        <span className="text-sm sm:text-base font-semibold text-[#EAEA4C] uppercase">
                          TK. {item.product.price.toLocaleString()}
                        </span>
                        <span className="text-sm sm:text-base text-[#FFFFFF52] line-through uppercase">
                          TK.{" "}
                          {(item.product.price * 1.2)
                            .toFixed(0)
                            .toLocaleString()}
                        </span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center w-fit rounded-md border-2 border-b-4 border-[#FEF5DE30] mt-4">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity - 1)
                          }
                          className="px-2 h-7 text-[#FEF5DE] font-semibold text-xs cursor-pointer"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="px-3 text-xs font-bold text-gray-100 min-w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                          className="px-2 h-7 text-[#FEF5DE] font-semibold text-xs cursor-pointer"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        title="Delete"
                        className="text-[#FEF5DE] hover:text-red-400 shrink-0 size-9 rounded-md border-2 border-b-4 border-[#FEF5DE30] cursor-pointer active:scale-95 transition-all flex justify-center items-center"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div>
            {/* Coupon Section */}
            {!appliedCoupon ? (
              <div className="mb-6">
                <button
                  onClick={() => setShowCouponInput(!showCouponInput)}
                  className="text-sm sm:text-base text-[#FEF5DE] underline underline-offset-4 uppercase font-phudu cursor-pointer hover:scale-105 active:scale-95 transition-all"
                >
                  Apply Coupon
                </button>
                {showCouponInput && (
                  <div className="flex gap-2 mt-5">
                    <Input
                      type="text"
                      placeholder="COUPON CODE"
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(e.target.value.toUpperCase())
                      }
                      className="flex-1 border border-[#A1A1A1] rounded-md px-3 h-11 text-xs font-phudu placeholder:text-[#CDCDCD] focus:outline-none focus:border-[#69E5BB] transition-colors uppercase"
                    />
                    <Button
                      onClick={handleApplyCoupon}
                      disabled={validating || !couponCode}
                      className="bg-[#69E5BB] hover:bg-[#69E5BB] cursor-pointer text-[#12100A] px-4 h-11 rounded-md text-sm font-semibold uppercase hover:scale-105 active:scale-95 transition-all border-2 border-b-4 border-black disabled:cursor-not-allowed"
                    >
                      {validating ? "..." : "APPLY"}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between bg-[#1D4D32]/30 border border-[#1D4D32] rounded-lg p-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-[#1D4D32] flex items-center justify-center">
                    <BadgePercent className="size-4 text-[#55FF82]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#55FF82] tracking-widest uppercase">
                      Coupon Applied
                    </p>
                    <p className="text-xs font-black text-white">
                      {appliedCoupon.code}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <X className="4.5" />
                </button>
              </div>
            )}

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center gap-4 text-base sm:text-lg text-[#FEF5DE] uppercase font-phudu">
                <span>Subtotal</span>
                <span>TK. {subtotal.toLocaleString()}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between items-center gap-4 text-base sm:text-lg text-[#FEF5DE] uppercase font-phudu">
                  <span>DISCOUNT</span>
                  <span>- TK. {discount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between items-center gap-4 text-base sm:text-lg text-[#FEF5DE] uppercase font-phudu">
                <span>TOTAL</span>
                <span>TK. {total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full bg-[#EAEA4C] hover:bg-[#D4D84F] text-[#12100A] sm:text-base text-sm font-semibold font-phudu py-4 rounded-md transition-all active:scale-95 hover:scale-105 uppercase cursor-pointer border-2 border-b-4 border-[#8D8D10]"
            >
              Checkout
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
