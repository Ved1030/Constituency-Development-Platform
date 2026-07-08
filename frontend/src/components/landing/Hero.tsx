"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Play, ArrowRight, Shield, Brain, Globe, Lock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { DashboardMockup } from "./DashboardMockup";

const trustBadges = [
  { icon: Shield, label: "trustGovernmentReady" as const },
  { icon: Brain, label: "trustAIPowered" as const },
  { icon: Globe, label: "trustMultilingual" as const },
  { icon: Lock, label: "trustSecure" as const },
  { icon: Award, label: "trustISOReady" as const },
];

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      <div className="pointer-events-none absolute -top-40 -right-40 size-[600px] rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 size-[500px] rounded-full bg-accent/5 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 px-5 py-2"
            >
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold tracking-wide text-primary">
                {t("landing.aiPoweredTag")}
              </span>
            </motion.div>

            <h1 className="text-5xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-6xl lg:text-[72px]">
              {t("landing.heroTitle1")}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_200%] animate-gradient-shift">
                {t("landing.heroTitleHighlight")}
              </span>
              {t("landing.heroTitle2")}
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
            >
              {t("landing.heroSubtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-8 flex flex-col gap-4 sm:flex-row"
            >
              <Link href="/login">
                <Button
                  size="lg"
                  className="h-13 w-full gap-2 bg-gradient-to-r from-primary to-accent px-8 text-base font-semibold text-primary-foreground shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 sm:w-auto"
                >
                  {t("nav.getStarted")}
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-13 w-full gap-2 border-border/50 bg-background/50 px-8 text-base font-medium backdrop-blur-sm sm:w-auto"
                >
                  <Play className="size-4" />
                  {t("landing.watchDemo")}
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-10 flex flex-wrap gap-3"
            >
              {trustBadges.map((badge, i) => (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.05, duration: 0.3 }}
                  className="flex items-center gap-1.5 rounded-full border border-border/50 bg-card/50 px-3 py-1.5 backdrop-blur-sm"
                >
                  <badge.icon className="size-3.5 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">
                    {t(`landing.${badge.label}`)}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <div className="hidden lg:block">
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
