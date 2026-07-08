"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Loader2 } from "lucide-react";
import type L from "leaflet";
import type { DigitalTwinComplaint } from "@/types/digital-twin";
import { fetchDigitalTwin } from "@/services/api/digital-twin";
import ConstituencyMap from "@/components/map/ConstituencyMap";

interface DashboardMapPreviewProps {
  constituency?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  boundaryFile?: string;
}

export default function DashboardMapPreview({
  constituency,
  center,
  zoom,
  boundaryFile,
}: DashboardMapPreviewProps) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  const { data: twinData, isLoading } = useQuery({
    queryKey: ["dashboard-map-preview", constituency],
    queryFn: () => fetchDigitalTwin(constituency),
    refetchInterval: 5000,
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
        citizen: m.citizenName ?? "",
        rootCause: "",
      })),
    [twinData],
  );

  const handleMapReady = useCallback((map: L.Map) => {
    mapRef.current = map;
  }, []);

  const handleClick = useCallback(() => {
    router.push("/mp/constituency-twin");
  }, [router]);

  const handleMarkerClick = useCallback(
    (complaint: DigitalTwinComplaint) => {
      router.push(`/mp/constituency-twin?complaint=${complaint.id}`);
    },
    [router]
  );

  return (
    <div
      className="relative h-80 cursor-pointer overflow-hidden rounded-xl transition-shadow duration-200"
      style={{
        transform: hovered ? "scale(1.01)" : "scale(1)",
        boxShadow: hovered
          ? "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
          : "0 1px 3px rgb(0 0 0 / 0.1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      {isLoading ? (
        <div className="flex h-full items-center justify-center bg-muted/30">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <ConstituencyMap
          complaints={complaints}
          selectedComplaint={null}
          onSelectComplaint={handleMarkerClick}
          activeOverlays={[]}
          onMapReady={handleMapReady}
          previewMode
          center={center}
          zoom={zoom}
          boundaryFile={boundaryFile}
        />
      )}

      {/* Hover overlay */}
      <div
        className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 transition-all duration-200"
        style={{
          backgroundColor: hovered ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0)",
          pointerEvents: "none",
        }}
      >
        <div
          className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-foreground shadow-xl transition-all duration-200"
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(8px)",
          }}
        >
          <ExternalLink className="size-4 text-emerald-600" />
          Open Interactive Digital Twin
        </div>
      </div>
    </div>
  );
}
