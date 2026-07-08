"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ChevronRight,
  Bell,
  CheckCheck,
  AlertTriangle,
  Trophy,
  Vote,
  Settings,
  Info,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";

const notifications = [
  {
    id: "NOT-001",
    title: "Complaint Update",
    message: "Your complaint CMP-2024-001 has been assigned to Junior Engineer K. Selvam.",
    type: "status" as const,
    read: false,
    createdAt: "2025-01-10T09:30:00",
  },
  {
    id: "NOT-002",
    title: "New Voting Started",
    message: "Solar Street Lights proposal is now open for community voting. Cast your vote!",
    type: "voting" as const,
    read: false,
    createdAt: "2025-01-09T14:00:00",
  },
  {
    id: "NOT-003",
    title: "Achievement Unlocked!",
    message: "Congratulations! You've earned the 'Top Contributor' badge.",
    type: "achievement" as const,
    read: false,
    createdAt: "2025-01-08T11:45:00",
  },
  {
    id: "NOT-004",
    title: "Nearby Issue Reported",
    message: "A critical road cave-in has been reported near Main Market.",
    type: "alert" as const,
    read: true,
    createdAt: "2025-01-07T16:20:00",
  },
  {
    id: "NOT-005",
    title: "Complaint Resolved",
    message: "Your complaint CMP-2024-004 about medicine shortage has been resolved.",
    type: "status" as const,
    read: true,
    createdAt: "2025-01-05T10:00:00",
  },
  {
    id: "NOT-006",
    title: "Community Request",
    message: "Priya S. from your area needs support for the Road Caving issue.",
    type: "system" as const,
    read: true,
    createdAt: "2025-01-04T08:30:00",
  },
  {
    id: "NOT-007",
    title: "Budget Update",
    message: "₹12.5 Lakh allocated for Ward 7 road repairs. Work begins next week.",
    type: "status" as const,
    read: false,
    createdAt: "2025-01-14T08:00:00",
  },
  {
    id: "NOT-008",
    title: "New Scheme Launched",
    message: "PM Swachh Bharat 2.0 is now available in your constituency. Apply now!",
    type: "system" as const,
    read: true,
    createdAt: "2025-01-12T10:00:00",
  },
];

const typeConfig: Record<string, { icon: typeof Bell; color: string; bg: string }> = {
  status: { icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-50" },
  alert: { icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
  achievement: { icon: Trophy, color: "text-amber-600", bg: "bg-amber-50" },
  voting: { icon: Vote, color: "text-purple-600", bg: "bg-purple-50" },
  system: { icon: Settings, color: "text-gray-600", bg: "bg-gray-50" },
};

export default function NotificationsPage() {
  const { t } = useTranslation();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/citizen/dashboard" className="hover:text-foreground">Dashboard</Link>
        <ChevronRight className="size-3.5" />
        <span className="font-medium text-foreground">{t("citizen.notifications.notifications")}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t("citizen.notifications.notifications")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("citizen.notifications.stayUpdated")}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted">
            <CheckCheck className="size-4" />
            {t("common.markAllRead")}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: t("citizen.notifications.unread"), value: unreadCount, icon: Bell, color: "text-primary", bg: "bg-primary/10" },
          { label: t("citizen.notifications.total"), value: notifications.length, icon: Info, color: "text-muted-foreground", bg: "bg-muted" },
          { label: t("citizen.notifications.thisWeek"), value: 4, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            className="rounded-2xl border border-border bg-card p-4 shadow-sm"
          >
            <div className={cn("flex size-10 items-center justify-center rounded-xl", stat.bg)}>
              <stat.icon className={cn("size-5", stat.color)} />
            </div>
            <div className="mt-3 text-xl font-bold text-foreground">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Notifications List */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="divide-y divide-border">
          {notifications.map((notif, i) => {
            const config = typeConfig[notif.type] || typeConfig.system;
            const Icon = config.icon;

            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className={cn(
                  "flex items-start gap-4 p-5 transition-colors hover:bg-muted/30",
                  !notif.read && "bg-primary/5",
                )}
              >
                <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", config.bg)}>
                  <Icon className={cn("size-5", config.color)} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{notif.title}</span>
                    {!notif.read && <span className="size-2 rounded-full bg-primary" />}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{notif.message}</p>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {new Date(notif.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                {!notif.read && (
                  <button className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10">
                    {t("common.markRead")}
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
