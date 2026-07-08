"use client";

import { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  X, AlertTriangle, Users, TrendingUp, Activity, Heart, MessageCircle,
  Share2, ChevronLeft, ChevronRight, MapPin, Clock, Camera, BarChart3,
  FileText, Image, Calendar, Shield, MoreHorizontal, Eye,
} from "lucide-react";
import type { DigitalTwinComplaint } from "@/types/digital-twin";
import { PRIORITY_COLORS } from "@/types/digital-twin";
import { mediaProvider, socialProvider, aiProvider, timelineProvider, analyticsProvider } from "@/providers/index";
import { cn } from "@/lib/utils";

const MediaGallery = dynamic(() => import("@/components/map/intelligence/MediaGallery"), { ssr: false });
const SocialSignals = dynamic(() => import("@/components/map/intelligence/SocialSignals"), { ssr: false });
const ComplaintTimeline = dynamic(() => import("@/components/map/intelligence/ComplaintTimeline"), { ssr: false });
const AnalyticsCharts = dynamic(() => import("@/components/map/intelligence/AnalyticsCharts"), { ssr: false });

interface RightIntelligencePanelProps {
  complaint: DigitalTwinComplaint | null;
  onClose: () => void;
  onSelectComplaint: (c: DigitalTwinComplaint) => void;
}

type TabId = "overview" | "media" | "timeline" | "analytics";

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: FileText },
  { id: "media", label: "Media", icon: Image },
  { id: "timeline", label: "Timeline", icon: Activity },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString("en-IN");
}

export default function RightIntelligencePanel({ complaint, onClose, onSelectComplaint }: RightIntelligencePanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [heroIdx, setHeroIdx] = useState(0);
  const [followed, setFollowed] = useState(false);

  const media = useMemo(() => (complaint ? mediaProvider.getMediaForComplaint(complaint.id) : []), [complaint]);
  const socialPosts = useMemo(() => (complaint ? socialProvider.getPostsForComplaint(complaint.id) : []), [complaint]);
  const aiAnalysis = useMemo(() => (complaint ? aiProvider.getAnalysisForComplaint(complaint) : null), [complaint]);
  const timeline = useMemo(() => (complaint ? timelineProvider.getTimelineForComplaint(complaint) : []), [complaint]);
  const analytics = useMemo(() => (complaint ? analyticsProvider.getAnalyticsForComplaint(complaint) : null), [complaint]);

  const photos = useMemo(() => media.filter((m) => m.type === "photo"), [media]);
  const heroImage = photos[heroIdx] || null;
  const hasMultiple = photos.length > 1;

  const prevHero = useCallback(() => setHeroIdx((i) => (i - 1 + photos.length) % photos.length), [photos.length]);
  const nextHero = useCallback(() => setHeroIdx((i) => (i + 1) % photos.length), [photos.length]);

  const socialTop3 = useMemo(() => socialPosts.slice(0, 3), [socialPosts]);

  const statCards = useMemo(() => {
    if (!complaint) return [];
    const sevColors: Record<string, string> = { critical: "#b91c1c", severe: "#f97316", moderate: "#eab308", minor: "#22c55e" };
    const severity = aiAnalysis?.severity || "moderate";
    return [
      { label: "Severity", value: severity.charAt(0).toUpperCase() + severity.slice(1), icon: AlertTriangle, color: sevColors[severity] || "#64748b" },
      { label: "Reports", value: formatCount(complaint.communityVotes), icon: Activity, color: "#8b5cf6" },
      { label: "Affected", value: formatCount(complaint.affectedPopulation), icon: Users, color: "#3b82f6" },
      { label: "Trend", value: aiAnalysis?.riskTrend === "escalating" ? "↑ 8%" : aiAnalysis?.riskTrend === "improving" ? "↓ 3%" : "→ 0%", icon: TrendingUp, color: aiAnalysis?.riskTrend === "escalating" ? "#b91c1c" : aiAnalysis?.riskTrend === "improving" ? "#22c55e" : "#64748b" },
    ];
  }, [complaint, aiAnalysis]);

  if (!complaint) {
    return (
      <div className="w-[380px] shrink-0 rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col items-center justify-center text-gray-400">
        <MapPin className="size-10 mb-3 opacity-40" />
        <p className="text-sm font-medium">Select a complaint</p>
        <p className="text-xs mt-1">Click a marker on the map</p>
      </div>
    );
  }

  return (
    <div className="w-[380px] shrink-0 rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col overflow-hidden">
      {/* ── Header ── */}
      <div className="border-b border-gray-100 px-5 pt-4 pb-3">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold text-white tracking-wide"
                style={{ backgroundColor: PRIORITY_COLORS[complaint.priority] }}
              >
                {complaint.priority.toUpperCase()}
              </span>
              <span className="text-[11px] font-mono text-gray-400">{complaint.id}</span>
            </div>
            <h2 className="text-sm font-bold text-gray-800 leading-snug line-clamp-2">{complaint.title}</h2>
          </div>
          <div className="flex items-center gap-1 ml-3 shrink-0">
            <button
              onClick={() => setFollowed(!followed)}
              className={cn(
                "rounded-lg px-2.5 py-1 text-[11px] font-semibold border transition-colors",
                followed
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              )}
            >
              {followed ? "Following" : "Follow"}
            </button>
            <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
              <X className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── 4 Stat Cards ── */}
      <div className="grid grid-cols-4 gap-2 px-5 pt-3 pb-2">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border border-gray-100 bg-gray-50/50 px-2.5 py-2 text-center">
              <Icon className="size-3.5 mx-auto mb-0.5" style={{ color: s.color }} />
              <p className="text-[13px] font-bold text-gray-800 leading-tight">{s.value}</p>
              <p className="text-[9px] font-medium text-gray-500 uppercase tracking-wider">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* ── Tabs ── */}
      <div className="flex border-b border-gray-100 px-5">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2.5 text-[11px] font-semibold border-b-2 transition-all relative",
                isActive
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              )}
            >
              <Icon className="size-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content (scrollable) ── */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* Hero Image */}
            <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-[16/9]">
              {heroImage ? (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <Camera className="size-8 text-gray-300" />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                  <Camera className="size-8 text-gray-300" />
                </div>
              )}
              {hasMultiple && (
                <>
                  <button onClick={prevHero} className="absolute left-2 top-1/2 -translate-y-1/2 size-7 rounded-full bg-white/90 shadow-sm flex items-center justify-center hover:bg-white transition-colors">
                    <ChevronLeft className="size-3.5 text-gray-700" />
                  </button>
                  <button onClick={nextHero} className="absolute right-2 top-1/2 -translate-y-1/2 size-7 rounded-full bg-white/90 shadow-sm flex items-center justify-center hover:bg-white transition-colors">
                    <ChevronRight className="size-3.5 text-gray-700" />
                  </button>
                  <div className="absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] text-white font-medium">
                    {heroIdx + 1}/{photos.length}
                  </div>
                </>
              )}
              {heroImage && (
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-0.5 text-[10px] text-white">
                  <Clock className="size-3" />
                  {formatDate(heroImage.timestamp)}
                </div>
              )}
            </div>

            {/* Social Cards */}
            {socialTop3.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Social Media</h4>
                <div className="grid grid-cols-3 gap-2">
                  {socialTop3.map((post) => {
                    const platformConfig: Record<string, { bg: string; icon: React.ElementType; label: string }> = {
                      instagram: { bg: "bg-gradient-to-br from-pink-500 to-orange-400", icon: Camera, label: "Instagram" },
                      twitter: { bg: "bg-black", icon: MessageCircle, label: "X" },
                      facebook: { bg: "bg-blue-600", icon: Heart, label: "Facebook" },
                      youtube: { bg: "bg-red-600", icon: Eye, label: "YouTube" },
                      googleNews: { bg: "bg-blue-500", icon: FileText, label: "News" },
                    };
                    const cfg = platformConfig[post.platform] || { bg: "bg-gray-500", icon: MessageCircle, label: post.platform };
                    const Icon = cfg.icon;
                    return (
                      <div key={post.id} className="rounded-xl border border-gray-100 overflow-hidden bg-white shadow-sm">
                        <div className={`h-14 flex items-center justify-center ${cfg.bg}`}>
                          <Icon className="size-5 text-white/90" />
                        </div>
                        <div className="p-2 space-y-1">
                          <p className="text-[10px] font-semibold text-gray-800 truncate">{cfg.label}</p>
                          <div className="flex items-center gap-2 text-[9px] text-gray-500">
                            <span className="flex items-center gap-0.5"><Heart className="size-2.5" />{formatCount(post.likes)}</span>
                            <span className="flex items-center gap-0.5"><MessageCircle className="size-2.5" />{formatCount(post.comments)}</span>
                            <span className="flex items-center gap-0.5"><Share2 className="size-2.5" />{formatCount(post.shares)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottom Info Cards */}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="size-3.5 text-emerald-600" />
                  <span className="text-[10px] font-semibold text-gray-500 uppercase">AI Confidence</span>
                </div>
                <p className="text-lg font-bold text-gray-800">{complaint.aiConfidence}%</p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="size-3.5 text-blue-600" />
                  <span className="text-[10px] font-semibold text-gray-500 uppercase">First Report</span>
                </div>
                <p className="text-sm font-bold text-gray-800">{formatDate(complaint.reportedAt)}</p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="size-3.5 text-purple-600" />
                  <span className="text-[10px] font-semibold text-gray-500 uppercase">Last Report</span>
                </div>
                <p className="text-sm font-bold text-gray-800">{formatDate(complaint.expectedResolution) || "N/A"}</p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="size-3.5 text-orange-600" />
                  <span className="text-[10px] font-semibold text-gray-500 uppercase">Est. Impact</span>
                </div>
                <p className="text-lg font-bold text-gray-800">{formatCount(complaint.affectedPopulation)}</p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-sm">
                View Timeline
              </button>
              <button className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                Open Full Details
              </button>
              <button className="rounded-xl border border-gray-200 bg-white px-2.5 py-2.5 text-gray-500 hover:bg-gray-50 transition-colors">
                <MoreHorizontal className="size-4" />
              </button>
            </div>
          </div>
        )}

        {activeTab === "media" && (
          <MediaGallery media={media} />
        )}

        {activeTab === "timeline" && (
          <ComplaintTimeline events={timeline} />
        )}

        {activeTab === "analytics" && (
          analytics ? (
            <AnalyticsCharts data={analytics} />
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <BarChart3 className="size-10 mb-3 opacity-30" />
              <p className="text-sm font-medium">No analytics data</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
