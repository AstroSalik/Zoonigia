# 🚀 Deployment Command Lines

## 1. Git Commands to Push Changes

```bash
# Add all changes
git add .

# Commit with descriptive message
git commit -m "fix: Complete authentication route fixes for frontend-backend connection

- Fix backend authentication routes from /auth/* to /api/* in backend/replitAuth.ts
- Update all login/logout/callback endpoints to use /api/ prefix
- Ensure frontend authentication URLs use VITE_BACKEND_URL correctly
- Add comprehensive CORS configuration for Vercel domains
- Fix error redirects to use correct /api/login path
- Both frontend and backend building successfully
- Ready for Google OAuth redirect URI update and Render redeployment"

# Push to main branch
git push origin main
```

## 2. Google OAuth Configuration Update

Open Google Cloud Console and run this update:

**URL**: https://console.cloud.google.com/
**Path**: APIs & Services → Credentials → OAuth 2.0 Client IDs

**Change redirect URI from:**
```
https://zoonigia-web.onrender.com/auth/callback
```

**To:**
```
https://zoonigia-web.onrender.com/api/callback
```

## 3. Render Environment Variable Update

Update the environment variable on Render:

**Variable**: `GOOGLE_REDIRECT_URI`
**New Value**: `https://zoonigia-web.onrender.com/api/callback`

## 4. Verify Deployment Commands

```bash
# Check frontend build
cd frontend && npm run build

# Check backend build
cd backend && npm run build

# Test local authentication endpoint
curl -I http://localhost:5000/api/login
```

## 5. Production Verification Commands

After deployment, verify with:

```bash
# Test backend root
curl https://zoonigia-web.onrender.com/

# Test authentication endpoint
curl -I https://zoonigia-web.onrender.com/api/login

# Test courses endpoint
curl https://zoonigia-web.onrender.com/api/courses

# Test campaigns endpoint
curl https://zoonigia-web.onrender.com/api/campaigns
```

## Expected Results

- All authentication routes should return 302 redirects to Google OAuth
- API endpoints should return JSON data
- Frontend should load and connect to backend properly
- Login flow should work end-to-end