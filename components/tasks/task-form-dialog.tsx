"use client";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { taskSchema, type TaskInput, type Task } from "@/lib/schemas";
import { useCreateTask, useUpdateTask } from "@/hooks/use-tasks";
import { useUsers } from "@/hooks/use-users";
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

interface TaskFormDialogProps {
  open: boolean;
  onClose: () => void;
  task?: Task | null;
}

export function TaskFormDialog({ open, onClose, task }: TaskFormDialogProps) {
  const isEdit = !!task;
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const isPending = createTask.isPending || updateTask.isPending;
  const { data: usersData, isLoading: isLoadingUsers } = useUsers();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TaskInput>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "OPEN",
      priority: "MEDIUM",
      assignId: "",
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description ?? "",
        status: task.status,
        priority: task.priority,
        assignId: task.assignId || "",
      });
    } else {
      reset({
        title: "",
        description: "",
        status: "OPEN",
        priority: "MEDIUM",
        assignId: "",
      });
    }
  }, [task, reset, open]);

  const onSubmit = async (data: TaskInput) => {
    const payload = {
      ...data,
      assignId: data.assignId === "unassigned" || !data.assignId ? undefined : data.assignId,
    };

    if (isEdit && task) {
      updateTask.mutate(
        { id: task.id, data: payload },
        { onSuccess: () => { reset(); onClose(); } }
      );
    } else {
      createTask.mutate(payload, {
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
            {isEdit ? "Edit Task" : "Create New Task"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Task title…"
              style={{ background: "var(--secondary)", borderColor: "var(--border)" }}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs" style={{ color: "#f87171" }}>
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              placeholder="Add a description…"
              rows={3}
              className="flex w-full rounded-md border px-3 py-2 text-sm shadow-sm resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              style={{
                background: "var(--secondary)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
              {...register("description")}
            />
          </div>

          {/* Status + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger style={{ background: "var(--secondary)", borderColor: "var(--border)" }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent style={{ background: "var(--popover)", borderColor: "var(--border)" }}>
                      <SelectItem value="OPEN">OPEN</SelectItem>
                      <SelectItem value="IN_PROGRESS">IN_PROGRESS</SelectItem>
                      <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                      <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger style={{ background: "var(--secondary)", borderColor: "var(--border)" }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent style={{ background: "var(--popover)", borderColor: "var(--border)" }}>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Assignee */}
          <div className="space-y-1.5">
            <Label>Assignee</Label>
            <Controller
              name="assignId"
              control={control}
              render={({ field }) => (
                <Select value={field.value || "unassigned"} onValueChange={(val) => field.onChange(val === "unassigned" ? "" : val)}>
                  <SelectTrigger style={{ background: "var(--secondary)", borderColor: "var(--border)" }}>
                    <SelectValue placeholder="Assign a user..." />
                  </SelectTrigger>
                  <SelectContent style={{ background: "var(--popover)", borderColor: "var(--border)", maxHeight: "200px" }}>
                    <SelectItem value="unassigned" className="text-muted-foreground italic">Unassigned</SelectItem>
                    {usersData?.data?.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name}
                      </SelectItem>
                    ))}
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
                "Create Task"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
