"use client";

import { motion } from "framer-motion";
import {
  Bot,
  MessageSquare,
  Zap,
  Map,
  Scale,
  PieChart,
  Activity,
  Vote,
  MapPin,
  TrendingUp,
  LineChart,
  Lightbulb,
  Mic,
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
      icon: MessageSquare,
      title: t("landing.feature4Title"),
      description: t("landing.feature4Description"),
      gradient: "from-blue-500 to-cyan-600",
    },
    {
      icon: Zap,
      title: t("landing.feature7Title"),
      description: t("landing.priorityEngineDesc"),
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      icon: Map,
      title: t("landing.feature2Title"),
      description: t("landing.feature2Description"),
      gradient: "from-orange-500 to-amber-600",
    },
    {
      icon: Scale,
      title: t("landing.feature3Title"),
      description: t("landing.feature3Description"),
      gradient: "from-rose-500 to-pink-600",
    },
    {
      icon: PieChart,
      title: t("landing.feature7Title"),
      description: t("landing.feature7Description"),
      gradient: "from-indigo-500 to-violet-600",
    },
    {
      icon: Activity,
      title: t("landing.feature8Title"),
      description: t("landing.feature8Description"),
      gradient: "from-teal-500 to-cyan-600",
    },
    {
      icon: Vote,
      title: t("landing.feature9Title"),
      description: t("landing.feature9Description"),
      gradient: "from-green-500 to-lime-600",
    },
    {
      icon: MapPin,
      title: t("landing.feature10Title"),
      description: t("landing.feature10Description"),
      gradient: "from-sky-500 to-blue-600",
    },
    {
      icon: TrendingUp,
      title: t("landing.impactSimulator"),
      description: t("landing.impactSimulatorDesc"),
      gradient: "from-amber-500 to-orange-600",
    },
    {
      icon: LineChart,
      title: t("landing.feature11Title"),
      description: t("landing.feature11Description"),
      gradient: "from-violet-500 to-purple-600",
    },
    {
      icon: Lightbulb,
      title: t("landing.feature5Title"),
      description: t("landing.feature5Description"),
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      icon: Mic,
      title: t("landing.feature12Title"),
      description: t("landing.feature12Description"),
      gradient: "from-rose-500 to-red-600",
    },
    {
      icon: Languages,
      title: t("landing.feature6Title"),
      description: t("landing.feature6Description"),
      gradient: "from-primary to-accent",
    },
  ];

  return (
    <section id="features" className="py-20 md:py-32 bg-card/30">
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
              {t("landing.aiFeaturesTag")}
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[56px] lg:leading-[1.1]"
          >
            {t("landing.poweredByAI")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            {t("landing.aiFeaturesSubtitle")}
          </motion.p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title + index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5"
            >
              <div
                className={`mb-5 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg transition-all group-hover:scale-110 group-hover:shadow-xl`}
              >
                <feature.icon className="size-6" />
              </div>

              <h3 className="text-base font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>

              <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
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
