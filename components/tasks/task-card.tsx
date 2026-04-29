"use client";
import { useState } from "react";
import { Calendar, MoreVertical, Pencil, Trash2, AlertCircle, Clock2, CheckCircle2, Atom, User2 } from "lucide-react";
import type { Task } from "@/lib/schemas";
import { useDeleteTask } from "@/hooks/use-tasks";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TaskFormDialog } from "./task-form-dialog";

const statusConfig = {
  "OPEN": {
    label: "OPEN",
    icon: AlertCircle,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
  },
  "IN_PROGRESS": {
    label: "IN_PROGRESS",
    icon: Clock2,
    color: "#7c6fe6",
    bg: "rgba(124,111,230,0.12)",
  },
  "COMPLETED": {
    label: "COMPLETED",
    icon: CheckCircle2,
    color: "#22c55e",
    bg: "rgba(34,197,94,0.12)",
  },
  "CANCELLED": {
    label: "CANCELLED",
    icon: Trash2,
    color: "#e05252",
    bg: "rgba(224,82,82,0.12)",
  },
};

const priorityConfig: Record<string, { variant: "destructive" | "warning" | "info" | "outline" }> = {
  HIGH: { variant: "destructive" },
  MEDIUM: { variant: "warning" },
  LOW: { variant: "info" },
};

// Date removed

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const deleteTask = useDeleteTask();
  const status = statusConfig[task.status] || {
    label: task.status,
    icon: AlertCircle,
    color: "var(--muted-foreground)",
    bg: "rgba(255,255,255,0.1)",
  };
  const StatusIcon = status.icon;

  return (
    <>
      <div
        className="group relative rounded-xl border p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
        style={{
          background: "var(--card)",
          borderColor: "var(--border)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        }}
      >
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="flex items-center gap-1.5 shrink-0 px-2 py-1 rounded-md text-xs font-medium"
              style={{ background: status.bg, color: status.color }}
            >
              <StatusIcon className="w-3 h-3" />
              {status.label}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all hover:bg-white/10"
                style={{ color: "var(--muted-foreground)" }}
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-36"
              style={{ background: "var(--popover)", borderColor: "var(--border)" }}
            >
              <DropdownMenuItem
                onClick={() => setEditOpen(true)}
                className="flex items-center gap-2 cursor-pointer text-sm"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator style={{ background: "var(--border)" }} />
              <DropdownMenuItem
                onClick={() => deleteTask.mutate(task.id)}
                className="flex items-center gap-2 cursor-pointer text-sm text-red-400 focus:text-red-400 focus:bg-red-500/10"
                disabled={deleteTask.isPending}
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Title */}
        <h3
          className="font-semibold text-sm leading-snug mb-1.5 line-clamp-2"
          style={{
            color: task.status === "COMPLETED" ? "var(--muted-foreground)" : "var(--foreground)",
            textDecoration: task.status === "COMPLETED" ? "line-through" : "none",
          }}
        >
          {task.title}
        </h3>

        {/* Description */}
        {task.description && (
          <p
            className="text-xs leading-relaxed line-clamp-2 mb-3"
            style={{ color: "var(--muted-foreground)" }}
          >
            {task.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
          <Badge variant={priorityConfig[task.priority]?.variant ?? "outline"} className="text-xs">
            {task.priority}
          </Badge>

          {task.assignee && (
            <div
              className="flex items-center gap-1.5 text-xs border rounded-full px-2 py-0.5"
              style={{ color: "var(--muted-foreground)", borderColor: "var(--border)" }}
            >
              <User2 className="w-3 h-3" />
              {task.assignee.name}
            </div>
          )}
        </div>
      </div>

      <TaskFormDialog open={editOpen} onClose={() => setEditOpen(false)} task={task} />
    </>
  );
}
