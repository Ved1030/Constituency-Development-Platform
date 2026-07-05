"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  MapPin,
  Map,
  Vote,
  FolderKanban,
  Target,
  Bell,
  User,
  HelpCircle,
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
  badge?: number;
}

interface SidebarSection {
  title: string;
  links: SidebarLink[];
}

interface CitizenSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function CitizenSidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: CitizenSidebarProps) {
  const pathname = usePathname();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const { t } = useTranslation();
  const { user, logout, getUserInitials } = useAuth();

  const sidebarSections: SidebarSection[] = [
    {
      title: t("citizen.sidebar.main"),
      links: [
        { href: "/citizen/dashboard", label: t("citizen.sidebar.dashboard"), icon: LayoutDashboard },
        { href: "/citizen/complaints/new", label: t("citizen.sidebar.raiseComplaint"), icon: PlusCircle },
        { href: "/citizen/complaints", label: t("citizen.sidebar.myComplaints"), icon: ClipboardList, badge: 12 },
        { href: "/citizen/tracking", label: t("citizen.sidebar.trackComplaint"), icon: MapPin },
      ],
    },
    {
      title: t("citizen.sidebar.community"),
      links: [
        { href: "/citizen/nearby", label: t("citizen.sidebar.nearbyIssues"), icon: Map, badge: 5 },
        { href: "/citizen/voting", label: t("citizen.sidebar.communityVoting"), icon: Vote, badge: 3 },
        { href: "/citizen/projects", label: t("citizen.sidebar.developmentProjects"), icon: FolderKanban },
      ],
    },
    {
      title: t("citizen.sidebar.government"),
      links: [
        { href: "/citizen/schemes", label: t("citizen.sidebar.governmentSchemes"), icon: Target },
        { href: "/citizen/notifications", label: t("citizen.sidebar.notifications"), icon: Bell, badge: 5 },
      ],
    },
    {
      title: t("citizen.sidebar.account"),
      links: [
        { href: "/citizen/profile", label: t("citizen.sidebar.myProfile"), icon: User },
        { href: "/citizen/help", label: t("citizen.sidebar.helpSupport"), icon: HelpCircle },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-border px-4">
        <Link href="/citizen/dashboard" className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-xs font-bold text-white shadow-md shadow-primary/20">
            CD
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden whitespace-nowrap text-sm font-bold text-foreground"
            >
              {t("citizen.portal")}
            </motion.span>
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
        {sidebarSections.map((section, sIdx) => (
          <div key={section.title} className={cn(sIdx > 0 && "mt-6")}>
            {!collapsed && (
              <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                {section.title}
              </div>
            )}
            <div className="space-y-0.5">
              {section.links.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;

                const linkEl = (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={mobileOpen ? onMobileClose : undefined}
                    onMouseEnter={() => setHoveredLink(link.href)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      collapsed && "justify-center px-2",
                    )}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}

                    <Icon className={cn("size-5 shrink-0 transition-colors", isActive && "text-primary")} />

                    {!collapsed && (
                      <>
                        <span className="flex-1 truncate">{link.label}</span>
                        {link.badge !== undefined && (
                          <span
                            className={cn(
                              "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
                              isActive
                                ? "bg-primary text-white"
                                : "bg-primary/10 text-primary",
                            )}
                          >
                            {link.badge}
                          </span>
                        )}
                      </>
                    )}

                    {/* Tooltip when collapsed */}
                    {collapsed && hoveredLink === link.href && (
                      <div className="pointer-events-none absolute left-full z-50 ml-3 -translate-y-0 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-lg whitespace-nowrap">
                        {link.label}
                        {link.badge !== undefined && (
                          <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 px-1.5 text-[10px] font-bold text-primary">
                            {link.badge}
                          </span>
                        )}
                        <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 rotate-45 size-2 border border-r-0 border-b-0 border-border bg-card" />
                      </div>
                    )}
                  </Link>
                );

                return linkEl;
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User footer */}
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
              <div className="truncate text-sm font-medium text-foreground">
                {user?.name || "Citizen"}
              </div>
              <div className="truncate text-xs text-muted-foreground">
                {user?.constituency}, {user?.district}
              </div>
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
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 hidden h-screen border-r border-border bg-card transition-all duration-300 lg:block",
          collapsed ? "w-[68px]" : "w-64",
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
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
                <Link href="/citizen/dashboard" className="flex items-center gap-2.5">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-xs font-bold text-white shadow-md shadow-primary/20">
                    CD
                  </div>
                  <span className="text-sm font-bold text-foreground">
                    {t("citizen.portal")}
                  </span>
                </Link>
                <button
                  onClick={onMobileClose}
                  className="flex items-center justify-center rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="overflow-y-auto px-3 py-4">
                {sidebarSections.map((section, sIdx) => (
                  <div key={section.title} className={cn(sIdx > 0 && "mt-6")}>
                    <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                      {section.title}
                    </div>
                    <div className="space-y-0.5">
                      {section.links.map((link) => {
                        const isActive = pathname === link.href;
                        const Icon = link.icon;
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={onMobileClose}
                            className={cn(
                              "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                              isActive
                                ? "bg-primary/10 text-primary shadow-sm"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground",
                            )}
                          >
                            {isActive && (
                              <motion.div
                                layoutId="sidebar-active-mobile"
                                className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary"
                                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                              />
                            )}
                            <Icon className={cn("size-5 shrink-0", isActive && "text-primary")} />
                            <span className="flex-1 truncate">{link.label}</span>
                            {link.badge !== undefined && (
                              <span
                                className={cn(
                                  "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
                                  isActive
                                    ? "bg-primary text-white"
                                    : "bg-primary/10 text-primary",
                                )}
                              >
                                {link.badge}
                              </span>
                            )}
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