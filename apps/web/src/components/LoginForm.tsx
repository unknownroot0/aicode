"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import { authAPI } from "@/lib/services";
import { syncGuestCartToAccount } from "@/lib/guestCart";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
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

export function LoginForm() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (
    data: LoginFormData,
    event?: React.BaseSyntheticEvent
  ) => {
    event?.preventDefault();
    setIsLoading(true);
    try {
      const response = await authAPI.login(data);
      setUser(response.user);

      const syncResult = await syncGuestCartToAccount();
      if (syncResult?.failedCount) {
        toast.warning("Some cart items could not be added to your account");
      }

      toast.success("Login successful!");
      // Redirect admin users to dashboard, customers to their profile
      router.push(response.user.role === "ADMIN" ? "/dashboard" : "/profile");
    } catch (err: any) {
      toast.error(
        err.response?.data?.error ||
          err.message ||
          "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="md:w-125 sm:w-112.5 w-full bg-card sm:p-8 p-5 mx-6 flex flex-col gap-5 border sm:rounded-2xl rounded-xl shadow-lg shadow-blue-500/5"
      >
        <div className="space-y-1 mb-6">
          <h3 className="text-xl font-semibold text-center">
            Login to your account
          </h3>
          <p className="text-muted-foreground text-sm text-center">
            Enter your credentials to access your account
          </p>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <div className="relative mt-2">
                  <span className="absolute left-0 top-0 h-11 w-10 flex justify-center items-center text-muted-foreground">
                    <Mail className="h-5 w-5" />
                  </span>
                  <Input
                    type="email"
                    className="pl-10"
                    disabled={isLoading}
                    placeholder="your@email.com"
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password *</FormLabel>
              <FormControl>
                <div className="relative mt-2">
                  <span className="absolute left-0 top-0 h-11 w-10 flex justify-center items-center text-muted-foreground">
                    <Lock className="h-5 w-5" />
                  </span>
                  <Input
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10"
                    disabled={isLoading}
                    placeholder="••••••••"
                    {...field}
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                    className="absolute right-0 top-0 size-11 flex justify-center items-center text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <Eye className="h-5 w-5" />
                    ) : (
                      <EyeOff className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white font-medium rounded-lg px-3 py-3 mt-2 cursor-pointer active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 sm:text-base text-sm hover:bg-blue-700"
        >
          {isLoading ? "Logging in..." : "Log in"}
        </button>

        <p className="text-muted-foreground text-sm text-center">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </Form>
  );
}
