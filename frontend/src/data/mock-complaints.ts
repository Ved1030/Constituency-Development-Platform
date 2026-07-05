import type { DigitalTwinComplaint, GeoJsonBoundary } from "@/types/digital-twin";

// ─── Seeded random for reproducibility ─────────────────────────────
let seed = 42;
function seededRandom(): number {
  seed = (seed * 16807 + 0) % 2147483647;
  return (seed - 1) / 2147483646;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(seededRandom() * arr.length)];
}

// ─── Ray casting point-in-polygon ──────────────────────────────────
function pointInPolygon(
  point: [number, number],
  polygon: [number, number][]
): boolean {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    if (
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
    ) {
      inside = !inside;
    }
  }
  return inside;
}

// ─── Generate random point inside polygon ──────────────────────────
function randomPointInPolygon(
  coords: [number, number][],
  maxAttempts = 1000
): [number, number] {
  const lats = coords.map((c) => c[1]);
  const lngs = coords.map((c) => c[0]);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  for (let i = 0; i < maxAttempts; i++) {
    const lat = minLat + seededRandom() * (maxLat - minLat);
    const lng = minLng + seededRandom() * (maxLng - minLng);
    if (pointInPolygon([lng, lat], coords)) {
      return [lat, lng];
    }
  }
  // Fallback: return centroid
  const cLat = lats.reduce((a, b) => a + b, 0) / lats.length;
  const cLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
  return [cLat, cLng];
}

// ─── Generate distributed points ───────────────────────────────────
function generateDistributedPoints(
  coords: [number, number][],
  count: number
): Array<[number, number]> {
  const points: Array<[number, number]> = [];
  for (let i = 0; i < count; i++) {
    points.push(randomPointInPolygon(coords));
  }
  return points;
}

// ─── Boundary coordinates from GeoJSON ─────────────────────────────
const boundaryCoords: [number, number][] = [
  [80.2620, 13.1080],
  [80.2680, 13.1045],
  [80.2745, 13.1030],
  [80.2810, 13.1040],
  [80.2875, 13.1075],
  [80.2930, 13.1130],
  [80.2970, 13.1195],
  [80.3000, 13.1270],
  [80.3015, 13.1345],
  [80.3020, 13.1420],
  [80.3010, 13.1490],
  [80.2985, 13.1555],
  [80.2945, 13.1605],
  [80.2895, 13.1640],
  [80.2835, 13.1655],
  [80.2775, 13.1650],
  [80.2715, 13.1625],
  [80.2660, 13.1585],
  [80.2615, 13.1530],
  [80.2580, 13.1465],
  [80.2560, 13.1395],
  [80.2555, 13.1320],
  [80.2565, 13.1250],
  [80.2585, 13.1185],
  [80.2605, 13.1130],
  [80.2620, 13.1080],
];

// ─── Generate distributed complaints ───────────────────────────────
const points = generateDistributedPoints(boundaryCoords, 40);

const villages = [
  "Gandhi Nagar",
  "Krishna Nagar",
  "Ramesh Nagar",
  "Ward 5 Central",
  "Marina Ward",
  "T Nagar",
  "Adyar East",
  "Velachery",
  "Taramani",
  "Sholinganallur",
];

const wards = [
  "Ward 1",
  "Ward 2",
  "Ward 3",
  "Ward 4",
  "Ward 5",
  "Ward 6",
  "Ward 7",
  "Ward 8",
  "Ward 9",
  "Ward 10",
  "Ward 11",
  "Ward 12",
];

const officers = [
  "R. Sundaram",
  "K. Lakshmi",
  "M. Venkatesh",
  "S. Priya",
  "A. Rajan",
  "P. Meena",
  "T. Karthik",
  "V. Anand",
  "J. Devi",
  "B. Mohan",
];

const complaintTemplates = [
  { title: "Major pothole near Velachery Main Road junction", description: "A large pothole approximately 3 feet wide has formed at the busy Velachery Main Road junction. Multiple vehicles have been damaged. Immediate repair needed before monsoon.", department: "Roads & Infrastructure", priority: "Critical" as const },
  { title: "Broken water pipeline causing flooding in Krishna Nagar", description: "Underground water pipeline burst has flooded the main street of Krishna Nagar. Water supply to 200+ homes disrupted for 3 days.", department: "Water Supply", priority: "Critical" as const },
  { title: "Frequent power outages in Sholinganallur area", description: "Residents report power cuts lasting 4-6 hours daily for the past two weeks. Several hospitals and schools affected.", department: "Electricity", priority: "Critical" as const },
  { title: "Overflowing garbage bins near Gandhi Nagar market", description: "Municipal garbage bins have not been emptied for over a week. Foul smell and health hazard for nearby residents and vendors.", department: "Sanitation", priority: "High" as const },
  { title: "Street lights not working on Ward 5 Main Street", description: "Over 15 street lights on the main road of Ward 5 have been non-functional for a month. Safety concerns for evening commuters.", department: "Electricity", priority: "High" as const },
  { title: "Damaged school wall at T Nagar Primary School", description: "Boundary wall of T Nagar Primary School partially collapsed after heavy rain. Risk to 400+ students during school hours.", department: "Education", priority: "High" as const },
  { title: "Waterlogging near Adyar Bridge approach road", description: "Severe waterlogging during even moderate rainfall makes the Adyar Bridge approach road impassable. Affects thousands of daily commuters.", department: "Roads & Infrastructure", priority: "High" as const },
  { title: "Ambulance delayed due to road condition in Taramani", description: "Critical ambulance response was delayed by 20 minutes due to extremely poor road conditions in Taramani. Patient outcomes affected.", department: "Healthcare", priority: "Critical" as const },
  { title: "Open sewer near Marina Ward community center", description: "Sewer line exposed near the community center creating health risk. Children play area nearby.", department: "Sanitation", priority: "Critical" as const },
  { title: "Frequent transformer trips in Ramesh Nagar", description: "Local transformer trips 3-4 times daily causing voltage fluctuations damaging home appliances. Residents demand replacement.", department: "Electricity", priority: "Medium" as const },
  { title: "Cracked footpath on T Nagar 2nd Avenue", description: "Cracked and uneven footpath poses tripping hazard especially for elderly residents. Needs resurfacing.", department: "Roads & Infrastructure", priority: "Medium" as const },
  { title: "Low water pressure in Gandhi Nagar apartments", description: "Water pressure too low to reach upper floors of 3 apartment complexes. Over 150 families affected daily.", department: "Water Supply", priority: "High" as const },
  { title: "Leaking roof at Ward 5 Government School", description: "Classroom ceiling leaks during rain disrupting studies. 3 of 8 classrooms currently unusable.", department: "Education", priority: "Medium" as const },
  { title: "Stray dog menace near Velachery bus stop", description: "Pack of aggressive stray dogs near the bus stop threatening commuters. Two biting incidents reported this month.", department: "Public Safety", priority: "High" as const },
  { title: "Illegal construction blocking drainage in Krishna Nagar", description: "Unauthorized construction blocking natural drainage path causing backflow during rains. Multiple homes flooded.", department: "Sanitation", priority: "High" as const },
  { title: "Potable water contamination in Sholinganallur colony", description: "Water testing reveals E. coli contamination in supply. 500+ families at risk of waterborne diseases.", department: "Water Supply", priority: "Critical" as const },
  { title: "Non-functional traffic signal at T Nagar junction", description: "Traffic signal at major T Nagar intersection has been blinking yellow for 2 weeks causing accidents and gridlock.", department: "Public Safety", priority: "Medium" as const },
  { title: "Asbestos roofing in Adyar East government hospital", description: "Outpatient department still has damaged asbestos roofing which is a health hazard for patients and staff.", department: "Healthcare", priority: "High" as const },
  { title: "Road cave-in near Taramani industrial estate", description: "Section of road caved in after overnight rain exposing underground utilities. Road completely blocked.", department: "Roads & Infrastructure", priority: "Critical" as const },
  { title: "School playground flooding in Ramesh Nagar", description: "Government school playground turns into a pond after every rain. Sports activities impossible for weeks.", department: "Education", priority: "Low" as const },
  { title: "Voltage fluctuation damaging hospital equipment", description: "PGI Hospital reports repeated equipment damage due to unstable power. Backup generator fuel costs escalating.", department: "Healthcare", priority: "High" as const },
  { title: "Broken sewage pump in Marina Ward", description: "Sewage pumping station motor burned out. Raw sewage backing up into residential streets.", department: "Sanitation", priority: "Critical" as const },
  { title: "Missing manhole cover on Velachery Main Road", description: "Cast iron manhole cover stolen leaving open pit on busy road. Multiple near-miss incidents reported.", department: "Public Safety", priority: "High" as const },
  { title: "Deteriorating road surface in Ward 8", description: "Road surface has developed multiple cracks and patches. Two-wheeler riders slipping during wet conditions.", department: "Roads & Infrastructure", priority: "Medium" as const },
  { title: "No street lighting in new Sholinganallur colony", description: "Recently developed residential colony has no street lighting infrastructure. Residents afraid to go out after dark.", department: "Electricity", priority: "Medium" as const },
  { title: "Rusted water tank posing collapse risk in T Nagar", description: "Municipal overhead water tank showing severe rust and structural weakness. Engineering assessment needed urgently.", department: "Water Supply", priority: "High" as const },
  { title: "Overflowing stormwater drain in Ward 3", description: "Stormwater drain blocked with debris and garbage causing sewage mix overflow during rains.", department: "Sanitation", priority: "Medium" as const },
  { title: "Unsanitary conditions at Gandhi Nagar public toilet", description: "Public toilet facility hasn't been cleaned in days. No water supply. Citizens forced to use open areas.", department: "Sanitation", priority: "Medium" as const },
  { title: "School compound wall damaged by tree fall", description: "Large tree fell on school compound wall during storm. Debris and broken wall sections blocking pedestrian path.", department: "Education", priority: "Low" as const },
  { title: "Illegal parking blocking ambulance route in T Nagar", description: "Persistent illegal parking on narrow T Nagar streets blocking emergency vehicle access to nearby hospital.", department: "Public Safety", priority: "High" as const },
  { title: "Corroded water pipes in Krishna Nagar old colony", description: "25-year-old water pipes corroded through, causing leakages and brown discolored water supply.", department: "Water Supply", priority: "Medium" as const },
  { title: "Pothole cluster on Adyar East service road", description: "Service road connecting Adyar East to main road has 8+ potholes in 500m stretch. Commuters avoid this route.", department: "Roads & Infrastructure", priority: "Medium" as const },
  { title: "Mosquito breeding near stagnant water in Ward 7", description: "Stagnant water in vacant plot creating massive mosquito breeding ground. Dengue cases increasing in the ward.", department: "Healthcare", priority: "High" as const },
  { title: "Broken foot overbridge near Velachery station", description: "Pedestrian foot overbridge has damaged steps and missing handrails. Risky for daily commuters.", department: "Roads & Infrastructure", priority: "High" as const },
  { title: "Electric pole leaning dangerously in Taramani", description: "Concrete electric pole tilted at 30-degree angle after vehicle collision. Risk of falling on pedestrians.", department: "Electricity", priority: "Critical" as const },
  { title: "Garbage dumping ground near school in Ward 2", description: "Unauthorized garbage dumping ground operational near government school. Children exposed to toxic waste.", department: "Sanitation", priority: "High" as const },
  { title: "Water supply pipe burst flooding road in Adyar", description: "Major 12-inch water supply pipe burst flooding the road and nearby basements. Traffic diverted.", department: "Water Supply", priority: "High" as const },
  { title: "Inadequate lighting at Sholinganallur junction", description: "Major road junction has only one working street light. Multiple night-time accidents reported.", department: "Electricity", priority: "Low" as const },
  { title: "Crumbled retaining wall along canal in Ward 9", description: "Canal retaining wall crumbling causing soil erosion threatening nearby residential structures.", department: "Roads & Infrastructure", priority: "Medium" as const },
  { title: "No ambulance bay at PHC Adyar East", description: "Primary health center lacks dedicated ambulance bay causing delays in emergency patient transfers.", department: "Healthcare", priority: "Low" as const },
];

function randomDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(seededRandom() * daysAgo));
  d.setHours(Math.floor(seededRandom() * 24), Math.floor(seededRandom() * 60));
  return d.toISOString();
}

function randomFutureDate(maxDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + Math.floor(seededRandom() * maxDays) + 1);
  return d.toISOString().split("T")[0];
}

export const mockComplaints: DigitalTwinComplaint[] = complaintTemplates.map((tpl, i) => {
  const [lat, lng] = points[i];
  return {
    id: `CMP-${String(i + 1).padStart(3, "0")}`,
    title: tpl.title,
    description: tpl.description,
    latitude: +lat.toFixed(6),
    longitude: +lng.toFixed(6),
    priority: tpl.priority,
    department: tpl.department,
    status: pick(["Open", "Open", "Open", "In Progress", "In Progress", "Resolved"] as const),
    communityVotes: Math.floor(seededRandom() * 200) + 5,
    affectedPopulation: Math.floor(seededRandom() * 15000) + 100,
    reportedAt: randomDate(90),
    assignedOfficer: pick(officers),
    estimatedBudget: Math.floor(seededRandom() * 5000000) + 50000,
    expectedResolution: randomFutureDate(120),
    aiSummary: `AI analysis of "${tpl.title.toLowerCase()}": This issue falls under ${tpl.department} and has been classified as ${tpl.priority} priority based on severity indicators, community impact assessment, and historical complaint patterns in the area.`,
    aiRecommendation:
      tpl.priority === "Critical"
        ? "Immediate escalation recommended. Deploy emergency response team within 24 hours. Allocate emergency funds from contingency budget."
        : tpl.priority === "High"
          ? "Schedule priority inspection within 48 hours. Coordinate with relevant department head for resource allocation."
          : "Standard processing. Schedule within current maintenance cycle. Monitor community feedback for escalation signals.",
    aiConfidence: Math.floor(seededRandom() * 30) + 70,
    photos: [],
    voiceNote: null,
    ward: pick(wards),
    village: pick(villages),
  };
});

// ─── Overlay points ────────────────────────────────────────────────
export const mockOverlayPoints = {
  schools: [
    { name: "T Nagar Primary School", lat: 13.1350, lng: 80.2780 },
    { name: "Ward 5 Government School", lat: 13.1420, lng: 80.2850 },
    { name: "Ramesh Nagar High School", lat: 13.1300, lng: 80.2720 },
    { name: "Gandhi Nagar Middle School", lat: 13.1480, lng: 80.2750 },
    { name: "Sholinganallur Public School", lat: 13.1550, lng: 80.2900 },
    { name: "Velachery Girls School", lat: 13.1250, lng: 80.2830 },
    { name: "Adyar East Higher Secondary", lat: 13.1380, lng: 80.2920 },
    { name: "Marina Ward Primary", lat: 13.1500, lng: 80.2820 },
  ],
  hospitals: [
    { name: "PHC T Nagar", lat: 13.1330, lng: 80.2760 },
    { name: "PHC Adyar East", lat: 13.1395, lng: 80.2910 },
    { name: "Velachery Government Hospital", lat: 13.1240, lng: 80.2810 },
    { name: "Sholinganallur PHC", lat: 13.1570, lng: 80.2930 },
    { name: "Ward 5 Health Center", lat: 13.1440, lng: 80.2870 },
  ],
  projects: [
    { name: "Gandhi Nagar Drainage Overhaul", lat: 13.1465, lng: 80.2740 },
    { name: "School Road Reconstruction", lat: 13.1400, lng: 80.2860 },
    { name: "Solar Street Light Installation", lat: 13.1310, lng: 80.2790 },
    { name: "Velachery Water Tank Upgrade", lat: 13.1235, lng: 80.2825 },
    { name: "T Nagar Park Development", lat: 13.1345, lng: 80.2770 },
    { name: "Adyar Bridge Repair", lat: 13.1370, lng: 80.2905 },
  ],
};
