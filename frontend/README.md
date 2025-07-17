# Zoonigia Frontend

React/TypeScript frontend for the Zoonigia EdTech platform, optimized for Vercel deployment.

## Features

- **Modern React Stack**: React 18+ with TypeScript, Vite build tool
- **UI Components**: Shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom space theme
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state
- **Authentication**: Google OAuth integration
- **Forms**: React Hook Form with Zod validation
- **Payment Processing**: Stripe integration

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

For local development, create a `.env.local` file:

```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

For production deployment on Vercel:

```env
VITE_API_URL=https://zoonigia-web.onrender.com
VITE_STRIPE_PUBLIC_KEY=pk_live_...
```

## Deployment

This frontend is optimized for Vercel deployment:

1. Connect your GitHub repository to Vercel
2. Set the environment variables in Vercel dashboard
3. Deploy with automatic builds on push to main branch

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and configurations
│   ├── pages/           # Page components
│   └── main.tsx         # Application entry point
├── shared/
│   └── types.ts         # Shared TypeScript types
├── public/              # Static assets
└── dist/                # Build output
```

## Authentication Flow

The frontend communicates with the backend for authentication:

1. User clicks "Login" → redirected to backend `/auth/login`
2. Backend handles Google OAuth flow
3. After successful auth, user is redirected back to frontend
4. Frontend checks auth status via `/api/auth/user` endpoint

## API Communication

All API requests are made to the backend server:

- Development: `http://localhost:5000`
- Production: `https://zoonigia-web.onrender.com`

The frontend includes proper CORS handling and credential management for cross-origin requests.