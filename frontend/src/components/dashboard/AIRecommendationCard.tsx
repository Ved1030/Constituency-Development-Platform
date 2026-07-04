"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Brain, ArrowRight, AlertTriangle, Lightbulb, TrendingUp } from "lucide-react";

interface AIInsight {
  id: string;
  title: string;
  description: string;
  type: "recommendation" | "alert" | "opportunity" | "prediction";
  priority: "high" | "medium" | "low";
  impact: string;
  category: string;
}

const typeConfig: Record<string, { icon: typeof Brain; color: string; bg: string; label: string }> = {
  prediction: { icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50", label: "Prediction" },
  recommendation: { icon: Lightbulb, color: "text-blue-600", bg: "bg-blue-50", label: "Recommendation" },
  alert: { icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50", label: "Alert" },
  opportunity: { icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", label: "Opportunity" },
};

const priorityColors: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-emerald-100 text-emerald-700",
};

interface AIRecommendationCardProps {
  insights: AIInsight[];
}

export function AIRecommendationCard({ insights }: AIRecommendationCardProps) {
  const router = useRouter();
  return (
    <div className="space-y-3">
      {insights.map((insight, i) => {
        const config = typeConfig[insight.type] || typeConfig.recommendation;
        const Icon = config.icon;

        return (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="group rounded-xl border border-border p-4 transition-all hover:border-primary/20 hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", config.bg)}>
                <Icon className={cn("size-5", config.color)} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", config.bg, config.color)}>
                    {config.label}
                  </span>
                  <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", priorityColors[insight.priority])}>
                    {insight.priority}
                  </span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {insight.category}
                  </span>
                </div>
                <div className="mt-2 text-sm font-semibold text-foreground">{insight.title}</div>
                <div className="mt-1 text-xs text-muted-foreground line-clamp-2">{insight.description}</div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-primary">{insight.impact}</span>
                  <button
                    onClick={() => router.push("/mp/recommendations")}
                    className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    View Details <ArrowRight className="size-3" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
