"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Video,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  BadgeCheck,
  FileImage,
  FileVideo,
  Shield,
  AlertTriangle,
  ZoomIn,
  Play,
  X,
} from "lucide-react";
import type { MediaItem, MediaSource } from "@/types/digital-twin";
import { cn } from "@/lib/utils";

interface MediaGalleryProps {
  media: MediaItem[];
}

type TabKey = "all" | MediaSource;

interface TabDef {
  key: TabKey;
  label: string;
  source?: MediaSource;
}

const TABS: TabDef[] = [
  { key: "all", label: "All" },
  { key: "citizen", label: "Citizen Photos", source: "citizen" },
  { key: "officer", label: "Officer Photos", source: "officer" },
  { key: "drone", label: "Drone Photos", source: "drone" },
  { key: "satellite", label: "Satellite", source: "satellite" },
];

const SOURCE_GRADIENTS: Record<MediaSource, string> = {
  citizen: "from-blue-500/20 to-purple-500/20",
  officer: "from-green-500/20 to-teal-500/20",
  drone: "from-orange-500/20 to-red-500/20",
  satellite: "from-slate-500/20 to-gray-500/20",
};

const VIDEO_GRADIENT = "from-gray-800/80 to-gray-900/80";

const TAB_ICONS: Record<TabKey, typeof Camera> = {
  all: Camera,
  citizen: Camera,
  officer: Shield,
  drone: Camera,
  satellite: Camera,
};

function formatTimestamp(ts: string): string {
  try {
    const d = new Date(ts);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return ts;
  }
}

function formatGPS(lat: number, lng: number): string {
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

function formatFileSize(bytes?: string): string {
  if (!bytes) return "\u2014";
  const n = Number(bytes);
  if (isNaN(n)) return bytes;
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

const QUALITY_LABEL = (score: number) => {
  if (score >= 70) return { label: "High Quality", color: "text-emerald-500", bg: "bg-emerald-500" };
  if (score >= 40) return { label: "Medium Quality", color: "text-amber-500", bg: "bg-amber-500" };
  return { label: "Low Quality", color: "text-red-500", bg: "bg-red-500" };
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

function SourceIcon({ source, type }: { source: MediaSource; type: "photo" | "video" }) {
  if (type === "video") {
    return (
      <div className="relative flex items-center justify-center">
        <div className="rounded-full bg-black/40 p-3 backdrop-blur-[2px]">
          <Video className="size-5 text-white" />
        </div>
      </div>
    );
  }
  return <Camera className="size-7 text-white/70" />;
}

function SourceLabel({ source }: { source: MediaSource }) {
  const labels: Record<MediaSource, string> = {
    citizen: "Citizen",
    officer: "Officer",
    drone: "Drone",
    satellite: "Satellite",
  };
  return <span className="text-xs font-medium">{labels[source]}</span>;
}

export default function MediaGallery({ media }: MediaGalleryProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  const filtered = useMemo(() => {
    if (activeTab === "all") return media;
    return media.filter((m) => m.source === activeTab);
  }, [media, activeTab]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: media.length };
    media.forEach((m) => {
      map[m.source] = (map[m.source] || 0) + 1;
    });
    return map;
  }, [media]);

  return (
    <div>
      {/* ── Category Tabs ── */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {TABS.map((tab) => {
          const TabIcon = TAB_ICONS[tab.key];
          const count = counts[tab.key] ?? 0;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              <TabIcon className="size-3.5 shrink-0" />
              {tab.label}
              <span
                className={cn(
                  "inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none",
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-background text-muted-foreground"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Media Grid ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-muted p-4">
            <Camera className="size-8 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">No media found</p>
          <p className="mt-1 text-xs text-muted-foreground/60">
            {activeTab === "all"
              ? "This complaint has no evidence media attached."
              : `No ${TABS.find((t) => t.key === activeTab)?.label?.toLowerCase() ?? "media"} available.`}
          </p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 gap-3"
        >
          {filtered.map((item) => (
            <motion.button
              key={item.id}
              variants={cardVariants}
              onClick={() => setSelectedItem(item)}
              className="group relative rounded-xl border border-border overflow-hidden text-left hover:shadow-md transition-shadow bg-card"
            >
              {/* ── Thumbnail ── */}
              <div
                className={cn(
                  "relative aspect-video flex items-center justify-center bg-gradient-to-br",
                  item.type === "video" ? VIDEO_GRADIENT : SOURCE_GRADIENTS[item.source]
                )}
              >
                <SourceIcon source={item.source} type={item.type} />

                {/* Zoom hint on hover */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                  <div className="rounded-full bg-black/0 group-hover:bg-black/40 p-1.5 transition-all group-hover:scale-100 scale-0">
                    <ZoomIn className="size-4 text-white" />
                  </div>
                </div>

                {/* Video play overlay */}
                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-full bg-black/50 p-2.5 backdrop-blur-sm group-hover:bg-black/70 group-hover:scale-110 transition-all">
                      <Play className="size-5 text-white fill-white" />
                    </div>
                  </div>
                )}

                {/* Verified chip */}
                {item.verified && (
                  <div className="absolute right-2 top-2 rounded-full bg-emerald-500/80 backdrop-blur-sm p-0.5">
                    <BadgeCheck className="size-3.5 text-white" />
                  </div>
                )}
              </div>

              {/* ── Details ── */}
              <div className="space-y-1.5 p-2.5">
                <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {item.caption}
                </p>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {item.verified ? (
                    <CheckCircle2 className="size-3 shrink-0 text-emerald-500" />
                  ) : (
                    <XCircle className="size-3 shrink-0 text-red-500" />
                  )}
                  <SourceLabel source={item.source} />
                  <span className="text-[10px] text-muted-foreground/40">\u00B7</span>
                  <span
                    className={cn(
                      "text-[10px] font-semibold",
                      item.aiQualityScore >= 70
                        ? "text-emerald-500"
                        : item.aiQualityScore >= 40
                          ? "text-amber-500"
                          : "text-red-500"
                    )}
                  >
                    {item.aiQualityScore}%
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
                  <MapPin className="size-2.5 shrink-0" />
                  <span className="truncate">{formatGPS(item.gps.lat, item.gps.lng)}</span>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
                  <Clock className="size-2.5 shrink-0" />
                  <span>{formatTimestamp(item.timestamp)}</span>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* ── Media Modal ── */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            key="media-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              key="media-modal-content"
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl"
            >
              {/* Close */}
              <div className="sticky top-0 z-10 flex justify-end p-2">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  aria-label="Close media viewer"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Large preview */}
              <div className="px-6 pb-4">
                <div
                  className={cn(
                    "relative aspect-video rounded-xl flex items-center justify-center bg-gradient-to-br",
                    selectedItem.type === "video" ? VIDEO_GRADIENT : SOURCE_GRADIENTS[selectedItem.source]
                  )}
                >
                  {selectedItem.type === "video" ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="rounded-full bg-black/50 p-4 backdrop-blur-sm">
                        <Play className="size-8 text-white fill-white" />
                      </div>
                      <span className="text-xs text-white/60">Video Preview</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <FileImage className="size-10 text-white/60" />
                      <span className="text-xs text-white/60">Image Preview</span>
                    </div>
                  )}

                  {selectedItem.verified && (
                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-emerald-500/80 backdrop-blur-sm px-2 py-0.5">
                      <BadgeCheck className="size-3.5 text-white" />
                      <span className="text-[10px] font-semibold text-white">Verified</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Caption */}
              <div className="px-6 pb-4">
                <p className="text-sm leading-relaxed text-foreground">{selectedItem.caption}</p>
              </div>

              {/* Metadata */}
              <div className="space-y-4 px-6 pb-6">
                {/* Tags row */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-2.5 py-1.5">
                    {selectedItem.verified ? (
                      <>
                        <CheckCircle2 className="size-4 text-emerald-500" />
                        <span className="text-xs font-medium text-emerald-600">Verified Evidence</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="size-4 text-red-500" />
                        <span className="text-xs font-medium text-red-600">Unverified</span>
                      </>
                    )}
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-2.5 py-1.5">
                    {selectedItem.type === "video" ? (
                      <FileVideo className="size-4 text-muted-foreground" />
                    ) : (
                      <FileImage className="size-4 text-muted-foreground" />
                    )}
                    <span className="text-xs font-medium capitalize text-muted-foreground">
                      {selectedItem.type}
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-2.5 py-1.5">
                    <Shield className="size-4 text-muted-foreground" />
                    <SourceLabel source={selectedItem.source} />
                  </div>
                  {selectedItem.aiQualityScore < 40 && (
                    <div className="inline-flex items-center gap-1 rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-1.5">
                      <AlertTriangle className="size-3.5 text-red-500" />
                      <span className="text-[10px] font-medium text-red-600">Low Quality</span>
                    </div>
                  )}
                </div>

                {/* AI Quality Score bar */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Shield className="size-3.5 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground">AI Quality Score</span>
                    </div>
                    <span
                      className={cn(
                        "text-xs font-bold",
                        QUALITY_LABEL(selectedItem.aiQualityScore).color
                      )}
                    >
                      {selectedItem.aiQualityScore}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedItem.aiQualityScore}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={cn(
                        "h-full rounded-full",
                        QUALITY_LABEL(selectedItem.aiQualityScore).bg
                      )}
                    />
                  </div>
                </div>

                {/* GPS & Timestamp */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border bg-muted/30 p-2.5">
                    <div className="mb-1 flex items-center gap-1.5">
                      <MapPin className="size-3 text-muted-foreground" />
                      <span className="text-[10px] font-medium text-muted-foreground">Coordinates</span>
                    </div>
                    <p className="font-mono text-xs text-foreground">
                      {formatGPS(selectedItem.gps.lat, selectedItem.gps.lng)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/30 p-2.5">
                    <div className="mb-1 flex items-center gap-1.5">
                      <Clock className="size-3 text-muted-foreground" />
                      <span className="text-[10px] font-medium text-muted-foreground">Captured At</span>
                    </div>
                    <p className="text-xs font-medium text-foreground">
                      {formatTimestamp(selectedItem.timestamp)}
                    </p>
                  </div>
                </div>

                {/* EXIF / Metadata table */}
                {selectedItem.metadata && Object.keys(selectedItem.metadata).length > 0 && (
                  <div>
                    <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Capture Details
                    </h4>
                    <div className="overflow-hidden rounded-xl border border-border">
                      <table className="w-full text-xs">
                        <tbody>
                          {(Object.entries(selectedItem.metadata) as [string, string][]).map(([key, value], idx) => (
                            <tr
                              key={key}
                              className={cn(
                                "border-b border-border/50 last:border-0",
                                idx % 2 === 0 ? "bg-muted/20" : "bg-transparent"
                              )}
                            >
                              <td className="px-3 py-2 font-medium text-muted-foreground capitalize">
                                {key.replace(/_/g, " ")}
                              </td>
                              <td className="px-3 py-2 text-right font-mono text-foreground">
                                {key === "file_size" ? formatFileSize(value) : value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
