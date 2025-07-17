# Zoonigia Frontend

Modern React frontend for the Zoonigia EdTech platform, built with Vite and TypeScript.

## 🚀 Technology Stack

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Shadcn/ui with Radix UI components
- **Styling**: Tailwind CSS with custom space-themed design
- **Routing**: Wouter for client-side routing
- **State Management**: React Query (TanStack Query) for server state
- **Form Handling**: React Hook Form with Zod validation
- **Authentication**: Google OAuth integration
- **Payment**: Stripe integration for course and campaign payments

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── ui/        # Shadcn/ui components
│   │   ├── Navigation.tsx
│   │   ├── Footer.tsx
│   │   ├── GlassMorphism.tsx
│   │   └── AdminRoute.tsx
│   ├── pages/         # Page components
│   │   ├── Landing.tsx
│   │   ├── Home.tsx
│   │   ├── Courses.tsx
│   │   ├── Campaigns.tsx
│   │   ├── Blog.tsx
│   │   └── AdminDashboard.tsx
│   ├── hooks/         # Custom React hooks
│   │   ├── useAuth.ts
│   │   └── use-toast.ts
│   ├── lib/           # Utility functions
│   │   ├── utils.ts
│   │   ├── queryClient.ts
│   │   └── authUtils.ts
│   ├── App.tsx        # Main app component
│   ├── main.tsx       # App entry point
│   └── index.css      # Global styles
├── shared/
│   └── types.ts       # Frontend-only TypeScript types
├── components.json    # Shadcn/ui configuration
├── tailwind.config.ts # Tailwind CSS configuration
├── vite.config.ts     # Vite configuration
├── tsconfig.json      # TypeScript configuration
├── postcss.config.cjs # PostCSS configuration
└── package.json       # Dependencies and scripts
```

## 🛠️ Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
cd frontend
npm install
```

### Development Server
```bash
npm run dev
```
The frontend will be available at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the frontend directory:
```
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

### Styling
- Custom space-themed design system
- Dark mode support with CSS variables
- Responsive design with mobile-first approach
- Tailwind CSS with custom animations and components

### Authentication
- Google OAuth integration
- Session-based authentication with backend
- Protected routes for authenticated users
- Admin role-based access control

## 📦 Key Features

### User Interface
- Modern, responsive design with space theme
- Glass morphism effects and cosmic animations
- Mobile-optimized navigation and layouts
- Consistent component design system

### Authentication & Authorization
- Google OAuth login/logout
- Session management with backend
- Protected routes for authenticated users
- Admin dashboard with role-based access

### Content Management
- Dynamic course catalog with filtering
- Interactive campaign participation
- Blog system with rich content
- User registration and enrollment

### Payment Integration
- Stripe payment processing
- Course and campaign payments
- Secure checkout flow
- Payment status tracking

## 🚀 Deployment

### Vercel Deployment
1. Set root directory to `frontend` in Vercel dashboard
2. Configure environment variables
3. Deploy with automatic builds from Git

### Build Configuration
- PostCSS configuration for Tailwind CSS
- Vite optimization for production
- Asset optimization and bundling
- TypeScript compilation

## 📚 Development Guidelines

### Code Style
- TypeScript for type safety
- Functional components with hooks
- Consistent naming conventions
- Proper error handling

### State Management
- React Query for server state
- Local state with useState/useReducer
- Custom hooks for reusable logic
- Proper cache invalidation

### Testing
- Component testing with React Testing Library
- Integration testing for user flows
- E2E testing for critical paths
- Unit testing for utility functions

## 🔍 Troubleshooting

### Common Issues
- **Build Errors**: Check TypeScript types and imports
- **Styling Issues**: Verify PostCSS configuration
- **API Errors**: Check backend connection and CORS
- **Authentication**: Verify Google OAuth configuration

### Debug Mode
Enable debug mode for detailed logging:
```bash
DEBUG=* npm run dev
```

## 📄 License

This project is part of the Zoonigia EdTech platform.