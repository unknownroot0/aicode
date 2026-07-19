"use client";

import useSWR from "swr";
import { FaStar, FaUsers } from "react-icons/fa";
import { LuClock4 } from "react-icons/lu";
import { RiDashboardFill } from "react-icons/ri";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { productAPI, cartAPI } from "@/lib/services";
import { Product } from "@/types";
import { getProductImageUrl } from "@/lib/utils";
import { useCartSheetStore } from "@/store/cartSheetStore";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";
import Link from "next/link";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const cardThemes = [
  {
    wrapper: "border-[#FDE5A7] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),rgba(255,255,255,0))]",
    card: "bg-gradient-to-b from-[#1D2108] via-[#1F280A] to-[#152518]",
    accent: "text-[#F7D461]",
    badge: "bg-[#F7D461]/10 text-[#F7D461] border-[#F7D461]",
  },
  {
    wrapper: "border-[#8ED6A4] bg-[radial-gradient(circle_at_top,rgba(110,220,160,0.12),rgba(255,255,255,0))]",
    card: "bg-gradient-to-b from-[#0C291D] via-[#0E3628] to-[#051B12]",
    accent: "text-[#8ED6A4]",
    badge: "bg-[#8ED6A4]/10 text-[#8ED6A4] border-[#8ED6A4]",
  },
  {
    wrapper: "border-[#D07F0F] bg-[radial-gradient(circle_at_top,rgba(208,127,15,0.12),rgba(255,255,255,0))]",
    card: "bg-gradient-to-b from-[#2B1D07] via-[#362C0E] to-[#191103]",
    accent: "text-[#F7C66C]",
    badge: "bg-[#F7C66C]/10 text-[#F7C66C] border-[#F7C66C]",
  },
];

function ProductCard({ product, themeIndex, onAdd }: { product: Product; themeIndex: number; onAdd: (product: Product) => Promise<void> }) {
  const theme = cardThemes[themeIndex % cardThemes.length];
  const imageUrl = product.thumbnail
    ? getProductImageUrl(product.thumbnail)
    : product.images && product.images.length > 0
    ? getProductImageUrl(product.images[0])
    : "/images/goyendagiri.png";
  const discount = 20;
  const rating = 5.0;

  return (
    <div>
      <div className="mb-5">
        <div className="relative mx-auto h-56 w-full">
          <img
            src={imageUrl || "/images/goyendagiri.png"}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-contain"
          />
        </div>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className={`inline-flex items-center justify-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${theme.badge}`}>
          {discount}% OFF
        </span>
        <div className="inline-flex items-center gap-2 rounded-full bg-black/20 px-3 py-1 text-sm text-[#F5F0D5]">
          <FaStar className="h-3.5 w-3.5 text-[#F7D461]" />
          <span>{rating.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FaUsers className="size-4 text-[#FFFFFF59]" />
            <p className="text-sm font-medium text-[#FEF5DECC]">3-6 Players</p>
          </div>
          <span className="h-5 w-px bg-[#FFFFFF24]" />
          <div className="flex items-center gap-2">
            <LuClock4 className="size-4 text-[#FFFFFF59]" />
            <p className="text-sm font-medium text-[#FEF5DECC]">30-45 min</p>
          </div>
        </div>
        <Link href={`/products/${product.id}`} className="text-xl md:text-2xl font-medium text-[#FEF5DE] hover:text-[#EAEA4C] font-phudu">{product.name}</Link>


        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-x-3">
            <span className="text-lg md:text-xl uppercase text-[#EAEA4C] font-semibold font-phudu">TK. {product.price}</span>
            <span className="text-lg md:text-xl uppercase text-[#FFFFFF73] font-phudu line-through">TK. 900</span>
          </div>
          <button
            type="button"
            onClick={() => onAdd(product)}
            disabled={product.stock === 0}
            className="bg-[#EAEA4C] hover:bg-[#D4D84F] text-[#12100A] font-semibold font-phudu text-xs sm:text-sm uppercase py-2.5 px-4 rounded-lg transition-all active:scale-95 hover:scale-105 border-2 border-b-4 border-black cursor-pointer"
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function AllProducts() {
  const { user } = useAuthStore();
  const { addItem, updateQuantity } = useCartStore();
  const { onOpen } = useCartSheetStore();
  const { data: products = [], error, isLoading: loading } = useSWR<Product[]>("storefrontProducts", productAPI.getAll);

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      // Guest: add/increment in local persisted cart
      const { items } = useCartStore.getState();
      const existingItem = items.find((item) => item.productId === product.id);
      if (existingItem) {
        updateQuantity(existingItem.id, existingItem.quantity + 1);
      } else {
        addItem({
          id: `guest-${product.id}`,
          cartId: "guest",
          productId: product.id,
          product,
          quantity: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      onOpen();
      toast.success("Added to cart!");
      return;
    }

    try {
      const { items } = useCartStore.getState();
      const existingItem = items.find((item) => item.productId === product.id);

      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;
        await cartAPI.updateItem(existingItem.id, { quantity: newQuantity });
        updateQuantity(existingItem.id, newQuantity);
      } else {
        const response = await cartAPI.addItem({ productId: product.id, quantity: 1 });

        const cartItem = (() => {
          if (!response) return response;
          if (Array.isArray(response)) return response[0];
          if (response.item) return response.item;
          if (response.items && Array.isArray(response.items)) return response.items[response.items.length - 1];
          return response;
        })();

        if (cartItem?.product && typeof cartItem.product.price === "string") {
          cartItem.product = { ...cartItem.product, price: Number(cartItem.product.price) };
        }

        addItem(cartItem);
      }

      onOpen();
      toast.success("Added to cart!");
    } catch (err) {
      console.error("Add to cart error:", err);
      const e: any = err;
      const msg = e?.response?.data?.message || e?.response?.data?.error || e?.message || "Failed to add to cart";
      toast.error(msg);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <section className="relative overflow-hidden py-16 lg:py-24 px-6">
      <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/common-section-bg.png')" }} />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 flex gap-4 items-center justify-between flex-wrap">
          <h1 className="text-2xl md:text-3xl font-semibold text-[#FEF5DE]">Diceymio Games</h1>
          <Select defaultValue="all">
            <SelectTrigger className="w-40 border-2 border-b-4 border-[#FEF5DE]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Games</SelectItem>
                <SelectItem value="best-selling">Best Selling</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} themeIndex={index} onAdd={handleAddToCart} />
          ))}
        </div>
      </div>
    </section>
  );
}
