"use client";

import { useCallback, useState } from "react";
import type { GeoAddress } from "@/types/complaint";

interface UseReverseGeocodingReturn {
  address: GeoAddress | null;
  isLoading: boolean;
  error: string | null;
  reverseGeocode: (lat: number, lng: number) => Promise<GeoAddress | null>;
}

export function useReverseGeocoding(): UseReverseGeocodingReturn {
  const [address, setAddress] = useState<GeoAddress | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reverseGeocode = useCallback(async (lat: number, lng: number): Promise<GeoAddress | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Use Nominatim (OpenStreetMap) for reverse geocoding
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&accept-language=en`;
      const response = await fetch(url, {
        headers: {
          "User-Agent": "ConstituencyDevPlatform/1.0",
        },
      });

      if (!response.ok) {
        throw new Error("Geocoding service unavailable");
      }

      const data = await response.json();
      const addr = data.address || {};

      const geoAddress: GeoAddress = {
        village: addr.village || addr.suburb || addr.neighbourhood || null,
        ward: addr.ward || null,
        taluka: addr.county || addr.suburb || null,
        district: addr.district || addr.city_district || null,
        state: addr.state || null,
        pincode: addr.postcode || null,
        assembly_constituency: null,
        lok_sabha_constituency: null,
        nearest_landmark: addr.attraction || addr.amenity || null,
        confidence: addr.village && addr.district ? 0.8 : 0.5,
        raw_display: data.display_name || null,
      };

      setAddress(geoAddress);
      setIsLoading(false);
      return geoAddress;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Geocoding failed";
      setError(errorMsg);
      setIsLoading(false);

      // Return fallback address from coordinates
      const fallback: GeoAddress = {
        village: null,
        ward: null,
        taluka: null,
        district: null,
        state: null,
        pincode: null,
        assembly_constituency: null,
        lok_sabha_constituency: null,
        nearest_landmark: null,
        confidence: 0.1,
        raw_display: `Location at (${lat.toFixed(6)}, ${lng.toFixed(6)})`,
      };
      setAddress(fallback);
      return fallback;
    }
  }, []);

  return {
    address,
    isLoading,
    error,
    reverseGeocode,
  };
}
