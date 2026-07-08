/**
 * API client for the Complaint feature.
 *
 * Uses the centralized API client — never hardcodes URLs.
 */

import type {
  Complaint,
  ComplaintCreateRequest,
  ComplaintListResponse,
  ComplaintStatsResponse,
  ComplaintSubmitResponse,
} from "@/types/complaint";

import { API_BASE } from "@/services/api/client";

class ComplaintAPIError extends Error {
  status: number;
  detail: unknown;

  constructor(message: string, status: number, detail?: unknown) {
    super(message);
    this.name = "ComplaintAPIError";
    this.status = status;
    this.detail = detail;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new ComplaintAPIError(
      data.message || `Request failed: ${res.status}`,
      res.status,
      data.detail
    );
  }

  return data as T;
}

export async function submitComplaint(
  payload: ComplaintCreateRequest
): Promise<ComplaintSubmitResponse> {
  return request<ComplaintSubmitResponse>("/complaints", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getComplaint(uid: string): Promise<Complaint> {
  return request<Complaint>(`/complaints/${uid}`);
}

export async function listComplaints(params: {
  page?: number;
  page_size?: number;
  status?: string;
  category?: string;
  ward?: string;
  village?: string;
} = {}): Promise<ComplaintListResponse> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.page_size) searchParams.set("page_size", String(params.page_size));
  if (params.status) searchParams.set("status", params.status);
  if (params.category) searchParams.set("category", params.category);
  if (params.ward) searchParams.set("ward", params.ward);
  if (params.village) searchParams.set("village", params.village);

  const query = searchParams.toString();
  return request<ComplaintListResponse>(`/complaints${query ? `?${query}` : ""}`);
}

export async function getComplaintStats(): Promise<ComplaintStatsResponse> {
  return request<ComplaintStatsResponse>("/complaints/stats");
}

export { ComplaintAPIError };
