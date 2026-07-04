"use client";

import { motion } from "framer-motion";
import { Monitor, Map, LineChart, LayoutDashboard } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

export function PlatformPreview() {
  const { t } = useTranslation();

  const previews = [
    {
      icon: LayoutDashboard,
      title: t("landing.previewDashboardLabel"),
      description: t("landing.previewDashboardDesc"),
      gradient: "from-primary to-accent",
    },
    {
      icon: Map,
      title: t("landing.previewMapViewLabel"),
      description: t("landing.previewMapViewDesc"),
      gradient: "from-emerald-400 to-teal-500",
    },
    {
      icon: LineChart,
      title: t("landing.previewImpactSimLabel"),
      description: t("landing.previewImpactSimDesc"),
      gradient: "from-violet-400 to-purple-500",
    },
  ];

  return (
    <section id="solutions" className="py-16 md:py-24 bg-card/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <div className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
            {t("landing.previewTag")}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {t("landing.previewTitle")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground md:text-xl">
            {t("landing.previewSubtitle")}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-5xl"
        >
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center gap-2 border-b border-border px-6 py-4">
              <div className="size-3 rounded-full bg-destructive" />
              <div className="size-3 rounded-full bg-warning" />
              <div className="size-3 rounded-full bg-success" />
              <div className="ml-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Monitor className="size-3" />
                <span>CDP Dashboard &mdash; Constituency Overview</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 p-6">
              <div className="col-span-2 space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 rounded-xl border border-border bg-gradient-to-br from-primary/5 to-accent/5 p-4">
                    <div className="text-xs text-muted-foreground">
                      {t("landing.previewTotalProjects")}
                    </div>
                    <div className="mt-1 text-2xl font-bold text-foreground">
                      1,847
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-muted">
                      <div className="h-2 w-3/4 rounded-full bg-gradient-to-r from-primary to-accent" />
                    </div>
                  </div>
                  <div className="flex-1 rounded-xl border border-border bg-card p-4">
                    <div className="text-xs text-muted-foreground">
                      {t("landing.previewBudgetUtilized")}
                    </div>
                    <div className="mt-1 text-2xl font-bold text-success">
                      ₹2.4B
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-muted">
                      <div className="h-2 w-2/3 rounded-full bg-success" />
                    </div>
                  </div>
                  <div className="flex-1 rounded-xl border border-border bg-card p-4">
                    <div className="text-xs text-muted-foreground">
                      {t("landing.previewCitizenSatisfaction")}
                    </div>
                    <div className="mt-1 text-2xl font-bold text-primary">
                      87%
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-muted">
                      <div className="h-2 w-5/6 rounded-full bg-primary" />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="mb-3 text-xs font-medium text-muted-foreground">
                    {t("landing.previewProjectPriority")}
                  </div>
                  <div className="space-y-3">
                    {[
                      { labelKey: "landing.previewSchoolInfra", score: 94, color: "bg-primary" },
                      { labelKey: "landing.previewHealthcare", score: 88, color: "bg-success" },
                      { labelKey: "landing.previewRoadConnectivity", score: 76, color: "bg-warning" },
                      { labelKey: "landing.previewWaterSupply", score: 92, color: "bg-accent" },
                    ].map((item) => (
                      <div key={item.labelKey} className="flex items-center gap-3">
                        <span className="w-28 text-xs text-muted-foreground">
                          {t(item.labelKey)}
                        </span>
                        <div className="flex-1 h-2 rounded-full bg-muted">
                          <div
                            className={`h-2 rounded-full ${item.color}`}
                            style={{ width: `${item.score}%` }}
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
                {previews.map((preview, i) => (
                  <div
                    key={preview.title}
                    className="rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/20 hover:shadow-md"
                  >
                    <div
                      className={`mb-3 flex size-10 items-center justify-center rounded-lg bg-gradient-to-br ${preview.gradient} text-white`}
                    >
                      <preview.icon className="size-5" />
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      {preview.title}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {preview.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              { labelKey: "landing.previewRealTimeAnalytics", descKey: "landing.previewLiveData" },
              { labelKey: "landing.previewAIPredictions", descKey: "landing.previewForecastNeeds" },
              { labelKey: "landing.previewCitizenFeedback", descKey: "landing.previewNLPInsights" },
            ].map((item) => (
              <div
                key={item.labelKey}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
              >
                <div className="size-2 rounded-full bg-success" />
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {t(item.labelKey)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t(item.descKey)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
