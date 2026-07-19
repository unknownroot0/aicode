"use client";

import useSWR from "swr";
import { useEffect, useMemo, useState } from "react";
import { productAPI, cartAPI } from "@/lib/services";
import { Product } from "@/types";
import { getProductImageUrl } from "@/lib/utils";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { ChevronRight, Clock4 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useCartSheetStore } from "@/store/cartSheetStore";
import { toast } from "sonner";

function toEmbedUrl(url?: string) {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");

    if (host === "youtube.com") {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
      if (u.pathname.startsWith("/embed/")) return `https://www.youtube.com${u.pathname}`;
    }

    if (host === "youtu.be") {
      const id = u.pathname.slice(1);
      if (id) return `https://www.youtube.com/embed/${id}`;
    }

    return null;
  } catch (err) {
    return null;
  }
}

function shortDescription(desc?: string) {
  if (!desc) return "No description available.";
  // remove duplicate repeated phrase
  const cleaned = desc.replace(/(No description available\.|\s)+/g, " ").trim();
  return cleaned || desc;
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: product, error, isLoading } = useSWR<Product>(["product", id], () => productAPI.getOne(id));

  // Hooks must be called unconditionally and in the same order on every render.
  // Place them before any early returns so React hook rules aren't violated.
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuthStore();
  const { addItem, updateQuantity } = useCartStore();
  const { onOpen } = useCartSheetStore();
  const embedUrl = useMemo(() => toEmbedUrl(product?.howToPlayUrl), [product?.howToPlayUrl]);
  const desc = useMemo(() => shortDescription(product?.description), [product?.description]);

  if (isLoading) return <LoadingSpinner />;
  if (!product) return <div className="p-8">Product not found.</div>;

  const imageUrl = (product.thumbnail ? getProductImageUrl(product.thumbnail) : "/images/goyendagiri.png") || "/images/goyendagiri.png";
  const gallery = (product.images && product.images.length > 0) ? product.images : (product.thumbnail ? [product.thumbnail] : []);
  const mainImage = (gallery.length > 0 ? getProductImageUrl(gallery[selectedIndex]) : imageUrl) || "/images/goyendagiri.png";
  const addCurrentProductToCart = async () => {
    const { items } = useCartStore.getState();
    const existingItem = items.find((item) => item.productId === product.id);

    if (existingItem && existingItem.quantity + quantity > product.stock) {
      toast.error("Insufficient stock");
      return false;
    }

    if (!user) {
      if (existingItem) {
        updateQuantity(existingItem.id, existingItem.quantity + quantity);
      } else {
        addItem({
          id: `guest-${product.id}`,
          cartId: "guest",
          productId: product.id,
          product,
          quantity,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      return true;
    }

    try {
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        await cartAPI.updateItem(existingItem.id, { quantity: newQuantity });
        updateQuantity(existingItem.id, newQuantity);
      } else {
        const response = await cartAPI.addItem({ productId: product.id, quantity });
        const cartItem = response?.item || (Array.isArray(response) ? response[0] : response);
        if (cartItem?.product && typeof cartItem.product.price === "string") {
          cartItem.product = { ...cartItem.product, price: Number(cartItem.product.price) };
        }
        addItem(cartItem);
      }
      return true;
    } catch (err) {
      console.error("Add to cart error:", err);
      const e: any = err;
      const msg = e?.response?.data?.message || e?.response?.data?.error || e?.message || "Failed to add to cart";
      toast.error(msg);
      return false;
    }
  };

  return (
    <main>
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/common-hero-bg.png')" }}
        />

        {/* Content */}
        <div className="z-10 w-full mx-auto max-w-7xl px-6 py-24 lg:py-28 flex flex-col space-y-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 z-50!">
            <Link href="/" className="text-[#C7C0AF] text-sm">Home</Link>
            <ChevronRight className="size-4" />
            <Link href="/products" className="text-[#C7C0AF] text-sm">All Games</Link>
            <ChevronRight className="size-4" />
            <span className="text-[#FEF5DE] text-sm">{product.name}</span>
          </nav>


          <div className="relative">
            {showModal && (
              <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
                <div className="relative max-w-4xl w-full mx-4">
                  <button className="absolute top-2 right-2 z-60 p-2 bg-white rounded-full" onClick={() => setShowModal(false)}>Close</button>
                  <img src={mainImage} alt="Zoom" className="w-full h-[80vh] object-contain rounded" />
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              <div>
                <div className="lg:h-116 xl:w-136.5 w-fit rounded-xl overflow-hidden border border-[#4E4E4E]">
                  <img src={mainImage} alt={product.name} className="w-full h-full object-contain cursor-zoom-in" onClick={() => setShowModal(true)} />
                </div>

                <div className="mt-8 flex gap-3">
                  {gallery.length === 0 ? (
                    <div className="size-20 bg-card p-1 rounded-md border">
                      <img src={imageUrl} alt={`${product.name}-thumb`} className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    gallery.slice(0, 8).map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedIndex(i)}
                        className={`lg:size-23 size-16 rounded-md overflow-hidden border ${i === selectedIndex ? "border-[#EAEA4C]" : "border-[#FFFFFF33]"}`}
                      >
                        <img src={getProductImageUrl(img) || "/images/goyendagiri.png"} alt={`${product.name}-${i}`} className="w-full h-full object-contain" />
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center flex-wrap gap-3">
                    <div className="flex items-center gap-1">
                      <FaStar className="text-[#FBB24A]" />
                      <FaStar className="text-[#FBB24A]" />
                      <FaStar className="text-[#FBB24A]" />
                      <FaStar className="text-[#FBB24A]" />
                      <FaStar className="text-[#FBB24A]" />
                  </div>
                  <span className="text-sm text-[#FEF5DE]">5.00 (120)</span>
                </div>

                <h1 className="xl:text-6xl md:text-4xl text-3xl font-bold text-[#FBB24A]">{product.name}</h1>
                <p className="text-sm text-[#FEF5DECC]">{desc}</p>

                <div className="flex items-center gap-x-10 gap-y-4 flex-wrap lg:py-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative size-7.5 rounded-md flex justify-center items-center bg-[#FBB24A36] backdrop-blur-md border border-[#FBB24A] text-[#FEF5DE] rotate-45 overflow-hidden">
                      <span className="size-4 rounded-full bg-[#FBB24A] absolute -top-2 -left-2" />
                      <svg width="15" height="12" className="-rotate-45" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.4563 0C8.79378 0 9.8796 1.10699 9.8796 2.47053C9.8796 3.83407 8.79378 4.94106 7.4563 4.94106C6.11883 4.94106 5.033 3.83407 5.033 2.47053C5.033 1.10699 6.11883 0 7.4563 0ZM2.23689 1.71037C3.16427 1.71037 3.91456 2.47528 3.91456 3.42073C3.91456 4.36619 3.16427 5.1311 2.23689 5.1311C1.30951 5.1311 0.559223 4.36619 0.559223 3.42073C0.559223 2.47528 1.30951 1.71037 2.23689 1.71037ZM0 9.50204C0 7.82255 1.33514 6.46138 2.98252 6.46138C3.28077 6.46138 3.5697 6.50652 3.84233 6.58966C3.07572 7.46385 2.60971 8.61835 2.60971 9.88212V10.2622C2.60971 10.533 2.66563 10.7896 2.76582 11.0224H0.74563C0.333203 11.0224 0 10.6827 0 10.2622V9.50204ZM12.1468 11.0224C12.247 10.7896 12.3029 10.533 12.3029 10.2622V9.88212C12.3029 8.61835 11.8369 7.46385 11.0703 6.58966C11.3429 6.50652 11.6318 6.46138 11.9301 6.46138C13.5775 6.46138 14.9126 7.82255 14.9126 9.50204V10.2622C14.9126 10.6827 14.5794 11.0224 14.167 11.0224H12.1468ZM10.998 3.42073C10.998 2.47528 11.7483 1.71037 12.6757 1.71037C13.6031 1.71037 14.3534 2.47528 14.3534 3.42073C14.3534 4.36619 13.6031 5.1311 12.6757 5.1311C11.7483 5.1311 10.998 4.36619 10.998 3.42073ZM3.72815 9.88212C3.72815 7.78217 5.3965 6.0813 7.4563 6.0813C9.51611 6.0813 11.1845 7.78217 11.1845 9.88212V10.2622C11.1845 10.6827 10.8513 11.0224 10.4388 11.0224H4.47378C4.06135 11.0224 3.72815 10.6827 3.72815 10.2622V9.88212Z" fill="#FEF5DE"/>
                      </svg>
                    </div>
                    <span className="text-sm text-[#FEF5DE]">{product.players || "-"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative size-7.5 rounded-md flex justify-center items-center bg-[#FBB24A36] backdrop-blur-md border border-[#FBB24A] text-[#FEF5DE] rotate-45 overflow-hidden">
                      <span className="size-4 rounded-full bg-[#FBB24A] absolute -top-2 -left-2" />
                      <Clock4 className="size-4 -rotate-45" />
                    </div>
                    <span className="text-sm text-[#FEF5DE]">{product.playTime || "-"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative size-7.5 rounded-md flex justify-center items-center bg-[#FBB24A36] backdrop-blur-md border border-[#FBB24A] text-[#FEF5DE] rotate-45 overflow-hidden">
                      <span className="size-4 rounded-full bg-[#FBB24A] absolute -top-2 -left-2" />
                      <svg width="12" height="12" className="-rotate-45" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.61111 14H2.52778C1.85737 14 1.21442 13.7337 0.740369 13.2596C0.266319 12.7856 0 12.1426 0 11.4722V5.05556H6.61111V14ZM14 11.4722C14 12.1426 13.7337 12.7856 13.2596 13.2596C12.7856 13.7337 12.1426 14 11.4722 14H7.77778V10.1111H14V11.4722ZM11.4722 0C12.1426 0 12.7856 0.266319 13.2596 0.740369C13.7337 1.21442 14 1.85737 14 2.52778V8.94445H7.77778V0H11.4722ZM6.61111 3.88889H0V2.52778C0 1.85737 0.266319 1.21442 0.740369 0.740369C1.21442 0.266319 1.85737 0 2.52778 0H6.61111V3.88889Z" fill="#FEF5DE"/>
                      </svg>
                    </div>
                    <span className="text-sm text-[#FEF5DE]">{product.category || "-"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <h2 className="md:text-3xl text-2xl font-semibold text-[#FEF5DE]">TK. {product.price}</h2>
                  <h2 className="md:text-[23px] text-xl font-normal text-[#FFFFFF52] line-through">TK. 2000</h2>
                  <span className="bg-[#B70635] text-[#FEF5DE] px-3 py-1.5 rounded-full text-xs font-extrabold">20% OFF</span>
                </div>

                {product.stock > 0 ?
                  <div className="flex items-center gap-2 lg:py-5 py-3">
                    <span className="size-2.75 rounded-full" style={{background: "linear-gradient(180deg, #00E208 0%, #006304 100%)"}} />
                    <p className="text-[#FEF5DECC] text-sm font-medium">Available in stock</p>
                  </div>
                  : 
                  <div className="flex items-center gap-2 lg:py-5 py-3">
                    <span className="size-2.75 rounded-full" style={{background: "linear-gradient(180deg, #f54f7b 0%, #B70635 100%)"}} />
                    <p className="text-[#f54f7b] text-sm font-medium">Out of stock</p>
                  </div>
                }

                <div className="flex items-center gap-3 flex-wrap">
                  <div className="h-11 border-2 border-b-4 border-[#FEF5DE] rounded-lg flex items-center font-phudu">
                    <button
                      className="w-full h-full px-4 cursor-pointer active:scale-95 transition-all"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      type="button"
                    >
                      <svg width="16" height="2" viewBox="0 0 16 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1H15" stroke="#EAEA4C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <div className="w-full h-full px-4 flex justify-center items-center">
                      {quantity}
                    </div>
                    <button
                      className="w-full h-full px-4 cursor-pointer active:scale-95 transition-all"
                      onClick={() => setQuantity((q) => Math.min(product.stock || 9999, q + 1))}
                      type="button"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 1V15M1 8H15" stroke="#EAEA4C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                  <button
                    className="lg:px-8 md:px-6 px-5 h-11 bg-[#69E5BB] text-[#12100A] text-sm border-2 border-b-4 border-[#008C5C] rounded-lg font-semibold transition-all active:scale-95 cursor-pointer flex items-center gap-2 uppercase font-phudu"
                    onClick={async () => {
                      const added = await addCurrentProductToCart();
                      if (!added) return;
                      onOpen();
                      toast.success("Added to cart!");
                    }}
                  >
                    <span>
                      <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.75 0.75H3.84091L5.91182 10.9519C5.98248 11.3027 6.17602 11.6178 6.45856 11.842C6.7411 12.0663 7.09463 12.1854 7.45727 12.1786H14.9682C15.3308 12.1854 15.6844 12.0663 15.9669 11.842C16.2494 11.6178 16.443 11.3027 16.5136 10.9519L17.75 4.55952H4.61364M7.70455 15.9881C7.70455 16.4089 7.35858 16.75 6.93182 16.75C6.50505 16.75 6.15909 16.4089 6.15909 15.9881C6.15909 15.5673 6.50505 15.2262 6.93182 15.2262C7.35858 15.2262 7.70455 15.5673 7.70455 15.9881ZM16.2045 15.9881C16.2045 16.4089 15.8586 16.75 15.4318 16.75C15.0051 16.75 14.6591 16.4089 14.6591 15.9881C14.6591 15.5673 15.0051 15.2262 15.4318 15.2262C15.8586 15.2262 16.2045 15.5673 16.2045 15.9881Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span>Add to cart</span>
                  </button>
                  <button
                    className="lg:px-8 md:px-6 px-5 h-11 bg-[#EAEA4C] text-[#12100A] text-sm border-2 border-b-4 border-[#8D8D10] rounded-lg font-semibold transition-all active:scale-95 cursor-pointer flex items-center gap-2 uppercase font-phudu"
                    onClick={async () => {
                      const added = await addCurrentProductToCart();
                      if (!added) return;
                      window.location.href = "/checkout";
                    }}
                  >
                    <span>
                      <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.97222 0.750061L0.75 9.15006H7.25L6.52778 14.7501L13.75 6.35006H7.25L7.97222 0.750061Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="space-y-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <div className="mt-2 flex items-center gap-3">
                <span className="inline-flex items-center gap-1 bg-black/20 rounded-full px-3 py-1 text-sm">
                  <FaStar className="text-[#F7D461]" /> 5.0
                </span>
                <span className="text-sm text-muted">(120)</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl text-accent font-semibold">TK. {product.price}</div>
              <div className="text-sm text-muted mt-1">{product.stock > 0 ? "Available in stock" : "Out of stock"}</div>
            </div>
          </div>

          <p className="text-sm text-muted">{desc}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <h3 className="font-semibold">Game Specifications</h3>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Category:</strong> {product.category || "-"}</li>
                <li><strong>Estimated Players:</strong> {product.players || "-"}</li>
                <li><strong>Estimated Playing Time:</strong> {product.playTime || "-"}</li>
                <li><strong>SKU:</strong> {product.sku || "-"}</li>
                <li><strong>Card Material:</strong> {product.cardMaterial || "-"}</li>
                <li><strong>Availability:</strong> {product.stock > 0 ? "In Stock" : "Out of Stock"}</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold">Shipping & Returns</h3>
              <p className="mt-2 text-sm">{product.shippingInfo || "Free shipping on orders over BDT 3,000. Delivery within 3-4 business days."}</p>

              <div className="mt-4">
                <h3 className="font-semibold">How to Play</h3>
                <div className="mt-2">
                  {embedUrl ? (
                    <div className="aspect-video">
                      <iframe src={embedUrl} title="How to Play" className="w-full h-full rounded-md" sandbox="allow-scripts allow-same-origin allow-presentation" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
                    </div>
                  ) : (
                    <div className="aspect-video bg-[#e9e9e9] rounded-md flex items-center justify-center text-sm text-muted">No video available</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </section>

      <section className="bg-[#12100A]">
        <div className="mx-auto max-w-7xl px-6 lg:py-20 py-16 space-y-12">
          <h1 className="text-2xl md:text-3xl font-semibold text-[#FEF5DE]">Product Details</h1>
          
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 lg:gap-24 gap-12">
            <div className="lg:col-span-2 col-span-1 space-y-10">
              <div className="space-y-3">
                <p className="text-[#FEF5DECC] font-bold md:text-xl text-lg">Description</p>
                <p className="text-sm text-[#FEF5DE99]">{desc || "-"}</p>
              </div>

              <div className="space-y-3">
                <p className="text-[#FEF5DECC] font-bold md:text-xl text-lg">Game Specifications</p>
                
                <ul className="mt-2 space-y-2 text-sm text-[#FEF5DE99] divide-y divide-[#FFFFFF1A]">
                  <li className="flex justify-between items-center gap-4 pb-3.5"><span>Category</span> {product.category || "-"}</li>
                  <li className="flex justify-between items-center gap-4 py-3.5"><span>Estimated Players</span> {product.players || "-"}</li>
                  <li className="flex justify-between items-center gap-4 py-3.5"><span>Estimated Playing Time</span> {product.playTime || "-"}</li>
                  <li className="flex justify-between items-center gap-4 py-3.5"><span>SKU</span> {product.sku || "-"}</li>
                  <li className="flex justify-between items-center gap-4 py-3.5"><span>Card Material</span> {product.cardMaterial || "-"}</li>
                  <li className="flex justify-between items-center gap-4 py-3.5">
                    <span>Availability</span>
                    {product.stock > 0 ?
                      <div className="flex items-center gap-2">
                        <span className="size-2.75 rounded-full" style={{background: "linear-gradient(180deg, #00E208 0%, #006304 100%)"}} />
                        <p className="text-[#FEF5DE99]">In stock</p>
                      </div>
                      : 
                      <div className="flex items-center gap-2">
                        <span className="size-2.75 rounded-full" style={{background: "linear-gradient(180deg, #f54f7b 0%, #B70635 100%)"}} />
                        <p className="text-[#f54f7b]">Out of stock</p>
                      </div>
                    }
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-span-1 space-y-10">
              <div className="space-y-3">
                <p className="text-[#FEF5DECC] font-bold md:text-xl text-lg">Shipping & Returns</p>
                <p className="text-sm text-[#FEF5DE99]">{product.shippingInfo || "-"}</p>
              </div>
              <div className="space-y-3">
                <p className="text-[#FEF5DECC] font-bold md:text-xl text-lg">How to Play</p>
                <div className="mt-2">
                  {embedUrl ? (
                    <div className="aspect-video">
                      <iframe src={embedUrl} title="How to Play" className="w-full h-full rounded-md" sandbox="allow-scripts allow-same-origin allow-presentation" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
                    </div>
                  ) : (
                    <div className="aspect-video bg-[#1b1810] rounded-md flex items-center justify-center text-sm text-[#FEF5DE99]">No video available</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
