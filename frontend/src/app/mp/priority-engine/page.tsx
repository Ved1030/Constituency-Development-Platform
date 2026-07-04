"use client";

import { motion } from "framer-motion";
import { AlertTriangle, TrendingUp, Clock, MapPin, ChevronRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const priorities = [
  {
    rank: 1,
    title: "Water Pipeline Emergency — Velachery",
    category: "Water Supply",
    severity: "critical",
    score: 98,
    affectedCitizens: 38300,
    village: "Velachery",
    deadline: "7 days",
    aiConfidence: 92,
    reason: "78% probability of supply failure. Aging infrastructure + seasonal demand surge.",
    actions: ["Emergency pipeline audit", "Deploy tanker backup", "Allocate ₹1.2 Cr"],
  },
  {
    rank: 2,
    title: "Road Budget Overspend Prevention",
    category: "Budget",
    severity: "critical",
    score: 95,
    affectedCitizens: 0,
    village: "Constituency-wide",
    deadline: "Immediate",
    aiConfidence: 95,
    reason: "79% utilization with Q4 remaining. ₹2.3 Cr savings possible through batch contracting.",
    actions: ["Implement batch contracting", "Reallocate ₹2.3 Cr", "Freeze non-critical road spend"],
  },
  {
    rank: 3,
    title: "Healthcare Access Gap — Wards 5 & 7",
    category: "Healthcare",
    severity: "high",
    score: 89,
    affectedCitizens: 15200,
    village: "Ward 5, Ward 7",
    deadline: "30 days",
    aiConfidence: 88,
    reason: "Healthcare access score below 40. 15,200 citizens lack adequate PHC coverage.",
    actions: ["Deploy mobile health units", "Increase PHC staffing", "Add 2 new PHCs"],
  },
  {
    rank: 4,
    title: "Sanitation Infrastructure Overhaul",
    category: "Sanitation",
    severity: "high",
    score: 85,
    affectedCitizens: 22400,
    village: "Gandhi Nagar, Krishna Nagar",
    deadline: "60 days",
    aiConfidence: 90,
    reason: "87% complaints from 3 wards. Root cause: outdated sewage infrastructure.",
    actions: ["Sewage line replacement", "Drainage clearing", "Allocate ₹80 Lakh"],
  },
  {
    rank: 5,
    title: "School Infrastructure Safety Upgrade",
    category: "Education",
    severity: "medium",
    score: 78,
    affectedCitizens: 12400,
    village: "Multiple",
    deadline: "90 days",
    aiConfidence: 86,
    reason: "5 schools below safety thresholds. Renovation has 3.1x ROI vs new construction.",
    actions: ["Structural assessment", "Prioritize renovation budget", "Fast-track contractor bidding"],
  },
  {
    rank: 6,
    title: "Northeast Monsoon Preparedness",
    category: "Sanitation",
    severity: "medium",
    score: 72,
    affectedCitizens: 45000,
    village: "Wards 5, 8, 12",
    deadline: "Before October",
    aiConfidence: 90,
    reason: "Low-lying wards at flood risk. Pre-monsoon drainage clearing essential.",
    actions: ["Clear drainage channels", "Deploy sandbag reserves", "Issue early warning system"],
  },
];

const severityConfig: Record<string, { bg: string; text: string; border: string }> = {
  critical: { bg: "bg-red-50 text-red-600", text: "text-red-600", border: "border-red-200" },
  high: { bg: "bg-amber-50 text-amber-600", text: "text-amber-600", border: "border-amber-200" },
  medium: { bg: "bg-blue-50 text-primary", text: "text-primary", border: "border-blue-200" },
};

export default function AIPriorityEnginePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-amber-600" />
            <h1 className="text-2xl font-bold text-foreground">AI Priority Engine</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Ranked by AI-calculated urgency score. Updated every 6 hours.</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 border border-amber-200">
          <Zap className="size-4 text-amber-600" />
          <span className="text-xs text-amber-700 font-medium">Last updated: 2 hours ago</span>
        </div>
      </motion.div>

      {/* Priority List */}
      <div className="space-y-4">
        {priorities.map((item, i) => {
          const sev = severityConfig[item.severity];
          return (
            <motion.div
              key={item.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className={cn(
                "rounded-2xl border bg-card p-5 transition-all hover:shadow-md cursor-pointer",
                sev.border,
              )}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                {/* Rank */}
                <div className="flex items-center gap-4 lg:min-w-[200px]">
                  <div className={cn(
                    "flex size-12 items-center justify-center rounded-xl text-lg font-black",
                    sev.bg,
                  )}>
                    #{item.rank}
                  </div>
                  <div>
                    <div className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase", sev.bg)}>
                      {item.severity}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">Score: {item.score}/100</div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.reason}</p>

                  {/* Meta */}
                  <div className="mt-3 flex flex-wrap gap-3">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3" />
                      {item.village}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3" />
                      {item.deadline}
                    </span>
                    {item.affectedCitizens > 0 && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <TrendingUp className="size-3" />
                        {item.affectedCitizens.toLocaleString("en-IN")} citizens
                      </span>
                    )}
                    <span className="text-xs text-primary/70 font-medium">
                      AI Confidence: {item.aiConfidence}%
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.actions.map((action) => (
                      <span key={action} className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground border border-border">
                        {action}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight className="size-5 text-muted-foreground hidden lg:block mt-1" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
