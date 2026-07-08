import { apiGet } from "./client";

export interface RecommendationItem {
  id: string;
  title: string;
  department: string | null;
  priority: string;
  description: string;
  estimated_budget: number;
  impact: string;
}

export interface RecommendationListResponse {
  recommendations: RecommendationItem[];
  total: number;
}

export function fetchRecommendations(): Promise<RecommendationListResponse> {
  return apiGet<RecommendationListResponse>("/recommendations/");
}
