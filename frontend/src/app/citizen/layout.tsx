"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CitizenSidebar } from "@/components/citizen/CitizenSidebar";
import { CitizenHeader } from "@/components/citizen/CitizenHeader";

const pageTitles: Record<string, string> = {
  "/citizen/dashboard": "Dashboard",
  "/citizen/complaints": "My Complaints",
  "/citizen/complaints/new": "Raise a Complaint",
  "/citizen/tracking": "Track Complaints",
  "/citizen/nearby": "Nearby Issues",
  "/citizen/voting": "Community Voting",
  "/citizen/projects": "Development Projects",
  "/citizen/schemes": "Government Schemes",
  "/citizen/notifications": "Notifications",
  "/citizen/profile": "My Profile",
  "/citizen/help": "Help & Support",
};

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pageTitle = pageTitles[pathname] || "Citizen Portal";

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
