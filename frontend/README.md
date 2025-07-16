# Zoonigia Frontend

React + Vite frontend application for the Zoonigia educational platform.

## Technology Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: Wouter
- **State Management**: TanStack Query
- **UI**: Shadcn/ui with Radix UI components
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form with Zod validation

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
cd frontend
npm install
```

### Environment Variables
Copy `.env.example` to `.env` and configure:
```bash
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
```

### Development Server
```bash
npm run dev
```
Runs on http://localhost:3000

### Build for Production
```bash
npm run build
```
Outputs to `dist/` directory

## Project Structure
```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── public/              # Static assets
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
└── package.json         # Dependencies
```

## API Communication
The frontend communicates with the backend API through:
- Base URL configured via `VITE_API_URL` environment variable
- CORS-enabled requests with credentials
- Session-based authentication

## Authentication Flow
1. User clicks "Sign In" → redirects to backend `/auth/login`
2. Google OAuth handled by backend
3. Backend redirects back to frontend with session
4. Frontend queries `/api/auth/user` to get user data

## Deployment (Vercel)
1. Connect GitHub repository to Vercel
2. Set root directory to `frontend/`
3. Build command: `npm ci && npm run build`
4. Output directory: `dist`
5. Environment variables:
   - `VITE_API_URL=https://your-backend.onrender.com`
   - `VITE_STRIPE_PUBLIC_KEY=pk_test_...`

## Key Features
- Space-themed UI with cosmic animations
- Responsive design for all devices
- Real-time data fetching with React Query
- Form validation with Zod schemas
- Toast notifications for user feedback
- Admin dashboard for platform management