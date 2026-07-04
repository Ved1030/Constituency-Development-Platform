"use client";

import { motion } from "framer-motion";
import { ClipboardList, TrendingUp, TrendingDown, MapPin, AlertTriangle, Brain, Filter } from "lucide-react";
import { complaintHotspots, complaintTrends } from "@/data/mock-mp";
import { cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useTranslation } from "@/hooks/use-translation";

const categoryData = [
  { name: "Roads", value: 892, color: "#0d47a1" },
  { name: "Water", value: 645, color: "#0ea5e9" },
  { name: "Electricity", value: 523, color: "#f59e0b" },
  { name: "Sanitation", value: 478, color: "#dc2626" },
  { name: "Healthcare", value: 412, color: "#16a34a" },
  { name: "Education", value: 334, color: "#8b5cf6" },
  { name: "Safety", value: 267, color: "#06b6d4" },
  { name: "Housing", value: 198, color: "#ec4899" },
];

const recentComplaints = [
  { id: "CMP-3847", title: "Water Pipeline Burst in Velachery", category: "Water", severity: "critical", status: "in-progress", village: "Velachery", upvotes: 89, time: "2h ago" },
  { id: "CMP-3846", title: "Pothole Cluster on OMR Road", category: "Roads", severity: "high", status: "verified", village: "Sholinganallur", upvotes: 67, time: "4h ago" },
  { id: "CMP-3845", title: "Street Light Outage T Nagar", category: "Electricity", severity: "medium", status: "in-progress", village: "T Nagar", upvotes: 45, time: "6h ago" },
  { id: "CMP-3844", title: "Garbage Dump Near School", category: "Sanitation", severity: "high", status: "pending", village: "Gandhi Nagar", upvotes: 52, time: "8h ago" },
  { id: "CMP-3843", title: "Hospital Bed Shortage", category: "Healthcare", severity: "critical", status: "in-progress", village: "Adyar East", upvotes: 78, time: "12h ago" },
  { id: "CMP-3842", title: "Broken Footpath Ward 5", category: "Roads", severity: "medium", status: "verified", village: "Ward 5 Central", upvotes: 34, time: "1d ago" },
];

const severityConfig: Record<string, { bg: string; text: string }> = {
  critical: { bg: "bg-red-50", text: "text-red-600" },
  high: { bg: "bg-amber-50", text: "text-amber-600" },
  medium: { bg: "bg-blue-50", text: "text-primary" },
  low: { bg: "bg-emerald-50", text: "text-emerald-600" },
};

export default function ComplaintIntelligencePage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2">
          <ClipboardList className="size-5 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">{t("mp.complaintIntelligence.complaintIntelligence")}</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{t("mp.complaintIntelligence.aiPoweredAnalysis")}</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: t("mp.complaintIntelligence.totalComplaints"), value: "3,847", change: "+12.5%", up: true, icon: ClipboardList },
          { label: t("mp.complaintIntelligence.criticalIssues"), value: "156", change: "-8.2%", up: false, icon: AlertTriangle },
          { label: t("mp.complaintIntelligence.resolutionRate"), value: "78.4%", change: "+3.1%", up: true, icon: TrendingUp },
          { label: t("mp.complaintIntelligence.avgResponseTime"), value: "11.2 days", change: "-1.8 days", up: false, icon: TrendingDown },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <stat.icon className="size-5 text-muted-foreground" />
            <div className="mt-3 text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
            <div className={cn("mt-2 text-xs font-semibold", stat.up ? "text-emerald-600" : "text-red-600")}>
              {stat.change}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <h3 className="mb-4 text-sm font-semibold text-foreground">{t("mp.complaintIntelligence.complaintTrends6Months")}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={complaintTrends}>
                <defs>
                  <linearGradient id="totalGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "rgba(0,0,0,0.5)" }} />
                <YAxis tick={{ fontSize: 11, fill: "rgba(0,0,0,0.5)" }} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid rgba(0,0,0,0.1)", background: "#ffffff" }} />
                <Area type="monotone" dataKey="total" stroke="#3b82f6" fill="url(#totalGrad2)" strokeWidth={2} />
                <Area type="monotone" dataKey="resolved" stroke="#10b981" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                <Area type="monotone" dataKey="critical" stroke="#ef4444" fill="transparent" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <h3 className="mb-4 text-sm font-semibold text-foreground">{t("mp.complaintIntelligence.categoryDistribution")}</h3>
          <div className="flex items-center gap-8">
            <div className="size-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={75} paddingAngle={3} dataKey="value">
                    {categoryData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid rgba(0,0,0,0.1)", background: "#ffffff" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {categoryData.map((c) => (
                <div key={c.name} className="flex items-center gap-2">
                  <div className="size-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="flex-1 text-xs text-muted-foreground">{c.name}</span>
                  <span className="text-xs font-semibold text-foreground">{c.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Village Hotspot Rankings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">{t("mp.complaintIntelligence.hotspotRankings")}</h3>
          <Brain className="size-4 text-purple-600" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 font-medium text-muted-foreground">{t("mp.complaintIntelligence.rank")}</th>
                <th className="pb-3 font-medium text-muted-foreground">{t("mp.complaintIntelligence.villageWard")}</th>
                <th className="pb-3 font-medium text-muted-foreground">{t("mp.complaintIntelligence.complaints")}</th>
                <th className="pb-3 font-medium text-muted-foreground">{t("mp.complaintIntelligence.resolved")}</th>
                <th className="pb-3 font-medium text-muted-foreground">{t("mp.complaintIntelligence.density")}</th>
                <th className="pb-3 font-medium text-muted-foreground">{t("mp.complaintIntelligence.trend")}</th>
              </tr>
            </thead>
            <tbody>
              {complaintHotspots.map((item) => (
                <tr key={item.rank} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 font-bold text-muted-foreground">#{item.rank}</td>
                  <td className="py-3 font-medium text-foreground">{item.name}</td>
                  <td className="py-3 text-muted-foreground">{item.complaints}</td>
                  <td className="py-3 text-muted-foreground">{item.resolved}</td>
                  <td className="py-3">
                    <span className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      item.density === "Very High" ? "bg-red-50 text-red-600" :
                      item.density === "High" ? "bg-amber-50 text-amber-600" :
                      item.density === "Medium" ? "bg-blue-50 text-primary" :
                      "bg-emerald-50 text-emerald-600",
                    )}>
                      {item.density}
                    </span>
                  </td>
                  <td className={cn("py-3 text-xs font-semibold", item.trend.startsWith("+") ? "text-red-600" : "text-emerald-600")}>
                    {item.trend}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Recent Complaints */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <h3 className="mb-4 text-sm font-semibold text-foreground">{t("mp.complaintIntelligence.recentComplaints")}</h3>
        <div className="space-y-3">
          {recentComplaints.map((c) => {
            const sev = severityConfig[c.severity];
            return (
              <div key={c.id} className="flex items-center gap-4 rounded-xl border border-border bg-muted/50 p-4 hover:bg-muted/70 transition-colors cursor-pointer">
                <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", sev.bg)}>
                  <AlertTriangle className={cn("size-5", sev.text)} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground font-mono">{c.id}</span>
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase", sev.bg, sev.text)}>
                      {c.severity}
                    </span>
                  </div>
                  <div className="mt-0.5 text-sm font-medium text-foreground">{c.title}</div>
                  <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="size-3" />{c.village}</span>
                    <span>{c.time}</span>
                    <span>{c.upvotes} {t("common.upvotes")}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
