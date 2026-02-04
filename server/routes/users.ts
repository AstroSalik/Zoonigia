import { Router } from "express";
import { storage } from "../storage";
import { firebaseAuth } from "../middleware/firebaseAuth";
import { insertUserSchema } from "@shared/schema";

const router = Router();

router.post("/users", async (req, res) => {
    try {
        const userData = insertUserSchema.parse(req.body);
        const user = await storage.upsertUser(userData);
        res.json(user);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Failed to create user" });
    }
});

// User dashboard - aggregated data
router.get("/user/dashboard", firebaseAuth as any, async (req: any, res) => {
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

// Student progress
router.get(
    "/courses/:courseId/progress",
    firebaseAuth as any,
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

router.post(
    "/lessons/:lessonId/progress",
    firebaseAuth as any,
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

router.post(
    "/quizzes/:quizId/attempts",
    firebaseAuth as any,
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

router.post(
    "/courses/:courseId/reviews",
    firebaseAuth as any,
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
router.get("/user/certificates", firebaseAuth as any, async (req: any, res) => {
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
router.post("/courses/:courseId/generate-certificate", firebaseAuth as any, async (req: any, res) => {
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

// Get user's invoices
router.get("/user/invoices", firebaseAuth as any, async (req: any, res) => {
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
router.get("/invoices/:id", firebaseAuth as any, async (req: any, res) => {
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

// Get user's refund requests
router.get("/user/refund-requests", firebaseAuth as any, async (req: any, res) => {
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
router.post("/refund-requests", firebaseAuth as any, async (req: any, res) => {
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

// Get leaderboard (top users by points)
router.get("/leaderboard", async (req: any, res) => {
    try {
        const limit = parseInt(req.query.limit as string) || 100;
        let leaderboard = await storage.getLeaderboard(limit);

        // If no real data, return sample data for demonstration
        if (leaderboard.length === 0) {
            // Return empty array instead of fake data
            leaderboard = [];
        }

        res.json(leaderboard);
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
});

// Get user's gamification stats
router.get("/user/gamification", async (req: any, res) => {
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
router.get("/badges", async (req: any, res) => {
    try {
        const badges = await storage.getAllBadges();
        res.json(badges);
    } catch (error) {
        console.error("Error fetching badges:", error);
        res.status(500).json({ message: "Failed to fetch badges" });
    }
});

export default router;
