"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Info,
  Trophy,
  Bell,
  Brain,
  X,
} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "urgent" | "info" | "achievement" | "system" | "ai";
  read: boolean;
  createdAt: string;
}

const typeConfig: Record<string, { icon: typeof AlertTriangle; color: string; bg: string }> = {
  urgent: { icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
  info: { icon: Info, color: "text-blue-600", bg: "bg-blue-50" },
  achievement: { icon: Trophy, color: "text-amber-600", bg: "bg-amber-50" },
  system: { icon: Bell, color: "text-gray-600", bg: "bg-gray-50" },
  ai: { icon: Brain, color: "text-purple-600", bg: "bg-purple-50" },
};

interface NotificationCardProps {
  notifications: Notification[];
}

export function NotificationCard({ notifications }: NotificationCardProps) {
  return (
    <div className="space-y-2">
      {notifications.map((notif, i) => {
        const config = typeConfig[notif.type] || typeConfig.info;
        const Icon = config.icon;

        return (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className={cn(
              "flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-muted/50",
              !notif.read && "bg-primary/5",
            )}
          >
            <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", config.bg)}>
              <Icon className={cn("size-4", config.color)} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{notif.title}</span>
                {!notif.read && <span className="size-2 rounded-full bg-primary" />}
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{notif.message}</div>
              <div className="mt-1 text-[10px] text-muted-foreground">{notif.createdAt}</div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
