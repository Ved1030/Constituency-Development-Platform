"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";
import type L from "leaflet";
import type { DigitalTwinComplaint } from "@/types/digital-twin";
import { mockComplaints } from "@/data/mock-complaints";
import ConstituencyMap from "@/components/map/ConstituencyMap";

export default function DashboardMapPreview() {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  const handleMapReady = useCallback((map: L.Map) => {
    mapRef.current = map;
  }, []);

  const handleClick = useCallback(() => {
    router.push("/mp/constituency-twin");
  }, [router]);

  const handleMarkerClick = useCallback(
    (complaint: DigitalTwinComplaint) => {
      router.push(`/mp/constituency-twin?complaint=${complaint.id}`);
    },
    [router]
  );

  return (
    <div
      className="relative h-80 cursor-pointer overflow-hidden rounded-xl transition-shadow duration-200"
      style={{
        transform: hovered ? "scale(1.01)" : "scale(1)",
        boxShadow: hovered
          ? "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
          : "0 1px 3px rgb(0 0 0 / 0.1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      <ConstituencyMap
        complaints={mockComplaints}
        selectedComplaint={null}
        onSelectComplaint={handleMarkerClick}
        activeOverlays={[]}
        onMapReady={handleMapReady}
        previewMode
      />

      {/* Hover overlay */}
      <div
        className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 transition-all duration-200"
        style={{
          backgroundColor: hovered ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0)",
          pointerEvents: "none",
        }}
      >
        <div
          className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-foreground shadow-xl transition-all duration-200"
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(8px)",
          }}
        >
          <ExternalLink className="size-4 text-emerald-600" />
          Open Interactive Digital Twin
        </div>
      </div>
    </div>
  );
}
