"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Map,
  TrendingUp,
  Users,
  IndianRupee,
  AlertTriangle,
  ArrowRight,
  Zap,
  Eye,
  Droplets,
  Road,
  Heart,
  GraduationCap,
  Home,
  Lightbulb,
  Tractor,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Department color map ──────────────────────────────────────────────
const DEPT_COLORS: Record<string, { bg: string; text: string; dot: string; border: string; light: string }> = {
  "Water Supply": {
    bg: "bg-sky-50 dark:bg-sky-500/10",
    text: "text-sky-600 dark:text-sky-400",
    dot: "bg-sky-500",
    border: "border-sky-200 dark:border-sky-500/20",
    light: "#0ea5e9",
  },
  Roads: {
    bg: "bg-orange-50 dark:bg-orange-500/10",
    text: "text-orange-600 dark:text-orange-400",
    dot: "bg-orange-500",
    border: "border-orange-200 dark:border-orange-500/20",
    light: "#f97316",
  },
  Healthcare: {
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
    border: "border-emerald-200 dark:border-emerald-500/20",
    light: "#10b981",
  },
  Education: {
    bg: "bg-purple-50 dark:bg-purple-500/10",
    text: "text-purple-600 dark:text-purple-400",
    dot: "bg-purple-500",
    border: "border-purple-200 dark:border-purple-500/20",
    light: "#8b5cf6",
  },
  Sanitation: {
    bg: "bg-stone-50 dark:bg-stone-500/10",
    text: "text-stone-600 dark:text-stone-400",
    dot: "bg-stone-500",
    border: "border-stone-200 dark:border-stone-500/20",
    light: "#78716c",
  },
  Electricity: {
    bg: "bg-yellow-50 dark:bg-yellow-500/10",
    text: "text-yellow-600 dark:text-yellow-400",
    dot: "bg-yellow-500",
    border: "border-yellow-200 dark:border-yellow-500/20",
    light: "#eab308",
  },
  Housing: {
    bg: "bg-indigo-50 dark:bg-indigo-500/10",
    text: "text-indigo-600 dark:text-indigo-400",
    dot: "bg-indigo-500",
    border: "border-indigo-200 dark:border-indigo-500/20",
    light: "#6366f1",
  },
  Agriculture: {
    bg: "bg-green-50 dark:bg-green-500/10",
    text: "text-green-600 dark:text-green-400",
    dot: "bg-green-500",
    border: "border-green-200 dark:border-green-500/20",
    light: "#22c55e",
  },
};

const DEFAULT_DEPT = { bg: "bg-gray-50", text: "text-gray-600", dot: "bg-gray-500", border: "border-gray-200", light: "#6b7280" };

function getDeptColor(dept: string) {
  return DEPT_COLORS[dept] || DEFAULT_DEPT;
}

function getDeptIcon(dept: string) {
  switch (dept) {
    case "Water Supply":
      return Droplets;
    case "Roads":
      return Road;
    case "Healthcare":
      return Heart;
    case "Education":
      return GraduationCap;
    case "Housing":
      return Home;
    case "Electricity":
      return Lightbulb;
    case "Agriculture":
      return Tractor;
    default:
      return AlertTriangle;
  }
}

// ─── Priority data from mock-constituency-data ─────────────────────────
const priorities = [
  {
    rank: 1,
    ward: "Ward 12",
    village: "Sewapuri",
    issue: "Severe water shortage - borewells dried up",
    department: "Water Supply",
    population: 12450,
    budget: "₹12L",
    urgency: 96,
    confidence: 94,
    needScore: 97,
    impactScore: 92,
    lat: 13.115,
    lng: 80.275,
  },
  {
    rank: 2,
    ward: "Ward 8",
    village: "Korattur",
    issue: "Industrial road completely damaged with potholes",
    department: "Roads",
    population: 102300,
    budget: "₹2.5Cr",
    urgency: 92,
    confidence: 91,
    needScore: 89,
    impactScore: 94,
    lat: 13.130,
    lng: 80.290,
  },
  {
    rank: 3,
    ward: "Ward 15",
    village: "Perambur",
    issue: "PHC lacks emergency medicines and female doctor",
    department: "Healthcare",
    population: 84200,
    budget: "₹45L",
    urgency: 88,
    confidence: 89,
    needScore: 92,
    impactScore: 87,
    lat: 13.118,
    lng: 80.265,
  },
  {
    rank: 4,
    ward: "Ward 3",
    village: "Villivakkam",
    issue: "Open drainage blocked causing health hazards",
    department: "Sanitation",
    population: 96800,
    budget: "₹18L",
    urgency: 85,
    confidence: 87,
    needScore: 84,
    impactScore: 82,
    lat: 13.140,
    lng: 80.305,
  },
  {
    rank: 5,
    ward: "Ward 6",
    village: "Ayanavaram",
    issue: "Transformer damaged - no power for 3 days",
    department: "Electricity",
    population: 78500,
    budget: "₹8L",
    urgency: 82,
    confidence: 85,
    needScore: 80,
    impactScore: 78,
    lat: 13.125,
    lng: 80.295,
  },
  {
    rank: 6,
    ward: "Ward 21",
    village: "Otteri",
    issue: "Government school buildings in dilapidated condition",
    department: "Education",
    population: 45600,
    budget: "₹1.2Cr",
    urgency: 78,
    confidence: 83,
    needScore: 76,
    impactScore: 85,
    lat: 13.108,
    lng: 80.278,
  },
];

// ─── Filter Chips data ─────────────────────────────────────────────────
const filterChips = [
  { id: "roads", label: "Roads", color: "#f97316" },
  { id: "water", label: "Water", color: "#0ea5e9" },
  { id: "education", label: "Education", color: "#8b5cf6" },
  { id: "healthcare", label: "Healthcare", color: "#10b981" },
  { id: "housing", label: "Housing", color: "#6366f1" },
  { id: "electricity", label: "Electricity", color: "#eab308" },
  { id: "agriculture", label: "Agriculture", color: "#22c55e" },
];

interface DigitalTwinHeroProps {
  onPrioritySelect?: (priority: (typeof priorities)[0]) => void;
  selectedPriority?: (typeof priorities)[0] | null;
}

export function DigitalTwinHero({ onPrioritySelect, selectedPriority }: DigitalTwinHeroProps) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [hoveredPriority, setHoveredPriority] = useState<string | null>(null);
  const [activeLayers, setActiveLayers] = useState({
    satellite: false,
    terrain: false,
    digitalTwin: true,
    wardBoundary: true,
    villageBoundary: true,
  });

  const filteredPriorities = useMemo(() => {
    if (!activeFilter) return priorities;
    const filterMap: Record<string, string> = {
      roads: "Roads",
      water: "Water Supply",
      education: "Education",
      healthcare: "Healthcare",
      housing: "Housing",
      electricity: "Electricity",
      agriculture: "Agriculture",
    };
    const dept = filterMap[activeFilter];
    return priorities.filter((p) => p.department === dept);
  }, [activeFilter]);

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div className="px-4 pt-4 lg:px-6">
      {/* Section Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Map className="size-4 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Constituency Digital Twin</h2>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
            GIS Command Center
          </span>
        </div>
        <button
          onClick={() => router.push("/mp/constituency-twin")}
          className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
        >
          Open Full Twin
          <ExternalLink className="size-3" />
        </button>
      </div>

      <div className="flex gap-3">
        {/* ═══ LEFT: MAP (70%) ═══ */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="relative flex-1 overflow-hidden rounded-2xl border border-border/60 bg-card"
          style={{ minHeight: "480px" }}
        >
          {/* Map Canvas */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Grid overlay */}
            <svg className="absolute inset-0 h-full w-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#map-grid)" />
            </svg>

            {/* Terrain / Topography lines */}
            <svg className="absolute inset-0 h-full w-full opacity-[0.06]" viewBox="0 0 800 500">
              {[1, 2, 3, 4, 5].map((i) => (
                <path
                  key={i}
                  d={`M${i * 60},${i * 30} Q${200 + i * 30},${50 + i * 20} ${400 + i * 20},${100 + i * 30} T${700 + i * 10},${200 + i * 20}`}
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                  opacity={0.3}
                />
              ))}
            </svg>

            {/* Constituency Boundary */}
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 480">
              <path
                d="M120,80 Q200,50 320,70 Q420,90 480,100 Q560,120 620,180 Q670,240 650,320 Q620,390 540,420 Q420,450 320,420 Q220,390 170,310 Q130,240 110,160 Q100,110 120,80 Z"
                fill="rgba(13,71,161,0.08)"
                stroke="rgba(66,165,245,0.4)"
                strokeWidth="2"
                strokeDasharray="8 4"
              />
            </svg>

            {/* Villages / Hotspots */}
            {priorities.map((p, i) => {
              const x = 15 + ((p.lng - 80.26) * 8000) % 70;
              const y = 10 + ((p.lat - 13.07) * 6000) % 70;
              const isSelected = selectedPriority?.rank === p.rank;
              const isHovered = hoveredPriority === p.village;
              const deptColor = getDeptColor(p.department);

              return (
                <div
                  key={p.village}
                  className="absolute cursor-pointer transition-all duration-300"
                  style={{ left: `${x}%`, top: `${y}%` }}
                  onMouseEnter={() => setHoveredPriority(p.village)}
                  onMouseLeave={() => setHoveredPriority(null)}
                  onClick={() => onPrioritySelect?.(p)}
                >
                  {/* Glow */}
                  <div
                    className={cn(
                      "absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl transition-all duration-500",
                      isSelected || isHovered ? "opacity-60" : "opacity-20"
                    )}
                    style={{
                      width: isSelected ? "80px" : isHovered ? "60px" : "40px",
                      height: isSelected ? "80px" : isHovered ? "60px" : "40px",
                      backgroundColor: deptColor.light,
                    }}
                  />
                  {/* Marker */}
                  <div
                    className={cn(
                      "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all duration-300",
                      isSelected ? "scale-125" : isHovered ? "scale-110" : ""
                    )}
                    style={{
                      width: isSelected ? "18px" : "12px",
                      height: isSelected ? "18px" : "12px",
                      backgroundColor: deptColor.light,
                      borderColor: isSelected ? "white" : "rgba(255,255,255,0.8)",
                      boxShadow: isSelected
                        ? `0 0 20px ${deptColor.light}, 0 0 40px ${deptColor.light}44`
                        : `0 0 8px ${deptColor.light}44`,
                    }}
                  />
                  {/* Pulsing ring for high urgency */}
                  {p.urgency >= 90 && (
                    <div
                      className="absolute -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full opacity-30"
                      style={{
                        width: "24px",
                        height: "24px",
                        backgroundColor: deptColor.light,
                      }}
                    />
                  )}
                  {/* Label */}
                  {(isSelected || isHovered) && (
                    <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2">
                      <div className="whitespace-nowrap rounded-lg bg-slate-900/95 border border-white/10 px-3 py-1.5 shadow-xl backdrop-blur-sm">
                        <div className="text-[11px] font-semibold text-white">{p.village}</div>
                        <div className="text-[9px] text-white/60">{p.issue.slice(0, 40)}...</div>
                        <div className="mt-0.5 flex items-center gap-2 text-[9px]">
                          <span className="text-white/70">Urgency: {p.urgency}%</span>
                          <span className={deptColor.text}>{p.department}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Ward boundary overlay lines */}
            {activeLayers.wardBoundary && (
              <svg className="absolute inset-0 h-full w-full opacity-[0.12]" viewBox="0 0 800 480">
                {[
                  { d: "M180,100 L200,280", color: "#6366f1" },
                  { d: "M320,70 L340,300", color: "#6366f1" },
                  { d: "M480,100 L490,320", color: "#6366f1" },
                  { d: "M200,280 L540,300", color: "#6366f1" },
                ].map((line, i) => (
                  <path
                    key={i}
                    d={line.d}
                    stroke={line.color}
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    fill="none"
                    opacity={0.5}
                  />
                ))}
              </svg>
            )}
          </div>

          {/* Top-left: Filter Chips */}
          <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
            {filterChips.map((chip) => (
              <button
                key={chip.id}
                onClick={() => setActiveFilter(activeFilter === chip.id ? null : chip.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-medium shadow-sm backdrop-blur-sm transition-all",
                  activeFilter === chip.id
                    ? "border-transparent bg-white text-slate-900 shadow-md"
                    : "border-white/20 bg-slate-900/60 text-white/80 hover:bg-slate-800/80 hover:text-white"
                )}
                style={activeFilter === chip.id ? { backgroundColor: chip.color, color: "white" } : {}}
              >
                <span
                  className="size-1.5 rounded-full"
                  style={{ backgroundColor: chip.color }}
                />
                {chip.label}
              </button>
            ))}
          </div>

          {/* Top-right: Layer Toggles */}
          <div className="absolute right-3 top-3 z-10 flex flex-col gap-1.5">
            {[
              { key: "satellite" as const, label: "Satellite" },
              { key: "terrain" as const, label: "Terrain" },
              { key: "digitalTwin" as const, label: "Digital Twin" },
              { key: "wardBoundary" as const, label: "Wards" },
              { key: "villageBoundary" as const, label: "Villages" },
            ].map((layer) => (
              <button
                key={layer.key}
                onClick={() => toggleLayer(layer.key)}
                className={cn(
                  "rounded-lg border px-2.5 py-1 text-[9px] font-medium shadow-sm backdrop-blur-sm transition-all",
                  activeLayers[layer.key]
                    ? "border-primary/40 bg-primary/80 text-white"
                    : "border-white/20 bg-slate-900/60 text-white/60 hover:bg-slate-800/80"
                )}
              >
                {layer.label}
              </button>
            ))}
          </div>

          {/* Bottom-left: Legend */}
          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/80 px-3.5 py-2 shadow-lg backdrop-blur-sm">
            <span className="text-[10px] font-medium text-white/80">Legend</span>
            {["Critical", "High", "Medium"].map((level, i) => (
              <div key={level} className="flex items-center gap-1.5">
                <div
                  className="size-2 rounded-full"
                  style={{
                    backgroundColor: i === 0 ? "#dc2626" : i === 1 ? "#f97316" : "#eab308",
                  }}
                />
                <span className="text-[9px] text-white/60">{level}</span>
              </div>
            ))}
          </div>

          {/* Bottom-right: Hotspot legend */}
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900/80 px-3 py-1.5 shadow-lg backdrop-blur-sm">
            <span className="size-1.5 animate-pulse rounded-full bg-red-400" />
            <span className="text-[9px] text-white/60">{filteredPriorities.length} active hotspots</span>
          </div>
        </motion.div>

        {/* ═══ RIGHT: AI Priority Engine (30%) ═══ */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="w-[340px] shrink-0 overflow-hidden rounded-2xl border border-border/60 bg-card"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <Zap className="size-4 text-purple-500" />
              <span className="text-sm font-bold text-foreground">AI Priority Engine</span>
            </div>
            <span className="rounded-full bg-purple-50 dark:bg-purple-500/10 px-2 py-0.5 text-[10px] font-medium text-purple-600 dark:text-purple-400">
              Live
            </span>
          </div>

          {/* Priority Cards */}
          <div className="space-y-2 overflow-y-auto p-3" style={{ maxHeight: "430px" }}>
            {filteredPriorities.map((p, i) => {
              const deptColor = getDeptColor(p.department);
              const Icon = getDeptIcon(p.department);
              const isSelected = selectedPriority?.rank === p.rank;

              return (
                <motion.div
                  key={p.rank}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  onClick={() => onPrioritySelect?.(p)}
                  onMouseEnter={() => setHoveredPriority(p.village)}
                  onMouseLeave={() => setHoveredPriority(null)}
                  className={cn(
                    "group cursor-pointer rounded-xl border p-3.5 transition-all duration-200 hover:shadow-md",
                    isSelected
                      ? "border-primary/30 bg-primary/[0.03] shadow-sm"
                      : "border-border/60 bg-card hover:border-border hover:bg-muted/20"
                  )}
                >
                  {/* Priority Rank + Department Icon */}
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={cn(
                          "flex size-8 items-center justify-center rounded-lg text-xs font-bold",
                          deptColor.bg,
                          deptColor.text
                        )}
                      >
                        <Icon className="size-4" />
                      </div>
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.5 text-[9px] font-bold",
                          p.urgency >= 90
                            ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                            : p.urgency >= 80
                              ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                              : "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                        )}
                      >
                        #{p.rank}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <span className={cn("font-medium", deptColor.text)}>{p.department}</span>
                        <span>·</span>
                        <span>{p.ward}</span>
                        <span>·</span>
                        <span>{p.village}</span>
                      </div>
                      <h4 className="mt-1 text-xs font-semibold text-foreground leading-snug line-clamp-2">
                        {p.issue}
                      </h4>

                      {/* Stats row */}
                      <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
                        <div className="flex items-center gap-1">
                          <Users className="size-3 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">
                            {p.population.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <IndianRupee className="size-3 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">{p.budget}</span>
                        </div>
                      </div>

                      {/* Score bars */}
                      <div className="mt-2 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-12 text-[9px] text-muted-foreground">Urgency</span>
                          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${p.urgency}%`,
                                backgroundColor:
                                  p.urgency >= 90
                                    ? "#dc2626"
                                    : p.urgency >= 80
                                      ? "#f97316"
                                      : "#eab308",
                              }}
                            />
                          </div>
                          <span className="w-6 text-right text-[9px] font-medium text-foreground">
                            {p.urgency}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-12 text-[9px] text-muted-foreground">Need</span>
                          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${p.needScore}%`, backgroundColor: deptColor.light }}
                            />
                          </div>
                          <span className="w-6 text-right text-[9px] font-medium text-foreground">
                            {p.needScore}%
                          </span>
                        </div>
                      </div>

                      {/* AI Confidence */}
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <div
                            className={cn(
                              "rounded-full px-1.5 py-0.5 text-[9px] font-medium",
                              deptColor.bg,
                              deptColor.text
                            )}
                          >
                            AI {p.confidence}%
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="size-3 text-emerald-500" />
                          <span className="text-[9px] text-emerald-600 dark:text-emerald-400">
                            Impact {p.impactScore}%
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className={cn(
                            "flex-1 rounded-lg border py-1.5 text-[9px] font-semibold transition-colors",
                            deptColor.border,
                            deptColor.text,
                            "hover:bg-muted"
                          )}
                        >
                          Approve
                        </button>
                        <button className="flex-1 rounded-lg border border-border py-1.5 text-[9px] font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                          Simulate
                        </button>
                        <button className="flex items-center justify-center rounded-lg border border-border p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                          <Eye className="size-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="border-t border-border/60 px-4 py-2.5 text-center">
            <button
              onClick={() => router.push("/mp/priority-engine")}
              className="flex items-center justify-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              View All Priorities
              <ArrowRight className="size-3" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
