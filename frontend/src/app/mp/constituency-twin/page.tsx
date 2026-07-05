"use client";

import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Map, Menu } from "lucide-react";
import type L from "leaflet";
import type { DigitalTwinComplaint, FilterState, OverlayLayer, SearchResult } from "@/types/digital-twin";
import { CONSTITUENCY_CENTER, CONSTITUENCY_ZOOM } from "@/types/digital-twin";
import { mockComplaints } from "@/data/mock-complaints";
import ConstituencyMap from "@/components/map/ConstituencyMap";
import ComplaintDrawer from "@/components/map/ComplaintDrawer";
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
    if (filters.communityVotesMin > 0 && c.communityVotes < filters.communityVotesMin)
      return false;
    if (
      c.aiConfidence < filters.aiConfidenceRange[0] ||
      c.aiConfidence > filters.aiConfidenceRange[1]
    )
      return false;
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

  const filtered = applyFilters(mockComplaints, filters);

  const handleMapReady = useCallback((map: L.Map) => {
    mapRef.current = map;
  }, []);

  const handleSearchResult = useCallback((result: SearchResult) => {
    setFlyTo({ lat: result.latitude, lng: result.longitude, zoom: result.zoom || 15 });
  }, []);

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      {/* Header + Stats */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="shrink-0"
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Map className="size-5 text-emerald-600" />
            <h1 className="text-xl font-bold text-foreground">
              Constituency Digital Twin
            </h1>
          </div>
          <button
            onClick={() => setFilterPanelOpen(!filterPanelOpen)}
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors lg:hidden"
          >
            <Menu className="size-4" />
            Filters
          </button>
        </div>
        <SummaryCards complaints={filtered} />
      </motion.div>

      {/* Map + Sidebar */}
      <div className="flex min-h-0 flex-1 gap-4">
        <FilterPanel
          filters={filters}
          onFiltersChange={setFilters}
          activeOverlays={activeOverlays}
          onOverlaysChange={setActiveOverlays}
          isOpen={filterPanelOpen}
          onToggle={() => setFilterPanelOpen(!filterPanelOpen)}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative min-h-[500px] flex-1 overflow-hidden rounded-2xl border border-border bg-card"
        >
          <ConstituencyMap
            complaints={filtered}
            selectedComplaint={selectedComplaint}
            onSelectComplaint={setSelectedComplaint}
            activeOverlays={activeOverlays}
            flyToLocation={flyTo}
            onMapReady={handleMapReady}
          />

          <MapControls
            onZoomIn={() => mapRef.current?.zoomIn()}
            onZoomOut={() => mapRef.current?.zoomOut()}
            onResetView={() =>
              mapRef.current?.flyTo(
                [CONSTITUENCY_CENTER.lat, CONSTITUENCY_CENTER.lng],
                CONSTITUENCY_ZOOM,
                { duration: 1 }
              )
            }
            onLocateConstituency={() =>
              mapRef.current?.flyTo(
                [CONSTITUENCY_CENTER.lat, CONSTITUENCY_CENTER.lng],
                CONSTITUENCY_ZOOM,
                { duration: 1 }
              )
            }
          />

          <MapSearch complaints={filtered} onResultSelect={handleSearchResult} />

          {/* Legend */}
          <div className="absolute bottom-4 left-14 z-20 flex items-center gap-3 rounded-xl bg-card/95 border border-border px-4 py-2 backdrop-blur-sm">
            {[
              { color: "#dc2626", label: "Critical" },
              { color: "#f97316", label: "High" },
              { color: "#eab308", label: "Medium" },
              { color: "#22c55e", label: "Low" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[10px] font-medium text-muted-foreground">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Complaint count */}
          <div className="absolute bottom-4 right-4 z-20 rounded-xl bg-card/95 border border-border px-3 py-1.5 backdrop-blur-sm">
            <span className="text-xs font-medium text-muted-foreground">
              {filtered.length} complaint{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </motion.div>
      </div>

      <ComplaintDrawer
        complaint={selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
      />
    </div>
  );
}
