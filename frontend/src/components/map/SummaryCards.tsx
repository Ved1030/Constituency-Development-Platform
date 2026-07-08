"use client";

import { AlertTriangle, AlertCircle, Info, CheckCircle, Activity, Shield } from "lucide-react";
import type { DigitalTwinComplaint } from "@/types/digital-twin";
import { PRIORITY_COLORS } from "@/types/digital-twin";

interface SummaryCardsProps {
  complaints: DigitalTwinComplaint[];
}

export default function SummaryCards({ complaints }: SummaryCardsProps) {
  const counts = {
    critical: complaints.filter((c) => c.priority === "Critical").length,
    high: complaints.filter((c) => c.priority === "High").length,
    medium: complaints.filter((c) => c.priority === "Medium").length,
    low: complaints.filter((c) => c.priority === "Low").length,
    resolved: complaints.filter((c) => c.status === "Resolved" || c.status === "Closed").length,
    total: complaints.length,
  };

  const cards = [
    { label: "Critical", value: counts.critical, icon: AlertTriangle, color: PRIORITY_COLORS.Critical, bg: "bg-red-500/10" },
    { label: "High", value: counts.high, icon: AlertCircle, color: PRIORITY_COLORS.High, bg: "bg-orange-500/10" },
    { label: "Medium", value: counts.medium, icon: Info, color: PRIORITY_COLORS.Medium, bg: "bg-yellow-500/10" },
    { label: "Low", value: counts.low, icon: CheckCircle, color: PRIORITY_COLORS.Low, bg: "bg-green-500/10" },
    { label: "Resolved", value: counts.resolved, icon: Shield, color: "#3b82f6", bg: "bg-blue-500/10" },
    { label: "Total", value: counts.total, icon: Activity, color: "#64748b", bg: "bg-slate-500/10" },
  ];

  return (
    <div className="flex shrink-0 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="flex flex-1 items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm"
          >
            <div className={`flex size-10 items-center justify-center rounded-xl ${card.bg}`}>
              <Icon className="size-5" style={{ color: card.color }} />
            </div>
            <div>
              <span className="text-xl font-bold text-foreground" style={{ color: card.label === "Total" ? undefined : card.color }}>
                {card.value}
              </span>
              <p className="text-[11px] font-medium text-muted-foreground leading-tight">{card.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
