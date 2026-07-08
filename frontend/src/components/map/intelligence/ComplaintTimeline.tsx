"use client";

import { TimelineEvent, TimelineStage } from "@/types/digital-twin";
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  UserCheck,
  Search,
  Wrench,
  Flag,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const stageIconMap: Record<TimelineStage, { icon: React.ElementType; color: string }> = {
  citizen_reported: { icon: AlertCircle, color: "text-red-500" },
  votes_increased: { icon: ChevronDown, color: "text-amber-500" },
  ai_classified: { icon: CheckCircle2, color: "text-blue-500" },
  officer_assigned: { icon: UserCheck, color: "text-purple-500" },
  inspection: { icon: Search, color: "text-orange-500" },
  repair_started: { icon: Wrench, color: "text-yellow-500" },
  in_progress: { icon: Clock, color: "text-blue-500" },
  resolved: { icon: Flag, color: "text-green-500" },
  citizen_feedback: { icon: CheckCircle2, color: "text-emerald-500" },
};

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const eventVariants = {
  hidden: { opacity: 0, x: -24 },
  show: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 100, damping: 20 } },
};

interface ComplaintTimelineProps {
  events: TimelineEvent[];
}

function formatTimestamp(raw: string): string {
  const d = new Date(raw);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ComplaintTimeline({ events }: ComplaintTimelineProps) {
  if (!events || events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Clock className="mb-2 h-10 w-10" />
        <p className="text-sm">Timeline data not available</p>
      </div>
    );
  }

  const lastCompletedIdx = events.reduce((last, e, i) => (e.completed ? i : last), -1);

  return (
    <div className="relative">
      <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-border" />

      <motion.div className="space-y-0" variants={containerVariants} initial="hidden" animate="show">
        {events.map((event, idx) => {
          const { icon: Icon, color } = stageIconMap[event.stage] ?? { icon: Circle, color: "text-muted-foreground" };
          const isCompleted = event.completed;
          const isCurrent = idx === lastCompletedIdx;

          return (
            <motion.div key={idx} variants={eventVariants} className="relative flex items-start gap-3 pb-6 last:pb-0">
              <div className="relative z-10 flex-shrink-0">
                <div
                  className={cn(
                    "flex h-[40px] w-[40px] items-center justify-center rounded-full border-2 transition-colors",
                    isCompleted
                      ? cn("border-current bg-current", color)
                      : "border-muted-foreground/30 bg-background",
                    isCurrent && "shadow-[0_0_12px_4px] shadow-current/30",
                  )}
                >
                  {isCompleted ? (
                    <Icon className={cn("h-4 w-4 text-white", color.replace("text-", "text-white "))} />
                  ) : (
                    <Icon className={cn("h-4 w-4", "text-muted-foreground/50")} />
                  )}
                </div>
              </div>

              <div
                className={cn(
                  "min-w-0 flex-1 rounded-lg border p-3 transition-all",
                  isCompleted ? "bg-card" : "bg-card/50",
                  isCurrent && "border-current/40",
                )}
              >
                <p
                  className={cn(
                    "text-sm font-semibold",
                    isCompleted ? "" : "text-muted-foreground/60",
                  )}
                >
                  {event.label}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{event.description}</p>
                <p className="mt-1 text-[11px] text-muted-foreground/60">
                  {formatTimestamp(event.timestamp)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
