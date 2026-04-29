import { apiClient } from "@/lib/api-client";
import type { PaginatedResponse } from "@/lib/schemas";

export interface AuditLog {
  id: string;
  action: string;
  entityType?: string;
  entityId?: string;
  details?: string;
  userId?: string;
  createdAt: string;
}

export interface AuditLogFilters {
  page?: number;
  limit?: number;
}

export const auditLogsApi = {
  getAll: async (filters: AuditLogFilters = {}): Promise<{ data: AuditLog[], total: number }> => {
    const params = new URLSearchParams();
    if (filters.page) params.append("page", String(filters.page));
    if (filters.limit) params.append("limit", String(filters.limit));

    const res = await apiClient.get<AuditLog[] | PaginatedResponse<AuditLog>>(
      `/audit-logs?${params.toString()}`
    );
    if (Array.isArray(res.data)) return { data: res.data, total: res.data.length };
    return { data: res.data.data ?? [], total: res.data.total ?? 0 };
  },
};
