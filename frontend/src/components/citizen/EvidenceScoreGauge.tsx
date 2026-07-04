"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Navigation,
  Camera,
  Mic,
  Clock,
  MapPin,
  Users,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { EvidenceScore } from "@/types/complaint";

interface EvidenceScoreGaugeProps {
  score: EvidenceScore;
  showBreakdown?: boolean;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-primary";
  if (score >= 40) return "text-amber-500";
  return "text-destructive";
}

function getScoreBg(score: number): string {
  if (score >= 80) return "bg-success";
  if (score >= 60) return "bg-primary";
  if (score >= 40) return "bg-amber-500";
  return "bg-destructive";
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent Evidence";
  if (score >= 60) return "Good Evidence";
  if (score >= 40) return "Moderate Evidence";
  return "Insufficient Evidence";
}

export function EvidenceScoreGauge({ score, showBreakdown = true }: EvidenceScoreGaugeProps) {
  const colorClass = getScoreColor(score.total);
  const bgClass = getScoreBg(score.total);

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Shield className="size-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Evidence Score</h3>
          <p className="text-xs text-muted-foreground">AI-verified evidence quality</p>
        </div>
      </div>

      {/* Score Circle */}
      <div className="flex items-center justify-center mb-4">
        <div className="relative size-28">
          <svg className="size-28 -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted/30"
            />
            <motion.circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 52}
              initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - score.total / 100) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={cn(colorClass)}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn("text-2xl font-bold", colorClass)}>
              {Math.round(score.total)}
            </span>
            <span className="text-[10px] text-muted-foreground">/ 100</span>
          </div>
        </div>
      </div>

      <p className={cn("text-center text-xs font-medium mb-4", colorClass)}>
        {getScoreLabel(score.total)}
      </p>

      {/* Breakdown */}
      {showBreakdown && (
        <div className="space-y-2">
          <ScoreFactor
            icon={<Navigation className="size-3" />}
            label="GPS Verified"
            active={score.gps_present}
          />
          <ScoreFactor
            icon={<Camera className="size-3" />}
            label="Photos Attached"
            active={score.photo_present}
          />
          <ScoreFactor
            icon={<Mic className="size-3" />}
            label="Voice Note"
            active={score.voice_present}
          />
          <ScoreFactor
            icon={<MapPin className="size-3" />}
            label="Location Accuracy"
            active={score.location_accuracy_score > 10}
          />
          <ScoreFactor
            icon={<Users className="size-3" />}
            label="Multiple Reports Nearby"
            active={score.multiple_reports_nearby}
          />
          <ScoreFactor
            icon={<Clock className="size-3" />}
            label="Timestamp Valid"
            active={score.timestamp_valid}
          />
          <ScoreFactor
            icon={<Brain className="size-3" />}
            label="AI Confidence"
            active={score.ai_confidence_score > 5}
          />
        </div>
      )}
    </div>
  );
}

function ScoreFactor({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2">
      <div className="flex items-center gap-2">
        <span className={cn("transition-colors", active ? "text-success" : "text-muted-foreground")}>
          {icon}
        </span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div
        className={cn(
          "flex size-5 items-center justify-center rounded-full transition-all",
          active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
        )}
      >
        {active ? (
          <svg className="size-3" viewBox="0 0 12 12" fill="none">
            <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <span className="size-1.5 rounded-full bg-muted-foreground/40" />
        )}
      </div>
    </div>
  );
}
