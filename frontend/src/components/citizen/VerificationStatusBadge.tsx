"use client";

import { Shield, ShieldCheck, ShieldAlert, ShieldX, ShieldQuestion } from "lucide-react";
import { cn } from "@/lib/utils";

type VerificationStatus =
  | "verified"
  | "partially_verified"
  | "unverified"
  | "insufficient_evidence";

interface VerificationStatusBadgeProps {
  status: VerificationStatus;
  confidence?: number;
  size?: "sm" | "md";
}

const statusConfig: Record<
  VerificationStatus,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bg: string;
  }
> = {
  verified: {
    label: "Verified",
    icon: ShieldCheck,
    color: "text-success",
    bg: "bg-success/10",
  },
  partially_verified: {
    label: "Partial",
    icon: ShieldAlert,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  unverified: {
    label: "Pending",
    icon: ShieldQuestion,
    color: "text-muted-foreground",
    bg: "bg-muted",
  },
  insufficient_evidence: {
    label: "Insufficient",
    icon: ShieldX,
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
};

export function VerificationStatusBadge({
  status,
  confidence,
  size = "sm",
}: VerificationStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.unverified;
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5",
        config.bg
      )}
    >
      <Icon className={cn("size-3", config.color)} />
      <span className={cn("text-[10px] font-semibold", config.color)}>
        {config.label}
      </span>
      {confidence !== undefined && (
        <span className="text-[9px] text-muted-foreground">
          {Math.round(confidence * 100)}%
        </span>
      )}
    </div>
  );
}
