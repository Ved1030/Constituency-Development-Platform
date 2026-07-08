"use client";

import { motion } from "framer-motion";
import { Users, FileText, AlertTriangle, IndianRupee, TrendingUp, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { useConstituency } from "@/context/ConstituencyContext";

export function KPIRow() {
  const { data } = useConstituency();
  const budgetValue = parseFloat(data.currentBudget.replace(/[₹,Cr\s]/g, "")) || 0;
  const mpladsValue = parseFloat(data.mpladsFund.replace(/[₹,Cr\s]/g, "")) || 5;
  const totalComplaints = data.villages.reduce((s, v) => s + v.complaints, 0);
  const criticalCount = data.villages.reduce((s, v) => s + v.criticalComplaints, 0);
  const satisfactionScore = Math.round(100 - (criticalCount / Math.max(totalComplaints, 1)) * 100);
  const avgConfidence = Math.round(data.priorities.reduce((s, p) => s + p.confidence, 0) / Math.max(data.priorities.length, 1));
  const usedMplads = Math.round(mpladsValue * 0.64 * 10) / 10;
  const remainingMplads = Math.round((mpladsValue - usedMplads) * 10) / 10;

  const kpis = [
    {
      label: "Population",
      value: data.populationNumeric,
      display: data.population,
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      bg: "bg-blue-50 dark:bg-blue-500/10",
      iconBg: "bg-blue-100 dark:bg-blue-500/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      trend: { value: 2.3, label: "vs last quarter", up: true },
      detail: `${data.urbanRuralSplit.urban}% Urban · ${data.villages.length} villages`,
    },
    {
      label: "Complaints",
      value: totalComplaints,
      display: totalComplaints.toLocaleString("en-IN"),
      icon: FileText,
      color: "from-violet-500 to-purple-500",
      bg: "bg-violet-50 dark:bg-violet-500/10",
      iconBg: "bg-violet-100 dark:bg-violet-500/20",
      iconColor: "text-violet-600 dark:text-violet-400",
      trend: { value: 8.2, label: "vs last month", up: false },
      detail: `${criticalCount} critical · ${data.wards.length} wards active`,
    },
    {
      label: "Critical Issues",
      value: criticalCount,
      display: String(criticalCount),
      icon: AlertTriangle,
      color: "from-red-500 to-rose-500",
      bg: "bg-red-50 dark:bg-red-500/10",
      iconBg: "bg-red-100 dark:bg-red-500/20",
      iconColor: "text-red-600 dark:text-red-400",
      trend: { value: 12, label: "need immediate action", up: true },
      detail: `${data.priorities.filter(p => p.urgency >= 85).length} high urgency · AI verified`,
    },
    {
      label: "MPLADS Remaining",
      value: remainingMplads,
      display: `₹${remainingMplads}Cr`,
      icon: IndianRupee,
      color: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      iconBg: "bg-emerald-100 dark:bg-emerald-500/20",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      trend: { value: 36, label: "% unspent", up: false },
      detail: `₹${usedMplads}Cr spent · ₹${mpladsValue}Cr total`,
    },
    {
      label: "Citizen Satisfaction",
      value: satisfactionScore,
      display: `${satisfactionScore}%`,
      icon: TrendingUp,
      color: "from-amber-500 to-orange-500",
      bg: "bg-amber-50 dark:bg-amber-500/10",
      iconBg: "bg-amber-100 dark:bg-amber-500/20",
      iconColor: "text-amber-600 dark:text-amber-400",
      trend: { value: 4, label: "vs last quarter", up: satisfactionScore > 50 },
      detail: `${data.projects.length} projects active`,
    },
    {
      label: "AI Health Score",
      value: avgConfidence,
      display: `${avgConfidence}%`,
      icon: Brain,
      color: "from-purple-500 to-indigo-500",
      bg: "bg-purple-50 dark:bg-purple-500/10",
      iconBg: "bg-purple-100 dark:bg-purple-500/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      trend: { value: data.priorities.length, label: "priorities tracked", up: true },
      detail: `${data.name} · ${data.state}`,
    },
  ];

  return (
    <div className="px-4 pt-4 lg:px-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06 }}
            className="group relative overflow-hidden rounded-xl border border-border/60 bg-card p-4 transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <div className={cn("absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r", kpi.color)} />

            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground truncate">
                  {kpi.label}
                </div>
                <div className="mt-1.5 flex items-baseline gap-1">
                  <span className="text-xl font-bold tracking-tight text-foreground">{kpi.display}</span>
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  <div
                    className={cn(
                      "flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-medium",
                      kpi.trend.up
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                    )}
                  >
                    <span>{kpi.trend.label}</span>
                  </div>
                </div>
              </div>
              <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", kpi.iconBg)}>
                <kpi.icon className={cn("size-[18px]", kpi.iconColor)} />
              </div>
            </div>

            <div className="mt-1.5 text-[9px] text-muted-foreground truncate">{kpi.detail}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
