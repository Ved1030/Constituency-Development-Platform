"use client";

import { createContext, useContext } from "react";
import en from "@/locales/en/common.json";

interface NestedMessages {
  [key: string]: string | NestedMessages;
}

export interface I18nContextValue {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export const I18nContext = createContext<I18nContextValue | null>(null);

export const LOCALE_STORAGE_KEY = "cdp-locale";
export const LOCALE_COOKIE = "cdp-locale";

// English is always loaded; other languages are lazy-loaded on first use
export const translations: Record<string, NestedMessages> = { en: en as unknown as NestedMessages };

// Lazy-load a locale's JSON on demand (cached after first load)
const pendingLoads: Partial<Record<string, Promise<void>>> = {};

export async function ensureLocale(locale: string): Promise<void> {
  if (translations[locale]) return;
  if (pendingLoads[locale]) return pendingLoads[locale];

  pendingLoads[locale] = (async () => {
    try {
      const mod = await import(`@/locales/${locale}/common.json`);
      translations[locale] = mod.default as unknown as NestedMessages;
    } catch {
      // Fallback: use English if locale file fails to load
    }
  })();

  return pendingLoads[locale];
}

export function getNestedValue(obj: NestedMessages, path: string): string | undefined {
  const keys = path.split(".");
  let current: string | NestedMessages = obj;
  for (const key of keys) {
    if (typeof current !== "object" || current === null) return undefined;
    current = (current as Record<string, string | NestedMessages>)[key];
    if (current === undefined) return undefined;
  }
  return typeof current === "string" ? current : undefined;
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    return {
      locale: "en",
      setLocale: () => {},
      t: (key: string) => {
        return key;
      },
    };
  }
  return ctx;
}
