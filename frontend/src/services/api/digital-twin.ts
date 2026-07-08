import { apiGet } from "./client";

export interface MarkerItem {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  priority: string;
  severity: string;
  status: string;
  department: string | null;
  village: string | null;
  ward: string | null;
  aiConfidence: number;
  reportedAt: string | null;
  images?: string[];
  citizenName?: string | null;
}

export interface HeatmapPoint {
  lat: number;
  lng: number;
  weight: number;
}

export interface DigitalTwinResponse {
  markers: MarkerItem[];
  heatmap: HeatmapPoint[];
  department_stats: { department: string; count: number; critical: number }[];
  village_stats: { village: string; count: number; critical: number }[];
}

export function fetchDigitalTwin(constituency?: string): Promise<DigitalTwinResponse> {
  const params: Record<string, string> = {};
  if (constituency) params.constituency = constituency;
  return apiGet<DigitalTwinResponse>("/digital-twin/", params);
}

export function fetchDigitalTwinComplaintDetail(uid: string): Promise<Record<string, unknown>> {
  return apiGet<Record<string, unknown>>(`/digital-twin/complaints/${uid}`);
}
