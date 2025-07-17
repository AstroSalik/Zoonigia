# Zoonigia Backend

Express.js backend API for the Zoonigia EdTech platform with Google OAuth authentication and PostgreSQL database.

## 🚀 Technology Stack

- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Neon serverless
- **ORM**: Drizzle ORM with type-safe queries
- **Authentication**: Google OAuth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store
- **Payment**: Stripe integration for payments
- **API Design**: RESTful API with JSON responses

## 📁 Project Structure

```
backend/
├── shared/
│   └── schema.ts      # Database schema with Drizzle ORM
├── db.ts              # Database connection and configuration
├── server.ts          # Express server setup and middleware
├── routes.ts          # API routes and endpoints
├── googleAuth.ts      # Google OAuth authentication
├── storage.ts         # Database storage interface
├── drizzle.config.ts  # Drizzle ORM configuration
├── tsconfig.json      # TypeScript configuration
└── package.json       # Dependencies and scripts
```

## 🛠️ Development

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon recommended)
- Google OAuth credentials

### Installation
```bash
cd backend
npm install
```

### Environment Variables
Create a `.env` file in the backend directory:
```
DATABASE_URL=postgresql://user:password@host:port/database
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/auth/callback
SESSION_SECRET=your_session_secret
STRIPE_SECRET_KEY=sk_test_...
FRONTEND_URL=http://localhost:3000
```

### Database Setup
```bash
# Push schema to database
npm run db:push

# Open database studio
npm run db:studio
```

### Development Server
```bash
npm run dev
```
The backend will be available at `http://localhost:5000`

### Build for Production
```bash
npm run build
npm start
```

## 🔧 API Endpoints

### Authentication
- `GET /auth/login` - Initiate Google OAuth login
- `GET /auth/callback` - Handle OAuth callback
- `GET /auth/logout` - Logout user
- `GET /api/auth/user` - Get current user
- `GET /api/auth/special-message` - Get special welcome message

### Users
- `GET /api/users` - Get all users (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

### Content Management
- `GET /api/blog-posts` - Get all blog posts
- `POST /api/blog-posts` - Create blog post (admin only)
- `GET /api/workshops` - Get all workshops
- `POST /api/workshops` - Create workshop (admin only)
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create course (admin only)
- `GET /api/campaigns` - Get all campaigns
- `POST /api/campaigns` - Create campaign (admin only)

### Enrollments
- `POST /api/course-enrollments` - Enroll in course
- `POST /api/campaign-participants` - Join campaign
- `POST /api/workshop-enrollments` - Enroll in workshop
- `POST /api/workshop-registrations` - Register for workshop

### Admin Features
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/inquiries` - Get contact inquiries
- `GET /api/admin/registrations` - Get workshop registrations
- `PUT /api/admin/registration-status` - Update registration status

### Payments
- `POST /api/create-payment-intent` - Create Stripe payment intent
- `POST /api/campaign-payment` - Process campaign payment

## 🗄️ Database Schema

### Core Tables
- `users` - User accounts and profiles
- `sessions` - Session storage for authentication
- `blog_posts` - Blog content and articles
- `workshops` - Workshop information
- `courses` - Course catalog
- `campaigns` - Research campaigns

### Enrollment Tables
- `course_enrollments` - Course enrollment tracking
- `campaign_participants` - Campaign participation
- `workshop_enrollments` - Workshop enrollment
- `workshop_registrations` - Workshop registration details

### Management Tables
- `contact_inquiries` - Contact form submissions

## 🔐 Authentication Flow

1. User clicks login button on frontend
2. Frontend redirects to `/auth/login`
3. Backend redirects to Google OAuth
4. User authorizes with Google
5. Google redirects to `/auth/callback`
6. Backend exchanges code for tokens
7. Backend creates/updates user in database
8. Backend sets session cookie
9. Frontend receives authenticated user

## 💳 Payment Integration

### Stripe Setup
1. Create Stripe account and get API keys
2. Set up webhook endpoints for payment events
3. Configure payment methods and currencies
4. Handle payment success/failure flows

### Payment Flow
1. User selects course/campaign
2. Frontend creates payment intent
3. Backend processes with Stripe
4. User completes payment
5. Backend confirms payment
6. User enrollment is activated

## 🚀 Deployment

### Render Deployment
1. Connect GitHub repository
2. Set environment variables
3. Configure build command: `npm run build`
4. Configure start command: `npm start`
5. Deploy with automatic builds

### Production Configuration
- Environment-specific settings
- Database connection pooling
- Session store configuration
- Security headers and CORS
- Error logging and monitoring

## 📊 Monitoring

### Health Checks
- Database connection status
- Authentication service health
- Payment service availability
- API response times

### Logging
- Request/response logging
- Error tracking and alerts
- Performance monitoring
- Security event logging

## 🔧 Development Guidelines

### Code Style
- TypeScript for type safety
- Async/await for promises
- Proper error handling
- Consistent naming conventions

### Database Operations
- Use Drizzle ORM for queries
- Implement proper migrations
- Handle connection pooling
- Optimize query performance

### Security
- Input validation with Zod
- SQL injection prevention
- Authentication middleware
- Rate limiting for APIs

## 🔍 Troubleshooting

### Common Issues
- **Database Connection**: Check DATABASE_URL format
- **Authentication Errors**: Verify Google OAuth credentials
- **CORS Issues**: Check FRONTEND_URL configuration
- **Payment Failures**: Verify Stripe configuration

### Debug Mode
Enable debug logging:
```bash
DEBUG=* npm run dev
```

## 📄 License

This project is part of the Zoonigia EdTech platform.