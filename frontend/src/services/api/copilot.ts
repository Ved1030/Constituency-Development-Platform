import { apiGet, apiPost } from "./client";

export interface CopilotResponse {
  message: string;
  data: Record<string, unknown>;
}

export interface CopilotQueryResponse {
  answer: string;
  data: Record<string, unknown>;
}

export function fetchCopilotContext(): Promise<CopilotResponse> {
  return apiGet<CopilotResponse>("/copilot/context");
}

export function sendCopilotQuery(query: string): Promise<CopilotQueryResponse> {
  return apiPost<CopilotQueryResponse>("/copilot/query", { query });
}
