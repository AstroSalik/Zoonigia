# 🚀 Zoonigia - Space Science & Astronomy Education Platform

A comprehensive full-stack educational platform for space science, astronomy, and technology education. Built with modern web technologies and designed for students, educators, and space enthusiasts.

## ✨ Features

### 🎓 Educational Content
- **Interactive Courses** - Space science, astronomy, quantum mechanics, robotics
- **Workshops** - Hands-on learning experiences
- **Research Campaigns** - Youth Ideathon and other competitions
- **Blog Posts** - Latest space science articles and updates

### 👥 User Management
- **Student Dashboard** - Track progress, view certificates, manage enrollments
- **Admin Portal** - Comprehensive analytics, content management, user oversight
- **Authentication** - Secure Firebase-based user authentication
- **Role-based Access** - Different permissions for students and administrators

### 💰 Payment & Commerce
- **Razorpay Integration** - Secure payment processing
- **Free & Paid Courses** - Flexible pricing options
- **Invoice Generation** - Automatic invoice creation and email delivery
- **Refund System** - Complete refund request and management system

### 📊 Analytics & Management
- **Advanced Analytics** - User engagement, course performance metrics
- **Data Export** - CSV/JSON export capabilities
- **Content Management** - Easy course, workshop, and campaign creation
- **User Management** - Comprehensive user administration tools

### 🎨 Modern UI/UX
- **Responsive Design** - Works on all devices
- **Glass Morphism** - Modern, elegant design language
- **Smooth Animations** - Engaging user interactions
- **Dark Theme** - Space-themed color scheme

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - Beautiful, accessible components
- **Framer Motion** - Smooth animations
- **React Query** - Data fetching and caching
- **Wouter** - Lightweight routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe server development
- **Drizzle ORM** - Type-safe database operations
- **PostgreSQL** - Robust relational database
- **Firebase Auth** - User authentication
- **Razorpay** - Payment processing

### Database
- **PostgreSQL** - Primary database
- **Drizzle ORM** - Type-safe database queries
- **Database Migrations** - Version-controlled schema changes

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Firebase project
- Razorpay account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/zoonigia-platform.git
   cd zoonigia-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/zoonigia
   FIREBASE_PROJECT_ID=your-firebase-project-id
   FIREBASE_PRIVATE_KEY=your-firebase-private-key
   FIREBASE_CLIENT_EMAIL=your-firebase-client-email
   RAZORPAY_KEY_ID=your-razorpay-key-id
   RAZORPAY_KEY_SECRET=your-razorpay-key-secret
   ```

4. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Website: http://localhost:5000
   - Admin Dashboard: http://localhost:5000/admin
   - User Dashboard: http://localhost:5000/dashboard

## 📁 Project Structure

```
zoonigia-platform/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   └── utils/          # Helper utilities
│   └── public/             # Static assets
├── server/                 # Backend Express application
│   ├── middleware/         # Express middleware
│   ├── jobs/              # Background jobs
│   └── routes.ts          # API routes
├── shared/                # Shared code between frontend and backend
│   └── schema.ts          # Database schemas and types
├── migrations/            # Database migration files
└── attached_assets/       # Images and media files
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open database studio

## 🌐 Deployment

### Firebase Hosting
1. Build the project: `npm run build`
2. Install Firebase CLI: `npm install -g firebase-tools`
3. Login: `firebase login`
4. Initialize: `firebase init hosting`
5. Deploy: `firebase deploy`

### Other Platforms
The application can be deployed to any platform that supports Node.js:
- Vercel
- Netlify
- Heroku
- DigitalOcean
- AWS

## 📚 API Documentation

### Authentication
- `POST /api/auth/sync-user` - Sync user data
- `GET /api/auth/user-by-email/:email` - Get user by email

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create new course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course
- `POST /api/courses/enroll` - Enroll in course

### Campaigns
- `GET /api/campaigns` - Get all campaigns
- `POST /api/campaigns` - Create new campaign
- `POST /api/campaigns/register` - Register for campaign

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/courses` - Get all courses (admin)
- `POST /api/admin/clear-data` - Clear test data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Salik Riyaz** - Lead Developer & Founder
- **Zoonigia Team** - Space Science Education Specialists

## 🌟 Acknowledgments

- Space science community for inspiration
- Open source contributors
- Educational technology pioneers

## 📞 Support

For support, email support@zoonigia.com or create an issue in this repository.

---

**Made with ❤️ for the future of space education** 🚀
