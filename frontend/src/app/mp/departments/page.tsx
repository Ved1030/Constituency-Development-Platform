"use client";

import { motion } from "framer-motion";
import { Building2, TrendingUp, Users, FolderKanban, IndianRupee, Brain } from "lucide-react";
import { departments } from "@/data/mock-mp";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";

const departmentIcons: Record<string, string> = {
  "Roads & Infrastructure": "🚧",
  "Water Supply": "💧",
  "Electricity": "⚡",
  "Healthcare": "🏥",
  "Education": "🏫",
  "Sanitation": "🗑",
  "Public Safety": "🛡",
  "Housing": "🏠",
};

const riskLevels: Record<string, string> = {
  "Roads & Infrastructure": "medium",
  "Water Supply": "high",
  "Electricity": "low",
  "Healthcare": "low",
  "Education": "low",
  "Sanitation": "high",
  "Public Safety": "low",
  "Housing": "medium",
};

export default function DepartmentsPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2">
          <Building2 className="size-5 text-cyan-600" />
          <h1 className="text-2xl font-bold text-foreground">{t("mp.departments.title")}</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{t("mp.departments.subtitle")}</p>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: t("mp.departments.totalDepartments"), value: "8", icon: Building2, color: "text-cyan-600", bg: "bg-cyan-50" },
          { label: t("mp.departments.totalBudget"), value: "₹37.7 Cr", icon: IndianRupee, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: t("mp.departments.activeProjects"), value: "47", icon: FolderKanban, color: "text-primary", bg: "bg-blue-50" },
          { label: t("mp.departments.avgSatisfaction"), value: "79%", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-border bg-card p-5 hover:shadow-md transition-shadow"
          >
            <div className={cn("flex size-9 items-center justify-center rounded-xl", stat.bg)}>
              <stat.icon className={cn("size-4", stat.color)} />
            </div>
            <div className="mt-3 text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Department Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {departments.map((dept, i) => {
          const utilization = Math.round((dept.spent / dept.budget) * 100);
          const risk = riskLevels[dept.name] || "low";
          const icon = departmentIcons[dept.name] || "🏛";

          return (
            <motion.div
              key={dept.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-lg cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-xl">
                    {icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{dept.name}</h3>
                    <span className={cn(
                      "mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                      risk === "high" ? "bg-red-50 text-red-600" :
                      risk === "medium" ? "bg-amber-50 text-amber-600" :
                      "bg-emerald-50 text-emerald-600",
                    )}>
                      {t("mp.departments.aiRisk", { level: risk })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-muted/50 p-3">
                  <div className="text-xs text-muted-foreground">{t("mp.departments.complaints")}</div>
                  <div className="mt-1 text-lg font-bold text-foreground">{dept.complaints.toLocaleString("en-IN")}</div>
                  <div className="text-[10px] text-emerald-600">{t("mp.departments.resolved", { count: dept.resolved })}</div>
                </div>
                <div className="rounded-xl bg-muted/50 p-3">
                  <div className="text-xs text-muted-foreground">{t("mp.departments.avgDays")}</div>
                  <div className="mt-1 text-lg font-bold text-foreground">{dept.avgDays}</div>
                  <div className="text-[10px] text-muted-foreground">{t("mp.departments.resolutionTime")}</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{t("mp.departments.budgetLakh", { value: (dept.budget / 100000).toFixed(0) })}</span>
                  <span className={cn("font-semibold", utilization > 85 ? "text-amber-600" : "text-emerald-600")}>{utilization}%</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn("h-full rounded-full transition-all", utilization > 85 ? "bg-amber-500" : "bg-primary")}
                    style={{ width: `${utilization}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="size-3" />
                  {t("mp.departments.satisfaction", { value: dept.satisfaction })}
                </div>
                <div className="flex items-center gap-1 text-xs text-primary/70">
                  <Brain className="size-3" />
                  {t("mp.departments.aiScore", { value: Math.round(dept.satisfaction * 1.05) })}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
