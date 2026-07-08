"use client";

import { motion } from "framer-motion";
import { X, Check } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

export function WhyChoose() {
  const { t } = useTranslation();

  const traditional = [
    t("landing.traditional1"),
    t("landing.traditional2"),
    t("landing.traditional3"),
    t("landing.traditional4"),
    t("landing.traditional5"),
  ];

  const ai = [
    t("landing.ai1"),
    t("landing.ai2"),
    t("landing.ai3"),
    t("landing.ai4"),
    t("landing.ai5"),
  ];

  return (
    <section id="about" className="py-20 md:py-32">
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
              {t("landing.whyChooseTag")}
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[56px] lg:leading-[1.1]"
          >
            {t("landing.whyChooseTitle")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            {t("landing.whyChooseSubtitle")}
          </motion.p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-border/60 bg-card p-6"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-danger/10">
                <X className="size-5 text-danger" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                {t("landing.traditionalGovernance")}
              </h3>
            </div>
            <div className="space-y-3">
              {traditional.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="flex items-center gap-3 rounded-xl border border-danger/10 bg-danger/5 p-3"
                >
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-danger/10">
                    <X className="size-3.5 text-danger" />
                  </div>
                  <span className="text-sm text-muted-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-6"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                <Check className="size-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                {t("landing.aiGovernance")}
              </h3>
            </div>
            <div className="space-y-3">
              {ai.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex items-center gap-3 rounded-xl border border-primary/10 bg-card/50 p-3"
                >
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-success/10">
                    <Check className="size-3.5 text-success" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
