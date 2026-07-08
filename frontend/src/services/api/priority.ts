import { apiGet } from "./client";

export interface PriorityItem {
  rank: number;
  title: string;
  category: string;
  severity: string;
  score: number;
  affected_citizens: number;
  village: string;
  ai_confidence: number;
  reason: string;
  complaint_uid: string;
}

export interface PriorityEngineResponse {
  priorities: PriorityItem[];
  last_updated: string;
}

export function fetchPriorities(): Promise<PriorityEngineResponse> {
  return apiGet<PriorityEngineResponse>("/priority/");
}
