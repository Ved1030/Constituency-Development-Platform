"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { transcribeAudio, SpeechAPIError } from "@/services/speech-api";
import type { TranscriptionResult, SpeechProcessingStage, VoiceDebugInfo } from "@/types/speech";

interface UseSpeechRecorderOptions {
  mimeType?: string;
  languageCode?: string;
  onRecordingStart?: () => void;
  onRecordingStop?: (blob: Blob) => void;
  onTranscript?: (result: TranscriptionResult) => void;
  onError?: (error: string, stage: string) => void;
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
  errorStage: string | null;
  currentStage: SpeechProcessingStage;
  debug: VoiceDebugInfo;
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
  const [errorStage, setErrorStage] = useState<string | null>(null);
  const [currentStage, setCurrentStage] = useState<SpeechProcessingStage>("idle");
  const [debug, setDebug] = useState<VoiceDebugInfo>({
    microphonePermission: "prompt",
    selectedMimeType: "",
    isRecording: false,
    recordingTimeSeconds: 0,
    audioBlobSize: 0,
    audioBlobType: "",
    uploadStatus: "idle",
    backendConnected: false,
    sarvamConnected: false,
    detectedLanguage: "",
    confidence: 0,
    transcript: "",
    translation: "",
    errorStage: "",
    lastError: "",
    pipelineStages: [],
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const isSupported =
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof MediaRecorder !== "undefined";

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [audioUrl]);

  const _setStage = (stage: SpeechProcessingStage) => {
    setCurrentStage(stage);
    setDebug((d) => ({ ...d, pipelineStages: [...d.pipelineStages, stage] }));
  };

  const _setError = (msg: string, stage: string) => {
    setError(msg);
    setErrorStage(stage);
    setCurrentStage("error");
    setDebug((d) => ({ ...d, lastError: msg, errorStage: stage }));
    onError?.(msg, stage);
  };

  const startRecording = useCallback(async () => {
    if (!isSupported) {
      _setError(
        "Your browser does not support audio recording. Please use Chrome, Firefox, or Edge.",
        "unsupported",
      );
      return;
    }

    setError(null);
    setErrorStage(null);
    setTranscript(null);
    setDebug((d) => ({
      ...d,
      pipelineStages: [],
      lastError: "",
      errorStage: "",
    }));

    _setStage("requesting_microphone");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      streamRef.current = stream;
      setDebug((d) => ({ ...d, microphonePermission: "granted" }));

      const selectedMime = mimeType || _findBestMimeType();
      setDebug((d) => ({ ...d, selectedMimeType: selectedMime }));

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

        if (audioUrl) URL.revokeObjectURL(audioUrl);

        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setIsRecording(false);
        setDebug((d) => ({
          ...d,
          isRecording: false,
          audioBlobSize: blob.size,
          audioBlobType: blob.type,
        }));
        onRecordingStop?.(blob);

        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;

        await _transcribeBlob(blob);
      };

      recorder.onerror = (e) => {
        const errorEvent = e as MediaRecorderErrorEvent;
        const errorName = errorEvent.error?.name || "Unknown";
        const errorMsg = errorEvent.error?.message || "Recording error occurred";
        _setError(`Recording error (${errorName}): ${errorMsg}`, "recording");
        setIsRecording(false);
      };

      recorder.start(1000);
      setIsRecording(true);
      setRecordingTime(0);
      _setStage("recording");
      setDebug((d) => ({ ...d, isRecording: true, recordingTimeSeconds: 0 }));

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1;
          setDebug((d) => ({ ...d, recordingTimeSeconds: newTime }));
          return newTime;
        });
      }, 1000);

      onRecordingStart?.();
    } catch (err: any) {
      setDebug((d) => ({ ...d, microphonePermission: "denied" }));

      if (err.name === "NotAllowedError") {
        _setError(
          "Microphone permission denied. Please allow microphone access in your browser settings and try again.",
          "microphone_permission",
        );
      } else if (err.name === "NotFoundError") {
        _setError(
          "No microphone found. Please connect a microphone and try again.",
          "no_microphone",
        );
      } else if (err.name === "NotReadableError") {
        _setError(
          "Microphone is being used by another application. Please close other apps using the microphone.",
          "microphone_busy",
        );
      } else if (err.name === "OverconstrainedError") {
        _setError(
          "Microphone does not support the requested settings. Trying with default settings...",
          "constraints",
        );
      } else {
        _setError(
          `Failed to access microphone: ${err.message || err.name || "Unknown error"}`,
          "microphone",
        );
      }
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
    setErrorStage(null);
    setRecordingTime(0);
    setIsProcessing(false);
    setCurrentStage("idle");
    setDebug({
      microphonePermission: "prompt",
      selectedMimeType: "",
      isRecording: false,
      recordingTimeSeconds: 0,
      audioBlobSize: 0,
      audioBlobType: "",
      uploadStatus: "idle",
      backendConnected: false,
      sarvamConnected: false,
      detectedLanguage: "",
      confidence: 0,
      transcript: "",
      translation: "",
      errorStage: "",
      lastError: "",
      pipelineStages: [],
    });
  }, [cancelRecording]);

  const _transcribeBlob = async (blob: Blob) => {
    setIsProcessing(true);
    setError(null);
    setErrorStage(null);

    // Pre-upload validation
    _setStage("validating");
    setDebug((d) => ({ ...d, uploadStatus: "idle" }));

    if (!blob || blob.size === 0) {
      _setError(
        "The recording is empty. No audio was captured.",
        "validation_empty",
      );
      setIsProcessing(false);
      return;
    }

    if (blob.size < 512) {
      _setError(
        "The recording is too short. Please speak for at least 2-3 seconds.",
        "validation_short",
      );
      setIsProcessing(false);
      return;
    }

    // Upload
    _setStage("uploading");
    setDebug((d) => ({ ...d, uploadStatus: "uploading" }));

    try {
      const result = await transcribeAudio(blob, languageCode, recordingTime);
      setDebug((d) => ({ ...d, uploadStatus: "success", backendConnected: true }));
      setTranscript(result);

      if (result.language) {
        setDebug((d) => ({
          ...d,
          detectedLanguage: result.language,
          confidence: result.confidence,
          transcript: result.original_text,
          translation: result.english_translation,
        }));
      }

      onTranscript?.(result);
    } catch (err: any) {
      setDebug((d) => ({ ...d, uploadStatus: "failed" }));

      if (err instanceof SpeechAPIError) {
        setDebug((d) => ({
          ...d,
          backendConnected: err.status !== 0,
          errorStage: err.stage,
          lastError: err.message,
        }));
        _setError(err.userMessage, err.stage);
      } else {
        _setError(
          `Unexpected error: ${err.message || "Unknown error"}`,
          "unknown",
        );
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const retryTranscription = useCallback(async () => {
    if (audioBlob) {
      setDebug((d) => ({ ...d, pipelineStages: [], lastError: "" }));
      await _transcribeBlob(audioBlob);
    }
  }, [audioBlob, languageCode, recordingTime, onTranscript, onError]);

  return {
    isRecording,
    isProcessing,
    isSupported,
    recordingTime,
    audioBlob,
    audioUrl,
    transcript,
    error,
    errorStage,
    currentStage,
    debug,
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

interface MediaRecorderErrorEvent extends Event {
  error: DOMException | null;
}
