"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import SecondaryHeader from "@/components/SecondaryHeader";
import { useAuthStore } from "@/store/authStore";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";

export default function LoginPage() {
  const router = useRouter();
  const { user, isAuthenticated, _restored } = useAuthStore();

  useEffect(() => {
    // Wait until restoreFromStorage has run (hydration)
    if (!_restored) return;

    if (isAuthenticated) {
      // Already signed in — redirect based on role instead of showing login form
      if (user?.role === "ADMIN") router.replace("/dashboard");
      else router.replace("/profile");
    }
  }, [_restored, isAuthenticated, user, router]);

  // If not restored yet or user is authenticated, show loading spinner
  if (!_restored || isAuthenticated) {
    return <LoadingSpinner />;
  }

  return (
    <main className="min-h-svh pt-24 pb-12 flex justify-center items-center w-full bg-linear-to-b from-white to-[#EDFFFA] dark:from-[#141414] dark:to-[#2b2b2b]">
      <SecondaryHeader />
      <LoginForm />
    </main>
  );
}
