"use client";

import { motion } from "framer-motion";
import { Settings, User, Bell, Shield, FileText, Download, Globe, Database } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";

export default function SettingsPage() {
  const { t } = useTranslation();

  const settingsSections = [
    {
      title: t("mp.settings.profile"),
      icon: User,
      items: [
        { label: t("mp.settings.mpName"), value: "Dr. Rajesh Kumar Sharma" },
        { label: t("mp.settings.constituency"), value: "North Chennai" },
        { label: t("mp.settings.state"), value: "Tamil Nadu" },
        { label: t("mp.settings.party"), value: "Indian National Congress" },
        { label: t("mp.settings.email"), value: "rajesh.sharma@parliament.gov.in" },
        { label: t("mp.settings.phone"), value: "+91 98765 43210" },
      ],
    },
    {
      title: t("mp.settings.notifications"),
      icon: Bell,
      items: [
        { label: t("mp.settings.criticalAlerts"), value: t("mp.settings.enabled"), toggle: true },
        { label: t("mp.settings.aiInsights"), value: t("mp.settings.enabled"), toggle: true },
        { label: t("mp.settings.budgetAlerts"), value: t("mp.settings.enabled"), toggle: true },
        { label: t("mp.settings.projectUpdates"), value: t("mp.settings.enabled"), toggle: true },
        { label: t("mp.settings.weeklyDigest"), value: t("mp.settings.enabled"), toggle: true },
      ],
    },
    {
      title: t("mp.settings.reports"),
      icon: FileText,
      items: [
        { label: t("mp.settings.budgetUtilizationReport"), value: "Q4 2024" },
        { label: t("mp.settings.complaintSummary"), value: "January 2025" },
        { label: t("mp.settings.projectStatusReport"), value: "Monthly" },
        { label: t("mp.settings.aiPerformanceReport"), value: "Quarterly" },
      ],
    },
  ];

  const downloadableReports = [
    { name: "Constituency Annual Report 2024", size: "2.4 MB", date: "Jan 2025" },
    { name: "Budget Utilization Q4 2024", size: "1.1 MB", date: "Jan 2025" },
    { name: "AI Performance Assessment", size: "890 KB", date: "Jan 2025" },
    { name: "Complaint Resolution Analytics", size: "1.8 MB", date: "Dec 2024" },
    { name: "MPLADS Fund Utilization", size: "650 KB", date: "Dec 2024" },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2">
          <Settings className="size-5 text-muted-foreground" />
          <h1 className="text-2xl font-bold text-foreground">{t("mp.settings.settingsReports")}</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{t("mp.settings.manageProfileNotifications")}</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {settingsSections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="mb-4 flex items-center gap-2">
              <section.icon className="size-5 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
            </div>
            <div className="space-y-3">
              {section.items.map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  {"toggle" in item && item.toggle ? (
                    <div className="size-10 rounded-full bg-primary/20 p-0.5 cursor-pointer">
                      <div className="size-full rounded-full bg-primary shadow-lg" />
                    </div>
                  ) : (
                    <span className="text-sm font-medium text-foreground/70">{item.value}</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <div className="mb-4 flex items-center gap-2">
          <Download className="size-5 text-emerald-600" />
          <h3 className="text-sm font-semibold text-foreground">{t("mp.settings.downloadableReports")}</h3>
        </div>
        <div className="space-y-2">
          {downloadableReports.map((report) => (
            <div key={report.name} className="flex items-center justify-between rounded-lg bg-muted/50 p-4 hover:bg-muted transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50">
                  <FileText className="size-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{report.name}</div>
                  <div className="text-[11px] text-muted-foreground/60">{report.size} | {report.date}</div>
                </div>
              </div>
              <Download className="size-4 text-muted-foreground hover:text-foreground/60 transition-colors" />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
