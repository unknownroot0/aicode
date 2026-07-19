"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import { Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { orderAPI } from "@/lib/services";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";
import { toast } from "sonner";

export default function PaymentFailedPage() {
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const viewToken = params.get("viewToken") ?? undefined;
  const [isRetrying, setIsRetrying] = useState(false);
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

  const handleRetryPayment = async () => {
    if (!orderId || isRetrying) return;

    setIsRetrying(true);
    try {
      const result = await orderAPI.retryPayment(orderId, { viewToken });
      if (!result?.redirectUrl) {
        throw new Error("Payment gateway did not return a redirect URL");
      }
      window.location.assign(result.redirectUrl);
    } catch (err: any) {
      const message = err?.response?.data?.error || err?.message || "Unable to retry payment";
      toast.error(message);
      setIsRetrying(false);
    }
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
        {/* Failure Icon */}
        <div className="flex items-center justify-center mb-6">
          <XCircle className="size-8 text-[#FF6B6B]" strokeWidth={3} />
        </div>

        {/* Heading */}
        <h1 className="text-xl md:text-2xl font-medium text-[#FEF5DE] uppercase mb-2 text-center">
          Payment Failed
        </h1>
        <p className="text-[#FEF5DECC] text-sm text-center mb-10">
          Your payment couldn't be completed. You can retry or choose another payment method.
        </p>

        {/* Order Details Card */}
        <div className="w-full bg-[#FFFFFF0F] backdrop-blur-md border border-[#FFFFFF2B] rounded-xl overflow-hidden mb-12">
          <div className="p-4 md:p-6">
            <h2 className="text-[#FEF5DE] text-base sm:text-lg font-medium uppercase mb-6">
              Order Details
            </h2>

            <div className="space-y-0">
              {/* Row: Full Name */}
              <div className="flex flex-col sm:flex-row sm:items-center py-4 border-b border-[#FFFFFF1A]">
                <span className="text-[#FEF5DECC] text-sm w-full sm:w-1/3 mb-1 sm:mb-0">Full Name</span>
                <span className="text-[#FEF5DECC] text-sm sm:w-2/3">{fieldValue("Name")}</span>
              </div>

              {/* Row: Mobile Number */}
              <div className="flex flex-col sm:flex-row sm:items-center py-4 border-b border-[#FFFFFF1A]">
                <span className="text-[#FEF5DECC] text-sm w-full sm:w-1/3 mb-1 sm:mb-0">Mobile Number</span>
                <span className="text-[#FEF5DECC] text-sm sm:w-2/3">{fieldValue("Phone")}</span>
              </div>

              {/* Row: Full Address */}
              <div className="flex flex-col sm:flex-row sm:items-center py-4 border-b border-[#FFFFFF1A]">
                <span className="text-[#FEF5DECC] text-sm w-full sm:w-1/3 mb-1 sm:mb-0">Full Address</span>
                <span className="text-[#FEF5DECC] text-sm sm:w-2/3 leading-relaxed">{fieldValue("Address")}</span>
              </div>

              {/* Row: Order ID */}
              <div className="flex flex-col sm:flex-row sm:items-center py-4">
                <span className="text-[#FEF5DECC] text-sm w-full sm:w-1/3 mb-1 sm:mb-0">Order ID</span>
                <span className="text-[#FEF5DECC] text-sm sm:w-2/3 font-medium">{order?.orderNumber || orderId || "-"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions: Retry / Continue */}
        <div className="flex gap-4 w-full max-w-sm">
          <Button
            type="button"
            onClick={handleRetryPayment}
            disabled={!orderId || isRetrying}
            className="flex-1 bg-[#FF6B6B] hover:bg-[#e85b5b] text-[#12100A] text-base font-semibold uppercase rounded-lg px-6 py-3 h-auto border border-b-[3px] border-[#B23A3A] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isRetrying ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Retrying
              </span>
            ) : (
              "Retry Payment"
            )}
          </Button>
          <Link href="/products">
            <Button className="flex-1 bg-[#69E5BB] hover:bg-[#50d0a6] text-[#12100A] text-base font-semibold uppercase rounded-lg px-6 py-3 h-auto border border-b-[3px] border-[#008C5C] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
