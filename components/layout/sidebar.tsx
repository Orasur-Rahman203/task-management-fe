"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  LogOut,
  Zap,
  User,
  Users,
  ScrollText,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useLogout } from "@/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/tasks", label: "My Tasks", icon: CheckSquare },
  { href: "/dashboard/users", label: "Users", icon: Users },
  { href: "/dashboard/audit-logs", label: "Audit Logs", icon: ScrollText },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const logout = useLogout();

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  return (
    <aside
      className="fixed left-0 top-0 h-full w-64 flex flex-col border-r z-30"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b" style={{ borderColor: "var(--border)" }}>
        <div
          className="flex items-center justify-center w-9 h-9 rounded-xl"
          style={{ background: "linear-gradient(135deg, #7c6fe6, #5b4fcf)" }}
        >
          <Zap className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight">Task Management</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          // Hide admin-only links from regular users
          if (href === "/dashboard/audit-logs" && user?.role !== "ADMIN") {
            return null;
          }

          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "text-white"
                  : "hover:bg-white/5"
              )}
              style={
                isActive
                  ? { background: "linear-gradient(135deg, rgba(124,111,230,0.25), rgba(91,79,207,0.15))", color: "#a89af0" }
                  : { color: "var(--muted-foreground)" }
              }
            >
              <Icon
                className={cn("w-4 h-4 shrink-0 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")}
              />
              {label}
              {isActive && (
                <ChevronRight className="w-3.5 h-3.5 ml-auto" style={{ color: "#7c6fe6" }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t" style={{ borderColor: "var(--border)" }}>
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-2"
          style={{ background: "var(--secondary)" }}
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback
              className="text-xs font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #7c6fe6, #5b4fcf)" }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs truncate" style={{ color: "var(--muted-foreground)" }}>
              {user?.email}
            </p>
          </div>
          <User className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--muted-foreground)" }} />
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-red-500/10"
          style={{ color: "var(--muted-foreground)" }}
        >
          <LogOut className="w-4 h-4" style={{ color: "#e05252" }} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
