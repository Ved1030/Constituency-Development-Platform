"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MPSidebar } from "@/components/dashboard/Sidebar";
import { TopNavbar } from "@/components/dashboard/TopNavbar";

const pageTitles: Record<string, string> = {
  "/mp/dashboard": "Dashboard",
  "/mp/copilot": "AI MP Copilot",
  "/mp/priority-engine": "Priority Engine",
  "/mp/simulator": "Impact Simulator",
  "/mp/projects": "AI Project Comparison",
  "/mp/recommendations": "Policy Recommendation",
  "/mp/analytics": "Constituency Analytics",
  "/mp/need-vs-spend": "Need vs Spend",
  "/mp/complaint-intelligence": "Complaint Intelligence",
  "/mp/constituency-twin": "Constituency Digital Twin",
  "/mp/budget": "Budget Optimizer",
  "/mp/project-monitoring": "Project Monitoring",
  "/mp/departments": "Departments & Sectors",
  "/mp/settings": "Settings & Reports",
};

export default function MPLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pageTitle = pageTitles[pathname] || "MP Portal";

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
