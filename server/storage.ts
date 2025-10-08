import {
  users,
  workshops,
  courses,
  campaigns,
  blogPosts,
  achievements,
  contactInquiries,
  loveMessages,
  workshopEnrollments,
  courseEnrollments,
  campaignParticipants,
  campaignTeamRegistrations,
  courseModules,
  courseLessons,
  courseQuizzes,
  studentProgress,
  quizAttempts,
  courseReviews,
  courseCertificates,
  userPoints,
  badges,
  userBadges,
  pointTransactions,
  forumThreads,
  forumReplies,
  forumVotes,
  resources,
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
  type LoveMessage,
  type InsertLoveMessage,
  type WorkshopEnrollment,
  type InsertWorkshopEnrollment,
  type CourseEnrollment,
  type InsertCourseEnrollment,
  type CampaignParticipant,
  type InsertCampaignParticipant,
  type CampaignTeamRegistration,
  type InsertCampaignTeamRegistration,
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
  workshopRegistrations,
  type WorkshopRegistration,
  type InsertWorkshopRegistration,
  invoices,
  type Invoice,
  type InsertInvoice,
  refundRequests,
  type RefundRequest,
  type InsertRefundRequest,
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
  enrollInWorkshop(enrollment: InsertWorkshopEnrollment): Promise<WorkshopEnrollment>;
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
  enrollInCourse(enrollment: InsertCourseEnrollment): Promise<CourseEnrollment>;
  getUserCourses(userId: string): Promise<Course[]>;
  getCourseEnrollment(userId: string, courseId: number): Promise<CourseEnrollment | undefined>;
  
  // Campaign operations
  getCampaigns(): Promise<Campaign[]>;
  getCampaignById(id: number): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: number, campaign: Partial<Campaign>): Promise<Campaign>;
  deleteCampaign(id: number): Promise<void>;
  joinCampaign(participant: InsertCampaignParticipant): Promise<CampaignParticipant>;
  getUserCampaigns(userId: string): Promise<Campaign[]>;
  getCampaignParticipant(userId: string, campaignId: number): Promise<CampaignParticipant | undefined>;
  
  // Blog operations
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPostById(id: number): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<BlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: number): Promise<void>;
  
  // Achievement operations
  getAchievements(): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  
  // Contact operations
  createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry>;
  getContactInquiries(): Promise<ContactInquiry[]>;
  deleteContactInquiry(id: number): Promise<void>;
  
  // Love message operations
  createLoveMessage(message: InsertLoveMessage): Promise<LoveMessage>;
  getLoveMessages(): Promise<LoveMessage[]>;
  markLoveMessageAsRead(id: number): Promise<LoveMessage>;
  
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
  
  // Invoices
  getUserInvoices(userId: string): Promise<Invoice[]>;
  getInvoiceById(id: number): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  
  // Refund requests
  getUserRefundRequests(userId: string): Promise<RefundRequest[]>;
  getAllRefundRequests(): Promise<RefundRequest[]>;
  getRefundRequestById(id: number): Promise<RefundRequest | undefined>;
  createRefundRequest(request: InsertRefundRequest): Promise<RefundRequest>;
  updateRefundRequest(id: number, updates: Partial<InsertRefundRequest>): Promise<RefundRequest>;
  
  // Featured items operations
  getFeaturedItems(): Promise<{ courses: Course[]; campaigns: Campaign[] }>;
  
  // Campaign team registration operations
  createCampaignTeamRegistration(registration: InsertCampaignTeamRegistration): Promise<CampaignTeamRegistration>;
  getCampaignTeamRegistrations(campaignId: number): Promise<CampaignTeamRegistration[]>;
  getAllCampaignTeamRegistrations(): Promise<CampaignTeamRegistration[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // Use PostgreSQL UPSERT for better performance
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.email,
        set: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          isAdmin: userData.isAdmin,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Admin operations with pagination
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt)).limit(1000);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return user;
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
    const [workshop] = await db.select().from(workshops).where(eq(workshops.id, id)).limit(1);
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
      .innerJoin(workshopEnrollments, eq(workshops.id, workshopEnrollments.workshopId))
      .where(eq(workshopEnrollments.userId, userId));
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

  async enrollInCourse(enrollment: InsertCourseEnrollment): Promise<CourseEnrollment> {
    const [newEnrollment] = await db.insert(courseEnrollments).values(enrollment).returning();
    return newEnrollment;
  }

  async getUserCourses(userId: string): Promise<Course[]> {
    return await db
      .select()
      .from(courses)
      .innerJoin(courseEnrollments, eq(courses.id, courseEnrollments.courseId))
      .where(eq(courseEnrollments.userId, userId))
      .then(results => results.map(r => r.courses));
  }

  async getCourseEnrollment(userId: string, courseId: number): Promise<CourseEnrollment | undefined> {
    const [enrollment] = await db
      .select()
      .from(courseEnrollments)
      .where(and(eq(courseEnrollments.userId, userId), eq(courseEnrollments.courseId, courseId)))
      .limit(1);
    return enrollment;
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

  async joinCampaign(participant: InsertCampaignParticipant): Promise<CampaignParticipant> {
    const [newParticipant] = await db.insert(campaignParticipants).values(participant).returning();
    return newParticipant;
  }

  async getUserCampaigns(userId: string): Promise<Campaign[]> {
    return await db
      .select()
      .from(campaigns)
      .innerJoin(campaignParticipants, eq(campaigns.id, campaignParticipants.campaignId))
      .where(eq(campaignParticipants.userId, userId))
      .then(results => results.map(r => r.campaigns));
  }

  async getCampaignParticipant(userId: string, campaignId: number): Promise<CampaignParticipant | undefined> {
    const [participant] = await db
      .select()
      .from(campaignParticipants)
      .where(and(eq(campaignParticipants.userId, userId), eq(campaignParticipants.campaignId, campaignId)))
      .limit(1);
    return participant;
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

  // Love message operations
  async createLoveMessage(message: InsertLoveMessage): Promise<LoveMessage> {
    const [newMessage] = await db.insert(loveMessages).values(message).returning();
    return newMessage;
  }

  async getLoveMessages(): Promise<LoveMessage[]> {
    return await db.select().from(loveMessages).orderBy(desc(loveMessages.createdAt));
  }

  async markLoveMessageAsRead(id: number): Promise<LoveMessage> {
    const [updatedMessage] = await db
      .update(loveMessages)
      .set({ isRead: true })
      .where(eq(loveMessages.id, id))
      .returning();
    return updatedMessage;
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
  
  // Invoices
  async getUserInvoices(userId: string): Promise<Invoice[]> {
    return await db.select().from(invoices)
      .where(eq(invoices.userId, userId))
      .orderBy(desc(invoices.createdAt));
  }

  async getInvoiceById(id: number): Promise<Invoice | undefined> {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    return invoice;
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const [newInvoice] = await db.insert(invoices).values(invoice).returning();
    return newInvoice;
  }
  
  // Refund requests
  async getUserRefundRequests(userId: string): Promise<RefundRequest[]> {
    return await db.select().from(refundRequests)
      .where(eq(refundRequests.userId, userId))
      .orderBy(desc(refundRequests.createdAt));
  }

  async getAllRefundRequests(): Promise<RefundRequest[]> {
    return await db.select().from(refundRequests)
      .orderBy(desc(refundRequests.createdAt));
  }

  async getRefundRequestById(id: number): Promise<RefundRequest | undefined> {
    const [request] = await db.select().from(refundRequests).where(eq(refundRequests.id, id));
    return request;
  }

  async createRefundRequest(request: InsertRefundRequest): Promise<RefundRequest> {
    const [newRequest] = await db.insert(refundRequests).values(request).returning();
    return newRequest;
  }

  async updateRefundRequest(id: number, updates: Partial<InsertRefundRequest>): Promise<RefundRequest> {
    const [updatedRequest] = await db.update(refundRequests)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(refundRequests.id, id))
      .returning();
    return updatedRequest;
  }
  
  // Featured items operations
  async getFeaturedItems(): Promise<{ courses: Course[]; campaigns: Campaign[] }> {
    const featuredCourses = await db.select().from(courses)
      .where(eq(courses.isFeatured, true))
      .orderBy(courses.featuredOrder);
    
    const featuredCampaigns = await db.select().from(campaigns)
      .where(eq(campaigns.isFeatured, true))
      .orderBy(campaigns.featuredOrder);
    
    return {
      courses: featuredCourses,
      campaigns: featuredCampaigns
    };
  }
  
  // Campaign team registration operations
  async createCampaignTeamRegistration(registration: InsertCampaignTeamRegistration): Promise<CampaignTeamRegistration> {
    const [newRegistration] = await db.insert(campaignTeamRegistrations).values(registration).returning();
    return newRegistration;
  }
  
  async getCampaignTeamRegistrations(campaignId: number): Promise<CampaignTeamRegistration[]> {
    return await db.select().from(campaignTeamRegistrations)
      .where(eq(campaignTeamRegistrations.campaignId, campaignId))
      .orderBy(desc(campaignTeamRegistrations.createdAt));
  }
  
  async getAllCampaignTeamRegistrations(): Promise<CampaignTeamRegistration[]> {
    return await db.select().from(campaignTeamRegistrations)
      .orderBy(desc(campaignTeamRegistrations.createdAt));
  }

  // ==================== GAMIFICATION & LEADERBOARD OPERATIONS ====================
  
  async getUserPoints(userId: string) {
    let [userPointsRecord] = await db.select().from(userPoints)
      .where(eq(userPoints.userId, userId));
    
    // Create initial points record if doesn't exist
    if (!userPointsRecord) {
      [userPointsRecord] = await db.insert(userPoints)
        .values({ userId, totalPoints: 0, level: 1 })
        .returning();
    }
    
    return userPointsRecord;
  }

  async getLeaderboard(limit: number = 100) {
    const leaderboardData = await db.select({
      userId: userPoints.userId,
      totalPoints: userPoints.totalPoints,
      level: userPoints.level,
      currentStreak: userPoints.currentStreak,
      longestStreak: userPoints.longestStreak,
      firstName: users.firstName,
      lastName: users.lastName,
      profileImageUrl: users.profileImageUrl,
    })
    .from(userPoints)
    .leftJoin(users, eq(userPoints.userId, users.id))
    .orderBy(desc(userPoints.totalPoints))
    .limit(limit);

    return leaderboardData;
  }

  async getUserBadges(userId: string) {
    const earnedBadges = await db.select({
      id: userBadges.id,
      earnedAt: userBadges.earnedAt,
      progress: userBadges.progress,
      badgeId: badges.id,
      badgeName: badges.name,
      badgeDescription: badges.description,
      badgeImageUrl: badges.imageUrl,
      badgeCategory: badges.category,
      badgeTier: badges.tier,
      badgePoints: badges.points,
    })
    .from(userBadges)
    .leftJoin(badges, eq(userBadges.badgeId, badges.id))
    .where(eq(userBadges.userId, userId))
    .orderBy(desc(userBadges.earnedAt));

    return earnedBadges;
  }

  async getUserPointTransactions(userId: string, limit: number = 20) {
    return await db.select().from(pointTransactions)
      .where(eq(pointTransactions.userId, userId))
      .orderBy(desc(pointTransactions.createdAt))
      .limit(limit);
  }

  async getAllBadges() {
    return await db.select().from(badges)
      .where(eq(badges.isActive, true))
      .orderBy(badges.category, badges.tier);
  }

  async awardPoints(
    userId: string,
    points: number,
    action: string,
    referenceId?: number,
    referenceType?: string,
    description?: string
  ) {
    // Create transaction record
    const [transaction] = await db.insert(pointTransactions)
      .values({
        userId,
        points,
        action,
        referenceId,
        referenceType,
        description,
      })
      .returning();

    // Update user's total points
    let [userPointsRecord] = await db.select().from(userPoints)
      .where(eq(userPoints.userId, userId));

    if (!userPointsRecord) {
      // Create initial record if it doesn't exist
      [userPointsRecord] = await db.insert(userPoints)
        .values({
          userId,
          totalPoints: points,
          level: 1,
        })
        .returning();
    } else {
      const newTotal = userPointsRecord.totalPoints + points;
      const newLevel = Math.floor(newTotal / 1000) + 1; // Level up every 1000 points

      [userPointsRecord] = await db.update(userPoints)
        .set({
          totalPoints: newTotal,
          level: newLevel,
          updatedAt: new Date(),
        })
        .where(eq(userPoints.userId, userId))
        .returning();
    }

    // Check if user earned any new badges
    await this.checkAndAwardBadges(userId);

    return {
      transaction,
      userPoints: userPointsRecord,
    };
  }

  async checkAndAwardBadges(userId: string) {
    const userPointsRecord = await this.getUserPoints(userId);
    const availableBadges = await this.getAllBadges();
    const earnedBadges = await this.getUserBadges(userId);
    const earnedBadgeIds = earnedBadges.map((b: any) => b.badgeId);

    for (const badge of availableBadges) {
      if (earnedBadgeIds.includes(badge.id)) continue;

      let shouldAward = false;

      // Check different requirement types
      switch (badge.requirementType) {
        case 'points_earned':
          shouldAward = userPointsRecord.totalPoints >= badge.requirement;
          break;
        case 'level_reached':
          shouldAward = userPointsRecord.level >= badge.requirement;
          break;
        case 'streak_days':
          shouldAward = userPointsRecord.currentStreak >= badge.requirement;
          break;
        // Add more requirement types as needed
      }

      if (shouldAward) {
        await db.insert(userBadges)
          .values({
            userId,
            badgeId: badge.id,
            progress: badge.requirement,
          });

        // Award bonus points for earning the badge
        if (badge.points > 0) {
          await this.awardPoints(
            userId,
            badge.points,
            'badge_earned',
            badge.id,
            'badge',
            `Earned badge: ${badge.name}`
          );
        }
      }
    }
  }

  async createBadge(badgeData: any) {
    const [badge] = await db.insert(badges)
      .values(badgeData)
      .returning();
    return badge;
  }

  // ==================== DISCUSSION FORUM OPERATIONS ====================
  
  async getForumThreads(referenceType?: string, referenceId?: number, limit: number = 50) {
    let query = db.select({
      thread: forumThreads,
      authorFirstName: users.firstName,
      authorLastName: users.lastName,
      authorProfileImageUrl: users.profileImageUrl,
    })
    .from(forumThreads)
    .leftJoin(users, eq(forumThreads.authorId, users.id))
    .orderBy(desc(forumThreads.isPinned), desc(forumThreads.lastReplyAt))
    .limit(limit);

    if (referenceType && referenceId) {
      return await query.where(
        and(
          eq(forumThreads.referenceType, referenceType),
          eq(forumThreads.referenceId, referenceId)
        )
      );
    }

    return await query;
  }

  async getForumThread(threadId: number) {
    const [thread] = await db.select({
      thread: forumThreads,
      authorFirstName: users.firstName,
      authorLastName: users.lastName,
      authorProfileImageUrl: users.profileImageUrl,
    })
    .from(forumThreads)
    .leftJoin(users, eq(forumThreads.authorId, users.id))
    .where(eq(forumThreads.id, threadId));

    // Increment view count
    if (thread) {
      await db.update(forumThreads)
        .set({ viewCount: thread.thread.viewCount + 1 })
        .where(eq(forumThreads.id, threadId));
    }

    return thread;
  }

  async createForumThread(threadData: any) {
    const [thread] = await db.insert(forumThreads)
      .values(threadData)
      .returning();
    return thread;
  }

  async updateForumThread(threadId: number, updateData: any) {
    const [thread] = await db.update(forumThreads)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(forumThreads.id, threadId))
      .returning();
    return thread;
  }

  async deleteForumThread(threadId: number) {
    // Delete all replies first
    await db.delete(forumReplies).where(eq(forumReplies.threadId, threadId));
    // Delete thread
    await db.delete(forumThreads).where(eq(forumThreads.id, threadId));
  }

  async getForumReplies(threadId: number) {
    return await db.select({
      reply: forumReplies,
      authorFirstName: users.firstName,
      authorLastName: users.lastName,
      authorProfileImageUrl: users.profileImageUrl,
    })
    .from(forumReplies)
    .leftJoin(users, eq(forumReplies.authorId, users.id))
    .where(eq(forumReplies.threadId, threadId))
    .orderBy(forumReplies.createdAt);
  }

  async createForumReply(replyData: any) {
    const [reply] = await db.insert(forumReplies)
      .values(replyData)
      .returning();

    // Update thread reply count and last reply info
    await db.update(forumThreads)
      .set({
        replyCount: sql`${forumThreads.replyCount} + 1`,
        lastReplyAt: new Date(),
        lastReplyBy: replyData.authorName,
      })
      .where(eq(forumThreads.id, replyData.threadId));

    return reply;
  }

  async updateForumReply(replyId: number, updateData: any) {
    const [reply] = await db.update(forumReplies)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(forumReplies.id, replyId))
      .returning();
    return reply;
  }

  async deleteForumReply(replyId: number, threadId: number) {
    await db.delete(forumReplies).where(eq(forumReplies.id, replyId));
    
    // Update thread reply count
    await db.update(forumThreads)
      .set({ replyCount: sql`${forumThreads.replyCount} - 1` })
      .where(eq(forumThreads.id, threadId));
  }

  async voteForumReply(userId: string, replyId: number, voteType: 'upvote' | 'downvote') {
    // Check if user already voted
    const existingVote = await db.select()
      .from(forumVotes)
      .where(and(
        eq(forumVotes.userId, userId),
        eq(forumVotes.replyId, replyId)
      ))
      .limit(1);

    if (existingVote.length > 0) {
      // Update existing vote
      await db.update(forumVotes)
        .set({ voteType })
        .where(and(
          eq(forumVotes.userId, userId),
          eq(forumVotes.replyId, replyId)
        ));
    } else {
      // Create new vote
      await db.insert(forumVotes).values({
        userId,
        replyId,
        voteType,
      });
    }

    // Update reply vote counts
    const votes = await db.select()
      .from(forumVotes)
      .where(eq(forumVotes.replyId, replyId));

    const upvotes = votes.filter(v => v.voteType === 'upvote').length;
    const downvotes = votes.filter(v => v.voteType === 'downvote').length;

    await db.update(forumReplies)
      .set({ upvotes, downvotes })
      .where(eq(forumReplies.id, replyId));
  }

  // ==================== RESOURCE LIBRARY OPERATIONS ====================
  
  async getResources(referenceType?: string, referenceId?: number) {
    let query = db.select().from(resources);

    if (referenceType && referenceId) {
      return await query.where(
        and(
          eq(resources.referenceType, referenceType),
          eq(resources.referenceId, referenceId),
          eq(resources.isPublic, true)
        )
      );
    }

    return await query.where(eq(resources.isPublic, true));
  }

  async createResource(resourceData: any) {
    const [resource] = await db.insert(resources)
      .values(resourceData)
      .returning();
    return resource;
  }

  async incrementResourceDownload(resourceId: number) {
    await db.update(resources)
      .set({ downloadCount: sql`${resources.downloadCount} + 1` })
      .where(eq(resources.id, resourceId));
  }

  async deleteResource(resourceId: number) {
    await db.delete(resources).where(eq(resources.id, resourceId));
  }

  // Quiz management methods
  async createQuiz(quizData: any) {
    const [quiz] = await db.insert(courseQuizzes).values(quizData).returning();
    return quiz;
  }

  async getAllQuizzes() {
    return await db.select().from(courseQuizzes).orderBy(desc(courseQuizzes.createdAt));
  }

  async getQuiz(quizId: number) {
    const [quiz] = await db.select().from(courseQuizzes).where(eq(courseQuizzes.id, quizId));
    return quiz;
  }

  async updateQuiz(quizId: number, updateData: any) {
    const [quiz] = await db.update(courseQuizzes)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(courseQuizzes.id, quizId))
      .returning();
    return quiz;
  }

  async deleteQuiz(quizId: number) {
    await db.delete(courseQuizzes).where(eq(courseQuizzes.id, quizId));
  }
}

export const storage = new DatabaseStorage();
