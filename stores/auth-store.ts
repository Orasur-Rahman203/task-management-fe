import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import type { User } from "@/lib/schemas";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string, refreshToken?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: Cookies.get("access_token") || null,
      isAuthenticated: !!Cookies.get("access_token"),

      setAuth: (user, token, refreshToken) => {
        Cookies.set("access_token", token, { expires: 1 });
        if (refreshToken) Cookies.set("refresh_token", refreshToken, { expires: 7 });
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
