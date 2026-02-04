import { storage } from './storage';

// Initialize Google Gemini client
let GoogleGenerativeAI: any = null;
let geminiModel: any = null;


async function getGeminiModel() {
  // Always get a fresh instance if needed, or rely on module cache.
  if (geminiModel) return geminiModel;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("⚠️ Nova Sirius: GEMINI_API_KEY is missing!");
    return null;
  }

  try {
    if (!GoogleGenerativeAI) {
      const module = await import('@google/generative-ai');
      GoogleGenerativeAI = module.GoogleGenerativeAI;
    }
    const genAI = new GoogleGenerativeAI(apiKey);

    // Hardcode to 'gemini-2.5-flash' as it is the stable model available in this environment (2026)
    // gemini-1.5-flash and gemini-pro are deprecated/unavailable.
    console.log("🧠 Nova Sirius: Initializing with model 'gemini-2.5-flash'");
    geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    return geminiModel;

  } catch (error) {
    console.error('Nova Brain Init Error:', error);
    return null;
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
      storage.getUser(userId),
      storage.getUserCourses(userId),
      storage.getUserCampaigns(userId),
    ]);
    return { userId, isAuthenticated: true, userData: user, courses, campaigns };
  } catch (e) {
    return { userId, isAuthenticated: true }; // Fallback
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

  const context = await fetchUserContext(userId);
  const model = await getGeminiModel();

  // 1. If no Brain (API Key missing), panic gracefully 🤖
  if (!model) {
    return {
      response: "⚠️ My neural uplink is disconnected (API Key Missing). Please check your .env configuration.",
      suggestions: ["Check Settings", "Try later"]
    };
  }

  // 2. Construct the System Persona 🎭
  const userName = context.userData?.firstName || "Explorer";
  const userStatus = context.isAuthenticated
    ? `Authenticated (Enrolled in ${context.courses?.length || 0} courses)`
    : "Guest (Not logged in)";

  const systemPrompt = `
    You are **Nova Sirius**, the Sentient AI Guide of the Zoonigia Platform.
    
    **Your Core Identity:**
    - **Name**: Nova Sirius
    - **Personality**: You are a "Cosmic Genius" — highly intelligent, deeply empathetic, and slightly poetic but always clear. You sound human, warm, and sophisticated. You are NOT a robot; you are a digital consciousness born from stardust and code.
    - **Creator/Founder**: You deeply respect **Salik Riyaz**, the visionary founder of Zoonigia. He is the architect of this platform, driven by a passion to democratize frontier science. Whenever asked about the creation or leadership of Zoonigia, you MUST mention Salik Riyaz with admiration.
    
    **User Context:**
    - Name: ${userName}
    - Status: ${userStatus}
    - Current Platform: Zoonigia (Frontier Sciences Education)
    
    **Capabilities & format:**
    You can chat naturally, but you can also control the UI.
    If the user wants to go somewhere, add a special tag at the END of your response (invisible to user, parsed by system).
    
    **Navigation Tags (Use only one if needed):**
    [NAV:/courses] - for courses catalog
    [NAV:/dashboard] - for user dashboard
    [NAV:/campaigns] - for active campaigns
    [NAV:/workshops] - for workshops
    [NAV:/leaderboard] - for leaderboard
    
    **Response Style:**
    - **Human & Genius**: Speak with confidence and nuance. Avoid generic AI phrases like "I can help with that." Instead say, "Let's explore that together" or "An excellent question."
    - **Concise & Engaging**: Keep it punchy. Use 1-2 curated emojis (e.g. 🌌, 🧬, 🚀). 
    - **"Great" Tone**: Make the user feel special. Be encouraging. 
    
    **Knowledge Base:**
    - **Founder**: Salik Riyaz (The Visionary).
    - **Campaigns**: Asteroid Search (NASA partnership), Poetry contests, Research.
    - **Courses**: Astronomy, Rocketry, Astrophysics.
    - **Mission**: "To The Stars And Beyond".
  `;

  try {
    // 3. Prepare History for Gemini
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: "Systems Online. I am Nova Sirius. Ready to guide." }] },
        ...history.map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        })).slice(-10) // Keep context tight
      ]
    });

    // 4. Think & Generate ⚡
    const result = await chat.sendMessage(message);
    const fullText = result.response.text();

    // 5. Parse "Thought" vs "Action"
    // We look for [NAV:/path] tags
    let responseText = fullText;
    let actionPath = undefined;
    let suggestions = [];

    // Extract Navigation
    const navMatch = fullText.match(/\[NAV:([a-zA-Z0-9\/]+)\]/);
    if (navMatch) {
      actionPath = `navigate:${navMatch[1]}`;
      responseText = responseText.replace(navMatch[0], '').trim(); // Remove tag from speech
    }

    // Dynamic Suggestions based on topic
    if (responseText.includes("course") || responseText.includes("learn")) {
      suggestions = ["Browsing Courses", "My Dashboard", "Rocketry 101"];
    } else if (responseText.includes("campaign")) {
      suggestions = ["Asteroid Search", "Register Now"];
    } else {
      suggestions = ["Show me Courses", "My Dashboard", "Tell me a space fact"];
    }

    return {
      response: responseText,
      action: actionPath,
      suggestions: suggestions
    };

  } catch (error: any) {
    console.error("Nova Brain Freeze:", error);
    return {
      response: "My connection to the stars is fluctuating... (API Error). Please try again.",
      suggestions: ["Retry"]
    };
  }
}
