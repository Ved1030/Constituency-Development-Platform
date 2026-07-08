"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Lightbulb, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useConstituency } from "@/context/ConstituencyContext";

const DEPT_COLORS: Record<string, { color: string; bg: string; text: string }> = {
  "Water Supply": { color: "#0ea5e9", bg: "bg-sky-50 dark:bg-sky-500/10", text: "text-sky-600 dark:text-sky-400" },
  Roads: { color: "#f97316", bg: "bg-orange-50 dark:bg-orange-500/10", text: "text-orange-600 dark:text-orange-400" },
  Healthcare: { color: "#10b981", bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400" },
  Education: { color: "#8b5cf6", bg: "bg-purple-50 dark:bg-purple-500/10", text: "text-purple-600 dark:text-purple-400" },
  Sanitation: { color: "#78716c", bg: "bg-stone-50 dark:bg-stone-500/10", text: "text-stone-600 dark:text-stone-400" },
  Electricity: { color: "#eab308", bg: "bg-yellow-50 dark:bg-yellow-500/10", text: "text-yellow-600 dark:text-yellow-400" },
  Housing: { color: "#6366f1", bg: "bg-indigo-50 dark:bg-indigo-500/10", text: "text-indigo-600 dark:text-indigo-400" },
  Agriculture: { color: "#22c55e", bg: "bg-green-50 dark:bg-green-500/10", text: "text-green-600 dark:text-green-400" },
};

const DEFAULT_DEPT = { color: "#6b7280", bg: "bg-gray-50 dark:bg-gray-500/10", text: "text-gray-600" };

export function NeedVsSpend() {
  const { data } = useConstituency();

  const departments = useMemo(() => {
    // Map priorities to department data
    const deptMap = new Map<string, { complaints: number; color: string; bg: string }>();
    for (const p of data.priorities) {
      const existing = deptMap.get(p.department);
      const dept = DEPT_COLORS[p.department] || DEFAULT_DEPT;
      deptMap.set(p.department, {
        complaints: (existing?.complaints || 0) + p.population,
        color: dept.color,
        bg: dept.bg,
      });
    }

    // Known departments mapping
    const knownDepts = ["Water Supply", "Roads", "Healthcare", "Education", "Housing", "Agriculture", "Electricity", "Sanitation"];
    const budgetUtil: Record<string, number> = {
      "Water Supply": 75, "Roads": 79, "Healthcare": 84, "Education": 82,
      "Housing": 79, "Agriculture": 68, "Electricity": 82, "Sanitation": 83,
    };

    return knownDepts.map((name) => {
      const info = deptMap.get(name);
      const dept = DEPT_COLORS[name] || DEFAULT_DEPT;
      const complaints = info?.complaints || data.priorities.filter(p => p.department === name).reduce((s, p) => s + p.population, 0);
      const govtSpend = budgetUtil[name] || 75;
      const maxDemand = 100000; // Normalized for display
      const demandNormalized = Math.min(100, Math.round((complaints / maxDemand) * 100));
      const gap = 100 - govtSpend + (demandNormalized > govtSpend ? (demandNormalized - govtSpend) * 0.3 : 0);
      const gapRounded = Math.min(45, Math.max(3, Math.round(gap)));

      return { name, citizenDemand: Math.round(complaints / 100), govtSpend, gap: gapRounded, ...dept };
    });
  }, [data]);

  const maxDemand = Math.max(...departments.map((d) => d.citizenDemand));

  return (
    <div className="px-4 pt-4 lg:px-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-2xl border border-border/60 bg-card p-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="size-4 text-amber-500" />
            <h2 className="text-sm font-bold text-foreground">Need vs Spend</h2>
            <span className="rounded-full bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
              {data.name}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-4">
          {departments.map((dept, i) => (
            <motion.div
              key={dept.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.04 }}
              className={cn("rounded-xl border border-border/60 p-4 transition-all hover:shadow-sm", dept.bg)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-lg" style={{ backgroundColor: `${dept.color}20` }}>
                    <div className="size-2.5 rounded-full" style={{ backgroundColor: dept.color }} />
                  </div>
                  <span className="text-xs font-semibold text-foreground">{dept.name}</span>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-medium",
                    dept.gap >= 20
                      ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                      : dept.gap >= 10
                        ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                        : "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                  )}
                >
                  {dept.gap >= 20 ? (
                    <TrendingDown className="size-2.5" />
                  ) : (
                    <TrendingUp className="size-2.5" />
                  )}
                  Gap {dept.gap}%
                </div>
              </div>

              {/* Citizen Demand Bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground">Citizen Demand</span>
                  <span className="font-medium text-foreground">{dept.citizenDemand} complaints</span>
                </div>
                <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(dept.citizenDemand / maxDemand) * 100}%`,
                      backgroundColor: dept.color,
                    }}
                  />
                </div>
              </div>

              {/* Govt Spend Bar */}
              <div className="mt-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground">Govt Spend</span>
                  <span className="font-medium text-foreground">{dept.govtSpend}% utilized</span>
                </div>
                <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${dept.govtSpend}%`,
                      backgroundColor: `${dept.color}80`,
                    }}
                  />
                </div>
              </div>

              {/* AI Recommendation */}
              <div className="mt-2.5 rounded-lg bg-card/80 border border-border/40 px-2.5 py-1.5">
                <div className="flex items-start gap-1.5">
                  <Lightbulb className="mt-0.5 size-3 shrink-0 text-amber-500" />
                  <p className="text-[9px] leading-relaxed text-muted-foreground">
                    {dept.gap >= 20
                      ? `High gap: Reallocate ₹${dept.gap}L from underspent departments.`
                      : dept.gap >= 10
                        ? `Moderate gap: Increase spend by ₹${dept.gap}L for ${dept.name}.`
                        : `On track: ${dept.name} allocation is well-utilized.`}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
