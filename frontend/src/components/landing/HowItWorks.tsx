"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  Brain,
  ListChecks,
  LayoutDashboard,
  FolderOpen,
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
      icon: FolderOpen,
      title: t("landing.step5Title"),
      description: t("landing.step5Description"),
      gradient: "from-rose-500 to-pink-500",
    },
    {
      icon: LineChart,
      title: t("landing.step6Title"),
      description: t("landing.step6Description"),
      gradient: "from-indigo-500 to-violet-500",
    },
    {
      icon: BadgeCheck,
      title: t("landing.step4Title"),
      description: t("landing.step4Description"),
      gradient: "from-primary to-accent",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-32">
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
              {t("landing.howItWorksTag")}
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[56px] lg:leading-[1.1]"
          >
            {t("landing.howItWorksTitle")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            {t("landing.howItWorksSubtitle")}
          </motion.p>
        </div>

        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-accent/20 to-primary/20 lg:hidden" />

          <div className="absolute top-1/2 left-0 right-0 hidden h-0.5 -translate-y-1/2 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 lg:block" />

          <div className="relative grid gap-8 md:grid-cols-2 lg:grid-cols-7">
            {steps.map((step, index) => (
              <motion.div
                key={step.title + index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="relative rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:shadow-lg lg:text-center">
                  <div className="absolute -top-3 left-6 z-10 flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-white shadow-md lg:left-1/2 lg:-translate-x-1/2">
                    {index + 1}
                  </div>

                  <div className="mt-4 flex justify-center lg:mt-6">
                    <div
                      className={`flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${step.gradient} text-white shadow-lg transition-transform group-hover:scale-110`}
                    >
                      <step.icon className="size-6" />
                    </div>
                  </div>

                  <h3 className="mt-4 text-base font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
