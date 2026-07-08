import { apiGet } from "./client";

export interface TrendPoint {
  date: string;
  count: number;
}

export interface DeptBreakdownItem {
  department: string;
  total: number;
  resolved: number;
  resolution_rate: number;
}

export interface AnalyticsResponse {
  complaint_trends: TrendPoint[];
  department_breakdown: DeptBreakdownItem[];
  village_breakdown: { village: string; total: number; critical: number }[];
  severity_distribution: { severity: string; count: number; percentage: number }[];
  resolution_time_avg: { department: string; avg_days: number; count: number }[];
  category_distribution: { category: string; count: number; percentage: number }[];
}

export function fetchAnalytics(days = 30, constituency?: string): Promise<AnalyticsResponse> {
  const params: Record<string, string> = { days: String(days) };
  if (constituency) params.constituency = constituency;
  return apiGet<AnalyticsResponse>("/analytics/", params);
}

export function fetchAnalyticsTrends(days = 30, constituency?: string): Promise<TrendPoint[]> {
  const params: Record<string, string> = { days: String(days) };
  if (constituency) params.constituency = constituency;
  return apiGet<TrendPoint[]>("/analytics/trends", params);
}

export function fetchDepartmentAnalytics(constituency?: string): Promise<DeptBreakdownItem[]> {
  const params: Record<string, string> = {};
  if (constituency) params.constituency = constituency;
  return apiGet<DeptBreakdownItem[]>("/analytics/departments", params);
}
