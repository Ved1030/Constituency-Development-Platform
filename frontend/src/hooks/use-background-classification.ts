"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { classifyComplaintBackground } from "@/services/speech-api";
import type { BackgroundClassificationResult } from "@/types/speech";

interface UseBackgroundClassificationOptions {
  /** Debounce delay in ms (default: 1500) */
  debounceMs?: number;
  /** Minimum description length to trigger classification */
  minLength?: number;
}

interface UseBackgroundClassificationReturn {
  classification: BackgroundClassificationResult | null;
  isClassifying: boolean;
  error: string | null;
  triggerClassification: (params: {
    title: string;
    description: string;
    category?: string;
    original_language?: string;
    english_translation?: string;
  }) => void;
  reset: () => void;
}

export function useBackgroundClassification(
  options: UseBackgroundClassificationOptions = {},
): UseBackgroundClassificationReturn {
  const { debounceMs = 1500, minLength = 15 } = options;

  const [classification, setClassification] = useState<BackgroundClassificationResult | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastParamsRef = useRef<string>("");
  const abortRef = useRef<boolean>(false);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const triggerClassification = useCallback(
    (params: {
      title: string;
      description: string;
      category?: string;
      original_language?: string;
      english_translation?: string;
    }) => {
      // Don't classify if description is too short
      if (!params.description || params.description.length < minLength) {
        setClassification(null);
        return;
      }

      // Create a key to deduplicate
      const key = `${params.title}|||${params.description}`;
      if (key === lastParamsRef.current) return;
      lastParamsRef.current = key;

      // Debounce
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(async () => {
        abortRef.current = false;
        setIsClassifying(true);
        setError(null);

        try {
          const result = await classifyComplaintBackground(params);
          if (!abortRef.current) {
            setClassification(result);
          }
        } catch (err: any) {
          if (!abortRef.current) {
            setError(err.message || "Classification failed");
          }
        } finally {
          if (!abortRef.current) {
            setIsClassifying(false);
          }
        }
      }, debounceMs);
    },
    [debounceMs, minLength],
  );

  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    abortRef.current = true;
    setClassification(null);
    setIsClassifying(false);
    setError(null);
    lastParamsRef.current = "";
  }, []);

  return {
    classification,
    isClassifying,
    error,
    triggerClassification,
    reset,
  };
}
