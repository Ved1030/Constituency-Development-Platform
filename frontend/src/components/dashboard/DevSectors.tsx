"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Road,
  Droplets,
  Heart,
  GraduationCap,
  Home,
  Tractor,
  Users,
  TreePine,
  Mountain,
  Dumbbell,
  Shield,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sectors = [
  { id: "roads", label: "Roads", icon: Road, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-500/10", hover: "hover:border-orange-200 dark:hover:border-orange-500/30 hover:shadow-orange-500/5" },
  { id: "water", label: "Water", icon: Droplets, color: "text-sky-600", bg: "bg-sky-50 dark:bg-sky-500/10", hover: "hover:border-sky-200 dark:hover:border-sky-500/30 hover:shadow-sky-500/5" },
  { id: "healthcare", label: "Healthcare", icon: Heart, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-500/10", hover: "hover:border-emerald-200 dark:hover:border-emerald-500/30 hover:shadow-emerald-500/5" },
  { id: "education", label: "Education", icon: GraduationCap, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-500/10", hover: "hover:border-purple-200 dark:hover:border-purple-500/30 hover:shadow-purple-500/5" },
  { id: "housing", label: "Housing", icon: Home, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-500/10", hover: "hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:shadow-indigo-500/5" },
  { id: "agriculture", label: "Agriculture", icon: Tractor, color: "text-green-600", bg: "bg-green-50 dark:bg-green-500/10", hover: "hover:border-green-200 dark:hover:border-green-500/30 hover:shadow-green-500/5" },
  { id: "women-child", label: "Women & Child", icon: Users, color: "text-pink-600", bg: "bg-pink-50 dark:bg-pink-500/10", hover: "hover:border-pink-200 dark:hover:border-pink-500/30 hover:shadow-pink-500/5" },
  { id: "environment", label: "Environment", icon: TreePine, color: "text-lime-600", bg: "bg-lime-50 dark:bg-lime-500/10", hover: "hover:border-lime-200 dark:hover:border-lime-500/30 hover:shadow-lime-500/5" },
  { id: "tourism", label: "Tourism", icon: Mountain, color: "text-cyan-600", bg: "bg-cyan-50 dark:bg-cyan-500/10", hover: "hover:border-cyan-200 dark:hover:border-cyan-500/30 hover:shadow-cyan-500/5" },
  { id: "sports", label: "Sports", icon: Dumbbell, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-500/10", hover: "hover:border-rose-200 dark:hover:border-rose-500/30 hover:shadow-rose-500/5" },
  { id: "public-safety", label: "Public Safety", icon: Shield, color: "text-stone-600", bg: "bg-stone-50 dark:bg-stone-500/10", hover: "hover:border-stone-200 dark:hover:border-stone-500/30 hover:shadow-stone-500/5" },
  { id: "employment", label: "Employment", icon: Briefcase, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-500/10", hover: "hover:border-violet-200 dark:hover:border-violet-500/30 hover:shadow-violet-500/5" },
];

export function DevSectors() {
  const router = useRouter();

  return (
    <div className="px-4 pt-4 lg:px-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="rounded-2xl border border-border/60 bg-card p-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground">Development Sectors</h2>
          <button
            onClick={() => router.push("/mp/departments")}
            className="flex items-center gap-0.5 text-[10px] text-primary hover:underline"
          >
            All Departments <ArrowRight className="size-2.5" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12">
          {sectors.map((sector, i) => {
            const Icon = sector.icon;
            return (
              <motion.button
                key={sector.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.03 }}
                onClick={() => router.push(`/mp/departments?focus=${sector.id}`)}
                className={cn(
                  "group flex flex-col items-center gap-1.5 rounded-xl border border-border/50 p-3 transition-all",
                  sector.bg,
                  sector.hover,
                  "hover:shadow-sm hover:-translate-y-0.5 active:scale-95"
                )}
              >
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg transition-transform group-hover:scale-110",
                    sector.bg
                  )}
                >
                  <Icon className={cn("size-4", sector.color)} />
                </div>
                <span className="text-[9px] font-medium text-center text-muted-foreground group-hover:text-foreground transition-colors leading-tight">
                  {sector.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
