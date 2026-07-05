"use client";

import { ZoomIn, ZoomOut, Maximize2, Crosshair } from "lucide-react";

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onLocateConstituency: () => void;
}

export default function MapControls({ onZoomIn, onZoomOut, onResetView, onLocateConstituency }: MapControlsProps) {
  const buttons = [
    { icon: ZoomIn, onClick: onZoomIn, label: "Zoom in" },
    { icon: ZoomOut, onClick: onZoomOut, label: "Zoom out" },
    { icon: Maximize2, onClick: onResetView, label: "Reset view" },
    { icon: Crosshair, onClick: onLocateConstituency, label: "Locate constituency" },
  ];

  return (
    <div className="absolute left-4 top-4 z-20 flex flex-col gap-2">
      {buttons.map(({ icon: Icon, onClick, label }) => (
        <button
          key={label}
          onClick={onClick}
          title={label}
          className="flex size-9 items-center justify-center rounded-xl bg-card/95 border border-border text-muted-foreground shadow-lg hover:text-foreground hover:bg-muted backdrop-blur-sm transition-colors"
        >
          <Icon className="size-4" />
        </button>
      ))}
    </div>
  );
}
