/**
 * Speech processing types for the Multilingual Smart Complaint Input System.
 */

export interface TranscriptionResult {
  success: boolean;
  language: string;
  language_code: string;
  confidence: number;
  original_text: string;
  english_translation: string;
  speech_duration_seconds: number;
  error?: string;
}

export interface SupportedLanguage {
  code: string;
  name: string;
  native_name: string;
}

export interface SupportedLanguagesResponse {
  languages: SupportedLanguage[];
}

export interface BackgroundClassificationResult {
  success: boolean;
  detected_category: string | null;
  detected_department: string | null;
  detected_sector: string | null;
  severity: string;
  priority_score: number;
  confidence: number;
  keywords: string[];
  estimated_resolution_days: number;
  error?: string;
}

export interface SpeechTranscribeRequest {
  language_code?: string;
  audio_format?: string;
}

export interface VoiceNoteData {
  id: string;
  audioBlob: Blob;
  audioUrl: string;
  transcript: string;
  language: string;
  languageCode: string;
  confidence: number;
  englishTranslation: string;
  durationSeconds: number;
  isRecording: boolean;
  isProcessing: boolean;
}

export interface ComplaintMultilingualData {
  original_language: string;
  original_language_code: string;
  original_text: string;
  english_translation: string;
  final_edited_text: string;
}
