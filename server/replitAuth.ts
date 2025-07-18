import { Issuer } from "openid-client";
import passport from "passport";
import { Strategy as CustomStrategy } from "passport-custom";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

const getIssuer = memoize(
  async () => {
    return await Issuer.discover(
      process.env.ISSUER_URL ?? "https://replit.com/oidc"
    );
  },
  { maxAge: 3600 * 1000 }
);

const getClient = memoize(
  async () => {
    const issuer = await getIssuer();
    return new issuer.Client({
      client_id: process.env.REPL_ID!,
      redirect_uris: [`https://${process.env.REPLIT_DOMAINS!.split(',')[0]}/api/callback`],
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

async function upsertUser(claims: any) {
  await storage.upsertUser({
    id: claims.sub,
    email: claims.email,
    firstName: claims.first_name,
    lastName: claims.last_name,
    profileImageUrl: claims.profile_image_url,
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Custom authentication strategy
  passport.use('replit-oidc', new CustomStrategy(async (req, done) => {
    try {
      const client = await getClient();
      
      if (req.query.code) {
        // Handle callback
        const tokenSet = await client.callback(
          `${req.protocol}://${req.hostname}/api/callback`,
          req.query
        );
        
        const claims = tokenSet.claims();
        await upsertUser(claims);
        
        // Store user data in session
        const user = {
          claims,
          access_token: tokenSet.access_token,
          refresh_token: tokenSet.refresh_token,
          expires_at: claims.exp,
        };
        
        return done(null, user);
      } else {
        // Handle login redirect
        const authUrl = client.authorizationUrl({
          scope: 'openid email profile offline_access',
          redirect_uri: `${req.protocol}://${req.hostname}/api/callback`,
        });
        
        return done(null, false, { message: 'redirect', url: authUrl });
      }
    } catch (error) {
      console.error('Auth error:', error);
      return done(error);
    }
  }));

  passport.serializeUser((user: any, done) => {
    done(null, user);
  });

  passport.deserializeUser((user: any, done) => {
    done(null, user);
  });

  app.get("/api/login", (req, res, next) => {
    passport.authenticate('replit-oidc', (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      if (!user && info && info.message === 'redirect') {
        return res.redirect(info.url);
      }
      if (!user) {
        return res.redirect('/api/login');
      }
      
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.redirect('/');
      });
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    passport.authenticate('replit-oidc', (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect('/api/login');
      }
      
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.redirect('/');
      });
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error('Logout error:', err);
      }
      res.redirect('/');
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated() || !user?.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  // Token expired, try to refresh
  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const client = await getClient();
    const tokenSet = await client.refresh(refreshToken);
    
    // Update user session
    user.claims = tokenSet.claims();
    user.access_token = tokenSet.access_token;
    user.refresh_token = tokenSet.refresh_token;
    user.expires_at = tokenSet.claims().exp;
    
    return next();
  } catch (error) {
    console.error('Token refresh error:', error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};