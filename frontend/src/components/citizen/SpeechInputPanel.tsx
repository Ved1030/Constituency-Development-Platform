"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSpeechRecorder } from "@/hooks/use-speech-recorder";
import type { TranscriptionResult } from "@/types/speech";

interface SpeechInputPanelProps {
  /** Called when user confirms the transcript */
  onConfirm: (text: string) => void;
  /** Called to go back to manual typing */
  onSwitchToType: () => void;
  /** Language hint for STT */
  languageCode?: string;
}

export function SpeechInputPanel({
  onConfirm,
  onSwitchToType,
  languageCode,
}: SpeechInputPanelProps) {
  const [editedText, setEditedText] = useState("");
  const [hasEdited, setHasEdited] = useState(false);

  const {
    isRecording,
    isProcessing,
    isSupported,
    recordingTime,
    audioUrl,
    transcript,
    error,
    startRecording,
    stopRecording,
    cancelRecording,
    reset,
    retryTranscription,
  } = useSpeechRecorder({
    languageCode,
    onTranscript: (result) => {
      setEditedText(result.english_translation || result.original_text);
      setHasEdited(false);
    },
  });

  // If browser doesn't support recording
  if (!isSupported) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-amber-500/10 mb-4">
          <MicOff className="size-8 text-amber-500" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">Voice Recording Not Available</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Your browser does not support audio recording. Please type your complaint instead.
        </p>
        <Button variant="outline" size="sm" onClick={onSwitchToType} className="mt-4 gap-2">
          <Pencil className="size-3.5" />
          Type Instead
        </Button>
      </div>
    );
  }

  // Recording state
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
          Speak clearly. Tap Stop when done.
        </p>

        {/* Timer */}
        <div className="mt-3 flex items-center justify-center gap-2 text-sm font-mono text-destructive">
          <Clock className="size-3.5" />
          {formatTime(recordingTime)}
        </div>

        {/* Waveform */}
        <div className="mt-4 flex items-center justify-center gap-0.5">
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                height: [4, 12 + Math.random() * 20, 4],
              }}
              transition={{
                duration: 0.4 + Math.random() * 0.4,
                repeat: Infinity,
                delay: i * 0.03,
              }}
              className="w-1 rounded-full bg-destructive"
            />
          ))}
        </div>

        <p className="mt-3 text-[11px] text-muted-foreground">
          The detected text will be editable after recording.
        </p>
      </div>
    );
  }

  // Processing state
  if (isProcessing) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
          <Loader className="size-8 text-primary animate-spin" />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-foreground">Processing Speech...</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Sarvam AI is transcribing and translating your voice.
        </p>
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-primary">
          <BarChart3 className="size-3.5 animate-pulse" />
          Detecting language and converting to text...
        </div>
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
        <h3 className="mt-4 text-sm font-semibold text-foreground">Recording Error</h3>
        <p className="mt-2 text-xs text-destructive max-w-xs mx-auto">{error}</p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" onClick={reset} className="gap-2">
            <RefreshCw className="size-3.5" />
            Try Again
          </Button>
          <Button variant="outline" size="sm" onClick={onSwitchToType} className="gap-2">
            <Pencil className="size-3.5" />
            Type Instead
          </Button>
        </div>
      </div>
    );
  }

  // Transcript result - editable
  if (transcript?.success) {
    const confidence = transcript.confidence;
    const isLowConfidence = confidence < 0.7;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.02] to-accent/[0.02] p-5 space-y-4"
      >
        {/* Language & Confidence */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1">
            <Languages className="size-3 text-primary" />
            <span className="text-[11px] font-semibold text-primary">
              {transcript.language}
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1">
            <BarChart3 className="size-3 text-muted-foreground" />
            <span className="text-[11px] font-medium text-muted-foreground">
              {Math.round(confidence * 100)}% confidence
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1">
            <Clock className="size-3 text-muted-foreground" />
            <span className="text-[11px] font-medium text-muted-foreground">
              {formatTime(Math.round(recordingTime))}
            </span>
          </div>
        </div>

        {/* Low confidence warning */}
        {isLowConfidence && (
          <div className="flex items-start gap-2 rounded-xl bg-amber-500/5 border border-amber-500/20 p-3">
            <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-600">
              We may have misunderstood your speech. Please review the text below before continuing.
            </p>
          </div>
        )}

        {/* Original text + translation */}
        {transcript.english_translation && transcript.english_translation !== transcript.original_text && (
          <div className="rounded-xl bg-muted/50 p-3 space-y-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Original ({transcript.language})
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {transcript.original_text}
            </p>
          </div>
        )}

        {/* Editable transcript */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-foreground">
            {transcript.english_translation && transcript.english_translation !== transcript.original_text
              ? "English Translation (editable)"
              : "Detected Text (editable)"}
          </label>
          <Textarea
            value={editedText}
            onChange={(e) => {
              setEditedText(e.target.value);
              setHasEdited(true);
            }}
            rows={5}
            className="text-sm leading-relaxed"
            placeholder="The detected text will appear here..."
          />
          {hasEdited && (
            <p className="mt-1 text-[10px] text-primary">
              You have edited the transcript. Only your edits will be submitted.
            </p>
          )}
        </div>

        {/* Audio playback */}
        {audioUrl && (
          <div className="rounded-xl bg-muted/50 p-3">
            <audio controls src={audioUrl} className="w-full h-8" />
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              reset();
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
            onClick={retryTranscription}
            disabled={isProcessing}
            className="gap-2"
          >
            <RefreshCw className={cn("size-3.5", isProcessing && "animate-spin")} />
            Re-transcribe
          </Button>
          <div className="flex-1" />
          <Button
            size="sm"
            onClick={() => onConfirm(editedText)}
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
        Describe your issue using your voice. Sarvam AI supports 18+ Indian languages.
      </p>

      <div className="mt-4 flex items-center justify-center gap-2">
        <Button variant="outline" size="sm" onClick={startRecording} className="gap-2">
          <Mic className="size-3.5" />
          Start Recording
        </Button>
        <Button variant="ghost" size="sm" onClick={onSwitchToType} className="gap-2">
          <Pencil className="size-3.5" />
          Type Instead
        </Button>
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
