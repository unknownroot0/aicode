"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { CircleCheckBig } from "lucide-react";
import { Button } from "@/components/ui/button";
import { orderAPI } from "@/lib/services";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";

export default function OrderConfirmationPage() {
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const viewToken = params.get("viewToken") ?? undefined;
  const { data: order, isLoading } = useSWR(
    orderId ? ["order", orderId, viewToken] : null,
    () => orderAPI.getOne(orderId as string, viewToken)
  );

  if (orderId && isLoading) return <LoadingSpinner />;

  const addressLines = order?.shippingAddress?.split("\n") || [];
  const fieldValue = (label: string) => {
    const line = addressLines.find((item: string) => item.startsWith(`${label}:`));
    return line ? line.replace(`${label}:`, "").trim() : "-";
  };

  return (
    <div className="relative min-h-svh w-full flex flex-col items-center justify-center overflow-hidden py-24">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center md:bg-bottom bg-no-repeat"
        style={{ backgroundImage: "url('/images/common-hero-bg.png')" }}
      />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-6 flex flex-col items-center">
        {/* Success Icon */}
        <div className="flex items-center justify-center mb-6">
          <CircleCheckBig className="size-8 text-[#EAEA4C]" strokeWidth={3} />
        </div>

        {/* Heading */}
        <h1 className="text-xl md:text-2xl font-medium text-[#FEF5DE] uppercase mb-2 text-center">
          Your Order is Confirmed
        </h1>
        <p className="text-[#FEF5DECC] text-sm text-center mb-10">
          Regular orders usually get handled in about 5 business days.
        </p>

        {/* Order Details Card */}
        <div className="w-full bg-[#FFFFFF0F] backdrop-blur-md border border-[#FFFFFF2B] rounded-xl overflow-hidden mb-12">
          <div className="p-4 md:p-6">
            <h2 className="text-[#FEF5DE] text-base sm:text-lg font-medium uppercase mb-6">
              Delivery To:
            </h2>

            <div className="space-y-0">
              {/* Row: Full Name */}
              <div className="flex flex-col sm:flex-row sm:items-center py-4 border-b border-[#FFFFFF1A]">
                <span className="text-[#FEF5DECC] text-sm w-full sm:w-1/3 mb-1 sm:mb-0">
                  Full Name
                </span>
                <span className="text-[#FEF5DECC] text-sm sm:w-2/3">
                  {fieldValue("Name")}
                </span>
              </div>

              {/* Row: Mobile Number */}
              <div className="flex flex-col sm:flex-row sm:items-center py-4 border-b border-[#FFFFFF1A]">
                <span className="text-[#FEF5DECC] text-sm w-full sm:w-1/3 mb-1 sm:mb-0">
                  Mobile Number
                </span>
                <span className="text-[#FEF5DECC] text-sm sm:w-2/3">
                  {fieldValue("Phone")}
                </span>
              </div>

              {/* Row: Full Address */}
              <div className="flex flex-col sm:flex-row sm:items-center py-4 border-b border-[#FFFFFF1A]">
                <span className="text-[#FEF5DECC] text-sm w-full sm:w-1/3 mb-1 sm:mb-0">
                  Full Address
                </span>
                <span className="text-[#FEF5DECC] text-sm sm:w-2/3 leading-relaxed">
                  {fieldValue("Address")}
                </span>
              </div>

              {/* Row: Order ID */}
              <div className="flex flex-col sm:flex-row sm:items-center py-4">
                <span className="text-[#FEF5DECC] text-sm w-full sm:w-1/3 mb-1 sm:mb-0">
                  Order ID
                </span>
                <span className="text-[#FEF5DECC] text-sm sm:w-2/3 font-medium">
                  {order?.orderNumber || "-"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Shopping Button */}
        <div className="flex gap-4 flex-col sm:flex-row">
          <Link href="/products">
            <Button className="bg-[#69E5BB] hover:bg-[#50d0a6] text-[#12100A] text-base font-semibold uppercase rounded-lg px-6 py-3 h-auto border border-b-[3px] border-[#008C5C] transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer">
              Explore More
            </Button>
          </Link>
          <Link href="/profile">
            <Button className="bg-amber-600 hover:bg-amber-700 text-white text-base font-semibold uppercase rounded-lg px-6 py-3 h-auto border border-b-[3px] border-amber-800 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer">
              Profile
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
