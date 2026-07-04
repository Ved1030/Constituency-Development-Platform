"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Search,
  Menu,
  Settings as SettingsIcon,
  LogOut,
  Globe,
  ChevronDown,
  User,
  HelpCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { LanguageSelector } from "@/components/common/LanguageSelector";

interface TopNavbarProps {
  title: string;
  onMenuClick: () => void;
}

export function TopNavbar({ title, onMenuClick }: TopNavbarProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="flex items-center justify-center rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted lg:hidden"
          >
            <Menu className="size-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1.5">
          {/* Search */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={cn(
                "flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm text-muted-foreground transition-all hover:border-primary/30 hover:bg-muted",
                searchOpen && "border-primary/30 bg-muted",
              )}
            >
              <Search className="size-4" />
              <span className="hidden lg:inline">{t("mp.header.search")}</span>
              <kbd className="hidden rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground lg:inline">
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
              }}
              className="relative flex items-center justify-center rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Bell className="size-4" />
              <span className="absolute right-1.5 top-1.5 flex size-4.5 items-center justify-center rounded-full bg-danger text-[9px] font-bold text-white">
                3
              </span>
            </button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-border bg-card shadow-xl"
                >
                  <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <span className="text-sm font-semibold text-foreground">{t("mp.header.notifications")}</span>
                    <span className="text-xs text-primary cursor-pointer">{t("mp.header.markAllRead")}</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {[
                      { id: "1", title: "Water Pipeline Alert", message: "Velachery pipeline showing critical pressure drop", read: false },
                      { id: "2", title: "Budget Update", message: "Q3 budget utilization report available", read: false },
                      { id: "3", title: "Project Milestone", message: "Road widening project 75% complete", read: true },
                    ].map((notif) => (
                      <div
                        key={notif.id}
                        className={cn(
                          "flex gap-3 px-4 py-3 transition-colors hover:bg-muted/50",
                          !notif.read && "bg-primary/5",
                        )}
                      >
                        <div className={cn(
                          "size-2 mt-1.5 shrink-0 rounded-full",
                          !notif.read ? "bg-primary" : "bg-transparent",
                        )} />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-foreground">{notif.title}</div>
                          <div className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{notif.message}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border px-4 py-2.5 text-center">
                    <button className="text-xs font-medium text-primary hover:underline">
                      {t("mp.header.viewAllNotifications")}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Language Selector */}
          <LanguageSelector />

          {/* Settings */}
          <button
            className="flex items-center justify-center rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:flex"
            onClick={() => router.push("/mp/settings")}
          >
            <SettingsIcon className="size-4" />
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotifOpen(false);
              }}
              className="flex items-center gap-2 rounded-xl py-1.5 pl-1.5 pr-2 transition-colors hover:bg-muted"
            >
              <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-white shadow-md shadow-primary/20">
                RS
              </div>
              <div className="hidden text-left md:block">
                <div className="text-sm font-medium text-foreground">Dr. R. Sharma</div>
              </div>
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </button>
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-card shadow-xl"
                >
                  <div className="border-b border-border px-4 py-3">
                    <div className="text-sm font-semibold text-foreground">Dr. Rajesh Sharma</div>
                    <div className="text-xs text-muted-foreground">MP, North Chennai</div>
                  </div>
                  <div className="p-1.5">
                    {[
                      { label: t("mp.header.myProfile"), icon: User, href: "/mp/settings" },
                      { label: t("mp.header.settings"), icon: SettingsIcon, href: "/mp/settings" },
                      { label: t("mp.header.helpSupport"), icon: HelpCircle, href: "/mp/settings" },
                    ].map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <item.icon className="size-4" />
                        {item.label}
                      </a>
                    ))}
                  </div>
                  <div className="border-t border-border p-1.5">
                    <button
                      onClick={() => {
                        toast.success("Signed out");
                        router.push("/login");
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/5"
                    >
                      <LogOut className="size-4" />
                      {t("common.signOut")}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(notifOpen || profileOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setNotifOpen(false);
            setProfileOpen(false);
          }}
        />
      )}
    </header>
  );
}
