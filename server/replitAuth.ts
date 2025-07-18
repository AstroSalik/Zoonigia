import { Issuer, generators } from "openid-client";
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
    const issuer = await Issuer.discover(
      process.env.ISSUER_URL ?? "https://replit.com/oidc"
    );
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
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(
  user: any,
  accessToken: string,
  refreshToken: string,
  profile: any
) {
  user.claims = profile._json;
  user.access_token = accessToken;
  user.refresh_token = refreshToken;
  user.expires_at = profile._json?.exp;
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

  const issuer = await getOidcConfig();

  for (const domain of process.env
    .REPLIT_DOMAINS!.split(",")) {
    
    const client = new issuer.Client({
      client_id: process.env.REPL_ID!,
      redirect_uris: [`https://${domain}/api/callback`],
      response_types: ['code'],
    });

    // Store client for this domain
    (app as any)[`replitclient:${domain}`] = client;
  }

  app.get("/api/login", async (req, res) => {
    try {
      const client = (app as any)[`replitclient:${req.hostname}`];
      if (!client) {
        return res.status(500).send("Client not configured for this domain");
      }

      const code_verifier = generators.codeVerifier();
      const code_challenge = generators.codeChallenge(code_verifier);
      const state = generators.state();

      // Store in session for callback
      (req.session as any).code_verifier = code_verifier;
      (req.session as any).state = state;

      const authUrl = client.authorizationUrl({
        scope: 'openid email profile offline_access',
        code_challenge,
        code_challenge_method: 'S256',
        state,
      });

      res.redirect(authUrl);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).send("Authentication error");
    }
  });

  app.get("/api/callback", async (req, res) => {
    try {
      const client = (app as any)[`replitclient:${req.hostname}`];
      if (!client) {
        return res.status(500).send("Client not configured for this domain");
      }

      const params = client.callbackParams(req);
      const code_verifier = (req.session as any).code_verifier;
      const state = (req.session as any).state;

      if (!code_verifier || !state) {
        return res.status(400).send("Missing session data");
      }

      if (params.state !== state) {
        return res.status(400).send("Invalid state parameter");
      }

      const tokenSet = await client.callback(`https://${req.hostname}/api/callback`, params, { 
        code_verifier,
        state 
      });

      const claims = tokenSet.claims();
      
      // Create user session
      const user = {
        claims,
        access_token: tokenSet.access_token,
        refresh_token: tokenSet.refresh_token,
        expires_at: claims.exp,
      };

      (req.session as any).user = user;

      // Create user in database
      await upsertUser(claims);

      res.redirect("/");
    } catch (error) {
      console.error("Callback error:", error);
      res.redirect("/api/login");
    }
  });

  app.get("/api/logout", (req, res) => {
    req.session.destroy(() => {
      const logoutUrl = issuer.end_session_endpoint 
        ? `${issuer.end_session_endpoint}?client_id=${process.env.REPL_ID!}&post_logout_redirect_uri=${req.protocol}://${req.hostname}`
        : "/";
      res.redirect(logoutUrl);
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = (req.session as any).user;

  if (!user || !user.claims) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (user.expires_at && now > user.expires_at) {
    // Try to refresh token
    const refreshToken = user.refresh_token;
    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const issuer = await getOidcConfig();
      const client = new issuer.Client({
        client_id: process.env.REPL_ID!,
      });
      
      const tokenSet = await client.refresh(refreshToken);
      const claims = tokenSet.claims();
      
      // Update session
      (req.session as any).user = {
        claims,
        access_token: tokenSet.access_token,
        refresh_token: tokenSet.refresh_token,
        expires_at: claims.exp,
      };

      req.user = (req.session as any).user;
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }

  req.user = user;
  return next();
};
