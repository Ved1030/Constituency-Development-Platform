/**
 * API client for Speech processing.
 *
 * Uses the centralized API client — never hardcodes URLs.
 * Parses structured error responses (stage, message, details, suggestion).
 */

import type {
  TranscriptionResult,
  SupportedLanguagesResponse,
  BackgroundClassificationResult,
} from "@/types/speech";

import { API_BASE } from "@/services/api/client";

// ─── Structured API Error ─────────────────────────────────────────────

export class SpeechAPIError extends Error {
  stage: string;
  details?: string;
  suggestion?: string;
  status: number;

  constructor(params: {
    stage: string;
    message: string;
    details?: string;
    suggestion?: string;
    status: number;
  }) {
    super(params.message);
    this.name = "SpeechAPIError";
    this.stage = params.stage;
    this.details = params.details;
    this.suggestion = params.suggestion;
    this.status = params.status;
  }

  get userMessage(): string {
    let msg = this.message;
    if (this.suggestion) {
      msg += ` ${this.suggestion}`;
    }
    return msg;
  }
}

// ─── Transcribe Audio ────────────────────────────────────────────────

export async function transcribeAudio(
  audioBlob: Blob,
  languageCode?: string,
  durationSeconds?: number,
): Promise<TranscriptionResult> {
  if (!audioBlob || audioBlob.size === 0) {
    throw new SpeechAPIError({
      stage: "validation",
      message: "The recorded audio is empty.",
      suggestion: "Please try recording again.",
      status: 400,
    });
  }

  if (audioBlob.size < 512) {
    throw new SpeechAPIError({
      stage: "validation",
      message: "The recording is too short to transcribe.",
      suggestion: "Please speak for at least 2-3 seconds.",
      status: 400,
    });
  }

  const formData = new FormData();
  const ext = _getExtFromMime(audioBlob.type);
  formData.append("file", audioBlob, `voice_${Date.now()}.${ext}`);

  if (languageCode) {
    formData.append("language_code", languageCode);
  }
  if (durationSeconds !== undefined) {
    formData.append("speech_duration", String(durationSeconds));
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/speech/transcribe`, {
      method: "POST",
      body: formData,
    });
  } catch (err: any) {
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      throw new SpeechAPIError({
        stage: "network",
        message: "Cannot connect to the server.",
        suggestion: "Check that the backend is running and NEXT_PUBLIC_API_URL is set.",
        status: 0,
      });
    }
    throw new SpeechAPIError({
      stage: "network",
      message: `Network error: ${err.message}`,
      status: 0,
    });
  }

  let body: any;
  try {
    body = await res.json();
  } catch {
    throw new SpeechAPIError({
      stage: "response",
      message: `Server returned invalid JSON (HTTP ${res.status}).`,
      status: res.status,
    });
  }

  if (!res.ok) {
    throw new SpeechAPIError({
      stage: body.stage || "server",
      message: body.message || body.detail || `Server error (HTTP ${res.status})`,
      details: body.details,
      suggestion: body.suggestion,
      status: res.status,
    });
  }

  if (body.success === false) {
    throw new SpeechAPIError({
      stage: body.stage || body.error_stage || "unknown",
      message: body.message || body.error || "Speech processing failed",
      details: body.details,
      status: 200,
    });
  }

  return body as TranscriptionResult;
}

// ─── Background Classification ───────────────────────────────────────

export async function classifyComplaintBackground(params: {
  title: string;
  description: string;
  category?: string;
  original_language?: string;
  english_translation?: string;
}): Promise<BackgroundClassificationResult> {
  const res = await fetch(`${API_BASE}/speech/classify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Classification failed" }));
    throw new Error(err.detail || `Classification failed: ${res.status}`);
  }

  return res.json();
}

// ─── Supported Languages ─────────────────────────────────────────────

export async function getSupportedLanguages(): Promise<SupportedLanguagesResponse> {
  const res = await fetch(`${API_BASE}/speech/languages`);
  if (!res.ok) {
    throw new Error(`Failed to fetch languages: ${res.status}`);
  }
  return res.json();
}

// ─── Health Check ────────────────────────────────────────────────────

export async function checkSpeechHealth(): Promise<{
  sarvam_api_key_configured: boolean;
  sarvam_base_url: string;
  timeout: number;
}> {
  const res = await fetch(`${API_BASE}/speech/health`);
  if (!res.ok) {
    throw new Error(`Speech health check failed: ${res.status}`);
  }
  return res.json();
}

// ─── Helpers ─────────────────────────────────────────────────────────

function _getExtFromMime(mimeType: string): string {
  const map: Record<string, string> = {
    "audio/webm": "webm",
    "video/webm": "webm",
    "audio/wav": "wav",
    "audio/x-wav": "wav",
    "audio/mp3": "mp3",
    "audio/mpeg": "mp3",
    "audio/ogg": "ogg",
  };
  return map[mimeType] || "webm";
}
