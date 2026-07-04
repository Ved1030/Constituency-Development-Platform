"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";

export interface UILanguage {
  code: string;
  name: string;
  native_name: string;
  flag: string;
}

const UI_LANGUAGES: UILanguage[] = [
  { code: "en", name: "English", native_name: "English", flag: "\ud83c\uddee\ud83c\uddf3" },
  { code: "hi", name: "Hindi", native_name: "\u0939\u093f\u0928\u094d\u0926\u0940", flag: "\ud83c\uddee\ud83c\uddf3" },
  { code: "gu", name: "Gujarati", native_name: "\u0a97\u0ac1\u0a9c\u0ab0\u0abe\u0a9f\u0ac0", flag: "\ud83c\uddee\ud83c\uddf3" },
  { code: "ta", name: "Tamil", native_name: "\u0ba4\u0bae\u0bbf\u0bb4\u0bcd", flag: "\ud83c\uddee\ud83c\uddf3" },
  { code: "te", name: "Telugu", native_name: "\u0c24\u0c46\u0c32\u0c41\u0c17\u0c41", flag: "\ud83c\uddee\ud83c\uddf3" },
  { code: "mr", name: "Marathi", native_name: "\u092e\u0930\u093e\u0920\u0940", flag: "\ud83c\uddee\ud83c\uddf3" },
  { code: "bn", name: "Bengali", native_name: "\u09ac\u09be\u0982\u09b2\u09be", flag: "\ud83c\uddee\ud83c\uddf3" },
  { code: "kn", name: "Kannada", native_name: "\u0c95\u0ca8\u0ccd\u0ca8\u0c9f", flag: "\ud83c\uddee\ud83c\uddf3" },
  { code: "ml", name: "Malayalam", native_name: "\u0d2e\u0d32\u0d2f\u0d3e\u0d33\u0d02", flag: "\ud83c\uddee\ud83c\uddf3" },
  { code: "pa", name: "Punjabi", native_name: "\u0a2a\u0a70\u0a1c\u0a3e\u0a2c\u0a40", flag: "\ud83c\uddee\ud83c\uddf3" },
];

interface LanguageSwitcherProps {
  className?: string;
  currentLanguage?: string;
  onLanguageChange?: (language: UILanguage) => void;
}

export function LanguageSwitcher({ className, currentLanguage, onLanguageChange }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { locale, setLocale } = useTranslation();

  const activeCode = currentLanguage ?? locale;
  const currentLang = UI_LANGUAGES.find((l) => l.code === activeCode) || UI_LANGUAGES[0];

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-lang-switcher]")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  return (
    <div className={cn("relative", className)} data-lang-switcher>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-1.5",
          "text-sm font-medium text-foreground transition-all hover:bg-muted",
          isOpen && "border-primary/30 bg-primary/5",
        )}
      >
        <Globe className="size-3.5 text-primary" />
        <span className="hidden sm:inline">{currentLang.native_name}</span>
        <span className="sm:hidden">{currentLang.code.toUpperCase()}</span>
        <ChevronDown
          className={cn(
            "size-3 text-muted-foreground transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-border bg-card shadow-xl overflow-hidden"
          >
            <div className="max-h-72 overflow-y-auto p-1">
              {UI_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLocale(lang.code);
                    onLanguageChange?.(lang);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-colors",
                    currentLang.code === lang.code
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted",
                  )}
                >
                  <span className="text-base">{lang.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{lang.native_name}</div>
                    <div className="text-[10px] text-muted-foreground">{lang.name}</div>
                  </div>
                  {currentLang.code === lang.code && (
                    <Check className="size-3.5 text-primary shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
