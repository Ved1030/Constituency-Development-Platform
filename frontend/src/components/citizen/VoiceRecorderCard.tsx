"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface VoiceRecorderCardProps {
  onTranscript?: (text: string) => void;
}

export function VoiceRecorderCard({ onTranscript }: VoiceRecorderCardProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        onTranscript?.("There is a water logging problem on Gandhi Nagar main road. The drainage system is blocked for over a week now causing health issues for residents.");
      }, 1500);
    } else {
      setIsRecording(true);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 text-center">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleToggle}
        disabled={isProcessing}
        className={cn(
          "relative mx-auto flex size-20 items-center justify-center rounded-full transition-all",
          isRecording
            ? "bg-destructive/10 text-destructive shadow-lg shadow-destructive/20"
            : "bg-primary/10 text-primary hover:bg-primary/20",
        )}
      >
        {isProcessing ? (
          <Loader className="size-8 animate-spin" />
        ) : (
          <Mic className={cn("size-8", isRecording && "animate-pulse")} />
        )}
        {isRecording && (
          <span className="absolute -top-1 -right-1 flex size-4">
            <span className="absolute inset-0 animate-ping rounded-full bg-destructive opacity-75" />
            <span className="relative size-4 rounded-full bg-destructive" />
          </span>
        )}
      </motion.button>

      <h3 className="mt-4 text-sm font-semibold text-foreground">
        {isRecording ? "Recording..." : isProcessing ? "Processing..." : "Voice Complaint"}
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">
        {isRecording
          ? "Tap to stop recording"
          : isProcessing
            ? "AI is transcribing your voice"
            : "Describe your issue using your voice"}
      </p>

      {isRecording && (
        <div className="mt-4 flex items-center justify-center gap-1">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                height: [4, 16 + Math.random() * 20, 4],
              }}
              transition={{
                duration: 0.5 + Math.random() * 0.5,
                repeat: Infinity,
                delay: i * 0.05,
              }}
              className="w-1 rounded-full bg-primary"
            />
          ))}
        </div>
      )}
    </div>
  );
}
