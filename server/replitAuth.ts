import * as client from "openid-client";
import { Strategy, Issuer } from "openid-client";
import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

const getOidcConfig = memoize(
  async () => {
    const issuer = await Issuer.discover(process.env.ISSUER_URL ?? "https://replit.com/oidc");
    return new issuer.Client({
      client_id: process.env.REPL_ID!,
      response_types: ['code'],
    });
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(user: any, tokenset: any) {
  user.claims = tokenset.claims();
  user.access_token = tokenset.access_token;
  user.refresh_token = tokenset.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(
  claims: any,
) {
  // Handle cases where email might not be provided by Replit OIDC
  const userData = {
    id: claims["sub"],
    email: claims["email"] || null, // Email might be null if not verified or not shared
    firstName: claims["first_name"] || null,
    lastName: claims["last_name"] || null,
    profileImageUrl: claims["profile_image_url"] || null,
  };
  
  console.log("Upserting user with data:", userData);
  await storage.upsertUser(userData);
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const oidcClient = await getOidcConfig();

  const verify = async (tokenset: any, done: any) => {
    const user = {};
    const claims = tokenset.claims();
    console.log("Received claims from Replit OIDC:", JSON.stringify(claims, null, 2));
    
    updateUserSession(user, tokenset);
    await upsertUser(claims);
    done(null, user);
  };

  for (const domain of process.env.REPLIT_DOMAINS!.split(",")) {
    const strategy = new Strategy(
      {
        client: oidcClient,
        sessionKey: `oidc:${domain}`,
        params: {
          scope: "openid profile",
          redirect_uri: `https://${domain}/api/callback`,
        },
      },
      verify
    );
    passport.use(`replitauth:${domain}`, strategy);
  }
  
  // Use the same strategy for localhost but with correct redirect URI
  const localhostStrategy = new Strategy(
    {
      client: oidcClient,
      sessionKey: `oidc:${process.env.REPLIT_DOMAINS!.split(",")[0]}`,
      params: {
        scope: "openid profile",
        redirect_uri: `https://${process.env.REPLIT_DOMAINS!.split(",")[0]}/api/callback`,
      },
    },
    verify
  );
  passport.use(`replitauth:localhost`, localhostStrategy);

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`)(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    console.log(`Callback received from: ${req.hostname}`, req.query);
    
    // Check for error in callback
    if (req.query.error) {
      console.error("OIDC Error:", req.query.error_description || req.query.error);
      return res.redirect("/api/login");
    }
    
    passport.authenticate(`replitauth:${req.hostname}`, (err: any, user: any, info: any) => {
      if (err) {
        console.error("Authentication error:", err);
        return res.redirect("/api/login");
      }
      if (!user) {
        console.error("No user returned from authentication");
        return res.redirect("/api/login");
      }
      
      req.logIn(user, (err) => {
        if (err) {
          console.error("Login error:", err);
          return res.redirect("/api/login");
        }
        console.log("User successfully authenticated and logged in");
        return res.redirect("/");
      });
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      const logoutUrl = oidcClient.endSessionUrl({
        post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
      });
      res.redirect(logoutUrl);
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const oidcClient = await getOidcConfig();
    const tokenSet = await oidcClient.refresh(refreshToken);
    updateUserSession(user, tokenSet);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};