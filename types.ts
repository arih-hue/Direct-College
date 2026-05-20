export interface College {
  id: string;
  name: string;
  shortName: string;
  location: string;
  state: string;
  type: string;
  ranking: number;
  established: number;
  avgPackage: number;
  medianPackage: number;
  highestPackage: number;
  placementRate: number;
  fees: number;
  rating: number;
  reviewCount: number;
  accreditations: string[];
  facilities: string[];
  socialLinks: {
    instagram?: string;
    discord?: string;
    whatsapp?: string;
    telegram?: string;
    linkedin?: string;
    youtube?: string;
    reddit?: string;
  };
}

export interface Branch {
  id: string;
  name: string;
  shortName: string;
  category: string;
}

export interface Review {
  id: string;
  collegeId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  placementReality: string;
  wouldRecommend: boolean;
  helpfulCount: number;
  createdAt: Date;
  verified: boolean;
  batch: string;
  branch: string;
}

export interface Mentor {
  id: string;
  name: string;
  college: string;
  branch: string;
  company: string;
  role: string;
  expertise: string[];
  sessionCount: number;
  rating: number;
  pricePerSession: number;
  availability: string[];
}

export interface Deadline {
  id: string;
  name: string;
  date: Date;
  type: string;
  description: string;
  important: boolean;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  url: string;
  featured: boolean;
}

export interface Senior {
  id: string;
  name: string;
  college: string;
  collegeId: string;
  branch: string;
  batch: string;
  company?: string;
  role?: string;
  bio: string;
  expertise: string[];
  responseTime: string;
  helpedCount: number;
  rating: number;
  isOnline: boolean;
  lastSeen?: Date;
}
