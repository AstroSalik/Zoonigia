// Frontend-only type definitions
// No backend imports - only TypeScript interfaces and types

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

export interface Workshop {
  id: number;
  title: string;
  description: string;
  duration: string;
  maxParticipants: number;
  price: number;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  about: string | null;
  instructorName: string;
  duration: string;
  level: string;
  field: string;
  price: number;
  imageUrl: string | null;
  status: string;
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
  imageUrl: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  imageUrl: string | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactInquiry {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  organization: string | null;
  message: string;
  type: string;
  createdAt: Date;
}

export interface WorkshopRegistration {
  id: number;
  name: string;
  email: string;
  phone: string;
  organization: string;
  role: string;
  experienceLevel: string;
  workshopType: string;
  contactMethod: string;
  lowerClassesRequest: boolean;
  interests: string;
  status: string;
  createdAt: Date;
}

export interface CourseEnrollment {
  id: number;
  userId: string;
  courseId: number;
  enrolledAt: Date;
  completedAt: Date | null;
  progress: number;
}

export interface CampaignParticipant {
  id: number;
  userId: string;
  campaignId: number;
  joinedAt: Date;
  status: string;
}

export interface WorkshopEnrollment {
  id: number;
  userId: string;
  workshopId: number;
  enrolledAt: Date;
  status: string;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  createdAt: Date;
}

// LMS Types
export interface CourseModule {
  id: number;
  courseId: number;
  title: string;
  description: string;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseLesson {
  id: number;
  courseId: number;
  moduleId: number | null;
  title: string;
  content: string;
  videoUrl: string | null;
  orderIndex: number;
  isPreview: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseQuiz {
  id: number;
  courseId: number;
  lessonId: number | null;
  title: string;
  description: string;
  questions: any; // JSON type
  passingScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentProgress {
  id: number;
  userId: string;
  courseId: number;
  lessonId: number;
  completed: boolean;
  completedAt: Date | null;
  timeSpent: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizAttempt {
  id: number;
  userId: string;
  quizId: number;
  answers: any; // JSON type
  score: number;
  passed: boolean;
  attemptedAt: Date;
}

export interface CourseReview {
  id: number;
  userId: string;
  courseId: number;
  rating: number;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseCertificate {
  id: number;
  userId: string;
  courseId: number;
  certificateUrl: string;
  issuedAt: Date;
}

// Insert types for forms (without auto-generated fields)
export type InsertUser = Omit<User, 'createdAt' | 'updatedAt'>;
export type InsertWorkshop = Omit<Workshop, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertCourse = Omit<Course, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertCampaign = Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertBlogPost = Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertContactInquiry = Omit<ContactInquiry, 'id' | 'createdAt'>;
export type InsertWorkshopRegistration = Omit<WorkshopRegistration, 'id' | 'createdAt'>;
export type InsertCourseEnrollment = Omit<CourseEnrollment, 'id' | 'enrolledAt'>;
export type InsertCampaignParticipant = Omit<CampaignParticipant, 'id' | 'joinedAt'>;
export type InsertWorkshopEnrollment = Omit<WorkshopEnrollment, 'id' | 'enrolledAt'>;
export type InsertAchievement = Omit<Achievement, 'id' | 'createdAt'>;
export type InsertCourseModule = Omit<CourseModule, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertCourseLesson = Omit<CourseLesson, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertCourseQuiz = Omit<CourseQuiz, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertStudentProgress = Omit<StudentProgress, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertQuizAttempt = Omit<QuizAttempt, 'id' | 'attemptedAt'>;
export type InsertCourseReview = Omit<CourseReview, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertCourseCertificate = Omit<CourseCertificate, 'id' | 'issuedAt'>;

// Upsert type for auth
export type UpsertUser = Omit<User, 'createdAt' | 'updatedAt'>;