import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import { firebaseAuth } from "./middleware/firebaseAuth.js";
// Firebase auth - no need for replitAuth imports
import {
  insertWorkshopEnrollmentSchema,
  insertCourseEnrollmentSchema,
  insertCampaignParticipantSchema,
  insertCampaignTeamRegistrationSchema,
  insertContactInquirySchema,
  insertLoveMessageSchema,
  insertUserSchema,
  insertBlogPostSchema,
  insertWorkshopSchema,
  insertCourseSchema,
  insertCampaignSchema,
  courseEnrollments,
  studentProgress,
  quizAttempts,
  courseReviews,
  courseCertificates,
  invoices,
  refundRequests,
  workshopEnrollments,
  workshopRegistrations,
  campaignParticipants,
  campaignTeamRegistrations,
  contactInquiries,
  loveMessages,
  userPoints,
  userBadges,
  pointTransactions,
  courses,
} from "@shared/schema";
import { z } from "zod";
import Razorpay from "razorpay";
import crypto from "crypto";
import { exportCampaignsToGoogleSheets } from "./jobs/exportToGoogleSheets";

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("Missing required Razorpay secrets: RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET");
}
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Firebase user sync endpoint - creates/updates user in database when Firebase user signs in
  app.post('/api/auth/sync-user', async (req, res) => {
    try {
      const { uid, email, displayName, photoURL } = req.body;
      
      if (!uid || !email) {
        return res.status(400).json({ message: "Missing required user data" });
      }

      // Check if this is a designated admin email
      const adminEmails = [
        'astrosalikriyaz@gmail.com', // Primary admin email
        'salik.riyaz27@gmail.com', // Secondary admin email
        // Add more admin emails as needed
      ];
      
      const userData = {
        id: uid,
        email: email,
        firstName: displayName?.split(' ')[0] || null,
        lastName: displayName?.split(' ').slice(1).join(' ') || null,
        profileImageUrl: photoURL || null,
        userType: 'student' as const,
        isAdmin: adminEmails.includes(email.toLowerCase())
      };

      const user = await storage.upsertUser(userData);
      res.json(user);
    } catch (error) {
      console.error("Error syncing user:", error);
      res.status(500).json({ message: "Failed to sync user" });
    }
  });

  // Get current user by Firebase UID or email
  app.get('/api/auth/user/:uid', async (req, res) => {
    try {
      const uid = req.params.uid;
      
      // Cache headers for user data (5 minutes)
      res.set({
        'Cache-Control': 'private, max-age=300',
        'ETag': `user-${uid}-${Date.now()}`
      });
      
      const user = await storage.getUser(uid);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Get user by email (for Firebase sync)
  app.get('/api/auth/user-by-email/:email', async (req, res) => {
    try {
      const email = decodeURIComponent(req.params.email);
      
      // Cache headers
      res.set({
        'Cache-Control': 'private, max-age=300',
        'ETag': `email-${email.replace('@', '-')}-${Date.now()}`
      });
      
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user by email:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Admin middleware for Firebase authentication
  const isAdmin = async (req: any, res: any, next: any) => {
    try {
      const userId = req.headers['x-user-id'] || req.headers['X-User-ID']; // Firebase UID from frontend
      console.log('Admin check - Headers:', Object.keys(req.headers));
      console.log('Admin check - Firebase UID:', userId);
      console.log('Admin check - URL:', req.url);
      
      // For development, allow access if no user ID is provided (temporary bypass)
      if (!userId && process.env.NODE_ENV === 'development') {
        console.log('Admin check - Development mode: Allowing access without authentication');
        req.user = { id: 'dev-admin', email: 'astrosalikriyaz@gmail.com', isAdmin: true };
        return next();
      }
      
      if (!userId) {
        console.log('Admin check - No user ID found in headers');
        return res.status(401).json({ message: "Authentication required" });
      }
      
      // For Firebase auth, userId is the Firebase UID (e.g., "23462202")
      // But our database stores users by email, so we need to find the admin user
      
      // Get all users and find the one with matching Firebase UID or admin email
      const allUsers = await storage.getAllUsers();
      let user = allUsers.find(u => u.id === userId);
      
      // If not found by UID, check if this Firebase UID belongs to the admin email
      if (!user) {
        user = allUsers.find(u => u.email === 'astrosalikriyaz@gmail.com' && u.isAdmin);
        console.log('Admin user found by email:', !!user);
      }
      
      if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      req.user = user;
      next();
    } catch (error) {
      console.error("Error checking admin status:", error);
      res.status(500).json({ message: "Failed to verify admin status" });
    }
  };

  // Admin routes
  
  // Manual trigger for Google Sheets export (admin only)
  app.post(
    "/api/admin/export-to-sheets",
    isAdmin,
    async (req: any, res) => {
      try {
        console.log('[API] Manual export triggered by admin');
        const spreadsheetId = await exportCampaignsToGoogleSheets();
        res.json({ 
          message: "Export completed successfully for all campaigns accepting registrations",
          spreadsheetId,
        });
      } catch (error) {
        console.error("Error exporting to Google Sheets:", error);
        res.status(500).json({ 
          message: "Failed to export to Google Sheets",
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    },
  );
  
  app.get(
    "/api/admin/users",
    isAdmin,
    async (req: any, res) => {
      try {
        const users = await storage.getAllUsers();
        res.json(users);
      } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Failed to fetch users" });
      }
    },
  );

  app.get(
    "/api/admin/blog-posts",
    isAdmin,
    async (req: any, res) => {
      try {
        const posts = await storage.getBlogPosts();
        res.json(posts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        res.status(500).json({ message: "Failed to fetch blog posts" });
      }
    },
  );

  app.get(
    "/api/admin/workshops",
    
    isAdmin,
    async (req: any, res) => {
      try {
        const workshops = await storage.getWorkshops();
        res.json(workshops);
      } catch (error) {
        console.error("Error fetching workshops:", error);
        res.status(500).json({ message: "Failed to fetch workshops" });
      }
    },
  );

  app.get(
    "/api/admin/courses",
    
    isAdmin,
    async (req: any, res) => {
      try {
        const courses = await storage.getCourses();
        res.json(courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ message: "Failed to fetch courses" });
      }
    },
  );

  app.get(
    "/api/admin/campaigns",
    
    isAdmin,
    async (req: any, res) => {
      try {
        const campaigns = await storage.getCampaigns();
        res.json(campaigns);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        res.status(500).json({ message: "Failed to fetch campaigns" });
      }
    },
  );

  app.get(
    "/api/admin/campaign-participants",
    isAdmin,
    async (req: any, res) => {
      try {
        const registrations = await storage.getAllCampaignTeamRegistrations();
        res.json(registrations);
      } catch (error) {
        console.error("Error fetching campaign team registrations:", error);
        res.status(500).json({ message: "Failed to fetch campaign team registrations" });
      }
    },
  );

  // Admin POST routes for content creation
  app.post(
    "/api/admin/blog-posts",
    
    isAdmin,
    async (req: any, res) => {
      try {
        const postData = insertBlogPostSchema.parse(req.body);
        const post = await storage.createBlogPost(postData);
        res.json(post);
      } catch (error) {
        console.error("Error creating blog post:", error);
        res.status(500).json({ message: "Failed to create blog post" });
      }
    },
  );

  app.post(
    "/api/admin/workshops",
    
    isAdmin,
    async (req: any, res) => {
      try {
        const workshopData = insertWorkshopSchema.parse(req.body);
        const workshop = await storage.createWorkshop(workshopData);
        res.json(workshop);
      } catch (error) {
        console.error("Error creating workshop:", error);
        res.status(500).json({ message: "Failed to create workshop" });
      }
    },
  );

  app.post(
    "/api/admin/courses",
    
    isAdmin,
    async (req: any, res) => {
      try {
        // Clean the request body to handle empty strings for numeric fields
        const cleanedBody = { ...req.body };
        if (
          cleanedBody.price === "" ||
          cleanedBody.price === null ||
          cleanedBody.price === undefined
        ) {
          delete cleanedBody.price;
        }
        if (
          cleanedBody.capacity === "" ||
          cleanedBody.capacity === null ||
          cleanedBody.capacity === undefined
        ) {
          delete cleanedBody.capacity;
        }
        if (
          cleanedBody.duration === "" ||
          cleanedBody.duration === null ||
          cleanedBody.duration === undefined
        ) {
          delete cleanedBody.duration;
        }
        if (
          cleanedBody.instructorName === "" ||
          cleanedBody.instructorName === null ||
          cleanedBody.instructorName === undefined
        ) {
          delete cleanedBody.instructorName;
        }

        const courseData = insertCourseSchema.parse(cleanedBody);
        const course = await storage.createCourse(courseData);
        res.json(course);
      } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({ message: "Failed to create course" });
      }
    },
  );

  app.post(
    "/api/admin/campaigns",
    
    isAdmin,
    async (req: any, res) => {
      try {
        console.log("[Campaign Creation] Received data:", JSON.stringify(req.body, null, 2));
        const campaignData = insertCampaignSchema.parse(req.body);
        console.log("[Campaign Creation] Validated data:", JSON.stringify(campaignData, null, 2));
        const campaign = await storage.createCampaign(campaignData);
        console.log("[Campaign Creation] Created campaign:", campaign.id, campaign.title);
        res.json(campaign);
      } catch (error) {
        console.error("Error creating campaign:", error);
        if (error instanceof z.ZodError) {
          console.error("Validation errors:", JSON.stringify(error.errors, null, 2));
          res.status(400).json({ message: "Validation failed", errors: error.errors });
        } else {
          res.status(500).json({ message: "Failed to create campaign" });
        }
      }
    },
  );

  app.put(
    "/api/admin/campaigns/:id",
    
    isAdmin,
    async (req: any, res) => {
      try {
        const id = parseInt(req.params.id);
        const campaignData = insertCampaignSchema.parse(req.body);
        const campaign = await storage.updateCampaign(id, campaignData);
        res.json(campaign);
      } catch (error) {
        console.error("Error updating campaign:", error);
        res.status(500).json({ message: "Failed to update campaign" });
      }
    },
  );

  app.post(
    "/api/admin/courses/:courseId/lessons",
    
    isAdmin,
    async (req: any, res) => {
      try {
        const courseId = parseInt(req.params.courseId);
        const lessonData = {
          ...req.body,
          courseId,
        };
        const lesson = await storage.createCourseLesson(lessonData);
        res.json(lesson);
      } catch (error) {
        console.error("Error creating lesson:", error);
        res.status(500).json({ message: "Failed to create lesson" });
      }
    },
  );

  // Update endpoints
  app.put(
    "/api/admin/blog-posts/:id",
    
    isAdmin,
    async (req: any, res) => {
      try {
        const id = parseInt(req.params.id);
        const blogData = insertBlogPostSchema.parse(req.body);
        const blog = await storage.updateBlogPost(id, blogData);
        res.json(blog);
      } catch (error) {
        console.error("Error updating blog post:", error);
        res.status(500).json({ message: "Failed to update blog post" });
      }
    },
  );

  app.put(
    "/api/admin/workshops/:id",
    
    isAdmin,
    async (req: any, res) => {
      try {
        const id = parseInt(req.params.id);
        const workshopData = insertWorkshopSchema.parse(req.body);
        const workshop = await storage.updateWorkshop(id, workshopData);
        res.json(workshop);
      } catch (error) {
        console.error("Error updating workshop:", error);
        res.status(500).json({ message: "Failed to update workshop" });
      }
    },
  );

  app.put(
    "/api/admin/courses/:id",
    
    isAdmin,
    async (req: any, res) => {
      try {
        const id = parseInt(req.params.id);

        // Clean the request body to handle empty strings for numeric fields
        const cleanedBody = { ...req.body };
        if (
          cleanedBody.price === "" ||
          cleanedBody.price === null ||
          cleanedBody.price === undefined
        ) {
          delete cleanedBody.price;
        }
        if (
          cleanedBody.capacity === "" ||
          cleanedBody.capacity === null ||
          cleanedBody.capacity === undefined
        ) {
          delete cleanedBody.capacity;
        }
        if (
          cleanedBody.duration === "" ||
          cleanedBody.duration === null ||
          cleanedBody.duration === undefined
        ) {
          delete cleanedBody.duration;
        }
        if (
          cleanedBody.instructorName === "" ||
          cleanedBody.instructorName === null ||
          cleanedBody.instructorName === undefined
        ) {
          delete cleanedBody.instructorName;
        }

        const courseData = insertCourseSchema.parse(cleanedBody);
        const course = await storage.updateCourse(id, courseData);
        res.json(course);
      } catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({ message: "Failed to update course" });
      }
    },
  );

  app.put(
    "/api/admin/campaigns/:id",
    
    isAdmin,
    async (req: any, res) => {
      try {
        const id = parseInt(req.params.id);
        const campaignData = insertCampaignSchema.parse(req.body);
        const campaign = await storage.updateCampaign(id, campaignData);
        res.json(campaign);
      } catch (error) {
        console.error("Error updating campaign:", error);
        res.status(500).json({ message: "Failed to update campaign" });
      }
    },
  );

  // Admin PATCH route for user management
  app.patch(
    "/api/admin/users/:id",
    
    isAdmin,
    async (req: any, res) => {
      try {
        const { id } = req.params;
        const { isAdmin } = req.body;
        const user = await storage.updateUserAdminStatus(id, isAdmin);
        res.json(user);
      } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Failed to update user" });
      }
    },
  );

  app.get(
    "/api/admin/inquiries",
    
    isAdmin,
    async (req: any, res) => {
      try {
        const inquiries = await storage.getContactInquiries();
        res.json(inquiries);
      } catch (error) {
        console.error("Error fetching inquiries:", error);
        res.status(500).json({ message: "Failed to fetch inquiries" });
      }
    },
  );

  app.get(
    "/api/admin/workshop-registrations",
    
    isAdmin,
    async (req: any, res) => {
      try {
        const registrations = await storage.getWorkshopRegistrations();
        res.json(registrations);
      } catch (error) {
        console.error("Error fetching workshop registrations:", error);
        res
          .status(500)
          .json({ message: "Failed to fetch workshop registrations" });
      }
    },
  );

  app.patch(
    "/api/admin/workshop-registrations/:id/status",
    
    isAdmin,
    async (req: any, res) => {
      try {
        const { id } = req.params;
        const { status } = req.body;
        const registration = await storage.updateWorkshopRegistrationStatus(
          parseInt(id),
          status,
        );
        res.json(registration);
      } catch (error) {
        console.error("Error updating workshop registration status:", error);
        res
          .status(500)
          .json({ message: "Failed to update registration status" });
      }
    },
  );

  app.patch(
    "/api/admin/users/:id/admin-status",
    
    isAdmin,
    async (req: any, res) => {
      try {
        const { id } = req.params;
        const { isAdmin } = req.body;
        const user = await storage.updateUserAdminStatus(id, isAdmin);
        res.json(user);
      } catch (error) {
        console.error("Error updating admin status:", error);
        res.status(500).json({ message: "Failed to update admin status" });
      }
    },
  );

  app.delete(
    "/api/admin/users/:id",
    
    isAdmin,
    async (req: any, res) => {
      try {
        const { id } = req.params;
        await storage.deleteUser(id);
        res.json({ message: "User deleted successfully" });
      } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Failed to delete user" });
      }
    },
  );

  app.delete(
    "/api/admin/blog-posts/:id",
    
    isAdmin,
    async (req: any, res) => {
      try {
        const { id } = req.params;
        await storage.deleteBlogPost(parseInt(id));
        res.json({ message: "Blog post deleted successfully" });
      } catch (error) {
        console.error("Error deleting blog post:", error);
        res.status(500).json({ message: "Failed to delete blog post" });
      }
    },
  );

  app.delete(
    "/api/admin/workshops/:id",
    
    isAdmin,
    async (req: any, res) => {
      try {
        const { id } = req.params;
        await storage.deleteWorkshop(parseInt(id));
        res.json({ message: "Workshop deleted successfully" });
      } catch (error) {
        console.error("Error deleting workshop:", error);
        res.status(500).json({ message: "Failed to delete workshop" });
      }
    },
  );

  app.delete(
    "/api/admin/courses/:id",
    
    isAdmin,
    async (req: any, res) => {
      try {
        const { id } = req.params;
        await storage.deleteCourse(parseInt(id));
        res.json({ message: "Course deleted successfully" });
      } catch (error) {
        console.error("Error deleting course:", error);
        res.status(500).json({ message: "Failed to delete course" });
      }
    },
  );

  app.delete(
    "/api/admin/campaigns/:id",
    
    isAdmin,
    async (req: any, res) => {
      try {
        const { id } = req.params;
        await storage.deleteCampaign(parseInt(id));
        res.json({ message: "Campaign deleted successfully" });
      } catch (error) {
        console.error("Error deleting campaign:", error);
        res.status(500).json({ message: "Failed to delete campaign" });
      }
    },
  );

  app.delete(
    "/api/admin/workshop-registrations/:id",
    
    isAdmin,
    async (req: any, res) => {
      try {
        const { id } = req.params;
        await storage.deleteWorkshopRegistration(parseInt(id));
        res.json({ message: "Workshop registration deleted successfully" });
      } catch (error) {
        console.error("Error deleting workshop registration:", error);
        res
          .status(500)
          .json({ message: "Failed to delete workshop registration" });
      }
    },
  );

  app.delete(
    "/api/admin/inquiries/:id",
    
    isAdmin,
    async (req: any, res) => {
      try {
        const { id } = req.params;
        await storage.deleteContactInquiry(parseInt(id));
        res.json({ message: "Contact inquiry deleted successfully" });
      } catch (error) {
        console.error("Error deleting contact inquiry:", error);
        res.status(500).json({ message: "Failed to delete contact inquiry" });
      }
    },
  );

  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.upsertUser(userData);
      res.json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  // Workshop routes
  app.get("/api/workshops", async (req, res) => {
    try {
      let workshops = await storage.getWorkshops();

      // Remove all existing workshops from featured first
      for (const workshop of workshops) {
        if (workshop.isFeatured) {
          await storage.updateWorkshop(workshop.id, {
            isFeatured: false,
            featuredOrder: 0
          });
        }
      }

      // Create Featured Workshop if it doesn't exist
      let featuredWorkshop = workshops.find(w => w.title === "Space Technology Workshop");
      if (!featuredWorkshop) {
        featuredWorkshop = await storage.createWorkshop({
          title: "Space Technology Workshop",
          description: "Hands-on workshop covering satellite technology, rocket propulsion, and space mission design. Learn from industry experts and work on real space projects. Instructor: Dr. Mitchell. Duration: 3 days. Requirements: Basic physics knowledge, laptop required. Outcomes: Certificate of completion, hands-on project portfolio",
          type: "expert_session",
          maxParticipants: 30,
          price: "1500.00",
          startDate: "2025-03-15",
          endDate: "2025-03-17",
          location: "Zoonigia Innovation Center",
          isFeatured: true,
          featuredOrder: 3,
        });
      } else {
        await storage.updateWorkshop(featuredWorkshop.id, {
          isFeatured: true,
          featuredOrder: 3
        });
      }

      res.json(workshops);
    } catch (error) {
      console.error("Error fetching workshops:", error);
      res.status(500).json({ message: "Failed to fetch workshops" });
    }
  });

  app.get("/api/workshops/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const workshop = await storage.getWorkshopById(id);
      if (!workshop) {
        return res.status(404).json({ message: "Workshop not found" });
      }
      res.json(workshop);
    } catch (error) {
      console.error("Error fetching workshop:", error);
      res.status(500).json({ message: "Failed to fetch workshop" });
    }
  });

  app.post("/api/workshops/enroll", async (req, res) => {
    try {
      const enrollmentData = insertWorkshopEnrollmentSchema.parse(req.body);
      const enrollment = await storage.enrollInWorkshop(enrollmentData);
      res.json(enrollment);
    } catch (error) {
      console.error("Error enrolling in workshop:", error);
      res.status(500).json({ message: "Failed to enroll in workshop" });
    }
  });

  app.post("/api/workshops/register", async (req, res) => {
    try {
      const registrationData = req.body;
      console.log("Workshop registration received:", registrationData);

      // Store registration in database
      const registration =
        await storage.createWorkshopRegistration(registrationData);

      res.json({
        message: "Registration successful",
        registrationId: registration.id,
      });
    } catch (error) {
      console.error("Error processing workshop registration:", error);
      res.status(500).json({ message: "Failed to process registration" });
    }
  });

  // Course routes
  app.get("/api/courses", async (req, res) => {
    try {
      let courses = await storage.getCourses();

      // Remove Introduction to Space Science from featured
      const spaceScienceCourse = courses.find(c => c.title === "Introduction to Space Science");
      if (spaceScienceCourse) {
        await storage.updateCourse(spaceScienceCourse.id, {
          isFeatured: false,
          featuredOrder: 0
        });
      }

      // Remove Advanced Robotics & AI from featured
      const advancedRoboticsCourse = courses.find(c => c.title === "Advanced Robotics & AI");
      if (advancedRoboticsCourse) {
        await storage.updateCourse(advancedRoboticsCourse.id, {
          isFeatured: false,
          featuredOrder: 0
        });
      }

      // Remove Advanced Space Technology from featured if it exists
      const advancedSpaceCourse = courses.find(c => c.title === "Advanced Space Technology");
      if (advancedSpaceCourse) {
        await storage.updateCourse(advancedSpaceCourse.id, {
          isFeatured: false,
          featuredOrder: 0
        });
      }

      // Add sample courses if none exist
      if (courses.length === 0) {
        await storage.createCourse({
          title: "Introduction to Space Science",
          description:
            "Explore the fundamentals of frontier sciences including planetary motion, stellar evolution, and cosmic phenomena. Perfect for beginners looking to understand the universe.",
          field: "astronomy",
          level: "beginner",
          duration: "8 weeks",
          price: "2999.00",
          imageUrl: "https://i.pinimg.com/1200x/f8/6e/f5/f86ef5d275ce8856166fdf1c2e5138c0.jpg",
          instructorName: "Mr. Salik Riyaz",
          status: "published",
          category: "Space Science",
          totalLessons: 12,
          totalDuration: 720,
          isFeatured: true,
          featuredOrder: 1,
          learningObjectives: [
            "Understand the structure and evolution of the universe",
            "Learn about planetary systems and their characteristics",
            "Explore stellar lifecycles and cosmic phenomena",
            "Develop skills in astronomical observation and data analysis",
          ],
          prerequisites: [
            "Basic mathematics knowledge",
            "Interest in science and astronomy",
          ],
        });

        await storage.createCourse({
          title: "Advanced Robotics & AI",
          description:
            "Dive deep into robotics engineering and artificial intelligence. Learn to build autonomous robots, implement machine learning algorithms, and create intelligent systems.",
          field: "robotics",
          level: "advanced",
          duration: "12 weeks",
          price: "4999.00",
          imageUrl: "/api/placeholder/300/200",
          instructorName: "Prof. Reena Sharma",
          status: "published",
          category: "Robotics",
          totalLessons: 18,
          totalDuration: 1080,
          learningObjectives: [
            "Master advanced robotics concepts and algorithms",
            "Implement AI and machine learning in robotic systems",
            "Build and program autonomous robots",
            "Understand sensor integration and control systems",
          ],
          prerequisites: [
            "Programming experience in Python or C++",
            "Basic understanding of electronics",
            "Linear algebra and calculus knowledge",
          ],
        });

        await storage.createCourse({
          title: "Quantum Computing Fundamentals",
          description:
            "Enter the revolutionary world of quantum computing. Learn quantum mechanics principles, quantum algorithms, and their applications in modern computing.",
          field: "quantum",
          level: "intermediate",
          duration: "10 weeks",
          price: "3999.00",
          imageUrl: "/api/placeholder/300/200",
          instructorName: "Dr. Vikram Singh",
          status: "published",
          category: "Quantum Technology",
          totalLessons: 15,
          totalDuration: 900,
          learningObjectives: [
            "Understand quantum mechanics principles",
            "Learn quantum algorithms and programming",
            "Explore quantum cryptography and communication",
            "Apply quantum computing to real-world problems",
          ],
          prerequisites: [
            "Linear algebra and complex numbers",
            "Basic programming knowledge",
            "Understanding of classical computing",
          ],
        });

        courses = await storage.getCourses();

        // Add sample lessons for the first course
        if (courses.length > 0) {
          const firstCourse = courses[0];

          // Create modules for the first course
          await storage.createCourseModule({
            courseId: firstCourse.id,
            title: "Introduction to the Universe",
            description: "Basic concepts and overview of frontier sciences",
            orderIndex: 1,
          });

          await storage.createCourseModule({
            courseId: firstCourse.id,
            title: "Solar System Exploration",
            description: "Study our solar system and its components",
            orderIndex: 2,
          });

          await storage.createCourseModule({
            courseId: firstCourse.id,
            title: "Stellar Evolution",
            description: "Learn about star formation and lifecycle",
            orderIndex: 3,
          });

          // Create sample lessons for the first course
          await storage.createCourseLesson({
            courseId: firstCourse.id,
            title: "Welcome to Frontier Sciences",
            description:
              "Introduction to the course and frontier sciences fundamentals",
            content:
              "<p>Welcome to our comprehensive frontier sciences course! In this lesson, we'll explore the basic principles of astronomy and space exploration.</p><p>You'll learn about the scale of the universe, from planets to galaxies, and discover how scientists study celestial objects.</p>",
            videoUrl: "https://example.com/intro-video",
            duration: 30,
            orderIndex: 1,
            type: "video",
            isPreview: true,
            resources: ["Course syllabus", "Space science glossary"],
          });

          await storage.createCourseLesson({
            courseId: firstCourse.id,
            title: "The Scale of the Universe",
            description: "Understanding distances and sizes in space",
            content:
              "<p>The universe is incredibly vast, with distances measured in light-years and astronomical units. This lesson covers the scale from Earth to the observable universe.</p>",
            videoUrl: "https://example.com/scale-video",
            duration: 45,
            orderIndex: 2,
            type: "video",
            resources: ["Scale comparison chart", "Interactive universe map"],
          });

          await storage.createCourseLesson({
            courseId: firstCourse.id,
            title: "Planetary Motion Laws",
            description: "Kepler's laws and orbital mechanics",
            content:
              "<p>Johannes Kepler discovered three fundamental laws that describe planetary motion. These laws revolutionized our understanding of the solar system.</p>",
            duration: 40,
            orderIndex: 3,
            type: "text",
            resources: ["Kepler's laws worksheet", "Orbital calculator"],
          });

          await storage.createCourseLesson({
            courseId: firstCourse.id,
            title: "Solar System Overview",
            description: "Tour of planets, moons, and other objects",
            content:
              "<p>Our solar system contains eight planets, numerous moons, asteroids, and comets. Each world has unique characteristics and history.</p>",
            videoUrl: "https://example.com/solar-system-video",
            duration: 60,
            orderIndex: 4,
            type: "video",
            resources: ["Planet fact sheets", "Solar system timeline"],
          });

          await storage.createCourseLesson({
            courseId: firstCourse.id,
            title: "Knowledge Check: Solar System",
            description: "Test your understanding of solar system basics",
            content:
              "<p>Complete this quiz to test your knowledge of the solar system and planetary characteristics.</p>",
            duration: 20,
            orderIndex: 5,
            type: "quiz",
            resources: ["Quiz reference guide"],
          });
        }
      }

      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const course = await storage.getCourseById(id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  // Create Razorpay order for course enrollment
  app.post(
    "/api/courses/create-payment-order",
    
    async (req: any, res) => {
      try {
        const { courseId, paymentAmount } = req.body;

        // Create Razorpay order
        const order = await razorpay.orders.create({
          amount: Math.round(paymentAmount * 100), // Convert to paise (smallest unit)
          currency: "INR",
          receipt: `course_${courseId}_${Date.now()}`,
          notes: {
            courseId: courseId.toString(),
          },
        });

        res.json({
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          keyId: process.env.RAZORPAY_KEY_ID,
        });
      } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ message: "Failed to create payment order" });
      }
    },
  );

  app.post("/api/courses/enroll", async (req, res) => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        courseId,
        userId,
        paymentAmount,
      } = req.body;

      // Verify payment signature
      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({ message: "Invalid payment signature" });
      }

      // Create enrollment record
      const enrollmentData = {
        courseId: parseInt(courseId),
        userId: userId,
      };

      const enrollment = await storage.enrollInCourse(enrollmentData);
      
      // Update course enrollment count
      const course = await storage.getCourseById(parseInt(courseId));
      if (course) {
        await storage.updateCourse(parseInt(courseId), {
          enrollmentCount: (course.enrollmentCount || 0) + 1
        });
      }
      
      // Create invoice
      const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const invoice = await storage.createInvoice({
        invoiceNumber,
        userId,
        itemType: 'course',
        itemId: parseInt(courseId),
        itemName: course?.title || 'Course',
        amount: paymentAmount,
        tax: "0.00",
        totalAmount: paymentAmount,
        paymentId: razorpay_payment_id,
        paymentMethod: 'razorpay',
        paymentStatus: 'completed',
      });

      // TODO: Send invoice email to user
      
      res.json({ 
        message: "Successfully enrolled in course", 
        enrollment,
        invoice 
      });
    } catch (error) {
      console.error("Error enrolling in course:", error);
      res.status(500).json({ message: "Failed to enroll in course" });
    }
  });

  app.get("/api/courses/:courseId/enrollment/:userId", async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const userId = req.params.userId;
      const enrollment = await storage.getCourseEnrollment(userId, courseId);
      res.json(enrollment || null);
    } catch (error) {
      console.error("Error checking course enrollment:", error);
      res.status(500).json({ message: "Failed to check enrollment" });
    }
  });

  // LMS API routes
  // Course modules
  app.get("/api/courses/:courseId/modules", async (req, res) => {
    try {
      const modules = await storage.getCourseModules(
        parseInt(req.params.courseId),
      );
      res.json(modules);
    } catch (error) {
      console.error("Error fetching course modules:", error);
      res.status(500).json({ message: "Failed to fetch course modules" });
    }
  });

  app.post(
    "/api/courses/:courseId/modules",
    
    async (req, res) => {
      try {
        const module = await storage.createCourseModule({
          ...req.body,
          courseId: parseInt(req.params.courseId),
        });
        res.json(module);
      } catch (error) {
        console.error("Error creating course module:", error);
        res.status(500).json({ message: "Failed to create course module" });
      }
    },
  );

  // Course lessons
  app.get("/api/courses/:courseId/lessons", async (req, res) => {
    try {
      const lessons = await storage.getCourseLessons(
        parseInt(req.params.courseId),
      );
      res.json(lessons);
    } catch (error) {
      console.error("Error fetching course lessons:", error);
      res.status(500).json({ message: "Failed to fetch course lessons" });
    }
  });

  app.get("/api/lessons/:id", async (req, res) => {
    try {
      const lesson = await storage.getLessonById(parseInt(req.params.id));
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      res.json(lesson);
    } catch (error) {
      console.error("Error fetching lesson:", error);
      res.status(500).json({ message: "Failed to fetch lesson" });
    }
  });

  app.post(
    "/api/courses/:courseId/lessons",
    
    async (req, res) => {
      try {
        const lesson = await storage.createCourseLesson({
          ...req.body,
          courseId: parseInt(req.params.courseId),
        });
        res.json(lesson);
      } catch (error) {
        console.error("Error creating course lesson:", error);
        res.status(500).json({ message: "Failed to create course lesson" });
      }
    },
  );

  // Check course enrollment status
  app.get(
    "/api/courses/:courseId/enrollment-status",
    firebaseAuth,
    async (req: any, res) => {
      try {
        const userId = req.user.claims.sub;
        const courseId = parseInt(req.params.courseId);
        const enrollment = await storage.getCourseEnrollment(userId, courseId);
        res.json({ isEnrolled: !!enrollment, enrollment });
      } catch (error) {
        console.error("Error checking enrollment status:", error);
        res.status(500).json({ message: "Failed to check enrollment status" });
      }
    },
  );

  // Student progress
  app.get(
    "/api/courses/:courseId/progress",
    firebaseAuth,
    async (req: any, res) => {
      try {
        const userId = req.user.claims.sub;
        const progress = await storage.getStudentProgress(
          userId,
          parseInt(req.params.courseId),
        );
        res.json(progress);
      } catch (error) {
        console.error("Error fetching student progress:", error);
        res.status(500).json({ message: "Failed to fetch student progress" });
      }
    },
  );

  app.post(
    "/api/lessons/:lessonId/progress",
    firebaseAuth,
    async (req: any, res) => {
      try {
        const userId = req.user.claims.sub;
        const progress = await storage.createStudentProgress({
          ...req.body,
          userId,
          lessonId: parseInt(req.params.lessonId),
        });
        res.json(progress);
      } catch (error) {
        console.error("Error creating student progress:", error);
        res.status(500).json({ message: "Failed to create student progress" });
      }
    },
  );

  // Course quizzes
  app.get("/api/courses/:courseId/quizzes", async (req, res) => {
    try {
      const quizzes = await storage.getCourseQuizzes(
        parseInt(req.params.courseId),
      );
      res.json(quizzes);
    } catch (error) {
      console.error("Error fetching course quizzes:", error);
      res.status(500).json({ message: "Failed to fetch course quizzes" });
    }
  });

  app.post(
    "/api/quizzes/:quizId/attempts",
    firebaseAuth,
    async (req: any, res) => {
      try {
        const userId = req.user.claims.sub;
        const attempt = await storage.createQuizAttempt({
          ...req.body,
          userId,
          quizId: parseInt(req.params.quizId),
        });
        res.json(attempt);
      } catch (error) {
        console.error("Error creating quiz attempt:", error);
        res.status(500).json({ message: "Failed to create quiz attempt" });
      }
    },
  );

  // Course reviews
  app.get("/api/courses/:courseId/reviews", async (req, res) => {
    try {
      const reviews = await storage.getCourseReviews(
        parseInt(req.params.courseId),
      );
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching course reviews:", error);
      res.status(500).json({ message: "Failed to fetch course reviews" });
    }
  });

  app.post(
    "/api/courses/:courseId/reviews",
    firebaseAuth,
    async (req: any, res) => {
      try {
        const userId = req.user.claims.sub;
        const review = await storage.createCourseReview({
          ...req.body,
          userId,
          courseId: parseInt(req.params.courseId),
        });
        res.json(review);
      } catch (error) {
        console.error("Error creating course review:", error);
        res.status(500).json({ message: "Failed to create course review" });
      }
    },
  );

  // User certificates
  app.get("/api/user/certificates", firebaseAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const certificates = await storage.getUserCertificates(userId);
      res.json(certificates);
    } catch (error) {
      console.error("Error fetching user certificates:", error);
      res.status(500).json({ message: "Failed to fetch user certificates" });
    }
  });

  // Generate certificate for completed course
  app.post("/api/courses/:courseId/generate-certificate", firebaseAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const courseId = parseInt(req.params.courseId);

      // Check if course is completed (all lessons marked as complete)
      const lessons = await storage.getCourseLessons(courseId);
      const progress = await storage.getStudentProgress(userId, courseId);
      
      const completedLessons = progress.filter((p: any) => p.completed).length;
      const isCompleted = completedLessons === lessons.length && lessons.length > 0;

      if (!isCompleted) {
        return res.status(400).json({ message: "Course not completed yet" });
      }

      // Check if certificate already exists
      const existingCertificates = await storage.getUserCertificates(userId);
      const existingCertificate = existingCertificates.find((cert: any) => cert.courseId === courseId);

      if (existingCertificate) {
        return res.json(existingCertificate);
      }

      // Create certificate
      const course = await storage.getCourseById(courseId);
      const user = await storage.getUser(userId);

      const certificate = await storage.createCourseCertificate({
        userId,
        courseId,
        certificateUrl: `https://zoonigia.com/certificates/${userId}/${courseId}`,
        verificationCode: `ZOOG-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      });

      res.json(certificate);
    } catch (error) {
      console.error("Error generating certificate:", error);
      res.status(500).json({ message: "Failed to generate certificate" });
    }
  });

  // ==================== INVOICES ====================

  // Get user's invoices
  app.get("/api/user/invoices", firebaseAuth as any, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const invoices = await storage.getUserInvoices(userId);
      res.json(invoices);
    } catch (error) {
      console.error("Error fetching user invoices:", error);
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });

  // Get specific invoice by ID
  app.get("/api/invoices/:id", firebaseAuth as any, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const invoiceId = parseInt(req.params.id);
      const invoice = await storage.getInvoiceById(invoiceId);

      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }

      // Check if invoice belongs to user
      if (invoice.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      res.json(invoice);
    } catch (error) {
      console.error("Error fetching invoice:", error);
      res.status(500).json({ message: "Failed to fetch invoice" });
    }
  });

  // ==================== DATABASE RESET (ADMIN ONLY) ====================

  // Delete specific campaign registration (Admin only - for testing)
  app.delete("/api/admin/campaign-registrations/:campaignId/user/:userId", firebaseAuth as any, async (req: any, res) => {
    try {
      const adminUserId = req.user.claims.sub;
      const adminUser = await storage.getUser(adminUserId);

      if (!adminUser?.isAdmin) {
        return res.status(403).json({ message: "Unauthorized - Admin access required" });
      }

      const campaignId = parseInt(req.params.campaignId);
      const userId = req.params.userId;

      // Delete campaign participant
      await db.delete(campaignParticipants)
        .where(and(
          eq(campaignParticipants.campaignId, campaignId),
          eq(campaignParticipants.userId, userId)
        ));

      res.json({ message: "Registration deleted successfully" });
    } catch (error) {
      console.error("Error deleting campaign registration:", error);
      res.status(500).json({ message: "Failed to delete registration" });
    }
  });

  // Delete ALL registrations for a specific campaign by title via GET (Admin only - for testing)
  app.get("/api/admin/delete-campaign-registration/:campaignTitle", firebaseAuth as any, async (req: any, res) => {
    try {
      const adminUserId = req.user.claims.sub;
      const adminUser = await storage.getUser(adminUserId);

      if (!adminUser?.isAdmin) {
        return res.status(403).json({ message: "Unauthorized - Admin access required" });
      }

      const campaignTitle = decodeURIComponent(req.params.campaignTitle);

      // Find campaign by title
      const allCampaigns = await storage.getCampaigns();
      const campaign = allCampaigns.find(c => c.title.toLowerCase().includes(campaignTitle.toLowerCase()));

      if (!campaign) {
        return res.status(404).json({ message: `Campaign with "${campaignTitle}" not found` });
      }

      // Delete all participants for this campaign (both tables)
      const participantsResult = await db.delete(campaignParticipants)
        .where(eq(campaignParticipants.campaignId, campaign.id))
        .returning();

      const teamResult = await db.delete(campaignTeamRegistrations)
        .where(eq(campaignTeamRegistrations.campaignId, campaign.id))
        .returning();

      const totalDeleted = participantsResult.length + teamResult.length;

      res.json({ 
        message: `Deleted ${totalDeleted} registration(s) for "${campaign.title}" (${participantsResult.length} individual, ${teamResult.length} teams)`,
        campaignId: campaign.id,
        deletedCount: totalDeleted
      });
    } catch (error) {
      console.error("Error deleting campaign registrations:", error);
      res.status(500).json({ message: "Failed to delete registrations", error: String(error) });
    }
  });

  // Delete ALL enrollments for a specific course by ID (Admin only - for testing)
  app.post("/api/admin/delete-course-enrollments", firebaseAuth as any, async (req: any, res) => {
    try {
      const firebaseUid = req.user.claims.sub;
      const email = req.user.claims.email;
      
      // Try to find user by Firebase UID first, then by email
      let adminUser = await storage.getUser(firebaseUid);
      if (!adminUser && email) {
        adminUser = await storage.getUserByEmail(email);
      }

      if (!adminUser?.isAdmin) {
        return res.status(403).json({ message: "Unauthorized - Admin access required" });
      }

      const { courseId } = req.body;

      // Delete all enrollments for this course
      const enrollmentsResult = await db.delete(courseEnrollments)
        .where(eq(courseEnrollments.courseId, courseId))
        .returning();

      res.json({ 
        message: `Deleted ${enrollmentsResult.length} enrollment(s) for course ID ${courseId}`,
        courseId,
        deletedCount: enrollmentsResult.length
      });
    } catch (error) {
      console.error("Error deleting course enrollments:", error);
      res.status(500).json({ message: "Failed to delete enrollments", error: String(error) });
    }
  });

  // Delete ALL registrations for a specific campaign by title (Admin only - for testing)
  app.post("/api/admin/delete-campaign-registration", firebaseAuth as any, async (req: any, res) => {
    try {
      const firebaseUid = req.user.claims.sub;
      const email = req.user.claims.email;
      
      // Try to find user by Firebase UID first, then by email
      let adminUser = await storage.getUser(firebaseUid);
      if (!adminUser && email) {
        adminUser = await storage.getUserByEmail(email);
      }

      if (!adminUser?.isAdmin) {
        return res.status(403).json({ message: "Unauthorized - Admin access required" });
      }

      const { campaignTitle } = req.body;

      // Find campaign by title
      const allCampaigns = await storage.getCampaigns();
      const campaign = allCampaigns.find(c => c.title.toLowerCase().includes(campaignTitle.toLowerCase()));

      if (!campaign) {
        return res.status(404).json({ message: `Campaign with "${campaignTitle}" not found` });
      }

      // Delete all participants for this campaign (both tables)
      const participantsResult = await db.delete(campaignParticipants)
        .where(eq(campaignParticipants.campaignId, campaign.id))
        .returning();

      const teamResult = await db.delete(campaignTeamRegistrations)
        .where(eq(campaignTeamRegistrations.campaignId, campaign.id))
        .returning();

      const totalDeleted = participantsResult.length + teamResult.length;

      res.json({ 
        message: `Deleted ${totalDeleted} registration(s) for "${campaign.title}" (${participantsResult.length} individual, ${teamResult.length} teams)`,
        campaignId: campaign.id,
        deletedCount: totalDeleted
      });
    } catch (error) {
      console.error("Error deleting campaign registrations:", error);
      res.status(500).json({ message: "Failed to delete registrations", error: String(error) });
    }
  });


  // Simple database reset - no auth required for now
  app.post("/api/admin/clear-data", async (req: any, res) => {
    try {
      console.log("🚀 CLEARING ALL TEST DATA...");
      
      // Clear all test data
      await db.delete(courseEnrollments);
      console.log("✓ Cleared course enrollments");
      
      await db.delete(workshopEnrollments);
      console.log("✓ Cleared workshop enrollments");
      
      await db.delete(campaignParticipants);
      console.log("✓ Cleared campaign participants");
      
      await db.delete(campaignTeamRegistrations);
      console.log("✓ Cleared campaign team registrations");
      
      await db.delete(workshopRegistrations);
      console.log("✓ Cleared workshop registrations");
      
      await db.delete(contactInquiries);
      console.log("✓ Cleared contact inquiries");
      
      await db.delete(loveMessages);
      console.log("✓ Cleared love messages");

      // Reset course enrollment counts to 0
      await db.update(courses).set({ enrollmentCount: 0 });
      console.log("✓ Reset course enrollment counts");
      
      // Specifically fix course ID 3 which seems to be stuck
      await db.update(courses).set({ 
        enrollmentCount: 0, 
        rating: "0.00", 
        reviewCount: 0 
      }).where(eq(courses.id, 3));
      console.log("✓ Fixed course ID 3 enrollment count");

      console.log("✅ ALL TEST DATA CLEARED! 🚀");

      res.json({ 
        message: "All test data cleared successfully! 🚀", 
        success: true
      });
    } catch (error: any) {
      console.error("❌ CLEAR ERROR:", error.message);
      res.status(500).json({ 
        message: "Failed to clear data", 
        error: error.message
      });
    }
  });

  // ==================== REFUND REQUESTS ====================

  // Get user's refund requests
  app.get("/api/user/refund-requests", firebaseAuth as any, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const refundRequests = await storage.getUserRefundRequests(userId);
      res.json(refundRequests);
    } catch (error) {
      console.error("Error fetching user refund requests:", error);
      res.status(500).json({ message: "Failed to fetch refund requests" });
    }
  });

  // Create refund request
  app.post("/api/refund-requests", firebaseAuth as any, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { invoiceId, reason } = req.body;

      // Get invoice to populate refund request details
      const invoice = await storage.getInvoiceById(invoiceId);

      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }

      // Check if invoice belongs to user
      if (invoice.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      // Check if refund already requested
      const existingRequests = await storage.getUserRefundRequests(userId);
      const alreadyRequested = existingRequests.find((r: any) => r.invoiceId === invoiceId && r.status !== 'rejected');

      if (alreadyRequested) {
        return res.status(400).json({ message: "Refund already requested for this order" });
      }

      const refundRequest = await storage.createRefundRequest({
        userId,
        invoiceId,
        itemType: invoice.itemType,
        itemId: invoice.itemId,
        itemName: invoice.itemName,
        refundAmount: invoice.totalAmount,
        reason,
        status: 'pending'
      });

      res.json(refundRequest);
    } catch (error) {
      console.error("Error creating refund request:", error);
      res.status(500).json({ message: "Failed to create refund request" });
    }
  });

  // Admin: Get all refund requests
  app.get("/api/admin/refund-requests", firebaseAuth as any, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);

      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const refundRequests = await storage.getAllRefundRequests();
      res.json(refundRequests);
    } catch (error) {
      console.error("Error fetching refund requests:", error);
      res.status(500).json({ message: "Failed to fetch refund requests" });
    }
  });

  // Admin: Update refund request status
  app.put("/api/admin/refund-requests/:id", firebaseAuth as any, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);

      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const refundId = parseInt(req.params.id);
      const { status, adminNotes } = req.body;

      const updatedRequest = await storage.updateRefundRequest(refundId, {
        status,
        adminNotes,
        processedBy: userId,
        processedAt: new Date(),
      });

      res.json(updatedRequest);
    } catch (error) {
      console.error("Error updating refund request:", error);
      res.status(500).json({ message: "Failed to update refund request" });
    }
  });

  // User dashboard - aggregated data
  app.get("/api/user/dashboard", async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Get all user data in parallel for performance
      const [
        enrolledCourses,
        campaignParticipations,
        workshopRegistrations,
        certificates,
        progress
      ] = await Promise.all([
        storage.getUserCourses(userId),
        storage.getUserCampaigns(userId),
        storage.getWorkshopRegistrations(),
        storage.getUserCertificates(userId),
        storage.getStudentProgress(userId, 0) // Get all progress for user
      ]);

      // Calculate stats
      const totalCourses = enrolledCourses.length;
      const completedCourses = certificates.length;
      const activeCampaigns = campaignParticipations.filter((p: any) => p.status === 'active').length;
      const upcomingWorkshops = workshopRegistrations.length;

      // Calculate total learning time (estimate based on progress)
      const totalMinutes = progress.reduce((sum: number, p: any) => {
        return sum + (p.timeSpent || 0);
      }, 0);
      const totalHours = Math.floor(totalMinutes / 60);

      res.json({
        stats: {
          totalCourses,
          completedCourses,
          activeCampaigns,
          upcomingWorkshops,
          totalHours
        },
        enrolledCourses,
        campaignParticipations,
        workshopRegistrations,
        certificates,
        recentProgress: progress.slice(0, 5) // Last 5 activities
      });
    } catch (error) {
      console.error("Error fetching user dashboard:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // Campaign routes
  app.get("/api/campaigns", async (req, res) => {
    try {
      let campaigns = await storage.getCampaigns();

      // Remove Zoonigia Asteroid Search Campaign from featured
      const asteroidCampaign = campaigns.find(c => c.title === "Zoonigia Asteroid Search Campaign");
      if (asteroidCampaign) {
        await storage.updateCampaign(asteroidCampaign.id, {
          isFeatured: false,
          featuredOrder: 0
        });
      }

      // Remove School Education Partnership Program from featured (if it exists)
      const schoolPartnershipCampaign = campaigns.find(c => c.title === "School Education Partnership Program");
      if (schoolPartnershipCampaign) {
        await storage.updateCampaign(schoolPartnershipCampaign.id, {
          isFeatured: false,
          featuredOrder: 0
        });
      }

      // Create Youth Ideathon Campaign if it doesn't exist
      let youthIdeathonCampaign = campaigns.find(c => c.title === "Youth Ideathon 2025");
      if (!youthIdeathonCampaign) {
        youthIdeathonCampaign = await storage.createCampaign({
          title: "Youth Ideathon 2025",
          description: "Join the ultimate innovation challenge for young minds! Develop groundbreaking solutions for space exploration, sustainability, and technology. Compete with peers globally and present your ideas to industry experts.",
          type: "innovation_challenge",
          field: "Innovation",
          duration: "8 weeks",
          startDate: "2025-02-01",
          endDate: "2025-03-31",
          partner: "Zoonigia • Industry Partners",
          status: "accepting_registrations",
          progress: 15,
          price: "0.00",
          isFree: true,
          isFeatured: true,
          featuredOrder: 1,
        });
      } else if (!youthIdeathonCampaign.isFeatured || !youthIdeathonCampaign.isFree) {
        await storage.updateCampaign(youthIdeathonCampaign.id, {
          isFeatured: true,
          featuredOrder: 1,
          isFree: true,
        });
      }
      // Add sample campaigns if none exist
      if (campaigns.length === 0) {
        await storage.createCampaign({
          title: "Zoonigia Asteroid Search Campaign",
          description:
            "Collaborate with NASA Citizen Science and IASC to discover real asteroids and name them officially",
          type: "asteroid_search",
          field: "Astronomy",
          duration: "16 weeks",
          startDate: "2025-08-17",
          endDate: "2025-11-23",
          partner: "NASA • IASC • University of Hawaii",
          status: "accepting_registrations",
          progress: 20,
          price: "300.00",
          isFeatured: true,
          featuredOrder: 1,
        });

        campaigns = await storage.getCampaigns();
      }

      // Filter out School Partnership from the list returned to clients
      campaigns = campaigns.filter(c => 
        c.title !== "School Education Partnership Program" && 
        !c.title.toLowerCase().includes("school") && 
        !c.title.toLowerCase().includes("partnership")
      );

      res.json(campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  app.get("/api/campaigns/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const campaign = await storage.getCampaignById(id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      console.error("Error fetching campaign:", error);
      res.status(500).json({ message: "Failed to fetch campaign" });
    }
  });

  app.post("/api/campaigns/join", async (req, res) => {
    try {
      const participantData = insertCampaignParticipantSchema.parse(req.body);
      const participant = await storage.joinCampaign(participantData);
      res.json(participant);
    } catch (error) {
      console.error("Error joining campaign:", error);
      res.status(500).json({ message: "Failed to join campaign" });
    }
  });

  app.get("/api/campaigns/:campaignId/participant/:userId", async (req, res) => {
    try {
      const campaignId = parseInt(req.params.campaignId);
      const userId = req.params.userId;
      const participant = await storage.getCampaignParticipant(userId, campaignId);
      res.json(participant || null);
    } catch (error) {
      console.error("Error checking campaign participation:", error);
      res.status(500).json({ message: "Failed to check participation" });
    }
  });

  // Create Razorpay order for campaign enrollment
  app.post(
    "/api/campaigns/create-payment-order",
    
    async (req: any, res) => {
      try {
        const { campaignId, paymentAmount } = req.body;

        // Create Razorpay order
        const order = await razorpay.orders.create({
          amount: Math.round(paymentAmount * 100), // Convert to paise (smallest unit)
          currency: "INR",
          receipt: `campaign_${campaignId}_${Date.now()}`,
          notes: {
            campaignId: campaignId.toString(),
          },
        });

        res.json({
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          keyId: process.env.RAZORPAY_KEY_ID,
        });
      } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ message: "Failed to create payment order" });
      }
    },
  );

  app.post("/api/campaigns/enroll", async (req: any, res) => {
    try {
      const { campaignId, razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentAmount, userId } = req.body;

      // Verify Razorpay payment signature
      const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generated_signature !== razorpay_signature) {
        return res.status(400).json({ message: "Payment verification failed - invalid signature" });
      }

      // Create campaign enrollment with confirmed payment
      const enrollment = await storage.joinCampaign({
        campaignId,
        userId,
        paymentStatus: "paid",
        paymentAmount: paymentAmount,
      });

      res.json({
        success: true,
        enrollment,
        message: "Successfully enrolled in campaign",
      });
    } catch (error) {
      console.error("Error enrolling in campaign:", error);
      res.status(500).json({ message: "Failed to enroll in campaign" });
    }
  });

  // Featured items route
  app.get("/api/featured", async (req, res) => {
    try {
      const featuredItems = await storage.getFeaturedItems();
      res.json(featuredItems);
    } catch (error) {
      console.error("Error fetching featured items:", error);
      res.status(500).json({ message: "Failed to fetch featured items" });
    }
  });

  // Campaign team registration route
  app.post("/api/campaigns/:id/team-register", async (req, res) => {
    try {
      const campaignId = parseInt(req.params.id);
      const registrationData = insertCampaignTeamRegistrationSchema.parse({
        ...req.body,
        campaignId
      });
      
      const registration = await storage.createCampaignTeamRegistration(registrationData);
      
      // Trigger immediate Google Sheets export
      exportCampaignsToGoogleSheets().catch(error => {
        console.error("[Team Registration] Failed to export to Google Sheets:", error);
      });
      
      res.json(registration);
    } catch (error) {
      console.error("Error registering team:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid registration data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to register team" });
      }
    }
  });

  // Blog routes
  app.get("/api/blog-posts", async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog-posts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const post = await storage.getBlogPostById(parseInt(id));
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.get("/api/blog-posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getBlogPostById(id);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Achievement routes
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAchievements();
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  // Love message routes (special user to admin messages)
  app.post("/api/love-messages", async (req, res) => {
    try {
      const userId = req.headers['x-user-id']; // Firebase UID from frontend
      const userEmail = req.headers['x-user-email']; // User email from frontend
      
      // Only allow the special user to send love messages
      if (userEmail !== 'munafsultan111@gmail.com') {
        return res.status(403).json({ message: "Access denied" });
      }

      const messageData = insertLoveMessageSchema.parse({
        ...req.body,
        fromUserId: userId,
        fromUserEmail: userEmail,
      });
      
      const message = await storage.createLoveMessage(messageData);
      res.json(message);
    } catch (error) {
      console.error("Error creating love message:", error);
      res.status(500).json({ message: "Failed to send love message" });
    }
  });

  app.get(
    "/api/admin/love-messages",
    isAdmin,
    async (req: any, res) => {
      try {
        const messages = await storage.getLoveMessages();
        res.json(messages);
      } catch (error) {
        console.error("Error fetching love messages:", error);
        res.status(500).json({ message: "Failed to fetch love messages" });
      }
    },
  );

  app.patch(
    "/api/admin/love-messages/:id/read",
    isAdmin,
    async (req: any, res) => {
      try {
        const { id } = req.params;
        const message = await storage.markLoveMessageAsRead(parseInt(id));
        res.json(message);
      } catch (error) {
        console.error("Error marking love message as read:", error);
        res.status(500).json({ message: "Failed to mark message as read" });
      }
    },
  );

  // Contact routes
  app.post("/api/contact", async (req, res) => {
    try {
      const inquiryData = insertContactInquirySchema.parse(req.body);
      const inquiry = await storage.createContactInquiry(inquiryData);
      res.json(inquiry);
    } catch (error) {
      console.error("Error creating contact inquiry:", error);
      res.status(500).json({ message: "Failed to create contact inquiry" });
    }
  });

  // ==================== GAMIFICATION & LEADERBOARD ROUTES ====================
  
  // Get leaderboard (top users by points)
  app.get("/api/leaderboard", async (req: any, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      let leaderboard = await storage.getLeaderboard(limit);
      
      // If no real data, return sample data for demonstration
      if (leaderboard.length === 0) {
        leaderboard = [
          {
            userId: "sample-1",
            totalPoints: 15420,
            level: 15,
            currentStreak: 12,
            longestStreak: 45,
            firstName: "Alex",
            lastName: "Chen",
            profileImageUrl: null
          },
          {
            userId: "sample-2", 
            totalPoints: 12850,
            level: 13,
            currentStreak: 8,
            longestStreak: 32,
            firstName: "Sarah",
            lastName: "Johnson",
            profileImageUrl: null
          },
          {
            userId: "sample-3",
            totalPoints: 11200,
            level: 12,
            currentStreak: 5,
            longestStreak: 28,
            firstName: "Michael",
            lastName: "Rodriguez",
            profileImageUrl: null
          },
          {
            userId: "sample-4",
            totalPoints: 9850,
            level: 11,
            currentStreak: 3,
            longestStreak: 21,
            firstName: "Emma",
            lastName: "Williams",
            profileImageUrl: null
          },
          {
            userId: "sample-5",
            totalPoints: 8750,
            level: 10,
            currentStreak: 1,
            longestStreak: 18,
            firstName: "David",
            lastName: "Brown",
            profileImageUrl: null
          }
        ];
      }
      
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // Get user's gamification stats
  app.get("/api/user/gamification", async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const [userPoints, userBadges, recentTransactions] = await Promise.all([
        storage.getUserPoints(userId),
        storage.getUserBadges(userId),
        storage.getUserPointTransactions(userId, 10)
      ]);

      res.json({
        points: userPoints,
        badges: userBadges,
        recentTransactions
      });
    } catch (error) {
      console.error("Error fetching user gamification data:", error);
      res.status(500).json({ message: "Failed to fetch gamification data" });
    }
  });

  // Get all available badges
  app.get("/api/badges", async (req: any, res) => {
    try {
      const badges = await storage.getAllBadges();
      res.json(badges);
    } catch (error) {
      console.error("Error fetching badges:", error);
      res.status(500).json({ message: "Failed to fetch badges" });
    }
  });

  // Award points to a user (internal use / admin)
  app.post("/api/admin/award-points", isAdmin, async (req: any, res) => {
    try {
      const { userId, points, action, referenceId, referenceType, description } = req.body;
      
      const result = await storage.awardPoints(
        userId,
        points,
        action,
        referenceId,
        referenceType,
        description
      );
      
      res.json(result);
    } catch (error) {
      console.error("Error awarding points:", error);
      res.status(500).json({ message: "Failed to award points" });
    }
  });

  // Create a new badge (admin)
  app.post("/api/admin/badges", isAdmin, async (req: any, res) => {
    try {
      const badgeData = req.body;
      const badge = await storage.createBadge(badgeData);
      res.json(badge);
    } catch (error) {
      console.error("Error creating badge:", error);
      res.status(500).json({ message: "Failed to create badge" });
    }
  });

  // ==================== DISCUSSION FORUM ROUTES ====================
  
  // Get forum threads
  app.get("/api/forum/threads", async (req: any, res) => {
    try {
      const { referenceType, referenceId, limit } = req.query;
      const threads = await storage.getForumThreads(
        referenceType,
        referenceId ? parseInt(referenceId) : undefined,
        limit ? parseInt(limit) : undefined
      );
      res.json(threads);
    } catch (error) {
      console.error("Error fetching forum threads:", error);
      res.status(500).json({ message: "Failed to fetch forum threads" });
    }
  });

  // Get single thread with replies
  app.get("/api/forum/threads/:id", async (req: any, res) => {
    try {
      const { id } = req.params;
      const [thread, replies] = await Promise.all([
        storage.getForumThread(parseInt(id)),
        storage.getForumReplies(parseInt(id))
      ]);
      
      res.json({ thread, replies });
    } catch (error) {
      console.error("Error fetching forum thread:", error);
      res.status(500).json({ message: "Failed to fetch forum thread" });
    }
  });

  // Create new thread
  app.post("/api/forum/threads", firebaseAuth as any, async (req: any, res: any) => {
    try {
      const userId = req.user?.claims?.sub;
      const userEmail = req.user?.claims?.email;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { title, content, referenceType, referenceId, tags } = req.body;
      
      if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required" });
      }
      
      const threadData = {
        title,
        content,
        authorId: userId,
        authorName: userEmail || "Anonymous",
        referenceType,
        referenceId: referenceId ? parseInt(referenceId) : null,
        tags: tags || [],
      };

      const thread = await storage.createForumThread(threadData);
      res.json(thread);
    } catch (error) {
      console.error("Error creating forum thread:", error);
      res.status(500).json({ message: "Failed to create forum thread" });
    }
  });

  // Update thread (author or admin only)
  app.patch("/api/forum/threads/:id", async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const { id } = req.params;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const thread = await storage.updateForumThread(parseInt(id), req.body);
      res.json(thread);
    } catch (error) {
      console.error("Error updating forum thread:", error);
      res.status(500).json({ message: "Failed to update forum thread" });
    }
  });

  // Delete thread (author or admin only)
  app.delete("/api/forum/threads/:id", async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const { id } = req.params;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      await storage.deleteForumThread(parseInt(id));
      res.json({ message: "Thread deleted successfully" });
    } catch (error) {
      console.error("Error deleting forum thread:", error);
      res.status(500).json({ message: "Failed to delete forum thread" });
    }
  });

  // Create reply
  app.post("/api/forum/replies", firebaseAuth as any, async (req: any, res: any) => {
    try {
      const userId = req.user?.claims?.sub;
      const userEmail = req.user?.claims?.email;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { threadId, content, parentReplyId } = req.body;
      
      const replyData = {
        threadId: parseInt(threadId),
        content,
        authorId: userId,
        authorName: userEmail || "Anonymous",
        parentReplyId: parentReplyId ? parseInt(parentReplyId) : null,
      };

      const reply = await storage.createForumReply(replyData);
      res.json(reply);
    } catch (error) {
      console.error("Error creating forum reply:", error);
      res.status(500).json({ message: "Failed to create forum reply" });
    }
  });

  // Vote on reply
  app.post("/api/forum/replies/:id/vote", async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const { id } = req.params;
      const { voteType } = req.body;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      await storage.voteForumReply(userId, parseInt(id), voteType);
      res.json({ message: "Vote recorded successfully" });
    } catch (error) {
      console.error("Error voting on forum reply:", error);
      res.status(500).json({ message: "Failed to vote on reply" });
    }
  });

  // ==================== RESOURCE LIBRARY ROUTES ====================
  
  // Get resources
  app.get("/api/resources", async (req: any, res) => {
    try {
      const { referenceType, referenceId } = req.query;
      const resources = await storage.getResources(
        referenceType,
        referenceId ? parseInt(referenceId) : undefined
      );
      res.json(resources);
    } catch (error) {
      console.error("Error fetching resources:", error);
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });

  // Create resource (admin or instructor)
  app.post("/api/resources", firebaseAuth as any, async (req: any, res: any) => {
    try {
      const userId = req.user?.claims?.sub;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { title, description, fileName, fileUrl, fileType, fileSize, referenceType, referenceId } = req.body;
      
      if (!title || !fileUrl) {
        return res.status(400).json({ message: "Title and file URL are required" });
      }

      const resourceData = {
        title,
        description: description || "",
        fileName: fileName || fileUrl.split('/').pop() || 'file',
        fileUrl,
        fileType: fileType || 'unknown',
        fileSize: fileSize || 0,
        referenceType,
        referenceId: referenceId ? parseInt(referenceId) : null,
        uploadedBy: userId,
        downloadCount: 0,
        isPublic: true,
      };

      const resource = await storage.createResource(resourceData);
      res.json(resource);
    } catch (error) {
      console.error("Error creating resource:", error);
      res.status(500).json({ message: "Failed to create resource" });
    }
  });

  // Track resource download
  app.post("/api/resources/:id/download", async (req: any, res) => {
    try {
      const { id } = req.params;
      await storage.incrementResourceDownload(parseInt(id));
      res.json({ message: "Download tracked successfully" });
    } catch (error) {
      console.error("Error tracking resource download:", error);
      res.status(500).json({ message: "Failed to track download" });
    }
  });

  // Delete resource (admin or uploader)
  app.delete("/api/resources/:id", async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const { id } = req.params;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      await storage.deleteResource(parseInt(id));
      res.json({ message: "Resource deleted successfully" });
    } catch (error) {
      console.error("Error deleting resource:", error);
      res.status(500).json({ message: "Failed to delete resource" });
    }
  });

  // ==================== QUIZ MANAGEMENT ====================

  // Create quiz (admin only)
  app.post("/api/admin/quizzes", isAdmin, async (req: any, res) => {
    try {
      const quizData = {
        ...req.body,
        courseId: req.body.courseId ? parseInt(req.body.courseId) : null,
      };

      const quiz = await storage.createQuiz(quizData);
      res.json(quiz);
    } catch (error) {
      console.error("Error creating quiz:", error);
      res.status(500).json({ message: "Failed to create quiz" });
    }
  });

  // Get all quizzes
  app.get("/api/admin/quizzes", isAdmin, async (req: any, res) => {
    try {
      const quizzes = await storage.getAllQuizzes();
      res.json(quizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      res.status(500).json({ message: "Failed to fetch quizzes" });
    }
  });

  // Get quiz by ID
  app.get("/api/admin/quizzes/:id", isAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const quiz = await storage.getQuiz(parseInt(id));
      res.json(quiz);
    } catch (error) {
      console.error("Error fetching quiz:", error);
      res.status(500).json({ message: "Failed to fetch quiz" });
    }
  });

  // Update quiz
  app.put("/api/admin/quizzes/:id", isAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const quizData = {
        ...req.body,
        courseId: req.body.courseId ? parseInt(req.body.courseId) : null,
      };

      const quiz = await storage.updateQuiz(parseInt(id), quizData);
      res.json(quiz);
    } catch (error) {
      console.error("Error updating quiz:", error);
      res.status(500).json({ message: "Failed to update quiz" });
    }
  });

  // Delete quiz
  app.delete("/api/admin/quizzes/:id", isAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      await storage.deleteQuiz(parseInt(id));
      res.json({ message: "Quiz deleted successfully" });
    } catch (error) {
      console.error("Error deleting quiz:", error);
      res.status(500).json({ message: "Failed to delete quiz" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
