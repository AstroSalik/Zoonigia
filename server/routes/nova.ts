import { Router } from "express";
import { storage } from "../storage";
import { processNovaMessage } from "../novaService";

const router = Router();

// Nova Sirius chat endpoint
router.post("/", async (req: any, res) => {
    try {
        const { message, history = [], userId, isAuthenticated } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({
                response: "Please provide a message to chat with Nova.",
                message: "Message is required"
            });
        }

        // Get Firebase UID from headers if available (for authenticated requests)
        const firebaseUid = req.headers['x-user-id'] || userId;

        try {
            const result = await processNovaMessage(
                message,
                history,
                firebaseUid
            );

            res.json(result);
        } catch (serviceError: any) {
            console.error("Nova service error:", serviceError);
            // Even if service fails, return a fallback response
            const fallbackResponse = {
                response: "I'm experiencing some cosmic interference, but I'm still here to help! Try asking me to navigate somewhere or suggest courses.",
                suggestions: [
                    'Show me courses',
                    'Take me to workshops',
                    'What\'s on my dashboard?'
                ]
            };
            res.json(fallbackResponse);
        }
    } catch (error: any) {
        console.error("Error processing Nova message:", error);
        // Always return a valid response, even on error
        res.status(200).json({
            response: "I apologize, but I'm experiencing some cosmic interference. Please try again in a moment, or try a navigation command like 'take me to courses'.",
            suggestions: [
                'Show me courses',
                'Take me to workshops',
                'What\'s on my dashboard?'
            ]
        });
    }
});

// Nova Sirius task execution endpoint (for future use)
router.post("/task", async (req: any, res) => {
    try {
        const { task, userId, params } = req.body;

        if (!task) {
            return res.status(400).json({ message: "Task is required" });
        }

        // Handle specific tasks
        switch (task) {
            case 'get_user_data':
                if (!userId) {
                    return res.status(401).json({ message: "User ID required" });
                }
                const userData = await storage.getUser(userId);
                const userCourses = await storage.getUserCourses(userId);
                const userCampaigns = await storage.getUserCampaigns(userId);

                return res.json({
                    user: userData,
                    courses: userCourses,
                    campaigns: userCampaigns,
                });

            case 'suggest_courses':
                const allCourses = await storage.getCourses();
                const query = params?.query?.toLowerCase() || '';

                // Filter courses based on query
                const suggestedCourses = allCourses.filter(course =>
                    course.title.toLowerCase().includes(query) ||
                    course.description.toLowerCase().includes(query) ||
                    course.field?.toLowerCase().includes(query)
                ).slice(0, 5);

                return res.json({
                    suggestions: suggestedCourses,
                    message: `I found ${suggestedCourses.length} course${suggestedCourses.length !== 1 ? 's' : ''} that might interest you!`,
                });

            default:
                return res.status(400).json({ message: "Unknown task" });
        }
    } catch (error) {
        console.error("Error executing Nova task:", error);
        res.status(500).json({
            message: "Failed to execute task",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});

export default router;
