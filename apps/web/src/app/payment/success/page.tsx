"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

// SSLCommerz now posts directly to the API (/api/orders/payment/success), which
// verifies the payment server-side and redirects to /order-confirmation.
// This page is only reached if something goes wrong with that redirect, or if
// someone navigates here directly. We just forward to order-confirmation (with
// viewToken if present) or fall back to /payment/failed.
export default function PaymentSuccessPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const orderId = params.get("orderId");
    const viewToken = params.get("viewToken");

    if (orderId) {
      const dest = viewToken
        ? `/order-confirmation?orderId=${orderId}&viewToken=${viewToken}`
        : `/order-confirmation?orderId=${orderId}`;
      router.replace(dest);
    } else {
      // No orderId — redirect to failed after a short delay
      const t = setTimeout(() => router.replace("/payment/failed"), 1500);
      return () => clearTimeout(t);
    }
  }, [params, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 py-24 text-white bg-[#0F1714]">
      <Loader2 className="size-8 animate-spin text-[#EAEA4C]" />
      <p className="text-sm text-gray-300">Redirecting…</p>
    </div>
  );
}
