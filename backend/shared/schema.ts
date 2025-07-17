import {
  pgTable,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  jsonb,
  index,
  serial,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for authentication)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for authentication)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  authorId: varchar("author_id").notNull(),
  authorName: varchar("author_name").notNull(),
  published: boolean("published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const workshops = pgTable("workshops", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  duration: varchar("duration", { length: 100 }).notNull(),
  price: integer("price").notNull(),
  maxParticipants: integer("max_participants").notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  imageUrl: varchar("image_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  instructorName: varchar("instructor_name", { length: 255 }).notNull(),
  duration: varchar("duration", { length: 100 }).notNull(),
  level: varchar("level", { length: 50 }).notNull(),
  price: integer("price").notNull(),
  field: varchar("field", { length: 100 }).notNull(),
  imageUrl: varchar("image_url", { length: 500 }),
  status: varchar("status", { length: 50 }).default("upcoming"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  field: varchar("field", { length: 100 }).notNull(),
  duration: varchar("duration", { length: 100 }).notNull(),
  price: integer("price").notNull(),
  targetParticipants: integer("target_participants").notNull(),
  requirements: text("requirements").notNull(),
  timeline: varchar("timeline", { length: 255 }).notNull(),
  outcomes: text("outcomes").notNull(),
  imageUrl: varchar("image_url", { length: 500 }),
  status: varchar("status", { length: 50 }).default("upcoming"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contactInquiries = pgTable("contact_inquiries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const workshopRegistrations = pgTable("workshop_registrations", {
  id: serial("id").primaryKey(),
  schoolName: varchar("school_name", { length: 255 }).notNull(),
  contactName: varchar("contact_name", { length: 255 }).notNull(),
  contactEmail: varchar("contact_email", { length: 255 }).notNull(),
  contactPhone: varchar("contact_phone", { length: 50 }).notNull(),
  studentCount: integer("student_count").notNull(),
  grades: varchar("grades", { length: 255 }).notNull(),
  workshopType: varchar("workshop_type", { length: 100 }).notNull(),
  experienceLevel: varchar("experience_level", { length: 100 }).notNull(),
  interests: text("interests").notNull(),
  contactMethod: varchar("contact_method", { length: 100 }).notNull(),
  lowerClassesRequest: text("lower_classes_request").notNull(),
  status: varchar("status", { length: 50 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const campaignEnrollments = pgTable("campaign_enrollments", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").notNull(),
  userName: varchar("user_name", { length: 255 }).notNull(),
  userEmail: varchar("user_email", { length: 255 }).notNull(),
  userPhone: varchar("user_phone", { length: 50 }).notNull(),
  userAge: integer("user_age").notNull(),
  userGrade: varchar("user_grade", { length: 50 }).notNull(),
  userSchool: varchar("user_school", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users);
export const insertBlogPostSchema = createInsertSchema(blogPosts);
export const insertWorkshopSchema = createInsertSchema(workshops);
export const insertCourseSchema = createInsertSchema(courses);
export const insertCampaignSchema = createInsertSchema(campaigns);
export const insertContactInquirySchema = createInsertSchema(contactInquiries);
export const insertWorkshopRegistrationSchema = createInsertSchema(workshopRegistrations);
export const insertCampaignEnrollmentSchema = createInsertSchema(campaignEnrollments);

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertWorkshop = z.infer<typeof insertWorkshopSchema>;
export type Workshop = typeof workshops.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Campaign = typeof campaigns.$inferSelect;
export type InsertContactInquiry = z.infer<typeof insertContactInquirySchema>;
export type ContactInquiry = typeof contactInquiries.$inferSelect;
export type InsertWorkshopRegistration = z.infer<typeof insertWorkshopRegistrationSchema>;
export type WorkshopRegistration = typeof workshopRegistrations.$inferSelect;
export type InsertCampaignEnrollment = z.infer<typeof insertCampaignEnrollmentSchema>;
export type CampaignEnrollment = typeof campaignEnrollments.$inferSelect;