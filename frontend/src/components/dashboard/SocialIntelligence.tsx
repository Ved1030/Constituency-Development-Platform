"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { AtSign, ArrowRight } from "lucide-react";
import { SocialGridFeed } from "./SocialGridFeed";
import { getDashboardFeed } from "@/data/dashboard-social-data";

export function SocialIntelligence() {
  const router = useRouter();
  const data = useMemo(() => getDashboardFeed(), []);

  // Compute summary stats from the feed data
  const criticalCount = data.filter((p) => p.severity === "Critical").length;
  const positiveCount = data.filter((p) => p.severity === "Low").length;
  const sentimentScore = Math.round((positiveCount / data.length) * 100);
  const totalEngagement = data.reduce((s, p) => s + p.likes + p.comments + p.shares, 0);

  return (
    <div className="px-4 pt-4 lg:px-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-2xl border border-border/60 bg-card p-5"
      >
        {/* Header */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AtSign className="size-4 text-[#1DA1F2]" />
            <h2 className="text-sm font-bold text-foreground">Social Intelligence</h2>
            <div className="flex items-center gap-1.5">
              <span className="rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 text-[9px] font-medium text-emerald-600 dark:text-emerald-400">
                {data.length} posts
              </span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[9px] text-muted-foreground">
                {(totalEngagement / 1000).toFixed(0)}K engagements
              </span>
              {criticalCount > 0 && (
                <span className="rounded-full bg-red-50 dark:bg-red-500/10 px-2 py-0.5 text-[9px] font-medium text-red-600 dark:text-red-400 animate-pulse">
                  {criticalCount} critical
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => router.push("/mp/social-intelligence")}
            className="flex items-center gap-0.5 text-[10px] text-primary hover:underline"
          >
            Full Intelligence <ArrowRight className="size-2.5" />
          </button>
        </div>

        {/* Premium Social Feed Grid */}
        <SocialGridFeed />
      </motion.div>
    </div>
  );
}
