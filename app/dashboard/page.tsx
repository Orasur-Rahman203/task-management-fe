"use client";
import { CheckSquare, Clock, ListTodo, TrendingUp, Zap } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";
import { useAuthStore } from "@/stores/auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Task } from "@/lib/schemas";

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  gradient,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  gradient: string;
}) {
  return (
    <Card className="relative overflow-hidden border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10"
        style={{ background: gradient }}
      />
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-lg"
            style={{ background: gradient + "30" }}
          >
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          <CardTitle className="text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>
            {label}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

function RecentTaskItem({ task }: { task: Task }) {
  const priorityColors: Record<string, string> = {
    "HIGH": "destructive",
    "MEDIUM": "warning",
    "LOW": "info",
  };
  const statusLabels: Record<string, string> = {
    "pending": "Pending",
    "in-progress": "In Progress",
    "complete": "Complete",
    "cancel": "Cancelled",
  };

  return (
    <div
      className="flex items-center justify-between p-3 rounded-lg border transition-colors hover:bg-white/5"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-2 h-2 rounded-full shrink-0"
          style={{
            background:
              task.status === "COMPLETED"
                ? "#22c55e"
                : task.status === "IN_PROGRESS"
                  ? "#7c6fe6"
                  : task.status === "CANCELLED"
                    ? "#e05252"
                    : "var(--muted-foreground)",
          }}
        />
        <span className="text-sm font-medium truncate">{task.title}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-3">
        <Badge variant={priorityColors[task.priority] as "destructive" | "warning" | "info"} className="text-xs">
          {task.priority}
        </Badge>
        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          {statusLabels[task.status]}
        </span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: tasks = [], isLoading } = useTasks();

  const todo = tasks.filter((t) => t.status === "OPEN").length;
  const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const done = tasks.filter((t) => t.status === "COMPLETED").length;
  const total = tasks.length;

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-5 h-5" style={{ color: "#7c6fe6" }} />
          <span className="text-sm font-medium" style={{ color: "#7c6fe6" }}>
            Overview
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          Good day, {user?.name?.split(" ")[0] ?? "there"} 👋
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
          Here&apos;s what&apos;s happening with your tasks today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={ListTodo}
          label="Total Tasks"
          value={total}
          color="#7c6fe6"
          gradient="linear-gradient(135deg, #7c6fe6, #5b4fcf)"
        />
        <StatCard
          icon={Clock}
          label="OPEN"
          value={todo}
          color="#f59e0b"
          gradient="linear-gradient(135deg, #f59e0b, #d97706)"
        />
        <StatCard
          icon={TrendingUp}
          label="In Progress"
          value={inProgress}
          color="#3b82f6"
          gradient="linear-gradient(135deg, #3b82f6, #2563eb)"
        />
        <StatCard
          icon={CheckSquare}
          label="COMPLETED"
          value={done}
          color="#22c55e"
          gradient="linear-gradient(135deg, #22c55e, #16a34a)"
        />
      </div>

      {/* Progress + Recent */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Completion rate */}
        <Card className="border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <CardHeader>
            <CardTitle className="text-base">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 mb-4">
              <span className="text-5xl font-bold">{completionRate}</span>
              <span className="text-2xl mb-1" style={{ color: "var(--muted-foreground)" }}>%</span>
            </div>
            <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "var(--secondary)" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${completionRate}%`,
                  background: "linear-gradient(90deg, #7c6fe6, #22c55e)",
                }}
              />
            </div>
            <p className="mt-3 text-xs" style={{ color: "var(--muted-foreground)" }}>
              {done} of {total} tasks completed
            </p>
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card className="xl:col-span-2 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <CardHeader>
            <CardTitle className="text-base">Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 rounded-lg animate-pulse"
                    style={{ background: "var(--secondary)" }}
                  />
                ))}
              </div>
            ) : recentTasks.length === 0 ? (
              <div className="text-center py-8" style={{ color: "var(--muted-foreground)" }}>
                <CheckSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No tasks yet. Create your first task!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentTasks.map((task) => (
                  <RecentTaskItem key={task.id} task={task} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
