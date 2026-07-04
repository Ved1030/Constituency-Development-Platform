"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Navigation,
  Layers,
  SlidersHorizontal,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NearbyMap } from "@/components/citizen/NearbyMap";
import { IssueCard } from "@/components/citizen/IssueCard";
import { nearbyIssues } from "@/data/mock-citizen";

const categoryFilters = [
  { label: "All", value: "all" },
  { label: "Road", value: "road" },
  { label: "Water", value: "water" },
  { label: "Electricity", value: "electricity" },
  { label: "Healthcare", value: "healthcare" },
  { label: "Sanitation", value: "sanitation" },
  { label: "Education", value: "education" },
];

export default function NearbyPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"map" | "list">("map");

  const filtered = nearbyIssues.filter((issue) => {
    const matchesCategory = activeFilter === "all" || issue.category === activeFilter;
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openCount = nearbyIssues.filter((i) => i.status === "open").length;
  const criticalCount = nearbyIssues.filter((i) => i.severity === "critical").length;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Nearby Issues</h2>
          <p className="text-sm text-muted-foreground">
            {openCount} open issues near you &middot; {criticalCount} critical
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "map" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("map")}
            className="gap-2 h-8"
          >
            <MapPin className="size-3" />
            Map
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="gap-2 h-8"
          >
            <SlidersHorizontal className="size-3" />
            List
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search nearby issues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 pl-9"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categoryFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={cn(
              "whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-all",
              activeFilter === f.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "map" ? (
          <motion.div
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <NearbyMap issues={filtered} />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16">
                <TriangleAlert className="size-12 text-muted-foreground/40 mb-4" />
                <h3 className="text-sm font-semibold text-foreground">No issues found</h3>
                <p className="mt-1 text-xs text-muted-foreground">Try adjusting your filters</p>
              </div>
            ) : (
              filtered.map((issue, i) => (
                <IssueCard key={issue.id} issue={issue} index={i} />
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
