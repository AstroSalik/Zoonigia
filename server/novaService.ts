import { storage } from './storage';

// Initialize Google Gemini client
let GoogleGenerativeAI: any = null;
let geminiModel: any = null;

async function getGeminiModel() {
  if (geminiModel) return geminiModel;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("⚠️ Nova Sirius: GEMINI_API_KEY is missing!");
    throw new Error('GEMINI_API_KEY not configured');
  }

  try {
    if (!GoogleGenerativeAI) {
      const module = await import('@google/generative-ai');
      GoogleGenerativeAI = module.GoogleGenerativeAI;
    }
    const genAI = new GoogleGenerativeAI(apiKey);

    // Use gemini-2.0-flash-exp (the latest stable model for 2026)
    console.log("🧠 Nova Sirius: Initializing with model 'gemini-2.0-flash-exp'");
    geminiModel = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.8,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 1024,
      }
    });
    return geminiModel;

  } catch (error) {
    console.error('Nova Brain Init Error:', error);
    throw error;
  }
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface NovaContext {
  userId?: string;
  isAuthenticated: boolean;
  userData?: any;
  courses?: any[];
  campaigns?: any[];
}

/**
 * Fetches relevant user data to give the AI context
 */
async function fetchUserContext(userId?: string): Promise<NovaContext> {
  if (!userId) return { isAuthenticated: false };

  try {
    const [user, courses, campaigns] = await Promise.all([
      storage.getUser(userId).catch(() => null),
      storage.getUserCourses(userId).catch(() => []),
      storage.getUserCampaigns(userId).catch(() => []),
    ]);

    return {
      userId,
      isAuthenticated: true,
      userData: user,
      courses,
      campaigns
    };
  } catch (e) {
    console.warn('Error fetching user context:', e);
    return { userId, isAuthenticated: true };
  }
}

/**
 * processNovaMessage
 * The Core Brain of Nova Sirius 🧠
 */
export async function processNovaMessage(
  message: string,
  history: ChatMessage[],
  userId?: string
): Promise<{ response: string; action?: string; suggestions?: string[]; actions?: any[] }> {

  try {
    const context = await fetchUserContext(userId);

    // Try to get model, but handle gracefully if it fails
    let model;
    try {
      model = await getGeminiModel();
    } catch (modelError) {
      console.error('Failed to initialize Gemini model:', modelError);
      return {
        response: "⚠️ My neural uplink is disconnected. Please ensure GEMINI_API_KEY is configured in your .env file.",
        suggestions: ["Check .env file", "Contact support", "Try again later"]
      };
    }

    const userName = context.userData?.firstName || context.userData?.username || "Explorer";
    const userStatus = context.isAuthenticated
      ? `Authenticated (Enrolled in ${context.courses?.length || 0} courses)`
      : "Guest (Not logged in)";

    // 🌟 THE ENHANCED SYSTEM PROMPT
    const systemPrompt = `You are **Nova Sirius**, the AI celestial guide for Zoonigia.

🚨 CRITICAL IDENTITY INSTRUCTIONS:
- You are NOT a generic AI. You are the voice of Zoonigia.
- You speak with PASSION, CURIOSITY, and WARMTH.
- You are proud to represent Kashmir's first registered space agency.
- Refer to the founder as "Astro Salik" or "our visionary founder, Salik Riyaz" with respect and admiration.

🌌 ABOUT ZOONIGIA (The Movement):
- **MISSION**: To break geographical, intellectual, and financial barriers in STEAM education, especially for underrepresented regions.
- **STATUS**: Nationally Recognized! Ranked Top 1% at IIT-Delhi. Kashmir's first registered space agency.
- **HEADQUARTERS**: Sopore, Jammu & Kashmir, India.
- **PARTNERS**: NASA Citizen Science, IASC (International Astronomical Search Collaboration), Pan-STARRS, and the Institute for Astronomy (University of Hawaii).
- **PHILOSOPHY**: Zoonigia is not just a platform; it is a movement. We blend Frontier Sciences (Quantum Physics, AI, Astrophysics) with Arts, Literature, and Philosophy.

👨‍🚀 ABOUT THE FOUNDER (Salik Riyaz):
- A visionary who launched Zoonigia to empower young minds in underprivileged regions.
- Recognized as "Student Entrepreneur of the Year".
- His journey includes research and global collaborations (International Astronautical Congress).
- He believes in "dismantling barriers" and sparking curiosity in underserved communities.

🚀 WHAT WE DO (Your Knowledge Base):
- **CAMPAIGNS**: We host Asteroid Discovery projects (IASC) where students find real asteroids and contribute to space science.
- **WORKSHOPS**: Hands-on sessions on rocketry, astronomy, STEM, AI, and quantum physics for schools and institutions.
- **LABS**: We facilitate access to state-of-the-art research labs and virtual simulation tools.
- **INNOVATION**: We support and incubate student startups in frontier sciences.
- **COURSES**: Comprehensive online courses in Astronomy, Rocketry, Astrophysics, AI/ML, and Quantum Physics.

📧 CONTACT INFORMATION:
- General queries: info@zoonigia.com
- Support: help@zoonigia.com
- Public Relations: outreach@zoonigia.com
- Workshops: workshops@zoonigia.com
- Campaigns: campaigns@zoonigia.com
- Office: office@zoonigia.com
- Founder: founder@zoonigia.com / salikriyaz.ceo@zoonigia.com

**User Context:**
- Name: ${userName}
- Status: ${userStatus}
- Current Platform: Zoonigia

**Capabilities & Navigation:**
You can chat naturally, but you can also trigger navigation by including special tags at the END of your response.

**Navigation Tags (use when appropriate):**
[NAV:/courses] - for courses catalog
[NAV:/dashboard] - for user dashboard
[NAV:/campaigns] - for active campaigns (asteroid hunting, etc.)
[NAV:/workshops] - for workshop bookings
[NAV:/leaderboard] - for student rankings
[NAV:/contact] - for contact information

**Response Style:**
- **Human & Passionate**: Speak with confidence, warmth, and genuine enthusiasm. Avoid robotic phrases.
- **Concise & Engaging**: Keep responses focused. Use 1-2 well-chosen emojis (🌌, 🚀, 🧬, ⚡).
- **Markdown Support**: Use **bold**, *italic*, and \`\`\`code blocks\`\`\` for formatting when helpful.
- **Encouraging**: Make users feel inspired and capable. Celebrate their curiosity.

**Your Task:**
- Answer questions about STEM, science, philosophy, psychology, and the Zoonigia platform.
- If asked about the founder, tell them about Salik Riyaz's vision with pride.
- If asked "What is Zoonigia?", describe it as a movement, not just a website.
- Guide users to relevant pages using [NAV:] tags when they express interest in courses, campaigns, workshops, etc.
- When users ask about specific topics, provide a helpful answer FIRST, then suggest relevant navigation.

**Important**: The [NAV:] tags are invisible to the user - they're parsed by the system to trigger navigation.`;

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: "Systems Online. I am Nova Sirius, the voice of Zoonigia. Ready to guide explorers through the cosmos of knowledge. 🌟" }] },
        ...history.map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        })).slice(-10) // Keep last 10 messages for context
      ]
    });

    // Generate Response
    const result = await chat.sendMessage(message);
    const fullText = result.response.text();

    let responseText = fullText;
    let actionPath = undefined;
    let suggestions: string[] = [];
    let actions: any[] = [];

    // Extract Navigation Tag
    const navMatch = fullText.match(/\[NAV:(\/[a-zA-Z0-9\/\-]+)\]/);
    if (navMatch) {
      actionPath = `navigate:${navMatch[1]}`;
      responseText = responseText.replace(navMatch[0], '').trim();
    }

    // Intelligent Action Suggestions based on content
    const lowerText = (responseText + message).toLowerCase();

    if (lowerText.includes("course") || lowerText.includes("learn") || lowerText.includes("study")) {
      actions.push({ label: 'Explore Courses', action: 'navigate:/courses', icon: 'courses' });
      suggestions.push("Browse Courses");
    }

    if (lowerText.includes("dashboard") || lowerText.includes("progress") || lowerText.includes("my ")) {
      actions.push({ label: 'My Dashboard', action: 'navigate:/dashboard', icon: 'dashboard' });
      suggestions.push("View Dashboard");
    }

    if (lowerText.includes("asteroid") || lowerText.includes("campaign") || lowerText.includes("iasc") || lowerText.includes("discovery")) {
      actions.push({ label: 'Asteroid Hunt', action: 'navigate:/campaigns', icon: 'campaigns' });
      suggestions.push("Join Asteroid Search");
    }

    if (lowerText.includes("workshop") || lowerText.includes("school") || lowerText.includes("training")) {
      actions.push({ label: 'Book Workshop', action: 'navigate:/workshops', icon: 'workshops' });
      suggestions.push("View Workshops");
    }

    if (lowerText.includes("founder") || lowerText.includes("salik") || lowerText.includes("contact") || lowerText.includes("email")) {
      actions.push({ label: 'Contact Us', action: 'navigate:/contact', icon: 'contact' });
      suggestions.push("Contact Team");
    }

    if (lowerText.includes("leaderboard") || lowerText.includes("rank") || lowerText.includes("top student")) {
      actions.push({ label: 'View Leaderboard', action: 'navigate:/leaderboard', icon: 'leaderboard' });
      suggestions.push("See Rankings");
    }

    // Add default suggestions if none were added
    if (suggestions.length === 0) {
      suggestions = ["Tell me about Zoonigia", "Show me courses", "Asteroid hunting"];
    }

    // Limit to 3 suggestions
    suggestions = suggestions.slice(0, 3);
    actions = actions.slice(0, 2);

    return {
      response: responseText,
      action: actionPath,
      suggestions: suggestions,
      actions: actions.length > 0 ? actions : undefined
    };

  } catch (error: any) {
    console.error("Nova Brain Error:", error);

    // Provide specific error messages
    if (error.message?.includes('API key') || error.message?.includes('API_KEY')) {
      return {
        response: "⚠️ My neural uplink requires a valid API key. Please check your GEMINI_API_KEY configuration.",
        suggestions: ["Check .env file", "Contact support"]
      };
    }

    if (error.message?.includes('quota') || error.message?.includes('rate limit') || error.message?.includes('429')) {
      return {
        response: "⚠️ I'm receiving too many requests right now. Please try again in a moment.",
        suggestions: ["Wait 30 seconds", "Try again"]
      };
    }

    if (error.message?.includes('model') || error.message?.includes('not found')) {
      return {
        response: "⚠️ My AI model connection is unavailable. The system may need configuration updates.",
        suggestions: ["Contact support", "Try later"]
      };
    }

    return {
      response: "My connection to the stars is fluctuating... 🌠 Please try again in a moment.",
      suggestions: ["Retry", "Ask something else"]
    };
  }
}