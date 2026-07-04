"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ChartCardProps {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export function ChartCard({ title, icon: Icon, children, className, action }: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="size-5 text-primary" />}
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        </div>
        {action}
      </div>
      {children}
    </motion.div>
  );
}
