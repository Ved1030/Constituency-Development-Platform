export interface ConstituencyInfo {
  name: string;
  slug: string;
  state: string;
  center: { lat: number; lng: number };
  zoom: number;
  boundaryFile: string;
  mpName: string;
}

export const CONSTITUENCIES: Record<string, ConstituencyInfo> = {
  "North Chennai": {
    name: "North Chennai",
    slug: "north-chennai",
    state: "Tamil Nadu",
    center: { lat: 13.128, lng: 80.288 },
    zoom: 12,
    boundaryFile: "/maps/north-chennai.geojson",
    mpName: "Dr. Rajesh Sharma",
  },
  "South Mumbai": {
    name: "South Mumbai",
    slug: "south-mumbai",
    state: "Maharashtra",
    center: { lat: 18.945, lng: 72.833 },
    zoom: 13,
    boundaryFile: "/maps/south-mumbai.geojson",
    mpName: "Smt. Meera Desai",
  },
  "Central Surat": {
    name: "Central Surat",
    slug: "central-surat",
    state: "Gujarat",
    center: { lat: 21.195, lng: 72.820 },
    zoom: 13,
    boundaryFile: "/maps/central-surat.geojson",
    mpName: "Shri Amit Joshi",
  },
};

export function getConstituency(name: string): ConstituencyInfo | undefined {
  return CONSTITUENCIES[name];
}

export function getDefaultConstituency(): ConstituencyInfo {
  return CONSTITUENCIES["North Chennai"];
}
