import {
  users,
  workshops,
  courses,
  campaigns,
  blogPosts,
  achievements,
  contactInquiries,
  workshopEnrollments,
  courseEnrollments,
  campaignParticipants,
  courseModules,
  courseLessons,
  courseQuizzes,
  studentProgress,
  quizAttempts,
  courseReviews,
  courseCertificates,
  type User,
  type UpsertUser,
  type Workshop,
  type InsertWorkshop,
  type Course,
  type InsertCourse,
  type Campaign,
  type InsertCampaign,
  type BlogPost,
  type InsertBlogPost,
  type Achievement,
  type InsertAchievement,
  type ContactInquiry,
  type InsertContactInquiry,
  type WorkshopEnrollment,
  type InsertWorkshopEnrollment,
  type CourseEnrollment,
  type InsertCourseEnrollment,
  type CampaignParticipant,
  type InsertCampaignParticipant,
  type CourseModule,
  type InsertCourseModule,
  type CourseLesson,
  type InsertCourseLesson,
  type CourseQuiz,
  type InsertCourseQuiz,
  type StudentProgress,
  type InsertStudentProgress,
  type QuizAttempt,
  type InsertQuizAttempt,
  type CourseReview,
  type InsertCourseReview,
  type CourseCertificate,
  type InsertCourseCertificate,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Admin operations
  getAllUsers(): Promise<User[]>;
  updateUserAdminStatus(userId: string, isAdmin: boolean): Promise<User>;
  deleteUser(userId: string): Promise<void>;
  
  // Workshop operations
  getWorkshops(): Promise<Workshop[]>;
  getWorkshopById(id: number): Promise<Workshop | undefined>;
  createWorkshop(workshop: InsertWorkshop): Promise<Workshop>;
  enrollInWorkshop(enrollment: InsertWorkshopEnrollment): Promise<WorkshopEnrollment>;
  getUserWorkshops(userId: string): Promise<Workshop[]>;
  
  // Course operations
  getCourses(): Promise<Course[]>;
  getCourseById(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  enrollInCourse(enrollment: InsertCourseEnrollment): Promise<CourseEnrollment>;
  getUserCourses(userId: string): Promise<Course[]>;
  
  // Campaign operations
  getCampaigns(): Promise<Campaign[]>;
  getCampaignById(id: number): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  joinCampaign(participant: InsertCampaignParticipant): Promise<CampaignParticipant>;
  getUserCampaigns(userId: string): Promise<Campaign[]>;
  
  // Blog operations
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPostById(id: number): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  
  // Achievement operations
  getAchievements(): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  
  // Contact operations
  createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry>;
  getContactInquiries(): Promise<ContactInquiry[]>;
  
  // LMS operations
  // Course modules
  getCourseModules(courseId: number): Promise<CourseModule[]>;
  createCourseModule(module: InsertCourseModule): Promise<CourseModule>;
  updateCourseModule(id: number, module: Partial<CourseModule>): Promise<CourseModule>;
  deleteCourseModule(id: number): Promise<void>;
  
  // Course lessons
  getCourseLessons(courseId: number): Promise<CourseLesson[]>;
  getCourseLessonsByModule(moduleId: number): Promise<CourseLesson[]>;
  getLessonById(id: number): Promise<CourseLesson | undefined>;
  createCourseLesson(lesson: InsertCourseLesson): Promise<CourseLesson>;
  updateCourseLesson(id: number, lesson: Partial<CourseLesson>): Promise<CourseLesson>;
  deleteCourseLesson(id: number): Promise<void>;
  
  // Course quizzes
  getCourseQuizzes(courseId: number): Promise<CourseQuiz[]>;
  getQuizById(id: number): Promise<CourseQuiz | undefined>;
  createCourseQuiz(quiz: InsertCourseQuiz): Promise<CourseQuiz>;
  updateCourseQuiz(id: number, quiz: Partial<CourseQuiz>): Promise<CourseQuiz>;
  deleteQuiz(id: number): Promise<void>;
  
  // Student progress
  getStudentProgress(userId: string, courseId: number): Promise<StudentProgress[]>;
  getStudentProgressByLesson(userId: string, lessonId: number): Promise<StudentProgress | undefined>;
  createStudentProgress(progress: InsertStudentProgress): Promise<StudentProgress>;
  updateStudentProgress(id: number, progress: Partial<StudentProgress>): Promise<StudentProgress>;
  
  // Quiz attempts
  getQuizAttempts(userId: string, quizId: number): Promise<QuizAttempt[]>;
  createQuizAttempt(attempt: InsertQuizAttempt): Promise<QuizAttempt>;
  
  // Course reviews
  getCourseReviews(courseId: number): Promise<CourseReview[]>;
  createCourseReview(review: InsertCourseReview): Promise<CourseReview>;
  updateCourseReview(id: number, review: Partial<CourseReview>): Promise<CourseReview>;
  deleteCourseReview(id: number): Promise<void>;
  
  // Course certificates
  getUserCertificates(userId: string): Promise<CourseCertificate[]>;
  createCourseCertificate(certificate: InsertCourseCertificate): Promise<CourseCertificate>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Admin operations
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async updateUserAdminStatus(userId: string, isAdmin: boolean): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ isAdmin, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async deleteUser(userId: string): Promise<void> {
    await db.delete(users).where(eq(users.id, userId));
  }

  // Workshop operations
  async getWorkshops(): Promise<Workshop[]> {
    return await db.select().from(workshops).where(eq(workshops.isActive, true)).orderBy(desc(workshops.startDate));
  }

  async getWorkshopById(id: number): Promise<Workshop | undefined> {
    const [workshop] = await db.select().from(workshops).where(eq(workshops.id, id));
    return workshop;
  }

  async createWorkshop(workshop: InsertWorkshop): Promise<Workshop> {
    const [newWorkshop] = await db.insert(workshops).values(workshop).returning();
    return newWorkshop;
  }

  async enrollInWorkshop(enrollment: InsertWorkshopEnrollment): Promise<WorkshopEnrollment> {
    const [newEnrollment] = await db.insert(workshopEnrollments).values(enrollment).returning();
    return newEnrollment;
  }

  async getUserWorkshops(userId: string): Promise<Workshop[]> {
    return await db
      .select({
        id: workshops.id,
        title: workshops.title,
        description: workshops.description,
        type: workshops.type,
        startDate: workshops.startDate,
        endDate: workshops.endDate,
        location: workshops.location,
        isVirtual: workshops.isVirtual,
        maxParticipants: workshops.maxParticipants,
        currentParticipants: workshops.currentParticipants,
        price: workshops.price,
        imageUrl: workshops.imageUrl,
        isActive: workshops.isActive,
        createdAt: workshops.createdAt,
        updatedAt: workshops.updatedAt,
      })
      .from(workshops)
      .innerJoin(workshopEnrollments, eq(workshops.id, workshopEnrollments.workshopId))
      .where(eq(workshopEnrollments.userId, userId));
  }

  // Course operations
  async getCourses(): Promise<Course[]> {
    return await db.select().from(courses).where(eq(courses.isActive, true)).orderBy(desc(courses.createdAt));
  }

  async getCourseById(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }

  async enrollInCourse(enrollment: InsertCourseEnrollment): Promise<CourseEnrollment> {
    const [newEnrollment] = await db.insert(courseEnrollments).values(enrollment).returning();
    return newEnrollment;
  }

  async getUserCourses(userId: string): Promise<Course[]> {
    return await db
      .select({
        id: courses.id,
        title: courses.title,
        description: courses.description,
        field: courses.field,
        level: courses.level,
        duration: courses.duration,
        price: courses.price,
        imageUrl: courses.imageUrl,
        isActive: courses.isActive,
        createdAt: courses.createdAt,
        updatedAt: courses.updatedAt,
      })
      .from(courses)
      .innerJoin(courseEnrollments, eq(courses.id, courseEnrollments.courseId))
      .where(eq(courseEnrollments.userId, userId));
  }

  // Campaign operations
  async getCampaigns(): Promise<Campaign[]> {
    return await db.select().from(campaigns).orderBy(desc(campaigns.createdAt));
  }

  async getCampaignById(id: number): Promise<Campaign | undefined> {
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, id));
    return campaign;
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const [newCampaign] = await db.insert(campaigns).values(campaign).returning();
    return newCampaign;
  }

  async joinCampaign(participant: InsertCampaignParticipant): Promise<CampaignParticipant> {
    const [newParticipant] = await db.insert(campaignParticipants).values(participant).returning();
    return newParticipant;
  }

  async getUserCampaigns(userId: string): Promise<Campaign[]> {
    return await db
      .select({
        id: campaigns.id,
        title: campaigns.title,
        description: campaigns.description,
        type: campaigns.type,
        startDate: campaigns.startDate,
        endDate: campaigns.endDate,
        partner: campaigns.partner,
        status: campaigns.status,
        progress: campaigns.progress,
        maxParticipants: campaigns.maxParticipants,
        currentParticipants: campaigns.currentParticipants,
        imageUrl: campaigns.imageUrl,
        createdAt: campaigns.createdAt,
        updatedAt: campaigns.updatedAt,
      })
      .from(campaigns)
      .innerJoin(campaignParticipants, eq(campaigns.id, campaignParticipants.campaignId))
      .where(eq(campaignParticipants.userId, userId));
  }

  // Blog operations
  async getBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).where(eq(blogPosts.isPublished, true)).orderBy(desc(blogPosts.publishedAt));
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values(post).returning();
    return newPost;
  }

  // Achievement operations
  async getAchievements(): Promise<Achievement[]> {
    return await db.select().from(achievements).orderBy(desc(achievements.achievedAt));
  }

  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const [newAchievement] = await db.insert(achievements).values(achievement).returning();
    return newAchievement;
  }

  // Contact operations
  async createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry> {
    const [newInquiry] = await db.insert(contactInquiries).values(inquiry).returning();
    return newInquiry;
  }

  async getContactInquiries(): Promise<ContactInquiry[]> {
    return await db.select().from(contactInquiries).orderBy(desc(contactInquiries.createdAt));
  }

  // LMS operations
  // Course modules
  async getCourseModules(courseId: number): Promise<CourseModule[]> {
    return await db.select().from(courseModules)
      .where(eq(courseModules.courseId, courseId))
      .orderBy(courseModules.orderIndex);
  }

  async createCourseModule(module: InsertCourseModule): Promise<CourseModule> {
    const [newModule] = await db.insert(courseModules).values(module).returning();
    return newModule;
  }

  async updateCourseModule(id: number, module: Partial<CourseModule>): Promise<CourseModule> {
    const [updatedModule] = await db.update(courseModules)
      .set(module)
      .where(eq(courseModules.id, id))
      .returning();
    return updatedModule;
  }

  async deleteCourseModule(id: number): Promise<void> {
    await db.delete(courseModules).where(eq(courseModules.id, id));
  }

  // Course lessons
  async getCourseLessons(courseId: number): Promise<CourseLesson[]> {
    return await db.select().from(courseLessons)
      .where(eq(courseLessons.courseId, courseId))
      .orderBy(courseLessons.orderIndex);
  }

  async getCourseLessonsByModule(moduleId: number): Promise<CourseLesson[]> {
    return await db.select().from(courseLessons)
      .where(eq(courseLessons.moduleId, moduleId))
      .orderBy(courseLessons.orderIndex);
  }

  async getLessonById(id: number): Promise<CourseLesson | undefined> {
    const [lesson] = await db.select().from(courseLessons).where(eq(courseLessons.id, id));
    return lesson;
  }

  async createCourseLesson(lesson: InsertCourseLesson): Promise<CourseLesson> {
    const [newLesson] = await db.insert(courseLessons).values(lesson).returning();
    return newLesson;
  }

  async updateCourseLesson(id: number, lesson: Partial<CourseLesson>): Promise<CourseLesson> {
    const [updatedLesson] = await db.update(courseLessons)
      .set(lesson)
      .where(eq(courseLessons.id, id))
      .returning();
    return updatedLesson;
  }

  async deleteCourseLesson(id: number): Promise<void> {
    await db.delete(courseLessons).where(eq(courseLessons.id, id));
  }

  // Course quizzes
  async getCourseQuizzes(courseId: number): Promise<CourseQuiz[]> {
    return await db.select().from(courseQuizzes)
      .where(eq(courseQuizzes.courseId, courseId));
  }

  async getQuizById(id: number): Promise<CourseQuiz | undefined> {
    const [quiz] = await db.select().from(courseQuizzes).where(eq(courseQuizzes.id, id));
    return quiz;
  }

  async createCourseQuiz(quiz: InsertCourseQuiz): Promise<CourseQuiz> {
    const [newQuiz] = await db.insert(courseQuizzes).values(quiz).returning();
    return newQuiz;
  }

  async updateCourseQuiz(id: number, quiz: Partial<CourseQuiz>): Promise<CourseQuiz> {
    const [updatedQuiz] = await db.update(courseQuizzes)
      .set(quiz)
      .where(eq(courseQuizzes.id, id))
      .returning();
    return updatedQuiz;
  }

  async deleteQuiz(id: number): Promise<void> {
    await db.delete(courseQuizzes).where(eq(courseQuizzes.id, id));
  }

  // Student progress
  async getStudentProgress(userId: string, courseId: number): Promise<StudentProgress[]> {
    return await db.select().from(studentProgress)
      .where(and(
        eq(studentProgress.userId, userId),
        eq(studentProgress.courseId, courseId)
      ));
  }

  async getStudentProgressByLesson(userId: string, lessonId: number): Promise<StudentProgress | undefined> {
    const [progress] = await db.select().from(studentProgress)
      .where(and(
        eq(studentProgress.userId, userId),
        eq(studentProgress.lessonId, lessonId)
      ));
    return progress;
  }

  async createStudentProgress(progress: InsertStudentProgress): Promise<StudentProgress> {
    const [newProgress] = await db.insert(studentProgress).values(progress).returning();
    return newProgress;
  }

  async updateStudentProgress(id: number, progress: Partial<StudentProgress>): Promise<StudentProgress> {
    const [updatedProgress] = await db.update(studentProgress)
      .set(progress)
      .where(eq(studentProgress.id, id))
      .returning();
    return updatedProgress;
  }

  // Quiz attempts
  async getQuizAttempts(userId: string, quizId: number): Promise<QuizAttempt[]> {
    return await db.select().from(quizAttempts)
      .where(and(
        eq(quizAttempts.userId, userId),
        eq(quizAttempts.quizId, quizId)
      ))
      .orderBy(desc(quizAttempts.completedAt));
  }

  async createQuizAttempt(attempt: InsertQuizAttempt): Promise<QuizAttempt> {
    const [newAttempt] = await db.insert(quizAttempts).values(attempt).returning();
    return newAttempt;
  }

  // Course reviews
  async getCourseReviews(courseId: number): Promise<CourseReview[]> {
    return await db.select().from(courseReviews)
      .where(eq(courseReviews.courseId, courseId))
      .orderBy(desc(courseReviews.createdAt));
  }

  async createCourseReview(review: InsertCourseReview): Promise<CourseReview> {
    const [newReview] = await db.insert(courseReviews).values(review).returning();
    return newReview;
  }

  async updateCourseReview(id: number, review: Partial<CourseReview>): Promise<CourseReview> {
    const [updatedReview] = await db.update(courseReviews)
      .set(review)
      .where(eq(courseReviews.id, id))
      .returning();
    return updatedReview;
  }

  async deleteCourseReview(id: number): Promise<void> {
    await db.delete(courseReviews).where(eq(courseReviews.id, id));
  }

  // Course certificates
  async getUserCertificates(userId: string): Promise<CourseCertificate[]> {
    return await db.select().from(courseCertificates)
      .where(eq(courseCertificates.userId, userId))
      .orderBy(desc(courseCertificates.issuedAt));
  }

  async createCourseCertificate(certificate: InsertCourseCertificate): Promise<CourseCertificate> {
    const [newCertificate] = await db.insert(courseCertificates).values(certificate).returning();
    return newCertificate;
  }
}

export const storage = new DatabaseStorage();
