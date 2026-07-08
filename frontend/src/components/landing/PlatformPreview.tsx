"use client";

import { motion } from "framer-motion";
import {
  Monitor,
  BarChart3,
  CheckCircle2,
  Clock,
  TrendingUp,
  Map,
  Lightbulb,
  Bell,
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

const kpiData = [
  { label: "Total Projects", value: "1,847", icon: BarChart3, color: "from-primary to-accent" },
  { label: "Budget Utilized", value: "₹2.4B", icon: TrendingUp, color: "from-emerald-500 to-teal-500" },
  { label: "Resolved", value: "1,284", icon: CheckCircle2, color: "from-violet-500 to-purple-500" },
  { label: "Avg Response", value: "2.4h", icon: Clock, color: "from-amber-500 to-orange-500" },
];

const priorityData = [
  { label: "School Infrastructure", score: 94, color: "bg-primary" },
  { label: "Healthcare Centers", score: 88, color: "bg-emerald-500" },
  { label: "Road Connectivity", score: 76, color: "bg-amber-500" },
  { label: "Water Supply", score: 92, color: "bg-accent" },
];

const chartBars = [40, 55, 45, 70, 58, 82, 68, 88, 75, 92, 80, 95];

const notifications = [
  { text: "AI detected 12 new critical issues in Ward 5", time: "2m ago" },
  { text: "Budget optimization report ready", time: "15m ago" },
  { text: "Citizen satisfaction up 3.2% this week", time: "1h ago" },
];

export function PlatformPreview() {
  const { t } = useTranslation();

  return (
    <section id="solutions" className="py-20 md:py-32 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 px-5 py-2"
          >
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold tracking-wide text-primary">
              {t("landing.previewTag")}
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[56px] lg:leading-[1.1]"
          >
            {t("landing.previewTitle")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            {t("landing.previewSubtitle")}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-6xl"
        >
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 blur-2xl" />

          <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card shadow-2xl shadow-primary/10">
            <div className="flex items-center gap-2 border-b border-border/50 bg-muted/30 px-6 py-4">
              <div className="size-3 rounded-full bg-[#ff5f57]" />
              <div className="size-3 rounded-full bg-[#febc2e]" />
              <div className="size-3 rounded-full bg-[#28c840]" />
              <div className="ml-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Monitor className="size-3.5" />
                <span>CDP Dashboard — Constituency Overview</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 p-6 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-2">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {kpiData.map((kpi, i) => (
                    <motion.div
                      key={kpi.label}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="rounded-xl border border-border/50 bg-gradient-to-br from-primary/5 to-accent/5 p-4"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`flex size-7 items-center justify-center rounded-lg bg-gradient-to-br ${kpi.color} text-white`}>
                          <kpi.icon className="size-3.5" />
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">{kpi.label}</div>
                      <div className="text-xl font-bold text-foreground">{kpi.value}</div>
                    </motion.div>
                  ))}
                </div>

                <div className="rounded-xl border border-border/50 bg-card p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      {t("landing.previewProjectPriority")}
                    </span>
                    <span className="text-xs text-success">+18% this month</span>
                  </div>
                  <div className="flex items-end gap-1.5" style={{ height: 80 }}>
                    {chartBars.map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + i * 0.05, duration: 0.5 }}
                        className="flex-1 origin-bottom rounded-t-sm bg-gradient-to-t from-primary/60 to-accent/40"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-border/50 bg-card p-4">
                  <div className="mb-3 text-xs font-medium text-muted-foreground">
                    Project Priority Score
                  </div>
                  <div className="space-y-3">
                    {priorityData.map((item) => (
                      <div key={item.label} className="flex items-center gap-3">
                        <span className="w-32 text-xs text-muted-foreground">
                          {item.label}
                        </span>
                        <div className="h-2 flex-1 rounded-full bg-muted">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${item.score}%` }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                            className={`h-2 rounded-full ${item.color}`}
                          />
                        </div>
                        <span className="text-xs font-medium text-foreground">
                          {item.score}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-border/50 bg-card p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Map className="size-4 text-primary" />
                    <span className="text-xs font-medium text-muted-foreground">
                      {t("landing.previewMapViewLabel")}
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-0.5">
                    {[
                      "#dcfce7", "#bbf7d0", "#86efac", "#4ade80", "#22c55e",
                      "#bbf7d0", "#fde68a", "#fbbf24", "#86efac", "#4ade80",
                      "#86efac", "#fbbf24", "#fb923c", "#fde68a", "#bbf7d0",
                      "#fde68a", "#fb923c", "#ef4444", "#fbbf24", "#86efac",
                      "#22c55e", "#4ade80", "#fde68a", "#bbf7d0", "#dcfce7",
                    ].map((color, i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-[2px]"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-border/50 bg-card p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Lightbulb className="size-4 text-amber-500" />
                    <span className="text-xs font-medium text-muted-foreground">
                      {t("landing.previewAIPredictions")}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {[
                      "Water supply issues likely in Ward 3-5",
                      "Road complaints trending upward",
                      "Healthcare access gap detected",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="mt-0.5 size-1.5 shrink-0 rounded-full bg-primary" />
                        <span className="text-[11px] text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-border/50 bg-card p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Bell className="size-4 text-primary" />
                    <span className="text-xs font-medium text-muted-foreground">
                      Live Notifications
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {notifications.map((n, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 1 + i * 0.15 }}
                        className="flex items-start gap-2"
                      >
                        <div className="mt-0.5 size-1.5 shrink-0 rounded-full bg-success" />
                        <div>
                          <span className="text-[11px] text-foreground">{n.text}</span>
                          <div className="text-[9px] text-muted-foreground">{n.time}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { labelKey: "landing.previewRealTimeAnalytics", descKey: "landing.previewLiveData" },
              { labelKey: "landing.previewAIPredictions", descKey: "landing.previewForecastNeeds" },
              { labelKey: "landing.previewCitizenFeedback", descKey: "landing.previewNLPInsights" },
            ].map((item, i) => (
              <motion.div
                key={item.labelKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
              >
                <div className="size-2 shrink-0 rounded-full bg-success" />
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {t(item.labelKey)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t(item.descKey)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
