"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  ChevronRight,
  MessageSquare,
  ThumbsUp,
  Navigation,
  Shield,
  Building2,
  Users,
} from "lucide-react";
import { ComplaintStatusBadge } from "./ComplaintStatusBadge";
import { VerificationStatusBadge } from "./VerificationStatusBadge";
import { IssueClusterBadge } from "./IssueClusterBadge";
import { cn } from "@/lib/utils";

const severityColors = {
  low: "bg-blue-500",
  medium: "bg-yellow-500",
  high: "bg-orange-500",
  critical: "bg-red-500",
};

// Extended complaint type for cards with geo verification data
interface ComplaintCardComplaint {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  severity: "low" | "medium" | "high" | "critical";
  location: string;
  lat: number;
  lng: number;
  createdAt: string;
  updatedAt: string;
  upvotes: number;
  comments: number;
  progress: number;
  department?: string;
  // Geo-verification fields (optional for backwards compat)
  evidence_score?: number;
  verification_status?: string;
  verification_confidence?: number;
  ward?: string;
  village?: string;
  cluster_uid?: string;
  duplicate_count?: number;
  gps_accuracy?: number;
  ai_confidence?: number;
}

interface ComplaintCardProps {
  complaint: ComplaintCardComplaint;
  onClick?: () => void;
  index?: number;
}

export function ComplaintCard({ complaint, onClick, index = 0 }: ComplaintCardProps) {
  const hasGeo = complaint.evidence_score !== undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={onClick}
      className="group cursor-pointer rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Severity + Status row */}
          <div className="flex items-center gap-2 mb-2">
            <div className={cn("size-2 rounded-full shrink-0", severityColors[complaint.severity])} />
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              {complaint.severity} Priority
            </span>
            <ComplaintStatusBadge status={complaint.status as any} />
            {complaint.verification_status && (
              <VerificationStatusBadge
                status={complaint.verification_status as any}
                confidence={complaint.verification_confidence}
              />
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {complaint.title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
            {complaint.description}
          </p>

          {/* Location */}
          <div className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground">
            <MapPin className="size-3" />
            <span className="truncate">{complaint.location}</span>
          </div>
        </div>
        <ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      {/* Geo verification row */}
      {hasGeo && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {/* GPS badge */}
          {complaint.gps_accuracy !== undefined && (
            <div className="inline-flex items-center gap-1 rounded-full bg-primary/5 px-2 py-0.5">
              <Navigation className="size-2.5 text-primary" />
              <span className="text-[9px] font-medium text-primary">
                GPS {complaint.gps_accuracy <= 30 ? "Verified" : "Captured"}
              </span>
            </div>
          )}

          {/* Evidence score */}
          {complaint.evidence_score !== undefined && (
            <div
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5",
                complaint.evidence_score >= 70
                  ? "bg-success/10 text-success"
                  : complaint.evidence_score >= 40
                    ? "bg-amber-500/10 text-amber-500"
                    : "bg-destructive/10 text-destructive"
              )}
            >
              <Shield className="size-2.5" />
              <span className="text-[9px] font-bold">
                {Math.round(complaint.evidence_score)}
              </span>
            </div>
          )}

          {/* Ward / Village */}
          {(complaint.ward || complaint.village) && (
            <div className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">
              <MapPin className="size-2.5 text-muted-foreground" />
              <span className="text-[9px] text-muted-foreground">
                {complaint.village || ""} {complaint.ward ? `Ward ${complaint.ward}` : ""}
              </span>
            </div>
          )}

          {/* Department */}
          {complaint.department && (
            <div className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">
              <Building2 className="size-2.5 text-muted-foreground" />
              <span className="text-[9px] text-muted-foreground truncate max-w-[100px]">
                {complaint.department}
              </span>
            </div>
          )}

          {/* Duplicate / Cluster */}
          {complaint.duplicate_count !== undefined && complaint.duplicate_count > 0 && (
            <IssueClusterBadge
              clusterUid={complaint.cluster_uid || ""}
              reportCount={complaint.duplicate_count + 1}
              severity={complaint.severity}
            />
          )}

          {/* AI Confidence */}
          {complaint.ai_confidence !== undefined && complaint.ai_confidence > 0 && (
            <div className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5">
              <span className="text-[9px] text-accent-foreground font-medium">
                AI {Math.round(complaint.ai_confidence * 100)}%
              </span>
            </div>
          )}
        </div>
      )}

      {/* Engagement + Progress */}
      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <ThumbsUp className="size-3" />
            {complaint.upvotes}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MessageSquare className="size-3" />
            {complaint.comments}
          </div>
        </div>
        <span className="text-[11px] text-muted-foreground">
          {complaint.createdAt}
        </span>
      </div>

      <div className="mt-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                complaint.progress === 100 ? "bg-success" : "bg-primary",
              )}
              style={{ width: `${complaint.progress}%` }}
            />
          </div>
          <span className="text-[11px] font-medium text-muted-foreground">
            {complaint.progress}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}
