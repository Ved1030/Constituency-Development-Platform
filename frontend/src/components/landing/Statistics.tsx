"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, MapPin, Brain, IndianRupee, MessageSquare } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

function AnimatedCounter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1800;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      if (target >= 1000000) {
        setDisplay(`${(current / 1000000).toFixed(current >= target ? 0 : 0)}M`);
      } else if (target >= 1000) {
        setDisplay(`${Math.floor(current / 1000)}K`);
      } else {
        setDisplay(`${current}`);
      }

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {prefix}{display}{suffix}
    </span>
  );
}

export function Statistics() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useTranslation();

  const stats = [
    {
      icon: Users,
      value: 100000,
      prefix: "",
      suffix: "K+",
      label: t("landing.statsCitizensLabel"),
      description: t("landing.statsCitizensDesc"),
      gradient: "from-violet-500 to-purple-600",
    },
    {
      icon: MapPin,
      value: 150,
      prefix: "",
      suffix: "+",
      label: t("landing.statsConstituenciesLabel"),
      description: t("landing.statsConstituenciesDesc"),
      gradient: "from-blue-500 to-cyan-600",
    },
    {
      icon: Brain,
      value: 98,
      prefix: "",
      suffix: "%",
      label: t("landing.statsAIAccuracyLabel"),
      description: t("landing.statsAIAccuracyDesc"),
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      icon: IndianRupee,
      value: 1200,
      prefix: "₹",
      suffix: "Cr+",
      label: t("landing.statsBudgetLabel"),
      description: t("landing.statsBudgetDesc"),
      gradient: "from-orange-500 to-amber-600",
    },
    {
      icon: MessageSquare,
      value: 5000000,
      prefix: "",
      suffix: "+",
      label: t("landing.statsComplaintsLabel"),
      description: t("landing.statsComplaintsDesc"),
      gradient: "from-rose-500 to-pink-600",
    },
  ];

  return (
    <section className="py-20 md:py-32">
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
              {t("landing.statsTag")}
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[56px] lg:leading-[1.1]"
          >
            {t("landing.statsTitle")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            {t("landing.statsSubtitle")}
          </motion.p>
        </div>

        <div
          ref={ref}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/80 p-5 shadow-lg shadow-black/[0.03] backdrop-blur-sm transition-all hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-accent/[0.02] opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div
                  className={`mb-3 flex size-11 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}
                >
                  <stat.icon className="size-5" />
                </div>
                <div className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  <AnimatedCounter
                    target={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </div>
                <div className="mt-1 text-sm font-medium text-foreground">
                  {stat.label}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
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
