"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Bell,
  MapPin,
  Brain,
} from "lucide-react";

const kpiCards = [
  {
    label: "Complaints",
    value: "2,847",
    change: "+12%",
    color: "from-primary to-accent",
    icon: BarChart3,
  },
  {
    label: "Resolved",
    value: "1,923",
    change: "+8%",
    color: "from-emerald-500 to-teal-500",
    icon: CheckCircle2,
  },
  {
    label: "Budget",
    value: "₹24.5Cr",
    change: "78%",
    color: "from-violet-500 to-purple-500",
    icon: Clock,
  },
  {
    label: "Satisfaction",
    value: "87%",
    change: "+3%",
    color: "from-amber-500 to-orange-500",
    icon: AlertTriangle,
  },
];

const chartBars = [35, 55, 42, 68, 52, 78, 65, 85, 72, 92, 78, 95];
const heatmapColors = [
  ["#dcfce7", "#bbf7d0", "#86efac", "#4ade80", "#22c55e"],
  ["#bbf7d0", "#86efac", "#fde68a", "#fbbf24", "#f59e0b"],
  ["#86efac", "#fde68a", "#fbbf24", "#fb923c", "#ef4444"],
  ["#fde68a", "#fbbf24", "#fb923c", "#ef4444", "#dc2626"],
];

export function DashboardMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
      className="relative"
    >
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 blur-2xl" />

      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card shadow-2xl shadow-primary/10">
        <div className="flex items-center gap-2 border-b border-border/50 bg-muted/30 px-4 py-3">
          <div className="size-2.5 rounded-full bg-[#ff5f57]" />
          <div className="size-2.5 rounded-full bg-[#febc2e]" />
          <div className="size-2.5 rounded-full bg-[#28c840]" />
          <div className="ml-3 flex items-center gap-1.5 rounded-md bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-success" />
            cdp.gov.in/dashboard
          </div>
        </div>

        <div className="p-4">
          <div className="mb-3 grid grid-cols-4 gap-2">
            {kpiCards.map((kpi, i) => (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="rounded-xl border border-border/50 bg-card p-2.5"
              >
                <div className="flex items-center gap-1.5">
                  <div
                    className={`flex size-5 items-center justify-center rounded-md bg-gradient-to-br ${kpi.color}`}
                  >
                    <kpi.icon className="size-3 text-white" />
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {kpi.label}
                  </span>
                </div>
                <div className="mt-1 text-sm font-bold text-foreground">
                  {kpi.value}
                </div>
                <div className="text-[10px] text-success">{kpi.change}</div>
              </motion.div>
            ))}
          </div>

          <div className="mb-3 grid grid-cols-3 gap-2">
            <div className="col-span-2 rounded-xl border border-border/50 bg-card p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-medium text-muted-foreground">
                  Complaint Trends
                </span>
                <span className="text-[10px] text-success">+18% this month</span>
              </div>
              <div className="flex items-end gap-1" style={{ height: 64 }}>
                {chartBars.map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.8 + i * 0.05, duration: 0.5 }}
                    className="flex-1 origin-bottom rounded-t-sm bg-gradient-to-t from-primary/60 to-accent/40"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border/50 bg-card p-3">
              <div className="mb-2 flex items-center gap-1.5">
                <Brain className="size-3 text-primary" />
                <span className="text-[10px] font-medium text-muted-foreground">
                  AI Confidence
                </span>
              </div>
              <div className="relative mx-auto size-20">
                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-muted/50"
                  />
                  <motion.circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="88"
                    initial={{ strokeDashoffset: 88 }}
                    animate={{ strokeDashoffset: 8 }}
                    transition={{ delay: 1, duration: 1.5 }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#2563EB" />
                      <stop offset="100%" stopColor="#4F46E5" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-sm font-bold text-foreground">94%</span>
                  <span className="text-[8px] text-muted-foreground">
                    Confidence
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-border/50 bg-card p-2.5">
              <div className="mb-2 text-[10px] font-medium text-muted-foreground">
                Heatmap
              </div>
              <div className="grid grid-cols-5 gap-0.5">
                {heatmapColors.flat().map((color, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 + i * 0.02 }}
                    className="aspect-square rounded-[2px]"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border/50 bg-card p-2.5">
              <div className="mb-2 text-[10px] font-medium text-muted-foreground">
                Need vs Spend
              </div>
              <div className="space-y-1.5">
                {[
                  { label: "Water", need: 85, spend: 62 },
                  { label: "Roads", need: 72, spend: 78 },
                  { label: "Health", need: 90, spend: 45 },
                ].map((item) => (
                  <div key={item.label} className="space-y-0.5">
                    <div className="flex justify-between text-[8px] text-muted-foreground">
                      <span>{item.label}</span>
                      <span className="text-primary">{item.spend}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.spend}%` }}
                        transition={{ delay: 1.4, duration: 0.8 }}
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border/50 bg-card p-2.5">
              <div className="mb-2 text-[10px] font-medium text-muted-foreground">
                Priority
              </div>
              <div className="space-y-1">
                {[
                  { name: "Water Supply", score: 94, color: "bg-primary" },
                  { name: "Road Repair", score: 88, color: "bg-accent" },
                  { name: "Street Light", score: 76, color: "bg-success" },
                ].map((item) => (
                  <div key={item.name} className="flex items-center gap-1">
                    <div className={`size-1.5 rounded-full ${item.color}`} />
                    <span className="flex-1 truncate text-[8px] text-muted-foreground">
                      {item.name}
                    </span>
                    <span className="text-[8px] font-semibold text-foreground">
                      {item.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="absolute -right-4 -bottom-6 rounded-xl border border-border bg-card p-3 shadow-xl"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
            <Bell className="size-4 text-primary" />
          </div>
          <div>
            <div className="text-xs font-semibold text-foreground">
              New Priority Alert
            </div>
            <div className="text-[10px] text-muted-foreground">
              Water supply issue — Ward 12
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.3, duration: 0.5 }}
        className="absolute -left-4 top-8 rounded-xl border border-border bg-card p-3 shadow-xl"
      >
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-success/10">
            <MapPin className="size-3.5 text-success" />
          </div>
          <div>
            <div className="text-[10px] font-semibold text-foreground">
              Geo Cluster Found
            </div>
            <div className="text-[9px] text-muted-foreground">
              23 issues in 0.5km radius
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
