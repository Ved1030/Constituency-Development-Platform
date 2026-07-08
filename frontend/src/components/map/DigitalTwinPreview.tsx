"use client";

import { useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Map, Loader2 } from "lucide-react";
import type { DigitalTwinComplaint } from "@/types/digital-twin";
import { fetchDigitalTwin } from "@/services/api/digital-twin";
import { useConstituency } from "@/context/ConstituencyContext";

const ConstituencyMap = dynamic(() => import("@/components/map/ConstituencyMap"), { ssr: false });

export function DigitalTwinPreview() {
  const router = useRouter();
  const { selectedConstituency } = useConstituency();

  const { data: twinData, isLoading } = useQuery({
    queryKey: ["digital-twin-preview", selectedConstituency.name],
    queryFn: () => fetchDigitalTwin(selectedConstituency.name),
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
  });

  const complaints: DigitalTwinComplaint[] = useMemo(
    () =>
      (twinData?.markers ?? []).map((m) => ({
        id: m.id,
        title: m.title,
        description: "",
        latitude: m.latitude,
        longitude: m.longitude,
        priority: m.priority as DigitalTwinComplaint["priority"],
        department: m.department ?? "",
        status: m.status as DigitalTwinComplaint["status"],
        communityVotes: 0,
        affectedPopulation: 0,
        reportedAt: m.reportedAt ?? "",
        assignedOfficer: "",
        estimatedBudget: 0,
        expectedResolution: "",
        aiSummary: "",
        aiRecommendation: "",
        aiConfidence: 0,
        photos: [],
        voiceNote: null,
        ward: m.ward ?? "",
        village: m.village ?? "",
        citizen: "",
        rootCause: "",
      })),
    [twinData],
  );

  const handleMapReady = useCallback(() => {
    // Map initialized — no interaction setup needed in preview mode
  }, []);

  const handleClick = useCallback(() => {
    router.push("/mp/constituency-twin");
  }, [router]);

  return (
    <div className="px-4 pt-4 lg:px-6">
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-border/40 px-5 py-3">
          <div className="flex items-center gap-2">
            <Map className="size-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground">Constituency Digital Twin</h2>
            <span className="hidden rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 text-[9px] font-medium text-emerald-600 dark:text-emerald-400 sm:inline">
              Live GIS Preview
            </span>
          </div>
          <button
            onClick={handleClick}
            className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Open Full Digital Twin
            <ExternalLink className="size-3" />
          </button>
        </div>

        {/* Map Body */}
        <div
          className="relative cursor-pointer overflow-hidden"
          style={{ height: "266px" }}
          onClick={handleClick}
        >
          {isLoading ? (
            <div className="flex h-full items-center justify-center bg-muted/20">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <ConstituencyMap
              complaints={complaints}
              selectedComplaint={null}
              onSelectComplaint={() => {}}
              activeOverlays={[]}
              onMapReady={handleMapReady}
              previewMode
              center={selectedConstituency.center}
              zoom={selectedConstituency.zoom}
              boundaryFile={selectedConstituency.boundaryFile}
            />
          )}
        </div>
      </div>
    </div>
  );
}
