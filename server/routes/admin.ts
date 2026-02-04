import { Router } from "express";
import { storage } from "../storage";
import { isAdmin } from "../middleware/isAdmin";
import {
    insertBlogPostSchema,
    insertWorkshopSchema,
    insertCourseSchema,
    insertCampaignSchema,
} from "@shared/schema";
import { z } from "zod";
import { exportCampaignsToGoogleSheets } from "../jobs/exportToGoogleSheets";
import { handleCampaignRegistrationExport, handleCourseEnrollmentExport } from "../jobs/enhancedGoogleSheetsExport";
import { db } from "../db";
import { campaignParticipants, campaignTeamRegistrations, courseEnrollments, workshopEnrollments, workshopRegistrations, contactInquiries, loveMessages, courses } from "@shared/schema";
import { eq, and } from "drizzle-orm";

const router = Router();

// Apply isAdmin middleware to all routes in this router
// Note: Some routes might need specific handling, but generally this router is for admins.
router.use(isAdmin);

// Manual trigger for Google Sheets export
router.post("/export-to-sheets", async (req: any, res) => {
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
});

// Enhanced Google Sheets export for specific campaign
router.post("/export-campaign-sheets/:campaignId", async (req: any, res) => {
    try {
        const campaignId = parseInt(req.params.campaignId);
        console.log(`[API] Manual campaign export triggered by admin for campaign ${campaignId}`);

        const result = await handleCampaignRegistrationExport(campaignId);

        if (result.success) {
            res.json({
                message: "Campaign export completed successfully",
                spreadsheetId: result.spreadsheetId,
                spreadsheetUrl: result.spreadsheetUrl,
            });
        } else {
            res.status(500).json({
                message: "Failed to export campaign to Google Sheets",
                error: result.error
            });
        }
    } catch (error) {
        console.error("Error exporting campaign to Google Sheets:", error);
        res.status(500).json({
            message: "Failed to export campaign to Google Sheets",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});

// Enhanced Google Sheets export for specific course
router.post("/export-course-sheets/:courseId", async (req: any, res) => {
    try {
        const courseId = parseInt(req.params.courseId);
        console.log(`[API] Manual course export triggered by admin for course ${courseId}`);

        try {
            const result = await handleCourseEnrollmentExport(courseId);

            if (result.success) {
                res.json({
                    success: true,
                    message: "Course export completed successfully",
                    spreadsheetId: result.spreadsheetId,
                    spreadsheetUrl: result.spreadsheetUrl,
                });
            } else {
                res.json({
                    success: false,
                    message: "Google Sheets export is not configured or failed",
                    error: result.error || "Google Sheets authentication not available"
                });
            }
        } catch (exportError: any) {
            console.error("Google Sheets export error (non-critical):", exportError);
            res.json({
                success: false,
                message: "Google Sheets export is not configured",
                error: exportError.message || "Google Sheets authentication not available. This is optional and does not affect course functionality."
            });
        }
    } catch (error) {
        console.error("Error in course export endpoint:", error);
        res.status(500).json({
            success: false,
            message: "Failed to process export request",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});

// Users Management
router.get("/users", async (req, res) => {
    try {
        const users = await storage.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Failed to fetch users" });
    }
});

router.patch("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { isAdmin } = req.body;
        const user = await storage.updateUserAdminStatus(id, isAdmin);
        res.json(user);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Failed to update user" });
    }
});

router.patch("/users/:id/admin-status", async (req, res) => {
    try {
        const { id } = req.params;
        const { isAdmin } = req.body;
        const user = await storage.updateUserAdminStatus(id, isAdmin);
        res.json(user);
    } catch (error) {
        console.error("Error updating admin status:", error);
        res.status(500).json({ message: "Failed to update admin status" });
    }
});

router.delete("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await storage.deleteUser(id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Failed to delete user" });
    }
});

// Blog Posts Management
router.get("/blog-posts", async (req, res) => {
    try {
        const posts = await storage.getBlogPosts();
        res.json(posts);
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        res.status(500).json({ message: "Failed to fetch blog posts" });
    }
});

router.get("/blog-posts/:id", async (req, res) => {
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

router.post("/blog-posts", async (req, res) => {
    try {
        const postData = insertBlogPostSchema.parse(req.body);
        const post = await storage.createBlogPost(postData);
        res.json(post);
    } catch (error) {
        console.error("Error creating blog post:", error);
        res.status(500).json({ message: "Failed to create blog post" });
    }
});

router.put("/blog-posts/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const blogData = insertBlogPostSchema.parse(req.body);
        const blog = await storage.updateBlogPost(id, blogData);
        res.json(blog);
    } catch (error) {
        console.error("Error updating blog post:", error);
        res.status(500).json({ message: "Failed to update blog post" });
    }
});

router.delete("/blog-posts/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await storage.deleteBlogPost(parseInt(id));
        res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
        console.error("Error deleting blog post:", error);
        res.status(500).json({ message: "Failed to delete blog post" });
    }
});

// Workshops Management
router.get("/workshops", async (req, res) => {
    try {
        const workshops = await storage.getWorkshops();
        res.json(workshops);
    } catch (error) {
        console.error("Error fetching workshops:", error);
        res.status(500).json({ message: "Failed to fetch workshops" });
    }
});

router.post("/workshops", async (req, res) => {
    try {
        const workshopData = insertWorkshopSchema.parse(req.body);
        const workshop = await storage.createWorkshop(workshopData);
        res.json(workshop);
    } catch (error) {
        console.error("Error creating workshop:", error);
        res.status(500).json({ message: "Failed to create workshop" });
    }
});

router.put("/workshops/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const workshopData = insertWorkshopSchema.parse(req.body);
        const workshop = await storage.updateWorkshop(id, workshopData);
        res.json(workshop);
    } catch (error) {
        console.error("Error updating workshop:", error);
        res.status(500).json({ message: "Failed to update workshop" });
    }
});

router.delete("/workshops/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await storage.deleteWorkshop(parseInt(id));
        res.json({ message: "Workshop deleted successfully" });
    } catch (error) {
        console.error("Error deleting workshop:", error);
        res.status(500).json({ message: "Failed to delete workshop" });
    }
});

// Courses Management
router.get("/courses", async (req, res) => {
    try {
        const courses = await storage.getCourses();
        res.json(courses);
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ message: "Failed to fetch courses" });
    }
});

router.post("/courses", async (req, res) => {
    try {
        // Clean the request body
        const cleanedBody = { ...req.body };
        ['price', 'capacity', 'duration', 'instructorName'].forEach(field => {
            if (cleanedBody[field] === "" || cleanedBody[field] === null || cleanedBody[field] === undefined) {
                delete cleanedBody[field];
            }
        });

        const courseData = insertCourseSchema.parse(cleanedBody);
        const course = await storage.createCourse(courseData);
        res.json(course);
    } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({ message: "Failed to create course" });
    }
});

router.put("/courses/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const cleanedBody = { ...req.body };
        ['price', 'capacity', 'duration', 'instructorName'].forEach(field => {
            if (cleanedBody[field] === "" || cleanedBody[field] === null || cleanedBody[field] === undefined) {
                delete cleanedBody[field];
            }
        });

        const courseData = insertCourseSchema.parse(cleanedBody);
        const course = await storage.updateCourse(id, courseData);
        res.json(course);
    } catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({ message: "Failed to update course" });
    }
});

router.delete("/courses/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await storage.deleteCourse(parseInt(id));
        res.json({ message: "Course deleted successfully" });
    } catch (error) {
        console.error("Error deleting course:", error);
        res.status(500).json({ message: "Failed to delete course" });
    }
});

router.post("/courses/:courseId/lessons", async (req, res) => {
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
});

// Campaigns Management
router.get("/campaigns", async (req, res) => {
    try {
        const campaigns = await storage.getCampaigns();
        res.json(campaigns);
    } catch (error) {
        console.error("Error fetching campaigns:", error);
        res.status(500).json({ message: "Failed to fetch campaigns" });
    }
});

router.post("/campaigns", async (req, res) => {
    try {
        const campaignData = insertCampaignSchema.parse(req.body);
        const campaign = await storage.createCampaign(campaignData);
        res.json(campaign);
    } catch (error) {
        console.error("Error creating campaign:", error);
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: "Validation failed", errors: error.errors });
        } else {
            res.status(500).json({ message: "Failed to create campaign" });
        }
    }
});

router.put("/campaigns/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const campaignData = insertCampaignSchema.parse(req.body);
        const campaign = await storage.updateCampaign(id, campaignData);
        res.json(campaign);
    } catch (error) {
        console.error("Error updating campaign:", error);
        res.status(500).json({ message: "Failed to update campaign" });
    }
});

router.delete("/campaigns/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await storage.deleteCampaign(parseInt(id));
        res.json({ message: "Campaign deleted successfully" });
    } catch (error) {
        console.error("Error deleting campaign:", error);
        res.status(500).json({ message: "Failed to delete campaign" });
    }
});

router.get("/campaign-participants", async (req, res) => {
    try {
        const registrations = await storage.getAllCampaignTeamRegistrations();
        res.json(registrations);
    } catch (error) {
        console.error("Error fetching campaign team registrations:", error);
        res.status(500).json({ message: "Failed to fetch campaign team registrations" });
    }
});

// Inquiries
router.get("/inquiries", async (req, res) => {
    try {
        const inquiries = await storage.getContactInquiries();
        res.json(inquiries);
    } catch (error) {
        console.error("Error fetching inquiries:", error);
        res.status(500).json({ message: "Failed to fetch inquiries" });
    }
});

router.delete("/inquiries/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await storage.deleteContactInquiry(parseInt(id));
        res.json({ message: "Contact inquiry deleted successfully" });
    } catch (error) {
        console.error("Error deleting contact inquiry:", error);
        res.status(500).json({ message: "Failed to delete contact inquiry" });
    }
});

// Workshop Registrations
router.get("/workshop-registrations", async (req, res) => {
    try {
        const registrations = await storage.getWorkshopRegistrations();
        res.json(registrations);
    } catch (error) {
        console.error("Error fetching workshop registrations:", error);
        res.status(500).json({ message: "Failed to fetch workshop registrations" });
    }
});

router.patch("/workshop-registrations/:id/status", async (req, res) => {
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
        res.status(500).json({ message: "Failed to update registration status" });
    }
});

router.delete("/workshop-registrations/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await storage.deleteWorkshopRegistration(parseInt(id));
        res.json({ message: "Workshop registration deleted successfully" });
    } catch (error) {
        console.error("Error deleting workshop registration:", error);
        res.status(500).json({ message: "Failed to delete workshop registration" });
    }
});

// Course Registrations
router.get("/course-registrations", async (req, res) => {
    try {
        const courseId = req.query.courseId ? parseInt(req.query.courseId as string) : undefined;
        const registrations = await storage.getCourseRegistrations(courseId);
        res.json(registrations);
    } catch (error) {
        console.error("Error fetching course registrations:", error);
        res.status(500).json({ message: "Failed to fetch course registrations" });
    }
});

router.patch("/course-registrations/:id/status", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const registration = await storage.updateCourseRegistrationStatus(
            parseInt(id),
            status,
        );
        res.json(registration);
    } catch (error) {
        console.error("Error updating course registration status:", error);
        res.status(500).json({ message: "Failed to update course registration status" });
    }
});

router.delete("/course-registrations/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await storage.deleteCourseRegistration(parseInt(id));
        res.json({ message: "Course registration deleted successfully" });
    } catch (error) {
        console.error("Error deleting course registration:", error);
        res.status(500).json({ message: "Failed to delete course registration" });
    }
});

// Love Messages
router.get("/love-messages", async (req, res) => {
    try {
        const messages = await storage.getLoveMessages();
        res.json(messages);
    } catch (error) {
        console.error("Error fetching love messages:", error);
        res.status(500).json({ message: "Failed to fetch love messages" });
    }
});

router.patch("/love-messages/:id/read", async (req, res) => {
    try {
        const { id } = req.params;
        const message = await storage.markLoveMessageAsRead(parseInt(id));
        res.json(message);
    } catch (error) {
        console.error("Error marking love message as read:", error);
        res.status(500).json({ message: "Failed to mark message as read" });
    }
});

// Award Points
router.post("/award-points", async (req, res) => {
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

// Badges
router.post("/badges", async (req, res) => {
    try {
        const badgeData = req.body;
        const badge = await storage.createBadge(badgeData);
        res.json(badge);
    } catch (error) {
        console.error("Error creating badge:", error);
        res.status(500).json({ message: "Failed to create badge" });
    }
});

// Deletion Utils
router.delete("/campaign-registrations/:campaignId/user/:userId", async (req, res) => {
    try {
        const campaignId = parseInt(req.params.campaignId);
        const userId = req.params.userId;

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

router.get("/delete-campaign-registration/:campaignTitle", async (req, res) => {
    try {
        const campaignTitle = decodeURIComponent(req.params.campaignTitle);
        const allCampaigns = await storage.getCampaigns();
        const campaign = allCampaigns.find(c => c.title.toLowerCase().includes(campaignTitle.toLowerCase()));

        if (!campaign) {
            return res.status(404).json({ message: `Campaign with "${campaignTitle}" not found` });
        }

        const participantsResult = await db.delete(campaignParticipants)
            .where(eq(campaignParticipants.campaignId, campaign.id))
            .returning();

        const teamResult = await db.delete(campaignTeamRegistrations)
            .where(eq(campaignTeamRegistrations.campaignId, campaign.id))
            .returning();

        const totalDeleted = participantsResult.length + teamResult.length;
        res.json({
            message: `Deleted ${totalDeleted} registration(s)`,
            campaignId: campaign.id,
            deletedCount: totalDeleted
        });
    } catch (error) {
        console.error("Error deleting campaign registrations:", error);
        res.status(500).json({ message: "Failed to delete registrations", error: String(error) });
    }
});

router.post("/delete-campaign-registration", async (req, res) => {
    try {
        const { campaignTitle } = req.body;
        const allCampaigns = await storage.getCampaigns();
        const campaign = allCampaigns.find(c => c.title.toLowerCase().includes(campaignTitle.toLowerCase()));

        if (!campaign) {
            return res.status(404).json({ message: `Campaign with "${campaignTitle}" not found` });
        }

        const participantsResult = await db.delete(campaignParticipants)
            .where(eq(campaignParticipants.campaignId, campaign.id))
            .returning();

        const teamResult = await db.delete(campaignTeamRegistrations)
            .where(eq(campaignTeamRegistrations.campaignId, campaign.id))
            .returning();

        const totalDeleted = participantsResult.length + teamResult.length;
        res.json({
            message: `Deleted ${totalDeleted} registration(s)`,
            campaignId: campaign.id,
            deletedCount: totalDeleted
        });
    } catch (error) {
        console.error("Error deleting campaign registrations:", error);
        res.status(500).json({ message: "Failed to delete registrations", error: String(error) });
    }
});

router.post("/delete-course-enrollments", async (req, res) => {
    try {
        const { courseId } = req.body;
        const enrollmentsResult = await db.delete(courseEnrollments)
            .where(eq(courseEnrollments.courseId, courseId))
            .returning();

        res.json({
            message: `Deleted ${enrollmentsResult.length} enrollment(s)`,
            courseId,
            deletedCount: enrollmentsResult.length
        });
    } catch (error) {
        console.error("Error deleting course enrollments:", error);
        res.status(500).json({ message: "Failed to delete enrollments", error: String(error) });
    }
});

router.post("/clear-data", async (req, res) => {
    try {
        console.log("🚀 CLEARING ALL TEST DATA...");
        await db.delete(courseEnrollments);
        await db.delete(workshopEnrollments);
        await db.delete(campaignParticipants);
        await db.delete(campaignTeamRegistrations);
        await db.delete(workshopRegistrations);
        await db.delete(contactInquiries);
        await db.delete(loveMessages);
        await db.update(courses).set({ enrollmentCount: 0 });
        await db.update(courses).set({
            enrollmentCount: 0,
            rating: "0.00",
            reviewCount: 0
        }).where(eq(courses.id, 3));

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

// Refund Requests
router.get("/refund-requests", async (req, res) => {
    try {
        const refundRequests = await storage.getAllRefundRequests();
        res.json(refundRequests);
    } catch (error) {
        console.error("Error fetching refund requests:", error);
        res.status(500).json({ message: "Failed to fetch refund requests" });
    }
});

router.put("/refund-requests/:id", async (req, res) => {
    try {
        const userId = req.user?.id;
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

// Quizzes
router.post("/quizzes", async (req, res) => {
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

router.get("/quizzes", async (req, res) => {
    try {
        const quizzes = await storage.getAllQuizzes();
        res.json(quizzes);
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        res.status(500).json({ message: "Failed to fetch quizzes" });
    }
});

router.get("/quizzes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const quiz = await storage.getQuiz(parseInt(id));
        res.json(quiz);
    } catch (error) {
        console.error("Error fetching quiz:", error);
        res.status(500).json({ message: "Failed to fetch quiz" });
    }
});

router.put("/quizzes/:id", async (req, res) => {
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

router.delete("/quizzes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await storage.deleteQuiz(parseInt(id));
        res.json({ message: "Quiz deleted successfully" });
    } catch (error) {
        console.error("Error deleting quiz:", error);
        res.status(500).json({ message: "Failed to delete quiz" });
    }
});

// Coupon Codes
router.get("/coupon-codes", async (req, res) => {
    try {
        const coupons = await storage.getCouponCodes();
        res.json(coupons);
    } catch (error) {
        console.error("Error fetching coupon codes:", error);
        res.status(500).json({ message: "Failed to fetch coupon codes" });
    }
});

router.get("/coupon-codes/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const coupon = await storage.getCouponCodeById(id);
        if (!coupon) {
            return res.status(404).json({ message: "Coupon code not found" });
        }
        res.json(coupon);
    } catch (error) {
        console.error("Error fetching coupon code:", error);
        res.status(500).json({ message: "Failed to fetch coupon code" });
    }
});

router.post("/coupon-codes", async (req, res) => {
    try {
        const coupon = await storage.createCouponCode(req.body);
        res.status(201).json(coupon);
    } catch (error: any) {
        console.error("Error creating coupon code:", error);
        if (error.message?.includes("unique") || error.message?.includes("duplicate")) {
            res.status(400).json({ message: "Coupon code already exists" });
        } else {
            res.status(500).json({ message: "Failed to create coupon code" });
        }
    }
});

router.put("/coupon-codes/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const coupon = await storage.updateCouponCode(id, req.body);
        res.json(coupon);
    } catch (error: any) {
        console.error("Error updating coupon code:", error);
        if (error.message?.includes("unique") || error.message?.includes("duplicate")) {
            res.status(400).json({ message: "Coupon code already exists" });
        } else {
            res.status(500).json({ message: "Failed to update coupon code" });
        }
    }
});

router.delete("/coupon-codes/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await storage.deleteCouponCode(id);
        res.json({ message: "Coupon code deleted successfully" });
    } catch (error) {
        console.error("Error deleting coupon code:", error);
        res.status(500).json({ message: "Failed to delete coupon code" });
    }
});

export default router;
