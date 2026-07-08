"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  PlusCircle,
  MapPin,
  Map,
  Vote,
  FileText,
  CheckCircle,
  Clock,
  TrendingUp,
  ChevronRight,
  Star,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { useQuery } from "@tanstack/react-query";
import { fetchComplaintStats, fetchComplaints } from "@/services/api/complaints";
import type { Complaint } from "@/types/complaint";

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

const trendingIssues = [
  { id: "t1", title: "Waterlogging in Gandhi Nagar", category: "water", upvotes: 47 },
  { id: "t2", title: "Potholes on School Road", category: "road", upvotes: 56 },
  { id: "t3", title: "Open Sewage Krishna Nagar", category: "sanitation", upvotes: 23 },
  { id: "t4", title: "Irregular Water Supply", category: "water", upvotes: 42 },
];

const schemes = [
  { id: "s1", name: "Swachh Bharat Mission", description: "Cleanliness drive and waste management infrastructure", progress: 72, budget: "₹45 Cr", beneficiaries: "1.2 Lakh", deadline: "Mar 2025", status: "active" as const },
  { id: "s2", name: "AMRUT Scheme", description: "Water supply and sewerage infrastructure development", progress: 58, budget: "₹32 Cr", beneficiaries: "85,000", deadline: "Jun 2025", status: "active" as const },
  { id: "s3", name: "Smart City Mission", description: "Urban development and digital infrastructure", progress: 44, budget: "₹78 Cr", beneficiaries: "2.5 Lakh", deadline: "Dec 2025", status: "active" as const },
  { id: "s4", name: "PM Awas Yojana", description: "Affordable housing for urban and rural poor", progress: 81, budget: "₹56 Cr", beneficiaries: "45,000", deadline: "Sep 2025", status: "active" as const },
  { id: "s5", name: "PM GatiShakti", description: "Multi-modal connectivity and infrastructure planning", progress: 35, budget: "₹120 Cr", beneficiaries: "5 Lakh", deadline: "Dec 2026", status: "active" as const },
  { id: "s6", name: " Jal Jeevan Mission", description: "Piped water supply to every rural household", progress: 67, budget: "₹42 Cr", beneficiaries: "1.8 Lakh", deadline: "Aug 2025", status: "active" as const },
];

const notifications = [
  {
    id: "NOT-001",
    title: "Complaint Update",
    message: "Your complaint CMP-2024-001 has been assigned to Junior Engineer K. Selvam.",
    type: "status" as const,
    read: false,
    createdAt: "2025-01-10T09:30:00",
  },
  {
    id: "NOT-002",
    title: "New Voting Started",
    message: "Solar Street Lights proposal is now open for community voting. Cast your vote!",
    type: "voting" as const,
    read: false,
    createdAt: "2025-01-09T14:00:00",
  },
  {
    id: "NOT-003",
    title: "Achievement Unlocked!",
    message: "Congratulations! You've earned the 'Top Contributor' badge.",
    type: "achievement" as const,
    read: false,
    createdAt: "2025-01-08T11:45:00",
  },
  {
    id: "NOT-004",
    title: "Nearby Issue Reported",
    message: "A critical road cave-in has been reported near Main Market.",
    type: "alert" as const,
    read: true,
    createdAt: "2025-01-07T16:20:00",
  },
  {
    id: "NOT-005",
    title: "Complaint Resolved",
    message: "Your complaint CMP-2024-004 about medicine shortage has been resolved.",
    type: "status" as const,
    read: true,
    createdAt: "2025-01-05T10:00:00",
  },
  {
    id: "NOT-006",
    title: "Community Request",
    message: "Priya S. from your area needs support for the Road Caving issue.",
    type: "system" as const,
    read: true,
    createdAt: "2025-01-04T08:30:00",
  },
  {
    id: "NOT-007",
    title: "Budget Update",
    message: "₹12.5 Lakh allocated for Ward 7 road repairs. Work begins next week.",
    type: "status" as const,
    read: false,
    createdAt: "2025-01-14T08:00:00",
  },
  {
    id: "NOT-008",
    title: "New Scheme Launched",
    message: "PM Swachh Bharat 2.0 is now available in your constituency. Apply now!",
    type: "system" as const,
    read: true,
    createdAt: "2025-01-12T10:00:00",
  },
];

function mapComplaint(c: Complaint) {
  return {
    id: c.complaint_uid,
    title: c.title,
    description: c.description || "",
    category: c.category,
    status: c.status,
    severity: c.severity,
    location: c.village || c.nearest_landmark || "Unknown",
    lat: c.gps_latitude || 0,
    lng: c.gps_longitude || 0,
    createdAt: c.created_at,
    updatedAt: c.updated_at,
    upvotes: 0,
    comments: 0,
    department: c.department || undefined,
    officerAssigned: "",
    expectedResolution: c.estimated_resolution_days ? `${c.estimated_resolution_days} days` : "",
    tags: c.ai_detected_sector ? [c.ai_detected_sector] : [],
    progress: c.status === "resolved" ? 100 : c.status === "in-progress" ? 50 : c.status === "verified" ? 25 : 0,
  };
}

const statusColors: Record<string, string> = {
  pending: "bg-gray-100 text-gray-700",
  verified: "bg-blue-100 text-blue-700",
  "in-progress": "bg-amber-100 text-amber-700",
  resolved: "bg-emerald-100 text-emerald-700",
};

const severityDot: Record<string, string> = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-amber-500",
  low: "bg-emerald-500",
};

export default function CitizenDashboardPage() {
  const { t } = useTranslation();

  const statsQuery = useQuery({
    queryKey: ["complaint-stats"],
    queryFn: () => fetchComplaintStats(),
    refetchInterval: 5000,
  });

  const complaintsQuery = useQuery({
    queryKey: ["complaints"],
    queryFn: () => fetchComplaints({}),
    refetchInterval: 5000,
  });

  const total = statsQuery.data?.total_complaints ?? 0;
  const resolved = statsQuery.data?.resolved_complaints ?? 0;
  const pending = statsQuery.data?.pending_complaints ?? 0;
  const inProgress = total - resolved - pending;

  const apiComplaints = (complaintsQuery.data?.complaints || []).map(mapComplaint);
  const recentComplaints = apiComplaints.slice(0, 5);
  const recentNotifications = notifications.slice(0, 4);

  const quickActions = [
    {
      label: t("citizen.dashboard.raiseComplaint"),
      description: t("citizen.dashboard.raiseComplaintDesc"),
      href: "/citizen/complaints/new",
      icon: PlusCircle,
      gradient: "from-blue-500 to-blue-600",
      shadow: "shadow-blue-500/25",
    },
    {
      label: t("citizen.dashboard.trackComplaint"),
      description: t("citizen.dashboard.trackComplaintDesc"),
      href: "/citizen/tracking",
      icon: MapPin,
      gradient: "from-emerald-500 to-emerald-600",
      shadow: "shadow-emerald-500/25",
    },
    {
      label: t("citizen.dashboard.nearbyIssues"),
      description: t("citizen.dashboard.nearbyIssuesDesc"),
      href: "/citizen/nearby",
      icon: Map,
      gradient: "from-amber-500 to-amber-600",
      shadow: "shadow-amber-500/25",
    },
    {
      label: t("citizen.dashboard.communityVoting"),
      description: t("citizen.dashboard.communityVotingDesc"),
      href: "/citizen/voting",
      icon: Vote,
      gradient: "from-purple-500 to-purple-600",
      shadow: "shadow-purple-500/25",
    },
  ];

  const kpiCards = [
    { label: t("citizen.dashboard.totalComplaints"), value: total, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
    { label: t("citizen.dashboard.resolved"), value: resolved, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: t("citizen.dashboard.inProgress"), value: inProgress, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: t("citizen.dashboard.communityScore"), value: citizenUser.participationScore, icon: Star, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent p-6 text-white shadow-xl shadow-primary/10 lg:p-8"
      >
        <div className="absolute inset-0">
          <div className="absolute -right-20 -top-20 size-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 size-48 rounded-full bg-white/5 blur-2xl" />
        </div>
        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold backdrop-blur-sm">
              {citizenUser.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{t("citizen.dashboard.welcomeBack")}, {citizenUser.name.split(" ")[0]}</h2>
              <p className="mt-1 text-white/80">
                {citizenUser.constituency} &middot; {citizenUser.district}, {citizenUser.state}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/citizen/complaints/new">
              <Button className="gap-2 rounded-xl bg-white text-primary hover:bg-white/90">
                <PlusCircle className="size-4" />
                {t("citizen.dashboard.raiseComplaint")}
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpiCards.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <div className={cn("flex size-11 items-center justify-center rounded-xl", kpi.bg)}>
              <kpi.icon className={cn("size-5", kpi.color)} />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
              <div className="mt-0.5 text-sm text-muted-foreground">{kpi.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">{t("citizen.dashboard.quickActions")}</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, i) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
            >
              <Link
                href={action.href}
                className="group relative block overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className={cn("flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg", action.gradient, action.shadow)}>
                  <action.icon className="size-7" />
                </div>
                <h4 className="mt-4 text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                  {action.label}
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">{action.description}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Open <ArrowUpRight className="size-3.5" />
                </div>
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Recent Complaints */}
        <div className="xl:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground">{t("citizen.dashboard.recentComplaints")}</h3>
              <Link href="/citizen/complaints" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                {t("citizen.dashboard.viewAll")} <ChevronRight className="size-3.5" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentComplaints.map((complaint, i) => (
                <motion.div
                  key={complaint.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="flex items-center gap-4 rounded-xl border border-border p-4 transition-all hover:bg-muted/30 hover:shadow-sm"
                >
                  <div className={cn("size-2.5 shrink-0 rounded-full", severityDot[complaint.severity] || "bg-gray-400")} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">{complaint.id}</span>
                      <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", statusColors[complaint.status] || "bg-gray-100 text-gray-700")}>
                        {complaint.status}
                      </span>
                    </div>
                    <div className="mt-1 truncate text-sm font-medium text-foreground">{complaint.title}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{complaint.location}</div>
                  </div>
                  <div className="hidden text-right sm:block">
                    <div className="text-xs text-muted-foreground">{complaint.upvotes} {t("common.upvotes")}</div>
                    <div className="text-xs text-muted-foreground">{complaint.comments} {t("common.comments")}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Trending + Notifications */}
        <div className="space-y-6">
          {/* Trending Issues */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground">{t("citizen.dashboard.trendingIssues")}</h3>
              <TrendingUp className="size-4 text-primary" />
            </div>
            <div className="space-y-3">
              {trendingIssues.map((issue, i) => (
                <div key={issue.id} className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-muted/50">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-foreground">{issue.title}</div>
                    <div className="text-xs text-muted-foreground">{issue.upvotes} {t("common.upvotes")}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground">{t("citizen.dashboard.notifications")}</h3>
              <Link href="/citizen/notifications" className="text-xs font-medium text-primary hover:underline">
                {t("citizen.dashboard.viewAll")}
              </Link>
            </div>
            <div className="space-y-2">
              {recentNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={cn(
                    "rounded-xl p-3 transition-colors hover:bg-muted/50",
                    !notif.read && "bg-primary/5",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{notif.title}</span>
                    {!notif.read && <span className="size-1.5 rounded-full bg-primary" />}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{notif.message}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Government Schemes */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">{t("citizen.dashboard.activeGovSchemes")}</h3>
          <Link href="/citizen/schemes" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            {t("citizen.dashboard.viewAll")} <ChevronRight className="size-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {schemes.slice(0, 3).map((scheme) => (
            <div key={scheme.id} className="rounded-xl border border-border p-4 transition-all hover:shadow-sm">
              <div className="text-sm font-semibold text-foreground">{scheme.name}</div>
              <div className="mt-1 text-xs text-muted-foreground line-clamp-1">{scheme.description}</div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{t("citizen.dashboard.progress")}</span>
                  <span className="font-medium text-foreground">{scheme.progress}%</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
                    style={{ width: `${scheme.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
