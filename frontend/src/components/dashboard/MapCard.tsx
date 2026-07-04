"use client";

import { MapPin } from "lucide-react";
import { DashboardCard } from "./DashboardCard";

interface MapCardProps {
  title?: string;
  className?: string;
}

export function MapCard({ title = "Issue Density Map", className }: MapCardProps) {
  return (
    <DashboardCard title={title} icon={MapPin} className={className}>
      <div className="relative h-72 overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50">
        {/* Stylized map placeholder with dots */}
        <div className="absolute inset-0">
          {/* Grid lines */}
          <svg className="absolute inset-0 h-full w-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Heat spots */}
          <div className="absolute left-[20%] top-[30%] size-24 rounded-full bg-red-400/20 blur-xl" />
          <div className="absolute left-[50%] top-[45%] size-32 rounded-full bg-orange-400/20 blur-xl" />
          <div className="absolute left-[70%] top-[25%] size-20 rounded-full bg-amber-400/15 blur-xl" />
          <div className="absolute left-[35%] top-[65%] size-16 rounded-full bg-blue-400/15 blur-xl" />

          {/* Location pins */}
          {[
            { x: "25%", y: "35%", label: "Gandhi Nagar", count: 342 },
            { x: "55%", y: "50%", label: "Krishna Nagar", count: 278 },
            { x: "72%", y: "30%", label: "Velachery", count: 634 },
            { x: "40%", y: "70%", label: "T Nagar", count: 512 },
            { x: "60%", y: "65%", label: "Sholinganallur", count: 489 },
          ].map((pin, i) => (
            <div
              key={i}
              className="absolute flex flex-col items-center"
              style={{ left: pin.x, top: pin.y, transform: "translate(-50%, -100%)" }}
            >
              <div className="flex items-center gap-1 rounded-lg bg-white/90 px-2 py-1 shadow-md backdrop-blur-sm">
                <MapPin className="size-3 text-primary" />
                <span className="text-[10px] font-semibold text-foreground">{pin.count}</span>
              </div>
              <div className="size-2 -mt-0.5 rotate-45 bg-white/90 shadow-md" />
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 flex items-center gap-3 rounded-lg bg-white/90 px-3 py-2 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-red-500" />
            <span className="text-[10px] text-muted-foreground">Critical</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-orange-500" />
            <span className="text-[10px] text-muted-foreground">High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-amber-500" />
            <span className="text-[10px] text-muted-foreground">Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-blue-500" />
            <span className="text-[10px] text-muted-foreground">Low</span>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}
