# Zoonigia - Space Science Education Platform

## Overview

Zoonigia is a comprehensive full-stack web application designed to empower future innovators and explorers through immersive science education. The platform serves as a hub for space science education, connecting students, educators, schools, collaborators, and sponsors through various educational programs including workshops, courses, campaigns, and expert sessions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Shadcn/ui with Radix UI components
- **Styling**: Tailwind CSS with custom space-themed design system
- **Routing**: Wouter for client-side routing
- **State Management**: React Query (TanStack Query) for server state management
- **Form Handling**: React Hook Form with Zod validation
- **3D Graphics**: Three.js with React Three Fiber for immersive space visualizations

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Neon serverless database
- **ORM**: Drizzle ORM with type-safe queries
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful API with JSON responses

### Key Design Decisions
1. **Monorepo Structure**: Shared schema between client and server for type safety
2. **TypeScript First**: Full type safety across the entire stack
3. **Component-Based UI**: Modular, reusable components with consistent theming
4. **Responsive Design**: Mobile-first approach with Tailwind CSS
5. **Performance**: Vite for fast builds, React Query for efficient data fetching

## Key Components

### Database Schema
- **Users**: Supports multiple user types (student, educator, school, collaborator, sponsor)
- **Workshops**: Telescope sessions, VR experiences, expert sessions
- **Courses**: Structured learning programs with different fields and levels
- **Campaigns**: Collaborative projects like asteroid searches and research
- **Blog Posts**: Educational content and achievements
- **Enrollments**: Tracking user participation in programs
- **Contact System**: Inquiry management for different types of partnerships

### Frontend Components
- **Navigation**: Fixed header with glass morphism effect
- **Hero Section**: 3D space visualization with animated elements
- **Form Components**: Reusable form elements with validation
- **Glass Morphism**: Custom component for modern UI aesthetics
- **Responsive Layouts**: Mobile-optimized designs throughout

### API Endpoints
- User management (registration, profile updates)
- Workshop listings and enrollment
- Course catalog with filtering
- Campaign participation tracking
- Blog content management
- Contact form submissions

## Data Flow

1. **User Registration**: Multi-step process based on user type
2. **Program Discovery**: Browse workshops, courses, and campaigns with filtering
3. **Enrollment Process**: Users can join programs with tracking
4. **Content Consumption**: Blog posts, achievements, and educational materials
5. **Partnership Inquiries**: Contact forms for collaborations and sponsorships

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless database connection
- **drizzle-orm**: Type-safe database queries
- **@tanstack/react-query**: Server state management
- **@hookform/resolvers**: Form validation integration
- **zod**: Schema validation

### UI Dependencies
- **@radix-ui/***: Comprehensive UI component library
- **tailwindcss**: Utility-first CSS framework
- **@react-three/fiber**: 3D graphics rendering
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking
- **drizzle-kit**: Database migrations and management

## Deployment Strategy

### Production Build
- Frontend: Vite builds to `dist/public`
- Backend: esbuild bundles server code to `dist/index.js`
- Database: Drizzle migrations for schema management

### Environment Configuration
- Database URL for PostgreSQL connection
- Session configuration for authentication
- Production optimizations for both client and server

### Development Workflow
- Hot reloading with Vite
- Type checking with TypeScript
- Database schema changes with Drizzle push
- Integrated development server setup

The application is designed to be scalable, maintainable, and performant, with a focus on providing an engaging educational experience in space science while maintaining robust backend functionality for managing users, content, and partnerships.