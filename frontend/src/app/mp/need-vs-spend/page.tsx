"use client";

import { motion } from "framer-motion";
import {
  Flame,
  Users,
  IndianRupee,
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Target,
  Lightbulb,
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
import { needVsSpendData } from "@/data/mock-mp";
import { cn } from "@/lib/utils";

const demandChartData = needVsSpendData.citizenDemand.map((d) => ({
  name: d.category.split(" ")[0],
  demand: d.demand,
  sentiment: d.sentiment,
}));

const spendChartData = needVsSpendData.governmentSpending.map((s) => ({
  name: s.category.split(" ")[0],
  allocated: s.allocated / 100000,
  spent: s.spent / 100000,
  utilization: s.utilization,
}));

const radarData = needVsSpendData.citizenDemand.map((d, i) => ({
  category: d.category.split(" ")[0],
  demand: d.demand,
  spending: needVsSpendData.governmentSpending[i]?.utilization * 10 || 0,
}));

const gapColors: Record<string, { bg: string; text: string; border: string }> = {
  High: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
  Medium: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
  Low: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
};

export default function NeedVsSpendPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2">
          <Flame className="size-5 text-orange-600" />
          <h1 className="text-2xl font-bold text-foreground">Need vs Spend</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Compare citizen demand against government spending. AI identifies gaps and recommends reallocations.</p>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Citizen Demands", value: "3,484", icon: Users, color: "text-orange-600", bg: "bg-orange-50", sub: "Total registered" },
          { label: "Total Spent", value: "₹28.0 Cr", icon: IndianRupee, color: "text-emerald-600", bg: "bg-emerald-50", sub: "74.2% utilized" },
          { label: "AI Gaps Identified", value: "3", icon: Brain, color: "text-purple-600", bg: "bg-purple-50", sub: "Require attention" },
          { label: "Overall Match", value: "76%", icon: Target, color: "text-primary", bg: "bg-blue-50", sub: "Need-spend alignment" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <div className={cn("flex size-9 items-center justify-center rounded-xl", stat.bg)}>
              <stat.icon className={cn("size-4", stat.color)} />
            </div>
            <div className="mt-3 text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
            <div className="text-[10px] text-muted-foreground/60">{stat.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Two Huge Panels */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Citizen Demand Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl border border-orange-200 bg-card p-6"
        >
          <div className="mb-4 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-orange-50">
              <Users className="size-4 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Citizen Demand</h2>
              <p className="text-[11px] text-muted-foreground">What citizens are asking for</p>
            </div>
          </div>

          {/* Demand Chart */}
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demandChartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "rgba(0,0,0,0.4)" }} />
                <YAxis tick={{ fontSize: 10, fill: "rgba(0,0,0,0.4)" }} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid rgba(0,0,0,0.1)", background: "#ffffff" }} />
                <Bar dataKey="demand" fill="#ea580c" radius={[4, 4, 0, 0]} name="Complaints" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Demand List */}
          <div className="space-y-2">
            {needVsSpendData.citizenDemand.map((item) => (
              <div key={item.category} className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-orange-50">
                  <BarChart3 className="size-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">{item.category}</div>
                  <div className="text-[10px] text-muted-foreground">{item.demand} complaints registered</div>
                </div>
                <div className="text-right">
                  <span className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                    item.priority === "Critical" ? "bg-red-50 text-red-600" :
                    item.priority === "High" ? "bg-amber-50 text-amber-600" :
                    "bg-blue-50 text-primary",
                  )}>
                    {item.priority}
                  </span>
                  <div className="mt-1 text-[10px] text-muted-foreground">Sentiment: {item.sentiment}%</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Government Spending Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl border border-blue-200 bg-card p-6"
        >
          <div className="mb-4 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50">
              <IndianRupee className="size-4 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Government Spending</h2>
              <p className="text-[11px] text-muted-foreground">How budget is being allocated</p>
            </div>
          </div>

          {/* Spending Chart */}
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spendChartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "rgba(0,0,0,0.4)" }} />
                <YAxis tick={{ fontSize: 10, fill: "rgba(0,0,0,0.4)" }} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid rgba(0,0,0,0.1)", background: "#ffffff" }} />
                <Bar dataKey="allocated" fill="rgba(0,0,0,0.08)" radius={[4, 4, 0, 0]} name="Allocated (L)" />
                <Bar dataKey="spent" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Spent (L)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Spending List */}
          <div className="space-y-2">
            {needVsSpendData.governmentSpending.map((item) => (
              <div key={item.category} className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50">
                  <IndianRupee className="size-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">{item.category}</div>
                  <div className="text-[10px] text-muted-foreground">₹{(item.spent / 100000).toFixed(0)}L / ₹{(item.allocated / 100000).toFixed(0)}L</div>
                </div>
                <div className="text-right">
                  <span className={cn(
                    "text-sm font-bold",
                    item.utilization >= 85 ? "text-amber-600" : item.utilization >= 70 ? "text-emerald-600" : "text-primary",
                  )}>
                    {item.utilization}%
                  </span>
                  <div className="mt-1 h-1 w-16 overflow-hidden rounded-full bg-muted ml-auto">
                    <div
                      className={cn("h-full rounded-full", item.utilization >= 85 ? "bg-amber-500" : "bg-primary")}
                      style={{ width: `${item.utilization}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Radar Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <h2 className="mb-4 text-lg font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="size-5 text-purple-600" />
          Demand vs Spending Radar
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(0,0,0,0.06)" />
              <PolarAngleAxis dataKey="category" tick={{ fontSize: 10, fill: "rgba(0,0,0,0.5)" }} />
              <PolarRadiusAxis tick={{ fontSize: 9, fill: "rgba(0,0,0,0.3)" }} />
              <Radar name="Citizen Demand" dataKey="demand" stroke="#ea580c" fill="#ea580c" fillOpacity={0.2} strokeWidth={2} />
              <Radar name="Spending" dataKey="spending" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid rgba(0,0,0,0.1)", background: "#ffffff" }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-orange-500" />
            <span className="text-xs text-muted-foreground">Citizen Demand</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-blue-500" />
            <span className="text-xs text-muted-foreground">Government Spending</span>
          </div>
        </div>
      </motion.div>

      {/* AI Gap Analysis */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Brain className="size-5 text-purple-600" />
          <h2 className="text-lg font-bold text-foreground">AI Gap Analysis</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {needVsSpendData.gapAnalysis.map((gap, i) => {
            const colors = gapColors[gap.gap];
            return (
              <motion.div
                key={gap.category}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={cn("rounded-2xl border bg-card p-5 transition-all hover:bg-muted cursor-pointer", colors.border)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-bold uppercase", colors.bg, colors.text)}>
                      {gap.gap} Gap
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Brain className="size-3 text-purple-600" />
                    <span className="text-[10px] text-purple-600">{gap.aiConfidence}%</span>
                  </div>
                </div>

                <h3 className="mt-3 text-base font-semibold text-foreground">{gap.category}</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{gap.insight}</p>

                <div className="mt-4 flex items-center gap-2">
                  <Lightbulb className="size-3.5 text-amber-600" />
                  <span className="text-[10px] text-amber-600/70">AI recommends action</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
