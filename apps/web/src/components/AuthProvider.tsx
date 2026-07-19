"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const restoreFromStorage = useAuthStore((s) => s.restoreFromStorage);

  useEffect(() => {
    restoreFromStorage();
  }, [restoreFromStorage]);

  return <>{children}</>;
}
