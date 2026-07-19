"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { adminProductAPI } from "@/lib/adminServices";
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

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  const onSubmit = async (data: ProductFormData) => {
    setError("");
    try {
      setLoading(true);
      await adminProductAPI.create({
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
      toast.success("Product created successfully");
      router.push("/dashboard/products");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create product");
      setError(err?.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-accent font-bold md:text-2xl text-xl font-sans">Add New Product</h2>
          <p className="text-accent-foreground md:text-base text-sm">
            Add a new product to your catalog
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Catan Board Game" className="h-11" />
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
                      placeholder="Brief description of the product..."
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
                      <Input type="number" step="1" {...field} placeholder="499" className="h-11" />
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
                      <Input type="number" {...field} placeholder="100" className="h-11" />
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
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gallery images - support multiple */}
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
                      disabled={loading}
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

            <FormField
              control={form.control}
              name="shippingInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping & Returns</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Shipping and returns information..." className="resize-none" rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/products")}
                disabled={loading}
                className="active:scale-95 transition-all cursor-pointer hover:bg-card"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary text-white active:scale-95 transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Product"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}

