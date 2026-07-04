"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}

export function DashboardCard({ title, children, className, icon: Icon, action }: DashboardCardProps) {
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
      <div className="mb-4 flex items-center justify-between">
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
