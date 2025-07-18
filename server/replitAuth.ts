import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

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
    secret: process.env.SESSION_SECRET || "zoonigia-dev-secret",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());

  // Create a login form page
  app.get("/api/login", (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Zoonigia - Login</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
              color: white;
              margin: 0;
              padding: 0;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .login-container {
              background: rgba(255, 255, 255, 0.1);
              backdrop-filter: blur(10px);
              border-radius: 16px;
              padding: 2rem;
              width: 100%;
              max-width: 400px;
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
              border: 1px solid rgba(255, 255, 255, 0.2);
            }
            .logo {
              text-align: center;
              font-size: 2rem;
              font-weight: bold;
              margin-bottom: 2rem;
              background: linear-gradient(45deg, #4f46e5, #06b6d4);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }
            .form-group {
              margin-bottom: 1rem;
            }
            label {
              display: block;
              margin-bottom: 0.5rem;
              font-weight: 500;
            }
            input {
              width: 100%;
              padding: 0.75rem;
              border: 1px solid rgba(255, 255, 255, 0.3);
              border-radius: 8px;
              background: rgba(255, 255, 255, 0.1);
              color: white;
              font-size: 1rem;
              box-sizing: border-box;
            }
            input::placeholder {
              color: rgba(255, 255, 255, 0.6);
            }
            button {
              width: 100%;
              padding: 0.75rem;
              background: linear-gradient(45deg, #4f46e5, #06b6d4);
              color: white;
              border: none;
              border-radius: 8px;
              font-size: 1rem;
              font-weight: 600;
              cursor: pointer;
              transition: opacity 0.2s;
            }
            button:hover {
              opacity: 0.9;
            }
            .subtitle {
              text-align: center;
              margin-bottom: 2rem;
              color: rgba(255, 255, 255, 0.8);
            }
          </style>
        </head>
        <body>
          <div class="login-container">
            <div class="logo">Zoonigia</div>
            <div class="subtitle">Frontier Sciences Discovery Platform</div>
            <form method="POST" action="/api/auth/login">
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required placeholder="Enter your email">
              </div>
              <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" name="name" required placeholder="Enter your name">
              </div>
              <button type="submit">Continue to Zoonigia</button>
            </form>
          </div>
        </body>
      </html>
    `);
  });

  // Handle login form submission
  app.post("/api/auth/login", async (req, res) => {
    const { email, name } = req.body;
    
    if (!email || !name) {
      return res.redirect("/api/login?error=missing_fields");
    }

    // Create user session
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const [firstName, ...lastNameParts] = name.split(' ');
    const lastName = lastNameParts.join(' ');
    
    const user = {
      claims: {
        sub: userId,
        email: email,
        first_name: firstName,
        last_name: lastName,
        profile_image_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4f46e5&color=fff&size=200`
      },
      access_token: `token_${userId}`,
      expires_at: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 // 7 days
    };

    // Store in session
    (req.session as any).user = user;

    // Create user in database
    try {
      await storage.upsertUser({
        id: userId,
        email: email,
        firstName: firstName,
        lastName: lastName,
        profileImageUrl: user.claims.profile_image_url,
      });
    } catch (error) {
      console.error("Error creating user:", error);
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
