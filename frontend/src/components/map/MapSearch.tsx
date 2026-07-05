"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search, MapPin, School, Building2, Folder, X } from "lucide-react";
import type { DigitalTwinComplaint, SearchResult } from "@/types/digital-twin";
import { mockOverlayPoints } from "@/data/mock-complaints";

interface MapSearchProps {
  complaints: DigitalTwinComplaint[];
  onResultSelect: (result: SearchResult) => void;
}

const typeIcons: Record<SearchResult["type"], React.ElementType> = {
  complaint: MapPin,
  village: MapPin,
  ward: MapPin,
  school: School,
  hospital: Building2,
  project: Folder,
};

export default function MapSearch({ complaints, onResultSelect }: MapSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const items: SearchResult[] = [];

    complaints.forEach((c) => {
      if (c.id.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) || c.village.toLowerCase().includes(q) || c.ward.toLowerCase().includes(q)) {
        items.push({ id: c.id, label: `${c.id} — ${c.title}`, type: "complaint", latitude: c.latitude, longitude: c.longitude, zoom: 16 });
      }
    });

    mockOverlayPoints.schools.forEach((s) => {
      if (s.name.toLowerCase().includes(q)) {
        items.push({ id: `school-${s.name}`, label: s.name, type: "school", latitude: s.lat, longitude: s.lng, zoom: 16 });
      }
    });

    mockOverlayPoints.hospitals.forEach((h) => {
      if (h.name.toLowerCase().includes(q)) {
        items.push({ id: `hospital-${h.name}`, label: h.name, type: "hospital", latitude: h.lat, longitude: h.lng, zoom: 16 });
      }
    });

    mockOverlayPoints.projects.forEach((p) => {
      if (p.name.toLowerCase().includes(q)) {
        items.push({ id: `project-${p.name}`, label: p.name, type: "project", latitude: p.lat, longitude: p.lng, zoom: 16 });
      }
    });

    const uniqueVillages = [...new Set(complaints.map((c) => c.village))];
    uniqueVillages.forEach((v) => {
      if (v.toLowerCase().includes(q)) {
        const match = complaints.find((c) => c.village === v);
        if (match) {
          items.push({ id: `village-${v}`, label: v, type: "village", latitude: match.latitude, longitude: match.longitude, zoom: 14 });
        }
      }
    });

    const uniqueWards = [...new Set(complaints.map((c) => c.ward))];
    uniqueWards.forEach((w) => {
      if (w.toLowerCase().includes(q)) {
        const match = complaints.find((c) => c.ward === w);
        if (match) {
          items.push({ id: `ward-${w}`, label: w, type: "ward", latitude: match.latitude, longitude: match.longitude, zoom: 14 });
        }
      }
    });

    return items.slice(0, 10);
  }, [query, complaints]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className="absolute left-14 top-4 z-20 w-80">
      <div className="relative">
        <div className="flex items-center rounded-xl border border-border bg-card/95 shadow-lg backdrop-blur-sm">
          <Search className="ml-3 size-4 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search complaints, villages, wards..."
            className="flex-1 bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setIsOpen(false);
                inputRef.current?.focus();
              }}
              className="mr-2 rounded p-1 text-muted-foreground hover:bg-muted transition-colors"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {isOpen && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 mt-2 max-h-72 overflow-y-auto rounded-xl border border-border bg-card shadow-xl">
            {results.map((r) => {
              const Icon = typeIcons[r.type];
              return (
                <button
                  key={r.id}
                  onClick={() => {
                    onResultSelect(r);
                    setQuery(r.label);
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-muted/50 transition-colors"
                >
                  <Icon className="size-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-foreground">{r.label}</p>
                    <p className="text-xs capitalize text-muted-foreground">{r.type}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
