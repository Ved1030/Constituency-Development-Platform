/**
 * Complaint types for the AI Geo-Verified Complaint Engine.
 */

// ─── GPS Location ─────────────────────────────────────────────────────
export interface GPSLocation {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  altitude: number | null;
  speed: number | null;
  heading: number | null;
  timestamp: string | null;
}

// ─── Geo Address ──────────────────────────────────────────────────────
export interface GeoAddress {
  village: string | null;
  ward: string | null;
  taluka: string | null;
  district: string | null;
  state: string | null;
  pincode: string | null;
  assembly_constituency: string | null;
  lok_sabha_constituency: string | null;
  nearest_landmark: string | null;
  confidence: number | null;
  raw_display: string | null;
}

// ─── Evidence Score ───────────────────────────────────────────────────
export interface EvidenceScore {
  total: number;
  gps_present: boolean;
  photo_present: boolean;
  voice_present: boolean;
  image_metadata_valid: boolean;
  multiple_reports_nearby: boolean;
  duplicate_radius_match: boolean;
  location_accuracy_score: number;
  timestamp_valid: boolean;
  ai_confidence_score: number;
  breakdown: Record<string, number>;
}

// ─── Evidence Upload ──────────────────────────────────────────────────
export interface EvidenceUpload {
  image_urls: string[];
  voice_url: string | null;
  video_url: string | null;
  text_description: string | null;
}

// ─── Duplicate Check ──────────────────────────────────────────────────
export interface DuplicateCheckResult {
  is_duplicate: boolean;
  cluster_id: string | null;
  cluster_uid: string | null;
  existing_report_count: number;
  nearest_distance_meters: number | null;
  merged_into_cluster: boolean;
}

// ─── Issue Cluster ────────────────────────────────────────────────────
export interface IssueClusterInfo {
  id: string;
  cluster_uid: string;
  report_count: number;
  category: string;
  department: string | null;
  centroid_lat: number;
  centroid_lng: number;
  radius_meters: number;
  severity: string;
  village: string | null;
  ward: string | null;
}

// ─── AI Preview ───────────────────────────────────────────────────────
export interface AIPreview {
  detected_department: string | null;
  detected_sector: string | null;
  detected_category: string | null;
  detected_location: GeoAddress | null;
  gps_accuracy: number | null;
  evidence_score: EvidenceScore | null;
  duplicate_probability: number;
  priority_prediction: number;
  estimated_resolution_days: number | null;
  ai_confidence: number;
  similar_complaints_nearby: number;
}

// ─── Complaint ────────────────────────────────────────────────────────
export interface Complaint {
  id: string;
  complaint_uid: string;
  title: string;
  description: string | null;
  category: string;
  sector: string | null;
  department: string | null;
  severity: string;
  status: string;

  // GPS
  gps_latitude: number | null;
  gps_longitude: number | null;
  gps_accuracy: number | null;
  gps_altitude: number | null;
  gps_speed: number | null;
  gps_heading: number | null;

  // Address
  village: string | null;
  ward: string | null;
  taluka: string | null;
  district: string | null;
  state: string | null;
  pincode: string | null;
  assembly_constituency: string | null;
  lok_sabha_constituency: string | null;
  nearest_landmark: string | null;

  // Verification
  verification_status: string;
  verification_confidence: number;
  evidence_score: number;

  // Duplicate
  duplicate_probability: number;
  cluster_id: string | null;
  cluster_uid: string | null;
  duplicate_count: number;

  // AI
  ai_detected_category: string | null;
  ai_detected_department: string | null;
  ai_detected_sector: string | null;
  ai_confidence: number;
  priority_prediction: number;
  estimated_resolution_days: number | null;

  // Evidence
  images: string[] | null;
  voice_url: string | null;

  // Citizen
  citizen_id: string | null;
  citizen_name: string | null;

  // Heatmap
  heatmap_key: string | null;

  // Timestamps
  created_at: string;
  updated_at: string;
}

// ─── API Response Types ───────────────────────────────────────────────
export interface ComplaintSubmitResponse {
  success: boolean;
  complaint: Complaint;
  ai_preview: AIPreview | null;
  duplicate_info: DuplicateCheckResult | null;
  cluster_info: IssueClusterInfo | null;
  message: string;
}

export interface ComplaintListResponse {
  complaints: Complaint[];
  total: number;
  page: number;
  page_size: number;
}

export interface ComplaintStatsResponse {
  total_complaints: number;
  verified_complaints: number;
  pending_complaints: number;
  resolved_complaints: number;
  avg_evidence_score: number;
  total_clusters: number;
}

// ─── Request Types ────────────────────────────────────────────────────
export interface ComplaintCreateRequest {
  title: string;
  description: string | null;
  category: string;
  sector: string | null;
  gps: GPSLocation | null;
  address: GeoAddress | null;
  evidence: EvidenceUpload | null;
  citizen_id: string | null;
  citizen_name: string | null;
  manual_ward: string | null;
  manual_village: string | null;
  // Multilingual fields
  original_language?: string;
  original_text?: string;
  english_translation?: string;
  final_edited_text?: string;
}

// ─── GPS Permission State ─────────────────────────────────────────────
export type GPSPermissionState = "prompt" | "granted" | "denied" | "unavailable";

// ─── Complaint Category (extended) ────────────────────────────────────
export type ComplaintCategory =
  | "road"
  | "water"
  | "electricity"
  | "healthcare"
  | "education"
  | "sanitation"
  | "other";
