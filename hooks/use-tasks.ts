"use client";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useQueries,
} from "@tanstack/react-query";
import { taskApi } from "@/services/task-api";
import type { TaskInput, Task } from "@/lib/schemas";
import type { TaskFilters } from "@/services/task-api";

export const TASKS_KEY = "tasks";
export const ASSIGNED_TASKS_KEY = "assigned-tasks";

export function useTasks(filters: TaskFilters = {}) {
  return useQuery({
    queryKey: [TASKS_KEY, filters],
    queryFn: () => taskApi.getAll(filters),
    staleTime: 30_000,
  });
}

export function useAllTasks(filters: TaskFilters = {}) {
  const results = useQueries({
    queries: [
      {
        queryKey: [TASKS_KEY, filters],
        queryFn: () => taskApi.getAll(filters),
        staleTime: 30_000,
      },
      {
        queryKey: [ASSIGNED_TASKS_KEY, filters],
        queryFn: () => taskApi.getAssigned(filters),
        staleTime: 30_000,
      },
    ],
  });

  const createdTasks = results[0].data ?? [];
  const assignedTasks = results[1].data ?? [];
  const isLoading = results[0].isLoading || results[1].isLoading;
  const error = results[0].error || results[1].error;

  return {
    createdTasks,
    assignedTasks,
    isLoading,
    error,
  };
}

export function useTask(id: string) {
  return useQuery({
    queryKey: [TASKS_KEY, id],
    queryFn: () => taskApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TaskInput) => taskApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TaskInput> }) =>
      taskApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => taskApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] });
    },
  });
}
