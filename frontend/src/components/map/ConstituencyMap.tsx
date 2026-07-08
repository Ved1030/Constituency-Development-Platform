"use client";

import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { DigitalTwinComplaint, OverlayLayer } from "@/types/digital-twin";
import { PRIORITY_COLORS, PRIORITY_SIZES, CONSTITUENCY_CENTER, CONSTITUENCY_ZOOM } from "@/types/digital-twin";
import { cn } from "@/lib/utils";

interface ConstituencyMapProps {
  complaints: DigitalTwinComplaint[];
  selectedComplaint: DigitalTwinComplaint | null;
  onSelectComplaint: (complaint: DigitalTwinComplaint) => void;
  activeOverlays: OverlayLayer[];
  flyToLocation?: { lat: number; lng: number; zoom: number } | null;
  onMapReady?: (map: L.Map) => void;
  previewMode?: boolean;
  center?: { lat: number; lng: number };
  zoom?: number;
  boundaryFile?: string;
}

const RESOLVED_COLOR = "#3b82f6";
const CLUSTER_COLORS = ["#dc2626", "#f97316", "#eab308", "#22c55e", "#3b82f6"];

function getMarkerColor(c: DigitalTwinComplaint): string {
  if (c.status === "Resolved" || c.status === "Closed") return RESOLVED_COLOR;
  return PRIORITY_COLORS[c.priority];
}

function getMarkerSize(c: DigitalTwinComplaint, isSelected: boolean): number {
  const base = c.status === "Resolved" || c.status === "Closed" ? 10 : PRIORITY_SIZES[c.priority];
  return isSelected ? base + 8 : base;
}

interface ClusterData {
  lat: number;
  lng: number;
  count: number;
  complaints: DigitalTwinComplaint[];
}

function computeClusters(complaints: DigitalTwinComplaint[], zoom: number): (ClusterData | DigitalTwinComplaint)[] {
  if (zoom >= 16 || complaints.length <= 1) return complaints;
  const gridSize = Math.max(0.002, 0.04 / Math.pow(2, zoom - 10));
  const grid: Map<string, DigitalTwinComplaint[]> = new Map();
  complaints.forEach((c) => {
    const key = `${Math.floor(c.latitude / gridSize)},${Math.floor(c.longitude / gridSize)}`;
    const bucket = grid.get(key) || [];
    bucket.push(c);
    grid.set(key, bucket);
  });
  const result: (ClusterData | DigitalTwinComplaint)[] = [];
  grid.forEach((bucket) => {
    if (bucket.length === 1) {
      result.push(bucket[0]);
    } else {
      const avgLat = bucket.reduce((s, c) => s + c.latitude, 0) / bucket.length;
      const avgLng = bucket.reduce((s, c) => s + c.longitude, 0) / bucket.length;
      result.push({ lat: avgLat, lng: avgLng, count: bucket.length, complaints: bucket });
    }
  });
  return result;
}

export default function ConstituencyMap({
  complaints,
  selectedComplaint,
  onSelectComplaint,
  activeOverlays,
  flyToLocation,
  onMapReady,
  previewMode = false,
  center = CONSTITUENCY_CENTER,
  zoom = CONSTITUENCY_ZOOM,
  boundaryFile = "/maps/north-chennai.geojson",
}: ConstituencyMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const overlayLayersRef = useRef<Record<string, L.LayerGroup>>({});
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const satelliteLayerRef = useRef<L.TileLayer | null>(null);
  const osmLayerRef = useRef<L.TileLayer | null>(null);
  const [geoLoaded, setGeoLoaded] = useState(false);
  const [geoError, setGeoError] = useState(false);
  const [satelliteMode, setSatelliteMode] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const boundaryCoordsRef = useRef<[number, number][] | null>(null);

  const clusteredData = useMemo(() => computeClusters(complaints, currentZoom), [complaints, currentZoom]);

  const loadGeoJson = useCallback(async (map: L.Map) => {
    try {
      const res = await fetch(boundaryFile);
      if (!res.ok) throw new Error("GeoJSON not found");
      const data = await res.json();
      const feature = data.features?.[0];
      if (!feature) throw new Error("No features");
      const coords = feature.geometry.coordinates[0] as [number, number][];
      boundaryCoordsRef.current = coords;
      const latLngs = coords.map((c) => L.latLng(c[1], c[0]));
      geoJsonLayerRef.current = L.geoJSON(data, {
        style: {
          color: "#1d4ed8",
          weight: 3,
          opacity: 0.85,
          fillColor: "#3b82f6",
          fillOpacity: 0.08,
        },
      }).addTo(map);
      map.fitBounds(L.latLngBounds(latLngs), { padding: [40, 40] });
      setGeoLoaded(true);
    } catch {
      setGeoError(true);
    }
  }, [boundaryFile]);

  const updateMarkers = useCallback(
    (map: L.Map) => {
      if (!markersLayerRef.current) {
        markersLayerRef.current = L.layerGroup().addTo(map);
      }
      markersLayerRef.current.clearLayers();

      clusteredData.forEach((item) => {
        if ("count" in item) {
          const cluster = item as ClusterData;
          const priorityCounts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
          cluster.complaints.forEach((cc) => {
            if (cc.status !== "Resolved" && cc.status !== "Closed") {
              priorityCounts[cc.priority] = (priorityCounts[cc.priority] || 0) + 1;
            }
          });
          const topPriority = (Object.entries(priorityCounts).find(([, count]) => count > 0)?.[0] || "Medium") as "Critical" | "High" | "Medium" | "Low";
          const clusterColor = cluster.complaints.every((c) => c.status === "Resolved" || c.status === "Closed")
            ? RESOLVED_COLOR : PRIORITY_COLORS[topPriority];

          const html = `
            <div style="
              width:${Math.min(36 + cluster.count * 2, 56)}px;height:${Math.min(36 + cluster.count * 2, 56)}px;
              background:${clusterColor}22;
              border:2px solid ${clusterColor};
              border-radius:50%;
              display:flex;align-items:center;justify-content:center;
              box-shadow:0 0 12px ${clusterColor}44, 0 2px 8px rgba(0,0,0,0.2);
              cursor:pointer;
              transition:transform 0.2s;
            "><span style="font-size:${Math.min(11 + cluster.count, 16)}px;font-weight:700;color:${clusterColor};">${cluster.count}</span></div>`;

          const icon = L.divIcon({ html, className: "", iconSize: [56, 56], iconAnchor: [28, 28] });
          const marker = L.marker([cluster.lat, cluster.lng], { icon });
          if (!previewMode) {
            marker.on("click", (e) => {
              L.DomEvent.stopPropagation(e);
              const currentZ = map.getZoom();
              if (currentZ < 16) {
                map.flyTo([cluster.lat, cluster.lng], Math.min(currentZ + 2, 18), { duration: 0.6 });
              } else {
                onSelectComplaint(cluster.complaints[0]);
              }
            });
            marker.on("mouseover", () => {
              const el = marker.getElement()?.querySelector("div");
              if (el) el.style.transform = "scale(1.15)";
            });
            marker.on("mouseout", () => {
              const el = marker.getElement()?.querySelector("div");
              if (el) el.style.transform = "scale(1)";
            });
          }
          marker.addTo(markersLayerRef.current!);
        } else {
          const c = item as DigitalTwinComplaint;
          const color = getMarkerColor(c);
          const size = getMarkerSize(c, selectedComplaint?.id === c.id);
          const isSel = selectedComplaint?.id === c.id;

          const shadowBlur = isSel ? 20 : 8;
          const shadowColor = isSel ? `${color}cc` : `${color}66`;
          const borderWidth = isSel ? 3 : 2;

          const isCritical = c.priority === "Critical" && c.status !== "Resolved" && c.status !== "Closed";
          const pulseClass = isCritical ? "critical-marker-pulse" : "";

          const html = `
            <div class="${pulseClass}" style="
              width:${size}px;height:${size}px;
              background:${color};
              border-radius:50%;
              border:${borderWidth}px solid ${isSel ? "#fff" : "rgba(255,255,255,0.85)"};
              box-shadow:0 0 ${shadowBlur}px ${shadowColor}, 0 2px 6px rgba(0,0,0,0.3);
              cursor:pointer;
              transition:all 0.2s ease;
            " title="${c.title.replace(/"/g, "&quot;")}"></div>`;

          const icon = L.divIcon({ html, className: "", iconSize: [size + 4, size + 4], iconAnchor: [(size + 4) / 2, (size + 4) / 2] });
          const marker = L.marker([c.latitude, c.longitude], { icon });

          if (!previewMode) {
            marker.bindTooltip(
              `<strong>${c.title}</strong><br/>${c.priority} · ${c.status}<br/>${c.village}, ${c.ward}`,
              { direction: "top", offset: [0, -size / 2 - 6], className: "custom-marker-tooltip" }
            );

            marker.on("click", (e) => {
              L.DomEvent.stopPropagation(e);
              onSelectComplaint(c);
            });
            marker.on("mouseover", () => {
              const el = marker.getElement()?.querySelector("div");
              if (el) {
                el.style.transform = "scale(1.2)";
                el.style.boxShadow = `0 0 ${shadowBlur + 10}px ${shadowColor}, 0 4px 12px rgba(0,0,0,0.4)`;
              }
            });
            marker.on("mouseout", () => {
              const el = marker.getElement()?.querySelector("div");
              if (el) {
                el.style.transform = "scale(1)";
                el.style.boxShadow = `0 0 ${shadowBlur}px ${shadowColor}, 0 2px 6px rgba(0,0,0,0.3)`;
              }
            });
          }
          marker.addTo(markersLayerRef.current!);
        }
      });
    },
    [clusteredData, selectedComplaint, onSelectComplaint]
  );

  const overlayPoints = {
    schools: [
      { name: "T Nagar Primary School", lat: 13.1350, lng: 80.2780 },
      { name: "Ward 5 Government School", lat: 13.1420, lng: 80.2850 },
      { name: "Ramesh Nagar High School", lat: 13.1300, lng: 80.2720 },
      { name: "Gandhi Nagar Middle School", lat: 13.1480, lng: 80.2750 },
      { name: "Sholinganallur Public School", lat: 13.1550, lng: 80.2900 },
      { name: "Velachery Girls School", lat: 13.1250, lng: 80.2830 },
      { name: "Adyar East Higher Secondary", lat: 13.1380, lng: 80.2920 },
      { name: "Marina Ward Primary", lat: 13.1500, lng: 80.2820 },
    ],
    hospitals: [
      { name: "PHC T Nagar", lat: 13.1330, lng: 80.2760 },
      { name: "PHC Adyar East", lat: 13.1395, lng: 80.2910 },
      { name: "Velachery Government Hospital", lat: 13.1240, lng: 80.2810 },
      { name: "Sholinganallur PHC", lat: 13.1570, lng: 80.2930 },
      { name: "Ward 5 Health Center", lat: 13.1440, lng: 80.2870 },
    ],
    projects: [
      { name: "Gandhi Nagar Drainage Overhaul", lat: 13.1465, lng: 80.2740 },
      { name: "School Road Reconstruction", lat: 13.1400, lng: 80.2860 },
      { name: "Solar Street Light Installation", lat: 13.1310, lng: 80.2790 },
      { name: "Velachery Water Tank Upgrade", lat: 13.1235, lng: 80.2825 },
      { name: "T Nagar Park Development", lat: 13.1345, lng: 80.2770 },
      { name: "Adyar Bridge Repair", lat: 13.1370, lng: 80.2905 },
    ],
    roads: [
      { name: "Velachery Main Road", coords: [[80.2800, 13.1200], [80.2850, 13.1250], [80.2900, 13.1300], [80.2950, 13.1350]] as [number, number][] },
      { name: "T Nagar 2nd Avenue", coords: [[80.2750, 13.1300], [80.2780, 13.1350], [80.2810, 13.1400]] as [number, number][] },
      { name: "Gandhi Nagar Main Street", coords: [[80.2700, 13.1400], [80.2750, 13.1450], [80.2800, 13.1500]] as [number, number][] },
      { name: "Adyar Bridge Road", coords: [[80.2850, 13.1350], [80.2900, 13.1380], [80.2950, 13.1400]] as [number, number][] },
      { name: "Marina Coastal Road", coords: [[80.2820, 13.1100], [80.2860, 13.1180], [80.2900, 13.1260], [80.2940, 13.1340]] as [number, number][] },
    ],
  };

  const updateOverlays = useCallback(
    (map: L.Map) => {
      Object.values(overlayLayersRef.current).forEach((lg) => map.removeLayer(lg));
      overlayLayersRef.current = {};

      const addOverlay = (key: string, lg: L.LayerGroup) => {
        lg.addTo(map);
        overlayLayersRef.current[key] = lg;
      };

      if (activeOverlays.includes("schools")) {
        const lg = L.layerGroup();
        overlayPoints.schools.forEach((s) => {
          L.marker([s.lat, s.lng], {
            icon: L.divIcon({
              html: '<div style="font-size:20px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.3))">🏫</div>',
              className: "", iconSize: [24, 24], iconAnchor: [12, 12],
            }),
          }).bindTooltip(s.name, { direction: "top", offset: [0, -10] }).addTo(lg);
        });
        addOverlay("schools", lg);
      }

      if (activeOverlays.includes("hospitals")) {
        const lg = L.layerGroup();
        overlayPoints.hospitals.forEach((h) => {
          L.marker([h.lat, h.lng], {
            icon: L.divIcon({
              html: '<div style="font-size:20px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.3))">🏥</div>',
              className: "", iconSize: [24, 24], iconAnchor: [12, 12],
            }),
          }).bindTooltip(h.name, { direction: "top", offset: [0, -10] }).addTo(lg);
        });
        addOverlay("hospitals", lg);
      }

      if (activeOverlays.includes("projects")) {
        const lg = L.layerGroup();
        overlayPoints.projects.forEach((p) => {
          L.marker([p.lat, p.lng], {
            icon: L.divIcon({
              html: '<div style="font-size:20px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.3))">📋</div>',
              className: "", iconSize: [24, 24], iconAnchor: [12, 12],
            }),
          }).bindTooltip(p.name, { direction: "top", offset: [0, -10] }).addTo(lg);
        });
        addOverlay("projects", lg);
      }

      if (activeOverlays.includes("roads") && overlayPoints.roads) {
        const lg = L.layerGroup();
        overlayPoints.roads.forEach((road) => {
          const polyline = L.polyline(road.coords as [number, number][], {
            color: "#3b82f6", weight: 3, opacity: 0.7,
          }).bindTooltip(road.name, { direction: "top" });
          polyline.addTo(lg);
        });
        addOverlay("roads", lg);
      }

      if (activeOverlays.includes("waterSupply")) {
        const lg = L.layerGroup();
        complaints.forEach((c) => {
          if (c.department === "Water Supply") {
            L.circle([c.latitude, c.longitude], {
              radius: 600, color: "#06b6d4", fillColor: "#06b6d4", fillOpacity: 0.08, weight: 1,
            }).addTo(lg);
          }
        });
        addOverlay("waterSupply", lg);
      }

      if (activeOverlays.includes("electricity")) {
        const lg = L.layerGroup();
        complaints.forEach((c) => {
          if (c.department === "Electricity") {
            L.circle([c.latitude, c.longitude], {
              radius: 600, color: "#8b5cf6", fillColor: "#8b5cf6", fillOpacity: 0.08, weight: 1,
            }).addTo(lg);
          }
        });
        addOverlay("electricity", lg);
      }

      if (activeOverlays.includes("drainage")) {
        const lg = L.layerGroup();
        complaints.forEach((c) => {
          if (c.department === "Sanitation") {
            L.circle([c.latitude, c.longitude], {
              radius: 600, color: "#64748b", fillColor: "#64748b", fillOpacity: 0.08, weight: 1,
            }).addTo(lg);
          }
        });
        addOverlay("drainage", lg);
      }

      if (activeOverlays.includes("populationDensity")) {
        const lg = L.layerGroup();
        complaints.forEach((c) => {
          const r = Math.min(c.affectedPopulation / 10, 2000);
          L.circle([c.latitude, c.longitude], {
            radius: r, color: "#ec4899", fillColor: "#ec4899", fillOpacity: 0.05, weight: 0,
          }).addTo(lg);
        });
        addOverlay("populationDensity", lg);
      }

      if (activeOverlays.includes("complaintDensity")) {
        const lg = L.layerGroup();
        complaints.forEach((c) => {
          const r = c.priority === "Critical" ? 2200 : c.priority === "High" ? 1800 : c.priority === "Medium" ? 1400 : 1000;
          const color = getMarkerColor(c);
          L.circle([c.latitude, c.longitude], {
            radius: r,
            color: "transparent",
            fillColor: color,
            fillOpacity: 0.08,
          }).addTo(lg);
        });
        addOverlay("complaintDensity", lg);
      }
    },
    [activeOverlays, complaints]
  );

  // ─── Init map ─────────────────────────────────────────────────
  useEffect(() => {
    if (mapRef.current) return;
    const container = mapContainerRef.current;
    if (!container) return;

    let cancelled = false;

    const tryInit = () => {
      if (cancelled || mapRef.current) return;
      if (!container || container.clientWidth === 0 || container.clientHeight === 0) {
        setTimeout(tryInit, 100);
        return;
      }

      const map = L.map(container, {
        center: [center.lat, center.lng],
        zoom: zoom,
        zoomControl: false,
        attributionControl: true,
        fadeAnimation: true,
        zoomAnimation: true,
        markerZoomAnimation: true,
      });

      const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
        maxZoom: 19,
      }).addTo(map);
      osmLayerRef.current = osm;

      map.invalidateSize();
      mapRef.current = map;

      map.on("zoomend", () => {
        setCurrentZoom(map.getZoom());
      });

      setTimeout(() => {
        if (cancelled) return;
        map.invalidateSize();
        loadGeoJson(map);
        updateMarkers(map);
        if (onMapReady) onMapReady(map);
      }, 350);
    };

    const timer = setTimeout(tryInit, 100);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    updateMarkers(map);
  }, [complaints, selectedComplaint, clusteredData, updateMarkers]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || previewMode) return;
    updateOverlays(map);
  }, [activeOverlays, updateOverlays, previewMode]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !flyToLocation) return;
    map.flyTo([flyToLocation.lat, flyToLocation.lng], flyToLocation.zoom || 15, { duration: 1.2 });
  }, [flyToLocation]);

  const handleToggleSatellite = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    if (satelliteMode) {
      if (satelliteLayerRef.current) {
        map.removeLayer(satelliteLayerRef.current);
        satelliteLayerRef.current = null;
      }
      if (osmLayerRef.current) map.addLayer(osmLayerRef.current);
      setSatelliteMode(false);
    } else {
      if (osmLayerRef.current) map.removeLayer(osmLayerRef.current);
      const satLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { attribution: "&copy; Esri", maxZoom: 19 }
      );
      satLayer.addTo(map);
      satelliteLayerRef.current = satLayer;
      setSatelliteMode(true);
    }
  }, [satelliteMode]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainerRef} className="absolute inset-0" />

      {!previewMode && (
        <button
          onClick={handleToggleSatellite}
          className={cn(
            "absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium shadow-lg backdrop-blur-sm border transition-colors",
            satelliteMode
              ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700"
              : "bg-card/95 text-muted-foreground border-border hover:bg-muted"
          )}
        >
          <span className="text-xs">{satelliteMode ? "📍" : "🛰️"}</span>
          {satelliteMode ? "Map" : "Satellite"}
        </button>
      )}

      {geoError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-xl max-w-sm">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-red-500/10">
              <span className="text-2xl">🗺️</span>
            </div>
            <h3 className="text-sm font-bold text-foreground">Constituency boundary not found</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Place the GeoJSON file at <code className="rounded bg-muted px-1">{boundaryFile}</code>
            </p>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-marker-tooltip {
          background: rgba(15, 23, 42, 0.95) !important;
          color: #f8fafc !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-radius: 8px !important;
          padding: 6px 10px !important;
          font-size: 11px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
        }
        .custom-marker-tooltip::before {
          border-top-color: rgba(15, 23, 42, 0.95) !important;
        }
        .leaflet-tooltip-top.custom-marker-tooltip::before {
          border-top-color: rgba(15, 23, 42, 0.95) !important;
        }
        @keyframes criticalPulse {
          0% { box-shadow: 0 0 8px rgba(185,28,28,0.4), 0 2px 6px rgba(0,0,0,0.3); }
          50% { box-shadow: 0 0 24px rgba(185,28,28,0.8), 0 2px 12px rgba(0,0,0,0.4); }
          100% { box-shadow: 0 0 8px rgba(185,28,28,0.4), 0 2px 6px rgba(0,0,0,0.3); }
        }
        .critical-marker-pulse {
          animation: criticalPulse 2s ease-in-out infinite !important;
        }
      `}</style>
    </div>
  );
}
