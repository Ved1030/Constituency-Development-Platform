"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ChevronRight,
  Calendar,
  IndianRupee,
  Building,
  Clock,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { developmentProjects } from "@/data/mock-citizen";
import { useTranslation } from "@/hooks/use-translation";

const statusConfig: Record<string, { labelKey: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
  "on-track": { labelKey: "onTrack", color: "text-emerald-700", bg: "bg-emerald-50", icon: CheckCircle2 },
  delayed: { labelKey: "delayed", color: "text-amber-700", bg: "bg-amber-50", icon: Clock },
  completed: { labelKey: "completed", color: "text-blue-700", bg: "bg-blue-50", icon: CheckCircle2 },
  planned: { labelKey: "planned", color: "text-gray-700", bg: "bg-gray-50", icon: Calendar },
};

const categoryColors: Record<string, string> = {
  Sanitation: "bg-purple-100 text-purple-700",
  Roads: "bg-blue-100 text-blue-700",
  Electricity: "bg-amber-100 text-amber-700",
  Healthcare: "bg-red-100 text-red-700",
  Education: "bg-emerald-100 text-emerald-700",
};

export default function ProjectsPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/citizen/dashboard" className="hover:text-foreground">{t("citizen.sidebar.dashboard")}</Link>
        <ChevronRight className="size-3.5" />
        <span className="font-medium text-foreground">{t("citizen.projects.developmentProjects")}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t("citizen.projects.developmentProjects")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("citizen.projects.trackOngoing")}
          </p>
        </div>
        <div className="flex gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="size-3" /> {developmentProjects.filter((p) => p.status === "on-track").length} {t("citizen.projects.onTrack")}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
            <Clock className="size-3" /> {developmentProjects.filter((p) => p.status === "delayed").length} {t("citizen.projects.delayed")}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
            <CheckCircle2 className="size-3" /> {developmentProjects.filter((p) => p.status === "completed").length} {t("citizen.projects.completed")}
          </span>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {developmentProjects.map((project, i) => {
          const status = statusConfig[project.status];
          const StatusIcon = status.icon;

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between">
                <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-semibold", categoryColors[project.category] || "bg-gray-100 text-gray-700")}>
                  {project.category}
                </span>
                <span className={cn("flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold", status.bg, status.color)}>
                  <StatusIcon className="size-3" />
                  {t(`citizen.projects.${status.labelKey}`)}
                </span>
              </div>

              <h4 className="mt-3 text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                {project.name}
              </h4>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{project.description}</p>

              <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Building className="size-3" /> {project.village}</span>
                <span className="flex items-center gap-1"><Calendar className="size-3" /> {project.endDate}</span>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{t("citizen.projects.progress")}</span>
                  <span className="font-medium text-foreground">{project.progress}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      project.progress >= 75 ? "bg-emerald-500" :
                      project.progress >= 50 ? "bg-blue-500" :
                      project.progress >= 25 ? "bg-amber-500" : "bg-red-500",
                    )}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <IndianRupee className="size-3" />
                  <span>₹{(project.spent / 100000).toFixed(1)}L / ₹{(project.budget / 100000).toFixed(1)}L</span>
                </div>
                <button className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  {t("citizen.projects.details")} <ArrowUpRight className="size-3" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
