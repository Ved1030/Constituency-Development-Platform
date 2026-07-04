"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { GPSLocation, GPSPermissionState } from "@/types/complaint";

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  autoRequest?: boolean;
}

interface UseGeolocationReturn {
  location: GPSLocation | null;
  permissionState: GPSPermissionState;
  isCapturing: boolean;
  error: string | null;
  accuracy: number | null;
  requestPermission: () => Promise<void>;
  watchPosition: () => void;
  clearWatch: () => void;
}

export function useGeolocation(options: UseGeolocationOptions = {}): UseGeolocationReturn {
  const {
    enableHighAccuracy = true,
    timeout = 15000,
    maximumAge = 0,
    autoRequest = false,
  } = options;

  const [location, setLocation] = useState<GPSLocation | null>(null);
  const [permissionState, setPermissionState] = useState<GPSPermissionState>("prompt");
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const parsePosition = useCallback((position: GeolocationPosition): GPSLocation => {
    const { coords, timestamp } = position;
    return {
      latitude: coords.latitude,
      longitude: coords.longitude,
      accuracy: coords.accuracy,
      altitude: coords.altitude,
      speed: coords.speed,
      heading: coords.heading,
      timestamp: new Date(timestamp).toISOString(),
    };
  }, []);

  const requestPermission = useCallback(async () => {
    if (!navigator.geolocation) {
      setPermissionState("unavailable");
      setError("Geolocation is not supported by your browser");
      return;
    }

    setIsCapturing(true);
    setError(null);

    try {
      // Check if Permission API is available
      if ("permissions" in navigator) {
        const permission = await navigator.permissions.query({ name: "geolocation" });
        if (permission.state === "denied") {
          setPermissionState("denied");
          setError("Location access denied. Please enable location in your browser settings.");
          setIsCapturing(false);
          return;
        }
      }

      // Request position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = parsePosition(position);
          setLocation(loc);
          setAccuracy(loc.accuracy);
          setPermissionState("granted");
          setIsCapturing(false);
        },
        (err) => {
          setIsCapturing(false);
          switch (err.code) {
            case err.PERMISSION_DENIED:
              setPermissionState("denied");
              setError("Location access denied. Please allow location access to submit evidence.");
              break;
            case err.POSITION_UNAVAILABLE:
              setPermissionState("unavailable");
              setError("Location information unavailable. Please try again.");
              break;
            case err.TIMEOUT:
              setPermissionState("unavailable");
              setError("Location request timed out. Please try again.");
              break;
            default:
              setError("An error occurred while getting your location.");
          }
        },
        {
          enableHighAccuracy,
          timeout,
          maximumAge,
        }
      );
    } catch (err) {
      setIsCapturing(false);
      setError("Failed to request location permission.");
    }
  }, [enableHighAccuracy, timeout, maximumAge, parsePosition]);

  const watchPosition = useCallback(() => {
    if (!navigator.geolocation) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const loc = parsePosition(position);
        setLocation(loc);
        setAccuracy(loc.accuracy);
        setPermissionState("granted");
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setPermissionState("denied");
        }
      },
      {
        enableHighAccuracy,
        timeout,
        maximumAge,
      }
    );
  }, [enableHighAccuracy, timeout, maximumAge, parsePosition]);

  const clearWatch = useCallback(() => {
    if (watchIdRef.current !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  // Auto-request on mount if enabled
  useEffect(() => {
    if (autoRequest) {
      requestPermission();
    }
    return () => clearWatch();
  }, [autoRequest, requestPermission, clearWatch]);

  return {
    location,
    permissionState,
    isCapturing,
    error,
    accuracy,
    requestPermission,
    watchPosition,
    clearWatch,
  };
}
