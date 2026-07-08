"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  PlusCircle,
  Search,
  SlidersHorizontal,
  FileText,
  CheckCircle,
  Clock,
  CircleAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ComplaintCard } from "@/components/citizen/ComplaintCard";
import { useTranslation } from "@/hooks/use-translation";
import { useQuery } from "@tanstack/react-query";
import { fetchComplaints } from "@/services/api/complaints";
import type { Complaint } from "@/types/complaint";

function mapComplaint(c: Complaint) {
  return {
    id: c.complaint_uid,
    title: c.title,
    description: c.description || "",
    category: c.category,
    status: c.status,
    severity: c.severity as "low" | "medium" | "high" | "critical",
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

export default function ComplaintsPage() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data } = useQuery({
    queryKey: ["complaints", activeFilter, searchQuery],
    queryFn: () => fetchComplaints({
      status: activeFilter === "all" ? undefined : activeFilter,
    }),
    refetchInterval: 5000,
  });

  const complaints = useMemo(() => (data?.complaints || []).map(mapComplaint), [data]);

  const statusFilters = [
    { label: t("common.all"), value: "all" },
    { label: t("common.pending"), value: "pending" },
    { label: t("common.inProgress"), value: "in-progress" },
    { label: t("common.resolved"), value: "resolved" },
  ];

  const filtered = complaints.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const stats = [
    { icon: FileText, label: t("citizen.complaints.total"), value: complaints.length, color: "text-primary", bg: "bg-primary/10" },
    { icon: CheckCircle, label: t("common.resolved"), value: complaints.filter((c) => c.status === "resolved").length, color: "text-success", bg: "bg-success/10" },
    { icon: Clock, label: t("common.inProgress"), value: complaints.filter((c) => c.status === "in-progress").length, color: "text-purple-500", bg: "bg-purple-500/10" },
    { icon: CircleAlert, label: t("common.pending"), value: complaints.filter((c) => c.status === "pending" || c.status === "verified").length, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {t("citizen.complaints.trackManage")}
          </p>
        </div>
        <Link href="/citizen/complaints/new">
          <Button className="gap-2 h-9 text-sm">
            <PlusCircle className="size-4" />
            {t("citizen.complaints.raiseComplaint")}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-4 transition-all hover:shadow-sm"
          >
            <div className={cn("flex size-9 items-center justify-center rounded-xl mb-3", stat.bg)}>
              <stat.icon className={cn("size-5", stat.color)} />
            </div>
            <div className="text-xl font-bold text-foreground">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("common.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 pl-8 text-sm"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={cn(
                "whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                activeFilter === f.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16"
          >
            <FileText className="size-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-sm font-semibold text-foreground">{t("citizen.complaints.noComplaintsFound")}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {searchQuery ? t("citizen.complaints.tryDifferentSearch") : t("citizen.complaints.noComplaintsYet")}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-3 sm:grid-cols-2"
          >
            {filtered.map((complaint, i) => (
              <ComplaintCard key={complaint.id} complaint={complaint} index={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
