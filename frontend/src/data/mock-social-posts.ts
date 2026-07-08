import type {
  SocialPost, NewsArticle, SocialIntelligenceKPIs, TrendingTopic,
  TrendingWard, HourlyActivity, PlatformDistribution, SocialIntelligenceResponse,
  TopComplaint, SeverityLevel, SentimentType,
} from "@/types/social"
import { pickImagesForCategory, buildImageUrl } from "@/data/social-media-images"
import { getConstituencyData } from "@/data/mock-constituency-data"

// ============================================================
// CONSTITUENCY-AWARE MOCK DATA GENERATOR
// Uses real images from public/social-media/
// When the constituency changes, posts use that constituency's
// villages, wards, and priority issues.
// ============================================================

// Default fallback ward data for when constituency data isn't available
const fallbackWardData = [
  { ward: "Ward 12", village: "Sewapuri", lat: 13.115, lng: 80.275 },
  { ward: "Ward 8", village: "Korattur", lat: 13.130, lng: 80.290 },
  { ward: "Ward 15", village: "Perambur", lat: 13.118, lng: 80.265 },
  { ward: "Ward 3", village: "Villivakkam", lat: 13.140, lng: 80.305 },
  { ward: "Ward 6", village: "Ayanavaram", lat: 13.125, lng: 80.295 },
  { ward: "Ward 21", village: "Otteri", lat: 13.108, lng: 80.278 },
  { ward: "Ward 18", village: "Madhavaram", lat: 13.155, lng: 80.310 },
  { ward: "Ward 22", village: "Thiruvottiyur", lat: 13.165, lng: 80.300 },
  { ward: "Ward 14", village: "Tondiarpet", lat: 13.148, lng: 80.285 },
  { ward: "Ward 10", village: "Kasimedu", lat: 13.138, lng: 80.295 },
  { ward: "Ward 7", village: "Kodungaiyur", lat: 13.142, lng: 80.272 },
  { ward: "Ward 19", village: "Royapuram", lat: 13.110, lng: 80.282 },
  { ward: "Ward 5", village: "Sholinghur", lat: 13.120, lng: 80.305 },
  { ward: "Ward 16", village: "Vyasarpadi", lat: 13.128, lng: 80.268 },
  { ward: "Ward 2", village: "Ennore", lat: 13.170, lng: 80.280 },
  { ward: "Ward 1", village: "Mannady", lat: 13.135, lng: 80.288 },
  { ward: "Ward 9", village: "Washermanpet", lat: 13.132, lng: 80.292 },
  { ward: "Ward 13", village: "George Town", lat: 13.122, lng: 80.278 },
  { ward: "Ward 4", village: "Purasawalkam", lat: 13.145, lng: 80.298 },
  { ward: "Ward 11", village: "Chintadripet", lat: 13.128, lng: 80.285 },
]

const platforms: Array<{ key: "twitter"|"instagram"|"facebook"|"youtube"|"citizen"|"news"; weight: number }> = [
  { key: "twitter", weight: 28 },
  { key: "instagram", weight: 22 },
  { key: "facebook", weight: 18 },
  { key: "youtube", weight: 8 },
  { key: "citizen", weight: 16 },
  { key: "news", weight: 8 },
]

const categories: Array<{ key: string; weight: number }> = [
  { key: "Roads", weight: 16 },
  { key: "Water Supply", weight: 16 },
  { key: "Drainage", weight: 13 },
  { key: "Electricity", weight: 11 },
  { key: "Garbage", weight: 11 },
  { key: "Healthcare", weight: 9 },
  { key: "Public Safety", weight: 7 },
  { key: "Education", weight: 6 },
  { key: "Housing", weight: 4 },
  { key: "Agriculture", weight: 3 },
  { key: "Environment", weight: 2 },
  { key: "Sanitation", weight: 2 },
]

const authors = [
  { name: "Rajesh Kannan", handle: "@rajeshkannan", avatar: "RK", verified: true },
  { name: "Priya Sharma", handle: "@priyas_chn", avatar: "PS", verified: false },
  { name: "Chennai Lens", handle: "@chennailens", avatar: "CL", verified: true },
  { name: "Villivakkam RW", handle: "@villivakkam_rw", avatar: "VR", verified: true },
  { name: "Citizen Reporter TN", handle: "@citizenrep_tn", avatar: "CR", verified: true },
  { name: "Lakshmi Devi", handle: "@lakshmi_app", avatar: "LD", verified: false },
  { name: "Times of Chennai", handle: "@timeschennai", avatar: "TC", verified: true },
  { name: "TN Politics Today", handle: "@tnptoday", avatar: "TP", verified: true },
  { name: "Chennai Residents Forum", handle: "@chnforum", avatar: "CF", verified: true },
  { name: "Dr. Senthil Kumar", handle: "@drsenthil", avatar: "SK", verified: true },
  { name: "North Chennai Express", handle: "@northchennai", avatar: "NC", verified: true },
  { name: "Anita R", handle: "@anita_app", avatar: "AR", verified: false },
  { name: "Kumar Vasudevan", handle: "@kumar_chn", avatar: "KV", verified: false },
  { name: "Kasimedu Fishers", handle: "@kasimedu_fish", avatar: "KF", verified: true },
  { name: "Local News TN", handle: "@localnewstn", avatar: "LN", verified: true },
  { name: "Murugan K", handle: "@murugan_app", avatar: "MK", verified: false },
  { name: "Water Watch Chennai", handle: "@waterwatch_chn", avatar: "WW", verified: true },
  { name: "Road Safety TN", handle: "@roadsafety_tn", avatar: "RS", verified: true },
  { name: "North Chennai Forum", handle: "@ncf_chn", avatar: "NF", verified: true },
  { name: "Auto Union Chennai", handle: "@autounion_chn", avatar: "AU", verified: false },
  { name: "Teachers Assoc TN", handle: "@teachers_tn", avatar: "TA", verified: true },
  { name: "Green Chennai", handle: "@greenchn", avatar: "GC", verified: true },
  { name: "Youth for Change", handle: "@youth4change", avatar: "YC", verified: false },
  { name: "Senior Citizens Forum", handle: "@seniors_chn", avatar: "SC", verified: true },
  { name: "Traffic Police", handle: "@chn_traffic", avatar: "TP2", verified: true },
  { name: "Ward 12 Officer", handle: "@ward12_officer", avatar: "WO", verified: true },
  { name: "Public Health Alliance", handle: "@pha_chn", avatar: "PH", verified: true },
  { name: "Chennai Corp", handle: "@chennai_corp", avatar: "CC", verified: true },
  { name: "Ramesh Kumar", handle: "@ramesh_app", avatar: "RK2", verified: false },
  { name: "Geetha R", handle: "@geetha_chn", avatar: "GR", verified: false },
  { name: "Muthu Pandian", handle: "@muthu_app", avatar: "MP", verified: false },
  { name: "Sundari Amma", handle: "@sundari_chn", avatar: "SA", verified: true },
  { name: "DT Next", handle: "@dtnext", avatar: "DN", verified: true },
  { name: "The Hindu", handle: "@the_hindu", avatar: "TH", verified: true },
  { name: "Indian Express", handle: "@indianexpress", avatar: "IE", verified: true },
]

function weightedPick<T extends { weight: number }>(items: T[]): T {
  const total = items.reduce((s, i) => s + i.weight, 0)
  let r = Math.random() * total
  for (const item of items) {
    r -= item.weight
    if (r <= 0) return item
  }
  return items[items.length - 1]
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function rng(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function weightedRandom(avg: number, variance: number): number {
  return Math.max(0, Math.round(avg + (Math.random() - 0.5) * variance * 2))
}

// ---- Post Templates (realistic complaint text) ----
const postTemplates: Record<string, string[]> = {
  Roads: [
    "Huge potholes near {village} main road. Multiple accidents this week. @chennai_corp fix this urgently!",
    "Road repair started on {ward} stretch. 2km completed, {affected}km still pending.",
    "Broken road in {village} for 6 months. No repairs done. School children struggle daily.",
    "New road in {ward} already damaged after 3 months. Substandard construction quality.",
    "Footpath encroachment forcing pedestrians onto busy {village} road. Accident waiting to happen.",
    "Speed breakers missing near {village} school. Vehicles speeding dangerously.",
    "Road widening project stalled in {ward}. Compensation disputes with residents.",
    "Cattle on {village} highway causing accidents at night. Need fencing urgently.",
    "Road diversion poorly marked near {ward}. Commuters facing long traffic jams.",
    "{affected}+ families in {ward} cut off due to damaged bridge access road.",
  ],
  "Water Supply": [
    "Water has not reached {ward} for three days. Tankers come once for {affected}+ families.",
    "Water crisis worsening in {village}. Groundwater levels hit record low this summer.",
    "Major pipeline burst on {village} main road. Several localities flooded.",
    "Borewell recharge project started in {ward}. Expected to help {affected}+ families.",
    "Municipal water contains mud and dirt in {village}. Residents falling sick.",
    "Water tanker charging {affected}Rs per day in {ward}. No government intervention.",
    "Dam in {village} completely dry. Farmers face severe crop loss.",
    "RO plant installed in {ward} but non-functional for 2 months. No maintenance.",
    "Handpumps in {village} dry since summer. Women walk 2km daily for water.",
    "New water connection fees too high for {ward} slum residents.",
  ],
  Drainage: [
    "Open drain in {ward} overflowing for {affected} days now. Children falling sick with fever.",
    "Sewage water entering homes in {village} after every rain. Multiple families affected.",
    "Stormwater drain blocked near {ward} market. Water logging 3 feet during rainfall.",
    "Drainage construction finally started in {village} after years of complaints.",
    "Stagnant water in {ward} breeding mosquitoes. Dengue cases rising in the area.",
    "Drain covers stolen in {village}. Open manholes very dangerous at night.",
    "Sewage treatment plant in {ward} non-functional. Untreated waste flowing into river.",
    "Rainwater harvesting pits clogged in {village}. No cleaning since installation.",
    "Drainage alignment wrong in {ward}. Water flows into houses instead of out.",
    "Low-lying {village} floods every monsoon. Need permanent drainage solution.",
  ],
  Electricity: [
    "Transformer exploded during rain in {village}. No power for {affected} hours.",
    "Frequent power cuts in {ward} - {affected} hours daily. Businesses suffering huge losses.",
    "Illegal electrical connections near {village} market. Fire hazard for the whole area.",
    "Voltage fluctuation damaging appliances in {ward}. Many complaints filed this month.",
    "New power connection pending for {affected} months in {village}. Bribes demanded.",
    "Street lights out in {ward} for a week. Dark stretches very dangerous at night.",
    "Solar street lights installed in {village} but most are not working.",
    "Power line hanging low near school in {ward}. Children at serious risk.",
    "Transformer overloaded in {village}. Frequent tripping during peak hours.",
    "Electric pole leaning dangerously in {ward} after truck hit it last week.",
  ],
  Garbage: [
    "Garbage dump in {village} growing for weeks without collection. @chennai_corp act now!",
    "Ward {ward} park has become a garbage dumping ground. Children cannot play anymore.",
    "Plastic waste choking {village} canal. Water flow blocked. Mosquitoes breeding everywhere.",
    "Corporation garbage truck skips {ward} regularly. Waste piles up on streets.",
    "No segregation at source in {village}. Mixed waste makes recycling impossible.",
    "Dead animals on {ward} road for days. Corporation not responding to calls.",
    "Garbage burning in {village} causing severe air pollution. Health hazard for residents.",
    "Construction debris dumped on {ward} footpath. Pedestrians forced onto busy road.",
    "Biomedical waste mixed with regular garbage in {village}. Very dangerous.",
    "Community composting started in {ward}! Residents happy with the initiative.",
  ],
  Healthcare: [
    "PHC in {village} has only 1 doctor for {affected}+ patients. Healthcare crisis needs attention.",
    "Medicine shortage at {ward} health centre. Insulin out of stock for 3 days.",
    "Ambulance took 45 minutes to reach {village}. Patient condition was critical.",
    "New health camp opened in {ward}! Free checkup for senior citizens and children.",
    "No lady doctor at {village} PHC. Women hesitate to seek medical treatment.",
    "Vaccination drive in {ward} has low turnout due to misinformation campaigns.",
    "Hospital in {village} lacks basic diagnostic equipment. Patients referred to city.",
    "Mental health services absent in {ward}. No counselor or psychologist available.",
    "Dengue outbreak in {village}. {affected}+ cases reported. Need immediate fogging.",
    "Maternity wing at {ward} health centre closed due to staff shortage for months.",
  ],
  "Public Safety": [
    "Residents block road in {village} demanding streetlights after {affected} night accidents.",
    "Illegal alcohol shop operating near school in {ward}. Children exposed daily.",
    "Fire at {village} market. {affected} shops destroyed. No fire station nearby.",
    "Chain snatching incidents rising in {ward}. Women scared to go out at night.",
    "Abandoned building in {village} used by anti-social elements. Demolish it immediately!",
    "No CCTV cameras in {ward} market area. Thefts increasing every week.",
    "Stray dog menace in {village}. {affected} people bitten this month alone.",
    "Speed limit sign missing on {ward} highway. Accidents becoming very frequent.",
    "Pedestrian crossing missing near {village} school. Children cross risky road daily.",
    "Police patrolling absent in {ward} during night hours. Residents feel unsafe.",
  ],
  Education: [
    "Government school in {ward} has no drinking water. {affected} students suffer every day.",
    "Anganwadi centre in {village} roof leaking badly. Children sit in wet classrooms.",
    "School building declared unsafe in {ward} months ago. No alternative arranged yet.",
    "New computer lab inaugurated at {village} school! Digital education begins for students.",
    "Teacher vacancies in {ward} school: {affected} posts unfilled for many months.",
    "Mid-day meal quality poor in {village} school. Children often fall sick.",
    "Toilets locked at {ward} school due to no water supply. Girls miss classes.",
    "School bus service stopped in {village} due to dangerous road conditions.",
    "Scholarship amounts not reaching students in {ward}. {affected} months pending.",
    "Sports facilities absent in {village} school. Ground used for garbage dumping.",
  ],
  Housing: [
    "Housing board flats in {ward} leaking during rains. Construction quality very poor.",
    "Slum dwellers in {village} face eviction. No rehabilitation plan announced yet.",
    "Drainage water entering homes in {ward} housing colony. Repeated issue every year.",
    "New housing project inaugurated in {village}! {affected} families to benefit finally.",
    "Building plan approval stuck in {ward} for months. Officials demanding bribe.",
    "Rent control violations in {village}. Tenants exploited by landlords regularly.",
    "Cracks in walls of {ward} apartment complex. Structural integrity at serious risk.",
    "No parks or playgrounds in {village} housing layout. Children have no safe space.",
    "Flooding in {ward} low-income housing every monsoon. No drainage system at all.",
    "Patta and chitta issues in {village}. {affected}+ families lack property documents.",
  ],
  Agriculture: [
    "Village lake in {village} completely dry. {affected}+ farmers affected by irrigation crisis.",
    "Crop damage due to hailstorm in {ward} area. Farmers need compensation urgently.",
    "Illegal sand mining near {village} farmland. Soil erosion threatening crops severely.",
    "Subsidy seeds not reaching {ward} farmers. Stockists selling at high prices.",
    "Free electricity for agriculture in {village} but transformers keep failing.",
    "No cold storage in {ward}. Farmers forced to sell produce at very low rates.",
    "Pesticide contamination in {village} water. {affected} acres of crop damaged.",
    "Farmer training program in {ward} on organic farming. Excellent response from community!",
    "Groundwater level dropped {affected} feet in {village}. Borewells running dry.",
    "Milk cooperative in {ward} succeeds. {affected}+ women dairy farmers benefit greatly.",
  ],
  Environment: [
    "Fishing boats damaged by illegal sand mining near {village} coast. Livelihoods affected.",
    "AQI in {ward} reaches hazardous levels. Industrial emissions completely unchecked.",
    "Mangrove destruction for construction in {village}. Coastal erosion accelerating fast.",
    "Lake restoration project started in {ward}! Community participation strongly encouraged.",
    "Tree felling in {village} for road widening. {affected} trees cut down already.",
    "Plastic ban violation in {ward} shops. No action by authorities despite complaints.",
    "Industrial waste dumped in {village} river. Fish dying, water contaminated severely.",
    "Solar energy initiative in {ward}. {affected} households installed panels this month!",
    "Noise pollution from temple in {village} beyond permissible limits at night.",
    "Vehicle emission testing in {ward} reveals {affected}% vehicles non-compliant.",
  ],
  Sanitation: [
    "Overflowing drains in {ward}. Stench completely unbearable. Keeping windows shut always.",
    "No public toilets in {village} market area. {affected}+ daily vendors badly affected.",
    "Open defecation still prevalent in {ward}. Need more community toilets urgently.",
    "New toilet block inaugurated in {village} school! Sanitation improves for students.",
    "Sewage treatment plant in {ward} non-functional for months. River pollution continues.",
    "Public urinals in {village} broken and dirty. No cleaning for weeks together.",
    "Solid waste processing plant in {ward} running at only {affected}% capacity.",
    "Manual scavenging still practiced in {village}. Need mechanised cleaning immediately.",
    "Swachh Bharat survey team visits {ward}. Residents hopeful for real action.",
    "Community-led total sanitation program in {village} shows great results! Proud moment.",
  ],
}

const severityMap: Record<string, SeverityLevel[]> = {
  Roads: ["Critical", "High", "Medium", "Low"],
  "Water Supply": ["Critical", "Critical", "High", "Medium"],
  Drainage: ["Critical", "High", "Medium", "Medium"],
  Electricity: ["Critical", "High", "Medium", "Low"],
  Garbage: ["Medium", "Medium", "Low", "Low"],
  Healthcare: ["Critical", "High", "High", "Medium"],
  "Public Safety": ["Critical", "High", "Medium", "Low"],
  Education: ["High", "High", "Medium", "Medium"],
  Housing: ["High", "Medium", "Medium", "Low"],
  Agriculture: ["High", "Medium", "Medium", "Low"],
  Environment: ["High", "Medium", "Low", "Low"],
  Sanitation: ["High", "Medium", "Low", "Low"],
}

const departmentMap: Record<string, string> = {
  Roads: "Roads & Infrastructure Department",
  "Water Supply": "Water Supply Department",
  Drainage: "Sanitation Department",
  Electricity: "Electricity Board (TNEB)",
  Garbage: "Solid Waste Management",
  Healthcare: "Health Department",
  "Public Safety": "Public Safety Department",
  Education: "Education Department",
  Housing: "Housing Department",
  Agriculture: "Agriculture Department",
  Environment: "Environment Department",
  Sanitation: "Sanitation Department",
}

const sentimentOptions: SentimentType[] = ["positive", "negative", "neutral", "mixed"]

const hashtagMap: Record<string, string[]> = {
  Roads: ["#RoadSafety", "#PotholeAlert", "#ChennaiRoads", "#RoadRepair", "#Infrastructure"],
  "Water Supply": ["#WaterCrisis", "#ChennaiWater", "#SaveWater", "#WaterShortage", "#NorthChennai"],
  Drainage: ["#Drainage", "#Flooding", "#ChennaiRains", "#Sanitation", "#WaterLogging"],
  Electricity: ["#PowerCrisis", "#Blackout", "#Electricity", "#PowerCut", "#TNEB"],
  Garbage: ["#CleanChennai", "#GarbageFree", "#WasteManagement", "#SwachhBharat", "#Pollution"],
  Healthcare: ["#Healthcare", "#HealthCrisis", "#PHC", "#HealthForAll", "#ChennaiHealth"],
  "Public Safety": ["#PublicSafety", "#StreetLights", "#SafetyFirst", "#CrimePrevention", "#ChennaiSafety"],
  Education: ["#Education", "#SchoolDevelopment", "#RightToEducation", "#GovtSchool", "#ChennaiEducation"],
  Housing: ["#Housing", "#AffordableHousing", "#SlumDevelopment", "#HousingCrisis", "#PMAY"],
  Agriculture: ["#Farmers", "#Agriculture", "#DroughtRelief", "#FarmerSupport", "#Kisan"],
  Environment: ["#Environment", "#SaveEnvironment", "#GreenChennai", "#ClimateAction", "#PollutionFree"],
  Sanitation: ["#Sanitation", "#CleanCity", "#OpenDrains", "#Hygiene", "#SwachhChennai"],
}

const rootCauseOptions: Record<string, string[]> = {
  Roads: ["Poor asphalt quality", "Lack of regular maintenance", "Heavy vehicle overload", "Water damage to base layer", "Substandard construction materials"],
  "Water Supply": ["Depleted groundwater levels", "Aging pipeline infrastructure", "Insufficient tanker capacity", "Reservoir levels low", "Distribution network loss"],
  Drainage: ["Blocked sewer lines", "Inadequate stormwater network", "Poor drainage design", "Silt accumulation over years", "Lack of regular maintenance"],
  Electricity: ["Transformer overload", "Aging power infrastructure", "Theft and vandalism", "Tree contact during storms", "Weather damage to lines"],
  Garbage: ["Irregular collection schedule", "No segregation at source", "Lack of community bins", "Public apathy towards cleanliness", "Understaffed sanitation team"],
  Healthcare: ["Staff shortage", "Budget constraints", "Poor infrastructure", "Medicine supply chain gap", "Low health awareness"],
  "Public Safety": ["Poor street lighting", "Inadequate police patrolling", "Urban design flaws", "Lack of CCTV surveillance", "No community patrol program"],
  Education: ["Infrastructure gap", "Teacher shortage", "Budget underutilization", "Poor supervision", "Lack of accountability"],
  Housing: ["Poor construction quality", "Land ownership disputes", "Planning violations", "Fund diversion", "Substandard materials used"],
  Agriculture: ["Water scarcity", "Soil degradation", "Lack of cold storage", "Poor market access", "Subsidy disbursement delay"],
  Environment: ["Industrial pollution", "Urbanization pressure", "Lack of regulation enforcement", "Public behaviour", "Waste mismanagement"],
  Sanitation: ["Behavioural issues", "Infrastructure gap", "Maintenance neglect", "Population pressure", "Lack of awareness"],
}

const actionMap: Record<string, string[]> = {
  Roads: ["Deploy emergency road repair team immediately", "Survey and patch all potholes within 48 hours", "Initiate road widening project", "Install speed breakers near schools"],
  "Water Supply": ["Deploy additional water tankers today", "Initiate borewell recharge program this week", "Repair pipeline immediately", "Install new handpumps in affected areas"],
  Drainage: ["Deploy sewage cleaning crew today", "Clear all stormwater drains within 48 hours", "Construct new drainage line", "Fix drain covers immediately"],
  Electricity: ["Replace transformer immediately", "Install voltage stabilizers", "Conduct power line audit", "Deploy mobile repair team"],
  Garbage: ["Schedule daily garbage collection", "Install community waste bins", "Launch cleanliness drive", "Deploy extra collection trucks"],
  Healthcare: ["Deploy additional medical staff", "Restock essential medicines today", "Open mobile health camp", "Arrange specialist visit"],
  "Public Safety": ["Install streetlights immediately", "Deploy police patrols at night", "Install CCTV cameras at hotspots", "Conduct community safety meeting"],
  Education: ["Arrange drinking water facility", "Repair school building roof", "Fill teacher vacancies urgently", "Provide school bus alternative"],
  Housing: ["Inspect building quality immediately", "Arrange rehabilitation plan", "Process patta applications", "Demolish unsafe structures"],
  Agriculture: ["Restore lake and water bodies", "Process crop damage compensation", "Distribute quality seeds", "Arrange cold storage facility"],
  Environment: ["Conduct environmental audit", "Stop illegal construction", "Launch tree plantation drive", "Install air quality monitors"],
  Sanitation: ["Clean all public toilets", "Repair sewage treatment plant", "Launch sanitation awareness campaign", "Install community toilet blocks"],
}

const officerNames = [
  "Executive Engineer", "Zonal Officer", "Health Inspector",
  "Junior Engineer", "Assistant Commissioner", "Municipal Commissioner",
  "Chief Engineer", "District Collector", "Tahsildar", "Block Development Officer",
]

/** Get ward/village data for a constituency — uses its villages + nearby fallback */
function getWardDataForConstituency(constituencyName?: string): Array<{ ward: string; village: string; lat: number; lng: number }> {
  if (!constituencyName) return fallbackWardData
  const data = getConstituencyData(constituencyName)
  if (!data || !data.villages || data.villages.length === 0) return fallbackWardData

  // Use the constituency's own villages as primary locations
  return data.villages.map((v) => ({
    ward: v.ward,
    village: v.name,
    lat: v.lat,
    lng: v.lng,
  }))
}

/** Get priority issues for a constituency to use as post content */
function getPrioritiesForConstituency(constituencyName?: string): Array<{ issue: string; department: string; village: string; ward: string; urgency: number }> {
  if (!constituencyName) return []
  const data = getConstituencyData(constituencyName)
  if (!data || !data.priorities) return []
  return data.priorities.map((p) => ({
    issue: p.issue,
    department: p.department,
    village: p.village,
    ward: p.ward,
    urgency: p.urgency,
  }))
}

function generatePost(index: number, wardLocations?: Array<{ ward: string; village: string; lat: number; lng: number }>, priorities?: Array<{ issue: string; department: string; village: string; ward: string; urgency: number }>): SocialPost {
  const wardPool = wardLocations || fallbackWardData
  const plat = weightedPick(platforms).key
  const cat = weightedPick(categories).key as any
  const author = pick(authors)

  // Try to use a priority issue for the post content
  let loc: { ward: string; village: string; lat: number; lng: number }
  let caption: string
  let matchedPriority: { issue: string; department: string; village: string; ward: string; urgency: number } | undefined

  // 40% chance to use a priority issue for realistic content
  if (priorities && priorities.length > 0 && Math.random() < 0.4) {
    matchedPriority = pick(priorities)
    loc = wardPool.find((w) => w.village === matchedPriority!.village) || pick(wardPool)
    caption = matchedPriority.issue
  } else {
    loc = pick(wardPool)
    const template = pick(postTemplates[cat] || postTemplates.Roads)
    const affected = weightedRandom(500, 450)
    caption = template
      .replace(/{ward}/g, loc.ward)
      .replace(/{village}/g, loc.village)
      .replace(/{affected}/g, String(affected))
  }

  const hoursAgo = rng(0, 72)
  const timestamp = new Date(Date.now() - hoursAgo * 3600000 - rng(0, 3600000)).toISOString()

  const sev = pick(severityMap[cat] || ["Medium"]) as SeverityLevel
  const sentiment = pick(sentimentOptions)
  const likes = sev === "Critical" ? rng(800, 18000) : rng(40, 3500)
  const comments = Math.round(likes * rng(5, 30) / 100)
  const shares = Math.round(likes * rng(8, 45) / 100)
  const views = sev === "Critical" ? rng(40000, 500000) : rng(1500, 60000)
  const confidence = rng(72, 99)
  const priorityScore = sev === "Critical" ? rng(82, 98) : sev === "High" ? rng(60, 85) : sev === "Medium" ? rng(35, 65) : rng(15, 40)
  const urgencyScore = matchedPriority ? matchedPriority.urgency : (sev === "Critical" ? rng(82, 98) : sev === "High" ? rng(60, 88) : sev === "Medium" ? rng(30, 65) : rng(10, 35))
  const dept = matchedPriority ? matchedPriority.department : (departmentMap[cat] || "General Administration")

  const hashtags = pick(hashtagMap[cat] || ["#Chennai"]).split(",").slice(0, rng(2, 4))

  // Use real images from public/social-media/
  const hasVideo = plat === "youtube" || (plat === "facebook" && Math.random() > 0.6)
  const imageCount = rng(1, 3)
  const images = pickImagesForCategory(cat, imageCount)
  const mediaItems = images.map((img, mi) => {
    if (hasVideo && mi === 0) {
      return {
        id: `m${index}-${mi}`,
        type: "video" as const,
        url: img.url,
        thumbnailUrl: img.url,
        duration: rng(30, 600),
        alt: img.alt,
      }
    }
    return {
      id: `m${index}-${mi}`,
      type: "image" as const,
      url: img.url,
      thumbnailUrl: img.url,
      width: 800,
      height: 600,
      alt: img.alt,
    }
  })

  const affectedCount = weightedRandom(500, 450)

  return {
    id: `sp-${String(index).padStart(4, "0")}`,
    platform: plat,
    authorName: author.name,
    authorUsername: author.handle,
    authorAvatar: author.avatar,
    isVerified: author.verified,
    timestamp,
    text: caption,
    hashtags,
    mentions: [pick(authors).handle],
    geoLocation: {
      lat: loc.lat,
      lng: loc.lng,
      ward: loc.ward,
      village: loc.village,
    },
    category: cat,
    severity: sev,
    sentiment,
    likes,
    comments,
    shares,
    views,
    media: mediaItems,
    originalUrl: plat === "twitter" ? `https://x.com/${author.handle}/status/${index}` :
                 plat === "instagram" ? `https://instagram.com/p/${index}/` :
                 plat === "facebook" ? `https://facebook.com/post/${index}` :
                 plat === "youtube" ? `https://youtube.com/watch?v=${index}` : "",
    ai: {
      category: cat,
      severity: sev,
      confidence,
      duplicateScore: rng(0, 35),
      fakeNewsProbability: rng(0, 8),
      department: dept,
      priorityScore,
      urgencyScore,
      suggestedAction: pick(actionMap[cat] || ["Conduct site inspection"]),
      estimatedImpact: `${cat} issue affecting ${affectedCount} people in ${loc.village}, ${loc.ward}`,
      estimatedAffected: affectedCount,
      estimatedBudget: sev === "Critical" ? `₹${rng(10, 50)}L` : sev === "High" ? `₹${rng(3, 15)}L` : `₹${rng(50, 200)}K`,
      estimatedResolution: sev === "Critical" ? "24-48 hours" : sev === "High" ? "3-7 days" : "2-4 weeks",
      responsibleOfficer: pick(officerNames),
      rootCause: pick(rootCauseOptions[cat] || ["Infrastructure failure"]),
      aiSummary: `${sev} ${cat} issue in ${loc.village}, ${loc.ward}. ${affectedCount.toLocaleString()} people affected. ${confidence}% AI confidence. ${sentiment === "negative" ? "Urgent action required." : sentiment === "positive" ? "Positive community response." : "Monitoring situation."}`,
    },
    isFakeNews: Math.random() > 0.97,
    communityImpact: sev === "Critical" ? "Widespread area severely affected" : sev === "High" ? "Moderate community impact" : "Localized issue, minimal spread",
    trend: sev === "Critical" ? "Rapidly escalating" : "Stable",
    duplicateCount: rng(0, 8),
  }
}

/**
 * Generate posts for a specific constituency.
 * Uses the constituency's villages and priority issues to create realistic, location-aware posts.
 * When no constituency is specified, falls back to the default Chennai data.
 */
export function generateConstituencyPosts(constituencyName?: string, count = 100): SocialPost[] {
  const wardLocations = getWardDataForConstituency(constituencyName)
  const priorities = getPrioritiesForConstituency(constituencyName)
  return Array.from({ length: count }, (_, i) => generatePost(i, wardLocations, priorities))
}

// ---- News Articles ----
const newsArticles: NewsArticle[] = [
  {
    id: "na-001", source: "The Hindu", sourceLogo: "TH",
    headline: "North Chennai water crisis deepens as groundwater levels hit record low",
    summary: "Residents stage protests across 5 villages demanding immediate water supply. Corporation announces special tanker deployment but residents say it's insufficient.",
    url: "https://thehindu.com/news/chennai/1", publishedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    author: "R. Suryanarayanan", category: "Water Supply",
    location: { ward: "Ward 12", village: "Sewapuri", city: "Chennai" },
    severity: "Critical", sentiment: "negative",
    imageUrl: buildImageUrl("water supply and leakage", "Screenshot 2026-07-08 141221.png"),
    thumbnailUrl: buildImageUrl("water supply and leakage", "Screenshot 2026-07-08 141221.png"),
  },
  {
    id: "na-002", source: "Indian Express", sourceLogo: "IE",
    headline: "Chennai sanitation crisis: 60% wards report overflowing drains",
    summary: "Expert committee recommends comprehensive overhaul costing ₹200 crore. Civic body admits to lack of maintenance staff and equipment.",
    url: "https://indianexpress.com/article/cities/chennai/1", publishedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    author: "M. Rajendran", category: "Drainage",
    location: { ward: "Ward 3", village: "Villivakkam", city: "Chennai" },
    severity: "Critical", sentiment: "negative",
    imageUrl: buildImageUrl("drainage and flooding", "Screenshot 2026-07-08 141030.png"),
    thumbnailUrl: buildImageUrl("drainage and flooding", "Screenshot 2026-07-08 141030.png"),
  },
  {
    id: "na-003", source: "Times of India", sourceLogo: "TOI",
    headline: "Power crisis: Ayanavaram residents protest 72-hour blackout",
    summary: "Transformer blast leaves entire ward without electricity. Residents block roads demanding immediate restoration.",
    url: "https://timesofindia.com/chennai/1", publishedAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    author: "K. Sridhar", category: "Electricity",
    location: { ward: "Ward 6", village: "Ayanavaram", city: "Chennai" },
    severity: "Critical", sentiment: "negative",
    imageUrl: buildImageUrl("electricity", "Screenshot 2026-07-08 141125.png"),
    thumbnailUrl: buildImageUrl("electricity", "Screenshot 2026-07-08 141125.png"),
  },
  {
    id: "na-004", source: "DT Next", sourceLogo: "DN",
    headline: "Illegal sand mining threatens Kasimedu fishing community",
    summary: "15 fishing boats damaged. Fishermen association files complaint with coastal authorities. Environmental activists demand action.",
    url: "https://dtnext.com/chennai/1", publishedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    author: "S. Vasanth", category: "Environment",
    location: { ward: "Ward 10", village: "Kasimedu", city: "Chennai" },
    severity: "High", sentiment: "negative",
    imageUrl: buildImageUrl("sanitation", "Screenshot 2026-07-08 141257.png"),
    thumbnailUrl: buildImageUrl("sanitation", "Screenshot 2026-07-08 141257.png"),
  },
  {
    id: "na-005", source: "The News Minute", sourceLogo: "NM",
    headline: "Tondiarpet residents block road after 3 accidents in a month",
    summary: "Demand immediate installation of streetlights on 12 dark stretches. Police register FIR after protest turns intense.",
    url: "https://thenewsminute.com/chennai/1", publishedAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    author: "L. Priyadarshini", category: "Public Safety",
    location: { ward: "Ward 14", village: "Tondiarpet", city: "Chennai" },
    severity: "Critical", sentiment: "negative",
    imageUrl: buildImageUrl("roads", "Screenshot 2026-07-08 140715.png"),
    thumbnailUrl: buildImageUrl("roads", "Screenshot 2026-07-08 140715.png"),
  },
  {
    id: "na-006", source: "The Hindu", sourceLogo: "TH",
    headline: "Perambur PHC crisis: Single doctor handles 150+ patients daily",
    summary: "Public health centre in Ward 15 severely understaffed. Patients wait over 6 hours. MLA raises question in assembly.",
    url: "https://thehindu.com/news/chennai/2", publishedAt: new Date(Date.now() - 3600000).toISOString(),
    author: "P. Lakshmi", category: "Healthcare",
    location: { ward: "Ward 15", village: "Perambur", city: "Chennai" },
    severity: "High", sentiment: "negative",
    imageUrl: buildImageUrl("housing", "Screenshot 2026-07-08 141444.png"),
    thumbnailUrl: buildImageUrl("housing", "Screenshot 2026-07-08 141444.png"),
  },
  {
    id: "na-007", source: "Indian Express", sourceLogo: "IE",
    headline: "Korattur road damage: Auto driver dies after hitting pothole",
    summary: "Tragic accident on industrial road. Family demands compensation. Road department says repair work to start next week.",
    url: "https://indianexpress.com/chennai/2", publishedAt: new Date(Date.now() - 7 * 3600000).toISOString(),
    author: "V. Rajan", category: "Roads",
    location: { ward: "Ward 8", village: "Korattur", city: "Chennai" },
    severity: "Critical", sentiment: "negative",
    imageUrl: buildImageUrl("roads", "Screenshot 2026-07-08 140731.png"),
    thumbnailUrl: buildImageUrl("roads", "Screenshot 2026-07-08 140731.png"),
  },
  {
    id: "na-008", source: "Times of India", sourceLogo: "TOI",
    headline: "Otteri school gets new building after 3-year wait",
    summary: "Government school students finally get safe classrooms. New building inaugurated by local MLA. 200 students to benefit.",
    url: "https://timesofindia.com/chennai/2", publishedAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    author: "S. Kumar", category: "Education",
    location: { ward: "Ward 21", village: "Otteri", city: "Chennai" },
    severity: "Low", sentiment: "positive",
    imageUrl: buildImageUrl("education", "Screenshot 2026-07-08 141531.png"),
    thumbnailUrl: buildImageUrl("education", "Screenshot 2026-07-08 141531.png"),
  },
  {
    id: "na-009", source: "The News Minute", sourceLogo: "NM",
    headline: "Madhavaram garbage crisis: Thousands of tons of waste piled up",
    summary: "Waste collectors on strike for 5 days. Tons of garbage rotting on streets. Residents demand immediate resolution from corporation.",
    url: "https://thenewsminute.com/chennai/2", publishedAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    author: "M. Fathima", category: "Garbage",
    location: { ward: "Ward 18", village: "Madhavaram", city: "Chennai" },
    severity: "High", sentiment: "negative",
    imageUrl: buildImageUrl("garbage and cleanliness", "Screenshot 2026-07-08 141621.png"),
    thumbnailUrl: buildImageUrl("garbage and cleanliness", "Screenshot 2026-07-08 141621.png"),
  },
  {
    id: "na-010", source: "DT Next", sourceLogo: "DN",
    headline: "Chennai rains: 5 wards severely waterlogged, NDRF deployed",
    summary: "Heavy rainfall paralyzes North Chennai. Rescue operations underway. Over 2000 people moved to relief camps.",
    url: "https://dtnext.com/chennai/2", publishedAt: new Date(Date.now() - 3600000).toISOString(),
    author: "K. Balaji", category: "Drainage",
    location: { ward: "Ward 12", village: "Sewapuri", city: "Chennai" },
    severity: "Critical", sentiment: "negative",
    imageUrl: buildImageUrl("drainage and flooding", "Screenshot 2026-07-08 141037.png"),
    thumbnailUrl: buildImageUrl("drainage and flooding", "Screenshot 2026-07-08 141037.png"),
  },
  {
    id: "na-011", source: "The Hindu", sourceLogo: "TH",
    headline: "Housing board flats in Vyasarpadi develop cracks, residents panic",
    summary: "Multi-storey housing complex shows structural damage after recent rains. Residents demand immediate evacuation and structural audit.",
    url: "https://thehindu.com/chennai/3", publishedAt: new Date(Date.now() - 10 * 3600000).toISOString(),
    author: "R. Kumar", category: "Housing",
    location: { ward: "Ward 16", village: "Vyasarpadi", city: "Chennai" },
    severity: "High", sentiment: "negative",
    imageUrl: buildImageUrl("housing", "Screenshot 2026-07-08 141449.png"),
    thumbnailUrl: buildImageUrl("housing", "Screenshot 2026-07-08 141449.png"),
  },
  {
    id: "na-012", source: "Indian Express", sourceLogo: "IE",
    headline: "Agriculture crisis deepens in North Chennai as lake dries up",
    summary: "Farmers in Ennore and surrounding areas face severe crop loss. Groundwater levels drop 40 feet. Government announces relief package.",
    url: "https://indianexpress.com/chennai/3", publishedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    author: "S. Priya", category: "Agriculture",
    location: { ward: "Ward 2", village: "Ennore", city: "Chennai" },
    severity: "High", sentiment: "negative",
    imageUrl: buildImageUrl("agriculture", "Screenshot 2026-07-08 141347.png"),
    thumbnailUrl: buildImageUrl("agriculture", "Screenshot 2026-07-08 141347.png"),
  },
]

const topComplaint: TopComplaint = {
  title: "Water Crisis in North Chennai",
  category: "Water Supply",
  severity: "Critical",
  posts: 89,
  trend: "Rising sharply in last 24 hours",
}

export const kpis: SocialIntelligenceKPIs = {
  totalPostsToday: 2347,
  viralComplaints: 18,
  videosUploaded: 156,
  imagesUploaded: 892,
  avgAISeverity: 74,
  sentimentScore: 42,
  trendingLocations: 12,
  newsMentions: 34,
}

export const trendingTopics: TrendingTopic[] = [
  { hashtag: "#WaterCrisis", postCount: 456, sentiment: "negative", category: "Water Supply", trend: "up", change: 23 },
  { hashtag: "#ChennaiRains", postCount: 567, sentiment: "neutral", category: "Drainage", trend: "up", change: 89 },
  { hashtag: "#RoadSafety", postCount: 234, sentiment: "negative", category: "Roads", trend: "up", change: 34 },
  { hashtag: "#PowerCrisis", postCount: 189, sentiment: "negative", category: "Electricity", trend: "stable", change: 5 },
  { hashtag: "#Chennai", postCount: 892, sentiment: "mixed", category: "Water Supply", trend: "up", change: 12 },
  { hashtag: "#CleanChennai", postCount: 123, sentiment: "positive", category: "Garbage", trend: "down", change: -8 },
  { hashtag: "#HealthForAll", postCount: 198, sentiment: "negative", category: "Healthcare", trend: "up", change: 15 },
  { hashtag: "#Villivakkam", postCount: 145, sentiment: "negative", category: "Drainage", trend: "stable", change: 3 },
  { hashtag: "#StreetLights", postCount: 98, sentiment: "negative", category: "Public Safety", trend: "up", change: 45 },
  { hashtag: "#ChennaiRoads", postCount: 210, sentiment: "negative", category: "Roads", trend: "up", change: 18 },
]

export const trendingWards: TrendingWard[] = [
  { ward: "Ward 12", village: "Sewapuri", postCount: 234, topIssue: "Water Crisis", severity: "Critical", sentiment: "negative", lat: 13.115, lng: 80.275 },
  { ward: "Ward 8", village: "Korattur", postCount: 189, topIssue: "Road Damage", severity: "Critical", sentiment: "negative", lat: 13.130, lng: 80.290 },
  { ward: "Ward 15", village: "Perambur", postCount: 156, topIssue: "Healthcare", severity: "High", sentiment: "negative", lat: 13.118, lng: 80.265 },
  { ward: "Ward 3", village: "Villivakkam", postCount: 134, topIssue: "Drainage", severity: "Critical", sentiment: "negative", lat: 13.140, lng: 80.305 },
  { ward: "Ward 6", village: "Ayanavaram", postCount: 98, topIssue: "Electricity", severity: "Critical", sentiment: "negative", lat: 13.125, lng: 80.295 },
  { ward: "Ward 21", village: "Otteri", postCount: 67, topIssue: "Education", severity: "High", sentiment: "negative", lat: 13.108, lng: 80.278 },
  { ward: "Ward 14", village: "Tondiarpet", postCount: 145, topIssue: "Streetlights", severity: "Critical", sentiment: "negative", lat: 13.148, lng: 80.285 },
  { ward: "Ward 18", village: "Madhavaram", postCount: 112, topIssue: "Garbage", severity: "Medium", sentiment: "mixed", lat: 13.155, lng: 80.310 },
  { ward: "Ward 10", village: "Kasimedu", postCount: 78, topIssue: "Environment", severity: "High", sentiment: "negative", lat: 13.138, lng: 80.295 },
  { ward: "Ward 2", village: "Ennore", postCount: 56, topIssue: "Agriculture", severity: "High", sentiment: "negative", lat: 13.170, lng: 80.280 },
]

export const hourlyActivity: HourlyActivity[] = [
  { hour: "00", posts: 45, engagements: 1200 },
  { hour: "02", posts: 23, engagements: 800 },
  { hour: "04", posts: 67, engagements: 3400 },
  { hour: "06", posts: 156, engagements: 12000 },
  { hour: "08", posts: 345, engagements: 45000 },
  { hour: "10", posts: 423, engagements: 67000 },
  { hour: "12", posts: 389, engagements: 56000 },
  { hour: "14", posts: 456, engagements: 78000 },
  { hour: "16", posts: 324, engagements: 45000 },
  { hour: "18", posts: 234, engagements: 34000 },
  { hour: "20", posts: 178, engagements: 23000 },
  { hour: "22", posts: 89, engagements: 8900 },
]

export const platformDistribution: PlatformDistribution[] = [
  { platform: "twitter", count: 845, percentage: 36, color: "#1DA1F2" },
  { platform: "instagram", count: 423, percentage: 18, color: "#E4405F" },
  { platform: "facebook", count: 312, percentage: 13, color: "#1877F2" },
  { platform: "youtube", count: 234, percentage: 10, color: "#FF0000" },
  { platform: "citizen", count: 289, percentage: 12, color: "#10B981" },
  { platform: "news", count: 244, percentage: 11, color: "#6366F1" },
]

/**
 * Get mock social data for a specific constituency.
 * When constituencyName is provided, posts use that constituency's
 * villages, wards, and priority issues for realistic content.
 */
export function getMockSocialData(constituencyName?: string): SocialIntelligenceResponse {
  const posts = generateConstituencyPosts(constituencyName, 100)
  const mostSharedPost = posts.reduce((a, b) => a.shares > b.shares ? a : b, posts[0])
  const latestVideos = posts.filter(p => p.media.some(m => m.type === "video" || m.type === "short")).slice(0, 5)

  // Dynamic trending wards from the constituency's villages
  const constituencyTrendingWards = constituencyName
    ? getWardDataForConstituency(constituencyName).slice(0, 10).map((w, i) => ({
        ward: w.ward,
        village: w.village,
        postCount: rng(30, 250),
        topIssue: posts.find((p) => p.geoLocation.village === w.village)?.category || "Roads",
        severity: (["Critical", "High", "Medium", "Low"] as SeverityLevel[])[i % 4],
        sentiment: (["negative", "negative", "mixed", "positive"] as SentimentType[])[i % 4],
        lat: w.lat,
        lng: w.lng,
      }))
    : trendingWards

  return {
    kpis,
    posts,
    trendingTopics,
    trendingWards: constituencyTrendingWards,
    hourlyActivity,
    platformDistribution,
    newsArticles,
    totalPosts: posts.length,
    hasMore: true,
    nextCursor: `sp-${posts.length}`,
    topComplaint: constituencyName
      ? {
          title: posts[0]?.text.slice(0, 60) || topComplaint.title,
          category: posts[0]?.category || topComplaint.category,
          severity: posts[0]?.severity || topComplaint.severity,
          posts: rng(30, 100),
          trend: "Rising in this constituency",
        }
      : topComplaint,
    mostSharedPost,
    latestVideos,
    dataSource: "mock",
  }
}
