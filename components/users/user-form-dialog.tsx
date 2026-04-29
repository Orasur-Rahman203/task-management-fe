"use client";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import type { User, UserRole } from "@/lib/schemas";
import { useCreateUser, useUpdateUser } from "@/hooks/use-users";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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

// Custom schema for creating/updating users from the dashboard
const userFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().optional(),
  role: z.enum(["USER", "ADMIN"]),
});

type UserFormInput = z.infer<typeof userFormSchema>;

interface UserFormDialogProps {
  open: boolean;
  onClose: () => void;
  user?: User | null;
}

export function UserFormDialog({ open, onClose, user }: UserFormDialogProps) {
  const isEdit = !!user;
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const isPending = createUser.isPending || updateUser.isPending;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UserFormInput>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "USER",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        password: "", // Don't pre-fill password for editing
        role: user.role,
      });
    } else {
      reset({
        name: "",
        email: "",
        password: "",
        role: "USER",
      });
    }
  }, [user, reset, open]);

  const onSubmit = async (data: UserFormInput) => {
    if (isEdit && user) {
      const payload = { ...data };
      if (!payload.password) delete payload.password; // Don't send empty password

      updateUser.mutate(
        { id: user.id, data: payload },
        { onSuccess: () => { reset(); onClose(); } }
      );
    } else {
      if (!data.password) {
        // Need to add manual error or handle it since optional in schema for editing
        return; 
      }
      createUser.mutate(data as any, {
        onSuccess: () => { reset(); onClose(); },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="sm:max-w-md rounded-2xl"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {isEdit ? "Edit User" : "Create New User"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              placeholder="John Doe"
              style={{ background: "var(--secondary)", borderColor: "var(--border)" }}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs" style={{ color: "#f87171" }}>
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              style={{ background: "var(--secondary)", borderColor: "var(--border)" }}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs" style={{ color: "#f87171" }}>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password">Password {isEdit ? "(leave blank to keep current)" : "*"}</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              style={{ background: "var(--secondary)", borderColor: "var(--border)" }}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs" style={{ color: "#f87171" }}>
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-1.5">
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

          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              style={{
                background: "linear-gradient(135deg, #7c6fe6, #5b4fcf)",
                color: "white",
                border: "none",
              }}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : isEdit ? (
                "Save Changes"
              ) : (
                "Create User"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
