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
import { useTranslation } from "@/hooks/use-translation";

const citizenUser = {
  id: "CIT-001",
  name: "Arun Kumar",
  email: "arun.kumar@email.com",
  phone: "+91 98765 43210",
  avatar: "",
  address: "42, Gandhi Nagar, Ward 7",
  constituency: "North Chennai",
  district: "Chennai",
  state: "Tamil Nadu",
  pincode: "600001",
  preferredLanguage: "Tamil",
  totalComplaints: 12,
  resolvedComplaints: 9,
  participationScore: 845,
  badges: [
    { id: "b1", label: "Early Adopter", icon: "Zap" },
    { id: "b2", label: "Problem Solver", icon: "CheckCircle" },
    { id: "b3", label: "Voice of the Month", icon: "Award" },
    { id: "b4", label: "Top Contributor", icon: "Star" },
  ],
};

const votingItems = [
  {
    id: "VOTE-001",
    title: "New Community Hall for Ward 7",
    description: "Proposal to build a multi-purpose community hall for weddings, meetings, and events.",
    category: "other" as const,
    supportCount: 1284,
    totalVotes: 2000,
    deadline: "2025-03-15",
    status: "trending" as const,
    progress: 64,
    comments: 45,
    supported: false,
  },
  {
    id: "VOTE-002",
    title: "Solar Street Lights for All Main Roads",
    description: "Replace all existing street lights with solar-powered LED lights to save energy and improve illumination.",
    category: "electricity" as const,
    supportCount: 956,
    totalVotes: 1500,
    deadline: "2025-03-20",
    status: "trending" as const,
    progress: 64,
    comments: 32,
    supported: true,
  },
  {
    id: "VOTE-003",
    title: "Underground Drainage System for Krishna Nagar",
    description: "Install proper underground drainage system to prevent waterlogging and improve sanitation.",
    category: "sanitation" as const,
    supportCount: 723,
    totalVotes: 1200,
    deadline: "2025-04-01",
    status: "active" as const,
    progress: 60,
    comments: 28,
    supported: false,
  },
  {
    id: "VOTE-004",
    title: "New Government School in Ward 5",
    description: "Establish a new government high school to accommodate growing student population.",
    category: "education" as const,
    supportCount: 567,
    totalVotes: 1000,
    deadline: "2025-04-10",
    status: "active" as const,
    progress: 57,
    comments: 19,
    supported: false,
  },
  {
    id: "VOTE-005",
    title: "Free Health Checkup Camp Every Month",
    description: "Organize monthly free health checkup camps for senior citizens and children.",
    category: "healthcare" as const,
    supportCount: 445,
    totalVotes: 800,
    deadline: "2025-03-25",
    status: "active" as const,
    progress: 56,
    comments: 15,
    supported: true,
  },
  {
    id: "VOTE-006",
    title: "Widening of Market Road",
    description: "Widen the main market road from 20ft to 40ft to reduce traffic congestion.",
    category: "road" as const,
    supportCount: 312,
    totalVotes: 600,
    deadline: "2025-04-20",
    status: "active" as const,
    progress: 52,
    comments: 11,
    supported: false,
  },
  {
    id: "VOTE-007",
    title: "Public Wi-Fi in Community Areas",
    description: "Install free Wi-Fi hotspots in parks, libraries, and community centers.",
    category: "other" as const,
    supportCount: 234,
    totalVotes: 500,
    deadline: "2025-02-28",
    status: "completed" as const,
    progress: 100,
    comments: 8,
    supported: true,
  },
];

export default function VotingPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("all");

  const tabFilters = [
    { label: t("common.all"), value: "all" },
    { label: t("common.trending"), value: "trending" },
    { label: t("common.active"), value: "active" },
    { label: t("common.completed"), value: "completed" },
  ];

  const filtered = votingItems.filter((item) => {
    return activeTab === "all" || item.status === activeTab;
  });

  const totalSupported = votingItems.filter((i) => i.supported).length;
  const totalVotes = votingItems.reduce((acc, i) => acc + i.supportCount, 0);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{t("citizen.voting.communityVoting")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("citizen.voting.haveYourSay")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="size-3" />
            <span className="font-medium text-foreground">{citizenUser.participationScore}</span> {t("common.pts")}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ThumbsUp className="size-3" />
            <span className="font-medium text-foreground">{totalSupported}</span> {t("common.supported")}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: BarChart3, label: t("citizen.voting.totalProposals"), value: votingItems.length, color: "text-primary", bg: "bg-primary/10" },
          { icon: TrendingUp, label: t("common.trending"), value: votingItems.filter((i) => i.status === "trending").length, color: "text-purple-500", bg: "bg-purple-500/10" },
          { icon: Clock, label: t("common.active"), value: votingItems.filter((i) => i.status === "active").length, color: "text-amber-500", bg: "bg-amber-500/10" },
          { icon: CheckCircle, label: t("common.completed"), value: votingItems.filter((i) => i.status === "completed").length, color: "text-success", bg: "bg-success/10" },
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
              <h3 className="text-sm font-semibold text-foreground">{t("citizen.voting.noProposalsFound")}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{t("citizen.voting.checkBackLater")}</p>
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
