"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface RecentComplaint {
  id: string;
  title: string;
  category: string;
  severity: string;
  status: string;
  village: string;
  upvotes: number;
}

const severityColors: Record<string, string> = {
  critical: "bg-red-100 text-red-700 border-red-200",
  high: "bg-orange-100 text-orange-700 border-orange-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const statusColors: Record<string, string> = {
  pending: "bg-gray-100 text-gray-700",
  verified: "bg-blue-100 text-blue-700",
  "in-progress": "bg-amber-100 text-amber-700",
  resolved: "bg-emerald-100 text-emerald-700",
};

interface RecentComplaintCardProps {
  complaints: RecentComplaint[];
}

export function RecentComplaintCard({ complaints }: RecentComplaintCardProps) {
  return (
    <div className="space-y-2">
      {complaints.map((complaint, i) => (
        <motion.div
          key={complaint.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="flex items-center gap-4 rounded-xl border border-border p-4 transition-all hover:bg-muted/30 hover:shadow-sm"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground">{complaint.id}</span>
              <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", severityColors[complaint.severity])}>
                {complaint.severity}
              </span>
            </div>
            <div className="mt-1 truncate text-sm font-medium text-foreground">{complaint.title}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">{complaint.village} &middot; {complaint.upvotes} upvotes</div>
          </div>
          <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold", statusColors[complaint.status])}>
            {complaint.status}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
