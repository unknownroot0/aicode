import { create } from "zustand";
import { authAPI } from "../lib/services";
import { User } from "../types";
import { useCartStore } from "./cartStore";

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  _restored: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  restoreFromStorage: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  _restored: false,
  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    }
  },
  logout: async () => {
    await authAPI.logout().catch(() => undefined);
    set({ user: null, isAuthenticated: false, _restored: false });
    useCartStore.getState().clearCart();
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  restoreFromStorage: async () => {
  if (get()._restored) return;

  set({ _restored: true, isLoading: true });

  try {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("user");

    if (!stored) {
      set({ isLoading: false });
      return;
    }

    set({
      user: JSON.parse(stored),
      isAuthenticated: true,
    });

    const user = await authAPI.getMe();

    set({
      user,
      isAuthenticated: true,
      isLoading: false,
    });

    localStorage.setItem("user", JSON.stringify(user));
  } catch {
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }
},
}));
