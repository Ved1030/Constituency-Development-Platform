"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";

export function CTA() {
  const { t } = useTranslation();

  const benefits = [
    t("landing.ctaBenefit1"),
    t("landing.ctaBenefit2"),
    t("landing.ctaBenefit3"),
    t("landing.ctaBenefit4"),
  ];

  return (
    <section id="contact" className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-accent px-8 py-16 text-center sm:px-16 md:py-20"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
          <div className="pointer-events-none absolute -top-20 -left-20 size-64 rounded-full bg-white/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 size-64 rounded-full bg-white/5 blur-3xl" />

          <div className="pointer-events-none absolute top-1/4 left-1/4 size-32 rounded-full bg-white/5 blur-2xl" />
          <div className="pointer-events-none absolute right-1/4 bottom-1/4 size-40 rounded-full bg-white/5 blur-2xl" />

          <div className="relative">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold tracking-tight text-white sm:text-5xl"
            >
              {t("landing.ctaTitle")}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mx-auto mt-5 max-w-2xl text-lg text-white/80"
            >
              {t("landing.ctaSubtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link href="/register">
                <Button
                  size="lg"
                  className="h-13 gap-2 bg-white px-8 text-base font-semibold text-primary shadow-xl hover:bg-white/90 hover:shadow-2xl"
                >
                  {t("landing.ctaStartTrial")}
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-13 gap-2 border-white/30 bg-white/10 px-8 text-base text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
                >
                  {t("landing.ctaScheduleDemo")}
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
            >
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-2 text-sm text-white/80"
                >
                  <CheckCircle className="size-4 text-white/60" />
                  {benefit}
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
