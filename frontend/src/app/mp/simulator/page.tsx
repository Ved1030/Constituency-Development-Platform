"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Hospital,
  GraduationCap,
  Droplets,
  Users,
  Clock,
  TrendingDown,
  IndianRupee,
  Target,
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
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";

const projectTypeIcons: Record<string, typeof Hospital> = {
  Hospital: Hospital,
  Road: Globe,
  School: GraduationCap,
  "Water Tank": Droplets,
};

const projectColors: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  Hospital: { bg: "bg-emerald-50 text-emerald-600", text: "text-emerald-600", border: "border-emerald-200", gradient: "from-emerald-500 to-teal-500" },
  Road: { bg: "bg-blue-50 text-primary", text: "text-primary", border: "border-blue-200", gradient: "from-blue-500 to-indigo-500" },
  School: { bg: "bg-amber-50 text-amber-600", text: "text-amber-600", border: "border-amber-200", gradient: "from-amber-500 to-orange-500" },
  "Water Tank": { bg: "bg-cyan-50 text-cyan-600", text: "text-cyan-600", border: "border-cyan-200", gradient: "from-cyan-500 to-blue-500" },
};

const impactProjects = [
  {
    id: "IMP-001",
    name: "Sholinganallur PHC (50-bed)",
    type: "Hospital",
    populationCovered: 32000,
    travelTimeReduction: 42,
    complaintReduction: 340,
    budgetUsed: 68000000,
    roi: 2.8,
    beneficiaries: 32000,
    status: "Proposed",
  },
  {
    id: "IMP-002",
    name: "Velachery Main Road widening",
    type: "Road",
    populationCovered: 45000,
    travelTimeReduction: 15,
    complaintReduction: 280,
    budgetUsed: 42000000,
    roi: 1.9,
    beneficiaries: 45000,
    status: "Approved",
  },
  {
    id: "IMP-003",
    name: "New Primary School Ward 8",
    type: "School",
    populationCovered: 8400,
    travelTimeReduction: 25,
    complaintReduction: 95,
    budgetUsed: 18000000,
    roi: 3.1,
    beneficiaries: 8400,
    status: "Proposed",
  },
  {
    id: "IMP-004",
    name: "Overhead Water Tank Krishna Nagar",
    type: "Water Tank",
    populationCovered: 22000,
    travelTimeReduction: 0,
    complaintReduction: 420,
    budgetUsed: 35000000,
    roi: 2.4,
    beneficiaries: 22000,
    status: "In Progress",
  },
];

const comparisonData = impactProjects.map((p) => ({
  name: p.name.split(" ").slice(0, 2).join(" "),
  population: p.populationCovered / 1000,
  complaints: p.complaintReduction,
  roi: p.roi,
}));

export default function MPSimulatorPage() {
  const { t } = useTranslation();
  const [selectedProject, setSelectedProject] = useState(impactProjects[0]);

  const Icon = projectTypeIcons[selectedProject.type] || Globe;
  const colors = projectColors[selectedProject.type] || projectColors.Hospital;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="size-5 text-emerald-600" />
            <h1 className="text-2xl font-bold text-foreground">{t("mp.simulator.title")}</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{t("mp.simulator.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 border border-emerald-200">
          <Brain className="size-4 text-emerald-600" />
          <span className="text-xs text-emerald-700 font-medium">{t("mp.simulator.aiPoweredAnalysis")}</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Project Selector */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="xl:col-span-1 space-y-3"
        >
          <h3 className="text-sm font-semibold text-foreground">{t("mp.simulator.selectProject")}</h3>
          {impactProjects.map((project) => {
            const PIcon = projectTypeIcons[project.type] || Globe;
            const pColors = projectColors[project.type] || projectColors.Hospital;
            const isSelected = selectedProject.id === project.id;
            return (
              <motion.button
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={cn(
                  "w-full rounded-2xl border p-4 text-left transition-all",
                  isSelected
                    ? `${pColors.border} bg-card shadow-md`
                    : "border-border bg-card hover:bg-muted/50",
                )}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", pColors.bg)}>
                    <PIcon className={cn("size-5", pColors.text)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-foreground truncate">{project.name}</div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">{project.type} &middot; {project.status}</div>
                    <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="size-3" />{(project.populationCovered / 1000).toFixed(0)}K</span>
                      <span className="flex items-center gap-1"><Target className="size-3" />ROI: {project.roi}x</span>
                    </div>
                  </div>
                  {isSelected && <CheckCircle2 className={cn("size-5 shrink-0", pColors.text)} />}
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Main Map / Impact View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="xl:col-span-2 rounded-2xl border border-border bg-card p-6 relative min-h-[500px]"
        >
          <div className="absolute inset-6 overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50">
            {/* Grid */}
            <svg className="absolute inset-0 h-full w-full opacity-10" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid-sim" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-sim)" />
            </svg>

            {/* Constituency outline */}
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 400">
              <path
                d="M120,60 Q200,40 320,70 Q420,100 480,180 Q500,260 440,320 Q340,350 220,310 Q120,270 90,180 Q80,110 120,60 Z"
                fill="rgba(21,101,192,0.05)"
                stroke="rgba(21,101,192,0.3)"
                strokeWidth="1.5"
                strokeDasharray="6 3"
              />

              {/* Impact zone */}
              <circle
                cx="300" cy="200"
                r={Math.min(selectedProject.populationCovered / 2000, 120)}
                fill={selectedProject.type === "Hospital" ? "rgba(22,163,74,0.1)" :
                      selectedProject.type === "Road" ? "rgba(21,101,192,0.1)" :
                      selectedProject.type === "School" ? "rgba(245,158,11,0.1)" :
                      "rgba(6,182,212,0.1)"}
                stroke={selectedProject.type === "Hospital" ? "rgba(22,163,74,0.3)" :
                        selectedProject.type === "Road" ? "rgba(21,101,192,0.3)" :
                        selectedProject.type === "School" ? "rgba(245,158,11,0.3)" :
                        "rgba(6,182,212,0.3)"}
                strokeWidth="2"
                strokeDasharray="4 2"
              />

              {/* Center point */}
              <circle cx="300" cy="200" r="6" fill="#1565C0" opacity="0.8" />
              <circle cx="300" cy="200" r="12" fill="none" stroke="#1565C0" opacity="0.2" strokeWidth="1" />

              {/* Nearby villages */}
              {[
                { x: 200, y: 150, name: "Velachery" },
                { x: 380, y: 170, name: "Sholinganallur" },
                { x: 320, y: 280, name: "Krishna Nagar" },
                { x: 180, y: 250, name: "Gandhi Nagar" },
                { x: 350, y: 120, name: "T Nagar" },
              ].map((v) => (
                <g key={v.name}>
                  <circle cx={v.x} cy={v.y} r="3" fill="#1565C0" opacity="0.6" />
                  <text x={v.x + 8} y={v.y + 4} fill="#64748B" fontSize="9">{v.name}</text>
                </g>
              ))}
            </svg>

            {/* Project Label */}
            <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-xl bg-card/90 border border-border px-4 py-2 text-center backdrop-blur-sm shadow-sm">
              <div className="text-xs font-bold text-foreground">{selectedProject.name}</div>
              <div className="text-[10px] text-muted-foreground">{selectedProject.type} &middot; {selectedProject.status}</div>
            </div>

            {/* Impact Radius Label */}
            <div className="absolute right-4 top-4 rounded-xl bg-card/90 border border-border px-3 py-2 backdrop-blur-sm shadow-sm">
              <div className="text-[10px] text-muted-foreground">{t("mp.simulator.impactRadius")}</div>
              <div className="text-sm font-bold text-foreground">{(selectedProject.populationCovered / 1000).toFixed(0)}K citizens</div>
            </div>
          </div>

          {/* Live Impact Metrics Overlay */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: t("mp.simulator.populationCovered"), value: selectedProject.populationCovered.toLocaleString("en-IN"), icon: Users, color: "text-primary" },
                { label: t("mp.simulator.travelTimeReduced"), value: `${selectedProject.travelTimeReduction} min`, icon: Clock, color: "text-emerald-600" },
                { label: t("mp.simulator.complaintReduction"), value: selectedProject.complaintReduction.toString(), icon: TrendingDown, color: "text-amber-600" },
                { label: t("mp.simulator.roiScore"), value: `${selectedProject.roi}x`, icon: Target, color: "text-purple-600" },
              ].map((metric, i) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl bg-card/90 border border-border p-3 backdrop-blur-sm shadow-sm"
                >
                  <metric.icon className={cn("size-4 mb-1", metric.color)} />
                  <div className="text-lg font-bold text-foreground">{metric.value}</div>
                  <div className="text-[10px] text-muted-foreground">{metric.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Comparison Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <h2 className="mb-4 text-lg font-bold text-foreground flex items-center gap-2">
          <Target className="size-5 text-purple-600" />
          {t("mp.simulator.projectImpactComparison")}
        </h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748B" }} />
                <YAxis tick={{ fontSize: 10, fill: "#64748B" }} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", background: "#FFFFFF", color: "#1E293B" }} />
                <Bar dataKey="population" fill="#1565C0" radius={[4, 4, 0, 0]} name="Population (K)" />
                <Bar dataKey="complaints" fill="#16A34A" radius={[4, 4, 0, 0]} name="Complaint Reduction" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={comparisonData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748B" }} />
                <PolarRadiusAxis tick={{ fontSize: 9, fill: "#94A3B8" }} />
                <Radar name="ROI" dataKey="roi" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.1} strokeWidth={2} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", background: "#FFFFFF", color: "#1E293B" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Detailed Impact Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {impactProjects.map((project, i) => {
          const PIcon = projectTypeIcons[project.type] || Globe;
          const pColors = projectColors[project.type] || projectColors.Hospital;
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setSelectedProject(project)}
              className={cn(
                "rounded-2xl border bg-card p-5 transition-all hover:shadow-md cursor-pointer",
                selectedProject.id === project.id ? `${pColors.border} shadow-md` : "border-border",
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", pColors.bg)}>
                  <PIcon className={cn("size-5", pColors.text)} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground">{project.name}</h3>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>{project.type}</span>
                    <span>&middot;</span>
                    <span className={cn(
                      "rounded-full px-1.5 py-0.5 text-[9px] font-bold border",
                      project.status === "Proposed" ? "bg-blue-50 text-primary border-blue-200" :
                      project.status === "Approved" ? "bg-amber-50 text-amber-600 border-amber-200" :
                      "bg-emerald-50 text-emerald-600 border-emerald-200",
                    )}>
                      {project.status}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-muted/50 p-2">
                      <div className="text-[10px] text-muted-foreground">{t("mp.simulator.budget")}</div>
                      <div className="text-sm font-bold text-foreground">₹{(project.budgetUsed / 100000).toFixed(0)}L</div>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-2">
                      <div className="text-[10px] text-muted-foreground">{t("mp.simulator.beneficiaries")}</div>
                      <div className="text-sm font-bold text-foreground">{(project.beneficiaries / 1000).toFixed(1)}K</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
