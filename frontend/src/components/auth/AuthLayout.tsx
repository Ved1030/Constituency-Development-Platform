"use client";

import { motion } from "framer-motion";
import { Brain, Shield, Globe, BarChart3, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();

  const features = [
    { icon: Brain, label: t("auth.aiPoweredAnalytics") },
    { icon: Shield, label: t("auth.secureAndPrivate") },
    { icon: Globe, label: t("auth.multilingualSupport") },
    { icon: BarChart3, label: t("auth.realTimeDashboards") },
    { icon: MapPin, label: t("auth.geoMappedIssues") },
    { icon: Users, label: t("auth.communityDriven") },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Left side — branding */}
      <div className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent p-12 lg:flex">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute -left-20 -top-20 size-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 size-[500px] rounded-full bg-white/5 blur-3xl" />
          <div className="absolute left-1/2 top-1/3 size-72 -translate-x-1/2 rounded-full bg-white/5 blur-2xl" />
        </div>

        {/* Top — Logo */}
        <Link href="/" className="relative z-10 flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <span className="text-xl font-black text-white">CD</span>
          </div>
          <div>
            <div className="text-xl font-bold text-white">CDP</div>
            <div className="text-sm text-white/70">Constituency Development</div>
          </div>
        </Link>

        {/* Center — Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 flex flex-col items-center text-center"
        >
          <div className="mb-8 flex size-32 items-center justify-center rounded-3xl bg-white/15 backdrop-blur-md">
            <Brain className="size-16 text-white" />
          </div>
          <h1 className="mb-4 text-4xl font-bold leading-tight text-white">
            Transforming Citizen Voices into
            <br />
            Data-Driven Decisions
          </h1>
          <p className="mb-10 max-w-md text-lg text-white/80">
            AI-powered platform helping MPs prioritize development using citizen feedback and predictive analytics
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {features.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm"
              >
                <f.icon className="size-4" />
                {f.label}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom — Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-6">
          {[
            { value: "18.4L", label: t("auth.citizensServed") },
            { value: "142", label: t("auth.villages") },
            { value: "87%", label: t("auth.aiAccuracy") },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-white/60">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right side — form */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
