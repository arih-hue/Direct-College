// ─── Supabase DB-aligned types (snake_case) ─────────────────────────────────

export interface College {
  id: string
  name: string
  slug: string
  type: string
  state: string | null
  city: string | null
  nirf_rank: number | null
  avg_package: number | null
  highest_package: number | null
  fees: number | null
  campus_size: string | null
  established_year: number | null
  // Extended fields that may exist in DB
  country?: string
  shortName?: string
  location?: string
  rating?: number
  reviewCount?: number
  placementRate?: number
  medianPackage?: number
  accreditations?: string[]
  facilities?: string[]
  socialLinks?: {
    instagram?: string
    discord?: string
    whatsapp?: string
    telegram?: string
    linkedin?: string
    youtube?: string
    reddit?: string
  }
}

export interface Branch {
  id: string
  name: string
  shortName?: string
  code?: string | null
  degree?: string | null
  category?: string
  collegeId?: string
}

export interface Review {
  id: string
  collegeId?: string
  college_id?: string
  userId?: string
  user_id?: string
  userName?: string
  user_name?: string
  rating: number
  title?: string
  content?: string
  body?: string
  pros?: string[]
  cons?: string[]
  placementReality?: string
  wouldRecommend?: boolean
  helpfulCount?: number
  helpful_count?: number
  createdAt?: string | Date
  created_at?: string | Date
  verified?: boolean
  batch?: string
  branch?: string
}

export interface Mentor {
  id: string
  name: string
  college: string
  branch: string
  company: string
  role: string
  expertise: string[]
  sessionCount: number
  rating: number
  pricePerSession: number
  availability: string[]
}

export interface Deadline {
  id: string
  name: string
  date: Date
  type: string
  description: string
  important: boolean
}

export interface Resource {
  id: string
  title: string
  description: string
  type: string
  category: string
  url: string
  featured: boolean
}

export interface Senior {
  id: string
  name: string
  college: string
  collegeId: string
  branch: string
  batch: string
  company?: string
  role?: string
  bio: string
  expertise: string[]
  responseTime: string
  helpedCount: number
  rating: number
  isOnline: boolean
  lastSeen?: Date
}
