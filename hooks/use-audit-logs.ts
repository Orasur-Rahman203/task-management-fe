"use client";
import { useQuery } from "@tanstack/react-query";
import { auditLogsApi } from "@/services/audit-logs-api";
import type { AuditLogFilters } from "@/services/audit-logs-api";

export const AUDIT_LOGS_KEY = "audit-logs";

export function useAuditLogs(filters: AuditLogFilters = {}) {
  return useQuery({
    queryKey: [AUDIT_LOGS_KEY, filters],
    queryFn: () => auditLogsApi.getAll(filters),
    staleTime: 30_000,
  });
}
