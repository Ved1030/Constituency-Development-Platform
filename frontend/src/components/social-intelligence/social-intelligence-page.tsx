"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, AlertCircle, RefreshCw, X, AlertTriangle, TrendingUp, Layers, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { SIHeader } from "./si-header"
import { SIFilterBar } from "./si-filter-panel"
import { SIFeed } from "./si-feed"
import { SIRightPanel } from "./si-right-panel"
import {
  fetchSocialIntelligence,
  type SocialFilters,
} from "@/services/api/social-intelligence"
import { getConstituencyData } from "@/data/mock-constituency-data"
import { generateConstituencyPosts } from "@/data/mock-social-posts"
import type { SocialIntelligenceResponse, SocialPost } from "@/types/social"
import { useConstituency } from "@/context/ConstituencyContext"

const AUTO_REFRESH_MS = 5 * 60 * 1000

// ─── Alert bubble types ───
interface AlertBubble {
  id: number
  icon: typeof AlertTriangle
  color: string
  title: string
  subtitle: string
}

function generateAlert(): AlertBubble {
  const alerts = [
    { icon: AlertTriangle, color: "red", title: "High Priority Complaint Detected", subtitle: "Ward 14 • Water Supply" },
    { icon: TrendingUp, color: "orange", title: "Viral Complaint Crossing 20K Reach", subtitle: "Road damage in Korattur" },
    { icon: Layers, color: "green", title: "Duplicate Complaint Cluster Found", subtitle: "5 similar reports in Sewapuri" },
    { icon: Zap, color: "amber", title: "Electricity Complaints Increasing", subtitle: "3 new reports in 15 minutes" },
  ]
  return { id: Date.now(), ...alerts[Math.floor(Math.random() * alerts.length)] }
}

export function SocialIntelligencePage() {
  const { selectedConstituency, data: constituencyData } = useConstituency()
  const [response, setResponse] = useState<SocialIntelligenceResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<SocialFilters>({})
  const [dataSource, setDataSource] = useState<string>("mock")
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [syncing, setSyncing] = useState(false)
  const [livePosts, setLivePosts] = useState<SocialPost[]>([])
  const [allPosts, setAllPosts] = useState<SocialPost[]>([])
  const [alerts, setAlerts] = useState<AlertBubble[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const liveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const alertTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const postIndexRef = useRef(100)

  // ─── loadData only depends on constituency (not filters) ───
  // Filtering is now 100% client-side via filteredPosts memo.
  // Re-fetching on filter change was causing unnecessary re-renders
  // and was the root cause of the "No posts found" bug.
  const loadData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setSyncing(true)
      const filter = { constituency: selectedConstituency.name }
      const result = await fetchSocialIntelligence(filter, constituencyData)
      setResponse(result)
      setAllPosts(result.posts)
      setDataSource(result.dataSource || "mock")
      setLastRefresh(new Date())
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data")
    } finally {
      setLoading(false)
      setSyncing(false)
    }
  }, [selectedConstituency.name, constituencyData])

  useEffect(() => {
    setLoading(true)
    setLivePosts([])
    loadData()
  }, [loadData])

  useEffect(() => {
    intervalRef.current = setInterval(() => { loadData(true) }, AUTO_REFRESH_MS)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [loadData])

  // ─── Live post simulation every 15-25 seconds ───
  useEffect(() => {
    const scheduleNext = () => {
      const delay = 15000 + Math.random() * 10000 // 15-25s
      liveTimerRef.current = setTimeout(() => {
        const consName = selectedConstituency.name
        const newPosts = generateConstituencyPosts(consName, 1)
        if (newPosts.length > 0) {
          const post = newPosts[0]
          post.id = `live-${postIndexRef.current++}`
          setLivePosts((prev) => [post, ...prev].slice(0, 5))
          setAllPosts((prev) => [post, ...prev])
        }
        scheduleNext()
      }, delay)
    }
    scheduleNext()
    return () => { if (liveTimerRef.current) clearTimeout(liveTimerRef.current) }
  }, [selectedConstituency.name])

  // ─── AI Alert Bubble every 30-45 seconds (truly random per-tick) ───
  useEffect(() => {
    const scheduleNextAlert = () => {
      const delay = 30000 + Math.random() * 15000 // 30-45s
      alertTimerRef.current = setTimeout(() => {
        const alert = generateAlert()
        setAlerts((prev) => [...prev, alert])
        // Auto-dismiss after 4s
        setTimeout(() => {
          setAlerts((prev) => prev.filter((a) => a.id !== alert.id))
        }, 4000)
        scheduleNextAlert()
      }, delay)
    }
    scheduleNextAlert()
    return () => { if (alertTimerRef.current) clearTimeout(alertTimerRef.current) }
  }, [])

  const handleManualRefresh = async () => { await loadData(true) }

  const handleFilterChange = useCallback((newFilters: SocialFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }, [])

  const handleSearch = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, search: query || undefined }))
  }, [])

  // ─── Client-side filtering: apply ALL filters to the combined dataset ───
  // Previously filtering was split between fetchSocialIntelligence (platform/severity)
  // and the page (search only). This caused empty results when switching filters
  // because it would re-fetch with different filters instead of filtering locally.
  // Now ALL filtering is client-side — instant, no empty states between switches.
  const filteredPosts = useMemo((): SocialPost[] => {
    const all = [...livePosts, ...allPosts]
    let result = all

    // Platform filter
    if (filters.platform) {
      const platforms = filters.platform.split(",")
      result = result.filter((p) => platforms.includes(p.platform))
    }

    // Category filter
    if (filters.category) {
      const cats = filters.category.split(",")
      result = result.filter((p) => cats.includes(p.category))
    }

    // Severity filter
    if (filters.severity) {
      const sevs = filters.severity.split(",")
      result = result.filter((p) => sevs.includes(p.severity))
    }

    // Search filter
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (p) =>
          p.text.toLowerCase().includes(q) ||
          p.hashtags.some((h) => h.toLowerCase().includes(q)) ||
          p.authorName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.geoLocation.ward.toLowerCase().includes(q) ||
          p.geoLocation.village.toLowerCase().includes(q) ||
          p.ai.department.toLowerCase().includes(q),
      )
    }

    // Ward filter
    if (filters.ward) {
      result = result.filter((p) => p.geoLocation.ward.toLowerCase().includes(filters.ward!.toLowerCase()))
    }

    // Village filter
    if (filters.village) {
      result = result.filter((p) => p.geoLocation.village.toLowerCase().includes(filters.village!.toLowerCase()))
    }

    // Verified only
    if (filters.verifiedOnly) {
      result = result.filter((p) => p.isVerified)
    }

    // Media type filter
    if (filters.mediaType && filters.mediaType !== "all") {
      if (filters.mediaType === "image") {
        result = result.filter((p) => p.media.some((m) => m.type === "image"))
      } else if (filters.mediaType === "video") {
        result = result.filter((p) => p.media.some((m) => m.type === "video"))
      } else if (filters.mediaType === "reel") {
        result = result.filter((p) => p.media.some((m) => m.type === "reel" || m.type === "short"))
      }
    }

    // Min likes / shares / confidence
    if (filters.minLikes != null && filters.minLikes > 0) {
      result = result.filter((p) => p.likes >= (filters.minLikes as number))
    }
    if (filters.minShares != null && filters.minShares > 0) {
      result = result.filter((p) => p.shares >= (filters.minShares as number))
    }
    if (filters.minConfidence != null && filters.minConfidence > 0) {
      result = result.filter((p) => p.ai.confidence >= (filters.minConfidence as number))
    }

    return result
  }, [allPosts, livePosts, filters])

  const dynamicKPIs = useMemo(() => {
    if (!response) return null
    return {
      ...response.kpis,
      totalPostsToday: filteredPosts.length + livePosts.length,
      viralComplaints: filteredPosts.filter(p => p.shares > 500 || p.likes > 5000).length,
      avgAISeverity: filteredPosts.length > 0
        ? Math.round(filteredPosts.reduce((s, p) => s + p.ai.confidence, 0) / filteredPosts.length)
        : 0,
      sentimentScore: filteredPosts.length > 0
        ? Math.round(filteredPosts.filter(p => p.sentiment === "positive").length / filteredPosts.length * 100)
        : 0,
    }
  }, [response, filteredPosts, livePosts.length])

  const kpis = dynamicKPIs || (response ? response.kpis : null)

  // ─── Loading state ───
  if (loading && !response) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <Loader2 className="size-10 animate-spin text-primary" />
            <div className="absolute inset-0 animate-pulse rounded-full bg-primary/5" />
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading social intelligence data...
          </p>
        </div>
      </div>
    )
  }

  // ─── Error state ───
  if (error && !response) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="rounded-full bg-destructive/10 p-3">
            <AlertCircle className="size-8 text-destructive" />
          </div>
          <p className="text-sm text-destructive">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-all"
          >
            <RefreshCw className="size-3" />
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!response || !kpis) return null

  const minutesAgo = Math.floor((Date.now() - lastRefresh.getTime()) / 60000)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 relative"
    >
      <SIHeader
        kpis={kpis}
        dataSource={dataSource}
        lastRefresh={minutesAgo}
        onRefresh={handleManualRefresh}
        syncing={syncing}
      />

      <SIFilterBar onFilterChange={handleFilterChange} />

      <div className="flex gap-5">
        <div className="min-w-0 flex-1">
          <SIFeed
            posts={filteredPosts}
            constituencyData={constituencyData}
            onSearch={handleSearch}
            activeSearch={filters.search || ""}
            newLivePosts={livePosts}
            autoScrollEnabled={true}
          />
        </div>

        <div className="hidden w-[340px] shrink-0 xl:block">
          <div className="sticky top-4 max-h-[calc(100vh-90px)] overflow-y-auto pr-1 scrollbar-thin">
            <SIRightPanel
              trendingTopics={response.trendingTopics}
              trendingWards={response.trendingWards}
              newsArticles={response.newsArticles}
              hourlyActivity={response.hourlyActivity}
              platformDistribution={response.platformDistribution}
              kpis={kpis}
              posts={filteredPosts}
              topComplaint={response.topComplaint}
              mostSharedPost={
                filteredPosts.length > 0
                  ? filteredPosts.reduce((a, b) => a.shares > b.shares ? a : b, filteredPosts[0])
                  : response.mostSharedPost
              }
              latestVideos={filteredPosts.filter(p => p.media.some(m => m.type === "video" || m.type === "short")).slice(0, 5)}
            />
          </div>
        </div>
      </div>

      {/* ─── AI Alert Bubble (floating top-right) ─── */}
      <div className="fixed right-6 top-20 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {alerts.map((alert) => {
            const colorMap: Record<string, string> = {
              red: "border-red-500/30 bg-red-500/10 text-red-400",
              orange: "border-orange-500/30 bg-orange-500/10 text-orange-400",
              green: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
              amber: "border-amber-500/30 bg-amber-500/10 text-amber-400",
            }
            const bgMap: Record<string, string> = {
              red: "bg-red-500/20",
              orange: "bg-orange-500/20",
              green: "bg-emerald-500/20",
              amber: "bg-amber-500/20",
            }
            const Icon = alert.icon
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: 60, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.9 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={cn(
                  "pointer-events-auto flex items-start gap-2.5 rounded-xl border p-3 shadow-lg backdrop-blur-md w-72",
                  colorMap[alert.color],
                )}
              >
                <div className={cn("flex size-7 shrink-0 items-center justify-center rounded-full", bgMap[alert.color])}>
                  <Icon className="size-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold leading-tight">{alert.title}</p>
                  <p className="mt-0.5 text-[10px] opacity-70">{alert.subtitle}</p>
                </div>
                <button
                  onClick={() => setAlerts((prev) => prev.filter((a) => a.id !== alert.id))}
                  className="shrink-0 opacity-50 hover:opacity-100 transition-opacity"
                >
                  <X className="size-3" />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
