"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CheckCircle, Clock, CircleAlert, Search, Shuffle, UserCheck, Wrench, MapPin } from "lucide-react";

const timelineSteps = [
  { icon: Clock, label: "Submitted", description: "Complaint registered in the system" },
  { icon: Search, label: "AI Verification", description: "AI verifying complaint details and duplicates" },
  { icon: Shuffle, label: "Priority Assigned", description: "AI assigned priority based on severity" },
  { icon: UserCheck, label: "Department Assigned", description: "Complaint routed to concerned department" },
  { icon: Wrench, label: "Work Started", description: "Maintenance team began working on the issue" },
  { icon: CheckCircle, label: "Completed", description: "Issue resolved and verified" },
];

interface ComplaintTimelineProps {
  currentStep: number;
}

export function ComplaintTimeline({ currentStep }: ComplaintTimelineProps) {
  return (
    <div className="space-y-0">
      {timelineSteps.map((step, index) => {
        const isComplete = index < currentStep;
        const isCurrent = index === currentStep;
        const Icon = step.icon;

        return (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.08 }}
            className="relative flex gap-4 pb-8 last:pb-0"
          >
            {index < timelineSteps.length - 1 && (
              <div
                className={cn(
                  "absolute left-4 top-8 w-0.5 -translate-x-1/2 h-[calc(100%+0px)]",
                  isComplete ? "bg-primary" : "bg-muted",
                )}
              />
            )}
            <div
              className={cn(
                "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                isComplete
                  ? "border-primary bg-primary text-white"
                  : isCurrent
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-muted-foreground/20 bg-card text-muted-foreground/40",
              )}
            >
              <Icon className="size-4" />
            </div>
            <div className="min-w-0 pt-0.5">
              <p
                className={cn(
                  "text-sm font-medium",
                  isComplete
                    ? "text-primary"
                    : isCurrent
                      ? "text-foreground"
                      : "text-muted-foreground/60",
                )}
              >
                {step.label}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
              {isCurrent && (
                <div className="mt-2 flex items-center gap-1.5 text-[11px] text-primary">
                  <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                  In progress
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
