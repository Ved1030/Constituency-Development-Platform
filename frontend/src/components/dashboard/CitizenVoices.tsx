"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, ThumbsUp, Mic, Quote, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

const voices = [
  {
    id: 1,
    name: "Lakshmi Devi",
    village: "Sewapuri",
    ward: "Ward 12",
    photo: null,
    complaint: "Water tanker comes only once in 3 days. We are 200 families here. Children are falling sick from the dirty water we store.",
    originalLanguage: "Tamil",
    translated: true,
    supportCount: 89,
    isVoice: true,
  },
  {
    id: 2,
    name: "Murugan K.",
    village: "Korattur",
    ward: "Ward 8",
    photo: null,
    complaint: "The industrial road is broken for 8 months. My auto rickshaw's suspension is damaged. School children walk on this road daily. When will it be repaired?",
    originalLanguage: "Tamil",
    translated: true,
    supportCount: 156,
    isVoice: false,
  },
  {
    id: 3,
    name: "Priya Sharma",
    village: "Perambur",
    ward: "Ward 15",
    photo: null,
    complaint: "PHC has no female doctor. Women in our area are too shy to see male doctors. My mother hasn't had a checkup in 2 years because of this.",
    originalLanguage: "Hindi",
    translated: true,
    supportCount: 234,
    isVoice: true,
  },
  {
    id: 4,
    name: "Ramesh Patel",
    village: "Villivakkam",
    ward: "Ward 3",
    photo: null,
    complaint: "Open drain has been overflowing for 2 weeks. The stench is unbearable. My children have skin infections. Please send someone to clean it.",
    originalLanguage: "Gujarati",
    translated: true,
    supportCount: 67,
    isVoice: false,
  },
  {
    id: 5,
    name: "Sundari Amma",
    village: "Madhavaram",
    ward: "Ward 18",
    photo: null,
    complaint: "Garbage has not been collected for 3 weeks. Piles are on every corner. Stray dogs are tearing the bags. We need regular collection.",
    originalLanguage: "Tamil",
    translated: true,
    supportCount: 112,
    isVoice: true,
  },
];

export function CitizenVoices() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % voices.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + voices.length) % voices.length);
  };

  const voice = voices[current];

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
  };

  return (
    <div className="px-4 pt-4 lg:px-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="rounded-2xl border border-border/60 bg-card p-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Quote className="size-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground">Citizen Voices</h2>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
              Live Feed
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={prev}
              className="flex size-7 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            <button
              onClick={next}
              className="flex size-7 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={voice.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex gap-5"
            >
              {/* Left: Avatar / Photo */}
              <div className="shrink-0">
                <div className="flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-border/60">
                  <div className="flex size-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-2xl font-bold text-white shadow-lg">
                    {voice.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <div className="text-[11px] font-semibold text-foreground">{voice.name}</div>
                  <div className="flex items-center justify-center gap-1 text-[9px] text-muted-foreground">
                    <MapPin className="size-2.5" />
                    {voice.village}, {voice.ward}
                  </div>
                </div>
              </div>

              {/* Right: Content */}
              <div className="flex-1">
                {/* Badges */}
                <div className="flex items-center gap-2 mb-3">
                  {voice.isVoice && (
                    <span className="flex items-center gap-1 rounded-full bg-purple-50 dark:bg-purple-500/10 px-2.5 py-0.5 text-[9px] font-medium text-purple-600 dark:text-purple-400">
                      <Mic className="size-2.5" />
                      Voice Complaint
                    </span>
                  )}
                  {voice.translated && (
                    <span className="flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-500/10 px-2.5 py-0.5 text-[9px] font-medium text-amber-600 dark:text-amber-400">
                      <Volume2 className="size-2.5" />
                      Translated from {voice.originalLanguage}
                    </span>
                  )}
                </div>

                {/* Complaint Quote */}
                <div className="relative rounded-xl bg-muted/30 border border-border/40 p-4">
                  <Quote className="absolute top-3 left-3 size-5 text-primary/20" />
                  <p className="pl-6 text-sm leading-relaxed text-foreground/90 italic">
                    "{voice.complaint}"
                  </p>
                </div>

                {/* Support Count */}
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5">
                    <ThumbsUp className="size-3 text-primary" />
                    <span className="text-[11px] font-semibold text-primary">
                      {voice.supportCount.toLocaleString()} supporters
                    </span>
                  </div>
                  <button className="rounded-full border border-border/60 px-3 py-1.5 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    Support this Issue
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {voices.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > current ? 1 : -1);
                setCurrent(i);
              }}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === current
                  ? "w-6 bg-primary"
                  : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
