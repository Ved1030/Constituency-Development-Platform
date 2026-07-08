"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/use-translation";

const languages = [
  { code: "en", native: "English", gradient: "from-blue-500/10 to-indigo-500/10" },
  { code: "hi", native: "हिन्दी", gradient: "from-orange-500/10 to-amber-500/10" },
  { code: "ta", native: "தமிழ்", gradient: "from-red-500/10 to-rose-500/10" },
  { code: "te", native: "తెలుగు", gradient: "from-yellow-500/10 to-orange-500/10" },
  { code: "bn", native: "বাংলা", gradient: "from-green-500/10 to-emerald-500/10" },
  { code: "gu", native: "ગુજરાતી", gradient: "from-purple-500/10 to-violet-500/10" },
  { code: "mr", native: "मराठी", gradient: "from-amber-500/10 to-orange-500/10" },
  { code: "kn", native: "ಕನ್ನಡ", gradient: "from-red-500/10 to-pink-500/10" },
  { code: "ml", native: "മലയാളം", gradient: "from-emerald-500/10 to-teal-500/10" },
  { code: "pa", native: "ਪੰਜਾਬੀ", gradient: "from-blue-500/10 to-cyan-500/10" },
];

export function Multilingual() {
  const { t } = useTranslation();

  return (
    <section className="py-20 md:py-32 bg-muted/30">
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
              {t("landing.multilingualTag")}
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[56px] lg:leading-[1.1]"
          >
            {t("landing.multilingualTitle")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            {t("landing.multilingualSubtitle")}
          </motion.p>
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {languages.map((lang, i) => (
            <motion.div
              key={lang.code}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.2 } }}
              className={`group flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-gradient-to-br ${lang.gradient} p-6 transition-all hover:shadow-lg hover:shadow-primary/5`}
            >
              <span className="text-2xl font-bold text-foreground">
                {lang.native}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
