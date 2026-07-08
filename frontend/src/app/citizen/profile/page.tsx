"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Shield,
  Globe,
  LogOut,
  ChevronRight,
  Moon,
  Smartphone,
  Mail,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { useAuth } from "@/context/AuthContext";
import { fetchMyDashboardStats } from "@/services/supabase/complaints";

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ totalComplaints: 0, resolvedComplaints: 0, participationScore: 0 });
  const [darkMode, setDarkMode] = useState(false);
  const [mobileAlerts, setMobileAlerts] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMyDashboardStats(user.id)
        .then((s) => setStats({ totalComplaints: s.totalComplaints, resolvedComplaints: s.resolvedComplaints, participationScore: s.participationScore }))
        .catch(() => {});
    }
  }, [user]);

  const userName = user?.full_name || "Citizen";
  const userEmail = user?.email || "";
  const userConstituency = user?.constituency || "";
  const initials = userName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  const settingsSections = [
    {
      title: t("citizen.profile.preferences"),
      items: [
        { icon: Globe, label: t("citizen.profile.language"), value: "English" },
        { icon: Bell, label: t("citizen.profile.notifications"), value: t("citizen.profile.pushEmail") },
        { icon: Moon, label: t("citizen.profile.darkMode"), value: t("citizen.profile.off"), toggle: true },
        { icon: Smartphone, label: t("citizen.profile.mobileAlerts"), value: t("citizen.profile.sms"), toggle: true },
      ],
    },
    {
      title: t("citizen.profile.account"),
      items: [
        { icon: Shield, label: t("citizen.profile.privacy"), value: t("citizen.profile.manage") },
        { icon: Mail, label: t("citizen.profile.emailPreferences"), value: t("citizen.profile.weeklyDigest") },
      ],
    },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-start gap-5">
          <div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-lg font-bold text-white shadow-md">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-foreground">{userName}</h2>
            <p className="text-sm text-muted-foreground">{userConstituency}</p>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
              {userEmail && (
                <span className="flex items-center gap-1">
                  <Mail className="size-3" />
                  {userEmail}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-xl bg-primary/5 px-5 py-3">
            <span className="text-2xl font-bold text-primary">{stats.participationScore}</span>
            <span className="text-[11px] font-medium text-muted-foreground">Score</span>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Activity Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Activity className="size-5 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">{t("citizen.profile.activityOverview")}</h3>
            </div>
            <div className="grid grid-cols-3 gap-4 rounded-xl bg-muted/50 p-4">
              <div className="text-center">
                <div className="text-lg font-bold text-foreground">{stats.totalComplaints}</div>
                <div className="text-[11px] text-muted-foreground">{t("citizen.profile.complaints")}</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-success">{stats.resolvedComplaints}</div>
                <div className="text-[11px] text-muted-foreground">{t("citizen.profile.resolved")}</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-primary">
                  {stats.totalComplaints > 0 ? Math.round((stats.resolvedComplaints / stats.totalComplaints) * 100) : 0}%
                </div>
                <div className="text-[11px] text-muted-foreground">{t("citizen.profile.resolutionRate")}</div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          {settingsSections.map((section) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <h3 className="text-sm font-semibold text-foreground mb-4">{section.title}</h3>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="size-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{item.label}</span>
                    </div>
                    {"toggle" in item ? (
                      <button
                        onClick={() => {
                          if (item.label === t("citizen.profile.darkMode")) setDarkMode(!darkMode);
                          if (item.label === t("citizen.profile.mobileAlerts")) setMobileAlerts(!mobileAlerts);
                        }}
                        className={cn(
                          "relative h-5 w-9 rounded-full transition-colors",
                          (item.label === t("citizen.profile.darkMode") && darkMode) || (item.label === t("citizen.profile.mobileAlerts") && mobileAlerts)
                            ? "bg-primary"
                            : "bg-muted-foreground/30",
                        )}
                      >
                        <span
                          className={cn(
                            "absolute left-0.5 top-0.5 size-4 rounded-full bg-white transition-transform shadow-sm",
                            ((item.label === t("citizen.profile.darkMode") && darkMode) || (item.label === t("citizen.profile.mobileAlerts") && mobileAlerts)) && "translate-x-4",
                          )}
                        />
                      </button>
                    ) : (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">{item.value}</span>
                        <ChevronRight className="size-3 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              variant="outline"
              className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/5 border-destructive/30"
              onClick={handleLogout}
            >
              <LogOut className="size-4" />
              {t("citizen.profile.signOut")}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
