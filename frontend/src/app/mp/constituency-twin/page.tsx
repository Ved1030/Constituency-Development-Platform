"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type L from "leaflet";
import type { DigitalTwinComplaint, FilterState, OverlayLayer, SearchResult } from "@/types/digital-twin";
import { CONSTITUENCY_CENTER, CONSTITUENCY_ZOOM } from "@/types/digital-twin";
import { fetchDigitalTwin } from "@/services/api/digital-twin";
import { useAuth } from "@/context/AuthContext";
import { getConstituency } from "@/data/constituencies";
import ConstituencyMap from "@/components/map/ConstituencyMap";
import RightIntelligencePanel from "@/components/map/RightIntelligencePanel";
import FilterPanel from "@/components/map/FilterPanel";
import MapControls from "@/components/map/MapControls";
import MapSearch from "@/components/map/MapSearch";
import SummaryCards from "@/components/map/SummaryCards";

const defaultFilters: FilterState = {
  priorities: [],
  departments: [],
  wards: [],
  villages: [],
  statuses: [],
  dateRange: null,
  aiConfidenceRange: [0, 100],
  communityVotesMin: 0,
};

function applyFilters(
  complaints: DigitalTwinComplaint[],
  filters: FilterState
): DigitalTwinComplaint[] {
  return complaints.filter((c) => {
    if (filters.priorities.length && !filters.priorities.includes(c.priority)) return false;
    if (filters.departments.length && !filters.departments.includes(c.department)) return false;
    if (filters.villages.length && !filters.villages.includes(c.village)) return false;
    if (filters.wards.length && !filters.wards.includes(c.ward)) return false;
    if (filters.statuses.length && !filters.statuses.includes(c.status)) return false;
    if (filters.communityVotesMin > 0 && c.communityVotes < filters.communityVotesMin) return false;
    if (c.aiConfidence < filters.aiConfidenceRange[0] || c.aiConfidence > filters.aiConfidenceRange[1]) return false;
    return true;
  });
}

export default function ConstituencyTwinPage() {
  const [selectedComplaint, setSelectedComplaint] = useState<DigitalTwinComplaint | null>(null);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [activeOverlays, setActiveOverlays] = useState<OverlayLayer[]>(["complaintDensity"]);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [flyTo, setFlyTo] = useState<{ lat: number; lng: number; zoom: number } | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const { user } = useAuth();
  const constituencyName = user?.constituency || "North Chennai";
  const constituencyInfo = getConstituency(constituencyName) || getConstituency("North Chennai")!;

  const { data: dtData } = useQuery({
    queryKey: ["mp-digital-twin", constituencyName],
    queryFn: () => fetchDigitalTwin(constituencyName),
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });

  const allComplaints = useMemo<DigitalTwinComplaint[]>(
    () =>
      (dtData?.markers || []).map((m) => ({
        id: m.id,
        title: m.title,
        description: "",
        latitude: m.latitude,
        longitude: m.longitude,
        priority: m.priority as DigitalTwinComplaint["priority"],
        department: m.department || "Unknown",
        status: m.status as DigitalTwinComplaint["status"],
        communityVotes: 0,
        affectedPopulation: 0,
        reportedAt: m.reportedAt || new Date().toISOString(),
        assignedOfficer: "",
        estimatedBudget: 0,
        expectedResolution: "",
        aiSummary: "",
        aiRecommendation: "",
        aiConfidence: m.aiConfidence || 0,
        photos: [],
        voiceNote: null,
        ward: m.ward || "",
        village: m.village || "",
        citizen: "",
        rootCause: "",
      })),
    [dtData],
  );

  const filtered = useMemo(() => applyFilters(allComplaints, filters), [allComplaints, filters]);

  const activeComplaint = selectedComplaint || filtered[0] || null;

  const handleMapReady = useCallback((map: L.Map) => {
    mapRef.current = map;
  }, []);

  const handleSearchResult = useCallback((result: SearchResult) => {
    setFlyTo({ lat: result.latitude, lng: result.longitude, zoom: result.zoom || 15 });
  }, []);

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4 overflow-hidden">
      {/* 6 KPI Cards */}
      <SummaryCards complaints={filtered} />

      {/* Three-column layout */}
      <div className="flex min-h-0 flex-1 gap-6">
        {/* LEFT: Filter Panel — 320px fixed */}
        <FilterPanel
          filters={filters}
          onFiltersChange={setFilters}
          activeOverlays={activeOverlays}
          onOverlaysChange={setActiveOverlays}
          isOpen={filterPanelOpen}
          onToggle={() => setFilterPanelOpen(!filterPanelOpen)}
        />

        {/* CENTER: Map — flex */}
        <div className="relative flex min-h-0 flex-1 overflow-hidden rounded-[20px] border border-border bg-card">
          <ConstituencyMap
            complaints={filtered}
            selectedComplaint={activeComplaint}
            onSelectComplaint={setSelectedComplaint}
            activeOverlays={activeOverlays}
            flyToLocation={flyTo}
            onMapReady={handleMapReady}
            center={constituencyInfo.center}
            zoom={constituencyInfo.zoom}
            boundaryFile={constituencyInfo.boundaryFile}
          />

          <MapControls
            onZoomIn={() => mapRef.current?.zoomIn()}
            onZoomOut={() => mapRef.current?.zoomOut()}
            onResetView={() =>
              mapRef.current?.flyTo(
                [constituencyInfo.center.lat, constituencyInfo.center.lng],
                constituencyInfo.zoom,
                { duration: 1 }
              )
            }
            onLocateConstituency={() =>
              mapRef.current?.flyTo(
                [constituencyInfo.center.lat, constituencyInfo.center.lng],
                constituencyInfo.zoom,
                { duration: 1 }
              )
            }
          />

          <MapSearch complaints={filtered} onResultSelect={handleSearchResult} />

          {/* Legend — bottom-left */}
          <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3 rounded-xl bg-card/95 border border-border px-3 py-1.5 backdrop-blur-sm shadow-sm">
            {[
              { color: "#b91c1c", label: "Critical" },
              { color: "#f97316", label: "High" },
              { color: "#eab308", label: "Medium" },
              { color: "#22c55e", label: "Low" },
              { color: "#3b82f6", label: "Resolved" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[10px] font-medium text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Complaint count — bottom-right */}
          <div className="absolute bottom-4 right-4 z-20 rounded-xl bg-card/95 border border-border px-3 py-1.5 backdrop-blur-sm shadow-sm">
            <span className="text-xs font-medium text-muted-foreground">
              {filtered.length} complaint{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* RIGHT: Intelligence Panel — 380px fixed, always visible */}
        <RightIntelligencePanel
          complaint={activeComplaint}
          onClose={() => setSelectedComplaint(null)}
          onSelectComplaint={setSelectedComplaint}
        />
      </div>
    </div>
  );
}
