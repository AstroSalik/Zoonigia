# ✅ Separated Architecture Deployment Guide

## Overview
The application has been restructured into two independent services:

### 🎨 Frontend (React + Vite)
- **Technology**: React 18, Vite, Wouter, TanStack Query
- **Deploy to**: Vercel
- **Port**: 3000 (development)

### 🔧 Backend (Express API)
- **Technology**: Express, Google OAuth, PostgreSQL, Sessions
- **Deploy to**: Render
- **Port**: 5000 (development)

## 📁 New Project Structure
```
/
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── dist/ (build output)
├── backend/
│   ├── server.ts
│   ├── routes.ts
│   ├── auth.ts
│   ├── storage.ts
│   ├── shared/ (database schema)
│   ├── package.json
│   └── dist/ (build output)
└── shared/ (types and schemas)
```

## 🚀 Deployment Instructions

### Frontend (Vercel)
1. **Connect Repository**: Connect your GitHub repo to Vercel
2. **Root Directory**: Set to `frontend/`
3. **Build Command**: `npm ci && npm run build`
4. **Output Directory**: `dist`
5. **Environment Variables**:
   - `VITE_API_URL=https://your-backend.onrender.com`
   - `VITE_STRIPE_PUBLIC_KEY=pk_test_...`

### Backend (Render)
1. **Connect Repository**: Connect your GitHub repo to Render
2. **Root Directory**: Set to `backend/`
3. **Build Command**: `npm ci && npm run build`
4. **Start Command**: `npm start`
5. **Environment Variables**:
   - `NODE_ENV=production`
   - `DATABASE_URL=postgresql://...`
   - `SESSION_SECRET=...`
   - `GOOGLE_CLIENT_ID=...`
   - `GOOGLE_CLIENT_SECRET=...`
   - `GOOGLE_REDIRECT_URI=https://your-backend.onrender.com/auth/callback`
   - `STRIPE_SECRET_KEY=sk_test_...`

## 🔧 Development Setup

### Start Frontend (Terminal 1)
```bash
cd frontend
npm install
npm run dev  # Runs on http://localhost:3000
```

### Start Backend (Terminal 2)
```bash
cd backend
npm install
npm run dev  # Runs on http://localhost:5000
```

## 📡 API Communication
- Frontend uses `VITE_API_URL` to communicate with backend
- CORS configured for cross-origin requests
- Session cookies work across domains
- Authentication redirects handled by backend

## ✅ Benefits of Separation
- **Independent Deployments**: Frontend and backend can be deployed separately
- **Better Scaling**: Each service can scale independently
- **Cleaner Dependencies**: No more build conflicts between frontend and backend tools
- **Faster Builds**: Smaller, focused build processes
- **Better Caching**: Frontend static assets cached by CDN

## 🧪 Testing Checklist
- [ ] Frontend builds successfully (`npm run build`)
- [ ] Backend starts correctly (`npm start`)
- [ ] API requests work from frontend to backend
- [ ] Google OAuth login flow works end-to-end
- [ ] Session persistence across requests
- [ ] CORS configured correctly
- [ ] Environment variables set properly

## 🔗 URLs
- **Frontend**: https://zoonigia.vercel.app
- **Backend**: https://zoonigia-backend.onrender.com
- **API Base**: https://zoonigia-backend.onrender.com/api

The separated architecture resolves all previous deployment conflicts and provides a more scalable foundation for the Zoonigia platform.