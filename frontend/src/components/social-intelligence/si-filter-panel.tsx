"use client"

import { useState, useEffect, useRef } from "react"
import {
  Search, X, AtSign, Camera, Globe, Video, Users, Newspaper,
  Filter, List,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { PlatformType, SeverityLevel } from "@/types/social"

const platforms: { key: PlatformType; icon: typeof AtSign; label: string }[] = [
  { key: "twitter", icon: AtSign, label: "X / Twitter" },
  { key: "instagram", icon: Camera, label: "Instagram" },
  { key: "facebook", icon: Globe, label: "Facebook" },
  { key: "youtube", icon: Video, label: "YouTube" },
  { key: "citizen", icon: Users, label: "Citizen" },
  { key: "news", icon: Newspaper, label: "News" },
]

const severities: SeverityLevel[] = ["Critical", "High", "Medium", "Low"]

interface SIFilterBarProps {
  onFilterChange?: (filters: Record<string, unknown>) => void
}

export function SIFilterBar({ onFilterChange }: SIFilterBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformType[]>([])
  const [allSelected, setAllSelected] = useState(true)
  const [selectedSeverity, setSelectedSeverity] = useState<string>("")
  const prevRef = useRef("")

  const handleAllClick = () => {
    setAllSelected(true)
    setSelectedPlatforms([])
    setSelectedSeverity("")
    setSearchQuery("")
  }

  const togglePlatform = (p: PlatformType) => {
    setAllSelected(false)
    setSelectedPlatforms((prev) => {
      const next = prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
      // If no platforms selected, go back to All
      if (next.length === 0) {
        setAllSelected(true)
      }
      return next
    })
  }

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (!onFilterChange) return
      const curr = JSON.stringify({
        platform: allSelected ? undefined : (selectedPlatforms.length > 0 ? selectedPlatforms.join(",") : undefined),
        severity: selectedSeverity || undefined,
        search: searchQuery || undefined,
      })
      if (curr !== prevRef.current) {
        prevRef.current = curr
        onFilterChange(JSON.parse(curr))
      }
    }, 300)
    return () => clearTimeout(handler)
  }, [searchQuery, selectedPlatforms, selectedSeverity, allSelected, onFilterChange])

  const hasActive = !allSelected || selectedSeverity || searchQuery

  return (
    <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative min-w-[200px] flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search posts, hashtags, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-background py-1.5 pl-8 pr-7 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="size-3" />
            </button>
          )}
        </div>

        {/* Platform chips */}
        <div className="flex flex-wrap items-center gap-1">
          {/* All button — first, persistent */}
          <button
            onClick={handleAllClick}
            className={cn(
              "flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium transition-all border",
              allSelected
                ? "bg-primary/15 text-primary border-primary/30 shadow-sm"
                : "bg-muted/50 text-muted-foreground border-transparent hover:border-border hover:text-foreground",
            )}
          >
            <List className="size-2.5" />
            All
          </button>
          {platforms.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => togglePlatform(key)}
              className={cn(
                "flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium transition-all border",
                selectedPlatforms.includes(key)
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-muted/50 text-muted-foreground border-transparent hover:border-border hover:text-foreground",
              )}
            >
              <Icon className="size-2.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Severity dropdown */}
        <select
          value={selectedSeverity}
          onChange={(e) => setSelectedSeverity(e.target.value)}
          className="rounded-lg border border-border bg-background px-2 py-1 text-[10px] font-medium text-foreground focus:border-primary/50 focus:outline-none appearance-none cursor-pointer"
        >
          <option value="">All Severity</option>
          {severities.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Show filter count */}
        {hasActive && (
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Filter className="size-2.5" />
            {(!allSelected ? selectedPlatforms.length : 0) + (selectedSeverity ? 1 : 0) + (searchQuery ? 1 : 0)} active
          </span>
        )}

        {/* Clear filters */}
        {hasActive && (
          <button
            onClick={handleAllClick}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <X className="size-2.5" />
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
