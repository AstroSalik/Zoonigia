# Zoonigia - Frontier Sciences Discovery Platform

## Overview

Zoonigia is a comprehensive full-stack web application designed to empower future innovators and explorers through immersive science discovery. The platform serves as a hub for frontier sciences exploration, connecting students, educators, schools, collaborators, and sponsors through various educational programs including workshops, courses, campaigns, and expert sessions. Its business vision is to foster innovation in frontier sciences, with market potential in educational institutions, research organizations, and public engagement initiatives. Zoonigia aims to be a leading platform for interdisciplinary learning, combining scientific rigor with literary and philosophical insights.

## User Preferences

Preferred communication style: Simple, everyday language.
Preferred content approach: Avoid repetitive phrasing across pages; use varied, elegant language instead of overloading the website with the same interdisciplinary messaging everywhere.
Project state: Restored to July 15th, 2025 state with cosmic background animation and orbiting planet feature.

## System Architecture

### Full-Stack Architecture
- **Frameworks**: React 18+ with TypeScript (Frontend), Node.js Express (Backend)
- **Build Tool**: Vite
- **UI Framework**: Shadcn/ui with Radix UI components
- **Styling**: Tailwind CSS with custom space-themed design system
- **Routing**: Wouter for client-side routing
- **State Management**: React Query (TanStack Query) for server state management
- **Form Handling**: React Hook Form with Zod validation
- **3D Graphics**: Three.js with React Three Fiber
- **Authentication**: Replit OpenID Connect with PostgreSQL session storage (as of July 15th restoration)
- **Database**: PostgreSQL with Neon serverless database
- **ORM**: Drizzle ORM

### Key Design Decisions
- **Monorepo Structure**: Shared schema between client and server for type safety.
- **TypeScript First**: Full type safety across the entire stack.
- **Component-Based UI**: Modular, reusable components with consistent theming.
- **Responsive Design**: Mobile-first approach.
- **Performance**: Vite for fast builds, React Query for efficient data fetching, and production optimizations including code splitting, lazy loading, and caching.
- **UI/UX**: Glass morphism styling, space-themed aesthetics, and a cosmic background animation with an orbiting planet.
- **Feature Specifications**:
    - **Course Management**: Comprehensive lifecycle (Upcoming, Accepting Registrations, Live), detailed "about" sections, and frontier science categories (Quantum Mechanics, AI, Astrophysics, etc.).
    - **Campaign Management**: Detailed forms, statistics, and Stripe payment integration.
    - **Workshop Management**: Unified workshop concept (single comprehensive experience with multiple activities), type selection (Campus/Community), revenue sharing model, and real-time admin notifications.
    - **Admin Portal**: Comprehensive dashboard for managing users, content (blogs, courses, workshops, campaigns), and inquiries with role-based access control.
    - **Terminology**: Consistent use of "frontier sciences" and engaging terms like "discovery," "exploration."
    - **Interdisciplinary Learning**: Integration of scientific rigor with literary and philosophical insights across the platform.

### Database Schema
- **Users**: Supports multiple user types and an `isAdmin` flag for role-based access.
- **Workshops**: Stores details for various workshop activities and registration status.
- **Courses**: Contains detailed course information, status, and instructor details.
- **Campaigns**: Stores campaign specifics, participant tracking, and payment status.
- **Blog Posts**: Manages educational content and author information.
- **Enrollments**: Tracks user participation in all programs.
- **Contact System**: Manages inquiries from various departments.

## External Dependencies

- **@neondatabase/serverless**: For PostgreSQL serverless database connection.
- **drizzle-orm**: For type-safe database queries and migrations.
- **@tanstack/react-query**: For server state management.
- **@hookform/resolvers**: For integrating form validation.
- **zod**: For schema validation.
- **@radix-ui/**: For comprehensive UI components.
- **tailwindcss**: For utility-first CSS styling.
- **@react-three/fiber**: For 3D graphics rendering.
- **lucide-react**: For iconography.
- **vite**: Build tool and development server.
- **typescript**: For type checking.
- **drizzle-kit**: For database migrations and management.
- **Stripe**: For payment processing in campaigns.
- **YouTube**: For embedding video content (e.g., Zoonigia introduction video).
- **openid-client**: For OpenID Connect authentication with Replit.
- **passport**: For authentication middleware.