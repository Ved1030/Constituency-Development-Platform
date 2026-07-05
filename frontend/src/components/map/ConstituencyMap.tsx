"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { DigitalTwinComplaint, OverlayLayer } from "@/types/digital-twin";
import { PRIORITY_COLORS, PRIORITY_SIZES, CONSTITUENCY_CENTER, CONSTITUENCY_ZOOM } from "@/types/digital-twin";
import { mockOverlayPoints } from "@/data/mock-complaints";

interface ConstituencyMapProps {
  complaints: DigitalTwinComplaint[];
  selectedComplaint: DigitalTwinComplaint | null;
  onSelectComplaint: (complaint: DigitalTwinComplaint) => void;
  activeOverlays: OverlayLayer[];
  flyToLocation?: { lat: number; lng: number; zoom: number } | null;
  onMapReady?: (map: L.Map) => void;
  previewMode?: boolean;
}

export default function ConstituencyMap({
  complaints,
  selectedComplaint,
  onSelectComplaint,
  activeOverlays,
  flyToLocation,
  onMapReady,
  previewMode = false,
}: ConstituencyMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const overlayLayersRef = useRef<Record<string, L.LayerGroup>>({});
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const [geoLoaded, setGeoLoaded] = useState(false);
  const [geoError, setGeoError] = useState(false);
  const boundaryCoordsRef = useRef<[number, number][] | null>(null);

  // ─── Load GeoJSON boundary ─────────────────────────────────────
  const loadGeoJson = useCallback(async (map: L.Map) => {
    try {
      const res = await fetch("/maps/north-chennai.geojson");
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
          dashArray: undefined,
        },
      }).addTo(map);

      map.fitBounds(L.latLngBounds(latLngs), { padding: [40, 40] });
      setGeoLoaded(true);
    } catch {
      setGeoError(true);
    }
  }, []);

  // ─── Update complaint markers ───────────────────────────────────
  const updateMarkers = useCallback(
    (map: L.Map) => {
      if (!markersLayerRef.current) {
        markersLayerRef.current = L.layerGroup().addTo(map);
      }
      markersLayerRef.current.clearLayers();

      complaints.forEach((c) => {
        const color = PRIORITY_COLORS[c.priority];
        const size = PRIORITY_SIZES[c.priority];
        const isSel = selectedComplaint?.id === c.id;
        const s = isSel ? size + 6 : size;

        const html = `
          <div style="
            width:${s}px;height:${s}px;
            background:${color};
            border-radius:50%;
            border:${isSel ? "3px solid #fff" : "2px solid rgba(255,255,255,0.85)"};
            box-shadow:0 0 ${isSel ? 14 : 6}px ${color}99;
            cursor:pointer;
            transition:transform 0.15s;
          " title="${c.title.replace(/"/g, "&quot;")}"></div>`;

        const icon = L.divIcon({
          html,
          className: "",
          iconSize: [s, s],
          iconAnchor: [s / 2, s / 2],
        });

        const marker = L.marker([c.latitude, c.longitude], { icon });
        marker.on("click", (e) => {
          L.DomEvent.stopPropagation(e);
          onSelectComplaint(c);
        });
        marker.addTo(markersLayerRef.current!);
      });
    },
    [complaints, selectedComplaint, onSelectComplaint]
  );

  // ─── Update overlay layers ──────────────────────────────────────
  const updateOverlays = useCallback(
    (map: L.Map) => {
      Object.values(overlayLayersRef.current).forEach((lg) => map.removeLayer(lg));
      overlayLayersRef.current = {};

      if (activeOverlays.includes("schools")) {
        const lg = L.layerGroup();
        mockOverlayPoints.schools.forEach((s) => {
          L.marker([s.lat, s.lng], {
            icon: L.divIcon({
              html: '<div style="font-size:18px;filter:drop-shadow(0 1px 2px rgba(0,0,0,.3))">🏫</div>',
              className: "",
              iconSize: [22, 22],
              iconAnchor: [11, 11],
            }),
          })
            .bindTooltip(s.name, { direction: "top", offset: [0, -8] })
            .addTo(lg);
        });
        lg.addTo(map);
        overlayLayersRef.current.schools = lg;
      }

      if (activeOverlays.includes("hospitals")) {
        const lg = L.layerGroup();
        mockOverlayPoints.hospitals.forEach((h) => {
          L.marker([h.lat, h.lng], {
            icon: L.divIcon({
              html: '<div style="font-size:18px;filter:drop-shadow(0 1px 2px rgba(0,0,0,.3))">🏥</div>',
              className: "",
              iconSize: [22, 22],
              iconAnchor: [11, 11],
            }),
          })
            .bindTooltip(h.name, { direction: "top", offset: [0, -8] })
            .addTo(lg);
        });
        lg.addTo(map);
        overlayLayersRef.current.hospitals = lg;
      }

      if (activeOverlays.includes("projects")) {
        const lg = L.layerGroup();
        mockOverlayPoints.projects.forEach((p) => {
          L.marker([p.lat, p.lng], {
            icon: L.divIcon({
              html: '<div style="font-size:18px;filter:drop-shadow(0 1px 2px rgba(0,0,0,.3))">📋</div>',
              className: "",
              iconSize: [22, 22],
              iconAnchor: [11, 11],
            }),
          })
            .bindTooltip(p.name, { direction: "top", offset: [0, -8] })
            .addTo(lg);
        });
        lg.addTo(map);
        overlayLayersRef.current.projects = lg;
      }

      if (activeOverlays.includes("complaintDensity")) {
        const lg = L.layerGroup();
        complaints.forEach((c) => {
          const r =
            c.priority === "Critical" ? 2200 : c.priority === "High" ? 1800 : c.priority === "Medium" ? 1400 : 1000;
          L.circle([c.latitude, c.longitude], {
            radius: r,
            color: "transparent",
            fillColor: PRIORITY_COLORS[c.priority],
            fillOpacity: 0.1,
          }).addTo(lg);
        });
        lg.addTo(map);
        overlayLayersRef.current.complaintDensity = lg;
      }
    },
    [activeOverlays, complaints]
  );

  // ─── Initialize map ────────────────────────────────────────────
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
        center: [CONSTITUENCY_CENTER.lat, CONSTITUENCY_CENTER.lng],
        zoom: CONSTITUENCY_ZOOM,
        zoomControl: false,
        attributionControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
        maxZoom: 19,
      }).addTo(map);

      map.invalidateSize();
      mapRef.current = map;

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

  // ─── React to complaints change ─────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    updateMarkers(map);
  }, [complaints, selectedComplaint, updateMarkers]);

  // ─── React to overlay changes ───────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || previewMode) return;
    updateOverlays(map);
  }, [activeOverlays, updateOverlays, previewMode]);

  // ─── React to flyTo ─────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !flyToLocation) return;
    map.flyTo([flyToLocation.lat, flyToLocation.lng], flyToLocation.zoom || 15, { duration: 1.2 });
  }, [flyToLocation]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainerRef} className="absolute inset-0" />

      {/* GeoJSON loading error overlay */}
      {geoError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-xl max-w-sm">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-red-500/10">
              <span className="text-2xl">🗺️</span>
            </div>
            <h3 className="text-sm font-bold text-foreground">Constituency boundary not found</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Place the GeoJSON file at <code className="rounded bg-muted px-1">/public/maps/north-chennai.geojson</code>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
