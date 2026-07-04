"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  GitCompare,
  Hospital,
  GraduationCap,
  Globe,
  Droplets,
  Users,
  IndianRupee,
  Target,
  Clock,
  TrendingUp,
  Trophy,
  Brain,
  CheckCircle2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { projectComparisonData } from "@/data/mock-mp";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";

const typeIcons: Record<string, typeof Hospital> = {
  Hospital: Hospital,
  School: GraduationCap,
  Road: Globe,
  "Water Tank": Droplets,
};

const typeColors: Record<string, string> = {
  Hospital: "text-emerald-600",
  School: "text-amber-600",
  Road: "text-blue-600",
  "Water Tank": "text-cyan-600",
};

const chartData = projectComparisonData.map((p) => ({
  name: p.name.split(" ").slice(0, 2).join(" "),
  roi: p.roi,
  beneficiaries: p.beneficiaries / 1000,
  satisfaction: p.satisfactionImpact,
  costPerBeneficiary: p.costPerBeneficiary,
}));

const radarData = projectComparisonData.map((p) => ({
  name: p.name.split(" ")[0],
  roi: p.roi * 30,
  beneficiaries: (p.beneficiaries / 500),
  satisfaction: p.satisfactionImpact,
  costEfficiency: 100 - (p.costPerBeneficiary / 30),
}));

export default function ProjectsComparePage() {
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState<"aiScore" | "roi" | "beneficiaries" | "budget">("aiScore");
  const sorted = [...projectComparisonData].sort((a, b) => {
    if (sortBy === "aiScore") return b.aiScore - a.aiScore;
    if (sortBy === "roi") return b.roi - a.roi;
    if (sortBy === "beneficiaries") return b.beneficiaries - a.beneficiaries;
    return a.budget - b.budget;
  });
  const winner = sorted[0];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2">
          <GitCompare className="size-5 text-blue-600" />
          <h1 className="text-2xl font-bold text-foreground">{t("mp.projects.aiProjectComparison")}</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{t("mp.projects.compareSideBySide")}</p>
      </motion.div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">{t("mp.projects.sortBy")}</span>
        {[
          { key: "aiScore" as const, label: t("mp.projects.aiScore") },
          { key: "roi" as const, label: t("mp.projects.roi") },
          { key: "beneficiaries" as const, label: t("mp.projects.beneficiaries") },
          { key: "budget" as const, label: t("mp.projects.lowestCost") },
        ].map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSortBy(opt.key)}
            className={cn(
              "rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors",
              sortBy === opt.key ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-muted text-muted-foreground border border-border hover:bg-muted/80",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 via-card to-amber-50 p-6"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-100">
            <Trophy className="size-6 text-amber-600" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">{t("mp.projects.aiRecommendedWinner")}</div>
            <h2 className="text-xl font-bold text-foreground">{winner.name}</h2>
            <p className="text-sm text-muted-foreground">
              {t("mp.projects.highestAiScore", { score: winner.aiScore, roi: winner.roi, beneficiaries: winner.beneficiaries.toLocaleString("en-IN") })}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card p-6 overflow-x-auto"
      >
        <h3 className="mb-4 text-sm font-semibold text-foreground">{t("mp.projects.detailedComparison")}</h3>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 font-medium text-muted-foreground">{t("mp.projects.project")}</th>
              <th className="pb-3 font-medium text-muted-foreground">{t("mp.projects.type")}</th>
              <th className="pb-3 font-medium text-muted-foreground">{t("mp.projects.budget")}</th>
              <th className="pb-3 font-medium text-muted-foreground">{t("mp.projects.beneficiaries")}</th>
              <th className="pb-3 font-medium text-muted-foreground">{t("mp.projects.roi")}</th>
              <th className="pb-3 font-medium text-muted-foreground">{t("mp.projects.timeline")}</th>
              <th className="pb-3 font-medium text-muted-foreground">{t("mp.projects.satisfaction")}</th>
              <th className="pb-3 font-medium text-muted-foreground">{t("mp.projects.costPerPerson")}</th>
              <th className="pb-3 font-medium text-muted-foreground">{t("mp.projects.aiScore")}</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((project, i) => {
              const Icon = typeIcons[project.type] || Globe;
              const isWinner = project.name === winner.name;
              return (
                <motion.tr
                  key={project.name}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    "border-b border-border transition-colors",
                    isWinner ? "bg-amber-50" : "hover:bg-muted/50",
                  )}
                >
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <Icon className={cn("size-4", typeColors[project.type])} />
                      <span className={cn("font-medium", isWinner ? "text-amber-700" : "text-foreground")}>{project.name}</span>
                      {isWinner && <Trophy className="size-3 text-amber-600" />}
                    </div>
                  </td>
                  <td className="py-4 text-muted-foreground">{project.type}</td>
                  <td className="py-4 text-muted-foreground">₹{(project.budget / 100000).toFixed(0)}L</td>
                  <td className="py-4 text-muted-foreground">{project.beneficiaries.toLocaleString("en-IN")}</td>
                  <td className="py-4">
                    <span className={cn("font-bold", project.roi >= 2.5 ? "text-emerald-600" : "text-muted-foreground")}>
                      {project.roi}x
                    </span>
                  </td>
                  <td className="py-4 text-muted-foreground">{project.completionTime} mo</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-blue-500"
                          style={{ width: `${project.satisfactionImpact}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{project.satisfactionImpact}%</span>
                    </div>
                  </td>
                  <td className="py-4 text-muted-foreground">₹{project.costPerBeneficiary}</td>
                  <td className="py-4">
                    <span className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-bold",
                      project.aiScore >= 90 ? "bg-emerald-50 text-emerald-700" :
                      project.aiScore >= 85 ? "bg-blue-50 text-blue-700" :
                      "bg-muted text-muted-foreground",
                    )}>
                      {project.aiScore}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <h3 className="mb-4 text-sm font-semibold text-foreground">{t("mp.projects.roiChartTitle")}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", background: "#ffffff", color: "#1f2937" }} />
                <Bar dataKey="roi" fill="#a855f7" radius={[4, 4, 0, 0]} name="ROI (x)" />
                <Bar dataKey="beneficiaries" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Beneficiaries (K)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <h3 className="mb-4 text-sm font-semibold text-foreground">{t("mp.projects.radarTitle")}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(0,0,0,0.06)" />
                <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} />
                <PolarRadiusAxis tick={{ fontSize: 9, fill: "#94a3b8" }} />
                <Radar name="Score" dataKey="roi" stroke="#a855f7" fill="#a855f7" fillOpacity={0.15} strokeWidth={2} />
                <Radar name="Impact" dataKey="satisfaction" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", background: "#ffffff", color: "#1f2937" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
