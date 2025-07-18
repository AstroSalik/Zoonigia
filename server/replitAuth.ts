import session from "express-session";
import type { Express, RequestHandler } from "express";
import { storage } from "./storage";

export function getSession() {
  return session({
    secret: process.env.SESSION_SECRET || "zoonigia-dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());

  app.get("/api/login", async (req, res) => {
    // Create a demo user session for the July 15th state
    const demoUser = {
      claims: {
        sub: "demo-user-1234",
        email: "demo@zoonigia.com",
        first_name: "Demo",
        last_name: "User",
        profile_image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
      },
      access_token: "demo-token",
      expires_at: Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
    };
    
    // Store user in session
    (req.session as any).user = demoUser;
    
    // Ensure user exists in database
    try {
      await storage.upsertUser({
        id: demoUser.claims.sub,
        email: demoUser.claims.email,
        firstName: demoUser.claims.first_name,
        lastName: demoUser.claims.last_name,
        profileImageUrl: demoUser.claims.profile_image_url,
      });
    } catch (error) {
      console.error("Error creating demo user:", error);
    }
    
    res.redirect("/");
  });

  app.get("/api/callback", (req, res) => {
    res.redirect("/");
  });

  app.get("/api/logout", (req, res) => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const sessionUser = (req.session as any).user;
  
  if (!sessionUser || !sessionUser.claims) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Check if session is still valid
  const now = Math.floor(Date.now() / 1000);
  if (sessionUser.expires_at && now > sessionUser.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.user = sessionUser;
  return next();
};
