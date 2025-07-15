# Zoonigia - Frontier Sciences Discovery Platform

## Overview

Zoonigia is a comprehensive full-stack web application designed to empower future innovators and explorers through immersive science discovery. The platform serves as a hub for frontier sciences exploration, connecting students, educators, schools, collaborators, and sponsors through various educational programs including workshops, courses, campaigns, and expert sessions.

## Recent Changes (July 2025)

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
- Implemented complete Replit OpenID Connect authentication system
- Added user session management with PostgreSQL session storage
- Created authentication hooks (useAuth) for frontend state management
- Added Landing page for logged-out users with space-themed design
- Updated Navigation component with user avatar, dropdown menu, and login/logout functionality
- Added authentication middleware for protected routes
- Integrated auth flow: logged-out users see Landing page, logged-in users access full platform
- Added user profile display with avatar support and fallback initials
- Implemented responsive mobile authentication menu

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