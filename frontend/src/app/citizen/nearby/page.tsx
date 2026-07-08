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
import { useTranslation } from "@/hooks/use-translation";

const nearbyIssues = [
  {
    id: "ISS-001",
    title: "Road Caving Near Market",
    description: "Portion of road near the main market has caved in creating a 3ft deep pit.",
    category: "road" as const,
    severity: "critical" as const,
    location: "Main Market, Ward 7",
    lat: 13.0827,
    lng: 80.2707,
    upvotes: 28,
    status: "open" as const,
    distance: "0.2 km",
    reportedBy: "Priya S.",
  },
  {
    id: "ISS-002",
    title: "Water Pipe Burst on 5th Street",
    description: "Main water pipe has burst flooding the street. Water wastage for 2 days.",
    category: "water" as const,
    severity: "high" as const,
    location: "5th Street, Ward 7",
    lat: 13.0845,
    lng: 80.2725,
    upvotes: 19,
    status: "in-progress" as const,
    distance: "0.4 km",
    reportedBy: "Rahul M.",
  },
  {
    id: "ISS-003",
    title: "Transformer Blown Near Park",
    description: "Main transformer has blown affecting power supply to 200+ houses.",
    category: "electricity" as const,
    severity: "critical" as const,
    location: "Gandhi Park, Ward 7",
    lat: 13.0805,
    lng: 80.274,
    upvotes: 45,
    status: "in-progress" as const,
    distance: "0.6 km",
    reportedBy: "Deepa K.",
  },
  {
    id: "ISS-004",
    title: "Mosquito Breeding in Vacant Lot",
    description: "Vacant lot has stagnant water breeding mosquitoes. Dengue risk high.",
    category: "sanitation" as const,
    severity: "medium" as const,
    location: "Near Temple, Ward 5",
    lat: 13.079,
    lng: 80.269,
    upvotes: 12,
    status: "open" as const,
    distance: "0.8 km",
    reportedBy: "Anand R.",
  },
  {
    id: "ISS-005",
    title: "School Building Wall Cracked",
    description: "Boundary wall of Government School is severely cracked and may collapse.",
    category: "education" as const,
    severity: "high" as const,
    location: "Government School, Ward 7",
    lat: 13.0835,
    lng: 80.271,
    upvotes: 34,
    status: "resolved" as const,
    distance: "1.1 km",
    reportedBy: "Lakshmi N.",
  },
  {
    id: "ISS-006",
    title: "Clinic Without Power Backup",
    description: "Primary health centre has no generator. Emergency cases affected during power cuts.",
    category: "healthcare" as const,
    severity: "high" as const,
    location: "PHC Complex, Ward 7",
    lat: 13.081,
    lng: 80.2695,
    upvotes: 22,
    status: "open" as const,
    distance: "0.5 km",
    reportedBy: "Dr. Meena R.",
  },
  {
    id: "ISS-007",
    title: "Street Light Pole Leaning Dangerously",
    description: "Electric pole near bus stop is leaning at 45 degrees. Risk of falling.",
    category: "electricity" as const,
    severity: "critical" as const,
    location: "Bus Stop, Ward 4",
    lat: 13.086,
    lng: 80.273,
    upvotes: 31,
    status: "open" as const,
    distance: "0.3 km",
    reportedBy: "Suresh B.",
  },
];

export default function NearbyPage() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"map" | "list">("map");

  const categoryFilters = [
    { label: t("common.all"), value: "all" },
    { label: t("common.road"), value: "road" },
    { label: t("common.water"), value: "water" },
    { label: t("common.electricity"), value: "electricity" },
    { label: t("common.healthcare"), value: "healthcare" },
    { label: t("common.sanitation"), value: "sanitation" },
    { label: t("common.education"), value: "education" },
  ];

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
          <h2 className="text-lg font-semibold text-foreground">{t("citizen.nearby.nearbyIssues")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("citizen.nearby.openIssuesNearYou", { count: openCount, critical: criticalCount })}
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
            {t("common.map")}
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="gap-2 h-8"
          >
            <SlidersHorizontal className="size-3" />
            {t("common.list")}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("citizen.nearby.searchNearby")}
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
                <h3 className="text-sm font-semibold text-foreground">{t("citizen.nearby.noIssuesFound")}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{t("citizen.nearby.tryAdjustingFilters")}</p>
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
