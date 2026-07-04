"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { transcribeAudio } from "@/services/speech-api";
import type { TranscriptionResult } from "@/types/speech";

interface UseSpeechRecorderOptions {
  /** Preferred MIME type for recording */
  mimeType?: string;
  /** Language hint for STT (auto-detect if omitted) */
  languageCode?: string;
  /** Called when recording starts */
  onRecordingStart?: () => void;
  /** Called when recording stops with the audio blob */
  onRecordingStop?: (blob: Blob) => void;
  /** Called when transcription completes */
  onTranscript?: (result: TranscriptionResult) => void;
  /** Called on error */
  onError?: (error: string) => void;
}

interface UseSpeechRecorderReturn {
  isRecording: boolean;
  isProcessing: boolean;
  isSupported: boolean;
  recordingTime: number;
  audioBlob: Blob | null;
  audioUrl: string | null;
  transcript: TranscriptionResult | null;
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  cancelRecording: () => void;
  reset: () => void;
  retryTranscription: () => Promise<void>;
}

export function useSpeechRecorder(
  options: UseSpeechRecorderOptions = {},
): UseSpeechRecorderReturn {
  const {
    mimeType,
    languageCode,
    onRecordingStart,
    onRecordingStop,
    onTranscript,
    onError,
  } = options;

  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<TranscriptionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Check browser support
  const isSupported =
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof MediaRecorder !== "undefined";

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [audioUrl]);

  const startRecording = useCallback(async () => {
    if (!isSupported) {
      const msg = "Your browser does not support audio recording.";
      setError(msg);
      onError?.(msg);
      return;
    }

    setError(null);
    setTranscript(null);

    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      streamRef.current = stream;

      // Find best supported MIME type
      const selectedMime = mimeType || _findBestMimeType();

      const recorder = new MediaRecorder(stream, {
        mimeType: selectedMime,
        audioBitsPerSecond: 128000,
      });

      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: selectedMime });

        // Revoke old URL
        if (audioUrl) URL.revokeObjectURL(audioUrl);

        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setIsRecording(false);
        onRecordingStop?.(blob);

        // Stop all tracks
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;

        // Auto-transcribe
        await _transcribeBlob(blob);
      };

      recorder.onerror = (e) => {
        const msg = "Recording error occurred.";
        setError(msg);
        setIsRecording(false);
        onError?.(msg);
      };

      // Start recording
      recorder.start(1000); // Collect data every 1 second
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      onRecordingStart?.();
    } catch (err: any) {
      let msg = "Failed to start recording.";
      if (err.name === "NotAllowedError") {
        msg = "Microphone permission denied. Please allow microphone access in your browser settings.";
      } else if (err.name === "NotFoundError") {
        msg = "No microphone found. Please connect a microphone and try again.";
      } else if (err.name === "NotReadableError") {
        msg = "Microphone is being used by another application.";
      }
      setError(msg);
      onError?.(msg);
    }
  }, [isSupported, mimeType, languageCode, onRecordingStart, onRecordingStop, onError, audioUrl]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.ondataavailable = null;
      mediaRecorderRef.current.onstop = null;
      if (mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
    setRecordingTime(0);
    chunksRef.current = [];
  }, []);

  const reset = useCallback(() => {
    cancelRecording();
    setAudioBlob(null);
    setAudioUrl(null);
    setTranscript(null);
    setError(null);
    setRecordingTime(0);
    setIsProcessing(false);
  }, [cancelRecording]);

  const _transcribeBlob = async (blob: Blob) => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await transcribeAudio(blob, languageCode);
      setTranscript(result);
      onTranscript?.(result);
    } catch (err: any) {
      const msg = err.message || "Speech recognition failed. Please try again.";
      setError(msg);
      onError?.(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const retryTranscription = useCallback(async () => {
    if (audioBlob) {
      await _transcribeBlob(audioBlob);
    }
  }, [audioBlob, languageCode, onTranscript, onError]);

  return {
    isRecording,
    isProcessing,
    isSupported,
    recordingTime,
    audioBlob,
    audioUrl,
    transcript,
    error,
    startRecording,
    stopRecording,
    cancelRecording,
    reset,
    retryTranscription,
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────

function _findBestMimeType(): string {
  const types = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/ogg",
    "audio/wav",
    "audio/mp4",
  ];
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return "audio/webm";
}
