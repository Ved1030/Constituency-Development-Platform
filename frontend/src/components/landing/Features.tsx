"use client";

import { motion } from "framer-motion";
import {
  Bot,
  LineChart,
  Scale,
  GitCompare,
  ListChecks,
  Languages,
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

export function Features() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Bot,
      title: t("landing.feature1Title"),
      description: t("landing.feature1Description"),
      gradient: "from-violet-500 to-purple-600",
    },
    {
      icon: LineChart,
      title: t("landing.feature2Title"),
      description: t("landing.feature2Description"),
      gradient: "from-blue-500 to-cyan-600",
    },
    {
      icon: Scale,
      title: t("landing.feature3Title"),
      description: t("landing.feature3Description"),
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      icon: GitCompare,
      title: t("landing.feature4Title"),
      description: t("landing.feature4Description"),
      gradient: "from-orange-500 to-amber-600",
    },
    {
      icon: ListChecks,
      title: t("landing.feature5Title"),
      description: t("landing.feature5Description"),
      gradient: "from-rose-500 to-pink-600",
    },
    {
      icon: Languages,
      title: t("landing.feature6Title"),
      description: t("landing.feature6Description"),
      gradient: "from-primary to-accent",
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-card/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <div className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
            {t("landing.aiFeaturesTag")}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {t("landing.poweredByAI")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground md:text-xl">
            {t("landing.aiFeaturesSubtitle")}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              className="group cursor-pointer rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5"
            >
              <div
                className={`mb-5 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg transition-all group-hover:scale-110 group-hover:shadow-xl`}
              >
                <feature.icon className="size-6" />
              </div>

              <h3 className="text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>

              <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                <span>{t("common.learnMore")}</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
