export { APIError, apiGet, apiPost, apiPut, apiDelete } from "./client";

export {
  fetchDashboard,
  fetchDashboardSummary,
} from "./dashboard";
export type {
  DashboardResponse,
  DashboardSummaryData,
  DepartmentPerfItem,
} from "./dashboard";

export {
  fetchComplaints,
  fetchComplaint,
  fetchComplaintStats,
  createComplaint,
} from "./complaints";
export type { ComplaintListParams } from "./complaints";

export {
  fetchDigitalTwin,
  fetchDigitalTwinComplaintDetail,
} from "./digital-twin";
export type {
  DigitalTwinResponse,
  MarkerItem,
  HeatmapPoint,
} from "./digital-twin";

export {
  fetchAnalytics,
  fetchAnalyticsTrends,
  fetchDepartmentAnalytics,
} from "./analytics";
export type {
  AnalyticsResponse,
  TrendPoint,
  DeptBreakdownItem,
} from "./analytics";

export {
  fetchPriorities,
} from "./priority";
export type {
  PriorityEngineResponse,
  PriorityItem,
} from "./priority";

export {
  fetchCopilotContext,
  sendCopilotQuery,
} from "./copilot";
export type {
  CopilotResponse,
  CopilotQueryResponse,
} from "./copilot";

export {
  fetchProjects,
  fetchProject,
} from "./projects";
export type {
  ProjectItem,
  ProjectListResponse,
} from "./projects";

export {
  fetchRecommendations,
} from "./recommendations";
export type {
  RecommendationItem,
  RecommendationListResponse,
} from "./recommendations";

export {
  fetchSocialIntelligence,
  fetchSocialFeed,
  fetchSocialPost,
  getMediaUrl,
} from "./social-intelligence";
