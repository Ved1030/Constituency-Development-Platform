"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  FolderKanban,
  IndianRupee,
  Brain,
  Users,
  ClipboardList,
} from "lucide-react";

interface ActivityItem {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  type: "complaint" | "project" | "budget" | "ai" | "citizen";
}

const typeConfig: Record<string, { icon: typeof AlertTriangle; color: string; bg: string }> = {
  complaint: { icon: AlertTriangle, color: "text-red-600", bg: "bg-red-100" },
  project: { icon: FolderKanban, color: "text-blue-600", bg: "bg-blue-100" },
  budget: { icon: IndianRupee, color: "text-emerald-600", bg: "bg-emerald-100" },
  ai: { icon: Brain, color: "text-purple-600", bg: "bg-purple-100" },
  citizen: { icon: Users, color: "text-amber-600", bg: "bg-amber-100" },
};

interface ActivityCardProps {
  activities: ActivityItem[];
}

export function ActivityCard({ activities }: ActivityCardProps) {
  return (
    <div className="space-y-1">
      {activities.map((activity, i) => {
        const config = typeConfig[activity.type] || typeConfig.complaint;
        const Icon = config.icon;

        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-muted/50"
          >
            <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", config.bg)}>
              <Icon className={cn("size-4", config.color)} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-foreground">{activity.action}</div>
              <div className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{activity.description}</div>
            </div>
            <div className="shrink-0 text-xs text-muted-foreground">{activity.timestamp}</div>
          </motion.div>
        );
      })}
    </div>
  );
}
