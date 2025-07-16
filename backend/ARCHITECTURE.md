# Backend Architecture

## Overview
The Zoonigia backend is a Node.js/Express API server with Google OAuth authentication, PostgreSQL database, and comprehensive educational content management.

## Technology Decisions

### Express.js Framework
- **Why**: Mature, flexible, extensive ecosystem
- **Benefits**: Middleware support, REST API patterns, community support

### TypeScript
- **Why**: Type safety for backend development
- **Benefits**: Better IDE support, compile-time error detection, maintainable code

### PostgreSQL + Drizzle ORM
- **Why**: ACID compliance, complex queries, type-safe database operations
- **Benefits**: Data integrity, performance, schema migrations

### Google OAuth 2.0
- **Why**: Secure, industry-standard authentication
- **Benefits**: No password management, user trust, single sign-on

### Session-based Authentication
- **Why**: Server-side session management for security
- **Benefits**: Secure token storage, session invalidation, CSRF protection

## System Architecture

### Server Structure
```
backend/
├── server.ts           # Main server setup
├── routes.ts           # API route handlers
├── auth.ts             # Authentication middleware
├── storage.ts          # Database operations
├── db.ts               # Database connection
└── shared/             # Database schema
```

### Database Schema
- **Users**: Authentication and profile data
- **Workshops**: Educational workshop information
- **Courses**: Structured learning programs
- **Campaigns**: Research campaigns and participation
- **Blog Posts**: Educational content
- **Sessions**: User session management

## Authentication System

### Google OAuth Flow
1. User initiates login via `/auth/login`
2. Redirect to Google OAuth consent screen
3. Google redirects to `/auth/callback` with authorization code
4. Exchange code for access token and user info
5. Create/update user in database
6. Store session in PostgreSQL
7. Redirect user back to frontend

### Session Management
- **Store**: PostgreSQL session store
- **Security**: Encrypted session cookies
- **Expiration**: Configurable session timeout
- **CSRF**: Built-in protection

## API Design

### RESTful Endpoints
- **GET /api/auth/user** - Current user information
- **GET /api/workshops** - List workshops
- **POST /api/workshops** - Create workshop (admin)
- **GET /api/courses** - List courses
- **POST /api/courses** - Create course (admin)
- **GET /api/campaigns** - List campaigns
- **POST /api/campaigns** - Create campaign (admin)

### Response Format
```json
{
  "data": {...},
  "message": "Success",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

### Error Handling
```json
{
  "error": "Error description",
  "code": "ERROR_CODE",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

## Data Layer

### Storage Interface
```typescript
interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Content operations
  getWorkshops(): Promise<Workshop[]>;
  getCourses(): Promise<Course[]>;
  getCampaigns(): Promise<Campaign[]>;
  
  // Admin operations
  createWorkshop(workshop: InsertWorkshop): Promise<Workshop>;
  updateWorkshop(id: number, updates: Partial<Workshop>): Promise<Workshop>;
}
```

### Database Operations
- **Connection**: PostgreSQL connection pool
- **Queries**: Type-safe Drizzle ORM queries
- **Transactions**: ACID-compliant operations
- **Migrations**: Schema version management

## Security Implementation

### Authentication Security
- **OAuth 2.0**: Industry-standard authentication
- **Session Encryption**: Secure session storage
- **CSRF Protection**: Built-in Express middleware
- **Rate Limiting**: API request throttling

### Data Protection
- **Input Validation**: Zod schema validation
- **SQL Injection**: ORM-based query protection
- **XSS Prevention**: Content sanitization
- **HTTPS**: Secure transport layer

### CORS Configuration
```typescript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://zoonigia.vercel.app']
    : ['http://localhost:3000'],
  credentials: true
}));
```

## Performance Optimization

### Database Performance
- **Connection Pooling**: Efficient database connections
- **Query Optimization**: Indexed queries and relationships
- **Caching**: In-memory caching for frequently accessed data

### API Performance
- **Response Compression**: Gzip compression
- **Caching Headers**: Appropriate cache control
- **Async Operations**: Non-blocking I/O operations

## Error Handling

### Logging Strategy
- **Structured Logging**: JSON-formatted logs
- **Error Levels**: Debug, info, warn, error
- **Request Tracking**: Unique request IDs

### Error Response
```typescript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});
```

## Deployment Architecture

### Build Process
1. TypeScript compilation with esbuild
2. Bundle backend code to `dist/server.js`
3. Copy static assets and configuration
4. Environment variable validation

### Production Configuration
- **Node.js**: Runtime environment
- **PM2**: Process management (optional)
- **Nginx**: Reverse proxy (optional)
- **SSL**: HTTPS termination

## Monitoring and Observability

### Health Checks
- **Endpoint**: `/health`
- **Database**: Connection status
- **Dependencies**: External service status

### Metrics
- **Request/Response**: API performance metrics
- **Database**: Query performance and connection pool
- **Authentication**: Login success/failure rates

## Development Workflow

### Local Development
1. Start PostgreSQL database
2. Run database migrations
3. Start development server with hot reload
4. Test API endpoints

### Testing Strategy
- **Unit Tests**: Individual function testing
- **Integration Tests**: API endpoint testing
- **Database Tests**: Data persistence verification

## Future Considerations

### Scalability
- **Horizontal Scaling**: Load balancer configuration
- **Database Sharding**: Data distribution strategies
- **Microservices**: Service decomposition patterns

### Features
- **Real-time**: WebSocket implementation
- **Caching**: Redis integration
- **Queue System**: Background job processing
- **File Storage**: Cloud storage integration