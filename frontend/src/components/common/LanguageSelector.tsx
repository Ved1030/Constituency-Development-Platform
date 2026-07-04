"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "mr", label: "Marathi" },
];

interface LanguageSelectorProps {
  className?: string;
}

export function LanguageSelector({ className }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(languages[0]);

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Globe className="size-4" />
        <span>{selected.code.toUpperCase()}</span>
        <ChevronDown className="size-3" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute right-0 mt-1 w-32 overflow-hidden rounded-lg border border-border bg-card shadow-lg"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                className={cn(
                  "w-full px-4 py-2 text-left text-sm transition-colors hover:bg-muted",
                  selected.code === lang.code
                    ? "text-foreground font-medium"
                    : "text-muted-foreground",
                )}
                onClick={() => {
                  setSelected(lang);
                  setIsOpen(false);
                }}
              >
                {lang.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
