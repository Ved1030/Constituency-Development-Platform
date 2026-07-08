"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Search,
  Menu,
  Settings as SettingsIcon,
  LogOut,
  ChevronDown,
  User,
  HelpCircle,
  Bot,
  MapPin,
  Calendar,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { LanguageSelector } from "@/components/common/LanguageSelector";
import { useConstituency } from "@/context/ConstituencyContext";
import { useAuth } from "@/context/AuthContext";

const today = new Date();
const dateStr = today.toLocaleDateString("en-IN", {
  weekday: "short",
  year: "numeric",
  month: "short",
  day: "numeric",
});

interface TopNavbarProps {
  onMenuClick: () => void;
}

export function TopNavbar({ onMenuClick }: TopNavbarProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, getUserInitials, logout } = useAuth();
  const { selectedConstituency, setConstituency, constituencyList, data } = useConstituency();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [constituencyOpen, setConstituencyOpen] = useState(false);

  const initials = user ? getUserInitials() : "RS";
  const displayName = user?.full_name?.split(" ").map((n: string) => n[0]).join(".") || "R. Sharma";
  const fullName = user?.full_name || "Dr. Rajesh Sharma";

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between px-4 lg:px-6">
        {/* Left */}
        <div className="flex items-center gap-2">
          <button
            onClick={onMenuClick}
            className="flex items-center justify-center rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted lg:hidden"
          >
            <Menu className="size-4" />
          </button>

          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#0d47a1] to-[#42a5f5] text-[9px] font-bold text-white shadow-sm">
              CD
            </div>
            <span className="hidden text-xs font-bold text-foreground sm:inline">
              AI Governance
            </span>
          </div>

          <div className="hidden h-5 w-px bg-border/60 md:block" />

          {/* Constituency Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setConstituencyOpen(!constituencyOpen);
                setNotifOpen(false);
                setProfileOpen(false);
              }}
              className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-muted/30 px-2.5 py-1.5 text-xs transition-colors hover:bg-muted"
            >
              <MapPin className="size-3 text-primary" />
              <span className="font-semibold text-foreground">{selectedConstituency.name}</span>
              <span className="hidden text-[10px] text-muted-foreground md:inline">
                · {selectedConstituency.state}
              </span>
              <ChevronDown className="size-2.5 text-muted-foreground" />
            </button>
            <AnimatePresence>
              {constituencyOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.96 }}
                  className="absolute left-0 top-full z-50 mt-1.5 w-56 overflow-hidden rounded-xl border border-border bg-card shadow-xl"
                >
                  <div className="border-b border-border px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                    Switch Constituency
                  </div>
                  <div className="p-1">
                    {constituencyList.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => {
                          setConstituency(c.name);
                          setConstituencyOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs transition-colors",
                          selectedConstituency.name === c.name
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <MapPin
                          className={cn(
                            "size-3",
                            selectedConstituency.name === c.name
                              ? "text-primary"
                              : "text-muted-foreground"
                          )}
                        />
                        <div>
                          <div className="text-xs">{c.name}</div>
                          <div className="text-[9px] text-muted-foreground">{c.state} · {c.mpName}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-0.5">
          {/* Assembly Segment + Lok Sabha (desktop) */}
          <div className="hidden items-center gap-1.5 rounded-lg bg-muted/20 px-2 py-1 text-[10px] text-muted-foreground xl:flex">
            <MapPin className="size-2.5" />
            <span>{data.lokShabha}</span>
            <span className="text-border/60">|</span>
            <span className="font-medium text-foreground">{data.assemblySegment}</span>
          </div>

          {/* Today's Date */}
          <div className="hidden items-center gap-1 rounded-lg px-2 py-1 text-[10px] text-muted-foreground lg:flex">
            <Calendar className="size-2.5" />
            <span>{dateStr}</span>
          </div>

          {/* Search */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border border-border/50 px-2.5 py-1.5 text-[11px] text-muted-foreground transition-all hover:border-primary/30 hover:bg-muted",
                searchOpen && "border-primary/30 bg-muted",
              )}
            >
              <Search className="size-3" />
              <span className="hidden lg:inline">{t("mp.header.search")}</span>
              <kbd className="hidden rounded border border-border/50 bg-muted px-1 py-0.5 text-[8px] font-medium text-muted-foreground lg:inline">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setNotifOpen(!notifOpen);
                setProfileOpen(false);
                setConstituencyOpen(false);
              }}
              className="relative flex items-center justify-center rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Bell className="size-3.5" />
              <span className="absolute right-0.5 top-0.5 flex size-3.5 items-center justify-center rounded-full bg-destructive text-[7px] font-bold text-white">
                3
              </span>
            </button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  className="absolute right-0 top-full z-50 mt-1.5 w-72 overflow-hidden rounded-xl border border-border bg-card shadow-xl"
                >
                  <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <span className="text-xs font-semibold text-foreground">Notifications</span>
                    <span className="cursor-pointer text-[10px] text-primary hover:underline">Mark all read</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {[
                      { id: "1", title: "Water Pipeline Alert", message: "Velachery pipeline showing critical pressure drop", read: false },
                      { id: "2", title: "Budget Update", message: "Q3 budget utilization report available", read: false },
                      { id: "3", title: "Project Milestone", message: "Road widening 75% complete", read: false },
                    ].map((notif) => (
                      <div
                        key={notif.id}
                        className={cn(
                          "flex gap-2.5 px-4 py-3 transition-colors hover:bg-muted/50",
                          !notif.read && "bg-primary/[0.03]",
                        )}
                      >
                        <div className={cn(
                          "mt-1 size-1.5 shrink-0 rounded-full",
                          !notif.read ? "bg-primary" : "bg-transparent",
                        )} />
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] font-medium text-foreground">{notif.title}</div>
                          <div className="mt-0.5 text-[10px] text-muted-foreground line-clamp-1">{notif.message}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border px-4 py-2 text-center">
                    <button className="text-[10px] font-medium text-primary hover:underline">
                      View all
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Language */}
          <LanguageSelector />

          {/* AI Copilot Button */}
          <button
            onClick={() => router.push("/mp/copilot")}
            className="hidden items-center gap-1 rounded-lg bg-gradient-to-r from-primary to-accent px-2.5 py-1.5 text-[10px] font-semibold text-white shadow-sm transition-all hover:shadow-md hover:scale-[1.02] sm:flex"
          >
            <Bot className="size-3" />
            <span>AI Copilot</span>
          </button>

          {/* Settings */}
          <button
            className="flex items-center justify-center rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            onClick={() => router.push("/mp/settings")}
          >
            <SettingsIcon className="size-3.5" />
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotifOpen(false);
                setConstituencyOpen(false);
              }}
              className="flex items-center gap-1.5 rounded-lg py-1 pl-1 pr-1.5 transition-colors hover:bg-muted"
            >
              <div className="flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-[8px] font-bold text-white shadow-sm">
                {initials}
              </div>
              <div className="hidden text-left md:block">
                <div className="text-[11px] font-medium text-foreground leading-tight">{displayName}</div>
              </div>
              <ChevronDown className="size-2.5 text-muted-foreground" />
            </button>
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  className="absolute right-0 top-full z-50 mt-1.5 w-52 overflow-hidden rounded-xl border border-border bg-card shadow-xl"
                >
                  <div className="border-b border-border px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-white shadow-md">
                        {initials}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">{fullName}</div>
                        <div className="text-[10px] text-muted-foreground">MP, {selectedConstituency.name}</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-1.5">
                    {[
                      { label: t("mp.header.myProfile"), icon: User, href: "/mp/settings" },
                      { label: t("mp.header.settings"), icon: SettingsIcon, href: "/mp/settings" },
                      { label: t("mp.header.helpSupport"), icon: HelpCircle, href: "/mp/settings" },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => {
                          router.push(item.href);
                          setProfileOpen(false);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <item.icon className="size-3.5" />
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-border p-1.5">
                    <button
                      onClick={async () => {
                        await logout();
                        toast.success("Signed out");
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-destructive transition-colors hover:bg-destructive/5"
                    >
                      <LogOut className="size-3.5" />
                      {t("common.signOut")}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Click outside backdrop */}
      {(notifOpen || profileOpen || constituencyOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setNotifOpen(false);
            setProfileOpen(false);
            setConstituencyOpen(false);
          }}
        />
      )}
    </header>
  );
}
