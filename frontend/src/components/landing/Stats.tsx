"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, FolderTree, Brain, Map } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "2.5M+",
    label: "Citizens Connected",
    description: "Active users across all districts",
  },
  {
    icon: FolderTree,
    value: "1,847",
    label: "Projects Prioritized",
    description: "Data-driven project allocations",
  },
  {
    icon: Brain,
    value: "94.2%",
    label: "AI Decisions",
    description: "Decision accuracy rate",
  },
  {
    icon: Map,
    value: "128",
    label: "Districts Supported",
    description: "Spanning across 12 states",
  },
];

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-16 md:py-24 bg-card/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="absolute -top-8 -right-8 size-24 rounded-full bg-primary/5 transition-all group-hover:scale-150" />
              <div className="relative">
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <stat.icon className="size-6" />
                </div>
                <div className="text-3xl font-bold text-foreground sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm font-medium text-foreground">
                  {stat.label}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
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
