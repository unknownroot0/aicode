"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/store/authStore";
import { authAPI, orderAPI } from "@/lib/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import {
  User,
  Lock,
  Mail,
  Phone,
  Shield,
  BadgeCheck,
  AlertCircle,
  Eye,
  EyeOff,
  ShoppingBag,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";
import useSWR from "swr";
import { Order } from "@/types";
import { getProductImageUrl } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function CustomerProfilePage() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const searchParams = useSearchParams();

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    setAuthLoading(false);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      profileForm.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
      });
    }
  }, [user, profileForm]);

  // useEffect(() => {
  //   const reason = searchParams?.get("reason");
  //   if (reason === "not_authorized") {
  //     toast.error("You are signed in but not authorized to access the admin dashboard.");
  //     window.history.replaceState(null, "", window.location.pathname);
  //   }
  // }, []);

  const onProfileSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    try {
      const updatedUser = await authAPI.updateProfile(data);
      setUser(updatedUser);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setLoading(true);
    try {
      await authAPI.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password changed successfully");
      passwordForm.reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const { data: orders = [], isLoading: ordersLoading } = useSWR<Order[]>(
    user ? "storefrontOrders" : null,
    orderAPI.getOrders
  );

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-none text-xs px-3 py-1 rounded-full text-xs px-3 py-1 rounded-full";
      case "COMPLETED":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-none text-xs px-3 py-1 rounded-full";
      case "PROCESSING":
        return "bg-slate-700 text-slate-100 dark:bg-slate-700 dark:text-slate-100 border-none text-xs px-3 py-1 rounded-full";
      case "SHIPPED":
        return "bg-slate-700 text-slate-100 dark:bg-slate-700 dark:text-slate-100 border-none text-xs px-3 py-1 rounded-full";
      case "PENDING":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-none text-xs px-3 py-1 rounded-full";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-none text-xs px-3 py-1 rounded-full";
      case "FAILED":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-none text-xs px-3 py-1 rounded-full";
      case "REFUNDED":
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400 border-none text-xs px-3 py-1 rounded-full";
      default:
        return "bg-secondary text-black dark:text-white border-none text-xs px-3 py-1 rounded-full";
    }
  };

  if (authLoading || (!user && !authLoading)) return <LoadingSpinner />;

  return (
    <section className="relative overflow-hidden flex py-16 lg:py-24 px-6">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/common-section-bg.png')" }}
      />

      <div className="z-10 max-w-7xl mx-auto space-y-6 pb-10 w-full">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-[#FEF5DE] font-sans">
            Hello {user?.firstName},
          </h1>
          <p className="text-[#FEF5DE99]">
            Manage your account and view your orders.
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-100 mb-8">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="size-4 sm:block hidden" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center gap-2">
              <Lock className="size-4 sm:block hidden" />
              Password
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag className="size-4 sm:block hidden" />
              Orders {orders?.length > 0 && (<span>({orders?.length})</span>)}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid gap-6">
              {/* Account Overview */}
              <Card className="shadow-sm overflow-hidden backdrop-blur-sm">
                <CardHeader className="border-b backdrop-blur-xl">
                  <CardTitle className="text-lg flex items-center gap-2 text-[#FEF5DE]">
                    <Shield className="size-5 text-[#EAEA4C]" />
                    Account Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 rounded-xl border backdrop-blur-xl">
                      <div className="p-2 bg-[#EAEA4C]/20 rounded-lg">
                        <Mail className="size-5 text-[#FEF5DE]" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[#FEF5DE99] uppercase tracking-wider">
                          Email Address
                        </p>
                        <p className="text-sm font-semibold text-slate-100">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-xl border backdrop-blur-xl">
                      <div className="p-2 bg-green-900/40 rounded-lg">
                        <BadgeCheck className="size-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[#FEF5DE99] uppercase tracking-wider">
                          Account Status
                        </p>
                        <p className="text-sm font-semibold text-green-400">
                          {user?.isActive ? "Active" : "Inactive"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Form */}
              <Card className="shadow-sm backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-[#FEF5DE]">Profile Information</CardTitle>
                  <CardDescription className="text-[#FEF5DE99]">
                    Update your personal details.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form
                      onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                          control={profileForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={profileForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                                <Input
                                  placeholder="+8801500000000"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          disabled={loading}
                          className="px-8 bg-[#EAEA4C] hover:bg-[#e0e050] text-[#12100A] cursor-pointer active:scale-95 transition-all"
                        >
                          {loading ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="password">
            <Card className="shadow-sm backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#FEF5DE]">
                  <Lock className="size-5 text-amber-500" />
                  Change Password
                </CardTitle>
                <CardDescription className="text-[#FEF5DE99]">
                  Ensure your account is using a long, random password to stay
                  secure.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form
                    onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showCurrentPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setShowCurrentPassword(!showCurrentPassword)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                              >
                                {showCurrentPassword ? (
                                  <Eye className="size-4" />
                                ) : (
                                  <EyeOff className="size-4" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showNewPassword ? "text" : "password"}
                                  placeholder="••••••••"
                                  {...field}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowNewPassword(!showNewPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                                >
                                  {showNewPassword ? (
                                    <Eye className="size-4" />
                                  ) : (
                                    <EyeOff className="size-4" />
                                  )}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showConfirmPassword ? "text" : "password"}
                                  placeholder="••••••••"
                                  {...field}
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                  }
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                                >
                                  {showConfirmPassword ? (
                                    <Eye className="size-4" />
                                  ) : (
                                    <EyeOff className="size-4" />
                                  )}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="bg-amber-950/20 border border-amber-800 rounded-lg p-4 flex items-start gap-3">
                      <AlertCircle className="size-5 text-amber-400 shrink-0 mt-0.5" />
                      <div className="text-sm text-amber-300">
                        <p className="font-semibold mb-1">Password Requirements</p>
                        <ul className="list-disc list-inside space-y-1 text-amber-400 text-xs">
                          <li>At least 8 characters long</li>
                          <li>Contains uppercase and lowercase letters</li>
                          <li>Contains at least one number</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="px-8 bg-amber-600 hover:bg-amber-700 text-white cursor-pointer active:scale-95 transition-all"
                      >
                        {loading ? "Changing..." : "Update Password"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="orders">
            <div>
              {ordersLoading ? (
                <LoadingSpinner />
              ) : orders?.length === 0 ? (
                <p className="text-[#FEF5DE99] text-center text-xl">You have no orders yet.</p>
              ) : (
                <div className="grid gap-4">
                  {orders?.map((order) => (
                    <Card key={order.id} className="p-4 backdrop-blur-sm">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-base font-semibold text-[#FEF5DE]">{order.orderNumber}</p>
                          <p className="text-sm text-[#FEF5DE99]">{new Date(order.createdAt).toLocaleString()}</p>
                          <div className="mt-3 flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-[#FEF5DE99]">Payment</span>
                              <span
                                className={getBadgeVariant(order.paymentStatus)}
                                title={`Payment status: ${order.paymentStatus}`}
                                aria-label={`Payment status ${order.paymentStatus}`}
                              >
                                {order.paymentStatus}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-xs text-[#FEF5DE99]">Order</span>
                              <span
                                className={getBadgeVariant(order.status)}
                                title={`Order status: ${order.status}`}
                                aria-label={`Order status ${order.status}`}
                              >
                                {order.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">Total</div>
                            <div className="text-lg font-bold">${Number(order.totalAmount).toFixed(2)}</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 border-t pt-4">
                        <p className="font-medium mb-3 text-[#FEF5DE]">Items</p>
                        <ul className="space-y-3">
                          {order.items.map((item) => (
                            <li key={item.id} className="flex items-center gap-4">
                              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border">
                                <img
                                  src={getProductImageUrl(item.product.thumbnail || (item.product.images && item.product.images[0])) || "/images/product-img.png"}
                                  alt={item.product.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{item.product.name}</p>
                                <p className="text-sm text-muted-foreground">Qty {item.quantity} • ${Number(item.price).toFixed(2)}</p>
                              </div>

                              <div className="text-sm font-semibold">${(Number(item.price) * item.quantity).toFixed(2)}</div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
