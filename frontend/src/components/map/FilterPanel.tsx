"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, X, Filter } from "lucide-react";
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
  "Roads & Infrastructure",
  "Water Supply",
  "Electricity",
  "Healthcare",
  "Education",
  "Sanitation",
  "Public Safety",
  "Housing",
];
const ALL_VILLAGES = [
  "Gandhi Nagar",
  "Krishna Nagar",
  "Ramesh Nagar",
  "Ward 5 Central",
  "Marina Ward",
  "T Nagar",
  "Adyar East",
  "Velachery",
  "Taramani",
  "Sholinganallur",
];
const ALL_WARDS = Array.from({ length: 12 }, (_, i) => `Ward ${i + 1}`);

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/50 py-3">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
        {title}
        {open ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="pt-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChipGroup<T extends string>({
  items,
  selected,
  onToggle,
}: {
  items: T[];
  selected: T[];
  onToggle: (item: T) => void;
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
                ? "bg-emerald-500 text-white border-emerald-500"
                : "bg-muted text-muted-foreground border-transparent hover:border-border"
            )}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}

function FilterContent({
  filters,
  onFiltersChange,
  activeOverlays,
  onOverlaysChange,
}: {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  activeOverlays: OverlayLayer[];
  onOverlaysChange: (overlays: OverlayLayer[]) => void;
}) {
  const toggleArrayItem = <T extends string>(arr: T[], item: T): T[] => {
    return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
  };

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <>
      {/* Priority */}
      <FilterSection title="Priority">
        <ChipGroup
          items={ALL_PRIORITIES}
          selected={filters.priorities}
          onToggle={(p) => updateFilter("priorities", toggleArrayItem(filters.priorities, p))}
        />
      </FilterSection>

      {/* Status */}
      <FilterSection title="Status">
        <ChipGroup
          items={ALL_STATUSES}
          selected={filters.statuses}
          onToggle={(s) => updateFilter("statuses", toggleArrayItem(filters.statuses, s))}
        />
      </FilterSection>

      {/* Department */}
      <FilterSection title="Department" defaultOpen={false}>
        <ChipGroup
          items={ALL_DEPARTMENTS}
          selected={filters.departments}
          onToggle={(d) => updateFilter("departments", toggleArrayItem(filters.departments, d))}
        />
      </FilterSection>

      {/* Village */}
      <FilterSection title="Village" defaultOpen={false}>
        <ChipGroup
          items={ALL_VILLAGES}
          selected={filters.villages}
          onToggle={(v) => updateFilter("villages", toggleArrayItem(filters.villages, v))}
        />
      </FilterSection>

      {/* Ward */}
      <FilterSection title="Ward" defaultOpen={false}>
        <ChipGroup
          items={ALL_WARDS}
          selected={filters.wards}
          onToggle={(w) => updateFilter("wards", toggleArrayItem(filters.wards, w))}
        />
      </FilterSection>

      {/* Community Votes */}
      <FilterSection title="Min Community Votes" defaultOpen={false}>
        <input
          type="range"
          min={0}
          max={200}
          value={filters.communityVotesMin}
          onChange={(e) => updateFilter("communityVotesMin", Number(e.target.value))}
          className="w-full accent-emerald-500"
        />
        <p className="mt-1 text-xs text-muted-foreground">{filters.communityVotesMin}+ votes</p>
      </FilterSection>

      {/* AI Confidence */}
      <FilterSection title="AI Confidence" defaultOpen={false}>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            max={100}
            value={filters.aiConfidenceRange[0]}
            onChange={(e) => updateFilter("aiConfidenceRange", [Number(e.target.value), filters.aiConfidenceRange[1]])}
            className="w-16 rounded-lg border border-border bg-background px-2 py-1 text-xs"
          />
          <span className="text-xs text-muted-foreground">to</span>
          <input
            type="number"
            min={0}
            max={100}
            value={filters.aiConfidenceRange[1]}
            onChange={(e) => updateFilter("aiConfidenceRange", [filters.aiConfidenceRange[0], Number(e.target.value)])}
            className="w-16 rounded-lg border border-border bg-background px-2 py-1 text-xs"
          />
          <span className="text-xs text-muted-foreground">%</span>
        </div>
      </FilterSection>

      {/* Overlay Layers */}
      <div className="py-3">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">GIS Layers</h4>
        <div className="space-y-1.5">
          {OVERLAY_LAYERS.map((layer) => {
            const isActive = activeOverlays.includes(layer.id);
            return (
              <label
                key={layer.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-muted/50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={() => {
                    onOverlaysChange(
                      isActive ? activeOverlays.filter((o) => o !== layer.id) : [...activeOverlays, layer.id]
                    );
                  }}
                  className="size-3.5 rounded border-border bg-background accent-emerald-500"
                />
                <div className="size-2.5 rounded-full" style={{ backgroundColor: layer.color }} />
                <span className="text-xs text-muted-foreground">{layer.name}</span>
              </label>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default function FilterPanel({ filters, onFiltersChange, activeOverlays, onOverlaysChange, isOpen, onToggle }: FilterPanelProps) {
  const activeCount =
    filters.priorities.length +
    filters.departments.length +
    filters.villages.length +
    filters.wards.length +
    filters.statuses.length +
    (filters.dateRange ? 1 : 0) +
    (filters.communityVotesMin > 0 ? 1 : 0);

  return (
    <>
      {/* Mobile toggle button */}
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

      {/* Desktop sidebar — always visible */}
      <div className="hidden lg:flex lg:w-72 shrink-0 flex-col rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-foreground">Filters & Layers</h3>
            {activeCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                {activeCount}
              </span>
            )}
          </div>
          {activeCount > 0 && (
            <button
              onClick={() =>
                onFiltersChange({
                  priorities: [],
                  departments: [],
                  wards: [],
                  villages: [],
                  statuses: [],
                  dateRange: null,
                  aiConfidenceRange: [0, 100],
                  communityVotesMin: 0,
                })
              }
              className="rounded-lg px-2 py-1 text-xs text-muted-foreground hover:bg-muted transition-colors"
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
              className="fixed left-0 top-0 z-40 flex h-full w-80 flex-col border-r border-border bg-card shadow-xl lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-border p-4">
                <div className="flex items-center gap-2">
                  <Filter className="size-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-foreground">Filters & Layers</h3>
                  {activeCount > 0 && (
                    <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                      {activeCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {activeCount > 0 && (
                    <button
                      onClick={() =>
                        onFiltersChange({
                          priorities: [],
                          departments: [],
                          wards: [],
                          villages: [],
                          statuses: [],
                          dateRange: null,
                          aiConfidenceRange: [0, 100],
                          communityVotesMin: 0,
                        })
                      }
                      className="rounded-lg px-2 py-1 text-xs text-muted-foreground hover:bg-muted transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                  <button onClick={onToggle} className="rounded-lg p-1 text-muted-foreground hover:bg-muted transition-colors">
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
