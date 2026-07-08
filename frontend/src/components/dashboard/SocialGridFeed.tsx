"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Filter, ArrowUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SocialGridCard } from "./SocialGridCard";
import { getDashboardFeed, type DashboardSocialPost } from "@/data/dashboard-social-data";

export function SocialGridFeed() {
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"latest" | "likes" | "severity">("latest");

  const allPosts = useMemo(() => getDashboardFeed(), []);

  const filteredPosts = useMemo(() => {
    let result = [...allPosts];

    if (filterSeverity) {
      result = result.filter((p) => p.severity === filterSeverity);
    }
    if (filterCategory) {
      result = result.filter((p) => p.category === filterCategory);
    }

    if (sortBy === "likes") {
      result.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === "severity") {
      const order: Record<string, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };
      result.sort((a, b) => (order[a.severity] ?? 0) - (order[b.severity] ?? 0));
    } else {
      result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }

    return result;
  }, [allPosts, filterSeverity, filterCategory, sortBy]);

  const categories = useMemo(() => {
    return [...new Set(allPosts.map((p) => p.category))];
  }, [allPosts]);

  const hasFilters = filterSeverity || filterCategory;

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5">
          <Filter className="size-3 text-muted-foreground" />
          <span className="text-[10px] font-medium text-muted-foreground">Filter:</span>
        </div>

        {/* Severity filters */}
        {["Critical", "High", "Medium", "Low"].map((sev) => (
          <button
            key={sev}
            onClick={() => setFilterSeverity(filterSeverity === sev ? null : sev)}
            className={cn(
              "rounded-full px-2.5 py-1 text-[10px] font-medium transition-all border",
              filterSeverity === sev
                ? sev === "Critical"
                  ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
                  : sev === "High"
                    ? "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20"
                    : sev === "Medium"
                      ? "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                      : "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                : "bg-muted text-muted-foreground border-transparent hover:border-border hover:text-foreground"
            )}
          >
            {sev}
          </button>
        ))}

        <div className="hidden h-4 w-px bg-border/60 sm:block" />

        {/* Category filters (first 5) */}
        {categories.slice(0, 5).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
            className={cn(
              "rounded-full px-2.5 py-1 text-[10px] font-medium transition-all border",
              filterCategory === cat
                ? "bg-primary/10 text-primary border-primary/20"
                : "bg-muted text-muted-foreground border-transparent hover:border-border hover:text-foreground"
            )}
          >
            {cat}
          </button>
        ))}

        {/* Sort */}
        <div className="ml-auto flex items-center gap-1.5">
          <ArrowUpDown className="size-3 text-muted-foreground" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="rounded-lg border border-border/60 bg-muted/30 px-2 py-1 text-[10px] text-muted-foreground focus:outline-none"
          >
            <option value="latest">Latest</option>
            <option value="likes">Most Liked</option>
            <option value="severity">Severity</option>
          </select>
        </div>

        {/* Clear filters */}
        {hasFilters && (
          <button
            onClick={() => { setFilterSeverity(null); setFilterCategory(null); }}
            className="flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="size-2.5" />
            Clear
          </button>
        )}
      </div>

      {/* Post count */}
      <div className="text-[10px] text-muted-foreground">
        Showing {filteredPosts.length} of {allPosts.length} posts
      </div>

      {/* Responsive grid */}
      {filteredPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16">
          <div className="mb-3 text-2xl">📭</div>
          <p className="text-sm font-medium text-muted-foreground">No posts match your filters</p>
          <button
            onClick={() => { setFilterSeverity(null); setFilterCategory(null); }}
            className="mt-2 text-xs text-primary hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post, i) => (
            <SocialGridCard key={post.id} post={post} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
