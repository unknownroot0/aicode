"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, User, Info } from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import { authAPI } from "@/lib/services";
import { syncGuestCartToAccount } from "@/lib/guestCart";
import { signupSchema, type SignupFormData } from "@/lib/validations/auth";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

export function SignupForm() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (
    data: SignupFormData,
    event?: React.BaseSyntheticEvent
  ) => {
    event?.preventDefault();
    setIsLoading(true);
    try {
      // Omit confirmPassword for the API
      const { confirmPassword, ...signupData } = data;

      const response = await authAPI.signup(signupData);
      setUser(response.user);

      const syncResult = await syncGuestCartToAccount();
      if (syncResult?.failedCount) {
        toast.warning("Some cart items could not be added to your account");
      }

      toast.success("Account created successfully!");
      router.push("/products");
    } catch (err: any) {
      toast.error(
        err.response?.data?.error ||
          err.message ||
          "Signup failed. Please try again."
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
            Create your account
          </h3>
          <p className="text-muted-foreground text-sm text-center">
            Enter your details to create an account
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>First Name *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-0 top-0 h-11 w-10 flex justify-center items-center text-muted-foreground">
                      <User className="h-5 w-5" />
                    </span>
                    <Input
                      type="text"
                      className="pl-10"
                      disabled={isLoading}
                      placeholder="John"
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
            name="lastName"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Last Name *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-0 top-0 h-11 w-10 flex justify-center items-center text-muted-foreground">
                      <User className="h-5 w-5" />
                    </span>
                    <Input
                      type="text"
                      className="pl-10"
                      disabled={isLoading}
                      placeholder="Doe"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <div className="relative">
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
            <FormItem className="space-y-2">
              <FormLabel className="flex items-center gap-2">
                Password *
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="cursor-help">
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <ul className="list-disc pl-4 text-xs space-y-1">
                        <li>At least 8 characters long</li>
                        <li>Contains uppercase and lowercase letters</li>
                        <li>Contains at least one number</li>
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <div className="relative">
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

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Confirm Password *</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-0 top-0 h-11 w-10 flex justify-center items-center text-muted-foreground">
                    <Lock className="h-5 w-5" />
                  </span>
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    className="pl-10 pr-10"
                    disabled={isLoading}
                    placeholder="••••••••"
                    {...field}
                  />
                  <button
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    type="button"
                    className="absolute right-0 top-0 size-11 flex justify-center items-center text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
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
          {isLoading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="text-muted-foreground text-sm text-center">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </Form>
  );
}
