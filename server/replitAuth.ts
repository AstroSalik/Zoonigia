import { Issuer, generators } from "openid-client";
import session from "express-session";
import crypto from "crypto";
import type { Express, Request, Response, NextFunction } from "express";

let googleClient: any;

export async function setupAuth(app: Express) {
  // Discover Google issuer
  const googleIssuer = await Issuer.discover("https://accounts.google.com");

  // Create client with credentials
  googleClient = new googleIssuer.Client({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    redirect_uris: [process.env.GOOGLE_REDIRECT_URI!],
    response_types: ["code"],
  });

  // Set up session
  app.use(
    session({
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }, // true if using HTTPS (like in production)
    }),
  );

  // Route: /auth/login
  app.get("/auth/login", (req: Request, res: Response) => {
    const codeVerifier = generators.codeVerifier();
    const codeChallenge = crypto
      .createHash("sha256")
      .update(codeVerifier)
      .digest("base64url");

    (req.session as any).codeVerifier = codeVerifier;

    const authUrl = googleClient.authorizationUrl({
      scope: "openid email profile",
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    });

    res.redirect(authUrl);
  });

  // Route: /auth/callback
  app.get("/auth/callback", async (req: Request, res: Response) => {
    try {
      const params = googleClient.callbackParams(req);
      const tokenSet = await googleClient.callback(
        process.env.GOOGLE_REDIRECT_URI!,
        params,
        { code_verifier: (req.session as any).codeVerifier }
      );

      const userinfo = await googleClient.userinfo(tokenSet.access_token!);

      // Store user info in session with claims structure
      (req.session as any).user = {
        claims: userinfo,
        access_token: tokenSet.access_token,
        expires_at: tokenSet.expires_at,
      };

      // Upsert user in database
      const { storage } = await import("./storage");
      await storage.upsertUser({
        id: userinfo.sub,
        email: userinfo.email,
        firstName: userinfo.given_name,
        lastName: userinfo.family_name,
        profileImageUrl: userinfo.picture,
      });

      // Special welcome message for Munaf
      if (userinfo.email === 'munafsultan111@gmail.com') {
        // Store special message in session for frontend to display
        (req.session as any).specialMessage = "Welcome back, Eternal Peace 🌸";
      }

      res.redirect("/");
    } catch (error) {
      console.error("Authentication callback error:", error);
      res.redirect("/auth/login");
    }
  });

  // Route: /auth/logout
  app.get("/auth/logout", (req: Request, res: Response) => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  });
}

// Middleware: isAuthenticated
export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const sessionUser = (req.session as any).user;
  if (sessionUser && sessionUser.claims) {
    req.user = sessionUser;
    return next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
