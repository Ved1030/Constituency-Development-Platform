import { apiGet } from "./client";

export interface DashboardSummaryData {
  total_complaints: number;
  open_complaints: number;
  in_progress_complaints: number;
  resolved_complaints: number;
  critical_complaints: number;
  high_priority_complaints: number;
  departments_involved: number;
}

export interface DepartmentPerfItem {
  department: string;
  total: number;
  resolved: number;
  avg_resolution_days: number;
}

export interface DashboardResponse {
  summary: DashboardSummaryData;
  department_performance: DepartmentPerfItem[];
  village_stats: { village: string; total: number; critical_count: number }[];
  recent_activity: { complaint_uid: string; title: string; status: string; severity: string; village: string; created_at: string | null }[];
  severity_breakdown: { severity: string; count: number }[];
}

export function fetchDashboard(constituency?: string): Promise<DashboardResponse> {
  const params: Record<string, string> = {};
  if (constituency) params.constituency = constituency;
  return apiGet<DashboardResponse>("/dashboard/", params);
}

export function fetchDashboardSummary(constituency?: string): Promise<DashboardSummaryData> {
  const params: Record<string, string> = {};
  if (constituency) params.constituency = constituency;
  return apiGet<DashboardSummaryData>("/dashboard/summary", params);
}
