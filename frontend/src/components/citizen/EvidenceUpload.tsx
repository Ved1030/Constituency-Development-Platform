"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Mic,
  Upload,
  X,
  Loader,
  Video,
  FileText,
  CheckCircle,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EvidenceUploadProps {
  onImagesChange?: (files: File[]) => void;
  onVoiceChange?: (audioBlob: Blob | null) => void;
  imageCount?: number;
  hasVoice?: boolean;
}

export function EvidenceUpload({
  onImagesChange,
  onVoiceChange,
  imageCount = 0,
  hasVoice = false,
}: EvidenceUploadProps) {
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      // Simulate voice recording completion
      onVoiceChange?.(new Blob());
    } else {
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
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
        {(images.length > 0 || hasVoice) && (
          <div className="ml-auto flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1">
            <CheckCircle className="size-3 text-success" />
            <span className="text-[11px] font-medium text-success">
              {images.length + (hasVoice ? 1 : 0)} attached
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
          {hasVoice && !isRecording && (
            <span className="text-[11px] text-success font-medium">
              Recorded
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleRecording}
            className={cn(
              "flex size-12 items-center justify-center rounded-full transition-all",
              isRecording
                ? "bg-destructive/10 text-destructive shadow-lg shadow-destructive/20"
                : hasVoice
                  ? "bg-success/10 text-success hover:bg-success/20"
                  : "bg-primary/10 text-primary hover:bg-primary/20",
            )}
          >
            {isRecording ? (
              <X className="size-5" />
            ) : (
              <Mic className="size-5" />
            )}
            {isRecording && (
              <span className="absolute -top-1 -right-1 flex size-3">
                <span className="absolute inset-0 animate-ping rounded-full bg-destructive opacity-75" />
                <span className="relative size-3 rounded-full bg-destructive" />
              </span>
            )}
          </motion.button>

          <div className="flex-1">
            {isRecording ? (
              <div>
                <p className="text-sm font-medium text-foreground">Recording...</p>
                <p className="text-xs text-muted-foreground">
                  {formatTime(recordingTime)} — Tap to stop
                </p>
                <div className="mt-2 flex items-center gap-0.5">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: [2, 8 + Math.random() * 12, 2],
                      }}
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
            ) : hasVoice ? (
              <div>
                <p className="text-sm font-medium text-foreground">Voice note ready</p>
                <p className="text-xs text-muted-foreground">
                  Tap to re-record
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-foreground">Record a voice note</p>
                <p className="text-xs text-muted-foreground">
                  Describe the issue in your own words
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
