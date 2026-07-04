"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: LucideIcon;
  color: string;
  index?: number;
}

const colorMap: Record<string, string> = {
  primary: "from-primary/10 to-primary/5 text-primary",
  secondary: "from-secondary/10 to-secondary/5 text-secondary",
  accent: "from-accent/10 to-accent/5 text-accent",
  success: "from-emerald-50 to-emerald-100/50 text-emerald-600",
  danger: "from-red-50 to-red-100/50 text-red-600",
  warning: "from-amber-50 to-amber-100/50 text-amber-600",
  "chart-3": "from-blue-50 to-blue-100/50 text-blue-600",
};

const iconBgMap: Record<string, string> = {
  primary: "bg-primary/15",
  secondary: "bg-secondary/15",
  accent: "bg-accent/15",
  success: "bg-emerald-100",
  danger: "bg-red-100",
  warning: "bg-amber-100",
  "chart-3": "bg-blue-100",
};

export function StatCard({ label, value, change, changeLabel, icon: Icon, color, index = 0 }: StatCardProps) {
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between">
        <div className={cn("flex size-12 items-center justify-center rounded-2xl", iconBgMap[color] || "bg-primary/15")}>
          <Icon className={cn("size-6", colorMap[color]?.split(" ").pop() || "text-primary")} />
        </div>
        <div className={cn(
          "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
          isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600",
        )}>
          {isPositive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
          {isPositive ? "+" : ""}{change}%
        </div>
      </div>
      <div className="mt-4">
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="mt-1 text-sm text-muted-foreground">{label}</div>
        <div className="mt-1 text-xs text-muted-foreground">{changeLabel}</div>
      </div>
    </motion.div>
  );
}
