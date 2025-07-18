# 🚀 Git Deployment Commands

The Render backend is still showing the old `/auth/` routes. Here are the exact commands to push the authentication fixes:

## For Backend (Render Deployment)

```bash
# Navigate to backend directory
cd backend

# Check current status
git status

# Add all changes
git add .

# Commit with authentication fixes
git commit -m "fix: Update authentication routes from /auth/* to /api/*

- Change /auth/login to /api/login in replitAuth.ts
- Change /auth/callback to /api/callback in replitAuth.ts
- Change /auth/logout to /api/logout in replitAuth.ts  
- Fix error redirects to use /api/login
- CORS properly configured for Vercel domains
- Ready for Google OAuth redirect URI update"

# Push to trigger Render deployment
git push origin main
```

## For Frontend (Vercel Deployment)

```bash
# Navigate to frontend directory
cd frontend

# Check current status
git status

# Add all changes
git add .

# Commit with frontend fixes
git commit -m "fix: Complete frontend authentication URL configuration

- All authentication URLs use VITE_BACKEND_URL properly
- Add vercel.json for SPA routing on Vercel
- Add _redirects for static hosting fallback
- Environment variable correctly set to backend URL
- Ready for production deployment"

# Push to trigger Vercel deployment
git push origin main
```

## Alternative: Manual Git Lock Fix

If you get git lock errors, run these first:

```bash
# Remove git lock file if it exists
rm -f .git/index.lock

# Then retry the git commands above
```

## Verification After Deployment

```bash
# Test backend authentication endpoint
curl -I https://zoonigia-web.onrender.com/api/login

# Test backend data endpoints
curl https://zoonigia-web.onrender.com/api/courses
curl https://zoonigia-web.onrender.com/api/campaigns
```

## Expected Results

- `/api/login` should return 302 redirect to Google OAuth
- `/api/courses` and `/api/campaigns` should return JSON data
- Frontend should connect to backend properly after Google OAuth redirect URI update