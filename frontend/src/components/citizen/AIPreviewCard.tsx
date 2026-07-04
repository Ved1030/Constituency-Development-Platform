"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Building2,
  MapPin,
  Target,
  Clock,
  Shield,
  AlertTriangle,
  Users,
  TrendingUp,
  Brain,
  Navigation,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AIPreview } from "@/types/complaint";

interface AIPreviewCardProps {
  preview: AIPreview;
}

function getPriorityColor(priority: number): string {
  if (priority >= 75) return "text-destructive bg-destructive/10";
  if (priority >= 50) return "text-orange-500 bg-orange-500/10";
  if (priority >= 25) return "text-amber-500 bg-amber-500/10";
  return "text-blue-500 bg-blue-500/10";
}

function getPriorityLabel(priority: number): string {
  if (priority >= 75) return "Critical";
  if (priority >= 50) return "High";
  if (priority >= 25) return "Medium";
  return "Low";
}

function getDuplicateColor(prob: number): string {
  if (prob >= 0.7) return "text-amber-500";
  if (prob >= 0.3) return "text-primary";
  return "text-muted-foreground";
}

export function AIPreviewCard({ preview }: AIPreviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.02] to-accent/[0.02] p-5 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <Zap className="size-4 text-primary" />
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
          AI Analysis Preview
        </span>
        <div className="ml-auto flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5">
          <Brain className="size-3 text-primary" />
          <span className="text-[10px] font-medium text-primary">
            {Math.round(preview.ai_confidence * 100)}% confidence
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-2.5 sm:grid-cols-2">
        {/* Department */}
        <PreviewItem
          icon={<Building2 className="size-3" />}
          label="Department"
          value={preview.detected_department || "General Administration"}
        />

        {/* Sector */}
        <PreviewItem
          icon={<Target className="size-3" />}
          label="Sector"
          value={preview.detected_sector || "General"}
        />

        {/* Category */}
        <PreviewItem
          icon={<MapPin className="size-3" />}
          label="Category"
          value={preview.detected_category || "Other"}
          capitalize
        />

        {/* GPS Accuracy */}
        <PreviewItem
          icon={<Navigation className="size-3" />}
          label="GPS Accuracy"
          value={
            preview.gps_accuracy !== null
              ? `${preview.gps_accuracy.toFixed(1)}m`
              : "No GPS"
          }
        />

        {/* Evidence Score */}
        <PreviewItem
          icon={<Shield className="size-3" />}
          label="Evidence Score"
          value={
            preview.evidence_score
              ? `${Math.round(preview.evidence_score.total)}/100`
              : "N/A"
          }
          valueColor={
            (preview.evidence_score?.total || 0) >= 70
              ? "text-success"
              : (preview.evidence_score?.total || 0) >= 40
                ? "text-amber-500"
                : "text-destructive"
          }
        />

        {/* Priority */}
        <div className="rounded-xl bg-card border border-border p-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <TrendingUp className="size-3" />
            Priority Prediction
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">
              {Math.round(preview.priority_prediction)}
            </span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                getPriorityColor(preview.priority_prediction)
              )}
            >
              {getPriorityLabel(preview.priority_prediction)}
            </span>
          </div>
        </div>

        {/* Duplicate Probability */}
        <div className="rounded-xl bg-card border border-border p-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Users className="size-3" />
            Duplicate Probability
          </div>
          <span className={cn("text-sm font-semibold", getDuplicateColor(preview.duplicate_probability))}>
            {Math.round(preview.duplicate_probability * 100)}%
          </span>
          {preview.similar_complaints_nearby > 0 && (
            <span className="ml-2 text-[10px] text-muted-foreground">
              ({preview.similar_complaints_nearby} nearby)
            </span>
          )}
        </div>

        {/* Estimated Resolution */}
        <div className="rounded-xl bg-card border border-border p-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Clock className="size-3" />
            Est. Resolution
          </div>
          <span className="text-sm font-semibold text-foreground">
            {preview.estimated_resolution_days
              ? `${preview.estimated_resolution_days} days`
              : "TBD"}
          </span>
        </div>
      </div>

      {/* Location Summary */}
      {preview.detected_location && (
        <div className="rounded-xl bg-card border border-border p-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <MapPin className="size-3" />
            Detected Location
          </div>
          <div className="flex flex-wrap gap-1.5">
            {preview.detected_location.village && (
              <LocationTag>{preview.detected_location.village}</LocationTag>
            )}
            {preview.detected_location.ward && (
              <LocationTag>Ward {preview.detected_location.ward}</LocationTag>
            )}
            {preview.detected_location.district && (
              <LocationTag>{preview.detected_location.district}</LocationTag>
            )}
            {preview.detected_location.state && (
              <LocationTag>{preview.detected_location.state}</LocationTag>
            )}
            {preview.detected_location.assembly_constituency && (
              <LocationTag className="bg-primary/10 text-primary">
                {preview.detected_location.assembly_constituency}
              </LocationTag>
            )}
          </div>
        </div>
      )}

      {/* Similar Complaints Warning */}
      {preview.similar_complaints_nearby > 0 && (
        <div className="flex items-start gap-2 rounded-xl bg-amber-500/5 border border-amber-500/20 p-3">
          <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-amber-600">
              Similar complaints found nearby
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {preview.similar_complaints_nearby} related complaint(s) detected within 100m.
              This complaint may be merged into an existing issue cluster.
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function PreviewItem({
  icon,
  label,
  value,
  capitalize = false,
  valueColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  capitalize?: boolean;
  valueColor?: string;
}) {
  return (
    <div className="rounded-xl bg-card border border-border p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
        {icon}
        {label}
      </div>
      <span
        className={cn(
          "text-sm font-semibold text-foreground",
          capitalize && "capitalize",
          valueColor
        )}
      >
        {value}
      </span>
    </div>
  );
}

function LocationTag({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground",
        className
      )}
    >
      {children}
    </span>
  );
}
