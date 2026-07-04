// ─── User ────────────────────────────────────────────────────────────
export const citizenUser = {
  id: "CIT-001",
  name: "Arun Kumar",
  email: "arun.kumar@email.com",
  phone: "+91 98765 43210",
  avatar: "",
  address: "42, Gandhi Nagar, Ward 7",
  constituency: "North Chennai",
  district: "Chennai",
  state: "Tamil Nadu",
  pincode: "600001",
  preferredLanguage: "Tamil",
  totalComplaints: 12,
  resolvedComplaints: 9,
  participationScore: 845,
  badges: [
    { id: "b1", label: "Early Adopter", icon: "Zap" },
    { id: "b2", label: "Problem Solver", icon: "CheckCircle" },
    { id: "b3", label: "Voice of the Month", icon: "Award" },
    { id: "b4", label: "Top Contributor", icon: "Star" },
  ],
};

// ─── Types ───────────────────────────────────────────────────────────
export type ComplaintStatus =
  | "pending"
  | "verified"
  | "in-progress"
  | "resolved"
  | "rejected";
export type ComplaintCategory =
  | "road"
  | "water"
  | "electricity"
  | "healthcare"
  | "education"
  | "sanitation"
  | "other";

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  severity: "low" | "medium" | "high" | "critical";
  location: string;
  lat: number;
  lng: number;
  createdAt: string;
  updatedAt: string;
  upvotes: number;
  comments: number;
  department?: string;
  officerAssigned?: string;
  expectedResolution?: string;
  tags: string[];
  progress: number;
  // Geo-verification fields
  evidence_score?: number;
  verification_status?: string;
  verification_confidence?: number;
  ward?: string;
  village?: string;
  cluster_uid?: string;
  duplicate_count?: number;
  gps_accuracy?: number;
  ai_confidence?: number;
}

export const complaints: Complaint[] = [
  {
    id: "CMP-2024-001",
    title: "Severe Waterlogging in Gandhi Nagar",
    description:
      "The main road in Gandhi Nagar has been waterlogged for over a week. Drainage system is completely blocked causing health hazards for residents especially children and elderly.",
    category: "water",
    status: "in-progress",
    severity: "critical",
    location: "Gandhi Nagar Main Road, Ward 7",
    lat: 13.0827,
    lng: 80.2707,
    createdAt: "2024-12-15",
    updatedAt: "2025-01-10",
    upvotes: 47,
    comments: 12,
    department: "Corporation Water Board",
    officerAssigned: "K. Selvam, Junior Engineer",
    expectedResolution: "2025-02-28",
    tags: ["drainage", "waterlogging", "health-hazard", "main-road"],
    progress: 65,
    evidence_score: 94,
    verification_status: "verified",
    verification_confidence: 0.92,
    ward: "7",
    village: "Gandhi Nagar",
    cluster_uid: "CLT-WAT-13082-80270-A1B2",
    duplicate_count: 3,
    gps_accuracy: 8,
    ai_confidence: 0.88,
  },
  {
    id: "CMP-2024-002",
    title: "Broken Street Lights on 3rd Cross",
    description:
      "Street lights on 3rd Cross Road have been non-functional for 3 weeks. The area becomes completely dark after sunset raising safety concerns for women and children.",
    category: "electricity",
    status: "verified",
    severity: "high",
    location: "3rd Cross Road, Ward 7",
    lat: 13.084,
    lng: 80.272,
    createdAt: "2025-01-05",
    updatedAt: "2025-01-12",
    upvotes: 34,
    comments: 8,
    department: "Electricity Board",
    officerAssigned: "",
    expectedResolution: "2025-02-15",
    tags: ["street-light", "safety", "darkness"],
    progress: 25,
  },
  {
    id: "CMP-2024-003",
    title: "Potholes on School Road",
    description:
      "Multiple deep potholes on the road leading to Government High School. Risk of accidents for school children and vehicles. Need immediate repair.",
    category: "road",
    status: "in-progress",
    severity: "high",
    location: "School Road, Ward 5",
    lat: 13.079,
    lng: 80.275,
    createdAt: "2024-12-28",
    updatedAt: "2025-01-08",
    upvotes: 56,
    comments: 15,
    department: "Corporation Roads Division",
    officerAssigned: "M. Rajan, Assistant Engineer",
    expectedResolution: "2025-02-10",
    tags: ["pothole", "accident-risk", "school", "road-safety"],
    progress: 45,
    evidence_score: 87,
    verification_status: "verified",
    verification_confidence: 0.85,
    ward: "5",
    village: "School Road",
    cluster_uid: "CLT-ROA-13079-80275-C3D4",
    duplicate_count: 5,
    gps_accuracy: 12,
    ai_confidence: 0.91,
  },
  {
    id: "CMP-2024-004",
    title: "Government Hospital Shortage of Medicines",
    description:
      "Ward 7 Government Primary Health Centre has been facing shortage of essential medicines for the past month. Patients are being turned away.",
    category: "healthcare",
    status: "resolved",
    severity: "critical",
    location: "PHC, Ward 7",
    lat: 13.081,
    lng: 80.269,
    createdAt: "2024-11-20",
    updatedAt: "2025-01-05",
    upvotes: 89,
    comments: 24,
    department: "Health Department",
    officerAssigned: "Dr. S. Priya, Chief Medical Officer",
    expectedResolution: "2025-01-15",
    tags: ["medicine", "hospital", "health", "shortage"],
    progress: 100,
  },
  {
    id: "CMP-2024-005",
    title: "Open Sewage in Krishna Nagar",
    description:
      "Open sewage line in Krishna Nagar Colony causing foul smell and breeding mosquitoes. Several cases of dengue reported in the area recently.",
    category: "sanitation",
    status: "pending",
    severity: "critical",
    location: "Krishna Nagar Colony, Ward 7",
    lat: 13.086,
    lng: 80.268,
    createdAt: "2025-01-14",
    updatedAt: "2025-01-14",
    upvotes: 23,
    comments: 5,
    department: "",
    officerAssigned: "",
    expectedResolution: "",
    tags: ["sewage", "dengue", "mosquito", "health-hazard"],
    progress: 0,
  },
  {
    id: "CMP-2024-006",
    title: "Anganwadi Center Needs Repair",
    description:
      "The Anganwadi center in Ward 7 has a leaking roof and broken furniture. Children are being forced to sit on the floor. Urgent renovation needed.",
    category: "education",
    status: "in-progress",
    severity: "medium",
    location: "Anganwadi Center, Ward 7",
    lat: 13.083,
    lng: 80.273,
    createdAt: "2024-12-10",
    updatedAt: "2025-01-02",
    upvotes: 31,
    comments: 9,
    department: "Education Department",
    officerAssigned: "R. Lakshmi, Block Coordinator",
    expectedResolution: "2025-03-01",
    tags: ["anganwadi", "children", "infrastructure", "repair"],
    progress: 40,
  },
  {
    id: "CMP-2024-007",
    title: "Irregular Water Supply in Ramesh Nagar",
    description:
      "Water supply in Ramesh Nagar area has been highly irregular for the past 2 months. Residents getting water only once in 3 days for 30 minutes.",
    category: "water",
    status: "verified",
    severity: "high",
    location: "Ramesh Nagar, Ward 7",
    lat: 13.078,
    lng: 80.271,
    createdAt: "2025-01-02",
    updatedAt: "2025-01-10",
    upvotes: 42,
    comments: 11,
    department: "Metro Water Board",
    officerAssigned: "",
    expectedResolution: "2025-02-20",
    tags: ["water-supply", "irregular", "drinking-water"],
    progress: 15,
  },
  {
    id: "CMP-2024-008",
    title: "Garbage Not Collected for 2 Weeks",
    description:
      "Solid waste has not been collected from Krishna Nagar and surrounding areas for 2 weeks. Garbage piles are accumulating on street corners.",
    category: "sanitation",
    status: "in-progress",
    severity: "high",
    location: "Krishna Nagar, Ward 7",
    lat: 13.085,
    lng: 80.27,
    createdAt: "2025-01-08",
    updatedAt: "2025-01-13",
    upvotes: 38,
    comments: 7,
    department: "Corporation Sanitation Wing",
    officerAssigned: "P. Kumar, Sanitary Officer",
    expectedResolution: "2025-01-25",
    tags: ["garbage", "waste", "unhygienic", "swachh"],
    progress: 30,
  },
];

// ─── Nearby Issues ───────────────────────────────────────────────────
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

export const nearbyIssues: Issue[] = [
  {
    id: "ISS-001",
    title: "Road Caving Near Market",
    description: "Portion of road near the main market has caved in creating a 3ft deep pit.",
    category: "road",
    severity: "critical",
    location: "Main Market, Ward 7",
    lat: 13.0827,
    lng: 80.2707,
    upvotes: 28,
    status: "open",
    distance: "0.2 km",
    reportedBy: "Priya S.",
  },
  {
    id: "ISS-002",
    title: "Water Pipe Burst on 5th Street",
    description: "Main water pipe has burst flooding the street. Water wastage for 2 days.",
    category: "water",
    severity: "high",
    location: "5th Street, Ward 7",
    lat: 13.0845,
    lng: 80.2725,
    upvotes: 19,
    status: "in-progress",
    distance: "0.4 km",
    reportedBy: "Rahul M.",
  },
  {
    id: "ISS-003",
    title: "Transformer Blown Near Park",
    description: "Main transformer has blown affecting power supply to 200+ houses.",
    category: "electricity",
    severity: "critical",
    location: "Gandhi Park, Ward 7",
    lat: 13.0805,
    lng: 80.274,
    upvotes: 45,
    status: "in-progress",
    distance: "0.6 km",
    reportedBy: "Deepa K.",
  },
  {
    id: "ISS-004",
    title: "Mosquito Breeding in Vacant Lot",
    description: "Vacant lot has stagnant water breeding mosquitoes. Dengue risk high.",
    category: "sanitation",
    severity: "medium",
    location: "Near Temple, Ward 5",
    lat: 13.079,
    lng: 80.269,
    upvotes: 12,
    status: "open",
    distance: "0.8 km",
    reportedBy: "Anand R.",
  },
  {
    id: "ISS-005",
    title: "School Building Wall Cracked",
    description: "Boundary wall of Government School is severely cracked and may collapse.",
    category: "education",
    severity: "high",
    location: "Government School, Ward 7",
    lat: 13.0835,
    lng: 80.271,
    upvotes: 34,
    status: "resolved",
    distance: "1.1 km",
    reportedBy: "Lakshmi N.",
  },
  {
    id: "ISS-006",
    title: "Clinic Without Power Backup",
    description: "Primary health centre has no generator. Emergency cases affected during power cuts.",
    category: "healthcare",
    severity: "high",
    location: "PHC Complex, Ward 7",
    lat: 13.081,
    lng: 80.2695,
    upvotes: 22,
    status: "open",
    distance: "0.5 km",
    reportedBy: "Dr. Meena R.",
  },
  {
    id: "ISS-007",
    title: "Street Light Pole Leaning Dangerously",
    description: "Electric pole near bus stop is leaning at 45 degrees. Risk of falling.",
    category: "electricity",
    severity: "critical",
    location: "Bus Stop, Ward 4",
    lat: 13.086,
    lng: 80.273,
    upvotes: 31,
    status: "open",
    distance: "0.3 km",
    reportedBy: "Suresh B.",
  },
];

// ─── Voting ──────────────────────────────────────────────────────────
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

export const votingItems: VotingItem[] = [
  {
    id: "VOTE-001",
    title: "New Community Hall for Ward 7",
    description: "Proposal to build a multi-purpose community hall for weddings, meetings, and events.",
    category: "other",
    supportCount: 1284,
    totalVotes: 2000,
    deadline: "2025-03-15",
    status: "trending",
    progress: 64,
    comments: 45,
    supported: false,
  },
  {
    id: "VOTE-002",
    title: "Solar Street Lights for All Main Roads",
    description: "Replace all existing street lights with solar-powered LED lights to save energy and improve illumination.",
    category: "electricity",
    supportCount: 956,
    totalVotes: 1500,
    deadline: "2025-03-20",
    status: "trending",
    progress: 64,
    comments: 32,
    supported: true,
  },
  {
    id: "VOTE-003",
    title: "Underground Drainage System for Krishna Nagar",
    description: "Install proper underground drainage system to prevent waterlogging and improve sanitation.",
    category: "sanitation",
    supportCount: 723,
    totalVotes: 1200,
    deadline: "2025-04-01",
    status: "active",
    progress: 60,
    comments: 28,
    supported: false,
  },
  {
    id: "VOTE-004",
    title: "New Government School in Ward 5",
    description: "Establish a new government high school to accommodate growing student population.",
    category: "education",
    supportCount: 567,
    totalVotes: 1000,
    deadline: "2025-04-10",
    status: "active",
    progress: 57,
    comments: 19,
    supported: false,
  },
  {
    id: "VOTE-005",
    title: "Free Health Checkup Camp Every Month",
    description: "Organize monthly free health checkup camps for senior citizens and children.",
    category: "healthcare",
    supportCount: 445,
    totalVotes: 800,
    deadline: "2025-03-25",
    status: "active",
    progress: 56,
    comments: 15,
    supported: true,
  },
  {
    id: "VOTE-006",
    title: "Widening of Market Road",
    description: "Widen the main market road from 20ft to 40ft to reduce traffic congestion.",
    category: "road",
    supportCount: 312,
    totalVotes: 600,
    deadline: "2025-04-20",
    status: "active",
    progress: 52,
    comments: 11,
    supported: false,
  },
  {
    id: "VOTE-007",
    title: "Public Wi-Fi in Community Areas",
    description: "Install free Wi-Fi hotspots in parks, libraries, and community centers.",
    category: "other",
    supportCount: 234,
    totalVotes: 500,
    deadline: "2025-02-28",
    status: "completed",
    progress: 100,
    comments: 8,
    supported: true,
  },
];

// ─── Notifications ───────────────────────────────────────────────────
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "status" | "alert" | "achievement" | "voting" | "system";
  read: boolean;
  createdAt: string;
}

export const notifications: Notification[] = [
  {
    id: "NOT-001",
    title: "Complaint Update",
    message: "Your complaint CMP-2024-001 has been assigned to Junior Engineer K. Selvam.",
    type: "status",
    read: false,
    createdAt: "2025-01-10T09:30:00",
  },
  {
    id: "NOT-002",
    title: "New Voting Started",
    message: "Solar Street Lights proposal is now open for community voting. Cast your vote!",
    type: "voting",
    read: false,
    createdAt: "2025-01-09T14:00:00",
  },
  {
    id: "NOT-003",
    title: "Achievement Unlocked!",
    message: "Congratulations! You've earned the 'Top Contributor' badge.",
    type: "achievement",
    read: false,
    createdAt: "2025-01-08T11:45:00",
  },
  {
    id: "NOT-004",
    title: "Nearby Issue Reported",
    message: "A critical road cave-in has been reported near Main Market.",
    type: "alert",
    read: true,
    createdAt: "2025-01-07T16:20:00",
  },
  {
    id: "NOT-005",
    title: "Complaint Resolved",
    message: "Your complaint CMP-2024-004 about medicine shortage has been resolved.",
    type: "status",
    read: true,
    createdAt: "2025-01-05T10:00:00",
  },
  {
    id: "NOT-006",
    title: "Community Request",
    message: "Priya S. from your area needs support for the Road Caving issue.",
    type: "system",
    read: true,
    createdAt: "2025-01-04T08:30:00",
  },
  {
    id: "NOT-007",
    title: "Budget Update",
    message: "₹12.5 Lakh allocated for Ward 7 road repairs. Work begins next week.",
    type: "status",
    read: false,
    createdAt: "2025-01-14T08:00:00",
  },
  {
    id: "NOT-008",
    title: "New Scheme Launched",
    message: "PM Swachh Bharat 2.0 is now available in your constituency. Apply now!",
    type: "system",
    read: true,
    createdAt: "2025-01-12T10:00:00",
  },
];

// ─── KPIs ────────────────────────────────────────────────────────────
export interface DashboardKPIs {
  totalComplaints: number;
  resolvedComplaints: number;
  inProgressComplaints: number;
  communitySupport: number;
  supportTrend: number;
  avgResolutionDays: number;
  activeNearbyIssues: number;
}

export const dashboardKPIs: DashboardKPIs = {
  totalComplaints: 12,
  resolvedComplaints: 9,
  inProgressComplaints: 3,
  communitySupport: 345,
  supportTrend: 12,
  avgResolutionDays: 14,
  activeNearbyIssues: 5,
};

// ─── Categories ──────────────────────────────────────────────────────
export const complaintCategories = [
  { value: "road", label: "Road", icon: "MapPin" },
  { value: "water", label: "Water", icon: "Droplets" },
  { value: "electricity", label: "Electricity", icon: "Zap" },
  { value: "healthcare", label: "Healthcare", icon: "Heart" },
  { value: "education", label: "Education", icon: "BookOpen" },
  { value: "sanitation", label: "Sanitation", icon: "Trash2" },
  { value: "other", label: "Other", icon: "MoreHorizontal" },
];

// ─── Charts ──────────────────────────────────────────────────────────
export const contributionGraph = [
  { month: "Aug", complaints: 2, votes: 5 },
  { month: "Sep", complaints: 1, votes: 3 },
  { month: "Oct", complaints: 3, votes: 7 },
  { month: "Nov", complaints: 2, votes: 4 },
  { month: "Dec", complaints: 3, votes: 6 },
  { month: "Jan", complaints: 1, votes: 8 },
];

export const trendingIssues = [
  { id: "t1", title: "Waterlogging in Gandhi Nagar", category: "water", upvotes: 47 },
  { id: "t2", title: "Potholes on School Road", category: "road", upvotes: 56 },
  { id: "t3", title: "Open Sewage Krishna Nagar", category: "sanitation", upvotes: 23 },
  { id: "t4", title: "Irregular Water Supply", category: "water", upvotes: 42 },
];

// ─── Government Schemes ──────────────────────────────────────────────
export const schemes = [
  { id: "s1", name: "Swachh Bharat Mission", description: "Cleanliness drive and waste management infrastructure", progress: 72, budget: "₹45 Cr", beneficiaries: "1.2 Lakh", deadline: "Mar 2025", status: "active" as const },
  { id: "s2", name: "AMRUT Scheme", description: "Water supply and sewerage infrastructure development", progress: 58, budget: "₹32 Cr", beneficiaries: "85,000", deadline: "Jun 2025", status: "active" as const },
  { id: "s3", name: "Smart City Mission", description: "Urban development and digital infrastructure", progress: 44, budget: "₹78 Cr", beneficiaries: "2.5 Lakh", deadline: "Dec 2025", status: "active" as const },
  { id: "s4", name: "PM Awas Yojana", description: "Affordable housing for urban and rural poor", progress: 81, budget: "₹56 Cr", beneficiaries: "45,000", deadline: "Sep 2025", status: "active" as const },
  { id: "s5", name: "PM GatiShakti", description: "Multi-modal connectivity and infrastructure planning", progress: 35, budget: "₹120 Cr", beneficiaries: "5 Lakh", deadline: "Dec 2026", status: "active" as const },
  { id: "s6", name: " Jal Jeevan Mission", description: "Piped water supply to every rural household", progress: 67, budget: "₹42 Cr", beneficiaries: "1.8 Lakh", deadline: "Aug 2025", status: "active" as const },
];

// ─── Development Projects ────────────────────────────────────────────
export interface DevelopmentProject {
  id: string;
  name: string;
  description: string;
  category: string;
  village: string;
  budget: number;
  spent: number;
  progress: number;
  status: "on-track" | "delayed" | "completed" | "planned";
  startDate: string;
  endDate: string;
  department: string;
}

export const developmentProjects: DevelopmentProject[] = [
  { id: "PRJ-001", name: "Gandhi Nagar Drainage Overhaul", description: "Complete drainage system replacement to prevent waterlogging", category: "Sanitation", village: "Gandhi Nagar", budget: 4500000, spent: 3200000, progress: 71, status: "on-track", startDate: "2024-08-15", endDate: "2025-06-30", department: "Corporation Water Board" },
  { id: "PRJ-002", name: "School Road Reconstruction", description: "Full road reconstruction with proper drainage and footpaths", category: "Roads", village: "Ward 5 Central", budget: 3200000, spent: 1800000, progress: 56, status: "delayed", startDate: "2024-09-01", endDate: "2025-04-30", department: "Corporation Roads Division" },
  { id: "PRJ-003", name: "Solar Street Light Installation", description: "150 solar LED street lights across 5 wards", category: "Electricity", village: "Multiple Wards", budget: 2800000, spent: 2100000, progress: 75, status: "on-track", startDate: "2024-10-15", endDate: "2025-03-31", department: "Electricity Board" },
  { id: "PRJ-004", name: "PHC Medicine Stock Replenishment", description: "Restocking all essential medicines at 12 health centers", category: "Healthcare", village: "Multiple Wards", budget: 1200000, spent: 1200000, progress: 100, status: "completed", startDate: "2024-11-01", endDate: "2025-01-15", department: "Health Department" },
  { id: "PRJ-005", name: "Krishna Nagar Sewage Line", description: "Underground sewage network for the entire colony", category: "Sanitation", village: "Krishna Nagar", budget: 5800000, spent: 2900000, progress: 50, status: "delayed", startDate: "2024-07-01", endDate: "2025-08-31", department: "Corporation Water Board" },
  { id: "PRJ-006", name: "Anganwadi Renovation Phase 2", description: "Roof repair, furniture replacement, and painting of 8 centers", category: "Education", village: "Ramesh Nagar", budget: 1800000, spent: 900000, progress: 50, status: "on-track", startDate: "2024-12-01", endDate: "2025-05-31", department: "Education Department" },
];

// ─── Help Articles ───────────────────────────────────────────────────
export interface HelpArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  popular: boolean;
}

export const helpArticles: HelpArticle[] = [
  { id: "H01", title: "How to file a complaint?", category: "Getting Started", content: "Navigate to Raise Complaint, select a category, describe the issue with details, add location, and submit. You can also use voice input.", popular: true },
  { id: "H02", title: "How to track my complaint?", category: "Getting Started", content: "Go to Track Complaint and enter your complaint ID or select from the list. You can see real-time status and timeline.", popular: true },
  { id: "H03", title: "How does community voting work?", category: "Community", content: "Browse proposals in Community Voting, support proposals you agree with. Top-voted proposals get prioritized by the MP.", popular: true },
  { id: "H04", title: "What is the citizen score?", category: "Account", content: "Your citizen score reflects your participation — complaints raised, votes cast, and community contributions. Higher scores unlock badges.", popular: false },
  { id: "H05", title: "How to use voice input?", category: "Getting Started", content: "Click the microphone icon while filing a complaint. Speak in your preferred language and the AI will transcribe it automatically.", popular: true },
  { id: "H06", title: "How to change language?", category: "Account", content: "Click the globe icon in the top navbar to switch between English, Hindi, Tamil, Telugu, and other supported languages.", popular: false },
];
