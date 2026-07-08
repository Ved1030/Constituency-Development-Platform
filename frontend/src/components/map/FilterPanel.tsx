"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, X, Filter, Thermometer } from "lucide-react";
import type { FilterState, ComplaintPriority, ComplaintStatus, OverlayLayer } from "@/types/digital-twin";
import { OVERLAY_LAYERS } from "@/types/digital-twin";
import { cn } from "@/lib/utils";

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  activeOverlays: OverlayLayer[];
  onOverlaysChange: (overlays: OverlayLayer[]) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const ALL_PRIORITIES: ComplaintPriority[] = ["Critical", "High", "Medium", "Low"];
const ALL_STATUSES: ComplaintStatus[] = ["Open", "In Progress", "Resolved", "Closed"];
const ALL_DEPARTMENTS = [
  "Roads & Infrastructure", "Water Supply", "Electricity",
  "Healthcare", "Education", "Sanitation", "Public Safety", "Housing",
];
const ALL_VILLAGES = [
  "Gandhi Nagar", "Krishna Nagar", "Ramesh Nagar", "Ward 5 Central",
  "Marina Ward", "T Nagar", "Adyar East", "Velachery", "Taramani", "Sholinganallur",
];
const ALL_WARDS = Array.from({ length: 12 }, (_, i) => `Ward ${i + 1}`);

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 py-3 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-800 transition-colors"
      >
        {title}
        {open ? <ChevronUp className="size-3.5 text-gray-400" /> : <ChevronDown className="size-3.5 text-gray-400" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="pt-2.5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChipGroup<T extends string>({
  items, selected, onToggle, colors,
}: {
  items: T[]; selected: T[]; onToggle: (item: T) => void; colors?: Record<string, string>;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => {
        const isActive = selected.includes(item);
        return (
          <button
            key={item}
            onClick={() => onToggle(item)}
            className={cn(
              "rounded-lg border px-2.5 py-1 text-xs font-medium transition-all",
              isActive
                ? "text-white border-transparent"
                : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-100"
            )}
            style={isActive && colors?.[item] ? { backgroundColor: colors[item], borderColor: colors[item] } : isActive ? { backgroundColor: "#10b981", borderColor: "#10b981" } : undefined}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}

const PRIORITY_COLORS_MAP: Record<string, string> = {
  Critical: "#b91c1c",
  High: "#f97316",
  Medium: "#eab308",
  Low: "#22c55e",
};

function FilterContent({
  filters, onFiltersChange, activeOverlays, onOverlaysChange,
}: {
  filters: FilterState; onFiltersChange: (f: FilterState) => void;
  activeOverlays: OverlayLayer[]; onOverlaysChange: (o: OverlayLayer[]) => void;
}) {
  const toggleArrayItem = <T extends string>(arr: T[], item: T): T[] =>
    arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) =>
    onFiltersChange({ ...filters, [key]: value });

  const [heatmapEnabled, setHeatmapEnabled] = useState(activeOverlays.includes("complaintDensity"));

  const toggleHeatmap = () => {
    const next = !heatmapEnabled;
    setHeatmapEnabled(next);
    onOverlaysChange(
      next
        ? [...activeOverlays.filter((o) => o !== "complaintDensity"), "complaintDensity"]
        : activeOverlays.filter((o) => o !== "complaintDensity")
    );
  };

  return (
    <>
      <FilterSection title="Priority">
        <ChipGroup
          items={ALL_PRIORITIES}
          selected={filters.priorities}
          onToggle={(p) => updateFilter("priorities", toggleArrayItem(filters.priorities, p))}
          colors={PRIORITY_COLORS_MAP}
        />
      </FilterSection>

      <FilterSection title="Status">
        <ChipGroup
          items={ALL_STATUSES}
          selected={filters.statuses}
          onToggle={(s) => updateFilter("statuses", toggleArrayItem(filters.statuses, s))}
        />
      </FilterSection>

      <FilterSection title="Department" defaultOpen={false}>
        <ChipGroup
          items={ALL_DEPARTMENTS}
          selected={filters.departments}
          onToggle={(d) => updateFilter("departments", toggleArrayItem(filters.departments, d))}
        />
      </FilterSection>

      <FilterSection title="Village" defaultOpen={false}>
        <ChipGroup
          items={ALL_VILLAGES}
          selected={filters.villages}
          onToggle={(v) => updateFilter("villages", toggleArrayItem(filters.villages, v))}
        />
      </FilterSection>

      <FilterSection title="Ward" defaultOpen={false}>
        <ChipGroup
          items={ALL_WARDS}
          selected={filters.wards}
          onToggle={(w) => updateFilter("wards", toggleArrayItem(filters.wards, w))}
        />
      </FilterSection>

      <FilterSection title="Community Votes" defaultOpen={false}>
        <input
          type="range"
          min={0}
          max={200}
          value={filters.communityVotesMin}
          onChange={(e) => updateFilter("communityVotesMin", Number(e.target.value))}
          className="w-full accent-emerald-500"
        />
        <p className="mt-1 text-xs text-gray-500">{filters.communityVotesMin}+ votes</p>
      </FilterSection>

      <FilterSection title="AI Confidence" defaultOpen={false}>
        <div className="flex items-center gap-2">
          <input
            type="number" min={0} max={100}
            value={filters.aiConfidenceRange[0]}
            onChange={(e) => updateFilter("aiConfidenceRange", [Number(e.target.value), filters.aiConfidenceRange[1]])}
            className="w-16 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700"
          />
          <span className="text-xs text-gray-400">to</span>
          <input
            type="number" min={0} max={100}
            value={filters.aiConfidenceRange[1]}
            onChange={(e) => updateFilter("aiConfidenceRange", [filters.aiConfidenceRange[0], Number(e.target.value)])}
            className="w-16 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700"
          />
          <span className="text-xs text-gray-400">%</span>
        </div>
      </FilterSection>

      <FilterSection title="GIS Layers" defaultOpen={false}>
        <div className="space-y-1.5">
          {OVERLAY_LAYERS.filter((l) => l.id !== "complaintDensity").map((layer) => {
            const isActive = activeOverlays.includes(layer.id);
            return (
              <label
                key={layer.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg p-1.5 hover:bg-gray-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={() => onOverlaysChange(
                    isActive ? activeOverlays.filter((o) => o !== layer.id) : [...activeOverlays, layer.id]
                  )}
                  className="size-3.5 rounded border-gray-300 bg-white accent-emerald-500"
                />
                <div className="size-2.5 rounded-full" style={{ backgroundColor: layer.color }} />
                <span className="text-xs text-gray-600">{layer.name}</span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* Heatmap Toggle */}
      <div className="border-b border-gray-100 py-3">
        <label className="flex cursor-pointer items-center justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className="size-4 text-gray-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Heatmap</span>
          </div>
          <button
            onClick={toggleHeatmap}
            className={cn(
              "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
              heatmapEnabled ? "bg-emerald-500" : "bg-gray-200"
            )}
          >
            <span
              className={cn(
                "inline-block size-3.5 rounded-full bg-white shadow-sm transition-transform",
                heatmapEnabled ? "translate-x-[18px]" : "translate-x-[2px]"
              )}
            />
          </button>
        </label>
      </div>
    </>
  );
}

export default function FilterPanel({ filters, onFiltersChange, activeOverlays, onOverlaysChange, isOpen, onToggle }: FilterPanelProps) {
  const activeCount =
    filters.priorities.length + filters.departments.length + filters.villages.length +
    filters.wards.length + filters.statuses.length + (filters.dateRange ? 1 : 0) +
    (filters.communityVotesMin > 0 ? 1 : 0);

  return (
    <>
      <button
        onClick={onToggle}
        className="fixed left-4 bottom-28 z-30 flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-emerald-700 transition-colors lg:hidden"
      >
        <Filter className="size-4" />
        Filters
        {activeCount > 0 && (
          <span className="ml-1 flex size-5 items-center justify-center rounded-full bg-white/20 text-xs">{activeCount}</span>
        )}
      </button>

      {/* Desktop left panel — 320px fixed */}
      <div className="hidden w-80 shrink-0 flex-col rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden lg:flex">
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3.5">
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-gray-800">Filters &amp; Layers</h3>
            {activeCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                {activeCount}
              </span>
            )}
          </div>
          {activeCount > 0 && (
            <button
              onClick={() =>
                onFiltersChange({
                  priorities: [], departments: [], wards: [], villages: [],
                  statuses: [], dateRange: null, aiConfidenceRange: [0, 100], communityVotesMin: 0,
                })
              }
              className="rounded-lg px-2 py-1 text-[10px] text-gray-500 hover:bg-gray-100 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto px-4">
          <FilterContent
            filters={filters}
            onFiltersChange={onFiltersChange}
            activeOverlays={activeOverlays}
            onOverlaysChange={onOverlaysChange}
          />
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden"
              onClick={onToggle}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 z-40 flex h-full w-80 flex-col border-r border-gray-200 bg-white shadow-xl lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-gray-100 p-4">
                <div className="flex items-center gap-2">
                  <Filter className="size-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-gray-800">Filters &amp; Layers</h3>
                  {activeCount > 0 && (
                    <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                      {activeCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {activeCount > 0 && (
                    <button
                      onClick={() =>
                        onFiltersChange({
                          priorities: [], departments: [], wards: [], villages: [],
                          statuses: [], dateRange: null, aiConfidenceRange: [0, 100], communityVotesMin: 0,
                        })
                      }
                      className="rounded-lg px-2 py-1 text-[10px] text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                  <button onClick={onToggle} className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 transition-colors">
                    <X className="size-4" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-4">
                <FilterContent
                  filters={filters}
                  onFiltersChange={onFiltersChange}
                  activeOverlays={activeOverlays}
                  onOverlaysChange={onOverlaysChange}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
