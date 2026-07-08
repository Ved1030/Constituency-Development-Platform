"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Bot,
  AlertTriangle,
  FileText,
  ClipboardList,
  Hash,
  Map,
  Globe,
  GitCompare,
  IndianRupee,
  FolderKanban,
  Flame,
  Building2,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface NavSection {
  name: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    name: "Overview",
    items: [
      { href: "/mp/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    name: "AI Decision Center",
    items: [
      { href: "/mp/copilot", label: "AI Copilot", icon: Bot },
      { href: "/mp/priority-engine", label: "AI Priority Engine", icon: AlertTriangle },
      { href: "/mp/recommendations", label: "AI Recommendations", icon: FileText },
    ],
  },
  {
    name: "Constituency Intelligence",
    items: [
      { href: "/mp/complaint-intelligence", label: "Complaint Intelligence", icon: ClipboardList },
      { href: "/mp/social-intelligence", label: "Social Intelligence", icon: Hash },
      { href: "/mp/constituency-twin", label: "Digital Twin", icon: Map },
    ],
  },
  {
    name: "Projects & Planning",
    items: [
      { href: "/mp/simulator", label: "Dev Impact Simulator", icon: Globe },
      { href: "/mp/projects", label: "Project Comparison", icon: GitCompare },
      { href: "/mp/budget", label: "Budget Optimizer", icon: IndianRupee },
      { href: "/mp/project-monitoring", label: "Project Monitoring", icon: FolderKanban },
    ],
  },
  {
    name: "Analytics",
    items: [
      { href: "/mp/need-vs-spend", label: "Need vs Spend", icon: Flame },
      { href: "/mp/departments", label: "Departments & Sectors", icon: Building2 },
    ],
  },
  {
    name: "Settings",
    items: [
      { href: "/mp/settings", label: "Settings & Reports", icon: Settings },
    ],
  },
];

interface MPSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

// ─── Saffron accent orange ──────────────────────────────────────────────
const ACCENT_COLOR = "#f59e0b";

export function MPSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: MPSidebarProps) {
  const pathname = usePathname();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const { user, logout, getUserInitials } = useAuth();

  const isActive = (href: string) => pathname === href;

  const sidebarContent = (
    <div
      className="flex h-full flex-col"
      style={{
        background: "linear-gradient(180deg, #0f2d5c 0%, #123b7a 50%, #0f2d5c 100%)",
      }}
    >
      {/* ─── Logo / Brand ─── */}
      <div className="flex h-14 shrink-0 items-center gap-3 border-b border-white/[0.06] px-4">
        <Link href="/mp/dashboard" className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-xs font-bold text-white shadow-sm ring-1 ring-white/20 backdrop-blur-sm">
            CD
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col"
            >
              <span className="text-sm font-bold text-white leading-tight tracking-tight">
                AI Governance
              </span>
              <span className="text-[9px] text-white/50 font-medium leading-tight tracking-wider uppercase">
                Command Center
              </span>
            </motion.div>
          )}
        </Link>
        <button
          onClick={onToggle}
          className="ml-auto hidden items-center justify-center rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white/80 lg:flex"
        >
          {collapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </button>
      </div>

      {/* ─── Navigation ─── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin" style={{ scrollbarWidth: "thin" }}>
        {NAV_SECTIONS.map((section, sIdx) => (
          <div key={section.name} className={cn(sIdx > 0 && "mt-5")}>
            {!collapsed && (
              <div className="mb-1.5 px-3 text-[9px] font-bold tracking-[0.12em] uppercase text-white/30">
                {section.name}
              </div>
            )}
            {collapsed && sIdx > 0 && (
              <div className="mx-auto my-2 h-px w-5 bg-white/[0.08]" />
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={mobileOpen ? onMobileClose : undefined}
                    onMouseEnter={() => setHoveredLink(item.href)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200",
                      collapsed && "justify-center px-2",
                      active
                        ? "bg-white/10 text-white shadow-sm"
                        : "text-white/60 hover:bg-white/[0.06] hover:text-white/90",
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    {/* Orange accent bar on active item */}
                    {active && (
                      <motion.div
                        layoutId="mp-sidebar-active"
                        className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-r-full"
                        style={{ backgroundColor: ACCENT_COLOR }}
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}

                    <Icon
                      className={cn(
                        "size-[18px] shrink-0 transition-colors",
                        active ? "text-white" : "text-white/50 group-hover:text-white/80",
                      )}
                    />

                    {!collapsed && <span className="truncate">{item.label}</span>}

                    {/* Saffron 'AI' badge for AI Decision Center items */}
                    {section.name === "AI Decision Center" && (
                      <span
                        className="ml-auto rounded px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wider"
                        style={{
                          backgroundColor: "rgba(245, 158, 11, 0.2)",
                          color: "#fbbf24",
                        }}
                      >
                        AI
                      </span>
                    )}

                    {/* Tooltip on hover when collapsed */}
                    {collapsed && hoveredLink === item.href && (
                      <div className="pointer-events-none absolute left-full z-50 ml-3 -translate-y-0 rounded-lg border border-white/10 bg-[#0f2d5c] px-3 py-2 text-xs font-medium text-white shadow-xl whitespace-nowrap">
                        {item.label}
                        <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 rotate-45 size-2 border border-r-0 border-b-0 border-white/10 bg-[#0f2d5c]" />
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ─── MP Profile ─── */}
      <div className="shrink-0 border-t border-white/[0.06] p-3">
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg p-2 transition-colors",
            collapsed && "justify-center",
            "hover:bg-white/[0.06]",
          )}
        >
          <div
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-sm"
            style={{
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
            }}
          >
            {getUserInitials()}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-medium text-white/90">
                {user?.name || "MP"}
              </div>
              <div className="truncate text-[10px] text-white/40">
                MP, {user?.constituency}
              </div>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={logout}
              className="rounded-lg p-1.5 text-white/30 transition-colors hover:bg-white/10 hover:text-red-400"
            >
              <LogOut className="size-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ─── Desktop Sidebar ─── */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 hidden h-screen transition-all duration-300 lg:block",
          collapsed ? "w-[68px]" : "w-60",
        )}
        style={{ boxShadow: "4px 0 24px rgba(0, 0, 0, 0.15)" }}
      >
        {sidebarContent}
      </aside>

      {/* ─── Mobile Sidebar ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={onMobileClose}
          >
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 h-full w-64 shadow-2xl"
              style={{
                background: "linear-gradient(180deg, #0f2d5c 0%, #123b7a 100%)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex h-14 items-center justify-between border-b border-white/[0.06] px-4">
                <Link href="/mp/dashboard" className="flex items-center gap-2.5">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-white/10 text-xs font-bold text-white shadow-sm ring-1 ring-white/20">
                    CD
                  </div>
                  <span className="text-sm font-bold text-white">AI Governance</span>
                </Link>
                <button
                  onClick={onMobileClose}
                  className="flex items-center justify-center rounded-lg p-1.5 text-white/40 hover:bg-white/10 hover:text-white/80"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="overflow-y-auto px-3 py-4">
                {NAV_SECTIONS.map((section, sIdx) => (
                  <div key={section.name} className={cn(sIdx > 0 && "mt-5")}>
                    <div className="mb-1.5 px-3 text-[9px] font-bold tracking-[0.12em] uppercase text-white/30">
                      {section.name}
                    </div>
                    <div className="space-y-0.5">
                      {section.items.map((item) => {
                        const active = isActive(item.href);
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={onMobileClose}
                            className={cn(
                              "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all",
                              active
                                ? "bg-white/10 text-white shadow-sm"
                                : "text-white/60 hover:bg-white/[0.06] hover:text-white/90",
                            )}
                          >
                            {active && (
                              <motion.div
                                layoutId="mp-sidebar-active-mobile"
                                className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-r-full"
                                style={{ backgroundColor: ACCENT_COLOR }}
                                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                              />
                            )}
                            <Icon
                              className={cn(
                                "size-[18px] shrink-0",
                                active ? "text-white" : "text-white/50",
                              )}
                            />
                            <span className="truncate">{item.label}</span>
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
