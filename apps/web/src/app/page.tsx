"use client";

import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useEffect } from "react";
import { cartAPI } from "@/lib/services";
import { toast } from "sonner";
import useSWR from "swr";
import { HeroSlider } from "@/components/home/HeroSlider";

export default function Home() {
  const { user } = useAuthStore();
  const { setItems } = useCartStore();

  const { data: cartData, error } = useSWR(
    user ? "storefrontCart" : null,
    cartAPI.getCart
  );

  useEffect(() => {
    if (cartData) {
      setItems(cartData.items);
    }
  }, [cartData, setItems]);

  useEffect(() => {
    if (error) {
      toast.error("Failed to sync cart data");
    }
  }, [error]);

  return (
    <div className="min-h-svh">
      <main>
        <HeroSlider />

        {/* Features Section */}
        <section className="py-24 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-blue-600 font-bold tracking-tight uppercase text-sm mb-4">
                Premium Service
              </h2>
              <p className="text-4xl font-bold text-slate-900 mb-6">
                Built for the Tabletop Community
              </p>
              <div className="h-1.5 w-20 bg-blue-600 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="group hover-lift p-8 rounded-3xl bg-slate-50 border border-slate-100 transition-colors hover:bg-white hover:border-blue-100">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-slate-100 mb-8 transition-transform group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                  🎯
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Curated Choice
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  We don't stock everything. We only stock the best. Every game
                  is personally vetted by our team of enthusiasts.
                </p>
              </div>

              <div className="group hover-lift p-8 rounded-3xl bg-slate-50 border border-slate-100 transition-colors hover:bg-white hover:border-blue-100">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-slate-100 mb-8 transition-transform group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white">
                  ⚡
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Sprint Delivery
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Order by 2 PM for same-day dispatch. Our custom packaging
                  ensures your game reaches you in mint condition.
                </p>
              </div>

              <div className="group hover-lift p-8 rounded-3xl bg-slate-50 border border-slate-100 transition-colors hover:bg-white hover:border-blue-100">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-slate-100 mb-8 transition-transform group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white">
                  🔐
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Elite Support
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Have questions about mechanics? Our staff includes competitive
                  players who can guide you to your perfect match.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
