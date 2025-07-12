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
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
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
}

export const storage = new DatabaseStorage();
