import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  jsonb,
  index,
  serial,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - required for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// User storage table - required for authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  author: varchar("author", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  tags: text("tags").array().notNull().default([]),
  imageUrl: varchar("image_url"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const workshops = pgTable("workshops", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  duration: varchar("duration", { length: 50 }).notNull(),
  capacity: integer("capacity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: varchar("image_url"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  field: varchar("field", { length: 100 }).notNull(),
  level: varchar("level", { length: 50 }).notNull(),
  duration: varchar("duration", { length: 50 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  instructorName: varchar("instructor_name", { length: 255 }).notNull(),
  about: text("about"),
  status: varchar("status", { length: 50 }).default("upcoming").notNull(),
  imageUrl: varchar("image_url"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  field: varchar("field", { length: 100 }).notNull(),
  duration: varchar("duration", { length: 50 }).notNull(),
  targetParticipants: integer("target_participants").notNull(),
  requirements: text("requirements").notNull(),
  timeline: text("timeline").notNull(),
  outcomes: text("outcomes").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).default("upcoming").notNull(),
  imageUrl: varchar("image_url"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const workshopRegistrations = pgTable("workshop_registrations", {
  id: serial("id").primaryKey(),
  workshopId: integer("workshop_id").notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  schoolName: varchar("school_name", { length: 255 }).notNull(),
  role: varchar("role", { length: 100 }).notNull(),
  grade: varchar("grade", { length: 50 }),
  workshopType: varchar("workshop_type", { length: 50 }).notNull(),
  experienceLevel: varchar("experience_level", { length: 50 }).notNull(),
  interests: text("interests").array().notNull().default([]),
  contactMethod: varchar("contact_method", { length: 50 }).notNull(),
  lowerClassesRequest: boolean("lower_classes_request").default(false),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contactInquiries = pgTable("contact_inquiries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  organization: varchar("organization", { length: 255 }),
  inquiryType: varchar("inquiry_type", { length: 100 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  status: varchar("status", { length: 50 }).default("new").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const courseEnrollments = pgTable("course_enrollments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  courseId: integer("course_id").notNull(),
  status: varchar("status", { length: 50 }).default("enrolled").notNull(),
  progress: integer("progress").default(0).notNull(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const campaignParticipants = pgTable("campaign_participants", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  campaignId: integer("campaign_id").notNull(),
  status: varchar("status", { length: 50 }).default("active").notNull(),
  joinedAt: timestamp("joined_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const workshopEnrollments = pgTable("workshop_enrollments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  workshopId: integer("workshop_id").notNull(),
  status: varchar("status", { length: 50 }).default("enrolled").notNull(),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Type exports
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type BlogPost = typeof blogPosts.$inferSelect;
export type Workshop = typeof workshops.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type Campaign = typeof campaigns.$inferSelect;
export type WorkshopRegistration = typeof workshopRegistrations.$inferSelect;
export type ContactInquiry = typeof contactInquiries.$inferSelect;
export type CourseEnrollment = typeof courseEnrollments.$inferSelect;
export type CampaignParticipant = typeof campaignParticipants.$inferSelect;
export type WorkshopEnrollment = typeof workshopEnrollments.$inferSelect;

// Insert schemas
export const insertUserSchema = createInsertSchema(users);
export const insertBlogPostSchema = createInsertSchema(blogPosts);
export const insertWorkshopSchema = createInsertSchema(workshops);
export const insertCourseSchema = createInsertSchema(courses);
export const insertCampaignSchema = createInsertSchema(campaigns);
export const insertWorkshopRegistrationSchema = createInsertSchema(workshopRegistrations);
export const insertContactInquirySchema = createInsertSchema(contactInquiries);
export const insertCourseEnrollmentSchema = createInsertSchema(courseEnrollments);
export const insertCampaignParticipantSchema = createInsertSchema(campaignParticipants);
export const insertWorkshopEnrollmentSchema = createInsertSchema(workshopEnrollments);

// Insert types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type InsertWorkshop = z.infer<typeof insertWorkshopSchema>;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type InsertWorkshopRegistration = z.infer<typeof insertWorkshopRegistrationSchema>;
export type InsertContactInquiry = z.infer<typeof insertContactInquirySchema>;
export type InsertCourseEnrollment = z.infer<typeof insertCourseEnrollmentSchema>;
export type InsertCampaignParticipant = z.infer<typeof insertCampaignParticipantSchema>;
export type InsertWorkshopEnrollment = z.infer<typeof insertWorkshopEnrollmentSchema>;