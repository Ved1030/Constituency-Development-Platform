"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Mic,
  Upload,
  X,
  Loader,
  FileText,
  CheckCircle,
  Image as ImageIcon,
  Languages,
  Clock,
  BarChart3,
  Square,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSpeechRecorder } from "@/hooks/use-speech-recorder";

interface EvidenceUploadProps {
  onImagesChange?: (files: File[]) => void;
  onVoiceChange?: (audioBlob: Blob | null) => void;
  onVoiceNoteTranscript?: (transcript: {
    audioBlob: Blob;
    transcript: string;
    language: string;
    englishTranslation: string;
  }) => void;
  imageCount?: number;
  hasVoice?: boolean;
}

export function EvidenceUpload({
  onImagesChange,
  onVoiceChange,
  onVoiceNoteTranscript,
  imageCount = 0,
  hasVoice = false,
}: EvidenceUploadProps) {
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [voiceEditedText, setVoiceEditedText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

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
    reset: resetVoice,
  } = useSpeechRecorder({
    onTranscript: (result) => {
      const text = result.english_translation || result.original_text;
      setVoiceEditedText(text);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    setTimeout(() => {
      const newImages = files.map((f) => URL.createObjectURL(f));
      setImages((prev) => [...prev, ...newImages]);
      setIsUploading(false);
      onImagesChange?.(files);
    }, 800);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVoiceConfirm = () => {
    if (audioBlob && voiceEditedText.trim()) {
      onVoiceChange?.(audioBlob);
      onVoiceNoteTranscript?.({
        audioBlob,
        transcript: voiceEditedText,
        language: transcript?.language || "Unknown",
        englishTranslation: voiceEditedText,
      });
      resetVoice();
      setVoiceEditedText("");
    }
  };

  const handleVoiceClear = () => {
    resetVoice();
    setVoiceEditedText("");
    onVoiceChange?.(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Camera className="size-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Evidence</h3>
          <p className="text-xs text-muted-foreground">
            Photos, voice notes, and descriptions
          </p>
        </div>
        {(images.length > 0 || hasVoice || transcript?.success) && (
          <div className="ml-auto flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1">
            <CheckCircle className="size-3 text-success" />
            <span className="text-[11px] font-medium text-success">
              {images.length + (hasVoice || transcript?.success ? 1 : 0)} attached
            </span>
          </div>
        )}
      </div>

      {/* Photo Grid */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <ImageIcon className="size-3.5 text-muted-foreground" />
          <span className="text-[11px] text-muted-foreground uppercase tracking-wider">
            Photos
          </span>
          {images.length > 0 && (
            <span className="text-[11px] text-primary font-medium">({images.length})</span>
          )}
        </div>
        <div className="grid grid-cols-4 gap-2">
          <AnimatePresence>
            {images.map((src, index) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="group relative aspect-square overflow-hidden rounded-xl bg-muted"
              >
                <img src={src} alt="" className="size-full object-cover" />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="size-3" />
                </button>
                <div className="absolute bottom-1 left-1 rounded bg-black/50 px-1.5 py-0.5 text-[9px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  {index + 1}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isUploading && (
            <div className="flex aspect-square items-center justify-center rounded-xl bg-muted">
              <Loader className="size-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {images.length < 6 && (
            <button
              onClick={() => inputRef.current?.click()}
              className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/5"
            >
              <Upload className="size-5" />
            </button>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Voice Recording */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Mic className="size-3.5 text-muted-foreground" />
          <span className="text-[11px] text-muted-foreground uppercase tracking-wider">
            Voice Note
          </span>
          {(hasVoice || transcript?.success) && !isRecording && (
            <span className="text-[11px] text-success font-medium">
              Recorded
            </span>
          )}
        </div>

        {/* Recording in progress */}
        {isRecording && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
            <div className="flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={stopRecording}
                className="flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive shrink-0"
              >
                <Square className="size-4" />
              </motion.button>
              <div className="flex-1">
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
            </div>
          </div>
        )}

        {/* Processing */}
        {isProcessing && (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center">
            <Loader className="size-6 text-primary animate-spin mx-auto" />
            <p className="mt-2 text-sm font-medium text-foreground">Processing voice note...</p>
          </div>
        )}

        {/* Error */}
        {error && !transcript?.success && !isRecording && !isProcessing && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 flex items-start gap-2">
            <AlertTriangle className="size-4 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-destructive">{error}</p>
              <button onClick={resetVoice} className="text-[11px] text-primary mt-1 underline">
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Transcription result */}
        {transcript?.success && !isRecording && !isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-primary/15 bg-primary/[0.02] p-3 space-y-2"
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
                  {formatTime(recordingTime)}
                </span>
              </div>
            </div>

            {/* Editable transcript */}
            <div>
              <label className="mb-1 block text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                AI Detected Voice Note (editable)
              </label>
              <Textarea
                value={voiceEditedText}
                onChange={(e) => setVoiceEditedText(e.target.value)}
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
                  resetVoice();
                  setVoiceEditedText("");
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
                onClick={handleVoiceClear}
                className="gap-1.5 h-7 text-[11px] text-destructive hover:text-destructive"
              >
                <Trash2 className="size-3" />
                Clear
              </Button>
              <div className="flex-1" />
              <Button
                size="sm"
                onClick={handleVoiceConfirm}
                disabled={!voiceEditedText.trim()}
                className="gap-1.5 h-7 text-[11px]"
              >
                <CheckCircle className="size-3" />
                Confirm
              </Button>
            </div>
          </motion.div>
        )}

        {/* Default record button */}
        {!isRecording && !isProcessing && !transcript?.success && !error && (
          <div className="flex items-center gap-3">
            {isSupported ? (
              <>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={startRecording}
                  className={cn(
                    "flex size-12 items-center justify-center rounded-full transition-all",
                    hasVoice
                      ? "bg-success/10 text-success hover:bg-success/20"
                      : "bg-primary/10 text-primary hover:bg-primary/20",
                  )}
                >
                  <Mic className="size-5" />
                </motion.button>
                <div>
                  <p className="text-sm font-medium text-foreground">Record a voice note</p>
                  <p className="text-xs text-muted-foreground">
                    Describe the issue in your own words
                  </p>
                </div>
              </>
            ) : (
              <p className="text-xs text-muted-foreground">
                Voice recording not supported in this browser
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
