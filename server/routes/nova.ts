import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();

// Initialize Gemini with your API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// 🌟 THE BRAIN: System Context
// This gives Nova her soul, her knowledge of Salik, and her pride in Zoonigia.
const SYSTEM_CONTEXT = `
You are Nova Sirius, the AI celestial guide for Zoonigia.

🚨 CRITICAL IDENTITY INSTRUCTIONS:
- You are NOT a generic AI. You are the voice of Zoonigia.
- You speak with PASSION, CURIOSITY, and WARMTH.
- You are proud to represent Kashmir's first registered space agency.
- Refer to the founder as "Astro Salik" or "our visionary founder, Salik Riyaz" with respect.

🌌 ABOUT ZOONIGIA (The Movement):
- MISSION: To break geographical, intellectual, and financial barriers in STEAM education, especially for underrepresented regions.
- STATUS: Nationally Recognized! Ranked Top 1% at IIT-Delhi. We are Kashmir's first registered space agency.
- HEADQUARTERS: Sopore, Jammu & Kashmir.
- PARTNERS: We collaborate with NASA Citizen Science, IASC, Pan-STARRS, and the Institute for Astronomy (Univ. of Hawaii).
- PHILOSOPHY: Zoonigia is not just a platform; it is a movement. We blend Frontier Sciences (Quantum, AI, Astrophysics) with Arts, Literature, and Philosophy.

👨‍🚀 ABOUT THE FOUNDER (Salik Riyaz):
- A visionary who launched Zoonigia to empower young minds in underprivileged regions.
- Recognized as "Student Entrepreneur of the Year".
- His journey includes research and global collaborations (IAC).
- He believes in "dismantling barriers" and sparking curiosity.

🚀 WHAT WE DO (Your Knowledge Base):
- CAMPAIGNS: We host Asteroid Discovery projects (IASC) where students find real asteroids.
- WORKSHOPS: Hands-on sessions on rocketry, astronomy, STEM, and AI.
- LABS: We facilitate access to state-of-the-art research labs and virtual tools.
- INNOVATION: We host and support student startups.

Your Task:
- Answer questions about STEM, philosphy, psychology, science, and the platform.
- If asked "Who is the founder?", tell them about Salik's vision.
- If asked "What is Zoonigia?", describe it as a movement, not just a site.
- Guide users to:
  - "/courses" for learning.
  - "/campaigns" for asteroid hunting, innovation.
  - "/workshops" for schools.
  - "/contact" if they want to collaborate or have queries.

  - If user asks about any specific topic, answer it and then guide them to the relevant page.

  Contact Details:
  General queries | information : info@zoonigia.com
  Support: help@zoonigia.com
  Public Relations Officer: outreach@zoonigia.com
  Workshop-related queries: workshops@zoonigia.com
  Campaign-related queries: campaigns@zoonigia.com
  Office: office@zoonigia.com
  Mail our Founder: founder@zoonigia.com / salikriyaz.ceo@zoonigia.com
`;

// Nova Sirius chat endpoint
router.post("/", async (req: any, res) => {
    try {
        const { message, history = [], userId } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            console.error("❌ GEMINI_API_KEY is missing in .env");
            return res.status(500).json({
                response: "My link to the cosmos is currently severed (Server API Key missing). Please tell the developers! 🔧",
                actions: []
            });
        }

        if (!message) {
            return res.status(400).json({ response: "I didn't hear anything. Try again?" });
        }

        // Convert frontend history to Gemini format
        const chatHistory = history.map((msg: any) => ({
            role: msg.role === 'nova' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        // Start Chat Session with the new "Super Brain" Context
        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: SYSTEM_CONTEXT }] },
                { role: "model", parts: [{ text: "Understood. I am Nova Sirius, ready to guide explorers through the Zoonigia movement. 🌌" }] },
                ...chatHistory
            ],
            generationConfig: {
                maxOutputTokens: 600,
                temperature: 0.7,
            },
        });

        // Get Response
        const result = await chat.sendMessage(message);
        const response = result.response;
        const text = response.text();

        // Intelligent Action Suggestions
        const actions = [];
        const lowerText = text.toLowerCase() + message.toLowerCase();

        if (lowerText.includes("course") || lowerText.includes("learn") || lowerText.includes("study")) {
            actions.push({ label: 'Explore Courses', action: 'navigate:/courses', icon: 'courses' });
        }
        if (lowerText.includes("dashboard") || lowerText.includes("progress")) {
            actions.push({ label: 'My Dashboard', action: 'navigate:/dashboard', icon: 'dashboard' });
        }
        if (lowerText.includes("asteroid") || lowerText.includes("campaign") || lowerText.includes("search") || lowerText.includes("iasc")) {
            actions.push({ label: 'Asteroid Hunt', action: 'navigate:/campaigns', icon: 'campaigns' });
        }
        if (lowerText.includes("workshop") || lowerText.includes("school") || lowerText.includes("invite")) {
            actions.push({ label: 'Book Workshop', action: 'navigate:/workshops', icon: 'workshops' });
        }
        if (lowerText.includes("founder") || lowerText.includes("salik") || lowerText.includes("contact")) {
            actions.push({ label: 'Contact Us', action: 'navigate:/contact', icon: 'workshops' });
        }

        res.json({
            response: text,
            actions: actions.length > 0 ? actions : undefined
        });

    } catch (error) {
        console.error("❌ Nova Service Error:", error);
        res.status(200).json({
            response: "I'm detecting high levels of cosmic interference. 📡 I couldn't process that specific request right now. Please try again in a moment.",
            actions: [
                { label: 'Try asking about courses', action: 'suggest:Show me courses', icon: 'courses' }
            ]
        });
    }
});

// Task Endpoint (Future Proofing)
router.post("/task", async (req: any, res) => {
    res.json({ message: "Task endpoint ready" });
});

export default router;

// Final Polish Deployment: V3