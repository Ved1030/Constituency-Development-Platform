"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Heart, MessageCircle, Share2, MapPin, Clock, AtSign,
  Camera, Globe, Users, Newspaper, Verified, Eye,
  Route, Map, FileText, Brain, TrendingUp, Activity, FileSymlink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardSocialPost } from "@/data/dashboard-social-data";

const PLATFORM_CONFIG: Record<string, { bg: string; icon: typeof AtSign; label: string }> = {
  twitter: { bg: "bg-[#1DA1F2]", icon: AtSign, label: "X" },
  instagram: { bg: "bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]", icon: Camera, label: "Instagram" },
  facebook: { bg: "bg-[#1877F2]", icon: Globe, label: "Facebook" },
  citizen: { bg: "bg-emerald-600", icon: Users, label: "Citizen App" },
  news: { bg: "bg-indigo-600", icon: Newspaper, label: "News" },
};

const SEVERITY_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  Critical: { color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-500/10", border: "border-red-200 dark:border-red-500/20" },
  High: { color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-500/10", border: "border-orange-200 dark:border-orange-500/20" },
  Medium: { color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10", border: "border-amber-200 dark:border-amber-500/20" },
  Low: { color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-200 dark:border-emerald-500/20" },
};

const SENTIMENT_CONFIG: Record<string, { color: string; bg: string; icon: string }> = {
  positive: { color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", icon: "🙂" },
  negative: { color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-500/10", icon: "🙁" },
  neutral: { color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-50 dark:bg-slate-500/10", icon: "😐" },
  mixed: { color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10", icon: "😕" },
};

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function SocialGridCard({ post, index }: { post: DashboardSocialPost; index: number }) {
  const router = useRouter();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const platform = PLATFORM_CONFIG[post.platform] || PLATFORM_CONFIG["twitter"];
  const severity = SEVERITY_CONFIG[post.severity] || SEVERITY_CONFIG["Medium"];
  const sentiment = SENTIMENT_CONFIG[post.sentiment] || SENTIMENT_CONFIG["neutral"];
  const PlatformIcon = platform.icon;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index % 12) * 0.04, duration: 0.3 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-0.5",
        severity.border,
      )}
    >
      {/* Severity top bar */}
      <div className={cn("h-1 w-full", severity.bg)} />

      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        {inView && !imgError && (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                <div className="size-6 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-primary" />
              </div>
            )}
            <img
              src={post.image}
              alt={post.category}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              className={cn(
                "size-full object-cover transition-all duration-500 group-hover:scale-105",
                imgLoaded ? "opacity-100" : "opacity-0",
              )}
            />
          </>
        )}
        {imgError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <Camera className="size-8 text-muted-foreground/30" />
          </div>
        )}

        {/* Platform badge */}
        <div className={cn(
          "absolute top-3 left-3 z-10 flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-semibold text-white shadow-lg",
          platform.bg,
        )}>
          <PlatformIcon className="size-3" />
          <span>{platform.label}</span>
        </div>

        {/* Severity badge */}
        <div className={cn(
          "absolute top-3 right-3 z-10 rounded-full px-2 py-0.5 text-[8px] font-bold tracking-wider border shadow-sm",
          severity.bg, severity.color, severity.border,
        )}>
          {post.severity.toUpperCase()}
        </div>

        {/* Category chip */}
        <div className="absolute bottom-3 left-3 z-10 rounded-md bg-black/60 px-2 py-0.5 text-[9px] font-medium text-white backdrop-blur-sm">
          {post.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Author header */}
        <div className="mb-2 flex items-center gap-2.5">
          <div className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white shadow-sm",
            platform.bg,
          )}>
            {post.authorInitials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-foreground truncate">{post.authorName}</span>
              {post.isVerified && <Verified className="size-3 shrink-0 text-blue-500 fill-blue-500" />}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className="truncate">{post.authorHandle}</span>
              <span>·</span>
              <Clock className="size-2.5 shrink-0" />
              <span className="shrink-0">{timeAgo(post.timestamp)}</span>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="mb-2 flex items-center gap-1 text-[10px] text-muted-foreground/80">
          <MapPin className="size-2.5 shrink-0" />
          <span className="truncate">{post.village}, {post.ward}</span>
        </div>

        {/* Caption */}
        <p className="mb-3 text-xs leading-relaxed text-foreground/85">
          {post.caption.length > 150 && !expanded
            ? `${post.caption.slice(0, 150)}...`
            : post.caption}
          {post.caption.length > 150 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="ml-1 text-[10px] font-medium text-primary hover:underline"
            >
              {expanded ? "less" : "more"}
            </button>
          )}
        </p>

        {/* Engagement footer */}
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground border-t border-border/40 pt-2.5">
          <span className="flex items-center gap-1 transition-colors hover:text-red-400 cursor-pointer">
            <Heart className="size-3.5" />
            {formatNumber(post.likes)}
          </span>
          <span className="flex items-center gap-1 transition-colors hover:text-blue-400 cursor-pointer">
            <MessageCircle className="size-3.5" />
            {formatNumber(post.comments)}
          </span>
          <span className="flex items-center gap-1 transition-colors hover:text-emerald-400 cursor-pointer">
            <Share2 className="size-3.5" />
            {formatNumber(post.shares)}
          </span>
          <span className="flex items-center gap-1 transition-colors hover:text-purple-400 cursor-pointer">
            <Eye className="size-3.5" />
            {formatNumber(post.views)}
          </span>
        </div>

        {/* AI Analysis toggle */}
        <button
          onClick={() => setShowAI(!showAI)}
          className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg bg-primary/5 py-1.5 text-[9px] font-medium text-primary transition-colors hover:bg-primary/10"
        >
          <Brain className="size-3" />
          {showAI ? "Hide" : "Show"} AI Analysis
        </button>

        {showAI && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-2 space-y-1.5 rounded-xl bg-gradient-to-br from-primary/[0.03] to-purple-500/[0.03] border border-primary/10 p-3"
          >
            <div className="flex items-center justify-between text-[9px]">
              <span className="text-muted-foreground flex items-center gap-1">
                <Activity className="size-2.5" /> Urgency
              </span>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-12 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      post.urgencyScore >= 80 ? "bg-red-500" : post.urgencyScore >= 60 ? "bg-amber-500" : "bg-emerald-500",
                    )}
                    style={{ width: `${post.urgencyScore}%` }}
                  />
                </div>
                <span className="font-semibold text-foreground">{post.urgencyScore}/100</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[9px]">
              <span className="text-muted-foreground flex items-center gap-1">
                <Brain className="size-2.5" /> AI Confidence
              </span>
              <span className="font-semibold text-foreground">{post.aiConfidence}%</span>
            </div>
            <div className="flex items-center justify-between text-[9px]">
              <span className="text-muted-foreground flex items-center gap-1">
                <MapPin className="size-2.5" /> Department
              </span>
              <span className="font-semibold text-foreground text-right max-w-[60%] truncate">{post.department}</span>
            </div>
            <div className="flex items-center justify-between text-[9px]">
              <span className="text-muted-foreground flex items-center gap-1">
                <Users className="size-2.5" /> Population Impact
              </span>
              <span className="font-semibold text-foreground">{post.populationImpact.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex items-center justify-between text-[9px]">
              <span className="text-muted-foreground flex items-center gap-1">
                <TrendingUp className="size-2.5" /> Sentiment
              </span>
              <span className={cn("rounded-full px-1.5 py-0.5 text-[8px] font-medium", sentiment.bg, sentiment.color)}>
                {sentiment.icon} {post.sentiment.charAt(0).toUpperCase() + post.sentiment.slice(1)}
              </span>
            </div>
          </motion.div>
        )}

        {/* Action buttons */}
        <div className="mt-2.5 flex flex-wrap gap-1">
          <button
            onClick={() => router.push("/mp/constituency-twin")}
            className="flex items-center gap-1 rounded-lg bg-muted px-2 py-1 text-[9px] font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
          >
            <Map className="size-2.5" />
            Open on Digital Twin
          </button>
          <button className="flex items-center gap-1 rounded-lg bg-muted px-2 py-1 text-[9px] font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary">
            <Route className="size-2.5" />
            Similar Posts
          </button>
          <button className="flex items-center gap-1 rounded-lg bg-purple-500/10 px-2 py-1 text-[9px] font-medium text-purple-500 transition-colors hover:bg-purple-500/20">
            <FileSymlink className="size-2.5" />
            Generate Summary
          </button>
          <button className="flex items-center gap-1 rounded-lg bg-red-500/10 px-2 py-1 text-[9px] font-medium text-red-500 transition-colors hover:bg-red-500/20">
            <FileText className="size-2.5" />
            Create Case
          </button>
        </div>

        {/* Sentiment */}
        <div className="mt-2 flex items-center gap-1.5">
          <div className={cn("rounded-full px-2 py-0.5 text-[8px] font-medium inline-flex items-center gap-1", sentiment.bg, sentiment.color)}>
            {sentiment.icon} {post.sentiment.charAt(0).toUpperCase() + post.sentiment.slice(1)}
          </div>
          {post.severity === "Critical" && (
            <span className="rounded-full bg-red-50 dark:bg-red-500/10 px-2 py-0.5 text-[8px] font-bold text-red-600 dark:text-red-400 animate-pulse">
              URGENT
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
