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
import { schemes } from "@/data/mock-citizen";

const categoryColors: Record<string, string> = {
  Swachh Bharat: "bg-emerald-100 text-emerald-700",
  AMRUT: "bg-blue-100 text-blue-700",
  "Smart City": "bg-purple-100 text-purple-700",
  "PM Awas": "bg-amber-100 text-amber-700",
  GatiShakti: "bg-red-100 text-red-700",
  Jal: "bg-cyan-100 text-cyan-700",
};

export default function SchemesPage() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/citizen/dashboard" className="hover:text-foreground">Dashboard</Link>
        <ChevronRight className="size-3.5" />
        <span className="font-medium text-foreground">Government Schemes</span>
      </div>

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Government Schemes</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Explore active government schemes and development programs in your constituency
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Active Schemes", value: schemes.length, icon: Target, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Total Budget", value: "₹373 Cr", icon: IndianRupee, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Beneficiaries", value: "12.8 Lakh", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Avg Progress", value: `${Math.round(schemes.reduce((a, s) => a + s.progress, 0) / schemes.length)}%`, icon: CheckCircle2, color: "text-amber-600", bg: "bg-amber-50" },
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
                <div className="text-[10px] text-muted-foreground">Budget</div>
              </div>
              <div className="rounded-xl bg-muted/50 p-2.5">
                <Users className="mx-auto size-4 text-muted-foreground" />
                <div className="mt-1 text-xs font-semibold text-foreground">{scheme.beneficiaries}</div>
                <div className="text-[10px] text-muted-foreground">Beneficiaries</div>
              </div>
              <div className="rounded-xl bg-muted/50 p-2.5">
                <Calendar className="mx-auto size-4 text-muted-foreground" />
                <div className="mt-1 text-xs font-semibold text-foreground">{scheme.deadline}</div>
                <div className="text-[10px] text-muted-foreground">Deadline</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Implementation Progress</span>
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
              Learn more <ExternalLink className="size-3.5" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
