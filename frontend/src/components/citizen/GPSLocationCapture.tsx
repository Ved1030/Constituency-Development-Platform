"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Navigation,
  Loader,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Satellite,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { GPSLocation, GPSPermissionState } from "@/types/complaint";

interface GPSLocationCaptureProps {
  location: GPSLocation | null;
  permissionState: GPSPermissionState;
  isCapturing: boolean;
  error: string | null;
  accuracy: number | null;
  onRequestPermission: () => void;
}

function getAccuracyLabel(accuracy: number | null): { label: string; color: string } {
  if (accuracy === null) return { label: "Unknown", color: "text-muted-foreground" };
  if (accuracy <= 10) return { label: "Excellent", color: "text-success" };
  if (accuracy <= 30) return { label: "Good", color: "text-primary" };
  if (accuracy <= 50) return { label: "Fair", color: "text-amber-500" };
  if (accuracy <= 100) return { label: "Low", color: "text-orange-500" };
  return { label: "Poor", color: "text-destructive" };
}

export function GPSLocationCapture({
  location,
  permissionState,
  isCapturing,
  error,
  accuracy,
  onRequestPermission,
}: GPSLocationCaptureProps) {
  const accuracyInfo = getAccuracyLabel(accuracy);

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Navigation className="size-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">GPS Location</h3>
          <p className="text-xs text-muted-foreground">
            Auto-captured for evidence verification
          </p>
        </div>
        {location && (
          <div className="ml-auto flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1">
            <CheckCircle className="size-3 text-success" />
            <span className="text-[11px] font-medium text-success">Captured</span>
          </div>
        )}
      </div>

      {permissionState === "prompt" && !location && (
        <div className="text-center py-6">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 mb-4"
          >
            <Satellite className="size-8 text-primary" />
          </motion.div>
          <p className="text-sm text-muted-foreground mb-4">
            Enable GPS to verify your complaint location
          </p>
          <Button onClick={onRequestPermission} disabled={isCapturing} className="gap-2">
            {isCapturing ? (
              <>
                <Loader className="size-4 animate-spin" />
                Acquiring GPS...
              </>
            ) : (
              <>
                <Navigation className="size-4" />
                Enable GPS
              </>
            )}
          </Button>
        </div>
      )}

      {(permissionState === "denied" || permissionState === "unavailable") && error && (
        <div className="rounded-xl bg-destructive/5 border border-destructive/20 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive">GPS Unavailable</p>
              <p className="text-xs text-muted-foreground mt-1">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={onRequestPermission}
                className="mt-3 gap-1.5"
              >
                <RotateCcw className="size-3" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      )}

      {isCapturing && (
        <div className="text-center py-6">
          <Loader className="mx-auto size-8 animate-spin text-primary mb-3" />
          <p className="text-sm text-muted-foreground">Acquiring GPS coordinates...</p>
        </div>
      )}

      {location && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {/* GPS Coordinates */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-muted/50 p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <MapPin className="size-3 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground uppercase">Latitude</span>
              </div>
              <p className="text-sm font-mono font-medium text-foreground">
                {location.latitude.toFixed(6)}
              </p>
            </div>
            <div className="rounded-xl bg-muted/50 p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <MapPin className="size-3 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground uppercase">Longitude</span>
              </div>
              <p className="text-sm font-mono font-medium text-foreground">
                {location.longitude.toFixed(6)}
              </p>
            </div>
          </div>

          {/* Accuracy */}
          <div className="flex items-center justify-between rounded-xl bg-muted/50 p-3">
            <div className="flex items-center gap-2">
              <Satellite className="size-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Accuracy</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn("text-xs font-semibold", accuracyInfo.color)}>
                {accuracyInfo.label}
              </span>
              {accuracy !== null && (
                <span className="text-xs text-muted-foreground">
                  ({accuracy.toFixed(1)}m)
                </span>
              )}
            </div>
          </div>

          {/* Additional GPS Data */}
          <div className="grid grid-cols-3 gap-2">
            {location.altitude !== null && (
              <div className="rounded-lg bg-muted/30 p-2 text-center">
                <span className="text-[10px] text-muted-foreground block">Altitude</span>
                <span className="text-xs font-medium">{location.altitude.toFixed(0)}m</span>
              </div>
            )}
            {location.speed !== null && (
              <div className="rounded-lg bg-muted/30 p-2 text-center">
                <span className="text-[10px] text-muted-foreground block">Speed</span>
                <span className="text-xs font-medium">{(location.speed * 3.6).toFixed(1)} km/h</span>
              </div>
            )}
            {location.heading !== null && (
              <div className="rounded-lg bg-muted/30 p-2 text-center">
                <span className="text-[10px] text-muted-foreground block">Heading</span>
                <span className="text-xs font-medium">{location.heading.toFixed(0)}°</span>
              </div>
            )}
          </div>

          {/* Timestamp */}
          {location.timestamp && (
            <p className="text-[11px] text-muted-foreground text-center">
              Captured: {new Date(location.timestamp).toLocaleString()}
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}
