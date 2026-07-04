"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";

const languages = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "\u0939\u093f\u0928\u094d\u0926\u0940" },
  { code: "gu", label: "Gujarati", native: "\u0a97\u0ac1\u0a9c\u0ab0\u0abe\u0a9f\u0ac0" },
  { code: "mr", label: "Marathi", native: "\u092e\u0930\u093e\u0920\u0940" },
  { code: "ta", label: "Tamil", native: "\u0ba4\u0bae\u0bbf\u0bb4\u0bcd" },
  { code: "te", label: "Telugu", native: "\u0c24\u0c46\u0c32\u0c41\u0c17\u0c41" },
  { code: "kn", label: "Kannada", native: "\u0c95\u0ca8\u0ccd\u0ca8\u0c9f" },
  { code: "ml", label: "Malayalam", native: "\u0d2e\u0d32\u0d2f\u0d3e\u0d33\u0d02" },
  { code: "bn", label: "Bengali", native: "\u09ac\u09be\u0982\u09b2\u09be" },
  { code: "pa", label: "Punjabi", native: "\u0a2a\u0a70\u0a1c\u0a3e\u0a2c\u0a40" },
];

interface LanguageSelectorProps {
  className?: string;
}

export function LanguageSelector({ className }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { locale, setLocale } = useTranslation();

  const selected = languages.find((l) => l.code === locale) || languages[0];

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-lang-selector]")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  return (
    <div className={cn("relative", className)} data-lang-selector>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Globe className="size-4" />
        <span>{selected.native}</span>
        <ChevronDown className="size-3" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute right-0 mt-1 w-40 overflow-hidden rounded-lg border border-border bg-card shadow-lg z-50"
          >
            <div className="max-h-72 overflow-y-auto p-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm transition-colors rounded-md",
                    selected.code === lang.code
                      ? "text-foreground font-medium bg-primary/10"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                  onClick={() => {
                    setLocale(lang.code);
                    setIsOpen(false);
                  }}
                >
                  {lang.native} ({lang.label})
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
