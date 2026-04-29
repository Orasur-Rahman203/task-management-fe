"use client";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/services/auth-api";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { LoginInput, RegisterInput } from "@/lib/schemas";

export function useLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginInput) => authApi.login(data),
    onSuccess: (res) => {
      const userObj = {
        id: res.userId,
        name: res.name,
        email: res.email,
        role: res.role as "USER" | "ADMIN",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setAuth(userObj, res.accessToken, res.refreshToken);
      toast.success("Signed in successfully!");
      router.push("/dashboard");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Invalid credentials.";
      toast.error(msg);
    }
  });
}

export function useRegister() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: Omit<RegisterInput, "confirmPassword">) =>
      authApi.register(data),
    onSuccess: (res) => {
      toast.success("Account created successfully! Please sign in.");
      router.push("/login");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to create account.";
      toast.error(msg);
    }
  });
}

export function useLogout() {
  const { logout } = useAuthStore();
  const router = useRouter();

  return () => {
    logout();
    toast.info("Logged out successfully.");
    router.push("/login");
  };
}
