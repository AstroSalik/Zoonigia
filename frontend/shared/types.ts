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
  author: string;
  category: string;
  tags: string[];
  imageUrl: string | null;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Workshop {
  id: number;
  title: string;
  description: string;
  category: string;
  duration: string;
  capacity: number;
  price: number;
  imageUrl: string | null;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  field: string;
  level: string;
  duration: string;
  price: number;
  instructorName: string;
  about: string | null;
  status: string;
  imageUrl: string | null;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Campaign {
  id: number;
  title: string;
  description: string;
  field: string;
  duration: string;
  targetParticipants: number;
  requirements: string;
  timeline: string;
  outcomes: string;
  price: number;
  status: string;
  imageUrl: string | null;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkshopRegistration {
  id: number;
  workshopId: number;
  fullName: string;
  email: string;
  phone: string;
  schoolName: string;
  role: string;
  grade: string | null;
  workshopType: string;
  experienceLevel: string;
  interests: string[];
  contactMethod: string;
  lowerClassesRequest: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactInquiry {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  organization: string | null;
  inquiryType: string;
  subject: string;
  message: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseEnrollment {
  id: number;
  userId: string;
  courseId: number;
  status: string;
  progress: number;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CampaignParticipant {
  id: number;
  userId: string;
  campaignId: number;
  status: string;
  joinedAt: Date;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkshopEnrollment {
  id: number;
  userId: string;
  workshopId: number;
  status: string;
  enrolledAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Insert types for forms
export interface InsertBlogPost {
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  imageUrl?: string | null;
  featured?: boolean;
}

export interface InsertWorkshop {
  title: string;
  description: string;
  category: string;
  duration: string;
  capacity: number;
  price: number;
  imageUrl?: string | null;
  featured?: boolean;
}

export interface InsertCourse {
  title: string;
  description: string;
  field: string;
  level: string;
  duration: string;
  price: number;
  instructorName: string;
  about?: string | null;
  status?: string;
  imageUrl?: string | null;
  featured?: boolean;
}

export interface InsertCampaign {
  title: string;
  description: string;
  field: string;
  duration: string;
  targetParticipants: number;
  requirements: string;
  timeline: string;
  outcomes: string;
  price: number;
  status?: string;
  imageUrl?: string | null;
  featured?: boolean;
}

export interface InsertWorkshopRegistration {
  workshopId: number;
  fullName: string;
  email: string;
  phone: string;
  schoolName: string;
  role: string;
  grade?: string | null;
  workshopType: string;
  experienceLevel: string;
  interests: string[];
  contactMethod: string;
  lowerClassesRequest: boolean;
  status?: string;
}

export interface InsertContactInquiry {
  name: string;
  email: string;
  phone?: string | null;
  organization?: string | null;
  inquiryType: string;
  subject: string;
  message: string;
  status?: string;
}

export interface InsertCourseEnrollment {
  userId: string;
  courseId: number;
  status?: string;
  progress?: number;
}

export interface InsertCampaignParticipant {
  userId: string;
  campaignId: number;
  status?: string;
}

export interface InsertWorkshopEnrollment {
  userId: string;
  workshopId: number;
  status?: string;
}