"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Zap, AlertTriangle, TrendingUp, Users, MessageCircle, Share2, Heart, MapPin,
  Brain, Sparkles, ArrowRight, AtSign, Camera, Globe, Newspaper,
  Droplets, Road, GraduationCap, Lightbulb, Home, Heart as HeartIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useConstituency } from "@/context/ConstituencyContext";
import { getDashboardFeed } from "@/data/dashboard-social-data";

// ─── Icons for departments ───
const DEPT_ICONS: Record<string, typeof Droplets> = {
  "Water Supply": Droplets,
  Roads: Road,
  Healthcare: HeartIcon,
  Education: GraduationCap,
  Electricity: Lightbulb,
  Housing: Home,
  Sanitation: Droplets,
  Agriculture: Road,
};
function DeptIcon({ dept }: { dept: string }) {
  const Icon = DEPT_ICONS[dept] || AlertTriangle;
  return <Icon className="size-3.5" />;
}

// ─── Platform icon helper ───
function PlatformBadge({ platform }: { platform: string }) {
  const icons: Record<string, typeof AtSign> = {
    twitter: AtSign, instagram: Camera, facebook: Globe, citizen: Users, news: Newspaper,
  };
  const colors: Record<string, string> = {
    twitter: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    instagram: "text-pink-400 bg-pink-500/10 border-pink-500/20",
    facebook: "text-blue-400 bg-blue-600/10 border-blue-600/20",
    citizen: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    news: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  };
  const Icon = icons[platform] || AtSign;
  return (
    <span className={cn("flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[8px] font-medium", colors[platform] || "bg-muted text-muted-foreground")}>
      <Icon className="size-2.5" />
      {platform === "twitter" ? "X" : platform.charAt(0).toUpperCase() + platform.slice(1)}
    </span>
  );
}

// ─── Section header ───
function SectionHeader({ icon: Icon, label, badge, href, className }: {
  icon: any; label: string; badge?: string; href?: string; className?: string;
}) {
  const router = useRouter();
  return (
    <div className={cn("mb-2 flex items-center justify-between", className)}>
      <div className="flex items-center gap-1.5">
        <Icon className="size-3.5 text-primary" />
        <span className="text-xs font-semibold text-foreground">{label}</span>
        {badge && <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[8px] font-medium text-primary">{badge}</span>}
      </div>
      {href && (
        <button onClick={() => router.push(href)} className="flex items-center gap-0.5 text-[9px] text-primary hover:underline">
          View <ArrowRight className="size-2.5" />
        </button>
      )}
    </div>
  );
}

export function DashboardRightPanel() {
  const router = useRouter();
  const { data } = useConstituency();
  const [tickerIndex, setTickerIndex] = useState(0);

  // Top 5 AI priorities
  const topPriorities = useMemo(() => data.priorities.slice(0, 5), [data]);

  // Social media — 3 latest posts
  const socialPosts = useMemo(() => {
    return getDashboardFeed().slice(0, 3);
  }, []);

  // AI Insights — compact list
  const insights = useMemo(() => {
    return data.priorities.slice(0, 4).map((p) => ({
      icon: p.urgency >= 85 ? AlertTriangle : TrendingUp,
      title: `${p.department} — ${p.village}`,
      desc: `${p.issue.slice(0, 60)}...`,
      color: p.color === "red" ? "text-red-500" : p.color === "orange" ? "text-orange-500" : "text-amber-500",
      bg: p.color === "red" ? "bg-red-500/5" : p.color === "orange" ? "bg-orange-500/5" : "bg-amber-500/5",
      action: `${p.population.toLocaleString("en-IN")} affected · ${p.urgency}% urgency`,
    }));
  }, [data]);

  // Sentiment / Citizen Pulse
  const totalComplaints = data.villages.reduce((s, v) => s + v.complaints, 0);
  const criticalCount = data.villages.reduce((s, v) => s + v.criticalComplaints, 0);
  const satisfactionScore = Math.round(100 - (criticalCount / Math.max(totalComplaints, 1)) * 100);

  // Live alerts ticker — dynamically generated from constituency priorities
  const tickerAlerts = useMemo(() =>
    data.priorities.slice(0, 6).map((p) => {
      const icon =
        p.department === "Water Supply" ? Droplets :
        p.department === "Roads" ? Road :
        p.department === "Healthcare" ? HeartIcon :
        p.department === "Education" ? GraduationCap :
        p.department === "Electricity" ? Lightbulb :
        p.department === "Sanitation" ? Droplets :
        AlertTriangle;
      const color =
        p.urgency >= 90 ? "text-red-400" :
        p.urgency >= 80 ? "text-amber-400" :
        "text-blue-400";
      return { text: `${p.issue.slice(0, 45)} — ${p.village}`, icon, color };
    }),
  [data]);

  // Auto-scroll ticker
  useEffect(() => {
    const t = setInterval(() => setTickerIndex((i) => (i + 1) % tickerAlerts.length), 3000);
    return () => clearInterval(t);
  }, [tickerAlerts.length]);

  const bgForPriority = (p: typeof topPriorities[0]) =>
    p.urgency >= 90 ? "bg-red-500/10 text-red-500 border-red-500/20" :
    p.urgency >= 80 ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
    "bg-blue-500/10 text-blue-500 border-blue-500/20";

  return (
    <div className="space-y-3">
      {/* ─── AI Priority Engine (top 5) ─── */}
      <div className="rounded-xl border border-border/60 bg-card p-3 shadow-sm">
        <SectionHeader icon={Zap} label="AI Priority Engine" badge="Top 5" href="/mp/priority-engine" />
        <div className="space-y-1.5">
          {topPriorities.map((p, i) => (
            <motion.div
              key={p.rank}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="group flex items-start gap-2 rounded-lg border border-border/40 bg-muted/20 p-2 transition-all hover:bg-muted/40 hover:shadow-sm cursor-pointer"
              onClick={() => router.push("/mp/priority-engine")}
            >
              <div className={cn("flex size-6 shrink-0 items-center justify-center rounded-md text-[8px] font-bold border", bgForPriority(p))}>
                #{p.rank}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
                  <DeptIcon dept={p.department} />
                  <span className="truncate">{p.department}</span>
                  <span>·</span>
                  <span className="truncate">{p.village}</span>
                </div>
                <p className="text-[10px] font-medium text-foreground leading-snug line-clamp-1">{p.issue}</p>
                <div className="mt-0.5 flex items-center gap-2 text-[8px] text-muted-foreground">
                  <span className="flex items-center gap-0.5"><Users className="size-2.5" />{p.population.toLocaleString("en-IN")}</span>
                  <span className="flex items-center gap-0.5">Urgency {p.urgency}%</span>
                </div>
              </div>
              <div className={cn("flex items-center gap-1 rounded px-1 py-0.5 text-[7px] font-bold uppercase", bgForPriority(p))}>
                {p.color === "red" ? "Critical" : "Action"}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ─── Social Media Intelligence (3 latest) ─── */}
      <div className="rounded-xl border border-border/60 bg-card p-3 shadow-sm">
        <SectionHeader icon={AtSign} label="Social Intelligence" badge={`${getDashboardFeed().length} posts`} href="/mp/social-intelligence" />
        <div className="space-y-2">
          {socialPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group flex gap-2 rounded-lg border border-border/30 bg-muted/10 p-2 transition-all hover:bg-muted/30 hover:shadow-sm"
            >
              <div className="relative w-12 h-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                <img src={post.image} alt="" className="size-full object-cover" loading="lazy" />
                <div className="absolute bottom-0.5 right-0.5 rounded bg-black/60 px-0.5 text-[6px] text-white">
                  {post.platform === "twitter" ? "X" : post.platform.slice(0, 3)}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-semibold text-foreground truncate">{post.authorName}</span>
                  <PlatformBadge platform={post.platform} />
                </div>
                <p className="text-[8px] text-muted-foreground line-clamp-2 leading-relaxed mt-0.5">
                  {post.caption}
                </p>
                <div className="mt-0.5 flex items-center gap-2 text-[7px] text-muted-foreground">
                  <span className="flex items-center gap-0.5"><Heart className="size-2" />{post.likes > 999 ? `${(post.likes/1000).toFixed(1)}K` : post.likes}</span>
                  <span className="flex items-center gap-0.5"><MessageCircle className="size-2" />{post.comments}</span>
                  <span className="flex items-center gap-0.5"><Share2 className="size-2" />{post.shares}</span>
                  <span className="ml-auto"><MapPin className="size-2 inline" /> {post.village}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ─── AI Insights ─── */}
      <div className="rounded-xl border border-border/60 bg-card p-3 shadow-sm">
        <SectionHeader icon={Brain} label="AI Insights" badge={data.name} href="/mp/priority-engine" />
        <div className="space-y-1.5">
          {insights.map((insight, i) => {
            const Icon = insight.icon;
            return (
              <motion.div
                key={insight.title}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-start gap-2 rounded-lg border border-border/30 bg-muted/10 p-2 transition-all hover:bg-muted/20 cursor-pointer"
                onClick={() => router.push("/mp/priority-engine")}
              >
                <div className={cn("flex size-6 shrink-0 items-center justify-center rounded-md", insight.bg)}>
                  <Icon className={cn("size-3", insight.color)} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-medium text-foreground leading-tight line-clamp-1">{insight.title}</p>
                  <p className="text-[8px] text-muted-foreground mt-0.5">{insight.action}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ─── Citizen Pulse ─── */}
      <div className="rounded-xl border border-border/60 bg-card p-3 shadow-sm">
        <SectionHeader icon={TrendingUp} label="Citizen Pulse" href="/mp/social-intelligence" />
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-1">
            <div className="flex items-center justify-between text-[9px]">
              <span className="text-emerald-500 font-medium">{satisfactionScore}% Positive</span>
              <span className="text-red-500 font-medium">{100 - satisfactionScore}% Negative</span>
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500"
                style={{ width: `${satisfactionScore}%` }} />
            </div>
          </div>
          <span className="flex items-center gap-1 text-[8px] text-emerald-500 shrink-0">
            <span className="relative flex size-1.5"><span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" /></span>Live
          </span>
        </div>
        <div className="space-y-0.5 text-[9px] text-muted-foreground">
          <div className="flex justify-between">
            <span>Trending:</span>
            <span className="font-medium text-primary">{data.priorities[0]?.issue.slice(0, 30)}...</span>
          </div>
          <div className="flex justify-between">
            <span>Top complaint:</span>
            <span className="font-medium text-foreground">{data.priorities[0]?.department} · {data.priorities[0]?.village}</span>
          </div>
        </div>
      </div>

      {/* ─── Live Alerts Ticker ─── */}
      <div className="rounded-xl border border-border/60 bg-card p-3 shadow-sm">
        <div className="mb-2 flex items-center gap-1.5">
          <Sparkles className="size-3.5 text-amber-400" />
          <span className="text-xs font-semibold text-foreground">Live Alerts</span>
        </div>
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-red-500/5 to-amber-500/5 border border-red-500/10 px-3 py-2">
          <AnimatedAlert key={tickerIndex} alert={tickerAlerts[tickerIndex]} />
        </div>
      </div>
    </div>
  );
}

function AnimatedAlert({ alert }: { alert: { text: string; icon: any; color: string } }) {
  const Icon = alert.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-2"
    >
      <Icon className={cn("size-3.5 shrink-0", alert.color)} />
      <span className="text-[10px] font-medium text-foreground/80 truncate">{alert.text}</span>
      <span className="ml-auto flex items-center gap-1 text-[8px] text-emerald-500 shrink-0">
        <span className="relative flex size-1.5"><span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" /></span>
      </span>
    </motion.div>
  );
}
