// Frontend-only types without backend dependencies
export interface User {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpsertUser {
  id: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  profileImageUrl?: string | null;
  isAdmin?: boolean;
}

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  authorId: string;
  authorName: string;
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertBlogPost {
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  authorId: string;
  authorName: string;
  published?: boolean;
  publishedAt?: Date | null;
}

export interface Workshop {
  id: number;
  title: string;
  description: string;
  duration: string;
  price: number;
  maxParticipants: number;
  location: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertWorkshop {
  title: string;
  description: string;
  duration: string;
  price: number;
  maxParticipants: number;
  location: string;
  imageUrl: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  instructorName: string;
  duration: string;
  level: string;
  price: number;
  field: string;
  imageUrl: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertCourse {
  title: string;
  description: string;
  instructorName: string;
  duration: string;
  level: string;
  price: number;
  field: string;
  imageUrl: string;
  status?: string;
}

export interface Campaign {
  id: number;
  title: string;
  description: string;
  field: string;
  duration: string;
  price: number;
  targetParticipants: number;
  requirements: string;
  timeline: string;
  outcomes: string;
  imageUrl: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertCampaign {
  title: string;
  description: string;
  field: string;
  duration: string;
  price: number;
  targetParticipants: number;
  requirements: string;
  timeline: string;
  outcomes: string;
  imageUrl: string;
  status?: string;
}

export interface ContactInquiry {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertContactInquiry {
  name: string;
  email: string;
  subject: string;
  message: string;
  type: string;
}

export interface WorkshopRegistration {
  id: number;
  schoolName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  studentCount: number;
  grades: string;
  workshopType: string;
  experienceLevel: string;
  interests: string;
  contactMethod: string;
  lowerClassesRequest: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertWorkshopRegistration {
  schoolName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  studentCount: number;
  grades: string;
  workshopType: string;
  experienceLevel: string;
  interests: string;
  contactMethod: string;
  lowerClassesRequest: string;
  status?: string;
}

export interface CampaignEnrollment {
  id: number;
  campaignId: number;
  userName: string;
  userEmail: string;
  userPhone: string;
  userAge: number;
  userGrade: string;
  userSchool: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertCampaignEnrollment {
  campaignId: number;
  userName: string;
  userEmail: string;
  userPhone: string;
  userAge: number;
  userGrade: string;
  userSchool: string;
}