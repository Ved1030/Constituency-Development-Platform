"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Users,
  MapPin,
  Brain,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { fetchAnalytics } from "@/services/api/analytics";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["mp-analytics"],
    queryFn: () => fetchAnalytics(30),
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });

  const villageData = useMemo(() => {
    if (!analyticsData?.village_breakdown) return [];
    return analyticsData.village_breakdown.map((v) => ({
      name: v.village.length > 10 ? v.village.slice(0, 10) + "..." : v.village,
      complaints: v.total,
      resolved: 0,
      satisfaction: 0,
      population: 0,
    }));
  }, [analyticsData]);

  const deptData = useMemo(() => {
    if (!analyticsData?.department_breakdown) return [];
    return analyticsData.department_breakdown.map((d) => ({
      name: d.department.split(" ")[0],
      complaints: d.total,
      resolved: d.resolved,
      satisfaction: Math.round(d.resolution_rate),
    }));
  }, [analyticsData]);

  const monthlyTrend = useMemo(() => {
    if (!analyticsData?.complaint_trends) return [];
    return analyticsData.complaint_trends.map((c) => ({
      month: c.date,
      total: c.count,
      resolved: 0,
      critical: 0,
    }));
  }, [analyticsData]);

  const satisfactionByVillage = useMemo(() => {
    if (!analyticsData?.village_breakdown) return [];
    return [...analyticsData.village_breakdown]
      .sort((a, b) => {
        const aRatio = a.total > 0 ? ((a.total - a.critical) / a.total) : 0;
        const bRatio = b.total > 0 ? ((b.total - b.critical) / b.total) : 0;
        return bRatio - aRatio;
      })
      .slice(0, 8)
      .map((v) => ({
        name: v.village.length > 10 ? v.village.slice(0, 10) + "..." : v.village,
        score: v.total > 0 ? Math.round(((v.total - v.critical) / v.total) * 100) : 0,
      }));
  }, [analyticsData]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2">
          <BarChart3 className="size-5 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">{t("mp.analytics.title")}</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{t("mp.analytics.subtitle")}</p>
      </motion.div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: t("mp.analytics.totalVillages"), value: "142", icon: MapPin, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: t("mp.analytics.avgSatisfaction"), value: "80.6%", icon: Users, color: "text-primary", bg: "bg-blue-50" },
          { label: t("mp.analytics.resolutionRate"), value: "78.4%", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
          { label: t("mp.analytics.aiConfidence"), value: "87%", icon: Brain, color: "text-amber-600", bg: "bg-amber-50" },
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

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Complaint Trends */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <h3 className="mb-4 text-sm font-semibold text-foreground">{t("mp.analytics.monthlyComplaintTrends")}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend}>
                <defs>
                  <linearGradient id="totalG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1565C0" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1565C0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748B" }} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", background: "#FFFFFF", color: "#1E293B" }} />
                <Area type="monotone" dataKey="total" stroke="#1565C0" fill="url(#totalG)" strokeWidth={2} />
                <Line type="monotone" dataKey="resolved" stroke="#16A34A" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="critical" stroke="#DC2626" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Department Performance */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <h3 className="mb-4 text-sm font-semibold text-foreground">{t("mp.analytics.deptComplaintDistribution")}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748B" }} />
                <YAxis tick={{ fontSize: 10, fill: "#64748B" }} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", background: "#FFFFFF", color: "#1E293B" }} />
                <Bar dataKey="complaints" fill="#DC2626" radius={[4, 4, 0, 0]} name="Complaints" />
                <Bar dataKey="resolved" fill="#16A34A" radius={[4, 4, 0, 0]} name="Resolved" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Village Complaints */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <h3 className="mb-4 text-sm font-semibold text-foreground">{t("mp.analytics.villageWiseComplaints")}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={villageData} layout="vertical" margin={{ top: 5, right: 10, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#64748B" }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#64748B" }} width={80} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", background: "#FFFFFF", color: "#1E293B" }} />
                <Bar dataKey="complaints" fill="#F97316" radius={[0, 4, 4, 0]} name="Complaints" />
                <Bar dataKey="resolved" fill="#16A34A" radius={[0, 4, 4, 0]} name="Resolved" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Satisfaction Rankings */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <h3 className="mb-4 text-sm font-semibold text-foreground">{t("mp.analytics.villageSatisfactionRankings")}</h3>
          <div className="space-y-2">
            {satisfactionByVillage.map((v, i) => (
              <div key={v.name} className="flex items-center gap-3 rounded-xl bg-muted/30 p-3">
                <div className={cn(
                  "flex size-7 items-center justify-center rounded-lg text-[11px] font-bold",
                  v.score >= 85 ? "bg-emerald-50 text-emerald-600" :
                  v.score >= 75 ? "bg-blue-50 text-primary" :
                  "bg-amber-50 text-amber-600",
                )}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground">{v.name}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn("h-full rounded-full", v.score >= 85 ? "bg-emerald-500" : v.score >= 75 ? "bg-primary" : "bg-amber-500")}
                      style={{ width: `${v.score}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-foreground w-8 text-right">{v.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
