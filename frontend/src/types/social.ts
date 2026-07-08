export type PlatformType = "twitter" | "instagram" | "facebook" | "youtube" | "citizen" | "news"

export type ComplaintCategory =
  | "Roads"
  | "Water Supply"
  | "Drainage"
  | "Electricity"
  | "Garbage"
  | "Healthcare"
  | "Public Safety"
  | "Education"
  | "Housing"
  | "Agriculture"
  | "Environment"
  | "Sanitation"

export type SeverityLevel = "Critical" | "High" | "Medium" | "Low"

export type SentimentType = "positive" | "negative" | "neutral" | "mixed"

export interface GeoLocation {
  lat: number
  lng: number
  ward: string
  village: string
  zone?: string
}

export interface MediaAttachment {
  id: string
  type: "image" | "video" | "reel" | "short"
  url: string
  thumbnailUrl?: string
  width?: number
  height?: number
  duration?: number
  alt?: string
}

export interface AIAnalysis {
  category: ComplaintCategory
  severity: SeverityLevel
  confidence: number
  duplicateScore: number
  fakeNewsProbability: number
  department: string
  priorityScore: number
  urgencyScore: number
  suggestedAction: string
  estimatedImpact: string
  estimatedAffected: number
  estimatedBudget: string
  estimatedResolution: string
  responsibleOfficer: string
  rootCause: string
  aiSummary: string
}

export interface SocialPost {
  id: string
  platform: PlatformType
  authorName: string
  authorUsername: string
  authorAvatar: string
  authorAvatarUrl?: string
  isVerified: boolean
  timestamp: string
  text: string
  hashtags: string[]
  mentions: string[]
  geoLocation: GeoLocation
  category: ComplaintCategory
  severity: SeverityLevel
  sentiment: SentimentType
  likes: number
  comments: number
  shares: number
  views: number
  media: MediaAttachment[]
  originalUrl: string
  ai: AIAnalysis
  isFakeNews: boolean
  communityImpact?: string
  trend?: string
  duplicateCount?: number
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

export interface NewsArticle {
  id: string
  source: string
  sourceLogo: string
  sourceFavicon?: string
  headline: string
  summary: string
  url: string
  publishedAt: string
  author: string
  category: ComplaintCategory
  location: {
    ward: string
    village: string
    city: string
  }
  severity: SeverityLevel
  sentiment: SentimentType
  imageUrl?: string
  thumbnailUrl?: string
}

export interface SocialIntelligenceKPIs {
  totalPostsToday: number
  viralComplaints: number
  videosUploaded: number
  imagesUploaded: number
  avgAISeverity: number
  sentimentScore: number
  trendingLocations: number
  newsMentions: number
}

export interface TrendingTopic {
  hashtag: string
  postCount: number
  sentiment: SentimentType
  category: ComplaintCategory
  trend?: "up" | "down" | "stable"
  change?: number
}

export interface TrendingWard {
  ward: string
  village: string
  postCount: number
  topIssue: string
  severity: SeverityLevel
  sentiment: SentimentType
  lat?: number
  lng?: number
}

export interface HourlyActivity {
  hour: string
  posts: number
  engagements: number
}

export interface PlatformDistribution {
  platform: PlatformType
  count: number
  percentage: number
  color?: string
}

export interface TopComplaint {
  title: string
  category: ComplaintCategory
  severity: SeverityLevel
  posts: number
  trend: string
}

export interface SocialIntelligenceResponse {
  kpis: SocialIntelligenceKPIs
  posts: SocialPost[]
  trendingTopics: TrendingTopic[]
  trendingWards: TrendingWard[]
  hourlyActivity: HourlyActivity[]
  platformDistribution: PlatformDistribution[]
  newsArticles: NewsArticle[]
  totalPosts: number
  hasMore: boolean
  nextCursor?: string
  topComplaint?: TopComplaint
  mostSharedPost?: SocialPost
  latestVideos?: SocialPost[]
  dataSource?: string
}
