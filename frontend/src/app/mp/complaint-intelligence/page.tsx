"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ClipboardList, TrendingUp, TrendingDown, MapPin, AlertTriangle, Brain, Filter } from "lucide-react";
import { fetchAnalytics } from "@/services/api/analytics";
import { fetchComplaints } from "@/services/api/complaints";
import { useAuth } from "@/context/AuthContext";
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

const categoryColors: Record<string, string> = {
  road: "#0d47a1", water: "#0ea5e9", electricity: "#f59e0b",
  sanitation: "#dc2626", healthcare: "#16a34a", education: "#8b5cf6",
  safety: "#06b6d4", housing: "#ec4899", other: "#64748b",
};

const severityConfig: Record<string, { bg: string; text: string }> = {
  critical: { bg: "bg-red-50", text: "text-red-600" },
  high: { bg: "bg-amber-50", text: "text-amber-600" },
  medium: { bg: "bg-blue-50", text: "text-primary" },
  low: { bg: "bg-emerald-50", text: "text-emerald-600" },
};

export default function ComplaintIntelligencePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const constituencyName = user?.constituency || "North Chennai";
  const { data: analyticsData } = useQuery({
    queryKey: ["mp-complaint-analytics", constituencyName],
    queryFn: () => fetchAnalytics(30, constituencyName),
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });
  const { data: complaintsList } = useQuery({
    queryKey: ["mp-complaint-list", constituencyName],
    queryFn: () => fetchComplaints({ page_size: 6, constituency: constituencyName }),
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });
  const { data: statsData } = useQuery({
    queryKey: ["mp-complaint-stats-data", constituencyName],
    queryFn: () => import("@/services/api/complaints").then(m => m.fetchComplaintStats(constituencyName)),
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });

  const complaintTrends = (analyticsData?.complaint_trends || []).map((t) => ({
    month: t.date?.slice(5, 10) || t.date || "N/A",
    total: t.count,
    resolved: Math.round(t.count * 0.6),
    critical: Math.round(t.count * 0.15),
  }));

  const categoryData = (analyticsData?.category_distribution || []).map((c) => ({
    name: c.category.charAt(0).toUpperCase() + c.category.slice(1),
    value: c.count,
    color: categoryColors[c.category] || "#64748b",
  }));

  const complaintHotspots = (analyticsData?.village_breakdown || []).map((v) => ({
    rank: 0, name: v.village, complaints: v.total,
    resolved: v.total - v.critical, density: v.critical > 5 ? "Very High" : "High", trend: `+${v.critical} critical`,
  }));

  const recentComplaints = (complaintsList?.complaints || []).slice(0, 6).map((c, i) => ({
    id: c.complaint_uid,
    title: c.title,
    category: c.category?.charAt(0).toUpperCase() + c.category?.slice(1) || "Other",
    severity: c.severity || "medium",
    status: c.status || "pending",
    village: c.village || "Unknown",
    upvotes: Math.floor((c.evidence_score || 0) * 10),
    time: c.created_at ? new Date(c.created_at).toLocaleDateString() : "N/A",
  }));

  const totalComplaints = statsData?.total_complaints || analyticsData?.complaint_trends?.reduce((s, t) => s + t.count, 0) || 3847;
  const criticalCount = analyticsData?.severity_distribution?.find((s) => s.severity === "critical")?.count || 156;
  const resolvedCount = analyticsData?.severity_distribution?.find((s) => s.severity === "critical")?.count || 0;
  const resolutionRate = totalComplaints ? Math.round(((analyticsData?.department_breakdown?.reduce((s, d) => s + d.resolved, 0) || 0) / totalComplaints) * 100) : 78;

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
          { label: t("mp.complaintIntelligence.totalComplaints"), value: totalComplaints.toLocaleString("en-IN"), change: "+12.5%", up: true, icon: ClipboardList },
          { label: t("mp.complaintIntelligence.criticalIssues"), value: criticalCount.toString(), change: "-8.2%", up: false, icon: AlertTriangle },
          { label: t("mp.complaintIntelligence.resolutionRate"), value: `${resolutionRate}%`, change: "+3.1%", up: true, icon: TrendingUp },
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
                <tr key={item.name} className="border-b border-border hover:bg-muted/50 transition-colors">
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
