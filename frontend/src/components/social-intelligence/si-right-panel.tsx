"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import {
  TrendingUp, MapPin, Newspaper, BarChart3, Brain, Activity, Flame,
  AlertTriangle, Users, MessageCircle, Heart, Share2,
  ArrowUpRight, Sparkles,
} from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RePieChart, Pie, Cell, AreaChart, Area,
} from "recharts"
import { cn } from "@/lib/utils"
import type {
  TrendingTopic, TrendingWard, HourlyActivity, PlatformDistribution,
  NewsArticle, SocialIntelligenceKPIs, SocialPost, TopComplaint, SentimentType,
} from "@/types/social"

const tooltipStyle = { contentStyle: { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "11px" }, labelStyle: { color: "hsl(var(--foreground))" } }

const PLATFORM_COLORS: Record<string, string> = { twitter: "#1DA1F2", instagram: "#E4405F", facebook: "#1877F2", youtube: "#FF0000", citizen: "#10B981", news: "#6366F1" }
const sevColor: Record<string, string> = { Critical: "text-red-400 bg-red-500/10", High: "text-amber-400 bg-amber-500/10", Medium: "text-yellow-400 bg-yellow-500/10", Low: "text-emerald-400 bg-emerald-500/10" }
const sevDot: Record<string, string> = { Critical: "bg-red-500", High: "bg-amber-500", Medium: "bg-yellow-500", Low: "bg-emerald-500" }

function nFmt(n: number) { if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`; if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`; return n.toString() }
function tAgo(ts: string) { const m = Math.floor((Date.now() - new Date(ts).getTime()) / 60000); if (m < 60) return `${m}m`; const h = Math.floor(m / 60); if (h < 24) return `${h}h`; return `${Math.floor(h / 24)}d` }

interface SIRightPanelProps {
  trendingTopics: TrendingTopic[]
  trendingWards: TrendingWard[]
  newsArticles: NewsArticle[]
  hourlyActivity: HourlyActivity[]
  platformDistribution: PlatformDistribution[]
  kpis: SocialIntelligenceKPIs
  posts?: SocialPost[]
  topComplaint?: TopComplaint
  mostSharedPost?: SocialPost
  latestVideos?: SocialPost[]
  className?: string
}

function SentimentSummary({ posts }: { posts: SocialPost[] }) {
  const pos = posts.filter(p => p.sentiment === "positive").length
  const neg = posts.filter(p => p.sentiment === "negative").length
  const neu = posts.filter(p => p.sentiment === "neutral").length
  const tot = posts.length || 1
  const data = [
    { name: "Positive", value: pos, color: "#10B981" },
    { name: "Negative", value: neg, color: "#EF4444" },
    { name: "Neutral", value: neu, color: "#6B7280" },
  ]
  return (
    <div className="flex items-center gap-3">
      <div className="h-14 w-14 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <RePieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={16} outerRadius={26} paddingAngle={2} dataKey="value">
              {data.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie>
          </RePieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex-1 space-y-0.5">
        {data.map((d) => (
          <div key={d.name} className="flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-1"><span className="size-1.5 rounded-full" style={{ backgroundColor: d.color }} /><span className="text-muted-foreground">{d.name}</span></div>
            <span className="font-medium text-foreground">{Math.round(d.value / tot * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SIRightPanel({ trendingTopics, trendingWards, newsArticles, hourlyActivity, platformDistribution, kpis, posts = [], topComplaint, mostSharedPost, latestVideos, className }: SIRightPanelProps) {
  const tickerRef = useRef<HTMLDivElement>(null)
  const [tickerPos, setTickerPos] = useState(0)
  const [animatedTrending, setAnimatedTrending] = useState(trendingTopics)
  const reshuffleTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  // Ticker scroll
  useEffect(() => {
    const i = setInterval(() => setTickerPos((p) => p >= 100 ? 0 : p + 0.25), 50)
    return () => clearInterval(i)
  }, [])

  // Reorder trending hashtags every 20-30 seconds
  const reshuffle = useCallback(() => {
    setAnimatedTrending((prev) => {
      const copy = [...prev]
      // Fisher-Yates shuffle
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[copy[i], copy[j]] = [copy[j], copy[i]]
      }
      return copy
    })
  }, [])

  useEffect(() => {
    const scheduleNext = () => {
      const delay = 20000 + Math.random() * 10000 // 20-30s
      reshuffleTimer.current = setTimeout(() => {
        reshuffle()
        scheduleNext()
      }, delay)
    }
    scheduleNext()
    return () => { if (reshuffleTimer.current) clearTimeout(reshuffleTimer.current) }
  }, [reshuffle])

  // Sync with prop changes
  useEffect(() => {
    setAnimatedTrending(trendingTopics)
  }, [trendingTopics])

  const criticalPosts = posts.filter(p => p.severity === "Critical")

  return (
    <div className={cn("space-y-3", className)}>
      {/* Today's Critical Alerts */}
      {criticalPosts.length > 0 && (
        <div className="rounded-xl border border-red-500/20 bg-card p-3 shadow-sm">
          <div className="mb-2 flex items-center gap-1.5">
            <AlertTriangle className="size-3.5 text-red-400" />
            <span className="text-xs font-semibold text-foreground">Critical Alerts</span>
            <span className="ml-auto rounded-full bg-red-500/10 px-1.5 py-0.5 text-[9px] font-medium text-red-400">{criticalPosts.length}</span>
          </div>
          <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
            {criticalPosts.slice(0, 4).map((p) => (
              <div key={p.id} className="flex gap-2 rounded-lg bg-red-500/5 p-2 border border-red-500/10">
                <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded bg-red-500/10 text-[8px] font-bold text-red-400">
                  {p.authorAvatar}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-medium text-foreground leading-tight line-clamp-2">{p.text.slice(0, 100)}</p>
                  <div className="mt-0.5 flex items-center gap-2 text-[8px] text-muted-foreground">
                    <span>{p.geoLocation.village}</span>
                    <span>·</span>
                    <span>{p.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trending Hashtags — with live reorder */}
      <LayoutGroup>
        <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
          <div className="mb-2 flex items-center gap-1.5">
            <TrendingUp className="size-3.5 text-red-400" />
            <span className="text-xs font-semibold text-foreground">Trending</span>
          </div>
          <AnimatePresence mode="popLayout">
            {animatedTrending.slice(0, 6).map((t) => (
              <motion.div
                key={t.hashtag}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex items-center justify-between rounded-lg px-1.5 py-1 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className={cn("size-1.5 rounded-full shrink-0", t.sentiment === "positive" ? "bg-emerald-500" : t.sentiment === "negative" ? "bg-red-500" : "bg-slate-500")} />
                  <span className="text-[11px] font-medium text-foreground truncate">{t.hashtag}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[9px] text-muted-foreground">{nFmt(t.postCount)}</span>
                  {t.change && (
                    <span className={cn("text-[8px] font-medium", (t.change || 0) > 0 ? "text-red-400" : "text-emerald-400")}>
                      {t.change > 0 ? "+" : ""}{t.change}%
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </LayoutGroup>

      {/* Top Viral Complaint */}
      {mostSharedPost && (
        <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
          <div className="mb-2 flex items-center gap-1.5">
            <Flame className="size-3.5 text-amber-400" />
            <span className="text-xs font-semibold text-foreground">Viral Complaint</span>
          </div>
          <div className="rounded-lg bg-gradient-to-r from-amber-500/5 to-red-500/5 border border-amber-500/20 p-2.5">
            <div className="flex items-center gap-2 mb-1.5">
              <div className={cn("flex size-6 shrink-0 items-center justify-center rounded-full text-[8px] font-bold text-white", PLATFORM_COLORS[mostSharedPost.platform] ? "" : "bg-muted")} style={{ backgroundColor: PLATFORM_COLORS[mostSharedPost.platform] }}>
                {mostSharedPost.authorAvatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold text-foreground truncate">{mostSharedPost.authorName}</p>
                <p className="text-[8px] text-muted-foreground">{tAgo(mostSharedPost.timestamp)}</p>
              </div>
              <span className={cn("text-[8px] font-bold", sevColor[mostSharedPost.severity])}>{mostSharedPost.severity}</span>
            </div>
            <p className="text-[10px] text-foreground/80 leading-relaxed line-clamp-2 mb-1.5">{mostSharedPost.text.slice(0, 120)}</p>
            <div className="flex items-center gap-2 text-[8px] text-muted-foreground">
              <span className="flex items-center gap-0.5"><Share2 className="size-2.5" />{nFmt(mostSharedPost.shares)}</span>
              <span className="flex items-center gap-0.5"><Heart className="size-2.5" />{nFmt(mostSharedPost.likes)}</span>
              <span className="flex items-center gap-0.5"><MessageCircle className="size-2.5" />{nFmt(mostSharedPost.comments)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Department-wise Issue Distribution */}
      <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="mb-2 flex items-center gap-1.5">
          <BarChart3 className="size-3.5 text-primary" />
          <span className="text-xs font-semibold text-foreground">Department Issues</span>
        </div>
        <div className="space-y-1.5">
          {posts.length > 0 && (() => {
            const deptCounts: Record<string, { count: number; color: string }> = {}
            const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4", "#ec4899", "#f97316"]
            posts.forEach(p => {
              const dept = p.ai.department
              if (!deptCounts[dept]) deptCounts[dept] = { count: 0, color: colors[Object.keys(deptCounts).length % colors.length] }
              deptCounts[dept].count++
            })
            const sorted = Object.entries(deptCounts).sort((a, b) => b[1].count - a[1].count).slice(0, 6)
            const maxCount = sorted[0]?.[1].count || 1
            return sorted.map(([dept, info]) => (
              <div key={dept} className="flex items-center gap-2">
                <span className="w-24 text-[9px] text-muted-foreground truncate shrink-0">{dept}</span>
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${info.count / maxCount * 100}%`, backgroundColor: info.color }} />
                </div>
                <span className="text-[9px] font-medium text-foreground w-6 text-right">{info.count}</span>
              </div>
            ))
          })()}
        </div>
      </div>

      {/* Live Activity Chart */}
      <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="mb-2 flex items-center gap-1.5">
          <Activity className="size-3.5 text-emerald-400" />
          <span className="text-xs font-semibold text-foreground">Live Activity</span>
          <span className="ml-auto flex items-center gap-1 text-[8px] text-emerald-400">
            <span className="relative flex size-1.5"><span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" /></span>Live
          </span>
        </div>
        <div className="h-20">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyActivity} margin={{ top: 2, right: 2, left: -18, bottom: 0 }}>
              <defs><linearGradient id="postsGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} /><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="hour" tick={{ fontSize: 8, fill: "hsl(var(--muted-foreground))" }} interval={3} />
              <YAxis tick={{ fontSize: 8, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="posts" stroke="hsl(var(--primary))" fill="url(#postsGrad)" strokeWidth={1.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Sentiment Summary */}
      <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="mb-2 flex items-center gap-1.5">
          <Brain className="size-3.5 text-purple-400" />
          <span className="text-xs font-semibold text-foreground">AI Sentiment</span>
        </div>
        <SentimentSummary posts={posts} />
        <div className="mt-2 rounded-lg bg-gradient-to-r from-primary/5 to-transparent p-2 border border-primary/10">
          <div className="flex items-center gap-1 mb-0.5">
            <Sparkles className="size-2.5 text-primary" />
            <span className="text-[8px] font-semibold text-primary uppercase tracking-wider">AI Summary</span>
          </div>
          <p className="text-[9px] text-foreground/70 leading-relaxed">
            {posts.filter(p => p.severity === "Critical").length} critical, {posts.filter(p => p.category === "Water Supply").length} water, {posts.filter(p => p.category === "Roads").length} road issues.
            {trendingTopics[0]?.hashtag} trending ({nFmt(trendingTopics[0]?.postCount || 0)} posts).
          </p>
        </div>
      </div>

      {/* News Ticker */}
      {newsArticles.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
          <div className="mb-2 flex items-center gap-1.5">
            <Newspaper className="size-3.5 text-indigo-400" />
            <span className="text-xs font-semibold text-foreground">Breaking News</span>
            <span className="ml-auto flex items-center gap-1 text-[8px] text-emerald-400">
              <span className="relative flex size-1.5"><span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" /></span>
            </span>
          </div>
          <div className="relative overflow-hidden rounded-lg bg-muted/30" style={{ height: 130 }}>
            <div ref={tickerRef} className="absolute left-0 right-0 space-y-1 p-2 transition-transform" style={{ transform: `translateY(-${tickerPos}%)` }}>
              {[...newsArticles, ...newsArticles].map((a, i) => (
                <div key={`${a.id}-${i}`} className="rounded-lg bg-card p-2 shadow-sm border border-border/50 hover:border-primary/20 transition-colors cursor-pointer" onClick={() => window.open(a.url, "_blank")}>
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded bg-indigo-500/10 text-[7px] font-bold text-indigo-400">{a.sourceLogo}</div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-[10px] font-medium leading-tight text-foreground">{a.headline}</p>
                      <div className="mt-0.5 flex items-center gap-1.5 text-[8px] text-muted-foreground">
                        <span>{a.source}</span>
                        <span>·</span>
                        <span className={cn("font-medium", a.severity === "Critical" ? "text-red-400" : a.severity === "High" ? "text-amber-400" : "text-muted-foreground")}>{a.severity}</span>
                        <ArrowUpRight className="size-2.5 shrink-0" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
