"use client";

import { motion } from "framer-motion";
import { Bug, Check, X, Mic, Server, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VoiceDebugInfo, SpeechProcessingStage } from "@/types/speech";

interface VoiceDebugPanelProps {
  debug: VoiceDebugInfo;
  currentStage: SpeechProcessingStage;
}

const stageLabels: Record<SpeechProcessingStage, string> = {
  idle: "Idle",
  requesting_microphone: "Requesting Microphone...",
  recording: "Recording Audio...",
  validating: "Validating Recording...",
  uploading: "Uploading to Server...",
  stt: "Running Speech-to-Text...",
  detecting_language: "Detecting Language...",
  translating: "Translating to English...",
  done: "Done",
  error: "Error",
};

function StatusBadge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {ok ? (
        <Check className="size-3 text-green-500" />
      ) : (
        <X className="size-3 text-red-500" />
      )}
      <span className={cn("text-[10px] font-medium", ok ? "text-green-600" : "text-red-500")}>
        {label}
      </span>
    </div>
  );
}

export function VoiceDebugPanel({ debug, currentStage }: VoiceDebugPanelProps) {
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="rounded-xl border border-dashed border-yellow-400/50 bg-yellow-50/50 p-3 space-y-2"
    >
      {/* Header */}
      <div className="flex items-center gap-1.5">
        <Bug className="size-3 text-yellow-600" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-600">
          Voice Debug Panel
        </span>
      </div>

      {/* Current Stage */}
      <div className="rounded-lg bg-muted/50 p-2">
        <span className="text-[10px] text-muted-foreground">Stage: </span>
        <span className="text-[10px] font-mono font-semibold text-foreground">
          {stageLabels[currentStage]}
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[10px]">
        {/* Microphone */}
        <div>
          <span className="text-muted-foreground">Microphone: </span>
          <span className={cn(
            "font-medium",
            debug.microphonePermission === "granted" ? "text-green-600" : "text-red-500"
          )}>
            {debug.microphonePermission}
          </span>
        </div>

        {/* MIME Type */}
        <div>
          <span className="text-muted-foreground">MIME: </span>
          <span className="font-mono text-foreground">{debug.selectedMimeType || "none"}</span>
        </div>

        {/* Recording Time */}
        <div>
          <span className="text-muted-foreground">Duration: </span>
          <span className="font-mono text-foreground">{debug.recordingTimeSeconds}s</span>
        </div>

        {/* Blob Size */}
        <div>
          <span className="text-muted-foreground">Blob: </span>
          <span className="font-mono text-foreground">
            {debug.audioBlobSize > 0
              ? `${(debug.audioBlobSize / 1024).toFixed(1)}KB`
              : "none"}
          </span>
        </div>

        {/* Blob Type */}
        <div>
          <span className="text-muted-foreground">Blob Type: </span>
          <span className="font-mono text-foreground">{debug.audioBlobType || "none"}</span>
        </div>

        {/* Upload Status */}
        <div>
          <span className="text-muted-foreground">Upload: </span>
          <span className={cn(
            "font-medium",
            debug.uploadStatus === "success" ? "text-green-600" :
            debug.uploadStatus === "failed" ? "text-red-500" :
            debug.uploadStatus === "uploading" ? "text-blue-500" :
            "text-muted-foreground"
          )}>
            {debug.uploadStatus}
          </span>
        </div>
      </div>

      {/* Connection Status */}
      <div className="flex items-center gap-3">
        <StatusBadge ok={debug.backendConnected} label="Backend" />
        <StatusBadge ok={debug.sarvamConnected} label="Sarvam" />
      </div>

      {/* Detection Results */}
      {(debug.detectedLanguage || debug.transcript) && (
        <div className="rounded-lg bg-muted/50 p-2 space-y-1">
          {debug.detectedLanguage && (
            <div>
              <span className="text-[10px] text-muted-foreground">Language: </span>
              <span className="text-[10px] font-semibold text-foreground">
                {debug.detectedLanguage} ({Math.round(debug.confidence * 100)}%)
              </span>
            </div>
          )}
          {debug.transcript && (
            <div>
              <span className="text-[10px] text-muted-foreground">Transcript: </span>
              <span className="text-[10px] text-foreground">{debug.transcript.slice(0, 100)}...</span>
            </div>
          )}
          {debug.translation && (
            <div>
              <span className="text-[10px] text-muted-foreground">Translation: </span>
              <span className="text-[10px] text-foreground">{debug.translation.slice(0, 100)}...</span>
            </div>
          )}
        </div>
      )}

      {/* Error Info */}
      {debug.lastError && (
        <div className="rounded-lg bg-red-50 p-2 space-y-0.5">
          <div>
            <span className="text-[10px] text-red-600 font-semibold">Error Stage: </span>
            <span className="text-[10px] font-mono text-red-600">{debug.errorStage}</span>
          </div>
          <div>
            <span className="text-[10px] text-red-600">Error: </span>
            <span className="text-[10px] text-red-600">{debug.lastError}</span>
          </div>
        </div>
      )}

      {/* Pipeline Stages Log */}
      {debug.pipelineStages.length > 0 && (
        <div className="rounded-lg bg-muted/30 p-2">
          <span className="text-[10px] text-muted-foreground font-semibold">Pipeline:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {debug.pipelineStages.map((stage, i) => (
              <span key={i} className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-mono text-primary">
                {stage}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
