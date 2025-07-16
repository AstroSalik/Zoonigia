# Frontend Architecture

## Overview
The Zoonigia frontend is a modern React application built with Vite, focusing on performance, type safety, and user experience.

## Technology Decisions

### React 18 + TypeScript
- **Why**: Type safety, excellent developer experience, industry standard
- **Benefits**: Compile-time error detection, better IDE support, maintainable code

### Vite Build Tool
- **Why**: Fast development server, optimized production builds
- **Benefits**: Hot module replacement, efficient bundling, modern ES modules

### Wouter for Routing
- **Why**: Lightweight alternative to React Router
- **Benefits**: Smaller bundle size, simple API, hook-based routing

### TanStack Query
- **Why**: Powerful data fetching and caching library
- **Benefits**: Automatic caching, background refetching, optimistic updates

### Shadcn/ui + Radix UI
- **Why**: Accessible, customizable component library
- **Benefits**: WAI-ARIA compliant, themeable, copy-paste components

### Tailwind CSS
- **Why**: Utility-first CSS framework
- **Benefits**: Consistent design system, smaller CSS bundle, rapid development

## Component Architecture

### Page Components
Located in `src/pages/`, these are route-level components:
- `Landing.tsx` - Unauthenticated landing page
- `Home.tsx` - Authenticated home dashboard
- `Courses.tsx` - Course catalog
- `Workshops.tsx` - Workshop information
- `AdminDashboard.tsx` - Admin management interface

### Reusable Components
Located in `src/components/`, shared across pages:
- `Navigation.tsx` - Main navigation bar
- `GlassMorphism.tsx` - Glassmorphism effect wrapper
- `ui/` - Shadcn/ui components

### Custom Hooks
Located in `src/hooks/`:
- `useAuth.ts` - Authentication state management
- `use-toast.ts` - Toast notification system
- `use-mobile.tsx` - Mobile responsive utilities

## State Management

### Server State
- **Tool**: TanStack Query
- **Purpose**: API data fetching, caching, synchronization
- **Benefits**: Automatic background updates, error handling, loading states

### Client State
- **Tool**: React useState/useReducer
- **Purpose**: Local component state, form state
- **Benefits**: Simple, predictable, framework-native

### Authentication State
- **Tool**: Custom useAuth hook with TanStack Query
- **Purpose**: User authentication status and data
- **Benefits**: Automatic session management, consistent across app

## Data Flow

### API Communication
1. Frontend makes requests to backend via `src/lib/api.ts`
2. CORS-enabled requests with credentials for session management
3. TanStack Query handles caching and background updates
4. Error handling with toast notifications

### Authentication Flow
1. User clicks "Sign In" → redirects to backend OAuth endpoint
2. Backend handles Google OAuth flow
3. Backend redirects back to frontend with session
4. Frontend queries user data and updates auth state

## Performance Considerations

### Bundle Optimization
- Vite's automatic code splitting
- Dynamic imports for page-level components
- Tree shaking for unused code elimination

### Image Optimization
- SVG icons for crisp display at any size
- Responsive image loading
- Lazy loading for improved performance

### Caching Strategy
- TanStack Query caches API responses
- Vite caches static assets
- Browser caching for production builds

## Security

### Environment Variables
- `VITE_` prefix for client-side variables
- API URL configuration for different environments
- No sensitive data in frontend code

### Authentication
- Session-based authentication
- Secure cookie handling
- Automatic session refresh

## Testing Strategy

### Unit Testing
- Jest for component testing
- React Testing Library for user interaction testing
- Mock API responses for predictable tests

### Integration Testing
- End-to-end testing with Cypress
- Authentication flow testing
- Form submission testing

## Deployment Architecture

### Build Process
1. `npm run build` creates production bundle
2. Static assets optimized and compressed
3. `dist/` directory ready for deployment

### Vercel Deployment
- Static site generation
- Global CDN distribution
- Automatic HTTPS
- Environment variable management

## Development Workflow

### Local Development
1. Start backend server on port 5000
2. Start frontend dev server on port 3000
3. Proxy API requests to backend
4. Hot reload for instant feedback

### Code Organization
- Feature-based folder structure
- Shared utilities in `lib/`
- Type definitions co-located with components
- Consistent naming conventions

## Future Considerations

### Scalability
- Component library documentation
- Micro-frontend architecture potential
- Progressive web app features

### Performance
- Service worker for offline functionality
- WebAssembly for computationally intensive tasks
- Real-time features with WebSockets