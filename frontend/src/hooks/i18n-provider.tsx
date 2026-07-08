"use client";

import { useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import {
  I18nContext,
  LOCALE_COOKIE,
  LOCALE_STORAGE_KEY,
  getNestedValue,
  translations,
  ensureLocale,
} from "./i18n-core";
import { getCookie, setCookie } from "@/lib/cookies";

interface NestedMessages {
  [key: string]: string | NestedMessages;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<string>("en");
  const [ready, setReady] = useState(false);
  const initialLoadDone = useRef(false);

  // On mount: read saved locale and lazy-load it
  useEffect(() => {
    if (initialLoadDone.current) return;
    initialLoadDone.current = true;

    const cookieLang = getCookie(LOCALE_COOKIE);
    const storedLang = localStorage.getItem(LOCALE_STORAGE_KEY);
    const initial = cookieLang || storedLang || "en";

    if (initial === "en") {
      setReady(true);
      return;
    }

    ensureLocale(initial).then(() => {
      setLocaleState(initial);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale, ready]);

  const setLocale = useCallback((newLocale: string) => {
    ensureLocale(newLocale).then(() => {
      setLocaleState(newLocale);
      localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
      setCookie(LOCALE_COOKIE, newLocale);
      if (typeof document !== "undefined") {
        document.documentElement.lang = newLocale;
      }
    });
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const msgs = (translations[locale] || translations["en"]) as NestedMessages;
      let value = getNestedValue(msgs, key);
      if (value === undefined) {
        value = getNestedValue(translations["en"] as NestedMessages, key);
      }
      if (value === undefined) {
        return key;
      }
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          value = value!.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
        });
      }
      return value;
    },
    [locale]
  );

  if (!ready) return null;

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}
