import { apiGet, apiPost } from "./client"
import { socialCache, CACHE_TTL } from "./social-cache"
import { getMockSocialData } from "@/data/mock-social-posts"
import { resolveMediaUrl, pickImagesForCategory } from "@/data/social-media-images"
import type { SocialIntelligenceResponse, SocialPost, SocialIntelligenceKPIs } from "@/types/social"
import type { ConstituencyDataSet } from "@/data/mock-constituency-data"

export interface SocialFilters {
  platform?: string
  category?: string
  severity?: string
  minLikes?: number
  minShares?: number
  minConfidence?: number
  search?: string
  constituency?: string
  ward?: string
  village?: string
  verifiedOnly?: boolean
  mediaType?: string
}

function buildSearchQueries(constituency?: string, ward?: string, village?: string): string[] {
  const queries: string[] = []
  if (constituency) {
    queries.push(constituency)
    const parts = constituency.split(" ")
    if (parts.length > 1) queries.push(parts[0])
  }
  if (village) queries.push(village)
  if (ward) queries.push(ward)
  return [...new Set(queries)]
}

function cacheKey(filters?: SocialFilters): string {
  if (!filters) return "feed:all"
  const parts: string[] = []
  if (filters.platform) parts.push(`p=${filters.platform}`)
  if (filters.category) parts.push(`c=${filters.category}`)
  if (filters.severity) parts.push(`s=${filters.severity}`)
  if (filters.search) parts.push(`q=${filters.search}`)
  if (filters.constituency) parts.push(`const=${filters.constituency}`)
  if (filters.ward) parts.push(`w=${filters.ward}`)
  if (filters.village) parts.push(`v=${filters.village}`)
  return parts.length ? `feed:${parts.join("&")}` : "feed:all"
}

export function mergeComplaints(
  posts: SocialPost[],
  constituencyData?: ConstituencyDataSet,
): SocialPost[] {
  if (!constituencyData || !posts.length) return posts

  const villages = constituencyData.villages
  const priorities = constituencyData.priorities

  return posts.map((post) => {
    const location = post.geoLocation
    const matchedVillage = villages.find(
      (v) =>
        v.name.toLowerCase() === location.village?.toLowerCase() ||
        v.ward.toLowerCase() === location.ward?.toLowerCase(),
    )

    const matchedPriority = matchedVillage
      ? priorities.find((p) => p.village === matchedVillage.name)
      : null

    const categoryMatch = matchedPriority?.department
      ? priorities.filter(
          (p) =>
            p.department.toLowerCase().includes(post.category?.toLowerCase() || "") ||
            post.category?.toLowerCase().includes(p.department.toLowerCase()),
        )
      : []

    return {
      ...post,
      ...(matchedVillage && {
        geoLocation: {
          ...location,
          lat: matchedVillage.lat,
          lng: matchedVillage.lng,
        },
      }),
      ai: {
        ...post.ai,
        ...(matchedPriority && {
          urgencyScore: matchedPriority.urgency,
          confidence: matchedPriority.confidence,
          estimatedBudget: matchedPriority.budget,
        }),
      },
      _linkedComplaint: matchedPriority
        ? {
            village: matchedPriority.village,
            ward: matchedPriority.ward,
            issue: matchedPriority.issue,
            department: matchedPriority.department,
            urgency: matchedPriority.urgency,
            rank: matchedPriority.rank,
          }
        : undefined,
      _linkedVillage: matchedVillage
        ? {
            name: matchedVillage.name,
            ward: matchedVillage.ward,
            population: matchedVillage.population,
            complaints: matchedVillage.complaints,
          }
        : undefined,
      _similarCount: categoryMatch.length,
    } as SocialPost & {
      _linkedComplaint?: {
        village: string
        ward: string
        issue: string
        department: string
        urgency: number
        rank: number
      }
      _linkedVillage?: {
        name: string
        ward: string
        population: number
        complaints: number
      }
      _similarCount?: number
    }
  })
}

function buildParams(
  filters?: SocialFilters,
  cursor?: string,
  limit?: number,
): Record<string, string> {
  const params: Record<string, string> = {}
  if (limit) params.limit = String(limit)
  if (cursor) params.cursor = cursor
  if (filters?.platform) params.platform = filters.platform
  if (filters?.category) params.category = filters.category
  if (filters?.severity) params.severity = filters.severity
  if (filters?.minLikes != null) params.min_likes = String(filters.minLikes)
  if (filters?.search) params.search = filters.search
  if (filters?.constituency) params.constituency = filters.constituency
  if (filters?.ward) params.ward = filters.ward
  if (filters?.village) params.village = filters.village
  return params
}

async function fetchFromApi(
  filters?: SocialFilters,
): Promise<SocialIntelligenceResponse | null> {
  try {
    const params = buildParams(filters)
    const queries = buildSearchQueries(
      filters?.constituency,
      filters?.ward,
      filters?.village,
    )
    if (queries.length > 0 && !params.search) {
      params.search = queries.join(" ")
    }
    const data = await apiGet<SocialIntelligenceResponse>("/social/feed", params)
    return { ...data, dataSource: "live" }
  } catch {
    return null
  }
}

/** Apply filter predicates to posts (mock data filtering). */
function applyFilters(posts: SocialPost[], filters?: SocialFilters): SocialPost[] {
  if (!filters) return posts
  let result = posts

  if (filters.platform) {
    const platforms = filters.platform.split(",")
    result = result.filter((p) => platforms.includes(p.platform))
  }
  if (filters.category) {
    const cats = filters.category.split(",")
    result = result.filter((p) => cats.includes(p.category))
  }
  if (filters.severity) {
    const sevs = filters.severity.split(",")
    result = result.filter((p) => sevs.includes(p.severity))
  }
  if (filters.minLikes != null && filters.minLikes > 0) {
    result = result.filter((p) => p.likes >= (filters.minLikes as number))
  }
  if (filters.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(
      (p) =>
        p.text.toLowerCase().includes(q) ||
        p.hashtags.some((h) => h.toLowerCase().includes(q)) ||
        p.authorName.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.geoLocation.ward.toLowerCase().includes(q) ||
        p.geoLocation.village.toLowerCase().includes(q) ||
        p.ai.department.toLowerCase().includes(q),
    )
  }
  if (filters.minShares != null && filters.minShares > 0) {
    result = result.filter((p) => p.shares >= (filters.minShares as number))
  }
  if (filters.minConfidence != null && filters.minConfidence > 0) {
    result = result.filter((p) => p.ai.confidence >= (filters.minConfidence as number))
  }
  if (filters.verifiedOnly) {
    result = result.filter((p) => p.isVerified)
  }
  const wardFilter = filters.ward
  if (wardFilter) {
    result = result.filter((p) => p.geoLocation.ward.toLowerCase().includes(wardFilter.toLowerCase()))
  }
  const villageFilter = filters.village
  if (villageFilter) {
    result = result.filter((p) =>
      p.geoLocation.village.toLowerCase().includes(villageFilter.toLowerCase()),
    )
  }
  if (filters.mediaType && filters.mediaType !== "all") {
    if (filters.mediaType === "image") {
      result = result.filter((p) => p.media.some((m) => m.type === "image"))
    } else if (filters.mediaType === "video") {
      result = result.filter((p) => p.media.some((m) => m.type === "video"))
    } else if (filters.mediaType === "reel") {
      result = result.filter((p) => p.media.some((m) => m.type === "reel" || m.type === "short"))
    }
  }
  return result
}

/**
 * Seed the social cache with mock data so the first load is instant.
 * Generates constituency-specific posts when constituency data is provided.
 */
function ensureMockCache(constituencyData?: ConstituencyDataSet): SocialIntelligenceResponse {
  const consName = constituencyData?.name
  const cacheKey = consName ? `feed:base:${consName}` : "feed:all"

  const existing = socialCache.get<SocialIntelligenceResponse>(cacheKey)
  if (existing) return existing

  // Generate constituency-aware mock data
  const mockData = getMockSocialData(consName)
  const merged = mergeComplaints(mockData.posts, constituencyData)
  const result = { ...mockData, posts: merged, totalPosts: merged.length, dataSource: "demo" }
  socialCache.set(cacheKey, result)
  // Also set generic key for backward compatibility
  if (!consName) socialCache.set("feed:all", result)
  return result
}

export async function fetchSocialIntelligence(
  filters?: SocialFilters,
  constituencyData?: ConstituencyDataSet,
): Promise<SocialIntelligenceResponse> {
  // Always load the full base dataset — filtering is done client-side.
  // The key is based only on constituency/village/ward so the full posts
  // stay cached and switching platform/severity/search is instant.
  const base = ensureMockCache(constituencyData)

  // Cache filtered results under the full key for fast re-access
  const key = cacheKey(filters)
  const cached = socialCache.get<SocialIntelligenceResponse>(key)
  if (cached) return cached

  const result: SocialIntelligenceResponse = {
    ...base,
    totalPosts: base.posts.length,
    dataSource: "demo",
  }
  socialCache.set(key, result)

  // Try API in background — don't await, just fire and forget
  fetchFromApi(filters).then((live) => {
    if (live) {
      const merged = mergeComplaints(live.posts, constituencyData)
      const liveResult: SocialIntelligenceResponse = {
        ...live,
        posts: merged,
        dataSource: "live",
      }
      socialCache.set(key, liveResult)
      socialCache.set("feed:all", { ...live, posts: merged, dataSource: "live" })
    }
  }).catch(() => {})

  return result
}

export async function searchSocialMedia(
  query: string,
  constituencyData?: ConstituencyDataSet,
): Promise<SocialIntelligenceResponse> {
  const key = `search:${query.toLowerCase().replace(/\s+/g, "_")}`

  const cached = socialCache.get<SocialIntelligenceResponse>(key)
  if (cached) return cached

  try {
    const data = await apiGet<SocialIntelligenceResponse>("/social/feed", {
      search: query,
      limit: "50",
    })
    const merged = mergeComplaints(data.posts, constituencyData)
    const result = { ...data, posts: merged, dataSource: "live" } as SocialIntelligenceResponse
    socialCache.set(key, result)
    return result
  } catch {
    const mockData = getMockSocialData()
    const filtered = mockData.posts.filter(
      (p) =>
        p.text.toLowerCase().includes(query.toLowerCase()) ||
        p.hashtags.some((h) => h.toLowerCase().includes(query.toLowerCase())) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.geoLocation.village.toLowerCase().includes(query.toLowerCase()),
    )
    const merged = mergeComplaints(
      filtered.length ? filtered : mockData.posts,
      constituencyData,
    )
    return {
      ...mockData,
      posts: merged,
      totalPosts: merged.length,
      dataSource: "demo",
    }
  }
}

export async function fetchSocialFeed(
  cursor?: string,
  limit = 20,
  filters?: SocialFilters,
  constituencyData?: ConstituencyDataSet,
): Promise<SocialIntelligenceResponse> {
  const response = await fetchSocialIntelligence(filters, constituencyData)
  const startIdx = cursor ? parseInt(cursor, 10) : 0
  return {
    ...response,
    posts: response.posts.slice(startIdx, startIdx + limit),
    hasMore: startIdx + limit < response.totalPosts,
    nextCursor: startIdx + limit < response.totalPosts ? String(startIdx + limit) : undefined,
  }
}

export async function fetchSocialPost(
  id: string,
  constituencyData?: ConstituencyDataSet,
): Promise<SocialPost | undefined> {
  try {
    const post = await apiGet<SocialPost>(`/social/posts/${id}`)
    const merged = mergeComplaints([post], constituencyData)
    return merged[0]
  } catch {
    const data = getMockSocialData()
    const post = data.posts.find((p) => p.id === id)
    if (!post) return undefined
    const merged = mergeComplaints([post], constituencyData)
    return merged[0]
  }
}

export async function syncSocialFeed(): Promise<{
  status: string
  source: string
  posts: number
  news: number
  message: string
}> {
  try {
    socialCache.clear()
    return await apiPost("/social/sync")
  } catch {
    return {
      status: "error",
      source: "mock",
      posts: 0,
      news: 0,
      message: "Backend unavailable",
    }
  }
}

export async function getSocialStatus(): Promise<{
  source: string
  cacheAge: number | null
  cacheTTL: number
  apifyConfigured: boolean
}> {
  try {
    return await apiGet("/social/status")
  } catch {
    return { source: "mock", cacheAge: null, cacheTTL: 900, apifyConfigured: false }
  }
}

export function getMediaUrl(path: string): string {
  if (!path) return ""
  if (path.startsWith("/api/")) return path
  if (path.startsWith("/social-placeholders/")) return path
  if (path.startsWith("http")) return path
  const clean = path.replace(/\\/g, "/")
  // Already a /social-media/ path
  if (clean.startsWith("/social-media/")) return clean
  return resolveMediaUrl(clean)
}

export function getCategoryPlaceholder(category?: string): string {
  if (!category) return "/social-media/roads/Screenshot%202026-07-08%20140715.png"
  const images = pickImagesForCategory(category, 1)
  return images.length > 0 ? images[0].url : "/social-media/roads/Screenshot%202026-07-08%20140715.png"
}

export { CACHE_TTL, socialCache }
