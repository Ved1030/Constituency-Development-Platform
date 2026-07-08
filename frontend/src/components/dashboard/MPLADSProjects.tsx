"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  IndianRupee,
  FolderKanban,
  Brain,
  ArrowRight,
  Users,
  MapPin,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useConstituency } from "@/context/ConstituencyContext";

// ─── MPLADS Donut ─────────────────────────────────────────────────────
function MPLADSDonut() {
  const { data } = useConstituency();
  const total = parseFloat(data.mpladsFund.replace(/[₹,Cr\s]/g, "")) || 5;
  const spent = total * 0.64;
  const remaining = total - spent;
  const percentage = (spent / total) * 100;
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <IndianRupee className="size-4 text-emerald-500" />
        <h3 className="text-xs font-bold text-foreground">MPLADS Fund</h3>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative shrink-0">
          <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8"
              className="text-muted" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="#10b981" strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-foreground">₹{remaining.toFixed(1)}Cr</span>
            <span className="text-[9px] text-muted-foreground">Remaining</span>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">Total</span>
            <span className="text-xs font-semibold text-foreground">₹{total} Cr</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">Spent</span>
            <span className="text-xs font-semibold text-foreground">₹{spent.toFixed(1)} Cr</span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">Utilization</span>
            <span className="text-xs font-semibold text-emerald-600">{percentage.toFixed(0)}%</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-700"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Projects In Progress ─────────────────────────────────────────────
function ProjectsInProgress() {
  const router = useRouter();
  const { data } = useConstituency();

  const statusColors: Record<string, string> = {
    "on-track": "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    delayed: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    "at-risk": "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
  };

  const projects = data.projects.slice(0, 3).map((p) => ({
    ...p,
    status: p.completion >= 80 ? "on-track" as const : p.completion >= 50 ? "delayed" as const : "at-risk" as const,
    timeline: `— ${p.expectedCompletion}`,
  }));

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderKanban className="size-4 text-primary" />
          <h3 className="text-xs font-bold text-foreground">Projects in Progress</h3>
        </div>
        <button
          onClick={() => router.push("/mp/project-monitoring")}
          className="flex items-center gap-0.5 text-[10px] text-primary hover:underline"
        >
          View All <ArrowRight className="size-2.5" />
        </button>
      </div>

      <div className="space-y-2.5">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 + i * 0.05 }}
            className="group rounded-lg border border-border/40 bg-muted/20 p-3 transition-all hover:bg-muted/40 hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h4 className="text-[11px] font-semibold text-foreground leading-snug line-clamp-1">
                  {project.name}
                </h4>
                <div className="mt-0.5 flex items-center gap-2 text-[9px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-2.5" />
                    {project.village}
                  </span>
                  <span>·</span>
                  <span>{project.budget}</span>
                </div>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full border px-1.5 py-0.5 text-[8px] font-bold uppercase",
                  statusColors[project.status] || "bg-muted text-muted-foreground border-border"
                )}
              >
                {project.status}
              </span>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    project.completion >= 75
                      ? "bg-emerald-500"
                      : project.completion >= 50
                        ? "bg-primary"
                        : project.completion >= 25
                          ? "bg-amber-500"
                          : "bg-red-500"
                  )}
                  style={{ width: `${project.completion}%` }}
                />
              </div>
              <span className="text-[9px] font-medium text-foreground w-8 text-right">
                {project.completion}%
              </span>
            </div>

            <div className="mt-1.5 flex items-center justify-between text-[9px] text-muted-foreground">
              <span>Due: {project.expectedCompletion}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── AI Insights ───────────────────────────────────────────────────────
function AIInsightsCard() {
  const router = useRouter();
  const { data } = useConstituency();

  const departmentInsights = data.priorities.slice(0, 4).map((p) => ({
    icon: p.color === "red" ? AlertTriangle : p.color === "orange" ? TrendingUp : Users,
    title: `${p.department} — ${p.village}`,
    desc: `${p.issue}. ${p.population.toLocaleString("en-IN")} affected.`,
    color: p.color === "red" ? "text-red-600" : p.color === "orange" ? "text-orange-600" : p.color === "green" ? "text-emerald-600" : "text-amber-600",
    bg: p.color === "red" ? "bg-red-50 dark:bg-red-500/10" : p.color === "orange" ? "bg-orange-50 dark:bg-orange-500/10" : p.color === "green" ? "bg-emerald-50 dark:bg-emerald-500/10" : "bg-amber-50 dark:bg-amber-500/10",
    action: "View Details",
  }));

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="size-4 text-purple-500" />
          <h3 className="text-xs font-bold text-foreground">AI Insights</h3>
        </div>
        <span className="rounded-full bg-purple-50 dark:bg-purple-500/10 px-2 py-0.5 text-[9px] font-medium text-purple-600 dark:text-purple-400">
          {data.name}
        </span>
      </div>

      <div className="space-y-2">
        {departmentInsights.map((insight, i) => {
          const Icon = insight.icon;
          return (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.06 }}
              className="group flex items-start gap-3 rounded-lg border border-border/40 bg-muted/20 p-3 transition-all hover:bg-muted/40 hover:shadow-sm cursor-pointer"
            >
              <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", insight.bg)}>
                <Icon className={cn("size-4", insight.color)} />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-[11px] font-semibold text-foreground leading-snug">{insight.title}</h4>
                <p className="mt-0.5 text-[9px] text-muted-foreground leading-relaxed line-clamp-2">
                  {insight.desc}
                </p>
                <button className="mt-1 text-[9px] font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity hover:underline">
                  {insight.action} →
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <button
        onClick={() => router.push("/mp/priority-engine")}
        className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg border border-border/60 py-2 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        View All AI Insights
        <ArrowRight className="size-3" />
      </button>
    </div>
  );
}

// ─── Export combined Row 6 ─────────────────────────────────────────────
export function Row6() {
  return (
    <div className="px-4 pt-4 lg:px-6">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <MPLADSDonut />
        <ProjectsInProgress />
        <AIInsightsCard />
      </div>
    </div>
  );
}
