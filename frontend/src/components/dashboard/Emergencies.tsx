"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Waves,
  Road,
  Zap,
  Droplets,
  Heart,
  X,
  AlertTriangle,
  ChevronRight,
  MapPin,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const emergencies = [
  {
    id: "emerg-1",
    type: "Fire",
    location: "Korattur Industrial Area",
    ward: "Ward 8",
    description: "Major fire reported at textile godown. 3 fire tenders dispatched.",
    icon: Flame,
    color: "text-red-600",
    bg: "bg-red-50 dark:bg-red-500/10",
    border: "border-red-200 dark:border-red-500/20",
    time: "10 min ago",
    severity: "critical",
  },
  {
    id: "emerg-2",
    type: "Flood",
    location: "Sewapuri Low-lying Areas",
    ward: "Ward 12",
    description: "Water level rising due to heavy rain. 200+ families affected.",
    icon: Waves,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    border: "border-blue-200 dark:border-blue-500/20",
    time: "25 min ago",
    severity: "critical",
  },
  {
    id: "emerg-3",
    type: "Road Collapse",
    location: "Velachery Main Road Junction",
    ward: "Ward 10",
    description: "Section of road caved in near bus stop. Traffic diverted.",
    icon: Road,
    color: "text-orange-600",
    bg: "bg-orange-50 dark:bg-orange-500/10",
    border: "border-orange-200 dark:border-orange-500/20",
    time: "1 hour ago",
    severity: "high",
  },
  {
    id: "emerg-4",
    type: "Transformer Failure",
    location: "Ayanavaram Colony",
    ward: "Ward 6",
    description: "Main transformer blew up. 500+ houses without power.",
    icon: Zap,
    color: "text-yellow-600",
    bg: "bg-yellow-50 dark:bg-yellow-500/10",
    border: "border-yellow-200 dark:border-yellow-500/20",
    time: "2 hours ago",
    severity: "high",
  },
  {
    id: "emerg-5",
    type: "Water Leakage",
    location: "Gandhi Nagar Main Road",
    ward: "Ward 7",
    description: "Major water main burst flooding the road. 12-inch pipe rupture.",
    icon: Droplets,
    color: "text-sky-600",
    bg: "bg-sky-50 dark:bg-sky-500/10",
    border: "border-sky-200 dark:border-sky-500/20",
    time: "3 hours ago",
    severity: "medium",
  },
  {
    id: "emerg-6",
    type: "Medical Emergency",
    location: "Perambur PHC",
    ward: "Ward 15",
    description: "Critical patient requires immediate air ambulance transfer.",
    icon: Heart,
    color: "text-rose-600",
    bg: "bg-rose-50 dark:bg-rose-500/10",
    border: "border-rose-200 dark:border-rose-500/20",
    time: "30 min ago",
    severity: "critical",
  },
];

export function Emergencies() {
  const [isOpen, setIsOpen] = useState(false);
  const criticalCount = emergencies.filter((e) => e.severity === "critical").length;

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-2xl transition-all hover:scale-105",
          criticalCount > 0
            ? "bg-gradient-to-r from-red-600 to-rose-600 animate-pulse"
            : "bg-muted-foreground"
        )}
      >
        <AlertTriangle className="size-4" />
        <span>{criticalCount} Critical</span>
        <span className="flex size-5 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold">
          {emergencies.length}
        </span>
      </button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 z-50 flex h-full w-96 flex-col border-l border-border bg-card shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="size-5 text-red-500" />
                  <h2 className="text-sm font-bold text-foreground">Today's Emergencies</h2>
                  <span className="rounded-full bg-red-50 dark:bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-600 dark:text-red-400">
                    Live
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
                {emergencies.map((emerg, i) => {
                  const Icon = emerg.icon;
                  return (
                    <motion.div
                      key={emerg.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className={cn(
                        "group cursor-pointer rounded-xl border p-4 transition-all hover:shadow-md",
                        emerg.border,
                        emerg.bg
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", emerg.bg, "border", emerg.border)}>
                          <Icon className={cn("size-4", emerg.color)} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className={cn("text-xs font-bold", emerg.color)}>
                              {emerg.type}
                            </span>
                            <span className={cn(
                              "rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase",
                              emerg.severity === "critical"
                                ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                                : emerg.severity === "high"
                                  ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                                  : "bg-muted text-muted-foreground"
                            )}>
                              {emerg.severity}
                            </span>
                          </div>
                          <h4 className="mt-1 text-[11px] font-semibold text-foreground leading-snug">
                            {emerg.location}
                          </h4>
                          <p className="mt-0.5 text-[10px] text-muted-foreground line-clamp-2">
                            {emerg.description}
                          </p>
                          <div className="mt-2 flex items-center gap-3 text-[9px] text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="size-2.5" />
                              {emerg.ward}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="size-2.5" />
                              {emerg.time}
                            </span>
                          </div>
                          <button className="mt-2 flex items-center gap-1 text-[9px] font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity hover:underline">
                            Open in Digital Twin <ChevronRight className="size-2.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="border-t border-border px-5 py-3 text-center">
                <button className="flex items-center justify-center gap-1 text-xs font-medium text-primary hover:underline">
                  View All Incidents
                  <ChevronRight className="size-3" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
