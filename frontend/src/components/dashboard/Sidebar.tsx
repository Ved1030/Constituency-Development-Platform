"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Bot,
  AlertTriangle,
  Globe,
  GitCompare,
  FileText,
  BarChart3,
  Flame,
  ClipboardList,
  Map,
  IndianRupee,
  FolderKanban,
  Building2,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { useAuth } from "@/context/AuthContext";

interface SidebarLink {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  section: string;
}

const sectionColors: Record<string, string> = {
  "OVERVIEW": "text-primary/60",
  "AI DECISION CENTER": "text-purple-600/60",
  "ANALYTICS": "text-blue-600/60",
  "GEOSPATIAL": "text-emerald-600/60",
  "PROJECTS": "text-amber-600/60",
  "DEPARTMENTS": "text-cyan-600/60",
  "SETTINGS": "text-muted-foreground/60",
};

const sectionKeys: Record<string, string> = {
  "OVERVIEW": "mp.sidebar.overview",
  "AI DECISION CENTER": "mp.sidebar.aiDecisionCenter",
  "ANALYTICS": "mp.sidebar.analytics",
  "GEOSPATIAL": "mp.sidebar.geospatial",
  "PROJECTS": "mp.sidebar.projects",
  "DEPARTMENTS": "mp.sidebar.departments",
  "SETTINGS": "mp.sidebar.settings",
};

interface MPSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function MPSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: MPSidebarProps) {
  const pathname = usePathname();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const { t } = useTranslation();
  const { user, logout, getUserInitials } = useAuth();

  const mpSidebarLinks: SidebarLink[] = [
    { href: "/mp/dashboard", label: t("mp.sidebar.dashboard"), icon: LayoutDashboard, section: "OVERVIEW" },
    { href: "/mp/copilot", label: t("mp.sidebar.aiMPCopilot"), icon: Bot, section: "AI DECISION CENTER" },
    { href: "/mp/priority-engine", label: t("mp.sidebar.aiPriorityEngine"), icon: AlertTriangle, section: "AI DECISION CENTER" },
    { href: "/mp/simulator", label: t("mp.sidebar.devImpactSimulator"), icon: Globe, section: "AI DECISION CENTER" },
    { href: "/mp/projects", label: t("mp.sidebar.aiProjectComparison"), icon: GitCompare, section: "AI DECISION CENTER" },
    { href: "/mp/recommendations", label: t("mp.sidebar.policyRecommendation"), icon: FileText, section: "AI DECISION CENTER" },
    { href: "/mp/analytics", label: t("mp.sidebar.constituencyAnalytics"), icon: BarChart3, section: "ANALYTICS" },
    { href: "/mp/need-vs-spend", label: t("mp.sidebar.needVsSpend"), icon: Flame, section: "ANALYTICS" },
    { href: "/mp/complaint-intelligence", label: t("mp.sidebar.complaintIntelligence"), icon: ClipboardList, section: "ANALYTICS" },
    { href: "/mp/constituency-twin", label: t("mp.sidebar.constituencyDigitalTwin"), icon: Map, section: "GEOSPATIAL" },
    { href: "/mp/budget", label: t("mp.sidebar.budgetOptimizer"), icon: IndianRupee, section: "PROJECTS" },
    { href: "/mp/project-monitoring", label: t("mp.sidebar.projectMonitoring"), icon: FolderKanban, section: "PROJECTS" },
    { href: "/mp/departments", label: t("mp.sidebar.departmentsSectors"), icon: Building2, section: "DEPARTMENTS" },
    { href: "/mp/settings", label: t("mp.sidebar.settingsReports"), icon: Settings, section: "SETTINGS" },
  ];

  const sections = mpSidebarLinks.reduce<Record<string, SidebarLink[]>>((acc, link) => {
    if (!acc[link.section]) acc[link.section] = [];
    acc[link.section].push(link);
    return acc;
  }, {});

  const sidebarContent = (
    <div className="flex h-full flex-col bg-card">
      {/* Logo / Brand */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-border px-4">
        <Link href="/mp/dashboard" className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-xs font-bold text-white shadow-md shadow-primary/20">
            CD
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col"
            >
              <span className="text-sm font-bold text-foreground leading-tight">{t("mp.portal")}</span>
              <span className="text-[10px] text-primary/60 font-medium leading-tight">{t("mp.governanceCommand")}</span>
            </motion.div>
          )}
        </Link>
        <button
          onClick={onToggle}
          className="ml-auto hidden items-center justify-center rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:flex"
        >
          {collapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {Object.entries(sections).map(([section, links], sIdx) => (
          <div key={section} className={cn(sIdx > 0 && "mt-6")}>
            {!collapsed && (
              <div className={cn("mb-2 px-3 text-[10px] font-bold tracking-widest uppercase", sectionColors[section] || "text-muted-foreground/60")}>
                {t(sectionKeys[section] || section)}
              </div>
            )}
            {collapsed && section !== "OVERVIEW" && (
              <div className="mx-auto my-2 h-px w-6 bg-border" />
            )}
            <div className="space-y-0.5">
              {links.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={mobileOpen ? onMobileClose : undefined}
                    onMouseEnter={() => setHoveredLink(link.href)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200",
                      collapsed && "justify-center px-2",
                      isActive
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                    title={collapsed ? link.label : undefined}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="mp-sidebar-active"
                        className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <Icon className={cn(
                      "size-5 shrink-0 transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                    )} />
                    {!collapsed && <span className="truncate">{link.label}</span>}

                    {collapsed && hoveredLink === link.href && (
                      <div className="pointer-events-none absolute left-full z-50 ml-3 -translate-y-0 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-lg whitespace-nowrap">
                        {link.label}
                        <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 rotate-45 size-2 border border-r-0 border-b-0 border-border bg-card" />
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* MP Profile */}
      <div className="shrink-0 border-t border-border p-3">
        <div
          className={cn(
            "flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-muted",
            collapsed && "justify-center",
          )}
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-white shadow-md shadow-primary/20">
            {getUserInitials()}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-foreground">{user?.name || "MP"}</div>
              <div className="truncate text-xs text-muted-foreground">MP, {user?.constituency}</div>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={logout}
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="size-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 hidden h-screen border-r border-border bg-card transition-all duration-300 lg:block",
          collapsed ? "w-[68px]" : "w-64",
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={onMobileClose}
          >
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 h-full w-72 border-r border-border bg-card shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex h-16 items-center justify-between border-b border-border px-4">
                <Link href="/mp/dashboard" className="flex items-center gap-2.5">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-xs font-bold text-white shadow-md shadow-primary/20">
                    CD
                  </div>
                  <span className="text-sm font-bold text-foreground">{t("mp.portal")}</span>
                </Link>
                <button
                  onClick={onMobileClose}
                  className="flex items-center justify-center rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="overflow-y-auto px-3 py-4">
                {Object.entries(sections).map(([section, links], sIdx) => (
                  <div key={section} className={cn(sIdx > 0 && "mt-6")}>
                    <div className={cn("mb-2 px-3 text-[10px] font-bold tracking-widest uppercase", sectionColors[section] || "text-muted-foreground/60")}>
                      {t(sectionKeys[section] || section)}
                    </div>
                    <div className="space-y-0.5">
                      {links.map((link) => {
                        const isActive = pathname === link.href;
                        const Icon = link.icon;
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={onMobileClose}
                            className={cn(
                              "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all",
                              isActive
                                ? "bg-primary/10 text-primary shadow-sm"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground",
                            )}
                          >
                            {isActive && (
                              <motion.div
                                layoutId="mp-sidebar-active-mobile"
                                className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary"
                                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                              />
                            )}
                            <Icon className={cn("size-5 shrink-0", isActive && "text-primary")} />
                            <span className="truncate">{link.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
