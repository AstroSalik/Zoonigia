import {
  users,
  workshops,
  courses,
  campaigns,
  blogPosts,
  contactInquiries,
  workshopRegistrations,
  campaignEnrollments,
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
  type ContactInquiry,
  type InsertContactInquiry,
  type WorkshopRegistration,
  type InsertWorkshopRegistration,
  type CampaignEnrollment,
  type InsertCampaignEnrollment,

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
  updateWorkshop(id: number, workshop: Partial<Workshop>): Promise<Workshop>;
  deleteWorkshop(id: number): Promise<void>;
  // Workshop enrollments not implemented yet
  getUserWorkshops(userId: string): Promise<Workshop[]>;
  
  // Workshop registration operations
  createWorkshopRegistration(registration: InsertWorkshopRegistration): Promise<WorkshopRegistration>;
  getWorkshopRegistrations(): Promise<WorkshopRegistration[]>;
  updateWorkshopRegistrationStatus(id: number, status: string): Promise<WorkshopRegistration>;
  deleteWorkshopRegistration(id: number): Promise<void>;
  
  // Course operations
  getCourses(): Promise<Course[]>;
  getCourseById(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, course: Partial<Course>): Promise<Course>;
  deleteCourse(id: number): Promise<void>;
  // Course enrollments not implemented yet
  getUserCourses(userId: string): Promise<Course[]>;
  
  // Campaign operations
  getCampaigns(): Promise<Campaign[]>;
  getCampaignById(id: number): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: number, campaign: Partial<Campaign>): Promise<Campaign>;
  deleteCampaign(id: number): Promise<void>;
  joinCampaign(enrollment: InsertCampaignEnrollment): Promise<CampaignEnrollment>;
  getUserCampaigns(userId: string): Promise<Campaign[]>;
  
  // Blog operations
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPostById(id: number): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<BlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: number): Promise<void>;
  
  // Achievement operations not implemented yet
  
  // Contact operations
  createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry>;
  getContactInquiries(): Promise<ContactInquiry[]>;
  deleteContactInquiry(id: number): Promise<void>;
  
  // LMS operations not implemented yet
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

  async updateWorkshop(id: number, workshop: Partial<Workshop>): Promise<Workshop> {
    const [updatedWorkshop] = await db
      .update(workshops)
      .set({ ...workshop, updatedAt: new Date() })
      .where(eq(workshops.id, id))
      .returning();
    return updatedWorkshop;
  }

  async deleteWorkshop(id: number): Promise<void> {
    await db.delete(workshops).where(eq(workshops.id, id));
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
      // Workshop enrollments not implemented yet
      .where(eq(workshops.id, parseInt(userId)));
  }

  // Workshop registration operations
  async createWorkshopRegistration(registration: InsertWorkshopRegistration): Promise<WorkshopRegistration> {
    const [newRegistration] = await db
      .insert(workshopRegistrations)
      .values(registration)
      .returning();
    return newRegistration;
  }

  async getWorkshopRegistrations(): Promise<WorkshopRegistration[]> {
    return await db
      .select()
      .from(workshopRegistrations)
      .orderBy(desc(workshopRegistrations.createdAt));
  }

  async updateWorkshopRegistrationStatus(id: number, status: string): Promise<WorkshopRegistration> {
    const [updated] = await db
      .update(workshopRegistrations)
      .set({ status, updatedAt: new Date() })
      .where(eq(workshopRegistrations.id, id))
      .returning();
    return updated;
  }

  async deleteWorkshopRegistration(id: number): Promise<void> {
    await db.delete(workshopRegistrations).where(eq(workshopRegistrations.id, id));
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

  async updateCourse(id: number, course: Partial<Course>): Promise<Course> {
    const [updatedCourse] = await db
      .update(courses)
      .set({ ...course, updatedAt: new Date() })
      .where(eq(courses.id, id))
      .returning();
    return updatedCourse;
  }

  async deleteCourse(id: number): Promise<void> {
    await db.delete(courses).where(eq(courses.id, id));
  }

  // Course enrollments not implemented yet

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
      // Course enrollments not implemented yet
      .where(eq(courses.id, parseInt(userId)));
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

  async updateCampaign(id: number, campaign: Partial<Campaign>): Promise<Campaign> {
    const [updatedCampaign] = await db
      .update(campaigns)
      .set({ ...campaign, updatedAt: new Date() })
      .where(eq(campaigns.id, id))
      .returning();
    return updatedCampaign;
  }

  async deleteCampaign(id: number): Promise<void> {
    await db.delete(campaigns).where(eq(campaigns.id, id));
  }

  async joinCampaign(enrollment: InsertCampaignEnrollment): Promise<CampaignEnrollment> {
    const [newEnrollment] = await db.insert(campaignEnrollments).values(enrollment).returning();
    return newEnrollment;
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
      .innerJoin(campaignEnrollments, eq(campaigns.id, campaignEnrollments.campaignId))
      .where(eq(campaignEnrollments.userEmail, userId));
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

  async updateBlogPost(id: number, post: Partial<BlogPost>): Promise<BlogPost> {
    const [updatedPost] = await db
      .update(blogPosts)
      .set({ ...post, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
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

  async deleteContactInquiry(id: number): Promise<void> {
    await db.delete(contactInquiries).where(eq(contactInquiries.id, id));
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
