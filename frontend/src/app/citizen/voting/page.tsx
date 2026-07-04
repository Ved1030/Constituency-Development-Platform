"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Vote,
  BarChart3,
  Users,
  CheckCircle,
  Clock,
  ThumbsUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { VotingCard } from "@/components/citizen/VotingCard";
import { votingItems, citizenUser } from "@/data/mock-citizen";

const tabFilters = [
  { label: "All", value: "all" },
  { label: "Trending", value: "trending" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
];

export default function VotingPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filtered = votingItems.filter((item) => {
    return activeTab === "all" || item.status === activeTab;
  });

  const totalSupported = votingItems.filter((i) => i.supported).length;
  const totalVotes = votingItems.reduce((acc, i) => acc + i.supportCount, 0);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Community Voting</h2>
          <p className="text-sm text-muted-foreground">
            Have your say on development priorities for your constituency
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="size-3" />
            <span className="font-medium text-foreground">{citizenUser.participationScore}</span> pts
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ThumbsUp className="size-3" />
            <span className="font-medium text-foreground">{totalSupported}</span> supported
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: BarChart3, label: "Total Proposals", value: votingItems.length, color: "text-primary", bg: "bg-primary/10" },
          { icon: TrendingUp, label: "Trending", value: votingItems.filter((i) => i.status === "trending").length, color: "text-purple-500", bg: "bg-purple-500/10" },
          { icon: Clock, label: "Active", value: votingItems.filter((i) => i.status === "active").length, color: "text-amber-500", bg: "bg-amber-500/10" },
          { icon: CheckCircle, label: "Completed", value: votingItems.filter((i) => i.status === "completed").length, color: "text-success", bg: "bg-success/10" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-4">
            <div className={cn("flex size-9 items-center justify-center rounded-xl mb-3", stat.bg)}>
              <stat.icon className={cn("size-5", stat.color)} />
            </div>
            <div className="text-xl font-bold text-foreground">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto">
        {tabFilters.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all",
              activeTab === tab.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16"
            >
              <Vote className="size-12 text-muted-foreground/40 mb-4" />
              <h3 className="text-sm font-semibold text-foreground">No proposals found</h3>
              <p className="mt-1 text-xs text-muted-foreground">Check back later for new voting opportunities</p>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {filtered.map((item, i) => (
                <VotingCard key={item.id} item={item} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
