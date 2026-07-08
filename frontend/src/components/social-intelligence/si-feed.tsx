"use client"

import { useState, useCallback, useRef, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Loader2, X, Hash, MapPin, MessageSquare, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAutoScroll } from "./use-live-dashboard"
import { SIFeedCard } from "./si-feed-card"
import type { SocialPost } from "@/types/social"
import type { ConstituencyDataSet } from "@/data/mock-constituency-data"

interface SIFeedProps {
  posts: SocialPost[]
  className?: string
  constituencyData?: ConstituencyDataSet
  onSearch?: (query: string) => void
  activeSearch?: string
  newLivePosts?: SocialPost[]  // new posts arriving from live simulation
  autoScrollEnabled?: boolean
}

const SUGGESTED_SEARCHES = [
  { label: "Water", query: "water shortage" },
  { label: "Roads", query: "pothole road" },
  { label: "Power", query: "power cut electricity" },
  { label: "Drainage", query: "drainage blocked" },
  { label: "Healthcare", query: "hospital PHC" },
]

export function SIFeed({ posts, className, constituencyData, onSearch, activeSearch, newLivePosts = [], autoScrollEnabled = false }: SIFeedProps) {
  const [searchQuery, setSearchQuery] = useState(activeSearch || "")
  const [sortBy, setSortBy] = useState<"latest" | "likes" | "severity">("latest")
  const [visibleCount, setVisibleCount] = useState(10)
  const [loading, setLoading] = useState(false)
  const [liveNotification, setLiveNotification] = useState<string | null>(null)
  const loaderRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const prevLiveCount = useRef(0)

  // Auto-scroll
  const { handleMouseEnter, handleMouseLeave, handleWheel } = useAutoScroll(scrollRef, {
    speed: 0.35,
    enabled: autoScrollEnabled,
  })

  useEffect(() => { if (activeSearch !== undefined) setSearchQuery(activeSearch) }, [activeSearch])

  // Show notification when new live post arrives
  useEffect(() => {
    if (newLivePosts.length > prevLiveCount.current) {
      const newPost = newLivePosts[0]
      setLiveNotification(`🔴 New: ${newPost.category} in ${newPost.geoLocation.village}`)
      setTimeout(() => setLiveNotification(null), 3000)
    }
    prevLiveCount.current = newLivePosts.length
  }, [newLivePosts])

  const sortedPosts = useMemo(() =>
    [...posts].sort((a, b) => {
      if (sortBy === "likes") return b.likes - a.likes
      if (sortBy === "severity") {
        const order = { Critical: 0, High: 1, Medium: 2, Low: 3 }
        return order[a.severity] - order[b.severity]
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    }),
  [posts, sortBy])

  const displayedPosts = sortedPosts.slice(0, visibleCount)
  const hasMore = visibleCount < sortedPosts.length

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return
    setLoading(true)
    setTimeout(() => { setVisibleCount((prev) => prev + 5); setLoading(false) }, 300)
  }, [loading, hasMore])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore() },
      { threshold: 0.1, rootMargin: "400px" },
    )
    if (loaderRef.current) observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [loadMore])

  const handleSearch = () => { if (onSearch && searchQuery.trim()) { onSearch(searchQuery.trim()); setVisibleCount(10) } }
  const handleSuggestionClick = (query: string) => { setSearchQuery(query); if (onSearch) { onSearch(query); setVisibleCount(10) } }
  const clearSearch = () => { setSearchQuery(""); setVisibleCount(10); if (onSearch) onSearch("") }

  return (
    <div
      className={cn("flex flex-col", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onWheel={handleWheel}
    >
      {/* Live new post notification */}
      <AnimatePresence>
        {liveNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mb-2 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-[11px] font-medium text-emerald-500 shadow-sm"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            {liveNotification}
            <button onClick={() => setLiveNotification(null)} className="ml-auto text-emerald-500/50 hover:text-emerald-400">
              <X className="size-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compact search + sort row */}
      <div className="mb-3 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search feed..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSearch() }}
            className="w-full rounded-lg border border-border bg-background py-1.5 pl-8 pr-7 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
          />
          {searchQuery && (
            <button onClick={clearSearch} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="size-3" />
            </button>
          )}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="rounded-lg border border-border bg-background px-2.5 py-1.5 pr-7 text-[10px] text-foreground focus:border-primary/50 focus:outline-none appearance-none cursor-pointer"
        >
          <option value="latest">Latest</option>
          <option value="likes">Most Liked</option>
          <option value="severity">Severity</option>
        </select>
        {autoScrollEnabled && (
          <span className="flex items-center gap-1 text-[9px] text-muted-foreground">
            <Sparkles className="size-2.5 text-emerald-400" />
            Auto
          </span>
        )}
      </div>

      {/* Suggestion chips */}
      <div className="mb-3 flex flex-wrap items-center gap-1">
        <span className="text-[9px] font-medium text-muted-foreground flex items-center gap-1">
          <Hash className="size-2.5" /> Quick:
        </span>
        {SUGGESTED_SEARCHES.map((s) => (
          <button
            key={s.query}
            onClick={() => handleSuggestionClick(s.query)}
            className={cn(
              "rounded-full px-2 py-0.5 text-[9px] font-medium transition-all border",
              activeSearch === s.query ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground border-transparent hover:border-border hover:text-foreground",
            )}
          >
            {s.label}
          </button>
        ))}
        {constituencyData && (
          <button
            onClick={() => handleSuggestionClick(constituencyData.name)}
            className="rounded-full px-2 py-0.5 text-[9px] font-medium transition-all border bg-muted text-muted-foreground border-transparent hover:border-border hover:text-foreground flex items-center gap-1"
          >
            <MapPin className="size-2" /> {constituencyData.name}
          </button>
        )}
      </div>

      {/* Post count bar */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
          <MessageSquare className="size-3" />
          Showing <strong>{displayedPosts.length}</strong> of <strong>{posts.length}</strong> posts
        </span>
        <span className="text-[10px] text-muted-foreground/60 flex items-center gap-1">
          <span className="inline-block size-1.5 rounded-full bg-red-500" />
          {posts.filter(p => p.severity === "Critical").length} critical
        </span>
      </div>

      {/* Scrollable feed area */}
      <div
        ref={scrollRef}
        className="space-y-3 overflow-y-auto max-h-[calc(100vh-380px)] pr-1 scrollbar-thin"
      >
        {displayedPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
            <MessageSquare className="mb-2 size-10 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">No posts match your filters</p>
            <p className="text-xs text-muted-foreground/60 mt-0.5">Try different keywords or clear filters</p>
            <button onClick={clearSearch} className="mt-2 text-xs text-primary hover:underline">Clear search</button>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {displayedPosts.map((post, i) => (
              <motion.div
                key={post.id}
                layout
                initial={i === 0 && newLivePosts.some((lp) => lp.id === post.id) ? { opacity: 0, y: -40, scale: 0.95 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i < 3 ? i * 0.04 : 0, duration: 0.35, ease: "easeOut" }}
              >
                <SIFeedCard post={post} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {/* Load more trigger */}
        <div ref={loaderRef} className="py-3">
          {loading && (
            <div className="flex items-center justify-center gap-2 py-3 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />
              Loading more...
            </div>
          )}
          {!hasMore && displayedPosts.length > 0 && (
            <p className="text-center text-[10px] text-muted-foreground/40 py-2">All {displayedPosts.length} posts loaded</p>
          )}
        </div>
      </div>
    </div>
  )
}
