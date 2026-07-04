"use client";

import { motion } from "framer-motion";
import { MapPin, ThumbsUp, TriangleAlert, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ComplaintStatusBadge } from "./ComplaintStatusBadge";
import type { Issue } from "@/data/mock-citizen";

const severityColors = {
  low: "bg-blue-500",
  medium: "bg-yellow-500",
  high: "bg-orange-500",
  critical: "bg-red-500",
};

interface IssueCardProps {
  issue: Issue;
  onSupport?: () => void;
  index?: number;
}

export function IssueCard({ issue, onSupport, index = 0 }: IssueCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group rounded-2xl border border-border bg-card p-5 transition-all hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={cn("mt-1 size-2.5 shrink-0 rounded-full", severityColors[issue.severity])} />
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-foreground">{issue.title}</h3>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">{issue.description}</p>
            <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="size-3" />
                {issue.distance}
              </span>
              <span className="flex items-center gap-1">
                <ThumbsUp className="size-3" />
                {issue.upvotes}
              </span>
              <span>by {issue.reportedBy}</span>
            </div>
          </div>
        </div>
        {issue.status === "open" && (
          <Button size="sm" variant="outline" className="shrink-0 gap-1.5 text-xs" onClick={onSupport}>
            <ThumbsUp className="size-3" />
            Support
          </Button>
        )}
        {issue.status === "in-progress" && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-[11px] font-medium text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
            <Clock className="size-3" />
            Fixing
          </span>
        )}
        {issue.status === "resolved" && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-[11px] font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle className="size-3" />
            Done
          </span>
        )}
      </div>
    </motion.div>
  );
}
