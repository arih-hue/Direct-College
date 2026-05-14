export interface SocialLinks {
  instagram?: string
  discord?: string
  whatsapp?: string
  telegram?: string
  linkedin?: string
  youtube?: string
  reddit?: string
}

export interface College {
  id: string
  name: string
  shortName: string
  location: string
  state: string
  type: 'IIT' | 'NIT' | 'IIIT' | 'GFTI' | 'State'
  ranking: number
  established: number
  avgPackage: number
  medianPackage: number
  highestPackage: number
  placementRate: number
  fees: number
  rating: number
  reviewCount: number
  logoUrl?: string
  bannerUrl?: string
  accreditations: string[]
  facilities: string[]
  socialLinks?: SocialLinks
}

export interface Branch {
  id: string
  name: string
  shortName: string
  category: 'CS' | 'ECE' | 'EE' | 'ME' | 'CE' | 'CH' | 'Other'
}

export interface Prediction {
  college: College
  branch: Branch
  chance: 'SAFE' | 'MODERATE' | 'DREAM'
  closingRank: number
  expectedRank: number
}

export interface Review {
  id: string
  collegeId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  title: string
  content: string
  pros: string[]
  cons: string[]
  placementReality: string
  wouldRecommend: boolean
  helpfulCount: number
  createdAt: Date
  verified: boolean
  batch: string
  branch: string
}

export interface Mentor {
  id: string
  name: string
  avatar?: string
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

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  jeeRank?: number
  category: 'General' | 'OBC-NCL' | 'SC' | 'ST' | 'EWS' | 'PwD'
  gender: 'Male' | 'Female' | 'Other'
  homeState: string
  preferredBranches: string[]
  budget?: number
  priorityList: string[]
}

export interface Deadline {
  id: string
  name: string
  date: Date
  type: 'JoSAA' | 'CSAB' | 'State' | 'Other'
  description: string
  important: boolean
}

export interface Resource {
  id: string
  title: string
  description: string
  type: 'guide' | 'video' | 'download' | 'article'
  category: string
  url: string
  thumbnail?: string
  featured: boolean
}

export interface Senior {
  id: string
  name: string
  avatar?: string
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

export interface ChatMessage {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
  read: boolean
}
