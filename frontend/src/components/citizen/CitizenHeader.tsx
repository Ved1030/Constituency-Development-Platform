"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Menu,
  Globe,
  Mic,
  Bell,
  Star,
  ChevronDown,
  User,
  Settings,
  HelpCircle,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { citizenUser, notifications } from "@/data/mock-citizen";
import { useTranslation } from "@/hooks/use-translation";

interface CitizenHeaderProps {
  onMenuClick: () => void;
  title: string;
}

export function CitizenHeader({ onMenuClick, title }: CitizenHeaderProps) {
  const { t, locale, setLocale } = useTranslation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "Hindi" },
    { code: "ta", label: "Tamil" },
    { code: "te", label: "Telugu" },
    { code: "bn", label: "Bengali" },
    { code: "mr", label: "Marathi" },
    { code: "gu", label: "Gujarati" },
    { code: "kn", label: "Kannada" },
  ];

  const currentLangLabel = languages.find((l) => l.code === locale)?.label?.slice(0, 2).toUpperCase() || "EN";

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
              <span className="hidden lg:inline">{t("citizen.header.search")}</span>
              <kbd className="hidden rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground lg:inline">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setLangOpen(!langOpen);
                setNotifOpen(false);
                setProfileOpen(false);
              }}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Globe className="size-4" />
              <span className="hidden md:inline">{currentLangLabel}</span>
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-border bg-card shadow-xl"
                >
                  <div className="p-1.5">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLocale(lang.code);
                          setLangOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                          lang.code === locale
                            ? "bg-primary/10 font-medium text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        {lang.label}
                        {lang.code === locale && (
                          <span className="ml-auto text-[10px] text-primary">Active</span>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Voice Search */}
          <button className="flex items-center justify-center rounded-xl p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary">
            <Mic className="size-4" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setNotifOpen(!notifOpen);
                setLangOpen(false);
                setProfileOpen(false);
              }}
              className="relative flex items-center justify-center rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Bell className="size-4" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-4.5 items-center justify-center rounded-full bg-danger text-[9px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
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
                    <span className="text-sm font-semibold text-foreground">{t("citizen.header.notifications")}</span>
                    <span className="text-xs text-primary cursor-pointer">{t("citizen.header.markAllRead")}</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.slice(0, 5).map((notif) => (
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
                      {t("citizen.header.viewAllNotifications")}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Citizen Score */}
          <div className="hidden items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-50 to-amber-100/50 px-3 py-1.5 md:flex">
            <Star className="size-3.5 fill-amber-500 text-amber-500" />
            <span className="text-xs font-bold text-amber-700">{citizenUser.participationScore}</span>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setLangOpen(false);
                setNotifOpen(false);
              }}
              className="flex items-center gap-2 rounded-xl py-1.5 pl-1.5 pr-2 transition-colors hover:bg-muted"
            >
              <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-white shadow-md shadow-primary/20">
                AK
              </div>
              <div className="hidden text-left md:block">
                <div className="text-sm font-medium text-foreground">Arun</div>
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
                    <div className="text-sm font-semibold text-foreground">{citizenUser.name}</div>
                    <div className="text-xs text-muted-foreground">{citizenUser.email}</div>
                  </div>
                  <div className="p-1.5">
                    {[
                      { label: t("citizen.sidebar.myProfile"), icon: User, href: "/citizen/profile" },
                      { label: t("citizen.header.settings"), icon: Settings, href: "/citizen/profile" },
                      { label: t("citizen.header.helpSupport"), icon: HelpCircle, href: "/citizen/help" },
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
                    <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/5">
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
      {(notifOpen || profileOpen || langOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setNotifOpen(false);
            setProfileOpen(false);
            setLangOpen(false);
          }}
        />
      )}
    </header>
  );
}
