"use client";
import { useState } from "react";
import { CheckSquare, Plus, Search } from "lucide-react";
import { useAllTasks } from "@/hooks/use-tasks";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Task } from "@/lib/schemas";

export default function TasksPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const { createdTasks = [], assignedTasks = [], isLoading } = useAllTasks({ includeAssigned: true });

  const filteredAssignedTasks = assignedTasks.filter((task) => {
    if (statusFilter !== "ALL" && task.status !== statusFilter) return false;
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const filteredCreatedTasks = createdTasks.filter((task) => {
    if (statusFilter !== "ALL" && task.status !== statusFilter) return false;
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CheckSquare className="w-5 h-5" style={{ color: "#7c6fe6" }} />
            <span className="text-sm font-medium" style={{ color: "#7c6fe6" }}>
              My Works
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
            Manage and organize all your work tasks.
          </p>
        </div>

        <Button
          onClick={() => setFormOpen(true)}
          className="shrink-0 font-medium"
          style={{
            background: "linear-gradient(135deg, #7c6fe6, #5b4fcf)",
            color: "white",
            border: "none",
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-9 bg-card border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* <div className="w-full sm:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-card border-border">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="complete">Complete</SelectItem>
              <SelectItem value="cancel">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div> */}
      </div>

      {/* Tasks Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-card border border-border animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-10">
          {/* Assigned to Me Section */}
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">Assigned to Me</h2>
              <p className="text-sm text-muted-foreground">Tasks assigned by others</p>
            </div>
            {filteredAssignedTasks.length === 0 ? (
              <div className="text-center py-12 border rounded-2xl bg-card" style={{ borderColor: 'var(--border)' }}>
                <CheckSquare className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="text-sm text-muted-foreground">No tasks assigned to you</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredAssignedTasks.map((task: Task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>

          {/* Created by Me Section */}
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">Created by Me</h2>
              <p className="text-sm text-muted-foreground">Tasks you created</p>
            </div>
            {filteredCreatedTasks.length === 0 ? (
              <div className="text-center py-12 border rounded-2xl bg-card" style={{ borderColor: 'var(--border)' }}>
                <CheckSquare className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <h3 className="text-sm font-medium mb-1">No tasks created</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery || statusFilter !== "ALL"
                    ? "Try adjusting your search or filters."
                    : "You haven't created any tasks yet."}
                </p>
                {(!searchQuery && statusFilter === "ALL") && (
                  <Button
                    variant="outline"
                    className="border-border text-foreground hover:bg-secondary"
                    onClick={() => setFormOpen(true)}
                  >
                    Create your first task
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredCreatedTasks.map((task: Task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <TaskFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
      />
    </div>
  );
}
