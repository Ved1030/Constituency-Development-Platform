export const mpUser = {
  id: "MP-001",
  name: "Dr. Rajesh Kumar Sharma",
  email: "rajesh.sharma@parliament.gov.in",
  phone: "+91 98765 43210",
  avatar: "",
  constituency: "North Chennai",
  state: "Tamil Nadu",
  party: "Indian National Congress",
  since: "2024-05-20",
  populationCovered: 1842500,
  totalVillages: 142,
  totalWards: 72,
  totalGramPanchayats: 58,
  urbanRuralSplit: { urban: 62, rural: 38 },
  assemblySegment: "Thiruvottiyur",
  lokShabha: "Chennai North",
  mpladsFund: 50000000,
  currentBudget: 377000000,
  aiHealthScore: 87,
  totalBeneficiaries: 1247800,
};

export interface ConstituencyKPI {
  label: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: string;
  color: string;
}

export const constituencyKPIs: ConstituencyKPI[] = [
  { label: "Total Complaints", value: 3847, change: 12.5, changeLabel: "vs last month", icon: "ClipboardList", color: "primary" },
  { label: "Critical Issues", value: 156, change: -8.2, changeLabel: "vs last month", icon: "AlertTriangle", color: "danger" },
  { label: "Budget Remaining", value: "₹24.8 Cr", change: -5.1, changeLabel: "of total allocation", icon: "IndianRupee", color: "success" },
  { label: "Projects Running", value: 47, change: 3, changeLabel: "new this quarter", icon: "FolderKanban", color: "accent" },
  { label: "Population Covered", value: "18.4L", change: 2.3, changeLabel: "active citizens", icon: "Users", color: "secondary" },
  { label: "AI Score", value: "87/100", change: 4.2, changeLabel: "performance index", icon: "Brain", color: "chart-3" },
];

// Executive Overview KPIs
export const executiveOverview = {
  mpName: "Dr. Rajesh Kumar Sharma",
  constituency: "North Chennai",
  state: "Tamil Nadu",
  population: 1842500,
  villages: 142,
  wards: 72,
  gramPanchayats: 58,
  urbanRuralSplit: { urban: 62, rural: 38 },
  currentBudget: "₹37.7 Cr",
  aiHealthScore: 87,
  assemblySegment: "Thiruvottiyur",
  lokShabha: "Chennai North",
  mpladsFund: "₹5 Cr",
};

// Department Performance Cards
export const departmentPerformance = [
  {
    name: "Roads",
    icon: "🚧",
    complaints: 892,
    projects: 12,
    budget: "₹8.2 Cr",
    budgetUtilization: 79,
    performance: 78,
    aiRisk: "medium" as const,
    trend: -3.2,
  },
  {
    name: "Water Supply",
    icon: "💧",
    complaints: 645,
    projects: 8,
    budget: "₹5.6 Cr",
    budgetUtilization: 75,
    performance: 72,
    aiRisk: "high" as const,
    trend: -5.1,
  },
  {
    name: "Healthcare",
    icon: "🏥",
    complaints: 412,
    projects: 6,
    budget: "₹4.5 Cr",
    budgetUtilization: 84,
    performance: 81,
    aiRisk: "low" as const,
    trend: 2.4,
  },
  {
    name: "Education",
    icon: "🏫",
    complaints: 334,
    projects: 9,
    budget: "₹3.8 Cr",
    budgetUtilization: 82,
    performance: 83,
    aiRisk: "low" as const,
    trend: 1.8,
  },
  {
    name: "Agriculture",
    icon: "🌾",
    complaints: 189,
    projects: 4,
    budget: "₹2.8 Cr",
    budgetUtilization: 68,
    performance: 71,
    aiRisk: "medium" as const,
    trend: -1.5,
  },
  {
    name: "Electricity",
    icon: "⚡",
    complaints: 523,
    projects: 7,
    budget: "₹3.4 Cr",
    budgetUtilization: 82,
    performance: 85,
    aiRisk: "low" as const,
    trend: 4.2,
  },
  {
    name: "Sanitation",
    icon: "🗑",
    complaints: 478,
    projects: 5,
    budget: "₹4.2 Cr",
    budgetUtilization: 83,
    performance: 69,
    aiRisk: "high" as const,
    trend: -7.3,
  },
  {
    name: "Public Transport",
    icon: "🚌",
    complaints: 234,
    projects: 3,
    budget: "₹2.1 Cr",
    budgetUtilization: 71,
    performance: 76,
    aiRisk: "low" as const,
    trend: 0.8,
  },
  {
    name: "Women & Child",
    icon: "👩‍👧",
    complaints: 156,
    projects: 5,
    budget: "₹1.9 Cr",
    budgetUtilization: 88,
    performance: 82,
    aiRisk: "low" as const,
    trend: 5.6,
  },
  {
    name: "Environment",
    icon: "🌳",
    complaints: 112,
    projects: 3,
    budget: "₹1.2 Cr",
    budgetUtilization: 62,
    performance: 74,
    aiRisk: "medium" as const,
    trend: -2.1,
  },
];

export interface VillageData {
  id: string;
  name: string;
  population: number;
  complaints: number;
  resolved: number;
  budgetAllocated: number;
  budgetSpent: number;
  satisfaction: number;
  projects: number;
  lat: number;
  lng: number;
}

export const villages: VillageData[] = [
  { id: "V001", name: "Gandhi Nagar", population: 12500, complaints: 342, resolved: 289, budgetAllocated: 4500000, budgetSpent: 3200000, satisfaction: 82, projects: 5, lat: 13.0827, lng: 80.2707 },
  { id: "V002", name: "Krishna Nagar", population: 8900, complaints: 278, resolved: 210, budgetAllocated: 3200000, budgetSpent: 2100000, satisfaction: 71, projects: 4, lat: 13.086, lng: 80.268 },
  { id: "V003", name: "Ramesh Nagar", population: 11200, complaints: 198, resolved: 167, budgetAllocated: 3800000, budgetSpent: 2900000, satisfaction: 79, projects: 3, lat: 13.078, lng: 80.271 },
  { id: "V004", name: "Ward 5 Central", population: 15600, complaints: 421, resolved: 356, budgetAllocated: 5200000, budgetSpent: 4100000, satisfaction: 85, projects: 7, lat: 13.079, lng: 80.275 },
  { id: "V005", name: "Marina Ward", population: 9800, complaints: 156, resolved: 134, budgetAllocated: 2900000, budgetSpent: 2200000, satisfaction: 88, projects: 3, lat: 13.085, lng: 80.273 },
  { id: "V006", name: "T Nagar", population: 18200, complaints: 512, resolved: 445, budgetAllocated: 6100000, budgetSpent: 5200000, satisfaction: 91, projects: 8, lat: 13.081, lng: 80.269 },
  { id: "V007", name: "Adyar East", population: 14300, complaints: 267, resolved: 223, budgetAllocated: 4100000, budgetSpent: 3400000, satisfaction: 77, projects: 5, lat: 13.084, lng: 80.272 },
  { id: "V008", name: "Velachery", population: 21500, complaints: 634, resolved: 512, budgetAllocated: 7200000, budgetSpent: 5800000, satisfaction: 73, projects: 9, lat: 13.080, lng: 80.274 },
  { id: "V009", name: "Taramani", population: 7600, complaints: 145, resolved: 123, budgetAllocated: 2400000, budgetSpent: 1800000, satisfaction: 84, projects: 2, lat: 13.083, lng: 80.270 },
  { id: "V010", name: "Sholinganallur", population: 16800, complaints: 489, resolved: 398, budgetAllocated: 5500000, budgetSpent: 4300000, satisfaction: 76, projects: 6, lat: 13.087, lng: 80.276 },
];

export interface DepartmentData {
  name: string;
  complaints: number;
  resolved: number;
  avgDays: number;
  budget: number;
  spent: number;
  satisfaction: number;
}

export const departments: DepartmentData[] = [
  { name: "Roads & Infrastructure", complaints: 892, resolved: 734, avgDays: 12, budget: 82000000, spent: 65000000, satisfaction: 78 },
  { name: "Water Supply", complaints: 645, resolved: 523, avgDays: 8, budget: 56000000, spent: 42000000, satisfaction: 72 },
  { name: "Electricity", complaints: 523, resolved: 467, avgDays: 5, budget: 34000000, spent: 28000000, satisfaction: 85 },
  { name: "Healthcare", complaints: 412, resolved: 356, avgDays: 15, budget: 45000000, spent: 38000000, satisfaction: 81 },
  { name: "Education", complaints: 334, resolved: 298, avgDays: 18, budget: 38000000, spent: 31000000, satisfaction: 83 },
  { name: "Sanitation", complaints: 478, resolved: 389, avgDays: 7, budget: 42000000, spent: 35000000, satisfaction: 69 },
  { name: "Public Safety", complaints: 267, resolved: 234, avgDays: 4, budget: 28000000, spent: 22000000, satisfaction: 88 },
  { name: "Housing", complaints: 198, resolved: 167, avgDays: 25, budget: 52000000, spent: 41000000, satisfaction: 74 },
];

export interface PriorityProject {
  id: string;
  name: string;
  category: string;
  village: string;
  budget: number;
  spent: number;
  progress: number;
  status: "on-track" | "delayed" | "completed" | "at-risk";
  priority: number;
  startDate: string;
  endDate: string;
}

export const priorityProjects: PriorityProject[] = [
  { id: "PRJ-001", name: "Gandhi Nagar Drainage Overhaul", category: "Sanitation", village: "Gandhi Nagar", budget: 4500000, spent: 3200000, progress: 71, status: "on-track", priority: 1, startDate: "2024-08-15", endDate: "2025-06-30" },
  { id: "PRJ-002", name: "School Road Reconstruction", category: "Roads", village: "Ward 5 Central", budget: 3200000, spent: 1800000, progress: 56, status: "delayed", priority: 2, startDate: "2024-09-01", endDate: "2025-04-30" },
  { id: "PRJ-003", name: "Solar Street Light Installation", category: "Electricity", village: "Multiple", budget: 2800000, spent: 2100000, progress: 75, status: "on-track", priority: 3, startDate: "2024-10-15", endDate: "2025-03-31" },
  { id: "PRJ-004", name: "PHC Medicine Stock Replenishment", category: "Healthcare", village: "Multiple", budget: 1200000, spent: 1200000, progress: 100, status: "completed", priority: 4, startDate: "2024-11-01", endDate: "2025-01-15" },
  { id: "PRJ-005", name: "Krishna Nagar Sewage Line", category: "Sanitation", village: "Krishna Nagar", budget: 5800000, spent: 2900000, progress: 50, status: "at-risk", priority: 5, startDate: "2024-07-01", endDate: "2025-08-31" },
  { id: "PRJ-006", name: "Anganwadi Renovation Phase 2", category: "Education", village: "Ramesh Nagar", budget: 1800000, spent: 900000, progress: 50, status: "on-track", priority: 6, startDate: "2024-12-01", endDate: "2025-05-31" },
  { id: "PRJ-007", name: "Velachery Water Tank Upgrade", category: "Water", village: "Velachery", budget: 3500000, spent: 1200000, progress: 34, status: "delayed", priority: 7, startDate: "2024-11-15", endDate: "2025-07-31" },
  { id: "PRJ-008", name: "T Nagar Park Development", category: "Infrastructure", village: "T Nagar", budget: 2200000, spent: 1800000, progress: 82, status: "on-track", priority: 8, startDate: "2024-09-01", endDate: "2025-04-15" },
  { id: "PRJ-009", name: "Adyar Bridge Repair", category: "Roads", village: "Adyar East", budget: 6200000, spent: 4800000, progress: 77, status: "on-track", priority: 9, startDate: "2024-06-01", endDate: "2025-03-31" },
  { id: "PRJ-010", name: "Sholinganallur Park Revival", category: "Infrastructure", village: "Sholinganallur", budget: 1500000, spent: 600000, progress: 40, status: "at-risk", priority: 10, startDate: "2024-12-15", endDate: "2025-06-30" },
];

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  type: "recommendation" | "alert" | "opportunity" | "prediction";
  priority: "high" | "medium" | "low";
  impact: string;
  category: string;
}

export const aiInsights: AIInsight[] = [
  { id: "AI-001", title: "Water Supply Crisis Predicted", description: "Based on current consumption patterns and infrastructure age, Velachery and Sholinganallur face a 78% probability of water supply failure in the next 3 months. Recommend immediate pipeline audit.", type: "prediction", priority: "high", impact: "Affects 38,300 residents", category: "Water" },
  { id: "AI-002", title: "Road Repair Budget Optimization", description: "Consolidating small road repairs into batched contracts could save ₹2.3 Cr annually. The model suggests 3 consolidation zones based on geographic clustering.", type: "recommendation", priority: "high", impact: "Save ₹2.3 Cr/year", category: "Budget" },
  { id: "AI-003", title: "Healthcare Access Gap Detected", description: "Wards 5 and 7 have healthcare access scores below 40. Recommend deploying mobile health units to 6 identified underserved zones.", type: "alert", priority: "high", impact: "15,200 underserved citizens", category: "Healthcare" },
  { id: "AI-004", title: "Citizen Engagement Rising", description: "Complaint volume from Velachery increased 34% this quarter. This correlates with the new mobile app adoption. Consider expanding digital services.", type: "opportunity", priority: "medium", impact: "34% engagement increase", category: "Engagement" },
  { id: "AI-005", title: "School Infrastructure Priority", description: "5 schools in the constituency have structural assessments below safety thresholds. Recommend prioritizing these over cosmetic upgrades.", type: "recommendation", priority: "medium", impact: "12,400 students affected", category: "Education" },
  { id: "AI-006", title: "Sanitation Complaint Clustering", description: "87% of sanitation complaints originate from 3 wards. Root cause analysis points to outdated sewage infrastructure in these areas.", type: "alert", priority: "high", impact: "87% complaint concentration", category: "Sanitation" },
];

// Top AI Insights for Dashboard Section 4
export const topAIInsights = [
  {
    id: "TAI-001",
    title: "Water shortage predicted in Ward 12",
    description: "AI models indicate a 78% probability of water supply disruption in Velachery and surrounding wards within the next 90 days based on consumption patterns, infrastructure age, and seasonal demand forecasting.",
    severity: "critical" as const,
    category: "Water Supply",
    affectedPopulation: 38300,
    confidence: 92,
    timeframe: "Next 3 months",
    recommendation: "Initiate emergency pipeline audit and allocate ₹1.2 Cr for preventive maintenance",
    sources: ["Groundwater Level Data", "Pipe Age Database", "Consumption Patterns", "Seasonal Forecasting Model"],
  },
  {
    id: "TAI-002",
    title: "Healthcare demand increasing by 18%",
    description: "OPD registrations across 12 PHCs have risen 18% quarter-over-quarter. Two underserved wards in Sholinganallur zone show critical access gaps. Mobile health unit deployment recommended.",
    severity: "warning" as const,
    category: "Healthcare",
    affectedPopulation: 45200,
    confidence: 88,
    timeframe: "Current quarter",
    recommendation: "Deploy 2 mobile health units and increase PHC staffing by 15%",
    sources: ["PHC Registration Data", "Ward Population Maps", "Health Access Index", "OPD Trend Analysis"],
  },
  {
    id: "TAI-003",
    title: "Road budget overspent by 12%",
    description: "Roads & Infrastructure department has utilized 79% of annual budget with Q4 still remaining. Without reallocation, critical repairs in Gandhi Nagar and Ward 5 Central will face funding gaps.",
    severity: "critical" as const,
    category: "Budget",
    affectedPopulation: 0,
    confidence: 95,
    timeframe: "Immediate",
    recommendation: "Reallocate ₹2.3 Cr from underutilized departments and implement batch contracting",
    sources: ["Budget Ledger", "Department Utilization Rates", "Contractor Payment Records", "Q4 Forecasting Model"],
  },
  {
    id: "TAI-004",
    title: "Hospital will benefit 32,000 citizens",
    description: "Proposed 50-bed PHC in Sholinganallur will serve the largest underserved healthcare zone. Current nearest hospital is 8.4 km away — new facility reduces average travel time by 42 minutes.",
    severity: "info" as const,
    category: "Healthcare",
    affectedPopulation: 32000,
    confidence: 91,
    timeframe: "18 months construction",
    recommendation: "Fast-track land acquisition and begin DPR preparation for Sholinganallur PHC",
    sources: ["Population Density Map", "Healthcare Access Analysis", "Travel Time Modeling", "Demographic Projections"],
  },
  {
    id: "TAI-005",
    title: "School upgrade has higher ROI than new road",
    description: "AI cost-benefit analysis shows upgrading 5 existing schools (₹4.2 Cr) generates 2.3x more social impact per rupee spent compared to the proposed new road in Ward 8 (₹3.8 Cr). Beneficiary count: 12,400 vs 8,200.",
    severity: "info" as const,
    category: "Education",
    affectedPopulation: 12400,
    confidence: 86,
    timeframe: "Next budget cycle",
    recommendation: "Prioritize school infrastructure upgrades in MPLADS fund allocation",
    sources: ["Education Impact Model", "Budget ROI Calculator", "Beneficiary Analysis", "Infrastructure Assessment"],
  },
];

export interface BudgetAllocation {
  department: string;
  allocated: number;
  spent: number;
  quarter: string;
}

export const budgetAllocations: BudgetAllocation[] = [
  { department: "Roads & Infrastructure", allocated: 82000000, spent: 65000000, quarter: "Q4 2024" },
  { department: "Water Supply", allocated: 56000000, spent: 42000000, quarter: "Q4 2024" },
  { department: "Electricity", allocated: 34000000, spent: 28000000, quarter: "Q4 2024" },
  { department: "Healthcare", allocated: 45000000, spent: 38000000, quarter: "Q4 2024" },
  { department: "Education", allocated: 38000000, spent: 31000000, quarter: "Q4 2024" },
  { department: "Sanitation", allocated: 42000000, spent: 35000000, quarter: "Q4 2024" },
  { department: "Public Safety", allocated: 28000000, spent: 22000000, quarter: "Q4 2024" },
  { department: "Housing", allocated: 52000000, spent: 41000000, quarter: "Q4 2024" },
];

export const complaintTrends = [
  { month: "Aug", total: 312, resolved: 245, critical: 18 },
  { month: "Sep", total: 289, resolved: 234, critical: 15 },
  { month: "Oct", total: 356, resolved: 298, critical: 22 },
  { month: "Nov", total: 401, resolved: 334, critical: 28 },
  { month: "Dec", total: 378, resolved: 312, critical: 24 },
  { month: "Jan", total: 423, resolved: 367, critical: 31 },
];

export interface MPNotification {
  id: string;
  title: string;
  message: string;
  type: "urgent" | "info" | "achievement" | "system" | "ai";
  read: boolean;
  createdAt: string;
}

export const mpNotifications: MPNotification[] = [
  { id: "MN-001", title: "Critical: Water Pipeline Burst", message: "Major water pipeline burst reported in Velachery affecting 5,000+ residents. Immediate action required.", type: "urgent", read: false, createdAt: "2025-01-14T08:30:00" },
  { id: "MN-002", title: "AI Alert: Budget Overspend Risk", message: "Roads department is at 79% budget utilization with 3 months remaining. Risk of overspend detected.", type: "ai", read: false, createdAt: "2025-01-14T07:15:00" },
  { id: "MN-003", title: "Project Milestone Achieved", message: "PHC Medicine Stock Replenishment project completed 100%. All 12 health centers restocked.", type: "achievement", read: false, createdAt: "2025-01-13T16:00:00" },
  { id: "MN-004", title: "New Complaint Cluster", message: "47 complaints received from Sholinganallur in the last 48 hours. AI suggests infrastructure review.", type: "ai", read: true, createdAt: "2025-01-13T10:30:00" },
  { id: "MN-005", title: "Budget Report Ready", message: "Q4 2024 budget utilization report is ready for review. Overall utilization: 81.2%.", type: "info", read: true, createdAt: "2025-01-12T14:00:00" },
  { id: "MN-006", title: "Citizen Satisfaction Update", message: "Overall constituency satisfaction score improved to 79.2% from 74.8% last quarter.", type: "achievement", read: true, createdAt: "2025-01-11T09:00:00" },
  { id: "MN-007", title: "System Maintenance", message: "Scheduled maintenance window: Jan 18, 2:00 AM - 4:00 AM IST.", type: "system", read: true, createdAt: "2025-01-10T11:00:00" },
];

export interface ActivityItem {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  type: "complaint" | "project" | "budget" | "ai" | "citizen";
}

export const recentActivity: ActivityItem[] = [
  { id: "ACT-001", action: "Critical complaint escalated", description: "Water pipeline burst in Velachery escalated to Emergency Response Team", timestamp: "2 hours ago", type: "complaint" },
  { id: "ACT-002", action: "AI recommendation accepted", description: "Road repair batch optimization plan approved for implementation", timestamp: "4 hours ago", type: "ai" },
  { id: "ACT-003", action: "Project milestone reached", description: "PHC Medicine Stock Replenishment completed ahead of schedule", timestamp: "6 hours ago", type: "project" },
  { id: "ACT-004", action: "Budget allocation updated", description: "₹1.2 Cr emergency fund released for Velachery water crisis", timestamp: "8 hours ago", type: "budget" },
  { id: "ACT-005", action: "Citizen feedback received", description: "234 new complaints registered from Sholinganallur area", timestamp: "12 hours ago", type: "citizen" },
  { id: "ACT-006", action: "Project status updated", description: "School Road Reconstruction progress updated to 56% — delayed by 2 weeks", timestamp: "1 day ago", type: "project" },
  { id: "ACT-007", action: "AI insight generated", description: "Healthcare access gap detected in Wards 5 and 7", timestamp: "1 day ago", type: "ai" },
  { id: "ACT-008", action: "Complaint resolved", description: "47 street light complaints resolved in T Nagar ward", timestamp: "2 days ago", type: "complaint" },
];

// Sector-wise spending data
export const sectorSpending = [
  { sector: "Roads", allocated: 82000000, spent: 65000000, color: "#0d47a1" },
  { sector: "Health", allocated: 45000000, spent: 38000000, color: "#dc2626" },
  { sector: "Education", allocated: 38000000, spent: 31000000, color: "#f59e0b" },
  { sector: "Agriculture", allocated: 28000000, spent: 19000000, color: "#16a34a" },
  { sector: "Water", allocated: 56000000, spent: 42000000, color: "#0ea5e9" },
  { sector: "Electricity", allocated: 34000000, spent: 28000000, color: "#8b5cf6" },
];

// Complaint hotspots data
export const complaintHotspots = [
  { rank: 1, name: "Velachery", complaints: 634, resolved: 512, density: "Very High", trend: "+12%" },
  { rank: 2, name: "T Nagar", complaints: 512, resolved: 445, density: "High", trend: "+8%" },
  { rank: 3, name: "Sholinganallur", complaints: 489, resolved: 398, density: "High", trend: "+15%" },
  { rank: 4, name: "Ward 5 Central", complaints: 421, resolved: 356, density: "High", trend: "+5%" },
  { rank: 5, name: "Gandhi Nagar", complaints: 342, resolved: 289, density: "Medium", trend: "-3%" },
  { rank: 6, name: "Krishna Nagar", complaints: 278, resolved: 210, density: "Medium", trend: "+2%" },
  { rank: 7, name: "Adyar East", complaints: 267, resolved: 223, density: "Medium", trend: "+1%" },
  { rank: 8, name: "Ramesh Nagar", complaints: 198, resolved: 167, density: "Low", trend: "-5%" },
  { rank: 9, name: "Marina Ward", complaints: 156, resolved: 134, density: "Low", trend: "-2%" },
  { rank: 10, name: "Taramani", complaints: 145, resolved: 123, density: "Low", trend: "+3%" },
];

// AI Alerts
export const aiAlerts = [
  {
    id: "ALT-001",
    type: "Budget Risk",
    title: "Roads department heading towards overspend",
    description: "Current trajectory shows 107% utilization by year-end. ₹2.3 Cr reallocation recommended.",
    severity: "critical" as const,
    department: "Roads & Infrastructure",
    deadline: "Immediate action required",
  },
  {
    id: "ALT-002",
    type: "Delay Prediction",
    title: "3 projects likely to miss deadline",
    description: "Krishna Nagar Sewage Line, School Road Reconstruction, and Sholinganallur Park show delay patterns.",
    severity: "warning" as const,
    department: "Multiple",
    deadline: "Within 60 days",
  },
  {
    id: "ALT-003",
    type: "Seasonal Flood Risk",
    title: "Northeast monsoon flood risk in low-lying wards",
    description: "Wards 5, 8, and 12 are in flood-prone zones. Pre-monsoon drainage clearing recommended.",
    severity: "warning" as const,
    department: "Sanitation",
    deadline: "Before October",
  },
  {
    id: "ALT-004",
    type: "Water Scarcity",
    title: "Groundwater levels dropping in southern wards",
    description: "3 borewells showing <15m water level. Tanker scheduling and pipeline extension needed.",
    severity: "critical" as const,
    department: "Water Supply",
    deadline: "Within 30 days",
  },
  {
    id: "ALT-005",
    type: "Hospital Capacity",
    title: "PHC Adyar nearing 95% bed occupancy",
    description: "Average wait time has increased to 3.2 hours. Overflow management plan needed.",
    severity: "warning" as const,
    department: "Healthcare",
    deadline: "Within 45 days",
  },
  {
    id: "ALT-006",
    type: "School Overcrowding",
    title: "3 schools exceeding 150% capacity",
    description: "Government Primary School Ward 5, Municipal School T Nagar, and AP School Velachery need expansion.",
    severity: "info" as const,
    department: "Education",
    deadline: "Next academic year",
  },
];

// Recent Development Projects for timeline
export const recentProjects = [
  {
    id: "RP-001",
    name: "Solar Street Light Installation",
    department: "Electricity",
    village: "Multiple Villages",
    budget: "₹28 Lakh",
    completion: 75,
    timeline: "Oct 2024 — Mar 2025",
    status: "on-track" as const,
  },
  {
    id: "RP-002",
    name: "Gandhi Nagar Drainage Overhaul",
    department: "Sanitation",
    village: "Gandhi Nagar",
    budget: "₹45 Lakh",
    completion: 71,
    timeline: "Aug 2024 — Jun 2025",
    status: "on-track" as const,
  },
  {
    id: "RP-003",
    name: "Adyar Bridge Repair",
    department: "Roads",
    village: "Adyar East",
    budget: "₹62 Lakh",
    completion: 77,
    timeline: "Jun 2024 — Mar 2025",
    status: "on-track" as const,
  },
  {
    id: "RP-004",
    name: "T Nagar Park Development",
    department: "Infrastructure",
    village: "T Nagar",
    budget: "₹22 Lakh",
    completion: 82,
    timeline: "Sep 2024 — Apr 2025",
    status: "on-track" as const,
  },
  {
    id: "RP-005",
    name: "Velachery Water Tank Upgrade",
    department: "Water Supply",
    village: "Velachery",
    budget: "₹35 Lakh",
    completion: 34,
    timeline: "Nov 2024 — Jul 2025",
    status: "delayed" as const,
  },
  {
    id: "RP-006",
    name: "Anganwadi Renovation Phase 2",
    department: "Education",
    village: "Ramesh Nagar",
    budget: "₹18 Lakh",
    completion: 50,
    timeline: "Dec 2024 — May 2025",
    status: "on-track" as const,
  },
];

// Impact Simulator data
export const impactProjects = [
  {
    id: "IMP-001",
    name: "Sholinganallur PHC (50-bed)",
    type: "Hospital",
    populationCovered: 32000,
    travelTimeReduction: 42,
    complaintReduction: 340,
    budgetUsed: 68000000,
    roi: 2.8,
    beneficiaries: 32000,
    status: "Proposed",
  },
  {
    id: "IMP-002",
    name: "Velachery Main Road widening",
    type: "Road",
    populationCovered: 45000,
    travelTimeReduction: 15,
    complaintReduction: 280,
    budgetUsed: 42000000,
    roi: 1.9,
    beneficiaries: 45000,
    status: "Approved",
  },
  {
    id: "IMP-003",
    name: "New Primary School Ward 8",
    type: "School",
    populationCovered: 8400,
    travelTimeReduction: 25,
    complaintReduction: 95,
    budgetUsed: 18000000,
    roi: 3.1,
    beneficiaries: 8400,
    status: "Proposed",
  },
  {
    id: "IMP-004",
    name: "Overhead Water Tank Krishna Nagar",
    type: "Water Tank",
    populationCovered: 22000,
    travelTimeReduction: 0,
    complaintReduction: 420,
    budgetUsed: 35000000,
    roi: 2.4,
    beneficiaries: 22000,
    status: "In Progress",
  },
];

// Need vs Spend data
export const needVsSpendData = {
  citizenDemand: [
    { category: "Water Supply", demand: 645, priority: "Critical", sentiment: 89 },
    { category: "Road Repair", demand: 892, priority: "High", sentiment: 82 },
    { category: "Street Lighting", demand: 423, priority: "Medium", sentiment: 75 },
    { category: "Drainage", demand: 378, priority: "High", sentiment: 85 },
    { category: "Healthcare Access", demand: 412, priority: "Critical", sentiment: 91 },
    { category: "School Infrastructure", demand: 334, priority: "Medium", sentiment: 78 },
  ],
  governmentSpending: [
    { category: "Water Supply", spent: 42000000, allocated: 56000000, utilization: 75 },
    { category: "Road Repair", spent: 65000000, allocated: 82000000, utilization: 79 },
    { category: "Street Lighting", spent: 18000000, allocated: 22000000, utilization: 82 },
    { category: "Drainage", spent: 35000000, allocated: 42000000, utilization: 83 },
    { category: "Healthcare", spent: 38000000, allocated: 45000000, utilization: 84 },
    { category: "Education", spent: 31000000, allocated: 38000000, utilization: 82 },
  ],
  gapAnalysis: [
    { category: "Water Supply", gap: "High", insight: "Spending is 75% but demand is Critical. Need ₹1.4 Cr additional allocation.", aiConfidence: 92 },
    { category: "Healthcare", gap: "Medium", insight: "Spending at 84% but access gaps remain in 3 wards. Reallocate from underspent departments.", aiConfidence: 88 },
    { category: "Road Repair", gap: "Low", insight: "Budget on track. Batch contracting could save ₹2.3 Cr.", aiConfidence: 95 },
    { category: "Education", gap: "Medium", insight: "School upgrades show 3.1x ROI vs new construction. Prioritize renovation.", aiConfidence: 86 },
    { category: "Drainage", gap: "High", insight: "Monsoon risk requires ₹80L emergency allocation before October.", aiConfidence: 90 },
    { category: "Street Lighting", gap: "Low", insight: "Solar installation project on track. 75% complete.", aiConfidence: 94 },
  ],
};

// Project Comparison data
export const projectComparisonData = [
  {
    name: "Sholinganallur PHC",
    type: "Hospital",
    budget: 68000000,
    beneficiaries: 32000,
    roi: 2.8,
    completionTime: 18,
    satisfactionImpact: 92,
    costPerBeneficiary: 2125,
    aiScore: 94,
  },
  {
    name: "Ward 8 Primary School",
    type: "School",
    budget: 18000000,
    beneficiaries: 8400,
    roi: 3.1,
    completionTime: 12,
    satisfactionImpact: 87,
    costPerBeneficiary: 2143,
    aiScore: 91,
  },
  {
    name: "Velachery Road Widening",
    type: "Road",
    budget: 42000000,
    beneficiaries: 45000,
    roi: 1.9,
    completionTime: 10,
    satisfactionImpact: 78,
    costPerBeneficiary: 933,
    aiScore: 82,
  },
  {
    name: "Krishna Nagar Water Tank",
    type: "Water Tank",
    budget: 35000000,
    beneficiaries: 22000,
    roi: 2.4,
    completionTime: 8,
    satisfactionImpact: 85,
    costPerBeneficiary: 1591,
    aiScore: 88,
  },
];

// Policy Recommendation mock data
export const policyRecommendations = [
  {
    id: "POL-001",
    title: "Emergency Water Infrastructure Upgrade for Southern Wards",
    department: "Water Supply",
    priority: "Critical",
    estimatedBudget: "₹4.2 Cr",
    timeline: "6 months",
    expectedImpact: "Restore water supply for 38,300 residents across Velachery and Sholinganallur",
    beneficiaries: 38300,
    status: "Draft",
    sections: [
      { heading: "Background", content: "Analysis of water supply infrastructure in southern wards reveals aging pipelines (avg. 23 years), declining groundwater levels, and increasing demand due to population growth of 4.2% annually." },
      { heading: "Proposed Action", content: "1. Replace 12.4 km of aging pipelines\n2. Install 3 new overhead water tanks\n3. Connect 2 borewells to municipal supply\n4. Deploy smart water monitoring sensors" },
      { heading: "Budget Breakdown", content: "Pipeline Replacement: ₹2.1 Cr\nOverhead Tanks: ₹1.4 Cr\nBorewell Connection: ₹45 Lakh\nSmart Sensors: ₹25 Lakh" },
      { heading: "Expected Outcomes", content: "78% reduction in water supply complaints\n42% improvement in water pressure\n₹3.2 Cr annual savings in emergency tanker costs" },
    ],
  },
];
