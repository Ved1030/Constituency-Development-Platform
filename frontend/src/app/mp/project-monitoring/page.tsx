"use client";

import { motion } from "framer-motion";
import { FolderKanban, Clock, CheckCircle2, AlertCircle, TrendingUp, MapPin, IndianRupee } from "lucide-react";
import { priorityProjects } from "@/data/mock-mp";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";

export default function ProjectMonitoringPage() {
  const { t } = useTranslation();
  const statusCounts = {
    "on-track": priorityProjects.filter((p) => p.status === "on-track").length,
    delayed: priorityProjects.filter((p) => p.status === "delayed").length,
    "at-risk": priorityProjects.filter((p) => p.status === "at-risk").length,
    completed: priorityProjects.filter((p) => p.status === "completed").length,
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2">
          <FolderKanban className="size-5 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">{t("mp.projectMonitoring.projectMonitoring")}</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{t("mp.projectMonitoring.trackAllProjects")}</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: t("mp.projectMonitoring.onTrack"), count: statusCounts["on-track"], color: "emerald", icon: CheckCircle2 },
          { label: t("mp.projectMonitoring.delayed"), count: statusCounts.delayed, color: "amber", icon: Clock },
          { label: t("mp.projectMonitoring.atRisk"), count: statusCounts["at-risk"], color: "red", icon: AlertCircle },
          { label: t("mp.projectMonitoring.completed"), count: statusCounts.completed, color: "blue", icon: CheckCircle2 },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <s.icon className={cn("size-5", s.color === 'blue' ? 'text-primary' : `text-${s.color}-600`)} />
            <div className="mt-3 text-3xl font-bold text-foreground">{s.count}</div>
            <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <h3 className="mb-4 text-sm font-semibold text-foreground">{t("mp.projectMonitoring.allProjects")}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 font-medium text-muted-foreground">#</th>
                <th className="pb-3 font-medium text-muted-foreground">{t("mp.projectMonitoring.project")}</th>
                <th className="pb-3 font-medium text-muted-foreground">{t("mp.projectMonitoring.category")}</th>
                <th className="pb-3 font-medium text-muted-foreground">{t("mp.projectMonitoring.village")}</th>
                <th className="pb-3 font-medium text-muted-foreground">{t("mp.projectMonitoring.budget")}</th>
                <th className="pb-3 font-medium text-muted-foreground">{t("mp.projectMonitoring.progress")}</th>
                <th className="pb-3 font-medium text-muted-foreground">{t("mp.projectMonitoring.status")}</th>
              </tr>
            </thead>
            <tbody>
              {priorityProjects.map((project, i) => (
                <motion.tr
                  key={project.id}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="py-4 font-medium text-muted-foreground">{project.priority}</td>
                  <td className="py-4 font-medium text-foreground">{project.name}</td>
                  <td className="py-4 text-muted-foreground">{project.category}</td>
                  <td className="py-4">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="size-3" />{project.village}
                    </span>
                  </td>
                  <td className="py-4 text-muted-foreground">₹{(project.budget / 100000).toFixed(1)}L</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-border">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            project.progress >= 75 ? "bg-emerald-500" :
                            project.progress >= 50 ? "bg-blue-500" :
                            project.progress >= 25 ? "bg-amber-500" : "bg-red-500",
                          )}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold",
                      project.status === "on-track" && "bg-emerald-50 text-emerald-600",
                      project.status === "delayed" && "bg-amber-50 text-amber-600",
                      project.status === "at-risk" && "bg-red-50 text-red-600",
                      project.status === "completed" && "bg-blue-50 text-primary",
                    )}>
                      {project.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
