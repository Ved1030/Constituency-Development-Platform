export interface Village {
  id: string
  name: string
  ward: string
  population: number
  lat: number
  lng: number
  complaints: number
  criticalComplaints: number
  projects: number
  budget: string
}

export interface PriorityItem {
  rank: number
  village: string
  ward: string
  issue: string
  department: string
  population: number
  budget: string
  urgency: number
  confidence: number
  action: string
  lat: number
  lng: number
  color: string
}

export interface ProjectItem {
  id: string
  name: string
  department: string
  village: string
  budget: string
  completion: number
  contractor: string
  expectedCompletion: string
}

export interface ConstituencyDataSet {
  name: string
  district: string
  state: string
  center: { lat: number; lng: number }
  zoom: number
  population: string
  populationNumeric: number
  mpName: string
  assemblySegment: string
  lokShabha: string
  currentBudget: string
  mpladsFund: string
  gramPanchayats: number
  urbanRuralSplit: { urban: number; rural: number }
  criticalIssues: number
  villages: Village[]
  wards: string[]
  priorities: PriorityItem[]
  projects: ProjectItem[]
}

function v(name: string, ward: string, pop: number, lat: number, lng: number, comp: number, crit: number, proj: number, budget: string): Village {
  return { id: `v-${name.toLowerCase().replace(/\s/g, "-")}`, name, ward, population: pop, lat, lng, complaints: comp, criticalComplaints: crit, projects: proj, budget }
}

function p(rank: number, village: string, ward: string, issue: string, dept: string, pop: number, budget: string, urg: number, conf: number, action: string, lat: number, lng: number, color: string): PriorityItem {
  return { rank, village, ward, issue, department: dept, population: pop, budget, urgency: urg, confidence: conf, action, lat, lng, color }
}

function proj(id: string, name: string, dept: string, village: string, budget: string, completion: number, contractor: string, expected: string): ProjectItem {
  return { id, name, department: dept, village, budget, completion, contractor, expectedCompletion: expected }
}

const DATA: Record<string, ConstituencyDataSet> = {
  "North Chennai": {
    name: "North Chennai",
    district: "Chennai",
    state: "Tamil Nadu",
    center: { lat: 13.128, lng: 80.288 },
    zoom: 12,
    population: "18.4L",
    populationNumeric: 1842500,
    mpName: "Dr. Rajesh Sharma",
    assemblySegment: "Thiruvottiyur",
    lokShabha: "Chennai North",
    currentBudget: "₹37.7 Cr",
    mpladsFund: "₹5 Cr",
    gramPanchayats: 58,
    urbanRuralSplit: { urban: 62, rural: 38 },
    criticalIssues: 156,
    wards: ["Ward 3", "Ward 6", "Ward 8", "Ward 12", "Ward 15", "Ward 21"],
    villages: [
      v("Sewapuri", "Ward 12", 12450, 13.115, 80.275, 89, 23, 4, "₹1.2Cr"),
      v("Korattur", "Ward 8", 102300, 13.130, 80.290, 156, 41, 7, "₹3.8Cr"),
      v("Perambur", "Ward 15", 84200, 13.118, 80.265, 112, 29, 5, "₹2.1Cr"),
      v("Villivakkam", "Ward 3", 96800, 13.140, 80.305, 134, 35, 6, "₹2.5Cr"),
      v("Ayanavaram", "Ward 6", 78500, 13.125, 80.295, 78, 18, 3, "₹1.8Cr"),
      v("Otteri", "Ward 21", 45600, 13.108, 80.278, 45, 8, 2, "₹0.9Cr"),
    ],
    priorities: [
      p(1, "Sewapuri", "Ward 12", "Severe water shortage - borewells dried up", "Water Supply", 12450, "₹12L", 96, 94, "Pre-position water tankers & recharge borewells immediately", 13.115, 80.275, "red"),
      p(2, "Korattur", "Ward 8", "Industrial road completely damaged with potholes", "Roads", 102300, "₹2.5Cr", 92, 91, "Schedule 8km industrial road resurfacing urgently", 13.130, 80.290, "orange"),
      p(3, "Perambur", "Ward 15", "PHC lacks emergency medicines and female doctor", "Healthcare", 84200, "₹45L", 88, 89, "Stock PHC with emergency medicines & hire female doctor", 13.118, 80.265, "red"),
      p(4, "Villivakkam", "Ward 3", "Open drainage blocked causing health hazards", "Sanitation", 96800, "₹18L", 85, 87, "Deploy sewage cleaning crew immediately", 13.140, 80.305, "orange"),
      p(5, "Ayanavaram", "Ward 6", "Transformer damaged - no power for 3 days", "Electricity", 78500, "₹8L", 82, 85, "Replace damaged transformer at TNHB colony", 13.125, 80.295, "amber"),
      p(6, "Otteri", "Ward 21", "Government school buildings in dilapidated condition", "Education", 45600, "₹1.2Cr", 78, 83, "Renovate 3 government school buildings", 13.108, 80.278, "amber"),
      p(7, "Korattur", "Ward 8", "PM Awas Yojana pending installments not released", "Housing", 15000, "₹2Cr", 74, 81, "Release PM Awas Yojana pending installments", 13.130, 80.290, "blue"),
      p(8, "Villivakkam", "Ward 3", "12 dark stretches need streetlights urgently", "Roads", 38000, "₹32L", 71, 79, "Install streetlights on 12 dark stretches", 13.140, 80.305, "blue"),
      p(9, "Sewapuri", "Ward 12", "Subsidized seeds not distributed for Rabi season", "Agriculture", 12000, "₹15L", 67, 76, "Distribute subsidized seeds for Rabi season", 13.115, 80.275, "green"),
      p(10, "Perambur", "Ward 15", "Village ponds need deepening for water conservation", "Water Supply", 20000, "₹22L", 63, 74, "Deepen 5 village ponds for water conservation", 13.118, 80.265, "green"),
    ],
    projects: [
      proj("nc-1", "Road widening NH-5", "Roads", "Korattur", "₹2.5Cr", 78, "L&T Constructions", "Dec 2026"),
      proj("nc-2", "Water treatment plant", "Water Supply", "Perambur", "₹3.2Cr", 45, "VA Tech Wabag", "Jun 2027"),
      proj("nc-3", "School renovation project", "Education", "Villivakkam", "₹1.8Cr", 92, "Shriram Builders", "Mar 2026"),
    ],
  },

  "South Mumbai": {
    name: "South Mumbai",
    district: "Mumbai City",
    state: "Maharashtra",
    center: { lat: 18.945, lng: 72.833 },
    zoom: 13,
    population: "22.1L",
    populationNumeric: 2210000,
    mpName: "Smt. Meera Desai",
    assemblySegment: "Colaba",
    lokShabha: "Mumbai South",
    currentBudget: "₹42.3 Cr",
    mpladsFund: "₹5 Cr",
    gramPanchayats: 0,
    urbanRuralSplit: { urban: 98, rural: 2 },
    criticalIssues: 98,
    wards: ["Ward A", "Ward B", "Ward C", "Ward D", "Ward E"],
    villages: [
      v("Colaba", "Ward A", 85200, 18.920, 72.833, 67, 14, 5, "₹3.2Cr"),
      v("Worli", "Ward B", 124500, 18.925, 72.820, 98, 28, 6, "₹4.5Cr"),
      v("Malabar Hill", "Ward C", 32100, 18.948, 72.798, 23, 4, 3, "₹1.8Cr"),
      v("Marine Lines", "Ward D", 56700, 18.942, 72.828, 45, 10, 4, "₹2.1Cr"),
      v("Dadar West", "Ward E", 142300, 18.962, 72.848, 134, 38, 8, "₹5.2Cr"),
      v("Mahim", "Ward E", 78900, 18.970, 72.840, 89, 22, 5, "₹2.8Cr"),
    ],
    priorities: [
      p(1, "Dadar West", "Ward E", "Road flooding due to clogged drains every monsoon", "Sanitation", 142300, "₹24L", 95, 93, "Desilt 12km of major drainage lines before monsoon", 18.962, 72.848, "red"),
      p(2, "Worli", "Ward B", "Coastal road construction causing noise pollution", "Roads", 124500, "₹1.5Cr", 91, 90, "Install noise barriers and regulate construction timing", 18.925, 72.820, "orange"),
      p(3, "Colaba", "Ward A", "Water pipeline leakage - 40% loss in distribution", "Water Supply", 85200, "₹56L", 87, 88, "Replace 2km aging water pipeline in Colaba", 18.920, 72.833, "red"),
      p(4, "Mahim", "Ward E", "Municipal school lacks basic sanitation facilities", "Education", 78900, "₹32L", 84, 86, "Build separate toilets for girls in 3 municipal schools", 18.970, 72.840, "orange"),
      p(5, "Malabar Hill", "Ward C", "Landslide risk area needs retaining wall", "Housing", 32100, "₹2.8Cr", 80, 84, "Build retaining wall and slope stabilization", 18.948, 72.798, "amber"),
      p(6, "Marine Lines", "Ward D", "Street lights non-functional in 5 lanes", "Electricity", 56700, "₹6L", 76, 82, "Replace 45 streetlights and underground wiring", 18.942, 72.828, "amber"),
      p(7, "Dadar West", "Ward E", "PHC overcrowded - needs expansion", "Healthcare", 50000, "₹1.2Cr", 73, 80, "Expand PHC with 10 additional beds and OPD", 18.962, 72.848, "blue"),
      p(8, "Worli", "Ward B", "Fishing community needs modern jetty", "Agriculture", 18000, "₹75L", 70, 78, "Construct modern fishing jetty at Worli Koliwada", 18.925, 72.820, "blue"),
      p(9, "Colaba", "Ward A", "Open spaces need garden development", "Environment", 32000, "₹28L", 66, 75, "Develop 2 garden spaces in Colaba", 18.920, 72.833, "green"),
      p(10, "Mahim", "Ward E", "Sports ground in disrepair", "Sports", 15000, "₹40L", 62, 73, "Renovate Mahim sports ground with synthetic track", 18.970, 72.840, "green"),
    ],
    projects: [
      proj("sm-1", "Coastal Road Phase 2", "Roads", "Worli", "₹12Cr", 62, "L&T Constructions", "Mar 2027"),
      proj("sm-2", "Water pipeline replacement", "Water Supply", "Colaba", "₹56L", 88, "SMS Infra", "Jul 2026"),
      proj("sm-3", "Municipal school renovation", "Education", "Mahim", "₹32L", 35, "Rohan Builders", "Dec 2026"),
    ],
  },

  Varanasi: {
    name: "Varanasi",
    district: "Varanasi",
    state: "Uttar Pradesh",
    center: { lat: 25.317, lng: 82.973 },
    zoom: 13,
    population: "16.8L",
    populationNumeric: 1680000,
    mpName: "Shri Narendra Modi",
    assemblySegment: "Varanasi Cantt.",
    lokShabha: "Varanasi",
    currentBudget: "₹31.2 Cr",
    mpladsFund: "₹5 Cr",
    gramPanchayats: 62,
    urbanRuralSplit: { urban: 45, rural: 55 },
    criticalIssues: 89,
    wards: ["Ward 1", "Ward 4", "Ward 7", "Ward 10", "Ward 14", "Ward 18"],
    villages: [
      v("Jansath", "Ward 4", 23400, 25.298, 82.958, 112, 34, 6, "₹1.5Cr"),
      v("Babatpur", "Ward 7", 18700, 25.330, 82.995, 78, 21, 4, "₹0.9Cr"),
      v("Lohta", "Ward 10", 28900, 25.305, 82.945, 95, 28, 5, "₹1.8Cr"),
      v("Chak Raja", "Ward 14", 12300, 25.285, 82.970, 45, 12, 3, "₹0.6Cr"),
      v("Pahadiya", "Ward 18", 15600, 25.340, 82.985, 67, 18, 4, "₹1.1Cr"),
      v("Sheodari", "Ward 1", 9800, 25.312, 82.962, 34, 8, 2, "₹0.4Cr"),
    ],
    priorities: [
      p(1, "Jansath", "Ward 4", "Ganga pollution - no clean drinking water", "Water Supply", 23400, "₹18L", 97, 95, "Install RO water purification plants and sewage diversion", 25.298, 82.958, "red"),
      p(2, "Babatpur", "Ward 7", "Village roads washed away in floods", "Roads", 18700, "₹1.2Cr", 93, 92, "Rebuild 5km village roads with proper drainage", 25.330, 82.995, "orange"),
      p(3, "Lohta", "Ward 10", "PHC closed due to staff shortage for 3 months", "Healthcare", 28900, "₹25L", 89, 90, "Deploy 2 doctors and nursing staff to Lohta PHC", 25.305, 82.945, "red"),
      p(4, "Chak Raja", "Ward 14", "Primary school has no building - classes under tree", "Education", 12300, "₹40L", 86, 88, "Construct new primary school building urgently", 25.285, 82.970, "orange"),
      p(5, "Pahadiya", "Ward 18", "Open defecation due to no toilet facilities", "Sanitation", 15600, "₹22L", 83, 86, "Build 200 individual household toilets under SBM", 25.340, 82.985, "amber"),
      p(6, "Sheodari", "Ward 1", "Agriculture land affected by waterlogging", "Agriculture", 9800, "₹8L", 79, 84, "Construct drainage channels in 50 acres", 25.312, 82.962, "amber"),
      p(7, "Jansath", "Ward 4", "PM Awas Yojana houses incomplete", "Housing", 12000, "₹1.5Cr", 75, 82, "Complete 150 pending PM Awas Yojana houses", 25.298, 82.958, "blue"),
      p(8, "Lohta", "Ward 10", "Transformer overloaded - frequent power cuts", "Electricity", 18000, "₹10L", 72, 80, "Install additional 100KVA transformer in Lohta", 25.305, 82.945, "blue"),
      p(9, "Babatpur", "Ward 7", "Anganwadi center lacks nutrition supplies", "Women & Child", 8000, "₹3L", 68, 77, "Regularize nutrition supply to Babatpur anganwadi", 25.330, 82.995, "green"),
      p(10, "Pahadiya", "Ward 18", "No streetlights - safety concern for women", "Electricity", 12000, "₹5L", 64, 75, "Install 25 solar streetlights in Pahadiya", 25.340, 82.985, "green"),
    ],
    projects: [
      proj("var-1", "Ganga ghat restoration", "Water Supply", "Jansath", "₹2.8Cr", 55, "UP Jal Nigam", "Jun 2027"),
      proj("var-2", "Village road construction", "Roads", "Babatpur", "₹1.2Cr", 25, "Garg Infra", "Sep 2027"),
      proj("var-3", "Primary school building", "Education", "Chak Raja", "₹40L", 70, "Sharma Constructions", "Dec 2026"),
    ],
  },

  Indore: {
    name: "Indore",
    district: "Indore",
    state: "Madhya Pradesh",
    center: { lat: 22.719, lng: 75.857 },
    zoom: 13,
    population: "31.2L",
    populationNumeric: 3120000,
    mpName: "Shri Shankar Lalwani",
    assemblySegment: "Indore-1",
    lokShabha: "Indore",
    currentBudget: "₹48.5 Cr",
    mpladsFund: "₹5 Cr",
    gramPanchayats: 45,
    urbanRuralSplit: { urban: 85, rural: 15 },
    criticalIssues: 112,
    wards: ["Ward 2", "Ward 5", "Ward 9", "Ward 13", "Ward 17", "Ward 22"],
    villages: [
      v("Bicholi Mardana", "Ward 9", 34500, 22.725, 75.870, 89, 22, 6, "₹2.8Cr"),
      v("Sinhasa", "Ward 13", 28900, 22.710, 75.845, 67, 16, 4, "₹1.6Cr"),
      v("Khajrana", "Ward 5", 42300, 22.735, 75.890, 112, 34, 7, "₹3.5Cr"),
      v("Banganga", "Ward 17", 19800, 22.698, 75.862, 45, 10, 3, "₹1.2Cr"),
      v("Tejaji Nagar", "Ward 22", 15600, 22.745, 75.875, 56, 14, 4, "₹0.9Cr"),
      v("Rau", "Ward 2", 27800, 22.690, 75.830, 78, 20, 5, "₹2.1Cr"),
    ],
    priorities: [
      p(1, "Khajrana", "Ward 5", "Sewage treatment plant overloaded - raw sewage flowing", "Sanitation", 42300, "₹3.2Cr", 96, 94, "Upgrade STP capacity from 10MLD to 20MLD", 22.735, 75.890, "red"),
      p(2, "Bicholi Mardana", "Ward 9", "Road construction incomplete - half-built for 2 years", "Roads", 34500, "₹1.8Cr", 92, 91, "Complete pending 3km road construction", 22.725, 75.870, "orange"),
      p(3, "Rau", "Ward 2", "Government hospital lacks emergency ward", "Healthcare", 27800, "₹1.5Cr", 88, 89, "Build emergency ward at Rau Community Health Center", 22.690, 75.830, "red"),
      p(4, "Sinhasa", "Ward 13", "Tube wells dried up - acute water shortage", "Water Supply", 28900, "₹35L", 85, 87, "Deepen 4 borewells and install hand pumps", 22.710, 75.845, "orange"),
      p(5, "Bangnaga", "Ward 17", "School dropout rate increased 40% this year", "Education", 19800, "₹30L", 82, 85, "Launch mid-day meal and scholarship program", 22.698, 75.862, "amber"),
      p(6, "Tejaji Nagar", "Ward 22", "Voltage fluctuation damaging appliances", "Electricity", 15600, "₹7L", 78, 83, "Install voltage stabilizers and upgrade transformers", 22.745, 75.875, "amber"),
      p(7, "Khajrana", "Ward 5", "Affordable housing scheme delayed", "Housing", 25000, "₹4Cr", 74, 81, "Expedite PM Awas Yojana phase 2 construction", 22.735, 75.890, "blue"),
      p(8, "Bicholi Mardana", "Ward 9", "Farmers not receiving MSP for wheat crop", "Agriculture", 12000, "₹12L", 71, 79, "Set up MSP procurement center in village", 22.725, 75.870, "blue"),
      p(9, "Rau", "Ward 2", "Pond encroachment needs clearance", "Environment", 8000, "₹15L", 67, 76, "Remove encroachments and restore Rau pond", 22.690, 75.830, "green"),
      p(10, "Sinhasa", "Ward 13", "Playground encroached for construction", "Sports", 6000, "₹8L", 63, 74, "Reclaim playground and develop sports facilities", 22.710, 75.845, "green"),
    ],
    projects: [
      proj("ind-1", "STP upgrade Khajrana", "Sanitation", "Khajrana", "₹3.2Cr", 30, "MP Jal Nigam", "Dec 2027"),
      proj("ind-2", "Road completion Bicholi", "Roads", "Bicholi Mardana", "₹1.8Cr", 55, "InfraWorks Indore", "Mar 2027"),
      proj("ind-3", "Emergency ward Rau", "Healthcare", "Rau", "₹1.5Cr", 15, "Apex Constructions", "Jun 2027"),
    ],
  },

  Nagpur: {
    name: "Nagpur",
    district: "Nagpur",
    state: "Maharashtra",
    center: { lat: 21.145, lng: 79.088 },
    zoom: 13,
    population: "24.6L",
    populationNumeric: 2460000,
    mpName: "Shri Nitin Gadkari",
    assemblySegment: "Nagpur West",
    lokShabha: "Nagpur",
    currentBudget: "₹40.2 Cr",
    mpladsFund: "₹5 Cr",
    gramPanchayats: 52,
    urbanRuralSplit: { urban: 78, rural: 22 },
    criticalIssues: 134,
    wards: ["Ward 1", "Ward 3", "Ward 7", "Ward 11", "Ward 14", "Ward 19"],
    villages: [
      v("Wanadongri", "Ward 7", 28700, 21.130, 79.075, 78, 20, 5, "₹2.4Cr"),
      v("Hingna", "Ward 11", 34500, 21.120, 79.062, 95, 26, 6, "₹3.1Cr"),
      v("Besa", "Ward 14", 21200, 21.155, 79.095, 56, 14, 4, "₹1.5Cr"),
      v("Mauda", "Ward 3", 18900, 21.168, 79.110, 67, 18, 3, "₹1.2Cr"),
      v("Koradi", "Ward 19", 12400, 21.185, 79.125, 34, 8, 2, "₹0.8Cr"),
      v("Pardi", "Ward 1", 23400, 21.135, 79.070, 89, 24, 5, "₹2.0Cr"),
    ],
    priorities: [
      p(1, "Hingna", "Ward 11", "Industrial zone - toxic waste contamination in water", "Water Supply", 34500, "₹45L", 97, 95, "Install water testing labs and alternative water supply", 21.120, 79.062, "red"),
      p(2, "Pardi", "Ward 1", "Main approach road completely destroyed", "Roads", 23400, "₹1.5Cr", 93, 92, "Rebuild 4km approach road with concrete pavement", 21.135, 79.070, "orange"),
      p(3, "Wanadongri", "Ward 7", "PHC lacks diagnostic equipment", "Healthcare", 28700, "₹32L", 89, 90, "Equip PHC with X-ray and basic diagnostic lab", 21.130, 79.075, "red"),
      p(4, "Besa", "Ward 14", "School building declared unsafe after earthquake", "Education", 21200, "₹50L", 86, 88, "Reconstruct 2 school buildings with seismic safety", 21.155, 79.095, "orange"),
      p(5, "Mauda", "Ward 3", "No streetlights - dark village at night", "Electricity", 18900, "₹9L", 83, 86, "Install 50 solar LED streetlights in Mauda", 21.168, 79.110, "amber"),
      p(6, "Koradi", "Ward 19", "Anganwadi center no proper building", "Women & Child", 12400, "₹15L", 79, 84, "Construct new anganwadi center building", 21.185, 79.125, "amber"),
      p(7, "Hingna", "Ward 11", "Low-cost housing required for factory workers", "Housing", 22000, "₹3Cr", 75, 82, "Start PM Awas Yojana colony for industrial workers", 21.120, 79.062, "blue"),
      p(8, "Wanadongri", "Ward 7", "Open drainage breeding mosquitoes", "Sanitation", 18000, "₹12L", 72, 80, "Cover open drains and fogging operations", 21.130, 79.075, "blue"),
      p(9, "Pardi", "Ward 1", "Farm pond scheme not implemented", "Agriculture", 10000, "₹6L", 68, 77, "Dig 10 farm ponds under MGNREGA", 21.135, 79.070, "green"),
      p(10, "Besa", "Ward 14", "Tourist spot lacks basic amenities", "Tourism", 8000, "₹20L", 64, 75, "Develop tourist facilities at Besa lake", 21.155, 79.095, "green"),
    ],
    projects: [
      proj("nag-1", "Water testing lab Hingna", "Water Supply", "Hingna", "₹45L", 40, "Mahagenco", "Apr 2027"),
      proj("nag-2", "Road reconstruction Pardi", "Roads", "Pardi", "₹1.5Cr", 20, "MSRDC", "Aug 2027"),
      proj("nag-3", "PHC equipment Wanadongri", "Healthcare", "Wanadongri", "₹32L", 60, "ZP Nagpur", "Nov 2026"),
    ],
  },

  Ahmedabad: {
    name: "Ahmedabad",
    district: "Ahmedabad",
    state: "Gujarat",
    center: { lat: 23.022, lng: 72.571 },
    zoom: 13,
    population: "28.9L",
    populationNumeric: 2890000,
    mpName: "Shri Amit Shah",
    assemblySegment: "Ahmedabad West",
    lokShabha: "Ahmedabad",
    currentBudget: "₹44.6 Cr",
    mpladsFund: "₹5 Cr",
    gramPanchayats: 38,
    urbanRuralSplit: { urban: 90, rural: 10 },
    criticalIssues: 145,
    wards: ["Ward 2", "Ward 5", "Ward 8", "Ward 12", "Ward 16", "Ward 20"],
    villages: [
      v("Jashodanagar", "Ward 8", 32400, 23.010, 72.558, 98, 28, 6, "₹3.2Cr"),
      v("Bopal", "Ward 12", 45600, 23.035, 72.542, 67, 16, 5, "₹2.8Cr"),
      v("Ranip", "Ward 5", 38900, 23.045, 72.580, 89, 24, 7, "₹3.5Cr"),
      v("Chharodi", "Ward 16", 16700, 23.005, 72.530, 45, 10, 3, "₹1.1Cr"),
      v("Sarkhej", "Ward 20", 23400, 22.990, 72.550, 78, 22, 5, "₹2.0Cr"),
      v("Vasna", "Ward 2", 29800, 23.018, 72.565, 112, 32, 6, "₹2.5Cr"),
    ],
    priorities: [
      p(1, "Vasna", "Ward 2", "Waterlogging - every monsoon houses submerged", "Sanitation", 29800, "₹2.8Cr", 96, 94, "Construct storm water drainage network in Vasna", 23.018, 72.565, "red"),
      p(2, "Jashodanagar", "Ward 8", "Industrial road damaged by heavy vehicles", "Roads", 32400, "₹2.2Cr", 92, 91, "Reconstruct 5km industrial road with reinforced concrete", 23.010, 72.558, "orange"),
      p(3, "Ranip", "Ward 5", "Urban PHC severely overcrowded", "Healthcare", 38900, "₹1.8Cr", 88, 89, "Build new urban PHC in Ranip with 15 beds", 23.045, 72.580, "red"),
      p(4, "Bopal", "Ward 12", "Private school dominance - no govt school in 5km", "Education", 45600, "₹60L", 85, 87, "Establish government high school in Bopal", 23.035, 72.542, "orange"),
      p(5, "Sarkhej", "Ward 20", "Voltage fluctuation burns appliances weekly", "Electricity", 23400, "₹12L", 82, 85, "Upgrade transformer and stabilizers in Sarkhej", 22.990, 72.550, "amber"),
      p(6, "Chharodi", "Ward 16", "PM Awas Yojana houses quality substandard", "Housing", 16700, "₹2Cr", 78, 83, "Inspect and rectify 80 PM Awas Yojana houses", 23.005, 72.530, "amber"),
      p(7, "Jashodanagar", "Ward 8", "Groundwater depleted - borewells failing", "Water Supply", 25000, "₹28L", 74, 81, "Implement rainwater harvesting in 1000 houses", 23.010, 72.558, "blue"),
      p(8, "Bopal", "Ward 12", "Farmers suicide prevention - crop failure", "Agriculture", 8000, "₹10L", 71, 79, "Launch crop insurance awareness and compensation", 23.035, 72.542, "blue"),
      p(9, "Ranip", "Ward 5", "No sports facilities for youth", "Sports", 15000, "₹35L", 67, 76, "Develop multi-sport complex in Ranip", 23.045, 72.580, "green"),
      p(10, "Sarkhej", "Ward 20", "Heritage pond polluted and encroached", "Environment", 12000, "₹18L", 63, 74, "Clean and beautify Sarkhej heritage pond", 22.990, 72.550, "green"),
    ],
    projects: [
      proj("ahm-1", "Storm water drainage Vasna", "Sanitation", "Vasna", "₹2.8Cr", 35, "AMC", "May 2027"),
      proj("ahm-2", "Industrial road reconstruction", "Roads", "Jashodanagar", "₹2.2Cr", 50, "Gujarat Infra", "Feb 2027"),
      proj("ahm-3", "Urban PHC Ranip", "Healthcare", "Ranip", "₹1.8Cr", 20, "Health Dept", "Aug 2027"),
    ],
  },

  Pune: {
    name: "Pune",
    district: "Pune",
    state: "Maharashtra",
    center: { lat: 18.520, lng: 73.856 },
    zoom: 13,
    population: "35.6L",
    populationNumeric: 3560000,
    mpName: "Shri Murlidhar Mohol",
    assemblySegment: "Pune Central",
    lokShabha: "Pune",
    currentBudget: "₹52.8 Cr",
    mpladsFund: "₹5 Cr",
    gramPanchayats: 28,
    urbanRuralSplit: { urban: 95, rural: 5 },
    criticalIssues: 178,
    wards: ["Ward 3", "Ward 6", "Ward 10", "Ward 15", "Ward 21", "Ward 25"],
    villages: [
      v("Koregaon Park", "Ward 10", 45600, 18.538, 73.878, 56, 12, 8, "₹4.5Cr"),
      v("Hadapsar", "Ward 15", 52300, 18.492, 73.862, 134, 38, 7, "₹3.8Cr"),
      v("Bibvewadi", "Ward 21", 38900, 18.475, 73.845, 89, 24, 5, "₹2.5Cr"),
      v("Baner", "Ward 6", 56700, 18.558, 73.836, 67, 16, 6, "₹3.2Cr"),
      v("Kharadi", "Ward 25", 42300, 18.565, 73.902, 98, 30, 7, "₹4.0Cr"),
      v("Yerawada", "Ward 3", 34500, 18.545, 73.870, 78, 20, 5, "₹2.2Cr"),
    ],
    priorities: [
      p(1, "Hadapsar", "Ward 15", "Sewage line burst - raw sewage on roads for weeks", "Sanitation", 52300, "₹1.5Cr", 96, 94, "Replace 3km sewage line in Hadapsar industrial area", 18.492, 73.862, "red"),
      p(2, "Kharadi", "Ward 25", "IT park road congestion - 3km traffic jam daily", "Roads", 42300, "₹5Cr", 92, 91, "Widen Kharadi IT park road to 4 lanes", 18.565, 73.902, "orange"),
      p(3, "Bibvewadi", "Ward 21", "Municipal hospital lacks emergency services", "Healthcare", 38900, "₹2.2Cr", 88, 89, "Upgrade Bibvewadi hospital with emergency and ICU", 18.475, 73.845, "red"),
      p(4, "Baner", "Ward 6", "Underground water pipeline 30 years old leaking", "Water Supply", 56700, "₹45L", 85, 87, "Replace 2km aging water pipeline in Baner", 18.558, 73.836, "orange"),
      p(5, "Koregaon Park", "Ward 10", "Public school infrastructure very poor", "Education", 45600, "₹80L", 82, 85, "Renovate 3 municipal schools in Koregaon Park", 18.538, 73.878, "amber"),
      p(6, "Yerawada", "Ward 3", "Frequent power cuts due to overloaded transformer", "Electricity", 34500, "₹15L", 78, 83, "Install additional 250KVA transformer in Yerawada", 18.545, 73.870, "amber"),
      p(7, "Hadapsar", "Ward 15", "Slum rehabilitation project stalled", "Housing", 28000, "₹5Cr", 74, 81, "Revive stalled slum rehabilitation project near Hadapsar", 18.492, 73.862, "blue"),
      p(8, "Koregaon Park", "Ward 10", "Park encroachment reduced green cover", "Environment", 15000, "₹22L", 70, 79, "Remove encroachments and restore 3 gardens", 18.538, 73.878, "blue"),
      p(9, "Kharadi", "Ward 25", "No public transport connectivity to IT park", "Employment", 42000, "₹3.5Cr", 66, 76, "Introduce PM e-bus service to Kharadi IT park", 18.565, 73.902, "green"),
      p(10, "Baner", "Ward 6", "Women's safety - poorly lit streets", "Public Safety", 20000, "₹8L", 62, 73, "Install 100 CCTV cameras and LED streetlights", 18.558, 73.836, "green"),
    ],
    projects: [
      proj("pun-1", "Sewage line replacement Hadapsar", "Sanitation", "Hadapsar", "₹1.5Cr", 45, "PMC", "Apr 2027"),
      proj("pun-2", "Road widening Kharadi", "Roads", "Kharadi", "₹5Cr", 25, "NCC Infrastructure", "Dec 2027"),
      proj("pun-3", "Hospital upgrade Bibvewadi", "Healthcare", "Bibvewadi", "₹2.2Cr", 35, "Health Dept", "Sep 2027"),
    ],
  },
}

const FALLBACK: ConstituencyDataSet = DATA["North Chennai"]

export function getConstituencyData(name: string): ConstituencyDataSet {
  return DATA[name] || FALLBACK
}

export function getAllConstituencyNames(): string[] {
  return Object.keys(DATA)
}
