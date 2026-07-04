"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Building2,
  Target,
  Clock,
  Shield,
  Loader,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { BackgroundClassificationResult } from "@/types/speech";

interface BackgroundClassificationCardProps {
  classification: BackgroundClassificationResult | null;
  isClassifying: boolean;
}

function getSeverityColor(severity: string): string {
  switch (severity?.toLowerCase()) {
    case "critical":
      return "text-destructive bg-destructive/10";
    case "high":
      return "text-orange-500 bg-orange-500/10";
    case "medium":
      return "text-amber-500 bg-amber-500/10";
    case "low":
      return "text-blue-500 bg-blue-500/10";
    default:
      return "text-muted-foreground bg-muted";
  }
}

function getSeverityIcon(severity: string): string {
  switch (severity?.toLowerCase()) {
    case "critical":
      return "🔴";
    case "high":
      return "🟠";
    case "medium":
      return "🟡";
    case "low":
      return "🔵";
    default:
      return "⚪";
  }
}

export function BackgroundClassificationCard({
  classification,
  isClassifying,
}: BackgroundClassificationCardProps) {
  // Don't show anything if no classification and not classifying
  if (!classification && !isClassifying) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/[0.02] to-transparent p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center gap-2">
          {isClassifying ? (
            <Loader className="size-3.5 text-primary animate-spin" />
          ) : (
            <Zap className="size-3.5 text-primary" />
          )}
          <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
            {isClassifying ? "AI Analyzing..." : "AI Prediction"}
          </span>
          {!isClassifying && classification?.success && (
            <div className="ml-auto flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5">
              <Brain className="size-2.5 text-primary" />
              <span className="text-[9px] font-medium text-primary">
                {Math.round(classification.confidence * 100)}%
              </span>
            </div>
          )}
        </div>

        {/* Loading skeleton */}
        {isClassifying && (
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl bg-muted/50 p-2.5 animate-pulse">
                <div className="h-2 bg-muted rounded w-12 mb-1.5" />
                <div className="h-3 bg-muted rounded w-20" />
              </div>
            ))}
          </div>
        )}

        {/* Classification results */}
        <AnimatePresence mode="wait">
          {!isClassifying && classification?.success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 gap-2"
            >
              <ClassifyItem
                icon={<Target className="size-3" />}
                label="Category"
                value={classification.detected_category || "Other"}
              />
              <ClassifyItem
                icon={<Building2 className="size-3" />}
                label="Department"
                value={classification.detected_department || "General"}
              />
              <ClassifyItem
                icon={<Shield className="size-3" />}
                label="Severity"
                value={classification.severity}
                badge
                badgeColor={getSeverityColor(classification.severity)}
                icon2={getSeverityIcon(classification.severity)}
              />
              <ClassifyItem
                icon={<Clock className="size-3" />}
                label="Est. Resolution"
                value={`${classification.estimated_resolution_days} days`}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Keywords */}
        {!isClassifying && classification?.keywords && classification.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {classification.keywords.slice(0, 5).map((kw) => (
              <span
                key={kw}
                className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-medium text-muted-foreground"
              >
                {kw}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ClassifyItem({
  icon,
  label,
  value,
  badge,
  badgeColor,
  icon2,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  badge?: boolean;
  badgeColor?: string;
  icon2?: string;
}) {
  return (
    <div className="rounded-xl bg-card border border-border/50 p-2.5">
      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1">
        {icon}
        {label}
      </div>
      {badge ? (
        <div className="flex items-center gap-1.5">
          {icon2 && <span className="text-xs">{icon2}</span>}
          <span
            className={cn(
              "text-xs font-semibold capitalize",
              badgeColor || "text-foreground"
            )}
          >
            {value}
          </span>
        </div>
      ) : (
        <span className="text-xs font-semibold text-foreground capitalize">
          {value}
        </span>
      )}
    </div>
  );
}
