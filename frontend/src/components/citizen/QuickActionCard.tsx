"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface QuickActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  gradient: string;
  index?: number;
}

export function QuickActionCard({
  icon: Icon,
  title,
  description,
  href,
  gradient,
  index = 0,
}: QuickActionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link
        href={href}
        className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5"
      >
        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md transition-all group-hover:scale-110 group-hover:shadow-lg",
            gradient,
          )}
        >
          <Icon className="size-6" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
