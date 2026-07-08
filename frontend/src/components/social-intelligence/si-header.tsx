"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  MessageSquare, AlertTriangle, Video, Image, ShieldAlert,
  TrendingUp, MapPin, Newspaper, RefreshCw, Sparkles, Activity,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAnimatedCounter } from "./use-live-dashboard"
import type { SocialIntelligenceKPIs } from "@/types/social"

const KPI_META: Record<string, { icon: typeof MessageSquare; label: string; color: string; iconColor: string; format: (v: number) => string }> = {
  totalPostsToday: { icon: MessageSquare, label: "Total Posts", color: "border-blue-500/20 bg-blue-500/5", iconColor: "text-blue-400", format: (v) => v.toLocaleString() },
  viralComplaints: { icon: AlertTriangle, label: "Critical", color: "border-red-500/20 bg-red-500/5", iconColor: "text-red-400", format: (v) => String(v) },
  videosUploaded: { icon: Video, label: "Videos", color: "border-purple-500/20 bg-purple-500/5", iconColor: "text-purple-400", format: (v) => v.toLocaleString() },
  imagesUploaded: { icon: Image, label: "Images", color: "border-emerald-500/20 bg-emerald-500/5", iconColor: "text-emerald-400", format: (v) => v.toLocaleString() },
  avgAISeverity: { icon: ShieldAlert, label: "AI Severity", color: "border-amber-500/20 bg-amber-500/5", iconColor: "text-amber-400", format: (v) => `${v}%` },
  sentimentScore: { icon: TrendingUp, label: "Sentiment", color: "border-rose-500/20 bg-rose-500/5", iconColor: "text-rose-400", format: (v) => `${v}%` },
  trendingLocations: { icon: MapPin, label: "Hotspots", color: "border-cyan-500/20 bg-cyan-500/5", iconColor: "text-cyan-400", format: (v) => String(v) },
  newsMentions: { icon: Newspaper, label: "News", color: "border-indigo-500/20 bg-indigo-500/5", iconColor: "text-indigo-400", format: (v) => String(v) },
}

const SCAN_SOURCES = [
  "Scanning Facebook...",
  "Scanning X...",
  "Scanning Instagram...",
  "Scanning Citizen Portal...",
  "Scanning News...",
]

interface SIHeaderProps {
  kpis: SocialIntelligenceKPIs
  dataSource?: string
  lastRefresh?: number
  onRefresh?: () => void
  syncing?: boolean
}

function AnimatedKPIValue({ value }: { value: number }) {
  const animated = useAnimatedCounter(value, 500)
  return <>{animated.toLocaleString()}</>
}

function AnimatedKPIWithPercent({ value }: { value: number }) {
  const animated = useAnimatedCounter(value, 500)
  return <>{animated}%</>
}

export function SIHeader({ kpis, dataSource = "mock", lastRefresh = 0, onRefresh, syncing = false }: SIHeaderProps) {
  const [time, setTime] = useState(new Date())
  const [scanIndex, setScanIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  // Rotate scan sources every 3 seconds
  useEffect(() => {
    const t = setInterval(() => setScanIndex((i) => (i + 1) % SCAN_SOURCES.length), 3000)
    return () => clearInterval(t)
  }, [])

  const formatTime = (d: Date) => d.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" })
  const isLive = dataSource === "live"

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 shadow-lg border border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.12),transparent_50%)]" />

      <div className="relative z-10">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-white">Social Media Intelligence</h1>
            <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[9px] font-medium text-primary">MP Portal</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Live monitoring indicator with rotating scan text */}
            <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] text-emerald-400 border border-emerald-500/20">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span className="font-medium">Live Monitoring</span>
              <span className="text-emerald-500/70" style={{ minWidth: 120, display: "inline-block" }}>
                <motion.span
                  key={scanIndex}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="inline-block"
                >
                  {SCAN_SOURCES[scanIndex]}
                </motion.span>
              </span>
            </div>

            <div className={cn("flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] border", isLive ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20")}>
              {isLive ? <><span className="relative flex size-1.5"><span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" /></span>LIVE</> : <><Sparkles className="size-2.5" />DEMO</>}
            </div>
            {lastRefresh > 0 && <span className="text-[10px] text-slate-500">{lastRefresh < 1 ? "Just now" : `${lastRefresh}m ago`}</span>}
            {onRefresh && (
              <button onClick={onRefresh} disabled={syncing} className="flex items-center gap-1 rounded-lg bg-white/5 px-2 py-1 text-[10px] text-slate-400 transition-all hover:bg-white/10 hover:text-white disabled:opacity-50 border border-white/10">
                <RefreshCw className={cn("size-2.5", syncing && "animate-spin")} />
                Refresh
              </button>
            )}
            <div className="rounded-lg bg-white/5 px-2 py-1 text-[10px] text-slate-400 border border-white/10">{formatTime(time)}</div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 md:grid-cols-8">
          {Object.entries(KPI_META).map(([key, meta], i) => {
            const value = kpis[key as keyof SocialIntelligenceKPIs] as number
            const Icon = meta.icon
            const isPercent = key === "avgAISeverity" || key === "sentimentScore"
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.2 }}
                className={cn("rounded-lg border p-2.5 transition-all hover:scale-[1.02]", meta.color)}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <Icon className={cn("size-3", meta.iconColor)} />
                  <span className="text-[9px] text-slate-500">{meta.label}</span>
                </div>
                <div className="text-sm font-bold text-white">
                  {isPercent ? <AnimatedKPIWithPercent value={value} /> : <AnimatedKPIValue value={value} />}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
