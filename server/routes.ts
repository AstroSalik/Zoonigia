import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertWorkshopEnrollmentSchema,
  insertCourseEnrollmentSchema,
  insertCampaignParticipantSchema,
  insertContactInquirySchema,
  insertUserSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
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
      // For now, we'll just return a success response
      // In a full implementation, you'd store this in a workshop_registrations table
      console.log("Workshop registration received:", registrationData);
      res.json({ 
        message: "Registration successful", 
        registrationId: Math.floor(Math.random() * 10000) 
      });
    } catch (error) {
      console.error("Error processing workshop registration:", error);
      res.status(500).json({ message: "Failed to process registration" });
    }
  });

  // Course routes
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getCourses();
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

  // Campaign routes
  app.get("/api/campaigns", async (req, res) => {
    try {
      let campaigns = await storage.getCampaigns();
      
      // Add sample campaigns if none exist
      if (campaigns.length === 0) {
        await storage.createCampaign({
          title: "Zoonigia Asteroid Search Campaign",
          description: "Collaborate with NASA Citizen Science and IASC to discover real asteroids and name them officially",
          type: "asteroid_search",
          startDate: "2025-08-17",
          endDate: "2025-11-23",
          partner: "NASA • IASC • University of Hawaii",
          status: "active",
          progress: 20,
          price: "300.00"
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

  app.post("/api/campaigns/enroll", async (req, res) => {
    try {
      const { campaignId, userId, paymentAmount } = req.body;
      
      // Create campaign enrollment with payment
      const enrollment = await storage.joinCampaign({
        campaignId,
        userId,
        paymentStatus: "paid",
        paymentAmount: paymentAmount.toString()
      });
      
      res.json({ 
        success: true, 
        enrollment,
        message: "Successfully enrolled in campaign" 
      });
    } catch (error) {
      console.error("Error enrolling in campaign:", error);
      res.status(500).json({ message: "Failed to enroll in campaign" });
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
