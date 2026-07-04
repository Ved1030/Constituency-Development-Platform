"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationButtonProps {
  count?: number;
  className?: string;
}

export function NotificationButton({
  count = 0,
  className,
}: NotificationButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Notifications"
      >
        <Bell className="size-4" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute right-0 mt-2 w-72 overflow-hidden rounded-lg border border-border bg-card shadow-lg"
          >
            <div className="border-b border-border px-4 py-3 text-sm font-medium text-foreground">
              Notifications
            </div>
            <div className="p-4 text-center text-sm text-muted-foreground">
              No new notifications
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
