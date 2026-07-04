"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Users,
  MapPin,
  FolderKanban,
  ClipboardList,
  IndianRupee,
  Heart,
  CheckCircle2,
  Brain,
  Bot,
  Zap,
  GitCompare,
  FileText,
  Globe,
  Flame,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  ArrowRight,
  Landmark,
  Shield,
  Info,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import {
  executiveOverview,
  departmentPerformance,
  topAIInsights,
  aiAlerts,
  recentProjects,
  sectorSpending,
  complaintHotspots,
  villages,
} from "@/data/mock-mp";

const riskColors: Record<string, { bg: string; text: string; dot: string }> = {
  low: { bg: "bg-emerald-50 text-emerald-600", text: "text-emerald-600", dot: "bg-emerald-500" },
  medium: { bg: "bg-amber-50 text-amber-600", text: "text-amber-600", dot: "bg-amber-500" },
  high: { bg: "bg-red-50 text-red-600", text: "text-red-600", dot: "bg-red-500" },
};

const alertSeverity: Record<string, { bg: string; text: string; border: string }> = {
  critical: { bg: "bg-red-50 text-red-600", text: "text-red-600", border: "border-red-200" },
  warning: { bg: "bg-amber-50 text-amber-600", text: "text-amber-600", border: "border-amber-200" },
  info: { bg: "bg-blue-50 text-blue-600", text: "text-blue-600", border: "border-blue-200" },
};

const statusColors: Record<string, string> = {
  "on-track": "bg-emerald-50 text-emerald-700 border-emerald-200",
  delayed: "bg-amber-50 text-amber-700 border-amber-200",
  "at-risk": "bg-red-50 text-red-700 border-red-200",
};

const sectorChartData = sectorSpending.map((s) => ({
  name: s.sector,
  allocated: s.allocated / 100000,
  spent: s.spent / 100000,
}));

const villageChartData = complaintHotspots.slice(0, 8).map((v) => ({
  name: v.name.length > 10 ? v.name.slice(0, 10) + "..." : v.name,
  complaints: v.complaints,
  resolved: v.resolved,
}));

const severityIcon: Record<string, typeof AlertTriangle> = {
  critical: AlertTriangle,
  warning: Clock,
  info: Info,
};

export default function MPDashboardPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* ═══ SECTION 1: Executive Overview ═══ */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-[#1565C0] via-[#1976D2] to-[#42A5F5] p-6 lg:p-8"
      >
        <div className="absolute inset-0">
          <div className="absolute -right-20 -top-20 size-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 size-48 rounded-full bg-white/5 blur-2xl" />
        </div>
        <div className="relative z-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Landmark className="size-4 text-white/70" />
                <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">Lok Sabha Constituency: {executiveOverview.lokShabha}</span>
              </div>
              <h2 className="text-2xl font-bold text-white lg:text-3xl">
                Good morning, {executiveOverview.mpName.split(" ").slice(0, 2).join(" ")}
              </h2>
              <p className="mt-1 text-white/60">
                {executiveOverview.constituency}, {executiveOverview.state} &middot; Assembly Segment: {executiveOverview.assemblySegment}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.push("/mp/copilot")}
                className="flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-medium text-white border border-white/20 hover:bg-white/25 transition-colors backdrop-blur-sm"
              >
                <Bot className="size-4" />
                AI Copilot
              </button>
              <button
                onClick={() => router.push("/mp/simulator")}
                className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-[#1565C0] shadow-lg hover:shadow-xl transition-all"
              >
                <Zap className="size-4" />
                Impact Simulator
              </button>
            </div>
          </div>

          {/* Executive Stats Grid */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { label: "Population", value: executiveOverview.population.toLocaleString("en-IN"), sub: "Total citizens", icon: Users },
              { label: "Villages", value: executiveOverview.villages.toString(), sub: `${executiveOverview.wards} Wards`, icon: MapPin },
              { label: "Gram Panchayats", value: executiveOverview.gramPanchayats.toString(), sub: `${executiveOverview.urbanRuralSplit.urban}% Urban`, icon: Landmark },
              { label: "Current Budget", value: executiveOverview.currentBudget, sub: "Total allocation", icon: IndianRupee },
              { label: "MPLADS Fund", value: executiveOverview.mpladsFund, sub: "Annual allocation", icon: Shield },
              { label: "AI Health Score", value: `${executiveOverview.aiHealthScore}/100`, sub: "Constituency health", icon: Brain, highlight: true },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "rounded-xl p-3 transition-colors",
                  stat.highlight ? "bg-white/20 border border-white/30" : "bg-white/10",
                )}
              >
                <stat.icon className={cn("size-4 mb-2", stat.highlight ? "text-white" : "text-white/60")} />
                <div className="text-lg font-bold text-white">{stat.value}</div>
                <div className="text-[11px] text-white/60">{stat.label}</div>
                <div className="text-[10px] text-white/40">{stat.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ═══ SECTION 2: Department Performance ═══ */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Department Performance</h2>
          <button onClick={() => router.push("/mp/departments")} className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors">
            View All <ArrowRight className="size-3" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {departmentPerformance.map((dept, i) => {
            const risk = riskColors[dept.aiRisk];
            return (
              <motion.div
                key={dept.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="group rounded-2xl border border-border bg-card p-4 hover:border-primary/20 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{dept.icon}</span>
                  <span className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase", risk.bg)}>
                    <span className={cn("size-1 rounded-full", risk.dot)} />
                    {dept.aiRisk}
                  </span>
                </div>
                <div className="mt-2 text-sm font-semibold text-foreground">{dept.name}</div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <div className="text-muted-foreground">Complaints</div>
                    <div className="font-semibold text-foreground">{dept.complaints}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Projects</div>
                    <div className="font-semibold text-foreground">{dept.projects}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Budget</div>
                    <div className="font-semibold text-foreground">{dept.budget}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Perf</div>
                    <div className={cn("font-semibold", dept.performance >= 80 ? "text-emerald-600" : dept.performance >= 70 ? "text-amber-600" : "text-red-600")}>
                      {dept.performance}%
                    </div>
                  </div>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn("h-full rounded-full", dept.aiRisk === "high" ? "bg-red-500" : dept.aiRisk === "medium" ? "bg-amber-500" : "bg-primary")}
                    style={{ width: `${dept.budgetUtilization}%` }}
                  />
                </div>
                <div className="mt-1 flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground">Budget utilization</span>
                  <span className="text-muted-foreground">{dept.budgetUtilization}%</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ═══ SECTION 3: Interactive Constituency Map ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Globe className="size-5 text-emerald-600" />
            Constituency Map
          </h2>
          <button onClick={() => router.push("/mp/constituency-twin")} className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors">
            Full Digital Twin <ArrowRight className="size-3" />
          </button>
        </div>
        <div className="relative h-80 overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50">
          {/* Grid */}
          <svg className="absolute inset-0 h-full w-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-dash" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-dash)" />
          </svg>

          {/* Constituency outline */}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 320">
            <path
              d="M150,50 Q250,30 400,60 Q520,90 580,160 Q600,220 530,270 Q400,300 280,260 Q160,220 130,150 Q120,90 150,50 Z"
              fill="rgba(21,101,192,0.05)"
              stroke="rgba(21,101,192,0.3)"
              strokeWidth="1.5"
              strokeDasharray="6 3"
            />
          </svg>

          {/* Village dots */}
          {villages.map((v, i) => {
            const x = 15 + ((v.lng - 80.26) * 10000) % 70;
            const y = 10 + ((v.lat - 13.07) * 6000) % 70;
            const intensity = v.complaints / 634;
            return (
              <div
                key={v.id}
                className="absolute group cursor-pointer"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <div
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-lg"
                  style={{
                    width: `${20 + intensity * 30}px`,
                    height: `${20 + intensity * 30}px`,
                    backgroundColor: intensity > 0.7 ? "#dc2626" : intensity > 0.4 ? "#f59e0b" : "#16a34a",
                    opacity: 0.3,
                  }}
                />
                <div
                  className="absolute -translate-x-1/2 -translate-y-1/2 size-2.5 rounded-full border-2 border-white"
                  style={{ backgroundColor: intensity > 0.7 ? "#dc2626" : intensity > 0.4 ? "#f59e0b" : "#16a34a" }}
                />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                  <div className="rounded-lg bg-card border border-border px-3 py-2 shadow-xl whitespace-nowrap">
                    <div className="text-xs font-semibold text-foreground">{v.name}</div>
                    <div className="text-[10px] text-muted-foreground">{v.complaints} complaints | {v.population.toLocaleString("en-IN")} pop</div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Filter chips */}
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {["Roads", "Schools", "Hospitals", "Water", "Electricity", "Projects"].map((layer) => (
              <button key={layer} className="rounded-full bg-white/80 border border-border px-2.5 py-1 text-[10px] text-muted-foreground hover:text-foreground hover:bg-white transition-colors backdrop-blur-sm shadow-sm">
                {layer}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="absolute bottom-3 left-3 flex items-center gap-4 rounded-lg bg-white/90 border border-border px-4 py-2 backdrop-blur-sm shadow-sm">
            <div className="flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-red-500" />
              <span className="text-[10px] text-muted-foreground">High</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-amber-500" />
              <span className="text-[10px] text-muted-foreground">Medium</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-muted-foreground">Low</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ═══ SECTION 4: Top AI Insights ═══ */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Brain className="size-5 text-purple-600" />
            Top AI Insights
          </h2>
          <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[10px] font-semibold text-purple-600">
            Powered by AI Analysis
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {topAIInsights.map((insight, i) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="group rounded-2xl border border-border bg-card p-5 hover:border-purple-200 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-xl",
                  insight.severity === "critical" ? "bg-red-50" :
                  insight.severity === "warning" ? "bg-amber-50" : "bg-blue-50",
                )}>
                  <Brain className={cn(
                    "size-5",
                    insight.severity === "critical" ? "text-red-600" :
                    insight.severity === "warning" ? "text-amber-600" : "text-blue-600",
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                      insight.severity === "critical" ? "bg-red-50 text-red-600" :
                      insight.severity === "warning" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600",
                    )}>
                      {insight.severity}
                    </span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{insight.category}</span>
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-foreground">{insight.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{insight.description}</p>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-muted/50 p-3">
                <div className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">AI Recommendation</div>
                <div className="text-xs text-foreground/80">{insight.recommendation}</div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                  {insight.affectedPopulation > 0 && (
                    <span className="flex items-center gap-1"><Users className="size-3" />{insight.affectedPopulation.toLocaleString("en-IN")}</span>
                  )}
                  <span className="flex items-center gap-1"><Clock className="size-3" />{insight.timeframe}</span>
                </div>
                <span className="text-[10px] text-primary/60 font-medium">Confidence: {insight.confidence}%</span>
              </div>

              {/* Sources */}
              <div className="mt-3 flex flex-wrap gap-1">
                {insight.sources.slice(0, 3).map((s) => (
                  <span key={s} className="rounded bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground">{s}</span>
                ))}
                {insight.sources.length > 3 && (
                  <span className="text-[9px] text-muted-foreground">+{insight.sources.length - 3} more</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ═══ SECTION 5: AI Decision Center ═══ */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Bot className="size-5 text-cyan-600" />
            AI Decision Center
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { label: "Development Impact Simulator", icon: Globe, color: "from-emerald-500 to-teal-500", shadow: "shadow-emerald-500/20", href: "/mp/simulator" },
            { label: "Need vs Spend", icon: Flame, color: "from-orange-500 to-red-500", shadow: "shadow-orange-500/20", href: "/mp/need-vs-spend" },
            { label: "Project Comparison", icon: GitCompare, color: "from-blue-500 to-indigo-500", shadow: "shadow-blue-500/20", href: "/mp/projects" },
            { label: "Policy Generator", icon: FileText, color: "from-purple-500 to-pink-500", shadow: "shadow-purple-500/20", href: "/mp/recommendations" },
            { label: "AI Copilot", icon: Bot, color: "from-cyan-500 to-blue-500", shadow: "shadow-cyan-500/20", href: "/mp/copilot" },
          ].map((item, i) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => router.push(item.href)}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 text-center transition-all hover:border-primary/20 hover:shadow-md cursor-pointer"
            >
              <div className={cn("flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg", item.color, item.shadow)}>
                <item.icon className="size-6" />
              </div>
              <span className="text-xs font-semibold text-foreground">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ═══ SECTION 6: Constituency KPIs ═══ */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-foreground">Constituency KPIs</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {[
            { label: "Population", value: "18.4L", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Villages", value: "142", icon: MapPin, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Projects", value: "47", icon: FolderKanban, color: "text-cyan-600", bg: "bg-cyan-50" },
            { label: "Complaints", value: "3,847", icon: ClipboardList, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Budget", value: "₹37.7Cr", icon: IndianRupee, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Satisfaction", value: "79%", icon: Heart, color: "text-pink-600", bg: "bg-pink-50" },
            { label: "Completion", value: "78%", icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "AI Confidence", value: "87%", icon: Brain, color: "text-purple-600", bg: "bg-purple-50" },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl border border-border bg-card p-4 text-center hover:shadow-md transition-shadow"
            >
              <div className={cn("mx-auto flex size-8 items-center justify-center rounded-lg", kpi.bg)}>
                <kpi.icon className={cn("size-4", kpi.color)} />
              </div>
              <div className="mt-2 text-lg font-bold text-foreground">{kpi.value}</div>
              <div className="text-[10px] text-muted-foreground">{kpi.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ═══ SECTION 7: Recent Development Projects ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Recent Development Projects</h2>
          <button onClick={() => router.push("/mp/project-monitoring")} className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors">
            View All <ArrowRight className="size-3" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {recentProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-border bg-muted/30 p-4 hover:bg-muted/50 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{project.name}</h4>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>{project.department}</span>
                    <span>&middot;</span>
                    <span className="flex items-center gap-1"><MapPin className="size-3" />{project.village}</span>
                  </div>
                </div>
                <span className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px] font-bold",
                  statusColors[project.status] || "bg-muted text-muted-foreground border-border",
                )}>
                  {project.status}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">{project.timeline}</span>
                <span className="text-foreground/70 font-medium">{project.budget}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    project.completion >= 75 ? "bg-emerald-500" :
                    project.completion >= 50 ? "bg-primary" :
                    project.completion >= 25 ? "bg-amber-500" : "bg-red-500",
                  )}
                  style={{ width: `${project.completion}%` }}
                />
              </div>
              <div className="mt-1 text-right text-[10px] text-muted-foreground">{project.completion}% complete</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ═══ SECTION 8: Sector-wise Spending ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <h2 className="mb-4 text-lg font-bold text-foreground">Sector-wise Spending</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sectorChartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748B" }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748B" }} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", background: "#FFFFFF", color: "#1E293B", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
              <Bar dataKey="allocated" fill="#E2E8F0" radius={[4, 4, 0, 0]} name="Allocated (L)" />
              <Bar dataKey="spent" fill="#1565C0" radius={[4, 4, 0, 0]} name="Spent (L)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* ═══ SECTION 9: Complaint Hotspots ═══ */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <h2 className="mb-4 text-lg font-bold text-foreground flex items-center gap-2">
            <Flame className="size-5 text-orange-600" />
            Complaint Hotspots
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={villageChartData} layout="vertical" margin={{ top: 5, right: 10, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#64748B" }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#64748B" }} width={80} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", background: "#FFFFFF", color: "#1E293B" }} />
                <Bar dataKey="complaints" fill="#DC2626" radius={[0, 4, 4, 0]} name="Complaints" />
                <Bar dataKey="resolved" fill="#16A34A" radius={[0, 4, 4, 0]} name="Resolved" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <h2 className="mb-4 text-lg font-bold text-foreground flex items-center gap-2">
            <Flame className="size-5 text-orange-600" />
            Village Rankings
          </h2>
          <div className="space-y-2">
            {complaintHotspots.slice(0, 8).map((v, i) => (
              <div key={v.rank} className="flex items-center gap-3 rounded-xl bg-muted/30 p-3">
                <div className={cn(
                  "flex size-7 items-center justify-center rounded-lg text-[11px] font-bold",
                  v.density === "Very High" ? "bg-red-50 text-red-600" :
                  v.density === "High" ? "bg-amber-50 text-amber-600" :
                  v.density === "Medium" ? "bg-blue-50 text-blue-600" :
                  "bg-emerald-50 text-emerald-600",
                )}>
                  {v.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground">{v.name}</div>
                  <div className="text-[10px] text-muted-foreground">{v.complaints} complaints | {v.resolved} resolved</div>
                </div>
                <span className={cn(
                  "text-[10px] font-semibold",
                  v.trend.startsWith("+") ? "text-red-600" : "text-emerald-600",
                )}>
                  {v.trend}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ═══ SECTION 10: Upcoming AI Alerts ═══ */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-foreground flex items-center gap-2">
          <AlertTriangle className="size-5 text-amber-600" />
          Upcoming AI Alerts
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {aiAlerts.map((alert, i) => {
            const sev = alertSeverity[alert.severity];
            const Icon = severityIcon[alert.severity];
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={cn("rounded-2xl border bg-card p-4 transition-all hover:shadow-md cursor-pointer", sev.border)}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", sev.bg)}>
                    <Icon className={cn("size-5", sev.text)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase", sev.bg)}>
                        {alert.type}
                      </span>
                      <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase", sev.bg)}>
                        {alert.severity}
                      </span>
                    </div>
                    <h4 className="mt-2 text-sm font-semibold text-foreground">{alert.title}</h4>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{alert.description}</p>
                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className="text-muted-foreground">{alert.department}</span>
                      <span className="text-muted-foreground">{alert.deadline}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
