# Frontend Deployment Guide - Vercel

## Prerequisites

1. GitHub repository with the frontend code
2. Vercel account (free tier available)
3. Environment variables ready

## Deployment Steps

### 1. Prepare Repository
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Test build locally
npm run build
```

### 2. Deploy to Vercel

#### Option A: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Link to existing project? No
# - Project name: zoonigia-frontend
# - Directory: ./
# - Override settings? No
```

#### Option B: GitHub Integration
1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Connect your GitHub repository
4. Select the frontend directory as root
5. Configure build settings:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### 3. Environment Variables

In Vercel dashboard, add these environment variables:

```env
VITE_API_URL=https://zoonigia-web.onrender.com
VITE_STRIPE_PUBLIC_KEY=pk_live_...
```

### 4. Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

## Build Configuration

The frontend is pre-configured for Vercel deployment:

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node.js Version**: 18.x
- **Framework**: Vite

## Troubleshooting

### Build Errors
- Check TypeScript errors: `npm run build`
- Verify all dependencies are installed
- Ensure environment variables are set

### Runtime Errors
- Check browser console for client-side errors
- Verify API endpoints are accessible
- Confirm CORS settings in backend

### Performance Issues
- Use Vercel Analytics to monitor performance
- Optimize images and assets
- Enable compression in build settings

## Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Error Tracking**: Check deployment logs in Vercel dashboard
- **Custom Metrics**: Implement using Vercel's Web Analytics

## Domain Configuration

For custom domain (e.g., app.zoonigia.com):

1. Add domain in Vercel dashboard
2. Configure DNS records:
   - Type: CNAME
   - Name: app
   - Value: cname.vercel-dns.com
3. Enable SSL (automatic with Vercel)

## Deployment Checklist

- [ ] Repository connected to Vercel
- [ ] Environment variables configured
- [ ] Build completes successfully
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Performance monitoring enabled
- [ ] Error tracking configured