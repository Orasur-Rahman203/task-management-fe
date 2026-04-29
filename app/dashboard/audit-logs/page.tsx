"use client";
import { ScrollText, Activity } from "lucide-react";
import { useAuditLogs } from "@/hooks/use-audit-logs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AuditLog } from "@/services/audit-logs-api";

export default function AuditLogsPage() {
  const { data, isLoading } = useAuditLogs({ page: 1, limit: 50 });
  const logs = data?.data || [];

  const getActionColor = (action: string) => {
    if (action.includes("CREATE")) return "success";
    if (action.includes("UPDATE")) return "info";
    if (action.includes("DELETE")) return "destructive";
    if (action.includes("LOGIN") || action.includes("SIGNIN")) return "default";
    return "secondary";
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ScrollText className="w-5 h-5" style={{ color: "#7c6fe6" }} />
            <span className="text-sm font-medium" style={{ color: "#7c6fe6" }}>
              System Logs
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
            Tracking all activities in the system.
          </p>
        </div>
      </div>

      {/* Content */}
      <Card className="border overflow-hidden" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase border-b bg-black/20" style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
              <tr>
                <th className="px-6 py-4 font-medium">Timestamp</th>
                <th className="px-6 py-4 font-medium">Action</th>
                <th className="px-6 py-4 font-medium">Entity Type</th>
                <th className="px-6 py-4 font-medium">User ID</th>
                <th className="px-6 py-4 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y relative">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    <div className="flex justify-center items-center gap-2">
                       <span className="animate-pulse">Loading logs...</span>
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    <Activity className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    No audit logs available.
                  </td>
                </tr>
              ) : (
                logs.map((log: AuditLog) => (
                  <tr key={log.id} className="transition-colors hover:bg-white/5">
                    <td className="px-6 py-4 font-medium" style={{ color: "var(--muted-foreground)" }}>
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getActionColor(log.action) as any} className="px-2 py-0.5 text-[10px]">
                        {log.action}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {log.entityType || "-"}
                    </td>
                    <td className="px-6 py-4" style={{ fontFamily: "monospace", fontSize: "12px", color: "var(--muted-foreground)" }}>
                      {log.userId || "System"}
                    </td>
                    <td className="px-6 py-4 text-xs" style={{ color: "var(--muted-foreground)", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {log.details ? (typeof log.details === "object" ? JSON.stringify(log.details) : String(log.details)) : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
