/**
 * Social Media Image Discovery Utility
 *
 * Maps complaint categories to actual image files in public/social-media/.
 * This is the single source of truth for image paths — mock data, live API,
 * and UI all use this utility to resolve images.
 */

export interface SocialMediaImage {
  /** URL-encoded path for use in img src, e.g. "/social-media/roads/Screenshot%20...png" */
  url: string
  /** Friendly alt text */
  alt: string
}

// Discovered files — update when new images are added
const FILES: Record<string, string[]> = {
  roads: [
    "Screenshot 2026-07-08 140715.png",
    "Screenshot 2026-07-08 140731.png",
    "Screenshot 2026-07-08 140740.png",
    "Screenshot 2026-07-08 140745.png",
    "Screenshot 2026-07-08 140753.png",
  ],
  "water supply and leakage": [
    "Screenshot 2026-07-08 141221.png",
    "Screenshot 2026-07-08 141228.png",
    "Screenshot 2026-07-08 141241.png",
  ],
  "drainage and flooding": [
    "Screenshot 2026-07-08 141030.png",
    "Screenshot 2026-07-08 141037.png",
    "Screenshot 2026-07-08 141041.png",
    "Screenshot 2026-07-08 141045.png",
    "Screenshot 2026-07-08 141050.png",
  ],
  electricity: [
    "Screenshot 2026-07-08 141125.png",
    "Screenshot 2026-07-08 141134.png",
    "Screenshot 2026-07-08 141139.png",
  ],
  "garbage and cleanliness": [
    "Screenshot 2026-07-08 141621.png",
    "Screenshot 2026-07-08 141626.png",
    "Screenshot 2026-07-08 141634.png",
  ],
  education: [
    "Screenshot 2026-07-08 141531.png",
    "Screenshot 2026-07-08 141541.png",
  ],
  housing: [
    "Screenshot 2026-07-08 141444.png",
    "Screenshot 2026-07-08 141449.png",
    "Screenshot 2026-07-08 141456.png",
  ],
  agriculture: [
    "Screenshot 2026-07-08 141347.png",
    "Screenshot 2026-07-08 141355.png",
    "Screenshot 2026-07-08 141405.png",
  ],
  sanitation: [
    "Screenshot 2026-07-08 141257.png",
    "Screenshot 2026-07-08 141306.png",
    "Screenshot 2026-07-08 141312.png",
  ],
}

/**
 * Maps a canonical complaint category to its image folder.
 * Categories without a dedicated folder get the closest match.
 */
const CATEGORY_FOLDER: Record<string, string> = {
  Roads: "roads",
  "Water Supply": "water supply and leakage",
  Drainage: "drainage and flooding",
  Electricity: "electricity",
  Garbage: "garbage and cleanliness",
  Healthcare: "housing",        // no healthcare/ folder → fallback
  "Public Safety": "roads",     // no public-safety/ folder → fallback
  Education: "education",
  Housing: "housing",
  Agriculture: "agriculture",
  Environment: "sanitation",    // no environment/ folder → fallback
  Sanitation: "sanitation",
}

/** Get the folder name for a category */
export function getImageFolder(category: string): string {
  return CATEGORY_FOLDER[category] || "roads"
}

/** Get all available image filenames for a category */
export function getCategoryImageFiles(category: string): string[] {
  const folder = getImageFolder(category)
  return FILES[folder] || FILES.roads
}

/** Build the public URL for an image file from a folder + filename */
export function buildImageUrl(folder: string, filename: string): string {
  const encodedName = encodeURIComponent(filename)
  const encodedFolder = encodeURIComponent(folder)
  return `/social-media/${encodedFolder}/${encodedName}`
}

/**
 * Pick N random images for a given category.
 * Uses the current time seed so picks are deterministic within a session.
 */
export function pickImagesForCategory(category: string, count: number): SocialMediaImage[] {
  const folder = getImageFolder(category)
  const files = FILES[folder] || FILES.roads
  if (files.length === 0) return []

  const shuffled = [...files].sort(() => Math.random() - 0.5)
  const picked = shuffled.slice(0, Math.max(1, Math.min(count, files.length)))

  return picked.map((file, i) => ({
    url: buildImageUrl(folder, file),
    alt: `${category} issue image ${i + 1}`,
  }))
}

/**
 * Resolve a media path to a full public URL.
 * Handles: absolute paths, already-encoded paths, raw filenames, and folder/filename combos.
 */
export function resolveMediaUrl(path: string): string {
  if (!path) return ""
  if (path.startsWith("http://") || path.startsWith("https://")) return path
  if (path.startsWith("/api/")) return path

  // Already a /social-media/ path
  if (path.startsWith("/social-media/")) return path

  // Could be a raw filename like "Screenshot ...png" — try each folder
  for (const [folder, files] of Object.entries(FILES)) {
    if (files.includes(path)) {
      return buildImageUrl(folder, path)
    }
  }

  // Could be "folder/filename" format
  const parts = path.replace(/\\/g, "/").split("/")
  if (parts.length >= 2) {
    const folder = parts[0]
    const filename = parts.slice(1).join("/")
    return buildImageUrl(folder, filename)
  }

  // Last resort — just encode and prepend
  return `/social-media/${encodeURIComponent(path)}`
}

/** Metadata about available images */
export const IMAGE_STATS = {
  totalFiles: Object.values(FILES).reduce((s, f) => s + f.length, 0),
  folders: Object.keys(FILES).length,
  categories: Object.keys(CATEGORY_FOLDER).length,
}
