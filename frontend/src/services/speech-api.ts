/**
 * API client for Speech processing.
 *
 * Communicates with the backend at /api/v1/speech.
 */

import type {
  TranscriptionResult,
  SupportedLanguagesResponse,
  BackgroundClassificationResult,
} from "@/types/speech";

const API_BASE = "/api/v1";

// ─── Transcribe Audio ────────────────────────────────────────────────

export async function transcribeAudio(
  audioBlob: Blob,
  languageCode?: string,
): Promise<TranscriptionResult> {
  const formData = new FormData();
  formData.append("file", audioBlob, `recording.${_getExtFromMime(audioBlob.type)}`);

  if (languageCode) {
    formData.append("language_code", languageCode);
  }

  const res = await fetch(`${API_BASE}/speech/transcribe`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Speech recognition failed" }));
    throw new Error(err.detail || `Transcription failed: ${res.status}`);
  }

  return res.json();
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
