"use client";

import { cn } from "@/lib/utils";

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
  },
  verified: {
    label: "AI Verified",
    className: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
  },
  resolved: {
    label: "Resolved",
    className: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  },
};

type Status = keyof typeof statusConfig;

interface ComplaintStatusBadgeProps {
  status: Status;
  className?: string;
}

export function ComplaintStatusBadge({ status, className }: ComplaintStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        config.className,
        className,
      )}
    >
      <span className={cn("mr-1 size-1.5 rounded-full", {
        "bg-yellow-500": status === "pending",
        "bg-blue-500": status === "verified",
        "bg-purple-500": status === "in-progress",
        "bg-green-500": status === "resolved",
        "bg-red-500": status === "rejected",
      })} />
      {config.label}
    </span>
  );
}
