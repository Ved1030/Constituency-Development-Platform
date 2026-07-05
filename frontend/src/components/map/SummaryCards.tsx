"use client";

import { AlertTriangle, AlertCircle, Info, CheckCircle, CircleDot, Inbox } from "lucide-react";
import type { DigitalTwinComplaint } from "@/types/digital-twin";

interface SummaryCardsProps {
  complaints: DigitalTwinComplaint[];
}

export default function SummaryCards({ complaints }: SummaryCardsProps) {
  const counts = {
    critical: complaints.filter((c) => c.priority === "Critical").length,
    high: complaints.filter((c) => c.priority === "High").length,
    medium: complaints.filter((c) => c.priority === "Medium").length,
    low: complaints.filter((c) => c.priority === "Low").length,
    resolvedToday: complaints.filter((c) => {
      const today = new Date().toDateString();
      return c.status === "Resolved" && new Date(c.reportedAt).toDateString() === today;
    }).length,
    open: complaints.filter((c) => c.status === "Open").length,
  };

  const cards = [
    { label: "Critical", value: counts.critical, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-500/10" },
    { label: "High", value: counts.high, icon: AlertCircle, color: "text-orange-600", bg: "bg-orange-500/10" },
    { label: "Medium", value: counts.medium, icon: Info, color: "text-yellow-600", bg: "bg-yellow-500/10" },
    { label: "Low", value: counts.low, icon: CheckCircle, color: "text-green-600", bg: "bg-green-500/10" },
    { label: "Resolved Today", value: counts.resolvedToday, icon: CircleDot, color: "text-emerald-600", bg: "bg-emerald-500/10" },
    { label: "Open", value: counts.open, icon: Inbox, color: "text-blue-600", bg: "bg-blue-500/10" },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="rounded-xl border border-border bg-card/95 backdrop-blur-sm p-3">
            <div className="flex items-center gap-2">
              <div className={`rounded-lg p-1 ${card.bg}`}>
                <Icon className={`size-3.5 ${card.color}`} />
              </div>
              <span className="text-lg font-bold text-foreground">{card.value}</span>
            </div>
            <p className="mt-1 text-[10px] font-medium text-muted-foreground">{card.label}</p>
          </div>
        );
      })}
    </div>
  );
}
