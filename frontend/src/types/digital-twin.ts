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
