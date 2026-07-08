"use client";

import { motion } from "framer-motion";
import { Bell, TriangleAlert, Award, Vote, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types/citizen";

const typeConfig = {
  status: { icon: Bell, className: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" },
  alert: { icon: TriangleAlert, className: "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400" },
  achievement: { icon: Award, className: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400" },
  voting: { icon: Vote, className: "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400" },
  system: { icon: Info, className: "bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400" },
};

interface NotificationCardProps {
  notification: Notification;
  index?: number;
}

export function NotificationCard({ notification, index = 0 }: NotificationCardProps) {
  const config = typeConfig[notification.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className={cn(
        "flex gap-3 rounded-xl border border-border p-4 transition-colors",
        !notification.read ? "bg-primary/[0.02] border-primary/10" : "bg-card",
      )}
    >
      <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", config.className)}>
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-medium text-foreground">{notification.title}</h4>
          {!notification.read && <span className="size-2 shrink-0 rounded-full bg-primary" />}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{notification.message}</p>
        <span className="mt-1 block text-[10px] text-muted-foreground">{notification.createdAt}</span>
      </div>
    </motion.div>
  );
}
