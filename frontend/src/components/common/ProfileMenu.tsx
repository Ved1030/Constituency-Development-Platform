"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface ProfileMenuProps {
  name?: string;
  email?: string;
  avatar?: string;
  className?: string;
}

export function ProfileMenu({
  name = "User",
  email = "user@example.com",
  className,
}: ProfileMenuProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-muted"
      >
        <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
          {initials}
        </div>
        <ChevronDown className="size-3 text-muted-foreground" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute right-0 mt-2 w-56 overflow-hidden rounded-lg border border-border bg-card shadow-lg"
          >
            <div className="border-b border-border px-4 py-3">
              <div className="text-sm font-medium text-foreground">{name}</div>
              <div className="text-xs text-muted-foreground">{email}</div>
            </div>
            <div className="p-1">
              <button
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => { setIsOpen(false); router.push("/citizen/profile"); }}
              >
                <User className="size-4" />
                Profile
              </button>
              <button
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => { setIsOpen(false); router.push("/citizen/profile"); }}
              >
                <Settings className="size-4" />
                Settings
              </button>
            </div>
            <div className="border-t border-border p-1">
              <button
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                onClick={() => { setIsOpen(false); toast.success("Signed out"); router.push("/login"); }}
              >
                <LogOut className="size-4" />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
