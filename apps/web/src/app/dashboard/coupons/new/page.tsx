"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ArrowLeft,
  Save,
  Ticket,
  Percent,
  Banknote,
  Tag,
  Calendar,
  AlertCircle,
  Package,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { couponAPI, productAPI } from "@/lib/services";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const couponSchema = z.object({
  code: z
    .string()
    .min(3, "Code must be at least 3 characters")
    .max(20)
    .toUpperCase(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.number().positive("Discount must be positive"),
  minOrderAmount: z.number().nonnegative().optional(),
  maxDiscount: z.number().nonnegative().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  usageLimit: z.number().int().positive().optional(),
  isActive: z.boolean(),
  productId: z.string().optional(),
});

type CouponFormValues = z.infer<typeof couponSchema>;

export default function NewCouponPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
      discountType: "PERCENTAGE",
      discountValue: 0,
      minOrderAmount: 0,
      isActive: true,
      productId: "all", // "all" for global coupons
    },
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await productAPI.getAll();
        setProducts(data);
      } catch (err) {
        toast.error("Failed to load products");
      }
    };
    loadProducts();
  }, []);

  async function onSubmit(values: CouponFormValues) {
    setLoading(true);
    try {
      const payload = {
        ...values,
        productId: values.productId === "all" ? undefined : values.productId,
        // Convert dates to ISO if provided
        startDate: values.startDate
          ? new Date(values.startDate).toISOString()
          : undefined,
        endDate: values.endDate ? new Date(values.endDate).toISOString() : undefined,
      };
      await couponAPI.create(payload);
      toast.success("Coupon created successfully");
      router.push("/dashboard/coupons");
    } catch (err) {
      toast.error("Failed to create coupon");
    } finally {
      setLoading(false);
    }
  }

  const discountType = form.watch("discountType");

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-accent font-bold md:text-2xl text-xl font-sans">Create New Coupon</h2>
          <p className="text-accent-foreground md:text-base text-sm">
            Set up a new discount code for your customers
          </p>
        </div>
        <Button asChild variant="outline" className="bg-white dark:bg-[#27292D] hover:bg-card active:scale-95 transition-all">
          <Link href="/dashboard/coupons" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Coupons
          </Link>
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Side: General Info */}
            <div className="md:col-span-2 space-y-6">
              <Card className="border card-border shadow-lg shadow-[#2E2D740D] rounded-[10px] overflow-hidden bg-card">
                <CardHeader className="bg-card-header border-b card-border py-4">
                  <CardTitle className="text-lg font-bold text-accent">Details</CardTitle>
                  <CardDescription className="text-accent-foreground">
                    Basic configuration for your coupon code
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coupon Code</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                            <Input
                              placeholder="E.G. NEWYEAR2024"
                              className="pl-10 uppercase font-mono tracking-widest h-11"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          This is what customers will enter at checkout
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="discountType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="dark:bg-[#191B1F] dark:border-slate-800">
                              <SelectItem value="PERCENTAGE">
                                <div className="flex items-center gap-2">
                                  <Percent className="size-4" /> Percentage
                                </div>
                              </SelectItem>
                              <SelectItem value="FIXED">
                                <div className="flex items-center gap-2">
                                  <Banknote className="size-4" /> Fixed Amount
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="discountValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount Value</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              className="h-11"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="productId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Applicable Product</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-75 dark:bg-[#191B1F] dark:border-slate-800">
                            <SelectItem value="all">
                              <div className="flex items-center gap-2">
                                <Package className="size-4" /> All Products
                              </div>
                            </SelectItem>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose if this coupon is for a specific game or
                          everything
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="border card-border shadow-lg shadow-[#2E2D740D] rounded-[10px] overflow-hidden bg-card mt-6">
                <CardHeader className="bg-card-header border-b card-border py-4">
                  <CardTitle className="text-lg font-bold text-accent">Restrictions</CardTitle>
                  <CardDescription className="text-accent-foreground">
                    Control how and when the coupon can be used
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="minOrderAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Purchase (TK.)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              className="h-11"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxDiscount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Discount (TK.)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              className="h-11"
                              disabled={discountType === "FIXED"}
                              placeholder={
                                discountType === "FIXED" ? "N/A" : "0"
                              }
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                              <Input
                                type="datetime-local"
                                className="pl-10 h-11"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                              <Input
                                type="datetime-local"
                                className="pl-10 h-11"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Side: Status & Limits */}
            <div className="space-y-6">
              <Card className="border card-border shadow-lg shadow-[#2E2D740D] rounded-[10px] overflow-hidden bg-card">
                <CardHeader className="bg-card-header border-b card-border py-4">
                  <CardTitle className="text-lg font-bold text-accent">Configuration</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3 border-slate-100 dark:border-slate-800">
                        <div className="space-y-0.5">
                          <FormLabel>Active Status</FormLabel>
                          <FormDescription>
                            Enable or disable coupon
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="usageLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Usage Limit</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Optional"
                            className="h-11"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                parseInt(e.target.value) || undefined
                              )
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Max times this coupon can be used across all orders
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-2xl p-4 flex gap-3">
                <AlertCircle className="size-5 text-amber-600 shrink-0" />
                <p className="text-xs text-amber-800 dark:text-amber-200 leading-normal">
                  Make sure to cross-check discount values. Percentage discounts
                  are calculated on product prices, while fixed discounts are
                  deducted regardless of quantity if product-specific.
                </p>
              </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#3BA956] hover:bg-[#2D8A44] text-white h-11 rounded-xl font-bold gap-2 active:scale-95 transition-all cursor-pointer shadow-lg shadow-green-200 dark:shadow-none"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="size-5" /> Save Coupon
                    </>
                  )}
                </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
