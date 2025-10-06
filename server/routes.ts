import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
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
      const userId = req.headers['x-user-id']; // Firebase UID from frontend
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      // For Firebase auth, userId is the Firebase UID (e.g., "23462202")
      // But our database stores users by email, so we need to find the admin user
      console.log('Admin check - Firebase UID:', userId);
      
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
        const campaignData = insertCampaignSchema.parse(req.body);
        const campaign = await storage.createCampaign(campaignData);
        res.json(campaign);
      } catch (error) {
        console.error("Error creating campaign:", error);
        res.status(500).json({ message: "Failed to create campaign" });
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
      const workshops = await storage.getWorkshops();
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
          imageUrl: "/api/placeholder/300/200",
          instructorName: "Dr. Arjun Patel",
          status: "published",
          category: "Space Science",
          totalLessons: 12,
          totalDuration: 720,
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

  app.post("/api/courses/enroll", async (req, res) => {
    try {
      const enrollmentData = insertCourseEnrollmentSchema.parse(req.body);
      const enrollment = await storage.enrollInCourse(enrollmentData);
      res.json(enrollment);
    } catch (error) {
      console.error("Error enrolling in course:", error);
      res.status(500).json({ message: "Failed to enroll in course" });
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

  // Student progress
  app.get(
    "/api/courses/:courseId/progress",
    
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
  app.get("/api/user/certificates", async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const certificates = await storage.getUserCertificates(userId);
      res.json(certificates);
    } catch (error) {
      console.error("Error fetching user certificates:", error);
      res.status(500).json({ message: "Failed to fetch user certificates" });
    }
  });

  // Campaign routes
  app.get("/api/campaigns", async (req, res) => {
    try {
      let campaigns = await storage.getCampaigns();

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
        });

        campaigns = await storage.getCampaigns();
      }

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

  const httpServer = createServer(app);
  return httpServer;
}
