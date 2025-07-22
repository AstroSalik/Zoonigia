# Zoonigia - Frontier Sciences Discovery Platform

## Overview

Zoonigia is a comprehensive full-stack web application designed to empower future innovators and explorers through immersive science discovery. The platform serves as a hub for frontier sciences exploration, connecting students, educators, schools, collaborators, and sponsors through various educational programs including workshops, courses, campaigns, and expert sessions.

## Recent Changes (July 2025)

### CINEMATIC HERO HEADER - MOVIE-STYLE REDESIGN (July 22, 2025)
- **COMPLETED**: Created truly cinematic hero with film grain overlay and dramatic lighting effects
- **COMPLETED**: Implemented mouse-responsive spotlight that follows cursor movement for immersive experience
- **COMPLETED**: Added volumetric light beams, rim lighting, and floating dust particles for atmospheric depth
- **COMPLETED**: Created sequential title reveal animation with professional timing and blur effects
- **COMPLETED**: Added film-style entrance animations with staggered timing for subtitle, title, and description
- **COMPLETED**: Implemented premium button effects with internal light sweeps and enhanced shadows
- **COMPLETED**: Added cinematic vignette and sophisticated lighting gradients
- **COMPLETED**: Used dramatic typography with drop shadows and glowing text effects
- **COMPLETED**: Maintained "Everything Science for your future" headline with cinematic presentation
- **COMPLETED**: Mobile optimization: Removed subtitle, improved responsive sizing for titles and buttons
- **COMPLETED**: Enhanced mobile scroll indicator placement and sizing for better mobile experience
- **COMPLETED**: Added scroll-based fade effect for scroll indicator - fades out when scrolling past hero section
- **COMPLETED**: Simplified hero header design for better performance - removed heavy animations and complex lighting effects
- **COMPLETED**: Optimized background with static star field instead of animated particles to eliminate lag
- **COMPLETED**: Reduced visual complexity while maintaining elegant cosmic theme with subtle gradients
- **COMPLETED**: Streamlined animations to simple fade-in effects for better performance and cleaner design
- **COMPLETED**: Restored original background structure for optimal app performance

### COMPREHENSIVE PRODUCTION OPTIMIZATION COMPLETE (July 19, 2025)
- **COMPLETED**: Implemented comprehensive code splitting with lazy loading - bundle now split into 20+ optimized chunks (most under 1KB)
- **COMPLETED**: Added production-ready error boundaries with ErrorBoundary component for graceful error handling
- **COMPLETED**: Created LoadingSpinner and LazyImage components for better user experience and performance
- **COMPLETED**: Added memory cache and browser cache utilities for efficient client-side data management
- **COMPLETED**: Optimized database queries with proper LIMIT clauses and PostgreSQL UPSERT for better performance
- **COMPLETED**: Added HTTP compression middleware for production builds (gzip compression with 6:1 ratio)
- **COMPLETED**: Implemented caching headers for API responses (5-minute cache for user data)
- **COMPLETED**: Removed console.log statements in production builds (only show in development)
- **COMPLETED**: Added performance utilities: debounce, throttle, and image lazy loading helpers
- **COMPLETED**: Created MetaTags component for proper SEO optimization across all pages
- **COMPLETED**: Added useLocalStorage and useDebounce hooks for optimized state management
- **COMPLETED**: Build now generates efficiently chunked bundles: 96KB CSS (15KB gzipped), multiple JS chunks under 1KB each
- **COMPLETED**: Application is now production-ready with optimal performance, proper error handling, and deployment efficiency

## Recent Changes (July 2025)

### PROJECT RESTORED TO JULY 15TH STATE (July 18, 2025)
- **COMPLETED**: Successfully restored project to July 15th, 2025 state when cosmic background animation was added
- **COMPLETED**: Removed all changes made after July 15th (Google OAuth migration, frontend-backend separation, TypeScript fixes)
- **COMPLETED**: Restored original unified full-stack architecture with client/ and server/ directories
- **COMPLETED**: Preserved cosmic background animation with orbiting planet feature
- **COMPLETED**: Restored authentic official Replit authentication system exactly as it was before July 15th
- **COMPLETED**: Implemented proper OpenID Connect integration with openid-client@4.9.1 and passport
- **COMPLETED**: Fixed all authentication dependency issues and restored clean Replit Auth flow
- **COMPLETED**: Fixed authentication routes - "Get Started" and "Sign In" buttons now work correctly
- **COMPLETED**: Authentication system fully functional with official Replit OpenID Connect protocol
- **COMPLETED**: Users can now log in with their actual Replit accounts through official authentication
- **COMPLETED**: Admin dashboard access restored for authenticated admin users exactly as before July 15th
- **COMPLETED**: Maintained all features and functionality from July 15th state
- **COMPLETED**: Cosmic background animation working perfectly with scroll-responsive planet
- **COMPLETED**: All July 15th features preserved: workshops, courses, campaigns, blog, admin dashboard
- **COMPLETED**: Cleaned up authentication system and removed unnecessary complexity
- **COMPLETED**: Restored exact working authentication from before July 15th with proper session management
- **COMPLETED**: Fixed all authentication issues and project now runs without errors
- **COMPLETED**: Authentication endpoints returning proper responses (401 Unauthorized, 302 redirects)
- **COMPLETED**: Removed all problematic code and kept only essential pre-July 15th functionality
- **COMPLETED**: Project successfully restored to working state with cosmic background and authentic Replit auth
- **COMPLETED**: Performed comprehensive project cleanup and optimization (July 18, 2025)
- **COMPLETED**: Removed all unnecessary files: attached_assets, auth-test.md, cookies.txt, import scripts
- **COMPLETED**: Fixed authentication system with proper OpenID Connect implementation using passport-custom
- **COMPLETED**: Removed unnecessary dependencies: passport-local, body-parser, memorystore, tw-animate-css  
- **COMPLETED**: Cleaned up frontend routes and removed unused pages: AdminSimple, Shop, Collaborators
- **COMPLETED**: Fixed authentication redirect loop issue and proper session management
- **COMPLETED**: Application now runs efficiently with all unnecessary components removed
- **COMPLETED**: Authentication endpoints working correctly: 401 Unauthorized, 302 redirects, 200 OK
- **COMPLETED**: Implemented EXACT Replit authentication code as provided by user (July 19, 2025)
- **COMPLETED**: Fixed openid-client Strategy implementation to work with current version 4.9.1
- **COMPLETED**: Added proper domain handling for both production (REPLIT_DOMAINS) and development (localhost)
- **COMPLETED**: Authentication system now uses exact code structure with openid-client Strategy and VerifyFunction
- **COMPLETED**: All authentication endpoints responding correctly: /api/login (302 redirect), /api/auth/user (401), /api/callback
- **COMPLETED**: Restored authentic Replit OpenID Connect authentication exactly as requested
- **COMPLETED**: FIXED "can't reach this page" authentication issue (July 19, 2025)
- **COMPLETED**: Removed invalid `offline_access` scope that was causing authentication rejection
- **COMPLETED**: Fixed session key configuration to properly store OIDC session data
- **COMPLETED**: Corrected redirect URI configuration for Replit domain callback handling
- **COMPLETED**: Authentication flow now works seamlessly: login → Replit OIDC → callback → user session
- **COMPLETED**: MIGRATED TO GOOGLE FIREBASE AUTHENTICATION (July 19, 2025)
- **COMPLETED**: Replaced problematic Replit OIDC with production-ready Google OAuth via Firebase
- **COMPLETED**: Implemented Firebase authentication with Google sign-in popup flow (fixed "refused to connect" issue)
- **COMPLETED**: Updated all authentication hooks and components to use Firebase Auth
- **COMPLETED**: Full-fledged production authentication system with proper user management
- **COMPLETED**: Fixed admin dashboard access with email-based user lookup (astrosalikriyaz@gmail.com)
- **COMPLETED**: Removed all Replit authentication middleware and fixed server crashes
- **COMPLETED**: Added lessonFormSchema to resolve admin dashboard errors
- **COMPLETED**: Firebase users automatically sync to PostgreSQL database with admin status
- **COMPLETED**: Admin dashboard fully functional with course lesson management system
- **COMPLETED**: Fixed admin form number field validation using z.coerce.number() for proper string-to-number conversion
- **COMPLETED**: Eliminated 404 flash on admin dashboard load by removing duplicate loading states in AdminRoute
- **COMPLETED**: Restored original Collaborators page with tabbed interface for Collaborators, Sponsors & Investors
- **COMPLETED**: Includes contact form, partnership metrics, and current partners (NASA, IASC, University of Hawaii, Think Startup)

### Course Field Options and About Section Enhancement (July 15, 2025)
- Updated course field options to include frontier sciences: Quantum Mechanics, Technology & AI, Astrophysics, Space Technology, Robotics, Biotechnology, Nanotechnology, and Renewable Energy
- Added "about" field to course database schema for detailed course information display
- Enhanced admin dashboard course form with about field for comprehensive course description management
- Updated CourseDetail page to display about section with detailed course information in dedicated card
- Applied database schema changes to support new about field as optional text field
- Enhanced course editing functionality to include about field in form reset and validation
- Created responsive about section display with proper styling and whitespace handling

### Course Status Lifecycle Management System (July 15, 2025)
- Implemented comprehensive course status management with three states: "Upcoming", "Accepting Registrations", and "Live"
- Enhanced database schema with course status field and proper lifecycle management
- Added course status selection in admin dashboard with proper form validation and editing capabilities
- Updated frontend course display to show status-based behavior:
  * "Upcoming" courses: Display "Coming Soon" with disabled enrollment buttons
  * "Accepting Registrations" courses: Show pricing, enable registration, display preview content only
  * "Live" courses: Full course content access with enrollment and progress tracking
- Implemented status-based content accessibility in CourseDetail.tsx with lesson filtering
- Added proper course status badges and messaging throughout the platform
- Enhanced course enrollment flow with different button states and messaging for each status
- Created comprehensive course content management with preview lesson support
- Updated course review system to only allow reviews for live courses
- Added informative messages for empty content states based on course status
- Extended campaign status system to include "upcoming" status alongside active, closed, and completed
- Added upcoming campaigns statistics display in admin dashboard with yellow-colored badges
- Enhanced campaign detail and campaigns pages to handle upcoming status with proper messaging

### Comprehensive Admin Campaign Management System (July 15, 2025)
- Enhanced database schema with additional campaign fields: field, duration, targetParticipants, requirements, timeline, outcomes
- Added comprehensive campaign statistics dashboard with total campaigns, active campaigns, participants, and revenue tracking
- Created professional campaign management table with enhanced visual presentation including campaign images and detailed information
- Implemented complete campaign form validation with all new fields for admin content management
- Added campaign statistics update handler for future participant tracking features
- Enhanced campaign editing functionality with all new fields properly populated
- Created admin campaign API endpoints for creating and updating campaigns with comprehensive field support
- Added real-time campaign revenue calculations and participant tracking in admin dashboard
- Implemented proper campaign image display and field categorization in admin interface

### Campaign Detail Page System & Payment Integration (July 15, 2025)
- Created comprehensive campaign detail page similar to course detail system
- Added individual campaign routes (/campaigns/:id) with full content display
- Updated campaign registration flow to use detailed pages instead of direct payment dialogs
- Integrated authentic Zoonigia Asteroid Search Campaign content from WordPress source
- Added complete Stripe payment integration with registration form and payment processing
- Enhanced campaign database with field and duration information
- Added real campaign image from WordPress and detailed NASA/IASC partnership information
- Updated campaigns page to link to individual campaign detail pages
- Created responsive campaign detail layout with sidebar registration and payment system

### Cosmic Background Animation & Quick Actions Reorganization (July 15, 2025)
- Created professional cosmic background animation with single orbiting planet that responds to scroll
- Replaced complex orbital system with elegant single planet animation for better performance
- Added floating particles, shooting stars, and subtle background effects
- Moved Quick Actions section above Featured Courses for better user flow
- Enhanced scroll-based animations with planet rotation and scaling effects
- Optimized background animation to work as backdrop without interfering with content readability

### Workshop Form Enhancement & Admin Panel Completion (July 15, 2025)
- Added workshop type dropdown with explanatory text clarifying both Campus and Community workshops are hosted at schools
- Enhanced admin dashboard with missing fields: Experience Level, Contact Method, and Lower Classes Request
- Improved workshop registration table with color-coded badges for better data visualization
- Fixed notification system with proper 30-second refetch intervals and null-checking to prevent false positives
- Added comprehensive workshop type descriptions (Campus for students/staff, Community for extended school community)
- Resolved dialog accessibility warnings by adding proper DialogDescription components
- Created robust admin workflow for complete workshop registration management with real-time updates

### Admin Notification System & Workshop Status Management (July 15, 2025)
- Added real-time notification system for admin dashboard that alerts when new workshop registrations, contact inquiries, or campaign enrollments are received
- Implemented workshop registration status management with ability to update status (pending, contacted, confirmed, cancelled)
- Added status update dialog with color-coded status buttons for easy workflow management
- Enhanced workshop registrations table with edit action buttons and proper status tracking
- Integrated toast notifications for status updates and new registrations
- Created comprehensive admin workflow for managing workshop registration pipeline

### Workshop Registration Database System (July 15, 2025)
- Fixed workshop registration storage issue - registrations now properly saved to database instead of console logging
- Created workshopRegistrations table with comprehensive schema including contact details, organization, experience level, interests, and status tracking
- Added admin endpoints for viewing and managing workshop registrations
- Updated admin dashboard to display all workshop registrations with contact information and management actions
- Connected workshop form submissions to database storage with proper validation and error handling
- Workshop registrations now appear in admin portal immediately after submission

### Workshop Structure Correction (July 15, 2025)
- Fixed conceptual misunderstanding in admin dashboard: workshop display now correctly shows one comprehensive workshop
- All 6 activities (telescope sessions, VR experiences, space simulation games, expert sessions, design thinking, hands-on experiments) are components of a single workshop experience
- Updated admin dashboard to show comprehensive workshop structure with variable pricing based on school needs
- Removed separate workshop creation forms as all activities are delivered in one comprehensive session
- Added proper pricing structure explanation showing factors: location, student count, duration, equipment needs, revenue sharing (10-20%)
- Enhanced admin workshop view to reflect unified workshop concept with color-coded activity indicators

### Platform Terminology Update (July 15, 2025)
- Updated all platform references from "space science" to "frontier sciences"
- Replaced "education" with more engaging terms like "experience", "discovery", "exploration", and "learning"
- Modified landing page descriptions to reflect broader scientific scope and catchier language
- Updated video titles and descriptions across platform
- Changed admin dashboard category selections to "Frontier Sciences"
- Updated course and lesson content to use new terminology
- Enhanced platform branding to better represent quantum physics and other frontier sciences with dynamic language
- Added "Research Campaigns" feature block to landing page "What Makes Zoonigia Special" section
- Updated feature descriptions to include collaborative research campaigns alongside workshops
- Integrated interdisciplinary approach highlighting the blend of frontier sciences with literature and philosophy
- Added dedicated "Interdisciplinary Learning" feature block on landing page with Lightbulb icon
- Updated hero section, About page, and course descriptions to emphasize scientific rigor with literary and philosophical insights
- Enhanced Home page with comprehensive interdisciplinary learning section featuring Scientific Rigor, Literary Wonder, and Philosophical Depth
- Updated Courses, Workshops, and Campaigns pages to include interdisciplinary messaging throughout descriptions
- Added awe-inspiring content that showcases the unique intersection of science, literature, and philosophy across platform

### Landing Page Video Integration (July 15, 2025)
- Added Zoonigia introduction video to landing page hero section (Video ID: Tgr6BrgIBec)
- Positioned video on right side opposite to "Explore the Universe" content block
- Replaced Hero3D component with embedded YouTube video iframe
- Created responsive video container with glass morphism styling
- Integrated actual YouTube video: https://youtu.be/Tgr6BrgIBec
- Enhanced landing page user experience with visual introduction to platform

### Admin Dashboard Course Form Enhancement (July 15, 2025)
- Fixed course form schema to include instructorName field from database
- Updated course creation and editing forms with instructor field
- Removed non-existent "about" field from course form
- Enhanced course form validation and default values
- Fixed course edit functionality to properly populate instructor field

### Comprehensive Admin Portal System (July 14, 2025)
- Built complete admin dashboard with full platform management capabilities
- Added admin user authentication system with role-based access control
- Created admin middleware for protected routes and API endpoints
- Implemented comprehensive data management for users, blog posts, workshops, courses, campaigns, and inquiries
- Added admin-only navigation link in user dropdown menu with Shield icon
- Created AdminRoute component for secure admin page protection
- Enhanced database schema with isAdmin flag for user role management
- Built admin statistics dashboard showing platform metrics and real-time data
- Integrated admin access controls preventing regular users from accessing admin features
- Created admin API endpoints for all major platform data management operations

### Advanced Admin Dashboard Features (July 14, 2025)
- Built comprehensive content creation system with professional forms for blogs, workshops, courses, and campaigns
- Added detailed user management with admin status controls and user deletion capabilities
- Created advanced inquiry management system with full contact details and email response integration
- Implemented tabbed navigation system with Overview, Users, Content, Workshops, Courses, Campaigns, and Inquiries sections
- Added real-time data validation and error handling for all admin operations
- Created detailed modal dialogs for viewing complete user profiles and inquiry details
- Built efficient table views with search, sorting, and action controls for all data management
- Integrated toast notifications for successful operations and error feedback
- Added comprehensive form validation using Zod schemas for data integrity
- Created responsive design optimized for admin workflows and efficiency

### Blog Content and UI Enhancement (July 14, 2025)
- Successfully populated blog database with 10 comprehensive educational posts
- Added scientific content covering stellar evolution, quantum mechanics, black holes, and exoplanets
- Created educational content by authors including Salik Riyaz (founder) and contributing writers
- Removed all dummy face images and replaced with elegant initial-based avatars
- Implemented space-themed color-coded avatar system for better visual consistency
- Enhanced blog UI with professional avatar display matching platform aesthetics
- Fixed blog post text colors to white for better visibility against black background
- Made "Read More" buttons functional with navigation to individual blog post pages

### Comprehensive Contact Information Enhancement (July 14, 2025)
- Added department-specific contact directory to Contact page with 7 specialized emails
- Enhanced Footer with organized contact links for different departments
- Updated Workshops pages with direct workshops@zoonigia.com email integration
- Added dedicated contact sections to Campaigns page with campaigns@zoonigia.com
- Implemented Schools page partnership contact with outreach@zoonigia.com
- Created standardized contact system across all pages for better user experience
- Added clickable phone and email buttons throughout the platform
- Integrated contact information: info@, help@, workshops@, campaigns@, outreach@, office@, founder@zoonigia.com

### Replit User Authentication System (July 14, 2025)
- **COMPLETED**: Implemented complete Replit OpenID Connect authentication system
- **COMPLETED**: Added user session management with PostgreSQL session storage
- **COMPLETED**: Created authentication hooks (useAuth) for frontend state management
- **COMPLETED**: Added Landing page for logged-out users with space-themed design
- **COMPLETED**: Updated Navigation component with user avatar, dropdown menu, and login/logout functionality
- **COMPLETED**: Added authentication middleware for protected routes
- **COMPLETED**: Integrated auth flow: logged-out users see Landing page, logged-in users access full platform
- **COMPLETED**: Added user profile display with avatar support and fallback initials
- **COMPLETED**: Implemented responsive mobile authentication menu
- **COMPLETED**: Authentication system fully functional with Replit OpenID Connect
- **COMPLETED**: Admin dashboard accessible only to authenticated admin users
- **COMPLETED**: Session management with proper database storage and security

### Campaign Payment System Enhancement
- Connected Campaigns page to dynamic database data
- Added Zoonigia Asteroid Search Campaign with ₹300 individual enrollment
- Implemented complete registration dialog with payment processing
- Added campaign enrollment API endpoints with database integration
- Set campaign timeline: Aug 17 - Nov 23, 2025 with "Registration Open" status
- Removed all hardcoded campaign statistics for cleaner presentation

### Workshop Page Enhancements
- Added "Ultimate Workshop Experience" header clarifying all activities are delivered in a single comprehensive session
- Added Campus/Community workshop type selection in registration form
- Added comprehensive revenue sharing section highlighting 10-20% school partnerships
- Enhanced workshop registration form with improved user experience

### Schools Page Complete Redesign
- Transformed from workshop-focused to comprehensive educational partnership platform
- Added four main service categories:
  - Workshop Registration (with revenue sharing)
  - Programme Integration (curriculum support)
  - Teacher Training (professional development)
  - Course Integration (structured learning programs)
- Added Student Research Programme section with detailed research areas and benefits
- Removed workshop type selection from partnership inquiry form
- Updated partnership inquiry checklist to reflect comprehensive services
- Removed numerical statistics/targets to focus on partnership benefits
- Enhanced visual design with better service categorization and clear value propositions

## User Preferences

Preferred communication style: Simple, everyday language.
Preferred content approach: Avoid repetitive phrasing across pages; use varied, elegant language instead of overloading the website with the same interdisciplinary messaging everywhere.
Project state: Restored to July 15th, 2025 state with cosmic background animation and orbiting planet feature.

## System Architecture

### Full-Stack Architecture
- **Framework**: React 18+ with TypeScript (Frontend) + Node.js Express (Backend)
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Shadcn/ui with Radix UI components
- **Styling**: Tailwind CSS with custom space-themed design system
- **Routing**: Wouter for client-side routing
- **State Management**: React Query (TanStack Query) for server state management
- **Form Handling**: React Hook Form with Zod validation
- **3D Graphics**: Three.js with React Three Fiber for immersive space visualizations
- **Authentication**: Replit OpenID Connect with PostgreSQL session storage
- **Database**: PostgreSQL with Neon serverless database
- **ORM**: Drizzle ORM with type-safe queries

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