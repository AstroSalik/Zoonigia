# Zoonigia - Frontier Sciences Discovery Platform

## Overview
Zoonigia is a full-stack web application dedicated to empowering future innovators and explorers through immersive science discovery. It serves as a hub for frontier sciences exploration, connecting students, educators, schools, collaborators, and sponsors through various educational programs including workshops, courses, campaigns, and expert sessions. The platform focuses on interdisciplinary learning, blending scientific rigor with literary and philosophical insights.

## User Preferences
Preferred communication style: Simple, everyday language.
Preferred content approach: Avoid repetitive phrasing across pages; use varied, elegant language instead of overloading the website with the same interdisciplinary messaging everywhere.
Project state: Restored to July 15th, 2025 state with cosmic background animation and orbiting planet feature.

## System Architecture

### Full-Stack Architecture
- **Frameworks**: React 18+ with TypeScript (Frontend), Node.js Express (Backend)
- **Build Tool**: Vite
- **UI Framework**: Shadcn/ui with Radix UI components
- **Styling**: Tailwind CSS with a custom space-themed design system
- **Routing**: Wouter for client-side routing
- **State Management**: React Query (TanStack Query) for server state
- **Form Handling**: React Hook Form with Zod validation
- **3D Graphics**: Three.js with React Three Fiber
- **Authentication**: Replit OpenID Connect with PostgreSQL session storage (as per July 15th state)
- **Database**: PostgreSQL with Neon serverless database
- **ORM**: Drizzle ORM for type-safe queries

### Key Design Decisions
- **Monorepo Structure**: Shared schema between client and server for type safety.
- **TypeScript First**: Full type safety across the entire stack.
- **Component-Based UI**: Modular, reusable components with consistent theming.
- **Responsive Design**: Mobile-first approach.
- **Performance**: Vite for fast builds, React Query for efficient data fetching, comprehensive production optimizations including code splitting, lazy loading, error boundaries, caching, and HTTP compression.
- **UI/UX**: Features cosmic background animation, glass morphism styling, and space-themed aesthetics.
- **Admin Portal**: Comprehensive dashboard for managing users, content (blogs, workshops, courses, campaigns), and inquiries with role-based access control.

### Feature Specifications
- **Educational Programs**: Workshops (Campus/Community with revenue sharing), Courses (frontier sciences), Research Campaigns (e.g., Asteroid Search).
- **Course Status Management**: "Upcoming", "Accepting Registrations", "Live" states with status-based content accessibility.
- **Content**: Educational blog posts covering frontier sciences, detailed course and campaign information.
- **Interdisciplinary Learning**: Emphasizes scientific rigor, literary wonder, and philosophical depth across content.
- **Contact System**: Department-specific contact directory and inquiry management.
- **User Management**: Authentication, user profiles, and admin capabilities.

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless database connection.
- **drizzle-orm**: Type-safe database queries.
- **@tanstack/react-query**: Server state management.
- **zod**: Schema validation.
- **passport**, **openid-client**: For Replit OpenID Connect authentication.

### UI Dependencies
- **@radix-ui/***: Comprehensive UI component library.
- **tailwindcss**: Utility-first CSS framework.
- **@react-three/fiber**: 3D graphics rendering.
- **lucide-react**: Icon library.

### Development Dependencies
- **vite**: Build tool and development server.
- **typescript**: Type checking.
- **drizzle-kit**: Database migrations and management.