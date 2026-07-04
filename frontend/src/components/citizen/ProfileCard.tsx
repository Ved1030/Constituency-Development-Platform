"use client";

import { motion } from "framer-motion";
import { MapPin, Mail, Phone, Globe, Award, Star, Zap, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { citizenUser } from "@/data/mock-citizen";

const badgeIcons: Record<string, React.ElementType> = {
  Zap,
  CheckCircle,
  Award,
  Star,
};

const badgeColors: Record<string, string> = {
  "Early Adopter": "from-violet-500 to-purple-600",
  "Problem Solver": "from-emerald-500 to-teal-600",
  "Voice of the Month": "from-amber-500 to-orange-600",
  "Top Contributor": "from-primary to-accent",
};

interface ProfileCardProps {
  user: typeof citizenUser;
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card p-6"
    >
      <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-start gap-5">
        <Avatar size="lg" className="size-16">
          <AvatarFallback className="text-lg bg-gradient-to-br from-primary to-accent text-white">
            {user.name.split(" ").map((n) => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.constituency}, {user.state}</p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Mail className="size-3" />
              {user.email}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="size-3" />
              {user.phone}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="size-3" />
              {user.address}
            </span>
            <span className="flex items-center gap-1">
              <Globe className="size-3" />
              {user.preferredLanguage}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-xl bg-primary/5 px-5 py-3">
          <span className="text-2xl font-bold text-primary">{user.participationScore}</span>
          <span className="text-[11px] font-medium text-muted-foreground">Score</span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {user.badges.map((badge) => {
          const BadgeIcon = badgeIcons[badge.icon] || Star;
          return (
            <div
              key={badge.id}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br px-3 py-1 text-[11px] font-medium text-white shadow-sm",
                badgeColors[badge.label] || "from-gray-500 to-gray-600",
              )}
            >
              <BadgeIcon className="size-3" />
              {badge.label}
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 rounded-xl bg-muted/50 p-4">
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">{user.totalComplaints}</div>
          <div className="text-[11px] text-muted-foreground">Total Complaints</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-success">{user.resolvedComplaints}</div>
          <div className="text-[11px] text-muted-foreground">Resolved</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-primary">
            {Math.round((user.resolvedComplaints / user.totalComplaints) * 100)}%
          </div>
          <div className="text-[11px] text-muted-foreground">Resolution Rate</div>
        </div>
      </div>
    </motion.div>
  );
}
