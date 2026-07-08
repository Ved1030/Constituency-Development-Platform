"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Bot, Zap, ArrowRight } from "lucide-react";
import { useConstituency } from "@/context/ConstituencyContext";

export function AIBrief() {
  const router = useRouter();
  const { data } = useConstituency();
  const topPriority = data.priorities[0];

  return (
    <div className="px-4 pt-4 lg:px-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent px-4 py-3 shadow-sm"
        style={{ maxHeight: "72px" }}
      >
        {/* Icon */}
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Bot className="size-4 text-primary" />
        </div>

        {/* AI Recommendation Text */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
              AI Recommendation
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-foreground/80 leading-snug truncate">
            {topPriority
              ? `${topPriority.issue} in ${topPriority.village} (${topPriority.ward}). Expected Impact: ${topPriority.population.toLocaleString("en-IN")} citizens. Approve ${topPriority.budget}.`
              : "Dashboard ready. All systems operational."}
          </p>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            onClick={() => router.push("/mp/priority-engine")}
            className="flex items-center gap-1 rounded-lg border border-border/60 bg-card px-2.5 py-1.5 text-[10px] font-medium text-foreground transition-colors hover:bg-muted"
          >
            View
            <ArrowRight className="size-2.5" />
          </button>
          <button
            onClick={() => router.push("/mp/simulator")}
            className="flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1.5 text-[10px] font-semibold text-white shadow-sm transition-all hover:shadow-md"
          >
            <Zap className="size-2.5" />
            Simulate
          </button>
        </div>
      </motion.div>
    </div>
  );
}
