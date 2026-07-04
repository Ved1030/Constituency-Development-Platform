"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface UILanguage {
  code: string;
  name: string;
  native_name: string;
  flag: string;
}

const UI_LANGUAGES: UILanguage[] = [
  { code: "en", name: "English", native_name: "English", flag: "🇮🇳" },
  { code: "hi", name: "Hindi", native_name: "हिन्दी", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", native_name: "ગુજરાતી", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", native_name: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "Telugu", native_name: "తెలుగు", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", native_name: "मराठी", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", native_name: "বাংলা", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", native_name: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", native_name: "മലയാളം", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", native_name: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "od", name: "Odia", native_name: "ଓଡ଼ିଆ", flag: "🇮🇳" },
  { code: "as", name: "Assamese", native_name: "অসমীয়া", flag: "🇮🇳" },
];

interface LanguageSwitcherProps {
  currentLanguage: string;
  onLanguageChange: (lang: UILanguage) => void;
  className?: string;
}

export function LanguageSwitcher({
  currentLanguage,
  onLanguageChange,
  className,
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = UI_LANGUAGES.find((l) => l.code === currentLanguage) || UI_LANGUAGES[0];

  // Close dropdown on outside click
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
                    onLanguageChange(lang);
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
