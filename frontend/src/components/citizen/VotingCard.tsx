"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ThumbsUp, MessageSquare, Clock, TrendingUp, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { VotingItem } from "@/data/mock-citizen";

interface VotingCardProps {
  item: VotingItem;
  index?: number;
}

export function VotingCard({ item, index = 0 }: VotingCardProps) {
  const [supported, setSupported] = useState(item.supported);
  const [supportCount, setSupportCount] = useState(item.supportCount);

  const handleSupport = () => {
    setSupported(!supported);
    setSupportCount((c) => supported ? c - 1 : c + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group rounded-2xl border border-border bg-card p-5 transition-all hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            {item.status === "trending" && (
              <Badge variant="secondary" className="gap-1 text-[10px]">
                <TrendingUp className="size-3" />
                Trending
              </Badge>
            )}
            {item.status === "completed" && (
              <Badge variant="default" className="bg-success/10 text-success text-[10px]">
                <CheckCircle className="size-3" />
                Completed
              </Badge>
            )}
            {item.status === "active" && (
              <Badge variant="outline" className="text-[10px]">
                <Clock className="size-3" />
                Active
              </Badge>
            )}
          </div>
          <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{item.description}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
          <span>{supportCount.toLocaleString()} supporters</span>
          <span>{item.totalVotes.toLocaleString()} target</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-700",
              supported ? "bg-primary" : "bg-muted-foreground/30",
            )}
            style={{ width: `${item.progress}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MessageSquare className="size-3" />
          {item.comments} comments
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">
            Ends {item.deadline}
          </span>
          {item.status !== "completed" && (
            <Button
              size="sm"
              variant={supported ? "default" : "outline"}
              className={cn(
                "gap-1.5 text-xs h-7",
                supported && "bg-primary text-primary-foreground",
              )}
              onClick={handleSupport}
            >
              <ThumbsUp className={cn("size-3", supported && "fill-current")} />
              {supported ? "Supported" : "Support"}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
