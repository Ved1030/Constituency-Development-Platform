import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/auth";

export interface DashboardStats {
  totalComplaints: number;
  openComplaints: number;
  inProgressComplaints: number;
  resolvedComplaints: number;
  participationScore: number;
}

/**
 * Fetch dashboard stats for the current user.
 */
export async function fetchMyDashboardStats(
  userId: string,
): Promise<DashboardStats> {
  const supabase = createClient();

  const { data: complaints, error } = await supabase
    .from("complaints")
    .select("status")
    .eq("citizen_id", userId);

  if (error) throw error;

  const total = complaints?.length ?? 0;
  const open = complaints?.filter((c) => c.status === "pending" || c.status === "verified").length ?? 0;
  const inProgress = complaints?.filter((c) => c.status === "in-progress").length ?? 0;
  const resolved = complaints?.filter((c) => c.status === "resolved").length ?? 0;

  return {
    totalComplaints: total,
    openComplaints: open,
    inProgressComplaints: inProgress,
    resolvedComplaints: resolved,
    participationScore: Math.min(1000, total * 10 + resolved * 25),
  };
}

/**
 * Fetch complaints for the current user.
 */
export async function fetchMyComplaints(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("complaints")
    .select("*")
    .eq("citizen_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

/**
 * Insert a new complaint for the current user.
 */
export async function createMyComplaint(payload: {
  title: string;
  description: string;
  category: string;
  citizen_name: string;
  gps_latitude?: number | null;
  gps_longitude?: number | null;
  gps_accuracy?: number | null;
  village?: string;
  ward?: string;
  district?: string;
  state?: string;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("complaints")
    .insert({
      citizen_id: user.id,
      title: payload.title,
      description: payload.description,
      category: payload.category,
      citizen_name: payload.citizen_name,
      gps_latitude: payload.gps_latitude ?? null,
      gps_longitude: payload.gps_longitude ?? null,
      gps_accuracy: payload.gps_accuracy ?? null,
      village: payload.village ?? "",
      ward: payload.ward ?? "",
      district: payload.district ?? "",
      state: payload.state ?? "",
      status: "pending",
      severity: "medium",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Fetch user profile from the profiles table.
 */
export async function fetchProfile(userId: string): Promise<Profile | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) return null;
  return data as Profile;
}
