import { Router } from "express";
import { storage } from "../storage";
import { firebaseAuth } from "../middleware/firebaseAuth";
import {
    insertWorkshopEnrollmentSchema,
    insertCourseRegistrationSchema,
    insertCampaignParticipantSchema,
    insertCampaignTeamRegistrationSchema,
    couponCodeUsages,
} from "@shared/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";
import Razorpay from "razorpay";
import crypto from "crypto";
import { handleCampaignRegistrationExport, handleCourseEnrollmentExport } from "../jobs/enhancedGoogleSheetsExport";
import { z } from "zod";

const router = Router();

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Missing required Razorpay secrets: RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET");
}
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ==================== WORKSHOP ENROLLMENTS ====================

router.post("/workshops/enroll", async (req, res) => {
    try {
        const enrollmentData = insertWorkshopEnrollmentSchema.parse(req.body);
        const enrollment = await storage.enrollInWorkshop(enrollmentData);
        res.json(enrollment);
    } catch (error) {
        console.error("Error enrolling in workshop:", error);
        res.status(500).json({ message: "Failed to enroll in workshop" });
    }
});

router.post("/workshops/register", async (req, res) => {
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

// ==================== COURSE ENROLLMENTS & PAYMENTS ====================

// Create Razorpay order for course enrollment
router.post("/courses/create-payment-order", async (req: any, res) => {
    try {
        const { courseId, paymentAmount, couponCode } = req.body;
        const userId = req.headers['x-user-id'] || req.body.userId;

        let finalAmount = parseFloat(paymentAmount);
        let appliedCoupon = null;
        let discountAmount = 0;

        // Validate and apply coupon code if provided
        if (couponCode && userId) {
            const course = await storage.getCourseById(parseInt(courseId));
            if (course) {
                const validation = await storage.validateCouponCode(
                    couponCode,
                    'course',
                    parseInt(courseId),
                    userId,
                    finalAmount
                );

                if (validation.valid && validation.discountAmount) {
                    discountAmount = validation.discountAmount;
                    finalAmount = finalAmount - discountAmount;
                    appliedCoupon = validation.coupon;
                    // Ensure final amount is not negative
                    if (finalAmount < 0) {
                        finalAmount = 0;
                    }
                }
            }
        }

        // Create Razorpay order with final amount
        const order = await razorpay.orders.create({
            amount: Math.round(finalAmount * 100), // Convert to paise (smallest unit)
            currency: "INR",
            receipt: `course_${courseId}_${Date.now()}`,
            notes: {
                courseId: courseId.toString(),
                couponCode: appliedCoupon?.code || '',
                discountAmount: discountAmount.toString(),
                originalAmount: paymentAmount.toString(),
            },
        });

        res.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
            originalAmount: parseFloat(paymentAmount),
            discountAmount: discountAmount,
            finalAmount: finalAmount,
            couponCode: appliedCoupon?.code || null,
        });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ message: "Failed to create payment order" });
    }
});

// Course registration endpoint (for free courses or accepting_registrations)
router.post("/courses/register", async (req: any, res) => {
    try {
        // Ensure we always return JSON
        res.setHeader('Content-Type', 'application/json');

        const { courseId, name, email, phone, institution, additionalInfo, userId } = req.body;

        if (!courseId || !name || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: courseId, name, email, and phone are required"
            });
        }

        // Validate course exists
        const course = await storage.getCourseById(parseInt(courseId));
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Validate registration data with Zod schema
        try {
            const validatedData = insertCourseRegistrationSchema.parse({
                courseId: parseInt(courseId),
                userId: userId || null,
                name: name.trim(),
                email: email.trim().toLowerCase(),
                phone: phone.trim(),
                institution: institution?.trim() || null,
                additionalInfo: additionalInfo?.trim() || null,
                status: 'pending'
            });

            const registration = await storage.createCourseRegistration(validatedData);
            console.log(`[Course Registration] Created registration ID ${registration.id} for course ${courseId}:`, {
                name: registration.name,
                email: registration.email,
                courseId: registration.courseId
            });

            // Trigger Google Sheets export if configured (non-blocking)
            if (course.googleSheetId) {
                handleCourseEnrollmentExport(parseInt(courseId))
                    .then(result => {
                        if (result.success) {
                            console.log(`[Google Sheets] Course registration exported for course ${courseId}`);
                        } else {
                            console.error(`[Google Sheets] Failed to export course registration for course ${courseId}: ${result.error}`);
                        }
                    })
                    .catch(exportError => {
                        console.error(`[Google Sheets] Exception during course registration export for course ${courseId}:`, exportError);
                    });
            }

            // Ensure JSON response with proper headers
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({
                success: true,
                message: "Registration successful",
                registrationId: registration.id,
                registration: registration
            });
        } catch (validationError: any) {
            console.error("Validation error:", validationError);
            return res.status(400).json({
                success: false,
                message: validationError.errors?.[0]?.message || "Invalid registration data",
                error: validationError.message
            });
        }
    } catch (error: any) {
        console.error("Error processing course registration:", error);
        // Ensure we return JSON even on error
        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: "Failed to process registration",
                error: error.message || "Unknown error"
            });
        }
    }
});

router.post("/courses/enroll", async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            courseId,
            userId,
            paymentAmount,
            originalAmount,
            discountAmount,
            couponCode,
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

        // Get coupon code if provided
        let couponCodeId = null;
        if (couponCode) {
            const coupon = await storage.getCouponCodeByCode(couponCode);
            if (coupon) {
                couponCodeId = coupon.id;

                // Record coupon usage
                const originalAmt = originalAmount ? parseFloat(originalAmount) : parseFloat(paymentAmount);
                const discountAmt = discountAmount ? parseFloat(discountAmount) : 0;
                const finalAmt = parseFloat(paymentAmount);

                await storage.recordCouponUsage({
                    couponCodeId: coupon.id,
                    userId,
                    invoiceId: null, // Will be updated after invoice creation
                    itemType: 'course',
                    itemId: parseInt(courseId),
                    originalAmount: originalAmt.toString(),
                    discountAmount: discountAmt.toString(),
                    finalAmount: finalAmt.toString(),
                });
            }
        }

        // Create invoice
        const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const invoice = await storage.createInvoice({
            invoiceNumber,
            userId,
            itemType: 'course',
            itemId: parseInt(courseId),
            itemName: course?.title || 'Course',
            amount: (originalAmount ? parseFloat(originalAmount) : parseFloat(paymentAmount)).toString(),
            tax: "0.00",
            totalAmount: paymentAmount,
            paymentId: razorpay_payment_id,
            paymentMethod: 'razorpay',
            paymentStatus: 'completed',
            couponCodeId: couponCodeId,
            discountAmount: discountAmount ? parseFloat(discountAmount).toString() : "0.00",
        });

        // Update coupon usage with invoice ID if coupon was used
        if (couponCodeId) {
            const usage = await storage.getUserCouponUsages(userId, couponCodeId);
            const latestUsage = usage[usage.length - 1];
            if (latestUsage && !latestUsage.invoiceId) {
                await db.update(couponCodeUsages)
                    .set({ invoiceId: invoice.id })
                    .where(eq(couponCodeUsages.id, latestUsage.id));
            }
        }

        // Trigger enhanced Google Sheets export for this specific course
        handleCourseEnrollmentExport(parseInt(courseId))
            .then(result => {
                if (result.success) {
                    console.log(`[Course Enrollment] Successfully exported to Google Sheets for course ${courseId}`);
                    if (result.spreadsheetUrl) {
                        console.log(`[Course Enrollment] Google Sheet URL: ${result.spreadsheetUrl}`);
                    }
                } else {
                    console.error(`[Course Enrollment] Failed to export to Google Sheets for course ${courseId}:`, result.error);
                }
            })
            .catch(error => {
                console.error("[Course Enrollment] Failed to export to Google Sheets:", error);
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

router.get("/courses/:courseId/enrollment/:userId", async (req, res) => {
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

router.get(
    "/courses/:courseId/enrollment-status",
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

// ==================== CAMPAIGN REGISTRATIONS ====================

router.post("/campaigns/join", async (req, res) => {
    try {
        const participantData = insertCampaignParticipantSchema.parse(req.body);
        const participant = await storage.joinCampaign(participantData);
        res.json(participant);
    } catch (error) {
        console.error("Error joining campaign:", error);
        res.status(500).json({ message: "Failed to join campaign" });
    }
});

router.get("/campaigns/:campaignId/participant/:userId", async (req, res) => {
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
router.post(
    "/campaigns/create-payment-order",
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

router.post("/campaigns/enroll", async (req: any, res) => {
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

router.post("/campaigns/:id/team-register", async (req, res) => {
    try {
        const campaignId = parseInt(req.params.id);
        const registrationData = insertCampaignTeamRegistrationSchema.parse({
            ...req.body,
            campaignId
        });

        const registration = await storage.createCampaignTeamRegistration(registrationData);

        // Trigger enhanced Google Sheets export for this specific campaign
        handleCampaignRegistrationExport(campaignId)
            .then(result => {
                if (result.success) {
                    console.log(`[Team Registration] Successfully exported to Google Sheets for campaign ${campaignId}`);
                    if (result.spreadsheetUrl) {
                        console.log(`[Team Registration] Google Sheet URL: ${result.spreadsheetUrl}`);
                    }
                } else {
                    console.error(`[Team Registration] Failed to export to Google Sheets for campaign ${campaignId}:`, result.error);
                }
            })
            .catch(error => {
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

// ==================== COUPONS ====================

router.post("/coupon-codes/validate", async (req: any, res) => {
    try {
        const { code, itemType, itemId, amount } = req.body;
        const userId = req.headers['x-user-id'] || req.body.userId;

        if (!code || !itemType || !itemId || amount === undefined) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        if (!userId) {
            return res.status(401).json({ message: "User authentication required" });
        }

        const validation = await storage.validateCouponCode(
            code,
            itemType,
            parseInt(itemId),
            userId,
            parseFloat(amount)
        );

        if (validation.valid) {
            res.json({
                valid: true,
                discountAmount: validation.discountAmount,
                coupon: validation.coupon,
            });
        } else {
            res.status(400).json({
                valid: false,
                error: validation.error,
            });
        }
    } catch (error) {
        console.error("Error validating coupon code:", error);
        res.status(500).json({ message: "Failed to validate coupon code" });
    }
});

export default router;
