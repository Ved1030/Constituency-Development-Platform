"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  Brain,
  ListChecks,
  LayoutDashboard,
  LineChart,
  BadgeCheck,
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

export function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    {
      icon: MessageSquare,
      title: t("landing.step1Title"),
      description: t("landing.step1Description"),
      gradient: "from-violet-500 to-purple-500",
    },
    {
      icon: Brain,
      title: t("landing.step2Title"),
      description: t("landing.step2Description"),
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: ListChecks,
      title: t("landing.step3Title"),
      description: t("landing.step3Description"),
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: LayoutDashboard,
      title: t("landing.step4Title"),
      description: t("landing.step4Description"),
      gradient: "from-orange-500 to-amber-500",
    },
    {
      icon: LineChart,
      title: t("landing.step5Title"),
      description: t("landing.step5Description"),
      gradient: "from-rose-500 to-pink-500",
    },
    {
      icon: BadgeCheck,
      title: t("landing.step6Title"),
      description: t("landing.step6Description"),
      gradient: "from-primary to-accent",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <div className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
            {t("landing.howItWorksTag")}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {t("landing.howItWorksTitle")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground md:text-xl">
            {t("landing.howItWorksSubtitle")}
          </p>
        </div>

        <div className="relative mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="absolute -top-3 -left-3 flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-white shadow-md">
                  {index + 1}
                </div>

                <div
                  className={`mb-4 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${step.gradient} text-white shadow-lg`}
                >
                  <step.icon className="size-6" />
                </div>

                <h3 className="text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 text-muted-foreground/30 lg:block">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
