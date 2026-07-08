"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ChevronRight,
  Target,
  IndianRupee,
  Users,
  Calendar,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";

const schemes = [
  { id: "s1", name: "Swachh Bharat Mission", description: "Cleanliness drive and waste management infrastructure", progress: 72, budget: "₹45 Cr", beneficiaries: "1.2 Lakh", deadline: "Mar 2025", status: "active" as const },
  { id: "s2", name: "AMRUT Scheme", description: "Water supply and sewerage infrastructure development", progress: 58, budget: "₹32 Cr", beneficiaries: "85,000", deadline: "Jun 2025", status: "active" as const },
  { id: "s3", name: "Smart City Mission", description: "Urban development and digital infrastructure", progress: 44, budget: "₹78 Cr", beneficiaries: "2.5 Lakh", deadline: "Dec 2025", status: "active" as const },
  { id: "s4", name: "PM Awas Yojana", description: "Affordable housing for urban and rural poor", progress: 81, budget: "₹56 Cr", beneficiaries: "45,000", deadline: "Sep 2025", status: "active" as const },
  { id: "s5", name: "PM GatiShakti", description: "Multi-modal connectivity and infrastructure planning", progress: 35, budget: "₹120 Cr", beneficiaries: "5 Lakh", deadline: "Dec 2026", status: "active" as const },
  { id: "s6", name: " Jal Jeevan Mission", description: "Piped water supply to every rural household", progress: 67, budget: "₹42 Cr", beneficiaries: "1.8 Lakh", deadline: "Aug 2025", status: "active" as const },
];

const categoryColors: Record<string, string> = {
  "Swachh Bharat": "bg-emerald-100 text-emerald-700",
  AMRUT: "bg-blue-100 text-blue-700",
  "Smart City": "bg-purple-100 text-purple-700",
  "PM Awas": "bg-amber-100 text-amber-700",
  GatiShakti: "bg-red-100 text-red-700",
  Jal: "bg-cyan-100 text-cyan-700",
};

export default function SchemesPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/citizen/dashboard" className="hover:text-foreground">Dashboard</Link>
        <ChevronRight className="size-3.5" />
        <span className="font-medium text-foreground">{t("citizen.schemes.governmentSchemes")}</span>
      </div>

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">{t("citizen.schemes.governmentSchemes")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("citizen.schemes.exploreSchemes")}
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: t("citizen.schemes.activeSchemes"), value: schemes.length, icon: Target, color: "text-blue-600", bg: "bg-blue-50" },
          { label: t("citizen.schemes.totalBudget"), value: "₹373 Cr", icon: IndianRupee, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: t("citizen.schemes.beneficiaries"), value: "12.8 Lakh", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
          { label: t("citizen.schemes.avgProgress"), value: `${Math.round(schemes.reduce((a, s) => a + s.progress, 0) / schemes.length)}%`, icon: CheckCircle2, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            className="rounded-2xl border border-border bg-card p-4 shadow-sm"
          >
            <div className={cn("flex size-10 items-center justify-center rounded-xl", stat.bg)}>
              <stat.icon className={cn("size-5", stat.color)} />
            </div>
            <div className="mt-3">
              <div className="text-xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Schemes List */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {schemes.map((scheme, i) => (
          <motion.div
            key={scheme.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                  {scheme.name}
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">{scheme.description}</p>
              </div>
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Target className="size-4" />
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-muted/50 p-2.5">
                <IndianRupee className="mx-auto size-4 text-muted-foreground" />
                <div className="mt-1 text-xs font-semibold text-foreground">{scheme.budget}</div>
                <div className="text-[10px] text-muted-foreground">{t("citizen.schemes.budget")}</div>
              </div>
              <div className="rounded-xl bg-muted/50 p-2.5">
                <Users className="mx-auto size-4 text-muted-foreground" />
                <div className="mt-1 text-xs font-semibold text-foreground">{scheme.beneficiaries}</div>
                <div className="text-[10px] text-muted-foreground">{t("citizen.schemes.beneficiaries")}</div>
              </div>
              <div className="rounded-xl bg-muted/50 p-2.5">
                <Calendar className="mx-auto size-4 text-muted-foreground" />
                <div className="mt-1 text-xs font-semibold text-foreground">{scheme.deadline}</div>
                <div className="text-[10px] text-muted-foreground">{t("citizen.schemes.deadline")}</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{t("citizen.schemes.implementationProgress")}</span>
                <span className="font-medium text-foreground">{scheme.progress}%</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                  style={{ width: `${scheme.progress}%` }}
                />
              </div>
            </div>

            <button className="mt-4 flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
              {t("common.learnMore")} <ExternalLink className="size-3.5" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
