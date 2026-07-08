/**
 * Centralized API client.
 *
 * ALL backend requests MUST go through this module.
 * The base URL comes from NEXT_PUBLIC_API_URL — never hardcode a URL.
 */

const REQUEST_TIMEOUT = 30000;

function getBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!envUrl) {
    if (typeof window === "undefined") {
      throw new Error(
        "NEXT_PUBLIC_API_URL is not set. Add it to .env.local or your hosting provider's environment variables."
      );
    }
    return "/api/v1";
  }
  return `${envUrl.replace(/\/+$/, "")}/api/v1`;
}

const API_BASE = getBaseUrl();

export { API_BASE };

export class APIError extends Error {
  status: number;
  detail: unknown;

  constructor(message: string, status: number, detail?: unknown) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.detail = detail;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  retries = 1
): Promise<T> {
  const url = `${API_BASE}${path}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      signal: controller.signal,
      ...options,
    });

    clearTimeout(timeoutId);

    const data = await res.json();

    if (!res.ok) {
      throw new APIError(
        data.message || `Request failed: ${res.status}`,
        res.status,
        data.detail
      );
    }

    return data as T;
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    if (err instanceof APIError) throw err;

    if (retries > 0) {
      return request<T>(path, options, retries - 1);
    }

    if (err instanceof DOMException && err.name === "AbortError") {
      throw new APIError(
        "Request timed out. Please try again.",
        408,
        { timeout: REQUEST_TIMEOUT }
      );
    }

    const message =
      err instanceof Error ? err.message : "An unexpected network error occurred";
    throw new APIError(message, 0, { originalError: message });
  }
}

export async function apiGet<T>(
  path: string,
  params?: Record<string, string>
): Promise<T> {
  const search = params ? "?" + new URLSearchParams(params).toString() : "";
  return request<T>(`${path}${search}`);
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function apiPut<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, {
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function apiDelete<T>(path: string): Promise<T> {
  return request<T>(path, {
    method: "DELETE",
  });
}
