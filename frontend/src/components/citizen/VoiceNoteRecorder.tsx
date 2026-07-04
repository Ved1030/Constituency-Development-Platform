"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  Square,
  Loader,
  Trash2,
  Languages,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSpeechRecorder } from "@/hooks/use-speech-recorder";

interface VoiceNoteRecorderProps {
  /** Called when a voice note is recorded and transcribed */
  onVoiceNote: (note: {
    audioBlob: Blob;
    transcript: string;
    language: string;
    englishTranslation: string;
  }) => void;
  /** Called to clear the voice note */
  onClear: () => void;
}

export function VoiceNoteRecorder({ onVoiceNote, onClear }: VoiceNoteRecorderProps) {
  const [editedText, setEditedText] = useState("");
  const [savedTranslation, setSavedTranslation] = useState("");

  const {
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
    reset,
  } = useSpeechRecorder({
    onTranscript: (result) => {
      // ALWAYS bind to original_text — citizen edits in their own language
      setEditedText(result.original_text);
      setSavedTranslation(result.english_translation);
    },
  });

  const handleConfirm = () => {
    if (audioBlob && editedText.trim()) {
      onVoiceNote({
        audioBlob,
        transcript: editedText,
        language: transcript?.language || "Unknown",
        englishTranslation: savedTranslation,
      });
      reset();
      setEditedText("");
      setSavedTranslation("");
    }
  };

  const handleClear = () => {
    reset();
    setEditedText("");
    onClear();
  };

  if (!isSupported) {
    return (
      <div className="rounded-xl border border-border bg-muted/30 p-3 text-center">
        <p className="text-xs text-muted-foreground">
          Voice recording not supported in this browser
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      {/* Recording controls */}
      {!transcript?.success && (
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className={cn(
              "flex size-10 items-center justify-center rounded-full transition-all shrink-0",
              isRecording
                ? "bg-destructive/10 text-destructive shadow-lg shadow-destructive/20"
                : "bg-primary/10 text-primary hover:bg-primary/20",
            )}
          >
            {isProcessing ? (
              <Loader className="size-5 animate-spin" />
            ) : isRecording ? (
              <Square className="size-4" />
            ) : (
              <Mic className="size-5" />
            )}
          </motion.button>

          <div className="flex-1 min-w-0">
            {isRecording ? (
              <div>
                <p className="text-sm font-medium text-foreground">Recording...</p>
                <p className="text-xs text-muted-foreground">
                  {formatTime(recordingTime)} — Tap to stop
                </p>
                <div className="mt-1.5 flex items-center gap-0.5">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [2, 8 + Math.random() * 12, 2] }}
                      transition={{
                        duration: 0.4 + Math.random() * 0.4,
                        repeat: Infinity,
                        delay: i * 0.03,
                      }}
                      className="w-0.5 rounded-full bg-destructive"
                    />
                  ))}
                </div>
              </div>
            ) : isProcessing ? (
              <div>
                <p className="text-sm font-medium text-foreground">Processing...</p>
                <p className="text-xs text-muted-foreground">AI is transcribing your voice</p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-foreground">Record a voice note</p>
                <p className="text-xs text-muted-foreground">Describe the issue in your own words</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error */}
      {error && !transcript?.success && (
        <div className="flex items-start gap-2 rounded-lg bg-destructive/5 border border-destructive/20 p-2.5">
          <AlertTriangle className="size-3.5 text-destructive shrink-0 mt-0.5" />
          <p className="text-[11px] text-destructive">{error}</p>
        </div>
      )}

      {/* Transcription result */}
      <AnimatePresence>
        {transcript?.success && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {/* Language info */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5">
                <Languages className="size-2.5 text-primary" />
                <span className="text-[10px] font-semibold text-primary">
                  {transcript.language}
                </span>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">
                <BarChart3 className="size-2.5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">
                  {Math.round(transcript.confidence * 100)}%
                </span>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">
                <Clock className="size-2.5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">
                  {formatTime(Math.round(recordingTime))}
                </span>
              </div>
            </div>

            {/* Editable text */}
            <div>
              <label className="mb-1 block text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                AI Detected Voice Note (editable)
              </label>
              <Textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                rows={3}
                className="text-xs"
              />
            </div>

            {/* Audio playback */}
            {audioUrl && (
              <audio controls src={audioUrl} className="w-full h-7" />
            )}

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  reset();
                  setEditedText("");
                  startRecording();
                }}
                className="gap-1.5 h-7 text-[11px]"
              >
                <Mic className="size-3" />
                Record Again
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="gap-1.5 h-7 text-[11px] text-destructive hover:text-destructive"
              >
                <Trash2 className="size-3" />
                Clear
              </Button>
              <div className="flex-1" />
              <Button
                size="sm"
                onClick={handleConfirm}
                disabled={!editedText.trim()}
                className="gap-1.5 h-7 text-[11px]"
              >
                <CheckCircle className="size-3" />
                Confirm
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
