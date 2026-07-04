"use client";

import { Users, Flame, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface IssueClusterBadgeProps {
  clusterUid: string;
  reportCount: number;
  severity: string;
  showDetails?: boolean;
}

function getCountColor(count: number): string {
  if (count >= 10) return "text-destructive bg-destructive/10 border-destructive/20";
  if (count >= 5) return "text-orange-500 bg-orange-500/10 border-orange-500/20";
  if (count >= 3) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
  return "text-primary bg-primary/10 border-primary/20";
}

function getSeverityIcon(severity: string) {
  switch (severity) {
    case "critical":
      return <Flame className="size-3 text-destructive" />;
    case "high":
      return <TrendingUp className="size-3 text-orange-500" />;
    default:
      return <Users className="size-3 text-primary" />;
  }
}

export function IssueClusterBadge({
  clusterUid,
  reportCount,
  severity,
  showDetails = false,
}: IssueClusterBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1",
        getCountColor(reportCount)
      )}
    >
      {getSeverityIcon(severity)}
      <span className="text-[10px] font-bold">
        {reportCount} {reportCount === 1 ? "report" : "reports"}
      </span>
      {showDetails && (
        <span className="text-[9px] opacity-70">
          ({clusterUid})
        </span>
      )}
    </div>
  );
}
