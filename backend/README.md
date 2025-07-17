# Zoonigia Backend

Node.js/Express backend for the Zoonigia EdTech platform, optimized for Render deployment.

## Features

- **Express.js Server**: RESTful API with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Google OAuth with session management
- **Payment Processing**: Stripe integration
- **Session Storage**: PostgreSQL-backed sessions
- **CORS**: Configured for cross-origin requests from frontend

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Push database schema changes
npm run db:push
```

## Environment Variables

Create a `.env` file with:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/dbname
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/auth/callback
FRONTEND_URL=http://localhost:3000
SESSION_SECRET=your_session_secret
STRIPE_SECRET_KEY=sk_test_...
```

For production deployment on Render:

```env
DATABASE_URL=postgresql://...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=https://zoonigia-web.onrender.com/auth/callback
FRONTEND_URL=https://zoonigia-frontend.vercel.app
SESSION_SECRET=...
STRIPE_SECRET_KEY=sk_live_...
```

## Deployment

This backend is optimized for Render deployment:

1. Connect your GitHub repository to Render
2. Set the environment variables in Render dashboard
3. Deploy with automatic builds on push to main branch

## Project Structure

```
backend/
├── shared/
│   └── schema.ts        # Database schema with Drizzle ORM
├── db.ts               # Database connection
├── storage.ts          # Data access layer
├── googleAuth.ts       # Google OAuth authentication
├── routes.ts           # API routes
├── index.ts            # Server entry point
└── dist/               # Build output
```

## Authentication

Google OAuth 2.0 flow:

1. `GET /auth/login` - Initiates OAuth flow
2. `GET /auth/callback` - Handles OAuth callback
3. `GET /auth/logout` - Destroys session
4. `GET /api/auth/user` - Returns current user (protected)

Special feature: Custom welcome message for user "Munaf"

## API Endpoints

### Authentication
- `GET /auth/login` - Start Google OAuth flow
- `GET /auth/callback` - OAuth callback handler
- `GET /auth/logout` - Logout user
- `GET /api/auth/user` - Get current user (protected)

### Content Management
- `GET /api/blog-posts` - Get all blog posts
- `POST /api/blog-posts` - Create blog post (admin)
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create course (admin)
- `GET /api/campaigns` - Get all campaigns
- `POST /api/campaigns` - Create campaign (admin)

### User Registration
- `POST /api/workshop-registrations` - Register for workshop
- `POST /api/campaign-enrollments` - Enroll in campaign
- `POST /api/contact-inquiries` - Submit contact form

### Admin (Protected)
- `GET /api/admin/*` - Admin dashboard endpoints
- `POST /api/admin/*` - Admin management endpoints

## Database Schema

The application uses PostgreSQL with the following main tables:

- `users` - User accounts with OAuth data
- `sessions` - Session storage for authentication
- `blog_posts` - Educational blog content
- `courses` - Course catalog
- `campaigns` - Research campaigns
- `workshops` - Workshop information
- `contact_inquiries` - Contact form submissions
- `workshop_registrations` - Workshop registrations
- `campaign_enrollments` - Campaign enrollments

## CORS Configuration

The backend is configured to accept requests from:
- Development: `http://localhost:3000`
- Production: `https://zoonigia-frontend.vercel.app`

All requests include credentials for session management.