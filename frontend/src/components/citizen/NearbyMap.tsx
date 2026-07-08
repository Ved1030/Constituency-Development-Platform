"use client";

import { useState } from "react";
import { MapPin, Navigation, Layers, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Issue } from "@/types/citizen";

const categoryColors: Record<string, string> = {
  road: "bg-red-500",
  water: "bg-blue-500",
  electricity: "bg-yellow-500",
  healthcare: "bg-green-500",
  education: "bg-purple-500",
  sanitation: "bg-orange-500",
  other: "bg-gray-500",
};

interface NearbyMapProps {
  issues: Issue[];
}

export function NearbyMap({ issues }: NearbyMapProps) {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative aspect-[16/9] w-full bg-gradient-to-br from-primary/[0.03] to-accent/[0.03]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

        <div className="absolute inset-0 p-4">
          <div className="grid h-full grid-cols-3 grid-rows-3 gap-2">
            {Array.from({ length: 9 }).map((_, i) => {
              const row = Math.floor(i / 3);
              const col = i % 3;
              const issueIndex = (row * 3 + col) % issues.length;
              const issue = issues[issueIndex];
              const isSelected = selectedIssue?.id === issue.id;
              const isNearCenter = row === 1 && col === 1;

              return (
                <div
                  key={i}
                  className={cn(
                    "relative flex items-center justify-center rounded-xl border transition-all",
                    isNearCenter
                      ? "border-primary/20 bg-primary/[0.02]"
                      : "border-border/40 bg-card/30",
                  )}
                >
                  <button
                    onClick={() => setSelectedIssue(isSelected ? null : issue)}
                    className={cn(
                      "group relative flex size-8 items-center justify-center rounded-full transition-all hover:scale-110",
                      categoryColors[issue.category] || "bg-gray-500",
                      isSelected && "scale-125 ring-2 ring-primary ring-offset-2",
                    )}
                  >
                    <MapPin className="size-4 text-white" />
                    <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-foreground text-[8px] font-bold text-background">
                      {issue.upvotes}
                    </span>

                    <div className="absolute left-1/2 -bottom-8 z-20 hidden -translate-x-1/2 whitespace-nowrap group-hover:block">
                      <div className="rounded-lg bg-foreground px-2 py-1 text-[10px] text-background shadow-lg">
                        {issue.title}
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-1">
          <button className="flex size-8 items-center justify-center rounded-lg bg-card text-muted-foreground shadow-md hover:bg-muted border border-border">
            <Plus className="size-4" />
          </button>
          <button className="flex size-8 items-center justify-center rounded-lg bg-card text-muted-foreground shadow-md hover:bg-muted border border-border">
            <Minus className="size-4" />
          </button>
          <button className="flex size-8 items-center justify-center rounded-lg bg-card text-muted-foreground shadow-md hover:bg-muted border border-border">
            <Layers className="size-4" />
          </button>
        </div>

        <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-card/90 backdrop-blur-sm px-3 py-2 shadow-md border border-border">
          <Navigation className="size-3 text-primary" />
          <span className="text-xs text-muted-foreground">Ward 7, Chennai</span>
        </div>
      </div>

      {selectedIssue && (
        <div className="border-t border-border p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className={cn("size-2 rounded-full", categoryColors[selectedIssue.category])} />
                <h4 className="text-sm font-semibold text-foreground">{selectedIssue.title}</h4>
              </div>
              <p className="text-xs text-muted-foreground">{selectedIssue.description}</p>
              <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="size-3" />{selectedIssue.distance}</span>
                <span>Reported by {selectedIssue.reportedBy}</span>
              </div>
            </div>
            <Button size="sm" variant="outline" className="shrink-0 gap-1.5 text-xs">
              <MapPin className="size-3" />
              Navigate
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
