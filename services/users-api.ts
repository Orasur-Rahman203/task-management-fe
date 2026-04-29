import { apiClient } from "@/lib/api-client";
import type { User, PaginatedResponse, RegisterInput } from "@/lib/schemas";

export interface UserFilters {
  page?: number;
  limit?: number;
}

export const usersApi = {
  getAll: async (filters: UserFilters = {}): Promise<{ data: User[], total: number }> => {
    const params = new URLSearchParams();
    if (filters.page) params.append("page", String(filters.page));
    if (filters.limit) params.append("limit", String(filters.limit));

    const res = await apiClient.get<User[] | PaginatedResponse<User>>(
      `/users?${params.toString()}`
    );
    if (Array.isArray(res.data)) return { data: res.data, total: res.data.length };
    return { data: res.data.data ?? [], total: res.data.total ?? 0 };
  },

  getById: async (id: string): Promise<User> => {
    const res = await apiClient.get<User>(`/users/${id}`);
    return res.data;
  },

  create: async (data: Omit<RegisterInput, "confirmPassword">): Promise<User> => {
    const res = await apiClient.post<User>("/users", data);
    return res.data;
  },

  update: async (id: string, data: Partial<Omit<RegisterInput, "confirmPassword">>): Promise<User> => {
    const res = await apiClient.patch<User>(`/users/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};
