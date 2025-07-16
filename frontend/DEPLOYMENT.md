# Frontend Deployment Guide (Vercel)

This guide covers deploying the Zoonigia frontend to Vercel.

## Prerequisites
- Vercel account
- GitHub repository
- Backend deployed and running

## Deployment Steps

### 1. Connect Repository to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Connect your GitHub repository
4. Select your repository

### 2. Configure Project Settings
- **Framework Preset**: Vite
- **Root Directory**: `frontend/`
- **Build Command**: `npm ci && npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm ci`

### 3. Environment Variables
Add these in Vercel dashboard:
```
VITE_API_URL=https://your-backend.onrender.com
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
```

### 4. Deploy
Click "Deploy" and wait for build to complete.

## Post-Deployment Configuration

### Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as shown

### Performance Optimizations
- Static assets are automatically cached by Vercel CDN
- Automatic image optimization
- Edge functions for global performance

## Troubleshooting

### Build Failures
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Ensure `package.json` dependencies are correct

### Runtime Issues
- Check browser console for errors
- Verify API_URL is pointing to correct backend
- Confirm CORS is configured in backend

### Authentication Issues
- Verify Google OAuth redirect URLs include frontend domain
- Check that backend is accessible from frontend domain
- Confirm session cookies are working cross-domain

## Monitoring
- Vercel Analytics: Track page views and performance
- Function Logs: Monitor API calls and errors
- Web Vitals: Track user experience metrics

## Rollback
If issues arise:
1. Go to Deployments tab
2. Find previous working deployment
3. Click "Promote to Production"