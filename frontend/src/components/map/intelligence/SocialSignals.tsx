"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Share2,
  Globe,
  Music,
  Video,
  Newspaper,
  ExternalLink,
  BadgeCheck,
  MapPin,
  Clock,
  RefreshCw,
  AtSign,
} from "lucide-react";
import type { SocialPost, SocialPlatform } from "@/types/digital-twin";
import { cn } from "@/lib/utils";

function formatRelativeTime(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  return `${months} month${months > 1 ? "s" : ""} ago`;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

const PLATFORM_CONFIG: Record<
  SocialPlatform,
  { icon: React.ElementType; color: string; label: string }
> = {
  twitter: { icon: AtSign, color: "#1DA1F2", label: "X" },
  facebook: { icon: Globe, color: "#1877F2", label: "Facebook" },
  instagram: { icon: Music, color: "#E4405F", label: "Instagram" },
  youtube: { icon: Video, color: "#FF0000", label: "YouTube" },
  googleNews: { icon: Newspaper, color: "#4285F4", label: "Google News" },
  reddit: { icon: ExternalLink, color: "#FF4500", label: "Reddit" },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

interface SocialSignalsProps {
  posts: SocialPost[];
}

export default function SocialSignals({ posts }: SocialSignalsProps) {
  const sorted = useMemo(
    () =>
      [...posts].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ),
    [posts]
  );

  if (sorted.length === 0) {
    return (
      <div>
        <Header count={0} />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="mb-4 rounded-2xl bg-muted p-5">
            <Newspaper className="size-10 text-muted-foreground/60" />
          </div>
          <p className="text-sm font-medium text-foreground">No social signals yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Posts mentioning this complaint will appear here
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div>
      <Header count={sorted.length} />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-2.5"
      >
        {sorted.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </motion.div>
    </div>
  );
}

function Header({ count }: { count: number }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">Social Signals</h3>
          <button className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <RefreshCw className="size-3.5" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          {count} {count === 1 ? "post" : "posts"} from across the web
        </p>
      </div>
    </div>
  );
}

function PostCard({ post }: { post: SocialPost }) {
  const platform = PLATFORM_CONFIG[post.platform];
  const Icon = platform.icon;

  return (
    <motion.div
      variants={cardVariants}
      className="rounded-xl border border-border p-4 transition-colors hover:bg-muted/50"
    >
      {/* Top row: platform + user + timestamp */}
      <div className="mb-2.5 flex items-center gap-2.5">
        <div
          className="flex size-7 items-center justify-center rounded-full"
          style={{ backgroundColor: `${platform.color}14` }}
        >
          <Icon className="size-3.5" style={{ color: platform.color }} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-semibold text-foreground">
              {post.displayName}
            </span>
            {post.verified && (
              <BadgeCheck className="size-3.5 shrink-0 text-sky-500" />
            )}
            <span className="shrink-0 text-xs text-muted-foreground">
              @{post.username}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
          <Clock className="size-3" />
          {formatRelativeTime(post.timestamp)}
        </div>
      </div>

      {/* Content */}
      <p className="mb-3 text-sm leading-relaxed text-foreground line-clamp-4">
        {post.content}
      </p>

      {/* Video badge */}
      {post.isVideo && (
        <div className="mb-3 inline-flex items-center gap-1 rounded-md bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-500">
          <Video className="size-3" />
          Video
        </div>
      )}

      {/* Bottom row: engagement */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <MapPin className="size-3" />
          {post.location}
        </span>
        {post.coordinates && (
          <span className="text-[11px] text-muted-foreground/60">
            {post.coordinates.lat.toFixed(4)}, {post.coordinates.lng.toFixed(4)}
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <Heart className="size-3" />
          {formatCount(post.likes)}
        </span>
        <span className="inline-flex items-center gap-1">
          <MessageCircle className="size-3" />
          {formatCount(post.comments)}
        </span>
        <span className="inline-flex items-center gap-1">
          <Share2 className="size-3" />
          {formatCount(post.shares)}
        </span>
      </div>
    </motion.div>
  );
}
