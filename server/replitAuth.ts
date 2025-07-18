import { Issuer, Strategy } from "openid-client";

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
    return issuer;
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
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false, // Set to false for development
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(
  user: any,
  tokenset: any
) {
  user.claims = tokenset.claims();
  user.access_token = tokenset.access_token;
  user.refresh_token = tokenset.refresh_token;
}

async function upsertUser(
  claims: any,
) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const issuer = await getOidcConfig();

  // Add localhost for development
  const domains = process.env.REPLIT_DOMAINS!.split(",");
  if (!domains.includes("localhost")) {
    domains.push("localhost");
  }

  for (const domain of domains) {
    const protocol = domain === "localhost" ? "http" : "https";
    const client = new issuer.Client({
      client_id: process.env.REPL_ID!,
      redirect_uris: [`${protocol}://${domain}/api/callback`],
      response_types: ['code'],
    });

    const strategy = new Strategy(
      {
        client,
        params: {
          scope: "openid email profile offline_access",
        },
      },
      async (tokenset: any, done: any) => {
        const user = {};
        updateUserSession(user, tokenset);
        await upsertUser(tokenset.claims());
        done(null, user);
      }
    );

    passport.use(`replitauth:${domain}`, strategy);
  }

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      const endSessionUrl = issuer.end_session_endpoint 
        ? `${issuer.end_session_endpoint}?client_id=${process.env.REPL_ID!}&post_logout_redirect_uri=${req.protocol}://${req.hostname}`
        : `${req.protocol}://${req.hostname}`;
      res.redirect(endSessionUrl);
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated() || !user || !user.claims) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (user.claims.exp && now <= user.claims.exp) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const issuer = await getOidcConfig();
    const client = new issuer.Client({
      client_id: process.env.REPL_ID!,
    });
    const tokenSet = await client.refresh(refreshToken);
    updateUserSession(user, tokenSet);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
