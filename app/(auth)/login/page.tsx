"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Zap } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/schemas";
import { useLogin } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const login = useLogin();

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "USER"
    }
  });

  const onSubmit = (data: LoginInput) => login.mutate(data);

  if (!mounted) return null;

  const errorMessage =
    login.error instanceof Error
      ? (login.error as { response?: { data?: { message?: string } } }).response?.data
        ?.message ?? login.error.message
      : null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #7c6fe6, transparent)" }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-15 blur-3xl"
          style={{ background: "radial-gradient(circle, #5b4fcf, transparent)" }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: "linear-gradient(135deg, #7c6fe6, #5b4fcf)" }}>
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
            Welcome back
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
            Sign in to your Task Management account
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border p-8 shadow-2xl"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          {errorMessage && (
            <div className="mb-6 rounded-lg border px-4 py-3 text-sm"
              style={{
                background: "rgba(224, 82, 82, 0.1)",
                borderColor: "rgba(224, 82, 82, 0.3)",
                color: "#f87171",
              }}>
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                style={{ background: "var(--secondary)", borderColor: "var(--border)" }}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs" style={{ color: "#f87171" }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{ background: "var(--secondary)", borderColor: "var(--border)" }}
                  className="pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-100"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs" style={{ color: "#f87171" }}>
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger style={{ background: "var(--secondary)", borderColor: "var(--border)" }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent style={{ background: "var(--popover)", borderColor: "var(--border)" }}>
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={login.isPending}
              className="w-full h-10 font-semibold"
              style={{
                background: "linear-gradient(135deg, #7c6fe6, #5b4fcf)",
                color: "white",
                border: "none",
              }}
            >
              {login.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium transition-colors hover:underline"
              style={{ color: "var(--primary)" }}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
