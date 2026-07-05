"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  AlertTriangle,
  Clock,
  MapPin,
  Users,
  Vote,
  BadgeIndianRupee,
  Calendar,
  User,
  Brain,
  Camera,
  Mic,
  FileText,
  Target,
  TrendingUp,
} from "lucide-react";
import type { DigitalTwinComplaint } from "@/types/digital-twin";
import { PRIORITY_COLORS } from "@/types/digital-twin";

interface ComplaintDrawerProps {
  complaint: DigitalTwinComplaint | null;
  onClose: () => void;
}

function InfoRow({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: React.ReactNode; color?: string }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="mt-0.5 rounded-lg bg-muted p-1.5">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`text-sm font-medium ${color || "text-foreground"}`}>{value}</p>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 pt-4 pb-2">
      <Icon className="size-4 text-emerald-600" />
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h4>
    </div>
  );
}

export default function ComplaintDrawer({ complaint, onClose }: ComplaintDrawerProps) {
  return (
    <AnimatePresence>
      {complaint && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-[9999] h-full w-full max-w-md overflow-y-auto border-l border-border bg-card shadow-2xl"
          >
            <div className="flex h-full flex-col" style={{ minHeight: "100%" }}>
              {/* Header */}
              <div className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur-sm">
                <div className="flex items-start justify-between p-5">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                        style={{ backgroundColor: PRIORITY_COLORS[complaint.priority] }}
                      >
                        {complaint.priority}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                        {complaint.status}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold leading-tight text-foreground">{complaint.title}</h2>
                    <p className="mt-1 text-xs text-muted-foreground">{complaint.id}</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="ml-3 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <X className="size-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-5">
                {/* Description */}
                <div className="mb-4 rounded-xl border border-border bg-muted/30 p-4">
                  <p className="text-sm leading-relaxed text-foreground">{complaint.description}</p>
                </div>

                {/* Basic Info */}
                <SectionHeader icon={FileText} title="Complaint Details" />
                <div className="divide-y divide-border/50">
                  <InfoRow icon={MapPin} label="Village / Ward" value={`${complaint.village}, ${complaint.ward}`} />
                  <InfoRow icon={AlertTriangle} label="Department" value={complaint.department} />
                  <InfoRow icon={Users} label="Affected Population" value={complaint.affectedPopulation.toLocaleString("en-IN")} />
                  <InfoRow icon={Vote} label="Community Votes" value={`${complaint.communityVotes} citizens`} />
                  <InfoRow icon={Calendar} label="Reported Date" value={new Date(complaint.reportedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} />
                  <InfoRow icon={User} label="Assigned Officer" value={complaint.assignedOfficer} />
                  <InfoRow icon={BadgeIndianRupee} label="Estimated Budget" value={`₹${(complaint.estimatedBudget / 100000).toFixed(1)} Lakh`} />
                  <InfoRow icon={Clock} label="Expected Resolution" value={complaint.expectedResolution} />
                </div>

                {/* AI Insights */}
                <SectionHeader icon={Brain} title="AI Analysis" />
                <div className="space-y-3">
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Target className="size-3.5 text-emerald-600" />
                      <span className="text-xs font-semibold text-emerald-600">Summary</span>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/80">{complaint.aiSummary}</p>
                  </div>
                  <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <TrendingUp className="size-3.5 text-blue-600" />
                      <span className="text-xs font-semibold text-blue-600">Recommendation</span>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/80">{complaint.aiRecommendation}</p>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
                    <div className="rounded-lg bg-emerald-500/10 p-2">
                      <Brain className="size-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">AI Confidence</p>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-emerald-500 transition-all"
                            style={{ width: `${complaint.aiConfidence}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-emerald-600">{complaint.aiConfidence}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Media */}
                <SectionHeader icon={Camera} title="Evidence" />
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
                    <Camera className="size-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {complaint.photos.length > 0 ? `${complaint.photos.length} photo(s) attached` : "No photos attached"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
                    <Mic className="size-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {complaint.voiceNote ? "Voice note available" : "No voice note"}
                    </span>
                  </div>
                </div>

                {/* Bottom spacing */}
                <div className="h-6" />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
