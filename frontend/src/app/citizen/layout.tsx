"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CitizenSidebar } from "@/components/citizen/CitizenSidebar";
import { CitizenHeader } from "@/components/citizen/CitizenHeader";
import { useTranslation } from "@/hooks/use-translation";

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pageTitles: Record<string, string> = {
    "/citizen/dashboard": t("citizen.sidebar.dashboard"),
    "/citizen/complaints": t("citizen.sidebar.myComplaints"),
    "/citizen/complaints/new": t("citizen.sidebar.raiseComplaint"),
    "/citizen/tracking": t("citizen.sidebar.trackComplaint"),
    "/citizen/nearby": t("citizen.sidebar.nearbyIssues"),
    "/citizen/voting": t("citizen.sidebar.communityVoting"),
    "/citizen/projects": t("citizen.sidebar.developmentProjects"),
    "/citizen/schemes": t("citizen.sidebar.governmentSchemes"),
    "/citizen/notifications": t("citizen.sidebar.notifications"),
    "/citizen/profile": t("citizen.sidebar.myProfile"),
    "/citizen/help": t("citizen.sidebar.helpSupport"),
  };

  const pageTitle = pageTitles[pathname] || t("citizen.portal");

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <CitizenSidebar
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
        <CitizenHeader
          onMenuClick={() => setMobileMenuOpen(true)}
          title={pageTitle}
        />

        <main className="flex-1 bg-background p-4 lg:p-6">
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
