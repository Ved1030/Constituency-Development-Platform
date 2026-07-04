"use client";

import { useState } from "react";
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
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProfileCard } from "@/components/citizen/ProfileCard";
import { citizenUser, contributionGraph } from "@/data/mock-citizen";
import { useTranslation } from "@/hooks/use-translation";

export default function ProfilePage() {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [mobileAlerts, setMobileAlerts] = useState(true);

  const totalInteractions = contributionGraph.reduce((acc, m) => acc + m.complaints + m.votes, 0);
  const maxComplaints = Math.max(...contributionGraph.map((m) => m.complaints));
  const maxVotes = Math.max(...contributionGraph.map((m) => m.votes));

  const settingsSections = [
    {
      title: t("citizen.profile.preferences"),
      items: [
        { icon: Globe, label: t("citizen.profile.language"), value: citizenUser.preferredLanguage },
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

  const achievements = [
    { label: t("citizen.profile.earlyAdopter"), description: t("citizen.profile.joinedFirst1000"), progress: 100, color: "bg-primary" },
    { label: t("citizen.profile.problemSolver"), description: t("citizen.profile.complaintsResolved10"), progress: 90, color: "bg-success" },
    { label: t("citizen.profile.voiceOfMonth"), description: t("citizen.profile.mostUpvoted"), progress: 100, color: "bg-amber-500" },
    { label: t("citizen.profile.topContributor"), description: t("citizen.profile.communityPoints500"), progress: 84, color: "bg-purple-500" },
    { label: t("citizen.profile.superVoter"), description: t("citizen.profile.votedOn20"), progress: 35, color: "bg-blue-500" },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <ProfileCard user={citizenUser} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Activity className="size-5 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">{t("citizen.profile.activityOverview")}</h3>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-primary" />
                  {t("citizen.profile.complaints")}
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-accent" />
                  {t("citizen.profile.votes")}
                </span>
              </div>
            </div>

            <div className="flex items-end gap-3 h-32">
              {contributionGraph.map((month) => (
                <div key={month.month} className="flex flex-1 flex-col items-center gap-1">
                  <div className="flex flex-1 w-full items-end gap-0.5">
                    <div
                      className="flex-1 rounded-t-sm bg-primary/70 transition-all hover:bg-primary"
                      style={{ height: `${(month.complaints / maxComplaints) * 100}%` }}
                    />
                    <div
                      className="flex-1 rounded-t-sm bg-accent/70 transition-all hover:bg-accent"
                      style={{ height: `${(month.votes / maxVotes) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{month.month}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 rounded-xl bg-muted/50 p-4">
              <div className="text-center">
                <div className="text-lg font-bold text-foreground">{totalInteractions}</div>
                <div className="text-[11px] text-muted-foreground">{t("citizen.profile.totalActivities")}</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-primary">{citizenUser.totalComplaints}</div>
                <div className="text-[11px] text-muted-foreground">{t("citizen.profile.complaints")}</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-accent">33</div>
                <div className="text-[11px] text-muted-foreground">{t("citizen.profile.votesCast")}</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="size-5 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">{t("citizen.profile.achievements")}</h3>
            </div>
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div key={achievement.label} className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{achievement.label}</span>
                      <span className="text-xs text-muted-foreground">{achievement.progress}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all", achievement.color)}
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
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
            <Button variant="outline" className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/5 border-destructive/30">
              <LogOut className="size-4" />
              {t("citizen.profile.signOut")}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
