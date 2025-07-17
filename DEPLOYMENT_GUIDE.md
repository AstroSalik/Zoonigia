# Zoonigia Deployment Guide

Complete guide for deploying the Zoonigia EdTech platform with separated frontend and backend architecture.

## 🏗️ Architecture Overview

- **Frontend**: React/Vite application deployed on Vercel
- **Backend**: Express.js API deployed on Render
- **Database**: PostgreSQL hosted on Neon
- **Authentication**: Google OAuth integration
- **Payments**: Stripe integration

## 🚀 Frontend Deployment (Vercel)

### Prerequisites
- Vercel account
- GitHub repository access
- Domain configuration (optional)

### Step 1: Prepare Frontend
```bash
cd frontend
npm install
npm run build
```

### Step 2: Vercel Configuration
1. Connect GitHub repository to Vercel
2. Set **Root Directory** to `frontend`
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Step 3: Environment Variables
Add these environment variables in Vercel dashboard:
```
VITE_API_URL=https://your-backend-url.onrender.com
VITE_STRIPE_PUBLIC_KEY=pk_live_...
```

### Step 4: Deploy
1. Push code to GitHub
2. Vercel will automatically build and deploy
3. Custom domain setup (optional)

### Frontend Deployment Checklist
- ✅ PostCSS configuration (`.cjs` extension)
- ✅ Tailwind CSS compilation
- ✅ TypeScript types (frontend-only)
- ✅ Asset optimization
- ✅ Environment variables
- ✅ Build output verification

## 🖥️ Backend Deployment (Render)

### Prerequisites
- Render account
- GitHub repository access
- Database credentials

### Step 1: Prepare Backend
```bash
cd backend
npm install
npm run build
```

### Step 2: Render Configuration
1. Create new Web Service on Render
2. Connect GitHub repository
3. Set **Root Directory** to `backend`
4. Configure build settings:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment: Node.js

### Step 3: Environment Variables
Add these environment variables in Render dashboard:
```
DATABASE_URL=postgresql://user:password@host:port/database
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://your-backend-url.onrender.com/auth/callback
SESSION_SECRET=your_session_secret
STRIPE_SECRET_KEY=sk_live_...
FRONTEND_URL=https://your-frontend-url.vercel.app
NODE_ENV=production
```

### Step 4: Deploy
1. Push code to GitHub
2. Render will automatically build and deploy
3. Health check configuration

### Backend Deployment Checklist
- ✅ Database connection
- ✅ Google OAuth configuration
- ✅ Session store setup
- ✅ CORS configuration
- ✅ Environment variables
- ✅ Health checks

## 🗄️ Database Setup (Neon)

### Prerequisites
- Neon account
- Database credentials

### Step 1: Create Database
1. Create new project on Neon
2. Create database instance
3. Get connection string

### Step 2: Schema Migration
```bash
cd backend
npm run db:push
```

### Step 3: Verify Setup
```bash
npm run db:studio
```

### Database Checklist
- ✅ Connection string configured
- ✅ Schema migrations applied
- ✅ Session table created
- ✅ User permissions set
- ✅ Backup configuration

## 🔐 Authentication Setup (Google OAuth)

### Prerequisites
- Google Cloud Console access
- OAuth credentials

### Step 1: Google Cloud Console
1. Create new project or select existing
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Configure authorized redirect URIs:
   - Development: `http://localhost:5000/auth/callback`
   - Production: `https://your-backend-url.onrender.com/auth/callback`

### Step 2: Environment Configuration
```bash
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=https://your-backend-url.onrender.com/auth/callback
```

### Step 3: Test Authentication
1. Deploy backend with OAuth configuration
2. Test login flow from frontend
3. Verify user session management

### Authentication Checklist
- ✅ Google OAuth credentials
- ✅ Redirect URI configuration
- ✅ Session management
- ✅ User creation/updates
- ✅ Special message for Munaf

## 💳 Payment Setup (Stripe)

### Prerequisites
- Stripe account
- API keys configured

### Step 1: Stripe Dashboard
1. Get publishable key for frontend
2. Get secret key for backend
3. Configure webhook endpoints (optional)

### Step 2: Environment Configuration
Frontend:
```bash
VITE_STRIPE_PUBLIC_KEY=pk_live_...
```

Backend:
```bash
STRIPE_SECRET_KEY=sk_live_...
```

### Step 3: Test Payments
1. Create test payment intent
2. Process test payment
3. Verify payment confirmation

### Payment Checklist
- ✅ Stripe API keys
- ✅ Payment intent creation
- ✅ Checkout flow
- ✅ Payment confirmation
- ✅ Error handling

## 🔧 Production Configuration

### Security Settings
- HTTPS enforcement
- CORS configuration
- Rate limiting
- Input validation
- SQL injection prevention

### Performance Optimization
- Database connection pooling
- Query optimization
- Caching strategies
- Asset compression
- CDN configuration

### Monitoring Setup
- Error tracking (Sentry)
- Performance monitoring
- Database monitoring
- Uptime monitoring
- Alert configuration

## 🚨 Troubleshooting

### Common Issues

#### Frontend Build Errors
- **PostCSS Error**: Use `.cjs` extension for PostCSS config
- **Type Errors**: Check frontend-only types import
- **Build Timeout**: Optimize dependencies and build process

#### Backend Deployment Issues
- **Database Connection**: Verify DATABASE_URL format
- **Auth Errors**: Check Google OAuth credentials
- **CORS Issues**: Verify FRONTEND_URL configuration

#### Authentication Problems
- **Login Redirect**: Check Google OAuth redirect URI
- **Session Issues**: Verify session store configuration
- **User Creation**: Check database schema and permissions

### Debug Commands

Frontend:
```bash
npm run build -- --debug
npm run preview
```

Backend:
```bash
DEBUG=* npm run dev
npm run db:studio
```

### Health Checks

Frontend:
- Build process completes successfully
- Static assets load correctly
- API calls work from browser

Backend:
- Server starts without errors
- Database connection established
- Authentication endpoints respond
- Payment processing works

## 📊 Monitoring

### Key Metrics
- Response times
- Error rates
- User authentication success
- Payment processing success
- Database performance

### Alert Configuration
- Server downtime
- High error rates
- Payment failures
- Database issues
- Security events

## 🔄 Continuous Deployment

### GitHub Actions (Optional)
1. Set up workflow files
2. Configure secrets
3. Automate testing
4. Deploy on merge

### Automated Testing
- Unit tests
- Integration tests
- E2E tests
- Performance tests

## 📝 Post-Deployment

### Verification Steps
1. ✅ Frontend loads correctly
2. ✅ Backend API responds
3. ✅ Database queries work
4. ✅ Authentication flow works
5. ✅ Payment processing works
6. ✅ All features functional

### User Acceptance Testing
- Complete user registration flow
- Test course enrollment
- Test campaign participation
- Test payment processing
- Test admin dashboard

## 🎯 Success Criteria

- ✅ Frontend deployed and accessible
- ✅ Backend API fully functional
- ✅ Database operations working
- ✅ Authentication system operational
- ✅ Payment processing functional
- ✅ All core features working
- ✅ Monitoring and alerts configured
- ✅ Performance optimization applied

## 📞 Support

For deployment issues:
1. Check logs in Vercel/Render dashboards
2. Verify environment variables
3. Test API endpoints manually
4. Check database connection
5. Review authentication flow

## 📄 License

This deployment guide is part of the Zoonigia EdTech platform.