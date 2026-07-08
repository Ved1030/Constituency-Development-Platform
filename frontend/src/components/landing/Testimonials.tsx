"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

const testimonials = [
  {
    nameKey: "testimonial1Name" as const,
    roleKey: "testimonial1Role" as const,
    quoteKey: "testimonial1Quote" as const,
    initials: "RK",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    nameKey: "testimonial2Name" as const,
    roleKey: "testimonial2Role" as const,
    quoteKey: "testimonial2Quote" as const,
    initials: "PS",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    nameKey: "testimonial3Name" as const,
    roleKey: "testimonial3Role" as const,
    quoteKey: "testimonial3Quote" as const,
    initials: "AD",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    nameKey: "testimonial4Name" as const,
    roleKey: "testimonial4Role" as const,
    quoteKey: "testimonial4Quote" as const,
    initials: "AP",
    gradient: "from-orange-500 to-amber-600",
  },
];

export function Testimonials() {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 px-5 py-2"
          >
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold tracking-wide text-primary">
              {t("landing.testimonialsTag")}
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[56px] lg:leading-[1.1]"
          >
            {t("landing.testimonialsTitle")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            {t("landing.testimonialsSubtitle")}
          </motion.p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-8 shadow-lg sm:p-12">
            <Quote className="absolute top-6 left-6 size-8 text-primary/10" />

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="relative"
              >
                <p className="mb-8 text-lg leading-relaxed text-foreground/80 sm:text-xl">
                  &ldquo;{t(testimonials[current].quoteKey)}&rdquo;
                </p>

                <div className="flex items-center gap-4">
                  <div
                    className={`flex size-12 items-center justify-center rounded-full bg-gradient-to-br ${testimonials[current].gradient} text-sm font-bold text-white shadow-lg`}
                  >
                    {testimonials[current].initials}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {t(testimonials[current].nameKey)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t(testimonials[current].roleKey)}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`size-2 rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-8 bg-primary"
                    : "bg-muted-foreground/20 hover:bg-muted-foreground/40"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
