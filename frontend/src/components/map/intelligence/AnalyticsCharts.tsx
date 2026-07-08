"use client";

import { TrendingUp, BarChart3, PieChart, Activity, Brain, Heart } from "lucide-react";
import type { AnalyticsData } from "@/types/digital-twin";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

function formatDate(raw: string | number): string {
  const d = new Date(raw);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

function formatINR(val: number): string {
  return "\u20B9" + val.toLocaleString("en-IN");
}

interface AnalyticsChartsProps {
  data: AnalyticsData;
}

export default function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  const hasData = [
    data.complaintGrowth,
    data.votes,
    data.sentiment,
    data.departmentResponse,
    data.budget,
    data.aiConfidence,
  ].some((arr) => arr && arr.length > 0);

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 rounded-2xl bg-muted p-5">
          <BarChart3 className="size-10 text-muted-foreground/60" />
        </div>
        <p className="text-sm font-medium text-foreground">Analytics data not available yet</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-4 md:grid-cols-2"
    >
      {/* 1. Complaint Growth */}
      <motion.div
        variants={cardVariants}
        className="rounded-xl border border-border bg-card p-4"
      >
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp className="size-4 text-muted-foreground" />
          <h4 className="text-sm font-semibold text-foreground">Complaint Growth</h4>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data.complaintGrowth} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeWidth={0.5} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(val) => formatDate(val)}
              axisLine={false}
              tickLine={false}
              interval={4}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="rounded-lg border border-border bg-card/95 px-3 py-2 text-xs shadow-lg backdrop-blur-sm">
                    <p className="mb-1 font-medium text-foreground">{formatDate(label ?? "")}</p>
                    <p style={{ color: "#ef4444" }}>Count: {payload[0].value}</p>
                  </div>
                );
              }}
            />
            <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} dot={false} fill="url(#redGradient)" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* 2. Community Votes */}
      <motion.div
        variants={cardVariants}
        className="rounded-xl border border-border bg-card p-4"
      >
        <div className="mb-3 flex items-center gap-2">
          <Heart className="size-4 text-muted-foreground" />
          <h4 className="text-sm font-semibold text-foreground">Community Votes</h4>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data.votes} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeWidth={0.5} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(val) => formatDate(val)}
              axisLine={false}
              tickLine={false}
              interval={4}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="rounded-lg border border-border bg-card/95 px-3 py-2 text-xs shadow-lg backdrop-blur-sm">
                    <p className="mb-1 font-medium text-foreground">{formatDate(label ?? "")}</p>
                    <p style={{ color: "#8b5cf6" }}>Votes: {payload[0].value}</p>
                  </div>
                );
              }}
            />
            <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} fill="url(#purpleGradient)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* 3. Sentiment Trend */}
      <motion.div
        variants={cardVariants}
        className="rounded-xl border border-border bg-card p-4"
      >
        <div className="mb-3 flex items-center gap-2">
          <Activity className="size-4 text-muted-foreground" />
          <h4 className="text-sm font-semibold text-foreground">Sentiment Trend</h4>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data.sentiment} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeWidth={0.5} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(val) => formatDate(val)}
              axisLine={false}
              tickLine={false}
              interval={4}
            />
            <YAxis
              domain={[0, 1]}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="rounded-lg border border-border bg-card/95 px-3 py-2 text-xs shadow-lg backdrop-blur-sm">
                    <p className="mb-1 font-medium text-foreground">{formatDate(label ?? "")}</p>
                    <p style={{ color: "#10b981" }}>
                      Score: {(Number(payload[0].value) * 100).toFixed(1)}%
                    </p>
                  </div>
                );
              }}
            />
            <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fill="url(#greenGradient)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* 4. Department Response */}
      <motion.div
        variants={cardVariants}
        className="rounded-xl border border-border bg-card p-4"
      >
        <div className="mb-3 flex items-center gap-2">
          <BarChart3 className="size-4 text-muted-foreground" />
          <h4 className="text-sm font-semibold text-foreground">Department Response Time</h4>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data.departmentResponse} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeWidth={0.5} />
            <XAxis
              dataKey="department"
              tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const row = data.departmentResponse.find((d) => d.department === label);
                return (
                  <div className="rounded-lg border border-border bg-card/95 px-3 py-2 text-xs shadow-lg backdrop-blur-sm">
                    <p className="mb-1 font-medium text-foreground">{label}</p>
                    <p style={{ color: "#3b82f6" }}>Avg: {payload[0].value} days</p>
                    {row && <p className="text-muted-foreground">Resolved: {row.resolved}</p>}
                  </div>
                );
              }}
            />
            <Bar dataKey="avgDays" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* 5. Budget Overview */}
      <motion.div
        variants={cardVariants}
        className="rounded-xl border border-border bg-card p-4"
      >
        <div className="mb-3 flex items-center gap-2">
          <PieChart className="size-4 text-muted-foreground" />
          <h4 className="text-sm font-semibold text-foreground">Budget Overview</h4>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data.budget} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeWidth={0.5} />
            <XAxis
              dataKey="category"
              tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="rounded-lg border border-border bg-card/95 px-3 py-2 text-xs shadow-lg backdrop-blur-sm">
                    <p className="mb-1 font-medium text-foreground">{label}</p>
                    {payload.map((entry, i) => (
                      <p key={i} style={{ color: entry.color }}>
                        {entry.name}: {formatINR(Number(entry.value))}
                      </p>
                    ))}
                  </div>
                );
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 10, paddingTop: 8 }}
              iconType="circle"
              iconSize={6}
            />
            <Bar dataKey="allocated" name="Allocated" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={16} />
            <Bar dataKey="spent" name="Spent" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* 6. AI Confidence */}
      <motion.div
        variants={cardVariants}
        className="rounded-xl border border-border bg-card p-4"
      >
        <div className="mb-3 flex items-center gap-2">
          <Brain className="size-4 text-muted-foreground" />
          <h4 className="text-sm font-semibold text-foreground">AI Confidence</h4>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data.aiConfidence} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeWidth={0.5} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(val) => formatDate(val)}
              axisLine={false}
              tickLine={false}
              interval={4}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(val) => `${val}%`}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="rounded-lg border border-border bg-card/95 px-3 py-2 text-xs shadow-lg backdrop-blur-sm">
                    <p className="mb-1 font-medium text-foreground">{formatDate(label ?? "")}</p>
                    <p style={{ color: "#10b981" }}>{Number(payload[0].value).toFixed(1)}%</p>
                  </div>
                );
              }}
            />
            <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
}
