import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  userType: varchar("user_type").notNull().default("student"), // student, educator, school, collaborator, sponsor
  institution: varchar("institution"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Workshops table
export const workshops = pgTable("workshops", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  type: varchar("type").notNull(), // telescope, vr, expert_session, etc.
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  location: varchar("location"),
  isVirtual: boolean("is_virtual").default(false),
  maxParticipants: integer("max_participants"),
  currentParticipants: integer("current_participants").default(0),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: varchar("image_url"),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  featuredOrder: integer("featured_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Workshop enrollments
export const workshopEnrollments = pgTable("workshop_enrollments", {
  id: serial("id").primaryKey(),
  workshopId: integer("workshop_id").references(() => workshops.id),
  userId: varchar("user_id").references(() => users.id),
  enrollmentDate: timestamp("enrollment_date").defaultNow(),
  status: varchar("status").default("registered"), // registered, completed, cancelled
});

// Workshop registrations (from workshop page form)
export const workshopRegistrations = pgTable("workshop_registrations", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone"),
  organization: varchar("organization"),
  experience: varchar("experience"), // beginner, intermediate, advanced
  interests: text("interests"),
  requestLowerClass: boolean("request_lower_class").default(false),
  contactMethod: varchar("contact_method"), // email, phone, whatsapp
  workshopType: varchar("workshop_type"), // community, campus
  status: varchar("status").default("pending"), // pending, contacted, confirmed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Courses table - Enhanced for LMS
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  about: text("about"), // detailed about section for course detail view
  field: varchar("field").notNull(), // quantum_mechanics, tech_ai, astrophysics, etc.
  level: varchar("level").notNull(), // beginner, intermediate, advanced
  duration: varchar("duration"),
  price: decimal("price", { precision: 10, scale: 2 }),
  isFree: boolean("is_free").default(false),
  imageUrl: varchar("image_url"),
  instructorId: varchar("instructor_id").references(() => users.id),
  instructorName: varchar("instructor_name"),
  status: varchar("status").default("upcoming"), // upcoming, accepting_registrations, live
  category: varchar("category"),
  totalLessons: integer("total_lessons").default(0),
  totalDuration: integer("total_duration").default(0), // in minutes
  enrollmentCount: integer("enrollment_count").default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  reviewCount: integer("review_count").default(0),
  learningObjectives: text("learning_objectives").array(),
  prerequisites: text("prerequisites").array(),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  featuredOrder: integer("featured_order").default(0),
  googleSheetId: varchar("google_sheet_id"), // Google Sheets ID for this course
  googleSheetUrl: varchar("google_sheet_url"), // Direct URL to the Google Sheet
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Course enrollments - Enhanced for LMS
export const courseEnrollments = pgTable("course_enrollments", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id),
  userId: varchar("user_id").references(() => users.id),
  enrollmentDate: timestamp("enrollment_date").defaultNow(),
  status: varchar("status").default("enrolled"), // enrolled, completed, dropped
  progress: integer("progress").default(0), // percentage 0-100
  completedLessons: integer("completed_lessons").default(0),
  totalTimeSpent: integer("total_time_spent").default(0), // in minutes
  lastAccessed: timestamp("last_accessed"),
  certificateIssued: boolean("certificate_issued").default(false),
});

// Course registrations (from course registration form)
export const courseRegistrations = pgTable("course_registrations", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  userId: varchar("user_id").references(() => users.id),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone").notNull(),
  institution: varchar("institution"),
  additionalInfo: text("additional_info"),
  status: varchar("status").default("pending"), // pending, contacted, confirmed, enrolled, cancelled
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Course modules/sections
export const courseModules = pgTable("course_modules", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  orderIndex: integer("order_index").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Course lessons
export const courseLessons = pgTable("course_lessons", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  moduleId: integer("module_id").references(() => courseModules.id),
  title: varchar("title").notNull(),
  description: text("description"),
  content: text("content"), // lesson content/text
  videoUrl: varchar("video_url"),
  duration: integer("duration").default(0), // in minutes
  orderIndex: integer("order_index").notNull(),
  type: varchar("type").default("video"), // video, text, quiz, assignment
  resources: text("resources").array(), // downloadable resources
  isPreview: boolean("is_preview").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Course quizzes
export const courseQuizzes = pgTable("course_quizzes", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  lessonId: integer("lesson_id").references(() => courseLessons.id),
  title: varchar("title").notNull(),
  description: text("description"),
  timeLimit: integer("time_limit"), // in minutes
  passingScore: integer("passing_score").default(70),
  maxAttempts: integer("max_attempts").default(3),
  questions: jsonb("questions").notNull(), // quiz questions and answers
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Student progress tracking
export const studentProgress = pgTable("student_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  lessonId: integer("lesson_id").references(() => courseLessons.id),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
  timeSpent: integer("time_spent").default(0), // in minutes
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Quiz attempts
export const quizAttempts = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  quizId: integer("quiz_id").references(() => courseQuizzes.id).notNull(),
  score: integer("score").notNull(),
  answers: jsonb("answers").notNull(),
  completedAt: timestamp("completed_at").defaultNow(),
  timeSpent: integer("time_spent").default(0), // in minutes
});

// Course reviews
export const courseReviews = pgTable("course_reviews", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  review: text("review"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Course certificates
export const courseCertificates = pgTable("course_certificates", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  certificateUrl: varchar("certificate_url"),
  issuedAt: timestamp("issued_at").defaultNow(),
  verificationCode: varchar("verification_code").notNull(),
});

// Coupon codes table
export const couponCodes = pgTable("coupon_codes", {
  id: serial("id").primaryKey(),
  code: varchar("code").notNull().unique(), // Unique coupon code (e.g., "SUMMER2024")
  description: text("description"), // Optional description
  discountType: varchar("discount_type").notNull(), // "percentage" or "fixed"
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }).notNull(), // Percentage (0-100) or fixed amount
  courseId: integer("course_id").references(() => courses.id), // null = applies to all courses
  workshopId: integer("workshop_id").references(() => workshops.id), // null = applies to all workshops
  campaignId: integer("campaign_id").references(() => campaigns.id), // null = applies to all campaigns
  minPurchaseAmount: decimal("min_purchase_amount", { precision: 10, scale: 2 }), // Minimum purchase amount required
  maxDiscountAmount: decimal("max_discount_amount", { precision: 10, scale: 2 }), // Maximum discount cap (for percentage discounts)
  usageLimit: integer("usage_limit"), // Total number of times this coupon can be used (null = unlimited)
  usedCount: integer("used_count").default(0).notNull(), // Number of times already used
  userUsageLimit: integer("user_usage_limit").default(1), // Number of times a single user can use this coupon
  validFrom: timestamp("valid_from").defaultNow(), // Start date
  validUntil: timestamp("valid_until"), // End date (null = no expiration)
  isActive: boolean("is_active").default(true), // Whether the coupon is currently active
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Coupon code usage tracking
export const couponCodeUsages = pgTable("coupon_code_usages", {
  id: serial("id").primaryKey(),
  couponCodeId: integer("coupon_code_id").references(() => couponCodes.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  invoiceId: integer("invoice_id").references(() => invoices.id), // Link to invoice
  itemType: varchar("item_type").notNull(), // course, workshop, campaign
  itemId: integer("item_id").notNull(),
  originalAmount: decimal("original_amount", { precision: 10, scale: 2 }).notNull(),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).notNull(),
  finalAmount: decimal("final_amount", { precision: 10, scale: 2 }).notNull(),
  usedAt: timestamp("used_at").defaultNow(),
});

// Invoices table
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  invoiceNumber: varchar("invoice_number").unique().notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  itemType: varchar("item_type").notNull(), // course, workshop, campaign
  itemId: integer("item_id").notNull(),
  itemName: varchar("item_name").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 10, scale: 2 }).default("0.00"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  paymentId: varchar("payment_id"), // Razorpay payment ID
  paymentMethod: varchar("payment_method"), // card, upi, netbanking, etc.
  paymentStatus: varchar("payment_status").default("completed"), // completed, pending, failed, refunded
  invoiceUrl: varchar("invoice_url"),
  couponCodeId: integer("coupon_code_id").references(() => couponCodes.id), // Applied coupon code
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).default("0.00"), // Discount applied
  createdAt: timestamp("created_at").defaultNow(),
});

// Refund requests table
export const refundRequests = pgTable("refund_requests", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  invoiceId: integer("invoice_id").references(() => invoices.id).notNull(),
  itemType: varchar("item_type").notNull(), // course, workshop, campaign
  itemId: integer("item_id").notNull(),
  itemName: varchar("item_name").notNull(),
  refundAmount: decimal("refund_amount", { precision: 10, scale: 2 }).notNull(),
  reason: text("reason").notNull(),
  status: varchar("status").default("pending"), // pending, approved, rejected, processed
  adminNotes: text("admin_notes"),
  processedBy: varchar("processed_by").references(() => users.id),
  processedAt: timestamp("processed_at"),
  refundTransactionId: varchar("refund_transaction_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Campaigns table
export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  type: varchar("type").notNull(), // asteroid_search, poetry, research, ideathon
  field: varchar("field"),
  duration: varchar("duration"),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  partner: varchar("partner"), // NASA, IASC, Think Startup, etc.
  status: varchar("status").default("upcoming"), // upcoming, accepting_registrations, active, closed, completed
  progress: integer("progress").default(0), // percentage
  maxParticipants: integer("max_participants"),
  currentParticipants: integer("current_participants").default(0),
  targetParticipants: integer("target_participants").default(100),
  price: decimal("price", { precision: 10, scale: 2 }).default("0.00"),
  isFree: boolean("is_free").default(false),
  imageUrl: varchar("image_url"),
  requirements: text("requirements"),
  timeline: text("timeline"),
  outcomes: text("outcomes"),
  isFeatured: boolean("is_featured").default(false),
  featuredOrder: integer("featured_order").default(0),
  googleSheetId: varchar("google_sheet_id"), // Google Sheets ID for this campaign
  googleSheetUrl: varchar("google_sheet_url"), // Direct URL to the Google Sheet
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Campaign participants
export const campaignParticipants = pgTable("campaign_participants", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").references(() => campaigns.id),
  userId: varchar("user_id").references(() => users.id),
  joinDate: timestamp("join_date").defaultNow(),
  status: varchar("status").default("active"), // active, completed, withdrawn
  paymentStatus: varchar("payment_status").default("pending"), // pending, paid, failed
  paymentAmount: decimal("payment_amount", { precision: 10, scale: 2 }),
});

// Campaign team registrations (for team-based campaigns like ideathons)
export const campaignTeamRegistrations = pgTable("campaign_team_registrations", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").references(() => campaigns.id).notNull(),
  schoolName: varchar("school_name").notNull(),
  teamLeaderName: varchar("team_leader_name").notNull(),
  teamLeaderEmail: varchar("team_leader_email").notNull(),
  teamLeaderPhone: varchar("team_leader_phone").notNull(),
  teamMember2Name: varchar("team_member_2_name").notNull(),
  teamMember2Email: varchar("team_member_2_email").notNull(),
  teamMember2Phone: varchar("team_member_2_phone").notNull(),
  teamMember3Name: varchar("team_member_3_name").notNull(),
  teamMember3Email: varchar("team_member_3_email").notNull(),
  teamMember3Phone: varchar("team_member_3_phone").notNull(),
  teamMember4Name: varchar("team_member_4_name"),
  teamMember4Email: varchar("team_member_4_email"),
  teamMember4Phone: varchar("team_member_4_phone"),
  teamMember5Name: varchar("team_member_5_name"),
  teamMember5Email: varchar("team_member_5_email"),
  teamMember5Phone: varchar("team_member_5_phone"),
  mentorName: varchar("mentor_name").notNull(),
  mentorEmail: varchar("mentor_email").notNull(),
  mentorPhone: varchar("mentor_phone").notNull(),
  status: varchar("status").default("pending"), // pending, confirmed, rejected
  createdAt: timestamp("created_at").defaultNow(),
});

// Blog posts table
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  authorId: varchar("author_id").references(() => users.id),
  authorName: varchar("author_name").notNull(),
  authorTitle: varchar("author_title"),
  authorImageUrl: varchar("author_image_url"),
  authorBio: text("author_bio"), // Author bio for bottom of blog post
  publishedAt: timestamp("published_at"),
  isPublished: boolean("is_published").default(false),
  scheduledDate: timestamp("scheduled_date"),
  imageUrl: varchar("image_url"),
  featuredImage: varchar("featured_image"),
  categories: jsonb("categories").$type<string[]>().default([]),
  tags: jsonb("tags").$type<string[]>().default([]),
  seoTitle: varchar("seo_title"),
  seoDescription: text("seo_description"),
  slug: varchar("slug").unique(),
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  commentCount: integer("comment_count").default(0),
  status: varchar("status").default("draft"), // draft, under_review, published, rejected, scheduled, archived
  adminFeedback: text("admin_feedback"), // Feedback from admin for rejected/revision requests
  reviewedBy: varchar("reviewed_by").references(() => users.id), // Admin who reviewed
  reviewedAt: timestamp("reviewed_at"), // When it was reviewed
  submittedAt: timestamp("submitted_at"), // When it was submitted for review
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Achievements table
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  studentName: varchar("student_name").notNull(),
  school: varchar("school"),
  achievementType: varchar("achievement_type").notNull(), // asteroid_discovery, research_publication, poetry_publication
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  imageUrl: varchar("image_url"),
  achievedAt: timestamp("achieved_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// User points and gamification
export const userPoints = pgTable("user_points", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull().unique(),
  totalPoints: integer("total_points").default(0).notNull(),
  level: integer("level").default(1).notNull(),
  currentStreak: integer("current_streak").default(0).notNull(),
  longestStreak: integer("longest_streak").default(0).notNull(),
  lastActivityDate: timestamp("last_activity_date").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Badge definitions
export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  imageUrl: varchar("image_url"),
  category: varchar("category").notNull(), // course, campaign, workshop, engagement, special
  requirement: integer("requirement").notNull(), // number needed to earn
  requirementType: varchar("requirement_type").notNull(), // courses_completed, campaigns_joined, points_earned, etc.
  points: integer("points").default(0).notNull(), // points awarded when earning this badge
  tier: varchar("tier").default("bronze"), // bronze, silver, gold, platinum
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User badges (earned badges)
export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  badgeId: integer("badge_id").references(() => badges.id).notNull(),
  earnedAt: timestamp("earned_at").defaultNow(),
  progress: integer("progress").default(0), // current progress towards next tier
});

// Point transactions log
export const pointTransactions = pgTable("point_transactions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  points: integer("points").notNull(), // can be positive or negative
  action: varchar("action").notNull(), // course_completed, lesson_completed, badge_earned, etc.
  referenceId: integer("reference_id"), // id of course, lesson, etc.
  referenceType: varchar("reference_type"), // course, lesson, campaign, workshop, etc.
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ==================== DISCUSSION FORUMS ====================

// Forum threads (discussions)
export const forumThreads = pgTable("forum_threads", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  authorId: varchar("author_id").references(() => users.id).notNull(),
  authorName: varchar("author_name").notNull(),
  referenceType: varchar("reference_type").notNull(), // course, campaign, workshop, general
  referenceId: integer("reference_id"), // id of course, campaign, etc.
  isPinned: boolean("is_pinned").default(false),
  isLocked: boolean("is_locked").default(false),
  viewCount: integer("view_count").default(0),
  replyCount: integer("reply_count").default(0),
  lastReplyAt: timestamp("last_reply_at"),
  lastReplyBy: varchar("last_reply_by"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Forum replies
export const forumReplies = pgTable("forum_replies", {
  id: serial("id").primaryKey(),
  threadId: integer("thread_id").references(() => forumThreads.id).notNull(),
  content: text("content").notNull(),
  authorId: varchar("author_id").references(() => users.id).notNull(),
  authorName: varchar("author_name").notNull(),
  parentReplyId: integer("parent_reply_id"), // for nested replies
  upvotes: integer("upvotes").default(0),
  downvotes: integer("downvotes").default(0),
  isAccepted: boolean("is_accepted").default(false), // for marking best answer
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Forum votes (upvotes/downvotes)
export const forumVotes = pgTable("forum_votes", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  replyId: integer("reply_id").references(() => forumReplies.id).notNull(),
  voteType: varchar("vote_type").notNull(), // upvote, downvote
  createdAt: timestamp("created_at").defaultNow(),
});

// ==================== RESOURCE LIBRARY ====================

// Course/campaign resources (files, documents)
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  fileName: varchar("file_name").notNull(),
  fileUrl: varchar("file_url").notNull(),
  fileType: varchar("file_type").notNull(), // pdf, doc, ppt, zip, etc.
  fileSize: integer("file_size"), // in bytes
  referenceType: varchar("reference_type").notNull(), // course, campaign, workshop, lesson
  referenceId: integer("reference_id").notNull(),
  uploadedBy: varchar("uploaded_by").references(() => users.id).notNull(),
  downloadCount: integer("download_count").default(0),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contact inquiries
export const contactInquiries = pgTable("contact_inquiries", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  subject: varchar("subject").notNull(),
  message: text("message").notNull(),
  inquiryType: varchar("inquiry_type").default("general"), // general, partnership, collaboration
  status: varchar("status").default("pending"), // pending, replied, resolved
  createdAt: timestamp("created_at").defaultNow(),
});

// Love messages table (for special user messages to admin)
export const loveMessages = pgTable("love_messages", {
  id: serial("id").primaryKey(),
  fromUserId: varchar("from_user_id").references(() => users.id).notNull(),
  fromUserEmail: varchar("from_user_email").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Type definitions
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertWorkshop = typeof workshops.$inferInsert;
export type Workshop = typeof workshops.$inferSelect;

export type InsertCourse = typeof courses.$inferInsert;
export type Course = typeof courses.$inferSelect;

export type InsertCampaign = typeof campaigns.$inferInsert;
export type Campaign = typeof campaigns.$inferSelect;

export type InsertBlogPost = typeof blogPosts.$inferInsert;
export type BlogPost = typeof blogPosts.$inferSelect;

export type InsertAchievement = typeof achievements.$inferInsert;
export type Achievement = typeof achievements.$inferSelect;

export type InsertContactInquiry = typeof contactInquiries.$inferInsert;
export type ContactInquiry = typeof contactInquiries.$inferSelect;

export type InsertLoveMessage = typeof loveMessages.$inferInsert;
export type LoveMessage = typeof loveMessages.$inferSelect;

export type InsertWorkshopEnrollment = typeof workshopEnrollments.$inferInsert;
export type WorkshopEnrollment = typeof workshopEnrollments.$inferSelect;

export type InsertWorkshopRegistration = typeof workshopRegistrations.$inferInsert;
export type WorkshopRegistration = typeof workshopRegistrations.$inferSelect;

export type InsertCourseRegistration = typeof courseRegistrations.$inferInsert;
export type CourseRegistration = typeof courseRegistrations.$inferSelect;

export type InsertCourseEnrollment = typeof courseEnrollments.$inferInsert;
export type CourseEnrollment = typeof courseEnrollments.$inferSelect;

export type InsertCampaignParticipant = typeof campaignParticipants.$inferInsert;
export type CampaignParticipant = typeof campaignParticipants.$inferSelect;

export type InsertCampaignTeamRegistration = typeof campaignTeamRegistrations.$inferInsert;
export type CampaignTeamRegistration = typeof campaignTeamRegistrations.$inferSelect;

// LMS types
export type InsertCourseModule = typeof courseModules.$inferInsert;
export type CourseModule = typeof courseModules.$inferSelect;

export type InsertCourseLesson = typeof courseLessons.$inferInsert;
export type CourseLesson = typeof courseLessons.$inferSelect;

export type InsertCourseQuiz = typeof courseQuizzes.$inferInsert;
export type CourseQuiz = typeof courseQuizzes.$inferSelect;

export type InsertStudentProgress = typeof studentProgress.$inferInsert;
export type StudentProgress = typeof studentProgress.$inferSelect;

export type InsertQuizAttempt = typeof quizAttempts.$inferInsert;
export type QuizAttempt = typeof quizAttempts.$inferSelect;

export type InsertCourseReview = typeof courseReviews.$inferInsert;
export type CourseReview = typeof courseReviews.$inferSelect;

export type InsertCourseCertificate = typeof courseCertificates.$inferInsert;
export type CourseCertificate = typeof courseCertificates.$inferSelect;

export type InsertInvoice = typeof invoices.$inferInsert;
export type Invoice = typeof invoices.$inferSelect;

export type InsertCouponCode = typeof couponCodes.$inferInsert;
export type CouponCode = typeof couponCodes.$inferSelect;

export type InsertCouponCodeUsage = typeof couponCodeUsages.$inferInsert;
export type CouponCodeUsage = typeof couponCodeUsages.$inferSelect;

export type InsertRefundRequest = typeof refundRequests.$inferInsert;
export type RefundRequest = typeof refundRequests.$inferSelect;

// Zod schemas
export const insertUserSchema = createInsertSchema(users);
export const insertWorkshopSchema = createInsertSchema(workshops);
export const insertCourseSchema = createInsertSchema(courses);
export const insertCampaignSchema = createInsertSchema(campaigns).extend({
  startDate: z.union([z.string(), z.date()]).transform(val => typeof val === 'string' ? val : val.toISOString().split('T')[0]),
  endDate: z.union([z.string(), z.date()]).transform(val => typeof val === 'string' ? val : val.toISOString().split('T')[0]),
  price: z.union([z.string(), z.number()]).transform(val => String(val)),
  maxParticipants: z.union([z.number(), z.string(), z.null(), z.undefined()]).transform(val => val ? Number(val) : null).optional(),
  targetParticipants: z.union([z.number(), z.string(), z.null(), z.undefined()]).transform(val => val ? Number(val) : 100).optional(),
  field: z.string().optional().nullable(),
  duration: z.string().optional().nullable(),
  partner: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  requirements: z.string().optional().nullable(),
  timeline: z.string().optional().nullable(),
  outcomes: z.string().optional().nullable(),
});
export const insertBlogPostSchema = createInsertSchema(blogPosts);
export const insertAchievementSchema = createInsertSchema(achievements);
export const insertContactInquirySchema = createInsertSchema(contactInquiries);
export const insertLoveMessageSchema = createInsertSchema(loveMessages);
export const insertWorkshopEnrollmentSchema = createInsertSchema(workshopEnrollments);
export const insertWorkshopRegistrationSchema = createInsertSchema(workshopRegistrations);
export const insertCourseRegistrationSchema = createInsertSchema(courseRegistrations);
export const insertCourseEnrollmentSchema = createInsertSchema(courseEnrollments);
export const insertCampaignParticipantSchema = createInsertSchema(campaignParticipants);
export const insertCampaignTeamRegistrationSchema = createInsertSchema(campaignTeamRegistrations).omit({ id: true, createdAt: true });

// Coupon Code Zod schemas
export const insertCouponCodeSchema = createInsertSchema(couponCodes);
export const insertCouponCodeUsageSchema = createInsertSchema(couponCodeUsages);

// LMS Zod schemas
export const insertCourseModuleSchema = createInsertSchema(courseModules);
export const insertCourseLessonSchema = createInsertSchema(courseLessons);
export const insertCourseQuizSchema = createInsertSchema(courseQuizzes);
export const insertStudentProgressSchema = createInsertSchema(studentProgress);
export const insertQuizAttemptSchema = createInsertSchema(quizAttempts);
export const insertCourseReviewSchema = createInsertSchema(courseReviews);
export const insertCourseCertificateSchema = createInsertSchema(courseCertificates);

// Gamification Zod schemas
export const insertUserPointsSchema = createInsertSchema(userPoints);
export const insertBadgeSchema = createInsertSchema(badges);
export const insertUserBadgeSchema = createInsertSchema(userBadges);
export const insertPointTransactionSchema = createInsertSchema(pointTransactions);

// Discussion Forum Zod schemas
export const insertForumThreadSchema = createInsertSchema(forumThreads);
export const insertForumReplySchema = createInsertSchema(forumReplies);
export const insertForumVoteSchema = createInsertSchema(forumVotes);

// Resource Library Zod schemas
export const insertResourceSchema = createInsertSchema(resources);

// Invoice and Refund Zod schemas
export const insertInvoiceSchema = createInsertSchema(invoices);
export const insertRefundRequestSchema = createInsertSchema(refundRequests);

// Admin form schemas
export const lessonFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  videoUrl: z.string().optional(),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  orderIndex: z.number().min(1, "Order index must be at least 1"),
  type: z.enum(["video", "text", "quiz", "assignment"]),
  resources: z.string().optional(),
  isPreview: z.boolean().default(false),
});
