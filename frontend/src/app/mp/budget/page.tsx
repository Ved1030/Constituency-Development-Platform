"use client";

import { motion } from "framer-motion";
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Brain,
  PieChart as PieChartIcon,
  BarChart3,
  Target,
  Lightbulb,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Treemap,
} from "recharts";
import { budgetAllocations, sectorSpending } from "@/data/mock-mp";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";

const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#f97316"];

const budgetData = budgetAllocations.map((b) => ({
  name: b.department.split(" ")[0],
  allocated: b.allocated / 100000,
  spent: b.spent / 100000,
  remaining: (b.allocated - b.spent) / 100000,
  utilization: Math.round((b.spent / b.allocated) * 100),
}));

const pieData = budgetAllocations.map((b) => ({
  name: b.department.split(" ")[0],
  value: b.allocated / 100000,
}));

const totalAllocated = budgetAllocations.reduce((s, b) => s + b.allocated, 0);
const totalSpent = budgetAllocations.reduce((s, b) => s + b.spent, 0);
const overallUtilization = Math.round((totalSpent / totalAllocated) * 100);

const optimizations = [
  {
    title: "Batch Road Repairs",
    saving: "₹2.3 Cr",
    description: "Consolidate 47 small road repairs into 5 geographic batches. Reduces contractor mobilization costs by 32%.",
    confidence: 95,
    impact: "High",
  },
  {
    title: "Solar Street Light Phase 3",
    saving: "₹45 Lakh",
    description: "Shift remaining street lights to solar. Eliminates ₹45L annual electricity cost.",
    confidence: 88,
    impact: "Medium",
  },
  {
    title: "School Renovation vs New Build",
    saving: "₹1.8 Cr",
    description: "Renovate 5 existing schools instead of building 2 new ones. 3.1x higher ROI with same beneficiary count.",
    confidence: 86,
    impact: "High",
  },
  {
    title: "Water Tanker Contract Renegotiation",
    saving: "₹68 Lakh",
    description: "Switch from per-trip to monthly retainer contracts for emergency water tankers.",
    confidence: 91,
    impact: "Medium",
  },
];

export default function BudgetPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2">
          <IndianRupee className="size-5 text-emerald-600" />
          <h1 className="text-2xl font-bold text-foreground">{t("mp.budget.title")}</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{t("mp.budget.subtitle")}</p>
      </motion.div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: t("mp.budget.totalBudget"), value: "₹37.7 Cr", icon: IndianRupee, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: t("mp.budget.totalSpent"), value: "₹28.0 Cr", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
          { label: t("mp.budget.remaining"), value: "₹9.7 Cr", icon: Target, color: "text-amber-600", bg: "bg-amber-50" },
          { label: t("mp.budget.utilization"), value: `${overallUtilization}%`, icon: PieChartIcon, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <div className={cn("flex size-9 items-center justify-center rounded-xl", stat.bg)}>
              <stat.icon className={cn("size-4", stat.color)} />
            </div>
            <div className="mt-3 text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <h3 className="mb-4 text-sm font-semibold text-foreground">{t("mp.budget.allocationVsSpending")}</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748B" }} />
                <YAxis tick={{ fontSize: 10, fill: "#64748B" }} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", background: "white" }} />
                <Bar dataKey="allocated" fill="#E2E8F0" radius={[4, 4, 0, 0]} name="Allocated (L)" />
                <Bar dataKey="spent" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Spent (L)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <h3 className="mb-4 text-sm font-semibold text-foreground">{t("mp.budget.distribution")}</h3>
          <div className="flex items-center gap-8">
            <div className="size-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="value">
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", background: "white" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="size-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[i] }} />
                  <span className="flex-1 text-xs text-muted-foreground">{d.name}</span>
                  <span className="text-xs font-semibold text-foreground">₹{d.value.toFixed(0)}L</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Department Utilization */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <h3 className="mb-4 text-sm font-semibold text-foreground">{t("mp.budget.deptUtilization")}</h3>
        <div className="space-y-3">
          {budgetData.map((dept, i) => (
            <div key={dept.name} className="flex items-center gap-4">
              <span className="w-24 text-xs text-muted-foreground truncate">{dept.name}</span>
              <div className="flex-1 h-2.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    dept.utilization >= 85 ? "bg-amber-500" :
                    dept.utilization >= 70 ? "bg-blue-500" :
                    "bg-emerald-500",
                  )}
                  style={{ width: `${dept.utilization}%` }}
                />
              </div>
              <span className={cn(
                "w-10 text-right text-xs font-semibold",
                dept.utilization >= 85 ? "text-amber-600" :
                dept.utilization >= 70 ? "text-blue-600" :
                "text-emerald-600",
              )}>
                {dept.utilization}%
              </span>
              <span className="w-20 text-right text-[10px] text-muted-foreground">₹{dept.spent.toFixed(0)}L</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* AI Optimization Recommendations */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Brain className="size-5 text-purple-600" />
          <h2 className="text-lg font-bold text-foreground">{t("mp.budget.aiOptimizationRecommendations")}</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {optimizations.map((opt, i) => (
            <motion.div
              key={opt.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-border bg-card p-5 hover:border-purple-200 hover:bg-muted transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="size-4 text-amber-600" />
                  <h3 className="text-sm font-semibold text-foreground">{opt.title}</h3>
                </div>
                <span className="text-lg font-bold text-emerald-600">{opt.saving}</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{opt.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-bold",
                  opt.impact === "High" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600",
                )}>
                  {opt.impact === "High" ? t("mp.budget.highImpact") : t("mp.budget.mediumImpact")}
                </span>
                <span className="text-[10px] text-purple-400">{t("mp.budget.aiConfidence", { value: opt.confidence })}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
