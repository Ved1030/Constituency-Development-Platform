"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Square,
  Loader,
  AlertTriangle,
  Languages,
  Clock,
  BarChart3,
  RefreshCw,
  Pencil,
  ArrowRight,
  Settings,
  ChevronDown,
  ChevronUp,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSpeechRecorder } from "@/hooks/use-speech-recorder";
import { VoiceDebugPanel } from "@/components/citizen/VoiceDebugPanel";

interface VoiceRecorderCardProps {
  onTranscript?: (text: string) => void;
  onMultilingualData?: (data: {
    originalLanguage: string;
    languageCode: string;
    originalText: string;
    englishTranslation: string;
  }) => void;
}

const stageMessages: Record<string, string> = {
  requesting_microphone: "Requesting microphone permission...",
  recording: "Recording your voice...",
  validating: "Validating recording...",
  uploading: "Uploading audio to server...",
  stt: "Converting speech to text...",
  detecting_language: "Detecting spoken language...",
  translating: "Translating to English...",
  done: "Done!",
};

export function VoiceRecorderCard({ onTranscript, onMultilingualData }: VoiceRecorderCardProps) {
  const [editedText, setEditedText] = useState("");
  const [hasEdited, setHasEdited] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  const {
    isRecording,
    isProcessing,
    isSupported,
    recordingTime,
    audioUrl,
    transcript,
    error,
    errorStage,
    currentStage,
    debug,
    startRecording,
    stopRecording,
    reset,
    retryTranscription,
  } = useSpeechRecorder({
    onTranscript: (result) => {
      // ALWAYS bind to original_text — citizen sees and edits in their own language
      setEditedText(result.original_text);
      setHasEdited(false);
      onTranscript?.(result.original_text);
      onMultilingualData?.({
        originalLanguage: result.language,
        languageCode: result.language_code,
        originalText: result.original_text,
        englishTranslation: result.english_translation,
      });
    },
  });

  // Browser doesn't support recording
  if (!isSupported) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-amber-500/10 mb-4">
          <MicOff className="size-8 text-amber-500" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">Voice Not Available</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Your browser does not support audio recording. Please type your complaint instead.
        </p>
      </div>
    );
  }

  // Recording in progress
  if (isRecording) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={stopRecording}
          className="relative mx-auto flex size-20 items-center justify-center rounded-full bg-destructive/10 text-destructive shadow-lg shadow-destructive/20"
        >
          <Square className="size-8" />
          <span className="absolute -top-1 -right-1 flex size-4">
            <span className="absolute inset-0 animate-ping rounded-full bg-destructive opacity-75" />
            <span className="relative size-4 rounded-full bg-destructive" />
          </span>
        </motion.button>

        <h3 className="mt-4 text-sm font-semibold text-foreground">Recording...</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Speak clearly in any language. Tap Stop when done.
        </p>

        <div className="mt-3 flex items-center justify-center gap-2 text-sm font-mono text-destructive">
          <Clock className="size-3.5" />
          {formatTime(recordingTime)}
        </div>

        <div className="mt-4 flex items-center justify-center gap-0.5">
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ height: [4, 12 + Math.random() * 20, 4] }}
              transition={{ duration: 0.4 + Math.random() * 0.4, repeat: Infinity, delay: i * 0.03 }}
              className="w-1 rounded-full bg-destructive"
            />
          ))}
        </div>
      </div>
    );
  }

  // Processing (uploading + transcribing)
  if (isProcessing) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
          <Loader className="size-8 text-primary animate-spin" />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-foreground">
          {stageMessages[currentStage] || "Processing..."}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {currentStage === "uploading" && "Sending audio to server..."}
          {currentStage === "stt" && "Converting speech to text via Sarvam AI..."}
          {currentStage === "detecting_language" && "Identifying the spoken language..."}
          {currentStage === "translating" && "Translating to English..."}
          {!["uploading", "stt", "detecting_language", "translating"].includes(currentStage) &&
            "Processing your voice recording..."}
        </p>

        {/* Progress stages */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {["uploading", "stt", "detecting_language", "translating"].map((stage, i) => {
            const stageIndex = ["uploading", "stt", "detecting_language", "translating"].indexOf(currentStage);
            const isPast = i < stageIndex;
            const isCurrent = i === stageIndex;
            return (
              <div key={stage} className="flex items-center gap-2">
                <div
                  className={cn(
                    "size-2 rounded-full transition-colors",
                    isPast ? "bg-primary" : isCurrent ? "bg-primary animate-pulse" : "bg-muted",
                  )}
                />
                {i < 3 && (
                  <div className={cn("w-6 h-px", isPast ? "bg-primary" : "bg-muted")} />
                )}
              </div>
            );
          })}
        </div>

        {showDebug && <div className="mt-4"><VoiceDebugPanel debug={debug} currentStage={currentStage} /></div>}
      </div>
    );
  }

  // Error state
  if (error && !transcript) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="size-8 text-destructive" />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-foreground">Something went wrong</h3>
        <p className="mt-2 text-xs text-destructive max-w-sm mx-auto leading-relaxed">
          {error}
        </p>
        {errorStage && (
          <p className="mt-1 text-[10px] text-muted-foreground font-mono">
            Stage: {errorStage}
          </p>
        )}
        <div className="mt-4 flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" onClick={reset} className="gap-2">
            <RefreshCw className="size-3.5" />
            Try Again
          </Button>
        </div>

        {/* Debug toggle */}
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="mt-3 flex items-center gap-1 mx-auto text-[10px] text-muted-foreground hover:text-foreground"
        >
          <Settings className="size-3" />
          {showDebug ? "Hide" : "Show"} Debug Info
        </button>
        {showDebug && <div className="mt-3"><VoiceDebugPanel debug={debug} currentStage={currentStage} /></div>}
      </div>
    );
  }

  // Transcript result — editable
  if (transcript?.success) {
    const hasTranslation =
      transcript.english_translation &&
      transcript.english_translation !== transcript.original_text;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.02] to-accent/[0.02] p-5 space-y-4"
      >
        {/* Detection info — clear and obvious */}
        <div className="rounded-xl bg-muted/50 p-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-base">🎤</span>
            <span className="text-xs font-medium text-muted-foreground">Detected Language :</span>
            <span className="text-xs font-bold text-foreground">{transcript.language}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base">🎯</span>
            <span className="text-xs font-medium text-muted-foreground">Confidence :</span>
            <span className="text-xs font-bold text-foreground">
              {Math.round(transcript.confidence * 100)}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base">⏱</span>
            <span className="text-xs font-medium text-muted-foreground">Recording :</span>
            <span className="text-xs font-bold text-foreground">{formatTime(recordingTime)}</span>
          </div>
        </div>

        {/* Low confidence warning */}
        {transcript.confidence < 0.7 && (
          <div className="flex items-start gap-2 rounded-xl bg-amber-500/5 border border-amber-500/20 p-3">
            <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-600">
              We may have misunderstood your speech. Please review the text below carefully.
            </p>
          </div>
        )}

        {/* Empty transcript warning */}
        {!transcript.original_text && (
          <div className="flex items-start gap-2 rounded-xl bg-amber-500/5 border border-amber-500/20 p-3">
            <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-600">
              We could not detect any speech in the recording. Please try speaking closer to the microphone.
            </p>
          </div>
        )}

        {/* Editable transcript — ALWAYS in original language */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-foreground">
            Original Transcript (Editable)
          </label>
          <Textarea
            value={editedText}
            onChange={(e) => {
              setEditedText(e.target.value);
              setHasEdited(true);
            }}
            rows={4}
            className="text-sm leading-relaxed"
            dir="auto"
          />
          {hasEdited && (
            <p className="mt-1 text-[10px] text-primary">
              Edited — your changes will be submitted.
            </p>
          )}
        </div>

        {/* Collapsible English Translation */}
        {hasTranslation && (
          <div className="rounded-xl border border-border overflow-hidden">
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className="flex w-full items-center justify-between px-3 py-2.5 bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Globe className="size-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-foreground">English Translation</span>
              </div>
              {showTranslation ? (
                <ChevronUp className="size-3.5 text-muted-foreground" />
              ) : (
                <ChevronDown className="size-3.5 text-muted-foreground" />
              )}
            </button>
            <AnimatePresence>
              {showTranslation && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-3 py-3 border-t border-border">
                    <p className="text-xs text-muted-foreground leading-relaxed italic">
                      &ldquo;{transcript.english_translation}&rdquo;
                    </p>
                    <p className="mt-2 text-[10px] text-muted-foreground/70">
                      This translation is used internally by the AI system. You cannot edit it.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Audio playback */}
        {audioUrl && <audio controls src={audioUrl} className="w-full h-8" />}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              reset();
              setEditedText("");
              setShowTranslation(false);
              startRecording();
            }}
            className="gap-2"
          >
            <Mic className="size-3.5" />
            Record Again
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              reset();
              setEditedText("");
              setShowTranslation(false);
            }}
            className="gap-2"
          >
            <Pencil className="size-3.5" />
            Type Instead
          </Button>
          <div className="flex-1" />
          <Button
            size="sm"
            onClick={() => onTranscript?.(editedText)}
            disabled={!editedText.trim()}
            className="gap-2"
          >
            Continue
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </motion.div>
    );
  }

  // Default: Record button
  return (
    <div className="rounded-2xl border border-border bg-card p-6 text-center">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={startRecording}
        className="relative mx-auto flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-all"
      >
        <Mic className="size-8" />
      </motion.button>

      <h3 className="mt-4 text-sm font-semibold text-foreground">Voice Complaint</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Describe your issue in any language. Sarvam AI supports 18+ Indian languages.
      </p>

      <div className="mt-4 flex items-center justify-center gap-2">
        <Button variant="outline" size="sm" onClick={startRecording} className="gap-2">
          <Mic className="size-3.5" />
          Start Recording
        </Button>
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
