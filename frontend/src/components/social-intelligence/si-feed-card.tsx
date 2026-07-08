"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Heart, MessageCircle, Share2, MapPin, Clock, Brain,
  Map, FileText, ChevronRight, Play, Verified, AtSign, Camera, Globe, Video, Users, Newspaper,
  AlertTriangle, DollarSign, CalendarClock, UserCheck, Target, Layers, Sparkles, BarChart3, CheckCircle2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getMediaUrl, getCategoryPlaceholder } from "@/services/api/social-intelligence"
import { useAnimatedCounter } from "./use-live-dashboard"
import type { SocialPost, PlatformType, SentimentType } from "@/types/social"

const platformConfig: Record<PlatformType, { color: string; icon: typeof AtSign; badge: string; textColor: string }> = {
  twitter:  { color: "bg-black", icon: AtSign, badge: "bg-blue-500/10 text-blue-400 border-blue-500/20", textColor: "text-blue-400" },
  instagram:{ color: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500", icon: Camera, badge: "bg-pink-500/10 text-pink-400 border-pink-500/20", textColor: "text-pink-400" },
  facebook: { color: "bg-blue-600", icon: Globe, badge: "bg-blue-600/10 text-blue-400 border-blue-600/20", textColor: "text-blue-400" },
  youtube:  { color: "bg-red-600", icon: Video, badge: "bg-red-500/10 text-red-400 border-red-500/20", textColor: "text-red-400" },
  citizen:  { color: "bg-emerald-600", icon: Users, badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", textColor: "text-emerald-400" },
  news:     { color: "bg-indigo-600", icon: Newspaper, badge: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20", textColor: "text-indigo-400" },
}

const seaConfig = { Critical: { bg: "bg-red-500", text: "text-red-400", dot: "bg-red-500", chip: "bg-red-500/10 text-red-400 border-red-500/20" }, High: { bg: "bg-amber-500", text: "text-amber-400", dot: "bg-amber-500", chip: "bg-amber-500/10 text-amber-400 border-amber-500/20" }, Medium: { bg: "bg-yellow-500", text: "text-yellow-400", dot: "bg-yellow-500", chip: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" }, Low: { bg: "bg-emerald-500", text: "text-emerald-400", dot: "bg-emerald-500", chip: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" } }

// ─── Animated engagement counter ───
function AnimatedEngagement({ value, suffix = "" }: { value: number; suffix?: string }) {
  const animated = useAnimatedCounter(value, 800)
  if (value >= 1_000_000) return <>{((animated) / 1_000_000).toFixed(1)}M{suffix}</>
  if (value >= 1_000) return <>{((animated) / 1_000).toFixed(1)}K{suffix}</>
  return <>{animated}{suffix}</>
}

function tAgo(ts: string) { const d = Date.now() - new Date(ts).getTime(); const m = Math.floor(d / 60000); if (m < 60) return `${m}m`; const h = Math.floor(m / 60); if (h < 24) return `${h}h`; return `${Math.floor(h / 24)}d` }

interface SIFeedCardProps { post: SocialPost }

export function SIFeedCard({ post }: SIFeedCardProps) {
  const router = useRouter()
  const [imgErr, setImgErr] = useState(false)
  const config = platformConfig[post.platform]
  const severityClass = seaConfig[post.severity]

  const imgSrc = post.media?.[0]?.url
    ? (imgErr ? getCategoryPlaceholder(post.category) : getMediaUrl(post.media[0].url))
    : getCategoryPlaceholder(post.category)

  return (
    <motion.div
      layout
      className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:shadow-md hover:border-primary/30 hover:scale-[1.01]"
    >
      <div className="flex">
        {/* ─── LEFT: Image (30-35%) ─── */}
        <div className="relative w-[30%] shrink-0 overflow-hidden bg-muted min-h-[140px]">
          <img
            src={imgSrc}
            alt={post.category}
            loading="lazy"
            className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            onError={() => setImgErr(true)}
          />
          {post.media.some(m => m.type === "video" || m.type === "short" || m.type === "reel") && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="flex size-10 items-center justify-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur-sm">
                <Play className="size-5 fill-white ml-0.5" />
              </div>
            </div>
          )}
          {/* Platform badge overlay */}
          <div className={cn("absolute top-2 left-2 flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[8px] font-medium backdrop-blur-sm border", config.badge)}>
            {(() => { const Ic = config.icon; return <Ic className="size-2.5" /> })()}
            {post.platform === "twitter" ? "X" : post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
          </div>
          {/* Severity badge */}
          <div className={cn("absolute top-2 right-2 rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider backdrop-blur-sm border", severityClass.chip)}>
            <div className="flex items-center gap-1">
              <span className={cn("size-1 rounded-full", severityClass.dot)} />
              {post.severity}
            </div>
          </div>
        </div>

        {/* ─── RIGHT: Content (65-70%) ─── */}
        <div className="flex min-w-0 flex-1 flex-col p-3">
          {/* Author row */}
          <div className="mb-1.5 flex items-center gap-2">
            <div className={cn("flex size-6 shrink-0 items-center justify-center rounded-full text-[8px] font-bold text-white shadow-sm", config.color)}>
              {post.authorAvatar}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-foreground truncate">{post.authorName}</span>
                {post.isVerified && <Verified className="size-2.5 shrink-0 text-blue-500 fill-blue-500" />}
              </div>
              <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                <span className="truncate">{post.authorUsername}</span>
                <span>·</span>
                <span>{tAgo(post.timestamp)}</span>
              </div>
            </div>
            {/* Geo Verified */}
            {post._linkedVillage && (
              <span className="flex items-center gap-0.5 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[7px] font-medium text-emerald-400 shrink-0">
                <CheckCircle2 className="size-2" /> Verified
              </span>
            )}
          </div>

          {/* Location + Category */}
          <div className="mb-1.5 flex items-center gap-1 text-[9px] text-muted-foreground/70">
            <MapPin className="size-2.5 shrink-0" />
            <span className="truncate">{post.geoLocation.ward}</span>
            <span>·</span>
            <span className="truncate">{post.geoLocation.village}</span>
            <span className="mx-0.5">·</span>
            <span className="rounded bg-muted px-1.5 py-0.5 text-[8px] font-medium">{post.category}</span>
          </div>

          {/* Caption — primary focus */}
          <p className="mb-1.5 text-xs leading-relaxed text-foreground/85 line-clamp-3">
            {post.text}
          </p>

          {/* Hashtags */}
          {post.hashtags.length > 0 && (
            <div className="mb-1.5 flex flex-wrap gap-1">
              {post.hashtags.slice(0, 3).map((h) => (
                <span key={h} className="rounded-md bg-primary/5 px-1.5 py-0.5 text-[8px] font-medium text-primary">{h}</span>
              ))}
              {post.hashtags.length > 3 && <span className="text-[8px] text-muted-foreground">+{post.hashtags.length - 3}</span>}
            </div>
          )}

          {/* Engagement bar — animated counters */}
          <div className="mb-2 flex items-center gap-3 text-[9px] text-muted-foreground">
            <span className="flex items-center gap-1 transition-colors hover:text-red-400 cursor-pointer"><Heart className="size-3" /><AnimatedEngagement value={post.likes} /></span>
            <span className="flex items-center gap-1 transition-colors hover:text-blue-400 cursor-pointer"><MessageCircle className="size-3" /><AnimatedEngagement value={post.comments} /></span>
            <span className="flex items-center gap-1 transition-colors hover:text-emerald-400 cursor-pointer"><Share2 className="size-3" /><AnimatedEngagement value={post.shares} /></span>
            <span className="flex items-center gap-1 transition-colors hover:text-purple-400 cursor-pointer"><Play className="size-3" /><AnimatedEngagement value={post.views} /></span>
          </div>

          {/* ─── AI Analysis Chips ─── */}
          <div className="flex flex-wrap gap-1">
            {/* Severity */}
            <div className={cn("flex items-center gap-1 rounded-lg px-1.5 py-0.5 text-[8px] font-medium", severityClass.chip)}>
              <AlertTriangle className="size-2.5" />
              {post.severity}
            </div>
            {/* Department */}
            <div className="flex items-center gap-1 rounded-lg bg-primary/5 px-1.5 py-0.5 text-[8px] font-medium text-primary/80">
              <Layers className="size-2.5" />{post.ai.department.length > 18 ? post.ai.department.slice(0, 18) + ".." : post.ai.department}
            </div>
            {/* Confidence */}
            <div className={cn("flex items-center gap-1 rounded-lg px-1.5 py-0.5 text-[8px] font-medium", post.ai.confidence >= 85 ? "bg-emerald-500/10 text-emerald-500" : post.ai.confidence >= 70 ? "bg-amber-500/10 text-amber-500" : "bg-slate-500/10 text-slate-400")}>
              <Brain className="size-2.5" />{post.ai.confidence}%
            </div>
            {/* Budget */}
            <div className="flex items-center gap-1 rounded-lg bg-blue-500/5 px-1.5 py-0.5 text-[8px] font-medium text-blue-400">
              <DollarSign className="size-2.5" />{post.ai.estimatedBudget}
            </div>
            {/* Duplicates */}
            {(post.duplicateCount ?? post.ai.duplicateScore) ? (
              <div className="flex items-center gap-1 rounded-lg bg-purple-500/5 px-1.5 py-0.5 text-[8px] font-medium text-purple-400">
                <Layers className="size-2.5" />+{post.duplicateCount ?? post.ai.duplicateScore} dup
              </div>
            ) : null}
            {/* Action chip */}
            <div className="flex items-center gap-1 rounded-lg bg-cyan-500/5 px-1.5 py-0.5 text-[8px] font-medium text-cyan-400" title={post.ai.suggestedAction}>
              <Target className="size-2.5" />Action
            </div>
            {/* AI Summary sparkle icon */}
            <div className="flex items-center gap-1 rounded-lg bg-amber-500/5 px-1.5 py-0.5 text-[8px] font-medium text-amber-400" title={post.ai.aiSummary}>
              <Sparkles className="size-2.5" />AI
            </div>
          </div>
        </div>
      </div>

      {/* Bottom actions bar */}
      <div className="flex items-center gap-1 border-t border-border/50 px-3 py-1.5 bg-muted/20">
        <button onClick={() => router.push(`/mp/constituency-twin?focus=${encodeURIComponent(post.geoLocation.village)}`)} className="flex items-center gap-1 rounded-md px-1.5 py-1 text-[8px] font-medium text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary">
          <Map className="size-2.5" /> Map
        </button>
        <button className="flex items-center gap-1 rounded-md px-1.5 py-1 text-[8px] font-medium text-red-400 transition-all hover:bg-red-500/10">
          <FileText className="size-2.5" /> Complaint
        </button>
        <button className="flex items-center gap-1 rounded-md px-1.5 py-1 text-[8px] font-medium text-amber-400 transition-all hover:bg-amber-500/10">
          <Target className="size-2.5" /> Assign
        </button>
        <div className="ml-auto flex items-center gap-1 text-[8px] text-muted-foreground/50">
          <Target className="size-2" />
          Priority {post.ai.priorityScore}/100
        </div>
      </div>
    </motion.div>
  )
}
