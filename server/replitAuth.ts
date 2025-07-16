import * as client from "openid-client";
import session from "express-session";
import type { Express, Request, Response, NextFunction } from "express";

let googleConfig: any;

export async function setupAuth(app: Express) {
  // Discover Google issuer configuration
  googleConfig = await client.discovery(
    new URL("https://accounts.google.com"),
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!
  );

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
    const codeVerifier = client.randomPKCECodeVerifier();
    const codeChallenge = client.calculatePKCECodeChallenge(codeVerifier);
    (req.session as any).codeVerifier = codeVerifier;

    const authUrl = client.buildAuthorizationUrl(googleConfig, {
      scope: "openid email profile",
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
    });

    res.redirect(authUrl.href);
  });

  // Route: /auth/callback
  app.get("/auth/callback", async (req: Request, res: Response) => {
    try {
      const codeVerifier = (req.session as any).codeVerifier;
      const currentUrl = new URL(req.url!, `http://${req.headers.host}`);

      const tokenSet = await client.authorizationCodeGrant(googleConfig, currentUrl, {
        pkceCodeVerifier: codeVerifier,
      });

      const userinfo = await client.fetchUserInfo(googleConfig, tokenSet.access_token!);
      
      // Store user info in session with claims structure
      (req.session as any).user = {
        claims: userinfo,
        access_token: tokenSet.access_token,
        expires_at: tokenSet.expires_at
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
