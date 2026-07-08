"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Lightbulb,
  FileText,
  Download,
  Calendar,
  IndianRupee,
  Users,
  Clock,
  CheckCircle2,
  Brain,
  Printer,
  ChevronDown,
  ChevronUp,
  Landmark,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";

const policyRecommendations = [
  {
    id: "POL-001",
    title: "Emergency Water Infrastructure Modernization",
    department: "Water Supply",
    priority: "Critical",
    estimatedBudget: "₹12.5 Cr",
    timeline: "18 months",
    beneficiaries: 185000,
    status: "Under Review",
    sections: [
      { heading: "Background", content: "Aging water infrastructure in North Chennai causing frequent pipeline bursts and supply interruptions. 78% of pipelines are over 25 years old." },
      { heading: "Recommended Actions", content: "Replace 45km of old pipelines, install smart water meters, build 3 new overhead tanks." },
      { heading: "Budget Breakdown", content: "Pipeline replacement: ₹7.2 Cr, Smart meters: ₹2.8 Cr, Overhead tanks: ₹2.5 Cr" },
      { heading: "Expected Outcomes", content: "Reduce water loss by 40%, improve supply regularity to 22 hours/day, serve 1.85L citizens." },
    ],
  },
  {
    id: "POL-002",
    title: "Road Safety & Infrastructure Overhaul",
    department: "Roads & Infrastructure",
    priority: "High",
    estimatedBudget: "₹8.2 Cr",
    timeline: "12 months",
    beneficiaries: 450000,
    status: "Drafting",
    sections: [
      { heading: "Background", content: "2,847 road-related complaints this year. 156 accident hotspots identified. 34% of roads need resurfacing." },
      { heading: "Recommended Actions", content: "Resurface 120km of roads, install 450 LED streetlights, build 25 pedestrian crossings." },
      { heading: "Budget Breakdown", content: "Resurfacing: ₹5.2 Cr, Streetlights: ₹1.8 Cr, Crossings: ₹1.2 Cr" },
      { heading: "Expected Outcomes", content: "Reduce accidents by 35%, improve commute times by 20%, increase citizen satisfaction by 25%." },
    ],
  },
  {
    id: "POL-003",
    title: "Smart Sanitation & Waste Management",
    department: "Sanitation",
    priority: "High",
    estimatedBudget: "₹5.8 Cr",
    timeline: "9 months",
    beneficiaries: 320000,
    status: "Approved",
    sections: [
      { heading: "Background", content: "Current waste collection covers only 62% of households. Open dumping in 14 locations." },
      { heading: "Recommended Actions", content: "Door-to-door collection for all 68 panchayats, 3 transfer stations, composting facility." },
      { heading: "Budget Breakdown", content: "Collection vehicles: ₹2.2 Cr, Transfer stations: ₹2.1 Cr, Composting: ₹1.5 Cr" },
      { heading: "Expected Outcomes", content: "100% waste collection, 60% recycling rate, elimination of open dumping." },
    ],
  },
  {
    id: "POL-004",
    title: "Healthcare Access Expansion",
    department: "Healthcare",
    priority: "Medium",
    estimatedBudget: "₹6.5 Cr",
    timeline: "24 months",
    beneficiaries: 280000,
    status: "Under Review",
    sections: [
      { heading: "Background", content: "Only 2 primary health centers for 1.84L population. Average wait time is 45 minutes." },
      { heading: "Recommended Actions", content: "Build 4 new PHCs, upgrade 2 existing ones, mobile health vans for remote villages." },
      { heading: "Budget Breakdown", content: "New PHCs: ₹3.6 Cr, Upgrades: ₹1.8 Cr, Mobile vans: ₹1.1 Cr" },
      { heading: "Expected Outcomes", content: "Coverage for additional 2.8L citizens, reduce wait time to 15 minutes." },
    ],
  },
];

const policyTemplates = [
  {
    id: "TPL-001",
    title: "Emergency Water Infrastructure Upgrade",
    department: "Water Supply",
    priority: "Critical",
    estimatedBudget: "₹4.2 Cr",
    timeline: "6 months",
    beneficiaries: 38300,
    status: "Draft",
  },
  {
    id: "TPL-002",
    title: "School Safety Renovation Program",
    department: "Education",
    priority: "High",
    estimatedBudget: "₹2.8 Cr",
    timeline: "12 months",
    beneficiaries: 12400,
    status: "Draft",
  },
  {
    id: "TPL-003",
    title: "Solar Street Light Expansion Phase 3",
    department: "Electricity",
    priority: "Medium",
    estimatedBudget: "₹1.5 Cr",
    timeline: "4 months",
    beneficiaries: 45000,
    status: "Draft",
  },
  {
    id: "TPL-004",
    title: "PHC Capacity Enhancement Program",
    department: "Healthcare",
    priority: "High",
    estimatedBudget: "₹3.6 Cr",
    timeline: "18 months",
    beneficiaries: 32000,
    status: "Draft",
  },
  {
    id: "TPL-005",
    title: "Drainage Monsoon Preparedness Plan",
    department: "Sanitation",
    priority: "Critical",
    estimatedBudget: "₹80 Lakh",
    timeline: "3 months",
    beneficiaries: 45000,
    status: "Draft",
  },
];

const priorityConfig: Record<string, { bg: string; text: string }> = {
  Critical: { bg: "bg-red-50", text: "text-red-600" },
  High: { bg: "bg-amber-50", text: "text-amber-600" },
  Medium: { bg: "bg-blue-50", text: "text-primary" },
};

export default function RecommendationsPage() {
  const { t } = useTranslation();
  const [expandedPolicy, setExpandedPolicy] = useState<string | null>(policyRecommendations[0]?.id || null);

  const policy = policyRecommendations[0];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2">
          <Lightbulb className="size-5 text-amber-600" />
          <h1 className="text-2xl font-bold text-foreground">{t("mp.recommendations.policyRecommendationEngine")}</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{t("mp.recommendations.aiGeneratedProposals")}</p>
      </motion.div>

      <div className="flex flex-wrap gap-2">
        <button className="flex items-center gap-2 rounded-xl bg-primary/15 px-4 py-2.5 text-sm font-medium text-primary border border-blue-200 hover:bg-primary/25 transition-colors">
          <Brain className="size-4" />
          {t("mp.recommendations.generateNewPolicy")}
        </button>
        <button className="flex items-center gap-2 rounded-xl bg-muted px-4 py-2.5 text-sm font-medium text-muted-foreground border border-border hover:bg-muted/80 transition-colors">
          <Download className="size-4" />
          {t("mp.recommendations.exportAsPdf")}
        </button>
        <button className="flex items-center gap-2 rounded-xl bg-muted px-4 py-2.5 text-sm font-medium text-muted-foreground border border-border hover:bg-muted/80 transition-colors">
          <Printer className="size-4" />
          {t("mp.recommendations.print")}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-3 xl:col-span-1">
          <h3 className="text-sm font-semibold text-foreground">{t("mp.recommendations.policyProposals")}</h3>
          {policyTemplates.map((p, i) => {
            const pri = priorityConfig[p.priority];
            return (
              <motion.button
                key={p.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => setExpandedPolicy(p.id)}
                className={cn(
                  "w-full rounded-xl border p-4 text-left transition-all",
                  expandedPolicy === p.id
                    ? "border-blue-200 bg-blue-50"
                    : "border-border bg-card hover:bg-muted/50",
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase", pri.bg, pri.text)}>
                        {p.priority}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{p.id}</span>
                    </div>
                    <h4 className="mt-2 text-sm font-semibold text-foreground truncate">{p.title}</h4>
                    <div className="mt-1 text-[11px] text-muted-foreground">{p.department}</div>
                    <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1"><IndianRupee className="size-3" />{p.estimatedBudget}</span>
                      <span className="flex items-center gap-1"><Clock className="size-3" />{p.timeline}</span>
                    </div>
                  </div>
                  {expandedPolicy === p.id ? (
                    <ChevronUp className="size-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="size-4 text-muted-foreground shrink-0" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="xl:col-span-2"
        >
          {policy && (
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="border-b border-border bg-muted/50 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500">
                    <Landmark className="size-6 text-white" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-primary uppercase tracking-wider">{t("mp.recommendations.govtOfTN")}</div>
                    <div className="text-[10px] text-muted-foreground">{t("mp.recommendations.constituencyDevDivision")}</div>
                  </div>
                </div>

                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                  <div className="text-[10px] font-bold text-primary uppercase tracking-wider mb-2">{t("mp.recommendations.policyProposal")}</div>
                  <h2 className="text-xl font-bold text-foreground">{policy.title}</h2>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Shield className="size-3.5" />
                      {t("mp.recommendations.department")} {policy.department}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <IndianRupee className="size-3.5" />
                      {t("mp.recommendations.budget")} {policy.estimatedBudget}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="size-3.5" />
                      {t("mp.recommendations.timeline")} {policy.timeline}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users className="size-3.5" />
                      {t("mp.recommendations.beneficiaries")} {policy.beneficiaries.toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {policy.sections.map((section, i) => (
                  <motion.div
                    key={section.heading}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <h3 className="flex items-center gap-2 text-sm font-bold text-foreground mb-2">
                      <span className="flex size-6 items-center justify-center rounded-lg bg-blue-50 text-[11px] font-bold text-primary">
                        {i + 1}
                      </span>
                      {section.heading}
                    </h3>
                    <div className="ml-8 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {section.content}
                    </div>
                  </motion.div>
                ))}

                <div className="rounded-xl border border-purple-200 bg-purple-50 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="size-4 text-purple-600" />
                    <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">{t("mp.recommendations.aiAnalysis")}</span>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>This proposal addresses a <span className="text-red-600 font-semibold">critical</span> infrastructure gap affecting {policy.beneficiaries.toLocaleString("en-IN")} residents.</p>
                    <p>Cost-benefit analysis shows an expected <span className="text-emerald-600 font-semibold">78% reduction</span> in water supply complaints and <span className="text-emerald-600 font-semibold">₹3.2 Cr</span> annual savings in emergency tanker costs.</p>
                    <p>Implementation feasibility: <span className="text-primary font-semibold">High</span> (based on similar projects in 3 other constituencies).</p>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-muted/50 p-5">
                  <h3 className="text-sm font-bold text-foreground mb-3">{t("mp.recommendations.approvalTimeline")}</h3>
                  <div className="space-y-3">
                    {[
                      { step: t("mp.recommendations.policyDraft"), status: "completed", date: "Jan 2025" },
                      { step: t("mp.recommendations.aiReviewOptimization"), status: "completed", date: "Jan 2025" },
                      { step: t("mp.recommendations.mpReviewApproval"), status: "in-progress", date: "Feb 2025" },
                      { step: t("mp.recommendations.districtCollectorSignoff"), status: "pending", date: "Mar 2025" },
                      { step: t("mp.recommendations.stateGovernmentClearance"), status: "pending", date: "Apr 2025" },
                      { step: t("mp.recommendations.implementationKickoff"), status: "pending", date: "May 2025" },
                    ].map((item, i) => (
                      <div key={item.step} className="flex items-center gap-3">
                        <div className={cn(
                          "flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                          item.status === "completed" ? "bg-emerald-50 text-emerald-600" :
                          item.status === "in-progress" ? "bg-blue-50 text-primary" :
                          "bg-muted text-muted-foreground",
                        )}>
                          {item.status === "completed" ? <CheckCircle2 className="size-3.5" /> : i + 1}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground">{item.step}</div>
                        </div>
                        <span className="text-[11px] text-muted-foreground">{item.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
