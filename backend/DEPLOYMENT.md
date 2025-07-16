# Backend Deployment Guide (Render)

This guide covers deploying the Zoonigia backend to Render.

## Prerequisites
- Render account
- GitHub repository
- PostgreSQL database (Render PostgreSQL or external)
- Google OAuth credentials
- Stripe account

## Deployment Steps

### 1. Create New Web Service
1. Go to [Render Dashboard](https://render.com/dashboard)
2. Click "New+" → "Web Service"
3. Connect your GitHub repository
4. Select your repository

### 2. Configure Service Settings
- **Name**: `zoonigia-backend`
- **Root Directory**: `backend/`
- **Environment**: `Node`
- **Build Command**: `npm ci && npm run build`
- **Start Command**: `npm start`

### 3. Environment Variables
Add these in Render dashboard:
```
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://user:password@host:5432/database
SESSION_SECRET=your-super-secret-session-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://your-backend.onrender.com/auth/callback
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

### 4. Deploy
Click "Create Web Service" and wait for deployment.

## Database Setup

### Option 1: Render PostgreSQL
1. Create new PostgreSQL database in Render
2. Use connection string in `DATABASE_URL`
3. Run migrations: `npm run db:push`

### Option 2: External Database
1. Use Neon, Supabase, or other PostgreSQL provider
2. Configure connection string
3. Ensure database is accessible from Render

## Google OAuth Configuration

### Update OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services → Credentials
3. Edit OAuth 2.0 client
4. Add authorized redirect URIs:
   - `https://your-backend.onrender.com/auth/callback`

### Frontend Configuration
Update frontend `VITE_API_URL` to point to backend:
```
VITE_API_URL=https://your-backend.onrender.com
```

## Post-Deployment

### Health Check
Visit: `https://your-backend.onrender.com/health`
Should return:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "environment": "production"
}
```

### Test Authentication
1. Visit frontend application
2. Click "Sign In"
3. Should redirect to Google OAuth
4. After login, should redirect back to frontend

## Monitoring

### Render Dashboard
- View logs in real-time
- Monitor resource usage
- Track deployment history

### Error Tracking
- Check logs for authentication issues
- Monitor database connection errors
- Track API response times

## Troubleshooting

### Common Issues

#### Build Failures
- Check Node.js version compatibility
- Verify all dependencies are in `package.json`
- Review build logs for missing modules

#### Authentication Issues
- Verify Google OAuth redirect URIs
- Check session secret configuration
- Confirm database connection for session store

#### Database Connection
- Test connection string locally
- Verify database is accessible from Render
- Check for firewall restrictions

#### CORS Issues
- Verify frontend domain in CORS configuration
- Check that credentials are enabled
- Confirm cookie settings for production

## Performance Optimization
- Enable gzip compression
- Configure proper caching headers
- Monitor database query performance
- Use connection pooling for database

## Scaling
- Render automatically scales based on traffic
- Monitor resource usage in dashboard
- Consider upgrading plan for higher traffic