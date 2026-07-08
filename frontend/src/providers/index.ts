import type {
  DigitalTwinComplaint,
  MediaItem,
  SocialPost,
  AIAnalysis,
  TimelineEvent,
  AnalyticsData,
} from "@/types/digital-twin";
import { fetchDigitalTwin } from "@/services/api/digital-twin";
import { fetchComplaints } from "@/services/api/complaints";

let cachedComplaints: DigitalTwinComplaint[] = [];
let lastFetch = 0;
const CACHE_TTL = 5000;

async function ensureCache(): Promise<DigitalTwinComplaint[]> {
  const now = Date.now();
  if (cachedComplaints.length === 0 || now - lastFetch > CACHE_TTL) {
    try {
      const data = await fetchDigitalTwin();
      cachedComplaints = (data.markers || []).map((m: any) => ({
        id: m.id,
        title: m.title,
        description: "",
        latitude: m.latitude,
        longitude: m.longitude,
        priority: m.priority || "Medium",
        department: m.department || "Unknown",
        status: m.status || "Open",
        communityVotes: 0,
        affectedPopulation: 0,
        reportedAt: m.reportedAt || new Date().toISOString(),
        assignedOfficer: "",
        estimatedBudget: 0,
        expectedResolution: "",
        aiSummary: "",
        aiRecommendation: "",
        aiConfidence: m.aiConfidence || 0,
        photos: [],
        voiceNote: null,
        ward: m.ward || "",
        village: m.village || "",
        citizen: m.citizenName || "Anonymous",
        rootCause: "",
      }));
      lastFetch = now;
    } catch {
      if (cachedComplaints.length === 0) {
        cachedComplaints = [];
      }
    }
  }
  return cachedComplaints;
}

export interface ComplaintProvider {
  getComplaints(): DigitalTwinComplaint[];
  getComplaintById(id: string): DigitalTwinComplaint | undefined;
}

export class ApiComplaintProvider implements ComplaintProvider {
  getComplaints(): DigitalTwinComplaint[] {
    ensureCache();
    return cachedComplaints;
  }

  getComplaintById(id: string): DigitalTwinComplaint | undefined {
    return cachedComplaints.find((c) => c.id === id);
  }
}

export interface MediaProvider {
  getMediaForComplaint(complaintId: string): MediaItem[];
}

export class ApiMediaProvider implements MediaProvider {
  getMediaForComplaint(complaintId: string): MediaItem[] {
    return [];
  }
}

export interface SocialProvider {
  getPostsForComplaint(complaintId: string): SocialPost[];
}

export class ApiSocialProvider implements SocialProvider {
  getPostsForComplaint(complaintId: string): SocialPost[] {
    return [];
  }
}

export interface AIProvider {
  getAnalysisForComplaint(complaint: DigitalTwinComplaint): AIAnalysis;
}

export class ApiAIProvider implements AIProvider {
  getAnalysisForComplaint(complaint: DigitalTwinComplaint): AIAnalysis {
    const severityMap: Record<string, "critical" | "severe" | "moderate" | "minor"> = {
      Critical: "critical", High: "severe", Medium: "moderate", Low: "minor",
    };
    return {
      rootCause: complaint.rootCause || "Unknown",
      severity: severityMap[complaint.priority] ?? "moderate",
      confidence: complaint.aiConfidence,
      predictedSpread: "Analysis pending",
      estimatedCost: complaint.estimatedBudget,
      affectedCitizens: complaint.affectedPopulation,
      recommendedDepartment: complaint.department,
      riskTrend: "stable",
      expectedEscalation: "",
      summary: complaint.aiSummary || "",
      recommendation: complaint.aiRecommendation || "",
    };
  }
}

export interface TimelineProvider {
  getTimelineForComplaint(complaint: DigitalTwinComplaint): TimelineEvent[];
}

export class ApiTimelineProvider implements TimelineProvider {
  getTimelineForComplaint(complaint: DigitalTwinComplaint): TimelineEvent[] {
    return [];
  }
}

export interface AnalyticsProvider {
  getAnalyticsForComplaint(complaint: DigitalTwinComplaint): AnalyticsData;
}

export class ApiAnalyticsProvider implements AnalyticsProvider {
  getAnalyticsForComplaint(complaint: DigitalTwinComplaint): AnalyticsData {
    return {
      complaintGrowth: [],
      votes: [],
      sentiment: [],
      departmentResponse: [],
      budget: [],
      aiConfidence: [],
    };
  }
}

export const complaintProvider = new ApiComplaintProvider();
export const mediaProvider = new ApiMediaProvider();
export const socialProvider = new ApiSocialProvider();
export const aiProvider = new ApiAIProvider();
export const timelineProvider = new ApiTimelineProvider();
export const analyticsProvider = new ApiAnalyticsProvider();
