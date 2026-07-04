"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, FolderOpen, Brain, MapPin } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

export function Statistics() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useTranslation();

  const stats = [
    {
      icon: Users,
      value: "100K+",
      label: t("landing.statsCitizensLabel"),
      description: t("landing.statsCitizensDesc"),
      gradient: "from-violet-500 to-purple-600",
    },
    {
      icon: FolderOpen,
      value: "500+",
      label: t("landing.statsProjectsLabel"),
      description: t("landing.statsProjectsDesc"),
      gradient: "from-blue-500 to-cyan-600",
    },
    {
      icon: Brain,
      value: "98%",
      label: t("landing.statsAIAccuracyLabel"),
      description: t("landing.statsAIAccuracyDesc"),
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      icon: MapPin,
      value: "150+",
      label: t("landing.statsConstituenciesLabel"),
      description: t("landing.statsConstituenciesDesc"),
      gradient: "from-orange-500 to-amber-600",
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <div className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
            {t("landing.statsTag")}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {t("landing.statsTitle")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground md:text-xl">
            {t("landing.statsSubtitle")}
          </p>
        </div>

        <div
          ref={ref}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-accent/[0.02] opacity-0 transition-opacity group-hover:opacity-100" />
              <div
                className={`absolute -top-8 -right-8 size-24 rounded-full bg-gradient-to-br ${stat.gradient} opacity-5 transition-all group-hover:scale-150 group-hover:opacity-10`}
              />
              <div className="relative">
                <div
                  className={`mb-4 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}
                >
                  <stat.icon className="size-6" />
                </div>
                <div className="text-3xl font-bold text-foreground sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm font-medium text-foreground">
                  {stat.label}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {stat.description}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
