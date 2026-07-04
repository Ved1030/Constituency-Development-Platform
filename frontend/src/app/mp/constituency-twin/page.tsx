"use client";

import { motion } from "framer-motion";
import { Map, Layers, Filter, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { villages } from "@/data/mock-mp";
import { useTranslation } from "@/hooks/use-translation";

const mapLayers = [
  { name: "Roads", active: true, color: "#3b82f6" },
  { name: "Schools", active: true, color: "#f59e0b" },
  { name: "Hospitals", active: true, color: "#10b981" },
  { name: "Water Supply", active: false, color: "#06b6d4" },
  { name: "Electricity", active: false, color: "#8b5cf6" },
  { name: "Population Density", active: true, color: "#ec4899" },
  { name: "Complaint Density", active: true, color: "#ef4444" },
  { name: "Projects", active: false, color: "#f97316" },
];

export default function ConstituencyTwinPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2">
          <Map className="size-5 text-emerald-600" />
          <h1 className="text-2xl font-bold text-foreground">{t("mp.twin.title")}</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{t("mp.twin.subtitle")}</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        {/* Layer Controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl border border-border bg-card p-5 xl:col-span-1"
        >
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Layers className="size-4 text-emerald-600" /> {t("mp.twin.mapLayers")}
          </h3>
          <div className="space-y-2">
            {mapLayers.map((layer) => (
              <label key={layer.name} className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-muted transition-colors">
                <input
                  type="checkbox"
                  defaultChecked={layer.active}
                  className="size-4 rounded border-border bg-background accent-emerald-500"
                />
                <div className="size-3 rounded-full" style={{ backgroundColor: layer.color }} />
                <span className="text-sm text-muted-foreground">{layer.name}</span>
              </label>
            ))}
          </div>

          <div className="mt-4 border-t border-border pt-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Filter className="size-4 text-primary" /> {t("mp.twin.filters")}
            </h3>
            <div className="space-y-2">
              <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none">
                <option>{t("mp.twin.allVillages")}</option>
                {villages.map((v) => (
                  <option key={v.id}>{v.name}</option>
                ))}
              </select>
              <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none">
                <option>{t("mp.twin.allWards")}</option>
                {Array.from({ length: 12 }, (_, i) => `Ward ${i + 1}`).map((w) => (
                  <option key={w}>{w}</option>
                ))}
              </select>
              <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none">
                <option>{t("mp.twin.allDepartments")}</option>
                <option>Roads</option>
                <option>Water</option>
                <option>Healthcare</option>
                <option>Education</option>
                <option>Sanitation</option>
              </select>
              <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none">
                <option>{t("mp.twin.allSectors")}</option>
                <option>Urban</option>
                <option>Rural</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Map Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-5 xl:col-span-3 relative min-h-[600px]"
        >
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            {/* Grid background */}
            <svg className="absolute inset-0 h-full w-full opacity-5" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid-twin" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-twin)" />
            </svg>

            {/* Constituency outline (stylized) */}
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 600">
              <path
                d="M200,100 Q350,80 500,120 Q620,160 680,300 Q700,420 600,500 Q450,540 300,480 Q180,420 150,300 Q140,200 200,100 Z"
                fill="rgba(16,185,129,0.05)"
                stroke="rgba(16,185,129,0.3)"
                strokeWidth="2"
                strokeDasharray="8 4"
              />
            </svg>

            {/* Village markers */}
            {villages.map((v, i) => {
              const x = 15 + ((v.lng - 80.26) * 12000) % 70;
              const y = 15 + ((v.lat - 13.07) * 8000) % 65;
              const intensity = v.complaints / 634;
              return (
                <div
                  key={v.id}
                  className="absolute group cursor-pointer"
                  style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
                >
                  <div
                    className="rounded-full blur-xl opacity-40"
                    style={{
                      width: `${40 + intensity * 60}px`,
                      height: `${40 + intensity * 60}px`,
                      backgroundColor: intensity > 0.7 ? "#ef4444" : intensity > 0.4 ? "#f59e0b" : "#10b981",
                    }}
                  />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className="size-3 rounded-full border-2 border-foreground shadow-lg"
                      style={{ backgroundColor: intensity > 0.7 ? "#ef4444" : intensity > 0.4 ? "#f59e0b" : "#10b981" }}
                    />
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                    <div className="rounded-lg bg-card border border-border px-3 py-2 shadow-xl whitespace-nowrap">
                      <div className="text-xs font-semibold text-foreground">{v.name}</div>
                      <div className="text-[10px] text-muted-foreground">Pop: {v.population.toLocaleString("en-IN")} | Complaints: {v.complaints}</div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Map controls */}
            <div className="absolute right-4 top-4 flex flex-col gap-2">
              <button className="flex size-8 items-center justify-center rounded-lg bg-white/90 border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <ZoomIn className="size-4" />
              </button>
              <button className="flex size-8 items-center justify-center rounded-lg bg-white/90 border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <ZoomOut className="size-4" />
              </button>
              <button className="flex size-8 items-center justify-center rounded-lg bg-white/90 border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <Maximize2 className="size-4" />
              </button>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 flex items-center gap-4 rounded-lg bg-white/90 border border-border px-4 py-2.5 backdrop-blur-sm">
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-red-500" />
                <span className="text-[10px] text-muted-foreground">{t("mp.twin.highComplaint")}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-amber-500" />
                <span className="text-[10px] text-muted-foreground">{t("mp.twin.medium")}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-muted-foreground">{t("mp.twin.low")}</span>
              </div>
              <div className="h-3 w-px bg-border" />
              <span className="text-[10px] text-muted-foreground">{t("mp.twin.villageCount")}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
