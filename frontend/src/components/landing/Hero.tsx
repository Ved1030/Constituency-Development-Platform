"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Play, ArrowRight, BarChart3, Users, Globe, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";

const floatingIcons = [
  { Icon: BarChart3, delay: 0, x: -120, y: -40 },
  { Icon: Users, delay: 1, x: 140, y: -60 },
  { Icon: Globe, delay: 0.5, x: -100, y: 80 },
  { Icon: Shield, delay: 1.5, x: 130, y: 60 },
];

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      <div className="pointer-events-none absolute -top-40 -right-40 size-[600px] rounded-full bg-primary/8 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 size-[500px] rounded-full bg-accent/8 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              {t("landing.aiPoweredTag")}
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              {t("landing.heroTitle1")}{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {t("landing.heroTitleHighlight")}
              </span>{" "}
              {t("landing.heroTitle2")}
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {t("landing.heroSubtitle")}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/login">
                <Button
                  size="lg"
                  className="h-12 w-full gap-2 bg-primary px-8 text-base text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 sm:w-auto"
                >
                  {t("nav.getStarted")}
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 w-full gap-2 border-border px-8 text-base sm:w-auto"
                >
                  <Play className="size-4" />
                  {t("landing.watchDemo")}
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-8">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="size-9 rounded-full border-2 border-background bg-gradient-to-br from-primary/80 to-accent/80"
                  />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">10,000+</span>{" "}
                {t("landing.citizensConnected")}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {floatingIcons.map((item) => (
              <motion.div
                key={item.Icon.displayName || String(item.delay)}
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: item.delay,
                  ease: "easeInOut",
                }}
                className="absolute z-10 flex size-12 items-center justify-center rounded-2xl border border-border bg-card shadow-lg"
                style={{
                  left: `calc(50% + ${item.x}px)`,
                  top: `calc(50% + ${item.y}px)`,
                }}
              >
                <item.Icon className="size-5 text-primary" />
              </motion.div>
            ))}

            <div className="relative mx-auto aspect-[4/3] w-full max-w-lg">
              <div className="absolute inset-0 rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-card to-accent/5 shadow-2xl shadow-primary/10">
                <div className="flex items-center gap-2 border-b border-border px-5 py-3">
                  <div className="size-2.5 rounded-full bg-destructive" />
                  <div className="size-2.5 rounded-full bg-warning" />
                  <div className="size-2.5 rounded-full bg-success" />
                  <div className="ml-4 h-3 w-32 rounded-md bg-muted" />
                </div>
                <div className="grid grid-cols-3 gap-3 p-5">
                  <div className="col-span-2 space-y-3">
                    <div className="h-24 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 p-3">
                      <div className="mb-2 h-2 w-16 rounded bg-primary/20" />
                      <div className="flex items-end gap-1">
                        {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-t-sm bg-gradient-to-t from-primary/40 to-accent/40"
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="h-16 rounded-xl bg-muted/50 p-3">
                      <div className="mb-2 h-2 w-24 rounded bg-muted-foreground/20" />
                      <div className="flex gap-2">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="h-2 flex-1 rounded-full bg-gradient-to-r from-success/30 to-success/10"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="rounded-xl bg-muted/50 p-3">
                      <div className="mx-auto mb-2 size-8 rounded-full bg-primary/10" />
                      <div className="mx-auto h-2 w-12 rounded bg-muted-foreground/20" />
                    </div>
                    <div className="rounded-xl bg-muted/50 p-3">
                      <div className="text-center text-lg font-bold text-primary">
                        94.2%
                      </div>
                      <div className="text-center text-xs text-muted-foreground">
                        AI Accuracy
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -right-8 -bottom-8 rounded-xl border border-border bg-card p-4 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-success/10" />
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {t("landing.newProjects")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t("landing.thisQuarter")}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
