"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, User, Phone, Mail, MapPin, Info, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { getProductImageUrl } from "@/lib/utils";
import { cartAPI } from "@/lib/services";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";
import CheckoutService from "@/lib/checkoutService";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, setItems, updateQuantity, removeItem, clearCart, getSubtotal, getDiscount, getTotal, appliedCoupon } = useCartStore();

  const [shippingZone, setShippingZone] = useState<"inside" | "sub" | "outside">("inside");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Billing form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [notes, setNotes] = useState("");

  // Sync cart from API for authenticated users; guests use persisted local cart
  useEffect(() => {
    const loadCart = async () => {
      try {
        const data = await cartAPI.getCart();
        setItems(data.items);
      } catch (err) {
        toast.error("Failed to load cart");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadCart();
    } else {
      setIsLoading(false);
    }
  }, [user, setItems]);

  if (isLoading) return <LoadingSpinner />;

  const handlePlaceOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (items.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    if (!fullName.trim() || !phone.trim() || !fullAddress.trim()) {
      toast.error("Please fill in your billing information");
      return;
    }

    if (!user && !email.trim()) {
      toast.error("Please enter your email so we can link this order to your account");
      return;
    }

    setIsSubmitting(true);
    try {
      const guestItems = !user
        ? items.map((i) => ({ productId: i.productId, quantity: i.quantity }))
        : undefined;

      const { redirectUrl } = await CheckoutService.placeOrder({
        fullName,
        phone,
        fullAddress,
        notes,
        paymentMethod,
        shippingZone,
        couponCode: appliedCoupon?.code,
        email,
        items: guestItems,
      });

      if (paymentMethod === "cod") {
        toast.success("Order placed successfully (COD)");
        clearCart();
        router.push(redirectUrl);
        return;
      }

      clearCart();
      window.location.assign(redirectUrl);
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.error || err?.message || "Failed to place order";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const shippingCost = shippingZone === "inside" ? 70 : shippingZone === "sub" ? 110 : 130;
  const subtotal = getSubtotal();
  const discount = getDiscount();
  const rawTotal = getTotal();
  const finalTotal = rawTotal + (items.length > 0 ? shippingCost : 0);

  return (
    <div className="relative min-h-svh w-full text-white py-28">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-[#0B1C13]"
        style={{ backgroundImage: "url('/images/common-hero-bg.png')" }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Link href="/products">
            <button className="bg-[#EAEA4C] hover:bg-[#dcdc3c] text-black w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer active:scale-95 transition-all">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <h1 className="text-xl md:text-2xl font-bold uppercase tracking-wider">
            Billing Information
          </h1>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16">
          {/* Left Column: Forms */}
          <div className="space-y-10">
            {/* Billing Information Form */}
            <section>
              <h2 className="text-[#E8E8E8] font-medium mb-4">
                Billing information
              </h2>
              <div className="space-y-4">
                {/* Full name */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <User className="w-4 h-4" />
                  </div>
                  <Input
                    placeholder="Full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full bg-[#202722]/80 border-[#38433C] text-white placeholder:text-gray-500 pl-11 h-12 rounded-xl focus:border-[#EAEA4C]/50 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Phone Number */}
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <Input
                      placeholder="Phone Number* (11 digits)"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full bg-[#202722]/80 border-[#38433C] text-white placeholder:text-gray-500 pl-11 h-12 rounded-xl focus:border-[#EAEA4C]/50 transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <Input
                      placeholder={user ? "Email (Optional)" : "Email* (to track your order)"}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required={!user}
                      className="w-full bg-[#202722]/80 border-[#38433C] text-white placeholder:text-gray-500 pl-11 h-12 rounded-xl focus:border-[#EAEA4C]/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Full Address */}
                <div className="relative">
                  <div className="absolute left-4 top-4 text-gray-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <Textarea
                    placeholder="Full Address (House, Road, Area, Village, etc.)"
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                    required
                    className="w-full bg-[#202722]/80 border-[#38433C] text-white placeholder:text-gray-500 pl-11 pt-3 min-h-25 rounded-xl focus:border-[#EAEA4C]/50 transition-colors resize-none"
                  />
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <ScrollText className="w-4 h-4" />
                  </div>
                  <Input
                    placeholder="Notes (Optional)"
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-[#202722]/80 border-[#38433C] text-white placeholder:text-gray-500 pl-11 h-12 rounded-xl focus:border-[#EAEA4C]/50 transition-colors"
                  />
                </div>
              </div>
            </section>

            {/* Shipping Zone */}
            <section>
              <h2 className="text-[#E8E8E8] font-medium mb-4">Shipping Zone</h2>
              <div className="border border-[#38433C] rounded-2xl overflow-hidden bg-[#202722]/40 backdrop-blur-sm">
                {/* Option 1 */}
                <label className="flex items-center justify-between p-4 border-b border-[#38433C] cursor-pointer hover:bg-[#202722]/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center">
                      {shippingZone === "inside" && (
                        <div className="w-2 h-2 rounded-full bg-[#EAEA4C]" />
                      )}
                    </div>
                    <span className="text-gray-300 text-sm">
                      Inside Dhaka City
                    </span>
                  </div>
                  <span className="text-gray-300 text-sm">Tk. 70</span>
                  <input
                    type="radio"
                    className="hidden"
                    checked={shippingZone === "inside"}
                    onChange={() => setShippingZone("inside")}
                  />
                </label>

                {/* Option 2 */}
                <label className="flex items-center justify-between p-4 border-b border-[#38433C] cursor-pointer hover:bg-[#202722]/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center">
                      {shippingZone === "sub" && (
                        <div className="w-2 h-2 rounded-full bg-[#EAEA4C]" />
                      )}
                    </div>
                    <span className="text-gray-300 text-sm flex items-center gap-2">
                      Sub-Area Dhaka
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-3 h-3 text-gray-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Narayanganj, Gazipur, Savar, Keraniganj, Nawabganj, Dohar, Dhamrai</p>
                        </TooltipContent>
                      </Tooltip>
                    </span>
                  </div>
                  <span className="text-gray-300 text-sm">Tk. 110</span>
                  <input
                    type="radio"
                    className="hidden"
                    checked={shippingZone === "sub"}
                    onChange={() => setShippingZone("sub")}
                  />
                </label>

                {/* Option 3 */}
                <label className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#202722]/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center">
                      {shippingZone === "outside" && (
                        <div className="w-2 h-2 rounded-full bg-[#EAEA4C]" />
                      )}
                    </div>
                    <span className="text-gray-300 text-sm">
                      Outside Dhaka City
                    </span>
                  </div>
                  <span className="text-gray-300 text-sm">Tk. 130</span>
                  <input
                    type="radio"
                    className="hidden"
                    checked={shippingZone === "outside"}
                    onChange={() => setShippingZone("outside")}
                  />
                </label>
              </div>
            </section>

            {/* Payment Method */}
            <section>
              <h2 className="text-[#E8E8E8] font-medium mb-4">
                Payment Method
              </h2>
              <div className="border border-[#38433C] rounded-2xl overflow-hidden bg-[#202722]/40 backdrop-blur-sm">
                {/* Option 1 */}
                <label className="flex items-center justify-between p-4 border-b border-[#38433C] cursor-pointer hover:bg-[#202722]/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center">
                      {paymentMethod === "cod" && (
                        <div className="w-2 h-2 rounded-full bg-[#EAEA4C]" />
                      )}
                    </div>
                    <span className="text-gray-300 text-sm">
                      Cash on Delivery
                    </span>
                  </div>
                  <span className="text-gray-400 text-sm">
                    Pay when you receive
                  </span>
                  <input
                    type="radio"
                    className="hidden"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />
                </label>

                {/* Option 2 */}
                <label className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#202722]/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center">
                      {paymentMethod === "online" && (
                        <div className="w-2 h-2 rounded-full bg-[#EAEA4C]" />
                      )}
                    </div>
                    <span className="text-gray-300 text-sm">Pay Online</span>
                  </div>
                  <span className="text-gray-400 text-sm">SSLCommerz</span>
                  <input
                    type="radio"
                    className="hidden"
                    checked={paymentMethod === "online"}
                    onChange={() => setPaymentMethod("online")}
                  />
                </label>
              </div>
            </section>
          </div>

          {/* Right Column: Order Summary */}
          <div>
            <div className="bg-[#1A201C]/60 backdrop-blur-md border border-[#2B352E] rounded-2xl p-6 lg:p-8">
              {/* Order Items */}
              <div className="space-y-6">
                {items.length === 0 ? (
                  <p className="text-gray-400 text-sm">Your cart is empty.</p>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start flex-wrap gap-4">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-xl bg-[#202722] border border-[#38433C] overflow-hidden shrink-0 relative">
                          {(() => {
                            const imgPath = item.product.thumbnail || (item.product.images && item.product.images.length > 0 ? item.product.images[0] : undefined);
                            return (
                              <img
                                src={getProductImageUrl(imgPath) || "/images/product-img.png"}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            );
                          })()}
                        </div>
                        <div className="space-y-1 pt-1">
                          <h3 className="font-bold text-gray-200 line-clamp-1">{item.product.name}</h3>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center bg-[#0F1512] rounded-full p-1">
                              <button
                                onClick={() => {
                                  const newQ = item.quantity - 1;
                                  if (newQ <= 0) {
                                    removeItem(item.id);
                                  } else {
                                    updateQuantity(item.id, newQ);
                                  }
                                }}
                                className="w-7 h-7 flex items-center justify-center rounded-full bg-[#2B352E] text-sm"
                                aria-label="Decrease quantity"
                              >
                                -
                              </button>
                              <span className="px-3 text-sm">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center rounded-full bg-[#2B352E] text-sm"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                            <span className="text-sm text-gray-400">× TK. {item.product.price.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="font-bold text-[#EAEA4C] pt-1">
                        TK. {(item.product.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-[#2B352E] my-6" />

              {/* Totals */}
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-gray-200">TK. {subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Discount</span>
                    <span className="text-gray-400">- TK. {discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-gray-200">TK. {shippingCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-bold uppercase tracking-wide">
                    Total
                  </span>
                  <span className="font-bold text-lg">TK. {finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit Button */}
              {/* <Link href="/order-confirmation" className="block w-full mt-8">
                <Button className="w-full bg-[#EAEA4C] hover:bg-[#dcdc3c] text-black font-bold uppercase tracking-wider rounded-xl py-6 h-auto text-sm transition-transform active:scale-95">
                  Place Order {paymentMethod === "cod" ? "(COD)" : "(Online)"}
                </Button>
              </Link> */}
              <Button type="submit" className={`w-full mt-8 bg-[#EAEA4C] hover:bg-[#dcdc3c] text-black font-bold uppercase tracking-wider rounded-xl py-6 h-auto text-sm transition-all active:scale-95 cursor-pointer ${isSubmitting ? "cursor-not-allowed opacity-70" : ""}`} disabled={isSubmitting}>
                Place Order {paymentMethod === "cod" ? "(COD)" : "(Online)"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
