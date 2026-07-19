"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SSLCommerzSimulator() {
  const params = useSearchParams();
  const router = useRouter();
  const orderId = params.get("orderId");

  const handleSuccess = () => {
    toast.success("Payment successful (simulated)");
    router.push("/order-confirmation");
  };

  const handleFail = () => {
    toast.error("Payment failed (simulated)");
    router.push("/payment/failed");
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-24">
      <div className="w-full max-w-md bg-[#0F1714] p-8 rounded-xl text-white">
        <h2 className="text-lg font-semibold mb-4">SSLCommerz (Simulator)</h2>
        <p className="text-sm text-gray-300 mb-6">Order ID: {orderId}</p>
        <div className="flex gap-4">
          <Button onClick={handleSuccess} className="flex-1">Simulate Success</Button>
          <Button onClick={handleFail} className="flex-1">Simulate Failure</Button>
        </div>
      </div>
    </div>
  );
}
