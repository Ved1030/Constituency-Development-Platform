import type { ComplaintCategory } from "@/types/complaint";

export interface CitizenUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  address: string;
  constituency: string;
  district: string;
  state: string;
  pincode: string;
  preferredLanguage: string;
  totalComplaints: number;
  resolvedComplaints: number;
  participationScore: number;
  badges: { id: string; label: string; icon: string }[];
}

export interface VotingItem {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  supportCount: number;
  totalVotes: number;
  deadline: string;
  status: "trending" | "active" | "completed";
  progress: number;
  comments: number;
  supported: boolean;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  severity: "low" | "medium" | "high" | "critical";
  location: string;
  lat: number;
  lng: number;
  upvotes: number;
  status: "open" | "in-progress" | "resolved";
  distance?: string;
  reportedBy: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "status" | "alert" | "achievement" | "voting" | "system";
  read: boolean;
  createdAt: string;
}
