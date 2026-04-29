import { apiClient } from "@/lib/api-client";
import type { Task, TaskInput, PaginatedResponse } from "@/lib/schemas";

export interface TaskFilters {
  status?: string;
  priority?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const taskApi = {
  getAll: async (filters: TaskFilters = {}): Promise<Task[]> => {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.priority) params.append("priority", filters.priority);
    if (filters.search) params.append("search", filters.search);
    if (filters.page) params.append("page", String(filters.page));
    if (filters.limit) params.append("limit", String(filters.limit));

    const res = await apiClient.get<Task[] | PaginatedResponse<Task>>(
      `/tasks?${params.toString()}`
    );
    // Handle both array and paginated response shapes
    if (Array.isArray(res.data)) return res.data;
    return (res.data as PaginatedResponse<Task>).data ?? [];
  },

  getById: async (id: string): Promise<Task> => {
    const res = await apiClient.get<Task>(`/tasks/${id}`);
    return res.data;
  },

  create: async (data: TaskInput): Promise<Task> => {
    const res = await apiClient.post<Task>("/tasks", data);
    return res.data;
  },

  update: async (id: string, data: Partial<TaskInput>): Promise<Task> => {
    const res = await apiClient.patch<Task>(`/tasks/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },
};
