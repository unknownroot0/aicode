"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import { adminProductAPI } from "@/lib/adminServices";
import { productAPI } from "@/lib/services";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";
import { ImageUpload } from "@/components/ui/image-upload";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  price: z.string().min(1, "Price is required").refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Price must be a positive number"),
  stock: z.string().min(1, "Stock is required").refine(val => !isNaN(parseInt(val)) && parseInt(val) >= 0, "Stock must be 0 or greater"),
  thumbnail: z.string().optional().or(z.literal("")),
  images: z.array(z.string()).optional(),
  category: z.string().optional(),
  players: z.string().optional(),
  playTime: z.string().optional(),
  sku: z.string().optional(),
  cardMaterial: z.string().optional(),
  shippingInfo: z.string().optional(),
  howToPlayUrl: z.string().url().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      description: "",
      price: "",
      stock: "0",
      thumbnail: "",
      images: [],
      category: "",
      players: "",
      playTime: "",
      sku: "",
      cardMaterial: "",
      shippingInfo: "",
      howToPlayUrl: "",
    },
  });

  const { data: product, error: fetchError, isLoading } = useSWR(['adminProduct', productId], () => productAPI.getOne(productId));

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name || "",
        description: product.description || "",
        price: String(product.price),
        stock: String(product.stock),
        thumbnail: product.thumbnail || "",
        images: product.images || [],
        category: product.category || "",
        players: product.players || "",
        playTime: product.playTime || "",
        sku: product.sku || "",
        cardMaterial: product.cardMaterial || "",
        shippingInfo: product.shippingInfo || "",
        howToPlayUrl: product.howToPlayUrl || "",
      });
    }
  }, [product, form]);

  useEffect(() => {
    if (fetchError) {
      setError("Product not found");
    }
  }, [fetchError]);

  const onSubmit = async (data: ProductFormData) => {
    setError("");
    try {
      setSaving(true);
      await adminProductAPI.update(productId, {
        name: data.name.trim(),
        description: data.description?.trim() || undefined,
        price: parseFloat(data.price),
        stock: parseInt(data.stock || "0"),
        thumbnail: data.thumbnail?.trim() || undefined,
        images: data.images || undefined,
        category: data.category?.trim() || undefined,
        players: data.players?.trim() || undefined,
        playTime: data.playTime?.trim() || undefined,
        sku: data.sku?.trim() || undefined,
        cardMaterial: data.cardMaterial?.trim() || undefined,
        shippingInfo: data.shippingInfo?.trim() || undefined,
        howToPlayUrl: data.howToPlayUrl?.trim() || undefined,
      });
      toast.success("Product updated successfully");
      router.push("/dashboard/products");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update product");
      setError(err?.response?.data?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-accent font-bold md:text-2xl text-xl font-sans">Edit Product</h2>
          <p className="text-accent-foreground md:text-base text-sm">
            Update product details
          </p>
        </div>
        <Button asChild variant="outline" className="bg-white dark:bg-[#27292D] hover:bg-card active:scale-95 transition-all">
          <Link href="/dashboard/products" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
        </Button>
      </div>

      <Card className="border card-border shadow-lg shadow-[#2E2D740D] rounded-[10px] overflow-hidden bg-card mt-8 sm:p-8 p-5">
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 p-3 rounded-lg flex items-center gap-2 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
            {error}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name *</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-11" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="resize-none"
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (৳) *</FormLabel>
                    <FormControl>
                      <Input type="number" step="1" min={1} {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Board Game" className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="players"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Players</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. 2-4 Players" className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="playTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Playing Time</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. 30-45 min" className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="SKU12345" className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="cardMaterial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Material</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Hard Paper" className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="howToPlayUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How to Play (Video URL)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://youtube.com/..." className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* legacy single `image` removed; use `thumbnail` and `images` */}

            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail (used on product card)</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      onUpload={adminProductAPI.uploadImage}
                      disabled={saving}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Gallery Images</FormLabel>
              <div className="space-y-3">
                {(form.watch("images") || []).map((img, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <ImageUpload
                      value={img}
                      onChange={(url) => {
                        const arr = form.getValues("images") || [];
                        arr[idx] = url;
                        form.setValue("images", arr);
                      }}
                      onUpload={adminProductAPI.uploadImage}
                      disabled={saving}
                    />
                    <div className="mt-2">
                      <button
                        type="button"
                        className="btn btn-sm text-sm text-red-500"
                        onClick={() => {
                          const arr = form.getValues("images") || [];
                          arr.splice(idx, 1);
                          form.setValue("images", arr);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                <div>
                  <button
                    type="button"
                    className="btn btn-sm bg-primary text-white"
                    onClick={() => {
                      const arr = form.getValues("images") || [];
                      arr.push("");
                      form.setValue("images", arr);
                    }}
                  >
                    Add Image
                  </button>
                </div>
              </div>
            </FormItem>

            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/products")}
                disabled={saving}
                className="active:scale-95 transition-all cursor-pointer hover:bg-card"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-primary text-white active:scale-95 transition-all cursor-pointer"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}

