# Backend Deployment Guide - Render

## Prerequisites

1. GitHub repository with the backend code
2. Render account (free tier available)
3. PostgreSQL database (Neon/Supabase/Render)
4. Environment variables ready

## Deployment Steps

### 1. Prepare Repository
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Test build locally
npm run build
```

### 2. Database Setup

#### Option A: Render PostgreSQL
1. Go to Render dashboard
2. Create new PostgreSQL database
3. Copy connection string

#### Option B: External Database (Neon/Supabase)
1. Create database in your preferred provider
2. Get connection string
3. Ensure IP whitelist includes 0.0.0.0/0 for Render

### 3. Deploy to Render

1. Go to https://render.com/dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure deployment:
   - **Name**: zoonigia-backend
   - **Runtime**: Node
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Branch**: main
   - **Root Directory**: backend

### 4. Environment Variables

In Render dashboard, add these environment variables:

```env
DATABASE_URL=postgresql://username:password@host:5432/database
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://your-backend-url.onrender.com/auth/callback
FRONTEND_URL=https://your-frontend-url.vercel.app
SESSION_SECRET=your_long_random_session_secret
STRIPE_SECRET_KEY=sk_live_...
NODE_ENV=production
```

### 5. Database Schema

After deployment, push the database schema:

```bash
# From backend directory
npm run db:push
```

Or manually run migrations if needed.

## Build Configuration

The backend is pre-configured for Render deployment:

- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Node.js Version**: 18.x
- **Auto-Deploy**: Enabled on main branch

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to APIs & Services → Credentials
3. Edit your OAuth 2.0 client
4. Add authorized redirect URIs:
   - `https://your-backend-url.onrender.com/auth/callback`
5. Save changes

## Custom Domain (Optional)

1. Go to Service Settings → Custom Domains
2. Add your domain (e.g., api.zoonigia.com)
3. Configure DNS records:
   - Type: CNAME
   - Name: api
   - Value: your-service-name.onrender.com
4. SSL certificate will be auto-generated

## Troubleshooting

### Build Errors
- Check build logs in Render dashboard
- Verify all dependencies are in package.json
- Ensure TypeScript compilation succeeds

### Runtime Errors
- Check service logs in Render dashboard
- Verify database connection
- Confirm environment variables are set

### Authentication Issues
- Verify Google OAuth redirect URIs
- Check session secret is set
- Confirm CORS settings

### Database Issues
- Test database connection locally
- Verify connection string format
- Check database permissions

## Monitoring

- **Render Logs**: Built-in logging and monitoring
- **Health Checks**: Automatic health monitoring
- **Metrics**: CPU, memory, and request metrics

## Security

- Environment variables are encrypted at rest
- HTTPS is enforced automatically
- Database connections use SSL
- Session secrets are properly configured

## Scaling

- **Free Tier**: Limited resources, may sleep after inactivity
- **Paid Tiers**: Always-on services with more resources
- **Horizontal Scaling**: Available on higher tiers

## Deployment Checklist

- [ ] Repository connected to Render
- [ ] Environment variables configured
- [ ] Database created and accessible
- [ ] Build completes successfully
- [ ] Google OAuth configured
- [ ] Database schema pushed
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Health checks passing
- [ ] Monitoring enabled