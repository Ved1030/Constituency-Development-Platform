export type ComplaintPriority = "Critical" | "High" | "Medium" | "Low";
export type ComplaintStatus = "Open" | "In Progress" | "Resolved" | "Closed";

export interface DigitalTwinComplaint {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  priority: ComplaintPriority;
  department: string;
  status: ComplaintStatus;
  communityVotes: number;
  affectedPopulation: number;
  reportedAt: string;
  assignedOfficer: string;
  estimatedBudget: number;
  expectedResolution: string;
  aiSummary: string;
  aiRecommendation: string;
  aiConfidence: number;
  photos: string[];
  voiceNote: string | null;
  ward: string;
  village: string;
  citizen?: string;
  rootCause?: string;
}

export interface AIAnalysis {
  rootCause: string
  severity: "critical" | "severe" | "moderate" | "minor"
  confidence: number
  predictedSpread: string
  estimatedCost: number
  affectedCitizens: number
  recommendedDepartment: string
  riskTrend: string
  expectedEscalation: string
  summary: string
  recommendation: string
}

export interface FilterState {
  priorities: ComplaintPriority[];
  departments: string[];
  wards: string[];
  villages: string[];
  statuses: ComplaintStatus[];
  dateRange: { start: string; end: string } | null;
  aiConfidenceRange: [number, number];
  communityVotesMin: number;
}

export type OverlayLayer =
  | "roads"
  | "schools"
  | "hospitals"
  | "waterSupply"
  | "electricity"
  | "drainage"
  | "populationDensity"
  | "complaintDensity"
  | "projects";

export interface OverlayLayerConfig {
  id: OverlayLayer;
  name: string;
  color: string;
}

export interface SearchResult {
  id: string;
  label: string;
  type: "complaint" | "village" | "ward" | "school" | "hospital" | "project";
  latitude: number;
  longitude: number;
  zoom?: number;
}

export interface GeoJsonBoundary {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    properties: Record<string, unknown>;
    geometry: {
      type: "Polygon";
      coordinates: number[][][];
    };
  }>;
}

export const OVERLAY_LAYERS: OverlayLayerConfig[] = [
  { id: "roads", name: "Roads", color: "#3b82f6" },
  { id: "schools", name: "Schools", color: "#f59e0b" },
  { id: "hospitals", name: "Hospitals", color: "#10b981" },
  { id: "waterSupply", name: "Water Supply", color: "#06b6d4" },
  { id: "electricity", name: "Electricity", color: "#8b5cf6" },
  { id: "drainage", name: "Drainage", color: "#64748b" },
  { id: "populationDensity", name: "Population Density", color: "#ec4899" },
  { id: "complaintDensity", name: "Complaint Density", color: "#ef4444" },
  { id: "projects", name: "Projects", color: "#f97316" },
];

export const PRIORITY_COLORS: Record<ComplaintPriority, string> = {
  Critical: "#dc2626",
  High: "#f97316",
  Medium: "#eab308",
  Low: "#22c55e",
};

export const PRIORITY_SIZES: Record<ComplaintPriority, number> = {
  Critical: 18,
  High: 14,
  Medium: 11,
  Low: 9,
};

export const DEPARTMENTS = [
  "Roads & Infrastructure",
  "Water Supply",
  "Electricity",
  "Healthcare",
  "Education",
  "Sanitation",
  "Public Safety",
  "Housing",
];

// Constituency center for map fallback
export const CONSTITUENCY_CENTER = { lat: 13.128, lng: 80.288 } as const;
export const CONSTITUENCY_ZOOM = 12;

export type MediaSource = "citizen" | "officer" | "drone" | "satellite"

export type SocialPlatform = "twitter" | "facebook" | "instagram" | "youtube" | "googleNews" | "reddit"

export interface SocialPost {
  id: string
  platform: SocialPlatform
  displayName: string
  username: string
  verified: boolean
  timestamp: string
  content: string
  isVideo: boolean
  location: string
  coordinates?: { lat: number; lng: number }
  likes: number
  comments: number
  shares: number
}

export interface MediaItem {
  id: string
  url: string
  type: "photo" | "video"
  source: MediaSource
  caption: string
  verified: boolean
  aiQualityScore: number
  gps: { lat: number; lng: number }
  timestamp: string
  metadata?: Record<string, string>
}

export type TimelineStage =
  | "citizen_reported"
  | "votes_increased"
  | "ai_classified"
  | "officer_assigned"
  | "inspection"
  | "repair_started"
  | "in_progress"
  | "resolved"
  | "citizen_feedback"

export interface TimelineEvent {
  id: string
  stage: TimelineStage
  title: string
  label?: string
  description: string
  timestamp: string
  actor: string
  completed?: boolean
  metadata?: Record<string, string>
}

export interface AnalyticsData {
  complaintGrowth: { date: string; value: number }[]
  votes: { date: string; value: number }[]
  sentiment: { date: string; value: number }[]
  departmentResponse: { department: string; avgDays: number; resolved: number }[]
  budget: { category: string; allocated: number; spent: number }[]
  aiConfidence: { date: string; value: number }[]
}
