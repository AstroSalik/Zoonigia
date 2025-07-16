# Zoonigia Backend

Express API server for the Zoonigia educational platform with Google OAuth authentication.

## Technology Stack
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Google OAuth 2.0 (OpenID Connect)
- **Session Management**: Express sessions with PostgreSQL store
- **Validation**: Zod schemas
- **Payment Processing**: Stripe

## Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Google OAuth credentials
- Stripe account

### Installation
```bash
cd backend
npm install
```

### Environment Variables
Copy `.env.example` to `.env` and configure:
```bash
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/zoonigia
SESSION_SECRET=your-super-secret-session-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/auth/callback
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

### Database Setup
```bash
npm run db:push
```

### Development Server
```bash
npm run dev
```
Runs on http://localhost:5000

### Build for Production
```bash
npm run build
npm start
```

## Project Structure
```
backend/
├── shared/              # Database schema and types
├── server.ts            # Main server file
├── routes.ts            # API routes
├── auth.ts              # Authentication middleware
├── storage.ts           # Database operations
├── db.ts                # Database connection
├── dist/                # Build output
└── package.json         # Dependencies
```

## API Endpoints

### Authentication
- `GET /auth/login` - Initiate Google OAuth flow
- `GET /auth/callback` - OAuth callback handler
- `GET /auth/logout` - Logout and clear session
- `GET /api/auth/user` - Get current user data

### Content Management
- `GET /api/workshops` - List workshops
- `GET /api/courses` - List courses
- `GET /api/campaigns` - List campaigns
- `GET /api/blog` - List blog posts
- `POST /api/contact` - Submit contact inquiry

### Admin (Protected)
- `GET /api/admin/users` - List all users
- `POST /api/admin/courses` - Create course
- `PUT /api/admin/courses/:id` - Update course
- `DELETE /api/admin/courses/:id` - Delete course

## Authentication System
- Google OAuth 2.0 with PKCE flow
- Session-based authentication
- PostgreSQL session store
- CORS enabled for frontend communication
- Secure cookie configuration

## Database Schema
- Users with role-based access
- Workshops with enrollment tracking
- Courses with modules and lessons
- Campaigns with participation
- Blog posts with author information
- Contact inquiries and admin management

## Deployment (Render)
1. Connect GitHub repository to Render
2. Set root directory to `backend/`
3. Build command: `npm ci && npm run build`
4. Start command: `npm start`
5. Environment variables:
   - `NODE_ENV=production`
   - `DATABASE_URL=postgresql://...`
   - `SESSION_SECRET=...`
   - `GOOGLE_CLIENT_ID=...`
   - `GOOGLE_CLIENT_SECRET=...`
   - `GOOGLE_REDIRECT_URI=https://your-backend.onrender.com/auth/callback`
   - `STRIPE_SECRET_KEY=sk_test_...`

## Security Features
- CORS configuration for trusted domains
- Session encryption and secure cookies
- Input validation with Zod schemas
- SQL injection prevention with ORM
- Rate limiting and security headers