"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Calendar,
  User,
  Building,
  Clock,
  Shield,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ComplaintStatusBadge } from "@/components/citizen/ComplaintStatusBadge";
import { ComplaintTimeline } from "@/components/citizen/ComplaintTimeline";
import { useTranslation } from "@/hooks/use-translation";
import { useQuery } from "@tanstack/react-query";
import { fetchComplaints, fetchComplaint } from "@/services/api/complaints";
import type { Complaint } from "@/types/complaint";

function mapComplaint(c: Complaint) {
  return {
    id: c.complaint_uid,
    title: c.title,
    description: c.description || "",
    category: c.category,
    status: c.status as "pending" | "verified" | "in-progress" | "resolved" | "rejected",
    severity: c.severity,
    location: c.village || c.nearest_landmark || "Unknown",
    lat: c.gps_latitude || 0,
    lng: c.gps_longitude || 0,
    createdAt: c.created_at,
    updatedAt: c.updated_at,
    upvotes: 0,
    comments: 0,
    department: c.department || "",
    officerAssigned: "",
    expectedResolution: c.estimated_resolution_days ? `${c.estimated_resolution_days} days` : "",
    tags: c.ai_detected_sector ? [c.ai_detected_sector] : [],
    progress: c.status === "resolved" ? 100 : c.status === "in-progress" ? 50 : c.status === "verified" ? 25 : 0,
  };
}

export default function TrackingPage() {
  const { t } = useTranslation();
  const [searchId, setSearchId] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: listData } = useQuery({
    queryKey: ["complaints"],
    queryFn: () => fetchComplaints({}),
    refetchInterval: 5000,
  });

  const complaints = useMemo(() => (listData?.complaints || []).map(mapComplaint), [listData]);

  const selectedComplaint = useMemo(() => {
    if (!complaints.length) return null;
    const found = selectedId
      ? complaints.find((c) => c.id === selectedId)
      : null;
    return found || complaints[0];
  }, [complaints, selectedId]);

  const searchedComplaint = searchId
    ? complaints.find((c) => c.id.toLowerCase().includes(searchId.toLowerCase()))
    : null;

  const displayComplaint = searchedComplaint || selectedComplaint;

  const stepMap: Record<string, number> = {
    pending: 0,
    verified: 1,
    "in-progress": 4,
    resolved: 5,
    rejected: 0,
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{t("citizen.tracking.trackYourComplaints")}</h2>
        <p className="text-sm text-muted-foreground">{t("citizen.tracking.searchById")}</p>
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t("citizen.tracking.searchByIdPlaceholder")}
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="h-10 pl-9"
        />
      </div>

      {displayComplaint && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">{t("citizen.tracking.yourComplaints")}</h3>
            {complaints.map((complaint, i) => (
              <motion.button
                key={complaint.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => {
                  setSelectedId(complaint.id);
                  setSearchId("");
                }}
                className={cn(
                  "w-full text-left rounded-xl border p-3 transition-all",
                  displayComplaint.id === complaint.id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-card hover:border-primary/30",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-medium text-foreground">{complaint.id}</span>
                  <ComplaintStatusBadge status={complaint.status} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{complaint.title}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">{complaint.createdAt}</p>
              </motion.button>
            ))}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <motion.div
              key={displayComplaint.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-semibold text-foreground">{displayComplaint.title}</h2>
                    <ComplaintStatusBadge status={displayComplaint.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">{displayComplaint.id}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                    <MapPin className="size-4 text-primary shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground">{t("citizen.tracking.location")}</div>
                      <div className="text-sm font-medium text-foreground">{displayComplaint.location}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                    <Calendar className="size-4 text-primary shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground">{t("citizen.tracking.reportedOn")}</div>
                      <div className="text-sm font-medium text-foreground">{displayComplaint.createdAt}</div>
                    </div>
                  </div>
                  {displayComplaint.expectedResolution && (
                    <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                      <Clock className="size-4 text-primary shrink-0" />
                      <div>
                        <div className="text-xs text-muted-foreground">{t("citizen.tracking.expectedResolution")}</div>
                        <div className="text-sm font-medium text-foreground">{displayComplaint.expectedResolution}</div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  {displayComplaint.department && (
                    <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                      <Building className="size-4 text-primary shrink-0" />
                      <div>
                        <div className="text-xs text-muted-foreground">{t("citizen.tracking.department")}</div>
                        <div className="text-sm font-medium text-foreground">{displayComplaint.department}</div>
                      </div>
                    </div>
                  )}
                  {displayComplaint.officerAssigned && (
                    <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                      <User className="size-4 text-primary shrink-0" />
                      <div>
                        <div className="text-xs text-muted-foreground">{t("citizen.tracking.officerAssigned")}</div>
                        <div className="text-sm font-medium text-foreground">{displayComplaint.officerAssigned}</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                    <Shield className="size-4 text-primary shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground">{t("citizen.tracking.aiStatus")}</div>
                      <div className="text-sm font-medium text-foreground">
                        {displayComplaint.status === "pending" ? t("citizen.tracking.analyzing") : t("citizen.tracking.verifiedClean")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">{t("common.progress")}</span>
                  <span className="text-xs font-medium text-foreground">{displayComplaint.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700",
                      displayComplaint.progress === 100 ? "bg-success" : "bg-primary",
                    )}
                    style={{ width: `${displayComplaint.progress}%` }}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              key={`timeline-${displayComplaint.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <h3 className="text-sm font-semibold text-foreground mb-6">{t("citizen.tracking.complaintTimeline")}</h3>
              <ComplaintTimeline currentStep={stepMap[displayComplaint.status] || 0} />
            </motion.div>
          </div>
        </div>
      )}

      {!displayComplaint && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16">
          <Search className="size-12 text-muted-foreground/40 mb-4" />
          <h3 className="text-sm font-semibold text-foreground">{t("citizen.tracking.noComplaintsFound")}</h3>
        </div>
      )}
    </div>
  );
}
