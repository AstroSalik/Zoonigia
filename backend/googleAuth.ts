import { Issuer, Client, generators } from 'openid-client';
import express from 'express';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { storage } from './storage';

const PgSession = connectPgSimple(session);

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'https://zoonigia-web.onrender.com/auth/callback';

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error('Google OAuth credentials missing');
}

console.log('Google OAuth Configuration:');
console.log('- Client ID:', GOOGLE_CLIENT_ID.substring(0, 20) + '...');
console.log('- Redirect URI:', GOOGLE_REDIRECT_URI);

let googleClient: Client;

export async function setupAuth(app: express.Express) {
  // Configure session
  app.use(session({
    store: new PgSession({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: false,
      tableName: 'sessions',
    }),
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }));

  // Initialize Google OAuth client
  const googleIssuer = await Issuer.discover('https://accounts.google.com');
  googleClient = new googleIssuer.Client({
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    redirect_uris: [GOOGLE_REDIRECT_URI],
    response_types: ['code'],
  });

  // Google OAuth routes
  app.get('/auth/login', (req, res) => {
    const codeVerifier = generators.codeVerifier();
    const codeChallenge = generators.codeChallenge(codeVerifier);
    
    // Store code verifier in session
    (req.session as any).codeVerifier = codeVerifier;
    
    const authUrl = googleClient.authorizationUrl({
      scope: 'openid email profile',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });
    
    res.redirect(authUrl);
  });

  app.get('/auth/callback', async (req, res) => {
    try {
      const { code } = req.query;
      const codeVerifier = (req.session as any).codeVerifier;
      
      if (!code || !codeVerifier) {
        return res.redirect('/auth/login');
      }
      
      const tokenSet = await googleClient.callback(GOOGLE_REDIRECT_URI, { code: code as string }, { code_verifier: codeVerifier });
      const userinfo = await googleClient.userinfo(tokenSet.access_token!);
      
      // Store user session
      (req.session as any).user = {
        id: userinfo.sub,
        email: userinfo.email,
        firstName: userinfo.given_name,
        lastName: userinfo.family_name,
        profileImageUrl: userinfo.picture,
      };
      
      // Upsert user in database
      await storage.upsertUser({
        id: userinfo.sub!,
        email: userinfo.email || null,
        firstName: userinfo.given_name || null,
        lastName: userinfo.family_name || null,
        profileImageUrl: userinfo.picture || null,
      });
      
      // Special message for Munaf
      if (userinfo.given_name === 'Munaf') {
        (req.session as any).specialMessage = `Welcome back, Munaf! 🌟 The cosmic forces have aligned perfectly for your return to Zoonigia. Your journey through the frontier sciences continues with renewed energy and purpose.`;
      }
      
      // Clean up session
      delete (req.session as any).codeVerifier;
      
      res.redirect(process.env.FRONTEND_URL || 'https://zoonigia-frontend.vercel.app');
    } catch (error) {
      console.error('Auth callback error:', error);
      res.redirect('/auth/login');
    }
  });

  app.get('/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
      }
      res.redirect(process.env.FRONTEND_URL || 'https://zoonigia-frontend.vercel.app');
    });
  });
}

export const isAuthenticated = (req: any, res: any, next: any) => {
  if (req.session && req.session.user) {
    req.user = { claims: req.session.user };
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};