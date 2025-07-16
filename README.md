# Zoonigia - Frontier Sciences Discovery Platform

An innovative EdTech platform empowering future innovators through immersive frontier sciences exploration, connecting students, educators, and researchers worldwide.

## 🌌 Overview

Zoonigia serves as a comprehensive hub for frontier sciences education, offering:
- **Interactive Workshops** with VR experiences and telescope sessions
- **Structured Courses** in quantum mechanics, astrophysics, and AI
- **Research Campaigns** including asteroid searches and space missions
- **School Partnerships** with revenue-sharing programs
- **Expert Collaborations** with NASA, IASC, and leading scientists

## 🏗️ Architecture

This application uses a **separated frontend/backend architecture** for optimal deployment and scalability:

### Frontend (React + Vite)
- **Location**: `frontend/` directory
- **Deploy to**: Vercel
- **Technology**: React 18, TypeScript, Tailwind CSS, TanStack Query

### Backend (Express API)
- **Location**: `backend/` directory  
- **Deploy to**: Render
- **Technology**: Express.js, PostgreSQL, Google OAuth, Stripe

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Google OAuth credentials

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/zoonigia-web.git
   cd zoonigia-web
   ```

2. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Configure VITE_API_URL and VITE_STRIPE_PUBLIC_KEY
   npm run dev
   ```

3. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configure DATABASE_URL, Google OAuth, and Stripe secrets
   npm run dev
   ```

## 📚 Documentation

### Frontend Documentation
- [Frontend README](frontend/README.md) - Setup and development guide
- [Frontend Architecture](frontend/ARCHITECTURE.md) - Technical architecture
- [Frontend Deployment](frontend/DEPLOYMENT.md) - Vercel deployment guide

### Backend Documentation
- [Backend README](backend/README.md) - API server setup
- [Backend Architecture](backend/ARCHITECTURE.md) - System design
- [Backend Deployment](backend/DEPLOYMENT.md) - Render deployment guide

## 🌟 Key Features

### Educational Programs
- **Workshops**: Comprehensive sessions with telescope observations, VR experiences, and expert talks
- **Courses**: Structured learning paths with modules, lessons, and assessments
- **Campaigns**: Collaborative research projects with real scientific impact

### Platform Management
- **User Authentication**: Google OAuth integration with role-based access
- **Admin Dashboard**: Complete content management and user administration
- **Payment Processing**: Stripe integration for course enrollments and campaign participation

### Technical Excellence
- **Responsive Design**: Mobile-first approach with space-themed UI
- **Real-time Features**: Live notifications and collaborative tools
- **Performance**: Optimized builds, caching, and CDN distribution

## 🔧 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **TanStack Query** for efficient data fetching
- **Shadcn/ui** component library
- **Tailwind CSS** for styling

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** with Drizzle ORM
- **Google OAuth 2.0** authentication
- **Stripe** payment processing
- **Session-based** security

## 🌐 Deployment

### Production URLs
- **Frontend**: https://zoonigia.vercel.app
- **Backend**: https://zoonigia-backend.onrender.com

### Deployment Process
1. **Frontend**: Automatically deployed to Vercel on push to main
2. **Backend**: Automatically deployed to Render on push to main
3. **Database**: Migrations run automatically on deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the development setup instructions
4. Submit a pull request with detailed description

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🌟 Vision

Zoonigia represents the future of science education - where frontier sciences meet interactive learning, where students become researchers, and where the universe becomes accessible to all curious minds.

---

*Built with passion for space exploration and scientific discovery* 🚀