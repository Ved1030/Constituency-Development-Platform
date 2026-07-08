import { apiGet, apiPost } from "./client";
import type {
  Complaint,
  ComplaintListResponse,
  ComplaintStatsResponse,
  ComplaintSubmitResponse,
  ComplaintCreateRequest,
} from "@/types/complaint";

export interface ComplaintListParams {
  page?: number;
  page_size?: number;
  status?: string;
  category?: string;
  ward?: string;
  village?: string;
  constituency?: string;
}

export function fetchComplaints(
  params: ComplaintListParams = {}
): Promise<ComplaintListResponse> {
  const searchParams: Record<string, string> = {};
  if (params.page) searchParams.page = String(params.page);
  if (params.page_size) searchParams.page_size = String(params.page_size);
  if (params.status) searchParams.status = params.status;
  if (params.category) searchParams.category = params.category;
  if (params.ward) searchParams.ward = params.ward;
  if (params.village) searchParams.village = params.village;
  if (params.constituency) searchParams.constituency = params.constituency;
  return apiGet<ComplaintListResponse>("/complaints", searchParams);
}

export function fetchComplaint(uid: string): Promise<Complaint> {
  return apiGet<Complaint>(`/complaints/${uid}`);
}

export function fetchComplaintStats(constituency?: string): Promise<ComplaintStatsResponse> {
  const params: Record<string, string> = {};
  if (constituency) params.constituency = constituency;
  return apiGet<ComplaintStatsResponse>("/complaints/stats", params);
}

export function createComplaint(
  payload: ComplaintCreateRequest
): Promise<ComplaintSubmitResponse> {
  return apiPost<ComplaintSubmitResponse>("/complaints", payload);
}
