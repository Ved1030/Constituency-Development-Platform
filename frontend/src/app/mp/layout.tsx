"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MPSidebar } from "@/components/dashboard/Sidebar";
import { TopNavbar } from "@/components/dashboard/TopNavbar";
import { useTranslation } from "@/hooks/use-translation";

export default function MPLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pageTitles: Record<string, string> = {
    "/mp/dashboard": t("mp.sidebar.dashboard"),
    "/mp/copilot": t("mp.sidebar.aiMPCopilot"),
    "/mp/priority-engine": t("mp.sidebar.aiPriorityEngine"),
    "/mp/simulator": t("mp.sidebar.devImpactSimulator"),
    "/mp/projects": t("mp.sidebar.aiProjectComparison"),
    "/mp/recommendations": t("mp.sidebar.policyRecommendation"),
    "/mp/analytics": t("mp.sidebar.constituencyAnalytics"),
    "/mp/need-vs-spend": t("mp.sidebar.needVsSpend"),
    "/mp/complaint-intelligence": t("mp.sidebar.complaintIntelligence"),
    "/mp/constituency-twin": t("mp.sidebar.constituencyDigitalTwin"),
    "/mp/budget": t("mp.sidebar.budgetOptimizer"),
    "/mp/project-monitoring": t("mp.sidebar.projectMonitoring"),
    "/mp/departments": t("mp.sidebar.departmentsSectors"),
    "/mp/settings": t("mp.sidebar.settingsReports"),
  };

  const pageTitle = pageTitles[pathname] || t("mp.portal");

  return (
    <div className="flex min-h-screen bg-background">
      <MPSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <div
        className={`flex flex-1 flex-col transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-[68px]" : "lg:ml-64"
        }`}
      >
        <TopNavbar
          onMenuClick={() => setMobileMenuOpen(true)}
          title={pageTitle}
        />

        <main className="flex-1 p-4 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
