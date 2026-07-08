"use client";

// ─── Image mapping: category → real image paths from public/social-media/ ───

const IMAGE_MAP: Record<string, string[]> = {
  Roads: [
    "/social-media/roads/Screenshot%202026-07-08%20140715.png",
    "/social-media/roads/Screenshot%202026-07-08%20140731.png",
    "/social-media/roads/Screenshot%202026-07-08%20140740.png",
    "/social-media/roads/Screenshot%202026-07-08%20140745.png",
    "/social-media/roads/Screenshot%202026-07-08%20140753.png",
  ],
  "Water Supply": [
    "/social-media/water%20supply%20and%20leakage/Screenshot%202026-07-08%20141221.png",
    "/social-media/water%20supply%20and%20leakage/Screenshot%202026-07-08%20141228.png",
    "/social-media/water%20supply%20and%20leakage/Screenshot%202026-07-08%20141241.png",
  ],
  Drainage: [
    "/social-media/drainage%20and%20flooding/Screenshot%202026-07-08%20141030.png",
    "/social-media/drainage%20and%20flooding/Screenshot%202026-07-08%20141037.png",
    "/social-media/drainage%20and%20flooding/Screenshot%202026-07-08%20141041.png",
    "/social-media/drainage%20and%20flooding/Screenshot%202026-07-08%20141045.png",
    "/social-media/drainage%20and%20flooding/Screenshot%202026-07-08%20141050.png",
  ],
  Electricity: [
    "/social-media/electricity/Screenshot%202026-07-08%20141125.png",
    "/social-media/electricity/Screenshot%202026-07-08%20141134.png",
    "/social-media/electricity/Screenshot%202026-07-08%20141139.png",
  ],
  Garbage: [
    "/social-media/garbage%20and%20cleanliness/Screenshot%202026-07-08%20141621.png",
    "/social-media/garbage%20and%20cleanliness/Screenshot%202026-07-08%20141626.png",
    "/social-media/garbage%20and%20cleanliness/Screenshot%202026-07-08%20141634.png",
  ],
  Healthcare: [
    "/social-media/water%20supply%20and%20leakage/Screenshot%202026-07-08%20141221.png",
    "/social-media/education/Screenshot%202026-07-08%20141531.png",
  ],
  Education: [
    "/social-media/education/Screenshot%202026-07-08%20141531.png",
    "/social-media/education/Screenshot%202026-07-08%20141541.png",
  ],
  Housing: [
    "/social-media/housing/Screenshot%202026-07-08%20141444.png",
    "/social-media/housing/Screenshot%202026-07-08%20141449.png",
    "/social-media/housing/Screenshot%202026-07-08%20141456.png",
  ],
  Agriculture: [
    "/social-media/agriculture/Screenshot%202026-07-08%20141347.png",
    "/social-media/agriculture/Screenshot%202026-07-08%20141355.png",
    "/social-media/agriculture/Screenshot%202026-07-08%20141405.png",
  ],
  Sanitation: [
    "/social-media/sanitation/Screenshot%202026-07-08%20141257.png",
    "/social-media/sanitation/Screenshot%202026-07-08%20141306.png",
    "/social-media/sanitation/Screenshot%202026-07-08%20141312.png",
  ],
  Environment: [
    "/social-media/agriculture/Screenshot%202026-07-08%20141347.png",
    "/social-media/agriculture/Screenshot%202026-07-08%20141405.png",
  ],
  "Public Safety": [
    "/social-media/roads/Screenshot%202026-07-08%20140740.png",
    "/social-media/electricity/Screenshot%202026-07-08%20141125.png",
  ],
};

// ─── Indian names, platforms, locations, etc. ───

const AUTHORS = [
  { name: "Ramesh Kumar", handle: "@rameshkumar", initials: "RK", platform: "twitter" as const },
  { name: "Priya Sharma", handle: "@priyasharma", initials: "PS", platform: "twitter" as const },
  { name: "Lakshmi Devi", handle: "@lakshmidevi", initials: "LD", platform: "citizen" as const },
  { name: "Arun Kumar", handle: "@arun_chn", initials: "AK", platform: "twitter" as const },
  { name: "North Chennai Residents", handle: "@northchn", initials: "NR", platform: "facebook" as const },
  { name: "Ward 14 Welfare Assn", handle: "@ward14wa", initials: "WW", platform: "facebook" as const },
  { name: "The Hindu Chennai", handle: "@hindu_chn", initials: "TH", platform: "news" as const },
  { name: "Indian Express TN", handle: "@ie_tn", initials: "IE", platform: "news" as const },
  { name: "DT Next", handle: "@dtnext", initials: "DN", platform: "news" as const },
  { name: "Times of India Chennai", handle: "@toichennai", initials: "TO", platform: "news" as const },
  { name: "Citizen App TN", handle: "@citizenapptn", initials: "CA", platform: "citizen" as const },
  { name: "Sundari Devi", handle: "@sundari_chn", initials: "SD", platform: "instagram" as const },
  { name: "Murugan K", handle: "@murugan_auto", initials: "MK", platform: "citizen" as const },
  { name: "Chennai Lens", handle: "@chennailens", initials: "CL", platform: "instagram" as const },
  { name: "Vijayalakshmi R", handle: "@viji_welfare", initials: "VR", platform: "facebook" as const },
  { name: "Rajan Pillai", handle: "@rajan_chn", initials: "RP", platform: "twitter" as const },
  { name: "Anita Rajendran", handle: "@anita_app", initials: "AR", platform: "citizen" as const },
  { name: "Thiruvottiyur Times", handle: "@thiruvottiyur", initials: "TT", platform: "news" as const },
  { name: "Velachery Watch", handle: "@velacheryw", initials: "VW", platform: "instagram" as const },
  { name: "Sewapuri Residents", handle: "@sewapuri_res", initials: "SR", platform: "facebook" as const },
  { name: "Korattur Auto Union", handle: "@korattur_auto", initials: "KA", platform: "citizen" as const },
  { name: "Perambur Welfare", handle: "@perambur_wf", initials: "PW", platform: "facebook" as const },
  { name: "Local News TN", handle: "@localnewstn", initials: "LN", platform: "news" as const },
  { name: "Water Watch Chennai", handle: "@waterwatchchn", initials: "WW", platform: "twitter" as const },
  { name: "Road Safety TN", handle: "@roadsafety_tn", initials: "RS", platform: "twitter" as const },
];

const VILLAGES = [
  { village: "Sewapuri", ward: "Ward 12" },
  { village: "Korattur", ward: "Ward 8" },
  { village: "Perambur", ward: "Ward 15" },
  { village: "Villivakkam", ward: "Ward 3" },
  { village: "Ayanavaram", ward: "Ward 6" },
  { village: "Otteri", ward: "Ward 21" },
  { village: "Velachery", ward: "Ward 10" },
  { village: "T Nagar", ward: "Ward 5" },
  { village: "Madhavaram", ward: "Ward 18" },
  { village: "Taramani", ward: "Ward 9" },
  { village: "Sholinganallur", ward: "Ward 11" },
  { village: "Gandhi Nagar", ward: "Ward 7" },
  { village: "Thiruvottiyur", ward: "Ward 22" },
  { village: "Tondiarpet", ward: "Ward 14" },
  { village: "Kasimedu", ward: "Ward 16" },
];

const CATEGORIES = [
  "Roads", "Water Supply", "Drainage", "Electricity", "Garbage",
  "Healthcare", "Education", "Housing", "Agriculture", "Sanitation",
  "Environment", "Public Safety",
] as const;

const CAPTIONS: Record<string, string[]> = {
  Roads: [
    "Huge potholes near Korattur market. Multiple vehicles damaged this week. @chennai_corp needs to act immediately.",
    "Road completely washed away in Sewapuri after last night's rain. Children cannot reach school. #ChennaiRoads",
    "Broken footpath on Velachery Main Road forcing pedestrians onto busy traffic. Senior citizens at risk.",
    "Road widening project stalled in Villivakkam for 8 months. No work happening. What happened to the budget?",
    "Newly laid road in Perambur already developing cracks after just 2 months. Substandard materials used.",
    "Approach road to Sholinganallur PHC is unmotorable. Ambulance cannot reach patients. Urgent repair needed.",
    "12 dark stretches on T Nagar 2nd Avenue need immediate streetlight installation. Multiple accidents reported.",
    "Road divider damaged on GST Road near Otteri. Broken concrete blocks scattered on highway.",
    "Speed breakers missing near Korattur school. Vehicles speeding dangerously. Children crossing at risk.",
    "Bus stop approach road in Ayanavaram completely broken. Elderly passengers struggling to board buses.",
  ],
  "Water Supply": [
    "Water has not reached Ward 18 for four days. 200+ families in Madhavaram without drinking water.",
    "Borewells in Sewapuri completely dried up. Women walking 3km daily to fetch water. #WaterCrisis",
    "Major pipeline burst on T Nagar 2nd Avenue. Road flooded. Water supply disrupted for 12 hours.",
    "Municipal water supply contains mud and dirt in Villivakkam. Residents reporting stomach infections.",
    "Water tanker mafia charging ₹500 per day in Korattur slum. No govt intervention despite complaints.",
    "New water connection fees too high for Perambur residents. Over 100 families waiting for months.",
    "Groundwater levels dropped 40ft in Sholinganallur. Borewells running dry across the ward.",
    "RO plant installed in Ayanavaram but non-functional for 3 months. No maintenance done.",
    "Handpumps in Velachery colony dry since summer. Women and children walk long distances.",
    "Lake in Thiruvottiyur completely dry. Farmers facing severe crop loss due to no irrigation.",
  ],
  Drainage: [
    "Open drain in Villivakkam overflowing for 2 weeks. Stench unbearable. Children falling sick from mosquitoes.",
    "Sewage water entering homes in Korattur after every rain. Multiple families affected. #ChennaiRains",
    "Stormwater drain blocked near T Nagar market. Water logging 2 feet deep every rainfall.",
    "Low-lying areas of Sewapuri flooded again. Need permanent drainage solution. Yearly cycle of suffering.",
    "Drain covers stolen in Perambur colony. Open manholes dangerous for children playing at night.",
    "Stagnant water in Velachery breeding mosquitoes. Dengue cases rising in the ward. 12 cases this month.",
    "Sewage treatment plant in Madhavaram non-functional. Untreated waste flowing into canal.",
    "Rainwater harvesting pits in Kasimedu all clogged. Not cleaned since installation 2 years ago.",
    "Drainage alignment wrong in Otteri. Water flows INTO houses instead of out during heavy rain.",
    "Flooding in Gandhi Nagar every monsoon. 500+ families affected. Need proper drainage network.",
  ],
  Electricity: [
    "Transformer exploded during rain in Ayanavaram. No power for 24 hours. 500+ houses affected.",
    "Voltage fluctuation damaging appliances in Korattur. TV, fridge, AC units burning out weekly.",
    "Street lights out in Villivakkam for 10 days. Dark stretches dangerous. Women scared to step out.",
    "Power lines hanging dangerously low near Perambur school. Children at risk of electrocution.",
    "Electric pole leaning at 45 degrees in Velachery after truck hit it. Risk of falling on houses.",
    "Solar streetlights installed in Sewapuri but 70% not working. No maintenance team assigned.",
    "Transformer overloaded in T Nagar. Frequent tripping 10+ times daily during peak summer.",
    "New power connection pending for 6 months in Madhavaram colony. Residents using illegal hookups.",
    "HT line passes dangerously close to houses in Sholinganallur. Residents demand relocation.",
    "Power cuts 4-6 hours daily in Thiruvottiyur. Small businesses suffering huge losses.",
  ],
  Garbage: [
    "Garbage not collected in Korattur for 3 weeks. Piles on every corner. Stray dogs tearing bags.",
    "Plastic waste choking Villivakkam canal. Water flow completely blocked. Mosquito breeding ground.",
    "Garbage dumping ground near Perambur school. Children exposed to toxic waste. Health hazard.",
    "No segregation at source in Sewapuri. Mixed waste makes recycling impossible. @chennai_corp act now!",
    "Burning garbage in Ayanavaram causing severe air pollution. Respiratory issues rising in children.",
    "Dead animals on Velachery road for days. Corporation not responding to multiple complaints.",
    "Community composting started in T Nagar! Residents happy with initiative. Model for other wards.",
    "Biomedical waste mixed with regular garbage in Otteri. Extremely dangerous for sanitation workers.",
    "Construction debris dumped on Kasimedu footpath. Pedestrians forced onto busy road.",
    "Garbage truck skips Madhavaram regularly. Residents blockaded road in protest yesterday.",
  ],
  Healthcare: [
    "PHC in Sewapuri has only 1 doctor for 12,000+ patients. Patients wait 4+ hours for treatment.",
    "Medicine shortage at Perambur health center. Insulin and blood pressure tablets out of stock.",
    "Ambulance took 45 minutes to reach Korattur. Patient's family had to arrange private vehicle.",
    "No female doctor at Villivakkam PHC. Women hesitant to seek treatment. Health indicators declining.",
    "Vaccination drive in Velachery has low turnout due to misinformation campaigns on social media.",
    "Government hospital in T Nagar lacks basic X-ray and diagnostic equipment. Patients sent to private.",
    "Dengue outbreak in Sholinganallur. 40+ cases reported this month. Need immediate fogging.",
    "Maternity wing at Madhavaram PHC closed due to staff shortage. Pregnant women travel 10km.",
    "Mental health services absent in Thiruvottiyur. No counselor available for 50,000+ residents.",
    "Senior citizens health camp held in Otteri. Free checkup for 300+ elderly. Great response!",
  ],
  Education: [
    "Govt school in Korattur has no drinking water. 500+ students suffering in summer heat.",
    "School building in Perambur declared unsafe. No alternative arranged. Classes held under trees.",
    "Anganwadi center in Sewapuri roof leaking. Children sitting in wet classrooms during rains.",
    "Mid-day meal quality poor in Villivakkam school. Children found worms in food last week.",
    "Teacher vacancy in Velachery school: 4 posts unfilled for 8 months. Students without teachers.",
    "New computer lab inaugurated at T Nagar school! Digital education begins for 200 students.",
    "Toilets locked at Madhavaram school due to no water connection. Girls miss classes during periods.",
    "School bus service stopped in Otteri due to road conditions. Children walk 3km daily.",
    "Scholarship amounts not reaching students in Ayanavaram for 5 months. Parents protesting.",
    "Sports day celebrated at Sholinganallur school! Students participated in athletics and games.",
  ],
  Housing: [
    "PM Awas Yojana houses in Perambur have cracks in walls. Construction quality substandard.",
    "Slum dwellers in Sewapuri face eviction. No rehabilitation plan announced. 200 families affected.",
    "Drainage water entering homes in Korattur housing colony. 3rd time this month. No action taken.",
    "New housing project inaugurated in Velachery! 150 families to get affordable homes.",
    "Building plan approval stuck in T Nagar for 10 months. Officials demand bribe for clearance.",
    "Cracks in walls of Madhavaram apartment complex. Structural engineer report needed urgently.",
    "No parks or playgrounds in Ayanavaram housing layout. Children have no safe space to play.",
    "Flooding in low-income housing in Otteri every monsoon. No drainage system installed.",
    "Land encroachment in Thiruvottiyur affecting 50+ families. Court case pending for 3 years.",
    "Rent control violations in Gandhi Nagar. Tenants exploited by landlords. Need regulation.",
  ],
  Agriculture: [
    "Sewapuri lake completely dry. 200+ farmers affected. No irrigation water for Rabi season.",
    "Crop damage due to unseasonal hailstorm in Korattur. Farmers need compensation urgently.",
    "Subsidized seeds not reaching Villivakkam farmers. Stockists selling at double the price.",
    "Free electricity for agriculture in Perambur but transformers keep failing every week.",
    "No cold storage in Ayanavaram. Farmers forced to sell produce at 50% less than MSP.",
    "Pesticide contamination in Sewapuri water. 50 acres of paddy crop damaged from contaminated water.",
    "Milk cooperative in Otteri succeeds! 150+ women dairy farmers benefit from direct procurement.",
    "Groundwater level dropped 30ft in Velachery farmland. Borewells running dry, crops failing.",
    "Farmers training program on organic farming in T Nagar. 80 farmers participated. Good response!",
    "Kisan credit card camp held in Madhavaram. 200+ farmers applied for subsidized loans.",
  ],
  Sanitation: [
    "Public toilets in Korattur market broken and dirty. No cleaning for 15 days. Vendors suffering.",
    "Open defecation still prevalent in Sewapuri despite Swachh Bharat. Need more community toilets.",
    "New toilet block inaugurated at Perambur school! Sanitation improves for 300 girl students.",
    "Sewage treatment plant in Villivakkam running at 40% capacity. Half the machinery broken.",
    "Manual scavenging still practiced in Velachery. Need mechanized cleaning equipment urgently.",
    "Swachh Bharat survey team visits T Nagar. Residents hopeful for action on garbage issues.",
    "Community-led sanitation program in Otteri shows great results! 90% reduction in open defecation.",
    "Public urinals in Ayanavaram bus stand unusable. Commuters resort to open spaces.",
    "Solid waste processing plant in Madhavaram underutilized. Only 30% capacity used.",
    "Model toilet complex inaugurated at Thiruvottiyur market! Clean and well-maintained.",
  ],
  Environment: [
    "Illegal sand mining in Sewapuri riverbed destroying ecosystem. Fishing community affected.",
    "AQI in Korattur industrial area reaches hazardous 320. Factory emissions unchecked.",
    "Tree felling for road widening in Velachery. 50 mature trees cut. Environmentalists protest.",
    "Lake restoration project started in Otteri! Community participation encouraged for cleanup.",
    "Plastic ban violation rampant in T Nagar shops. No action by authorities despite complaints.",
    "Industrial waste dumped in Perambur canal. Fish dying, water contaminated with toxins.",
    "Solar energy initiative in Madhavaram! 100 households installed panels, electricity bills reduced.",
    "Noise pollution from temple loudspeakers in Ayanavaram beyond permissible limits at night.",
    "Vehicle emission testing camp in Villivakkam reveals 40% vehicles non-compliant.",
    "Heritage pond in Thiruvottiyur polluted and encroached. Need restoration before it's too late.",
  ],
  "Public Safety": [
    "Chain snatching incidents rising in Korattur. 5 cases this month. Women scared to go out at night.",
    "Illegal liquor shop near Perambur school. Children exposed to drunkards daily. Close it!",
    "Fire in Sewapuri market. 12 shops destroyed. No fire station within 5km radius.",
    "Stray dog menace in Villivakkam. 18 people bitten this month. Need sterilization drive.",
    "Abandoned building in Velachery used by anti-social elements. Demolish it immediately.",
    "No CCTV cameras in T Nagar market area despite repeated theft incidents. Need surveillance.",
    "Speed limit signs missing on Otteri highway. 3 fatal accidents this year on this stretch.",
    "Pedestrian crossing missing near Ayanavaram school. Children cross 6-lane road riskily.",
    "Police patrolling absent in Madhavaram night hours. Residents organize neighborhood watch.",
    "Street lights out in Thiruvottiyur for 2 weeks. Complete darkness after 8 PM.",
  ],
};

const SEVERITIES = ["Critical", "High", "Medium", "Low"] as const;
const PLATFORMS = ["twitter", "instagram", "facebook", "citizen", "news"] as const;

function pick<T>(arr: readonly T[] | T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rng(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function timeAgo(): string {
  const minutes = rng(5, 2880); // 5 min to 2 days ago
  const d = new Date(Date.now() - minutes * 60 * 1000);
  return d.toISOString();
}

export interface DashboardSocialPost {
  id: string;
  platform: "twitter" | "instagram" | "facebook" | "citizen" | "news";
  authorName: string;
  authorHandle: string;
  authorInitials: string;
  isVerified: boolean;
  timestamp: string;
  image: string;
  caption: string;
  category: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  ward: string;
  village: string;
  likes: number;
  comments: number;
  shares: number;
  sentiment: "positive" | "negative" | "neutral" | "mixed";
  views: number;
  urgencyScore: number;
  aiConfidence: number;
  department: string;
  populationImpact: number;
}

function generatePost(index: number): DashboardSocialPost {
  const category = pick(CATEGORIES);
  const author = pick(AUTHORS);
  const location = pick(VILLAGES);
  const captions = CAPTIONS[category] || CAPTIONS["Roads"];
  const caption = pick(captions);
  const images = IMAGE_MAP[category] || IMAGE_MAP["Roads"];
  const image = pick(images);
  const severity = pick(SEVERITIES);
  const platform = author.platform;
  const isVerified = Math.random() > 0.4;

  const likes = severity === "Critical" ? rng(500, 15000) : rng(50, 3000);
  const comments = Math.round(likes * rng(5, 25) / 100);
  const shares = Math.round(likes * rng(8, 35) / 100);

  const sentiments = ["positive", "negative", "neutral", "mixed"] as const;
  const views = severity === "Critical" ? rng(50000, 500000) : rng(2000, 50000);

  const departmentMap: Record<string, string> = {
    Roads: "Roads & Infrastructure",
    "Water Supply": "Water Supply Dept",
    Drainage: "Sanitation Dept",
    Electricity: "Electricity Board",
    Garbage: "Solid Waste Mgmt",
    Healthcare: "Health Dept",
    Education: "Education Dept",
    Housing: "Housing Dept",
    Agriculture: "Agriculture Dept",
    Sanitation: "Sanitation Dept",
    Environment: "Environment Dept",
    "Public Safety": "Public Safety Dept",
  };

  return {
    id: `dash-feed-${String(index).padStart(3, "0")}`,
    platform,
    authorName: author.name,
    authorHandle: author.handle,
    authorInitials: author.initials,
    isVerified,
    timestamp: timeAgo(),
    image,
    caption,
    category,
    severity,
    ward: location.ward,
    village: location.village,
    likes,
    comments,
    shares,
    views,
    sentiment: pick(sentiments),
    urgencyScore: severity === "Critical" ? rng(85, 98) : severity === "High" ? rng(65, 85) : severity === "Medium" ? rng(40, 65) : rng(15, 40),
    aiConfidence: rng(75, 99),
    department: departmentMap[category] || "General Administration",
    populationImpact: severity === "Critical" ? rng(5000, 50000) : rng(500, 5000),
  };
}

// ─── Generate 30 posts with a stable seed ───
// Use a seeded pseudo-random approach for reproducibility
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const posts: DashboardSocialPost[] = [];

// Temporarily override Math.random with seeded version
const origRandom = Math.random;
const rand = seededRandom(42);
Math.random = rand;

for (let i = 0; i < 36; i++) {
  posts.push(generatePost(i));
}

Math.random = origRandom;

export function getDashboardFeed(): DashboardSocialPost[] {
  return posts;
}
