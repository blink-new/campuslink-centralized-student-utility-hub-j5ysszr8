# CampusLink Backend API

A comprehensive Node.js backend API for the CampusLink - Centralized Student Utility Hub. This backend provides all the necessary APIs to support the campus management system with features like announcements, complaints, user management, and more.

## 🚀 Features

### Core Features
- **Authentication & Authorization** - JWT-based authentication with role-based access control
- **User Management** - Student and staff profile management
- **Announcements** - Create, read, update, delete announcements with categories and priorities
- **Complaints System** - Submit and track complaints with status management
- **File Upload** - Support for file attachments in complaints and announcements
- **Real-time Features** - Bookmarking, read tracking, and response systems

### Security Features
- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt password encryption
- **Rate Limiting** - API rate limiting to prevent abuse
- **CORS Protection** - Cross-origin resource sharing configuration
- **Input Validation** - Comprehensive request validation
- **Error Handling** - Centralized error handling and logging

### Database Features
- **MongoDB Integration** - NoSQL database with Mongoose ODM
- **Data Validation** - Schema-based data validation
- **Indexing** - Optimized database queries with proper indexing
- **Virtual Fields** - Computed fields for better data presentation

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **MongoDB** (v5.0 or higher)
- **npm** or **yarn** package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd campus-link-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy the environment example file
   cp env.example .env
   
   # Edit the .env file with your configuration
   nano .env
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB (if not running as a service)
   mongod
   
   # Seed the database with initial data
   npm run seed
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/campus_link
MONGODB_URI_PROD=mongodb://localhost:27017/campus_link_prod

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-secret-key-change-this-in-production
JWT_REFRESH_EXPIRE=30d

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=CampusLink <your-email@gmail.com>

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
BCRYPT_ROUNDS=12
CORS_ORIGIN=http://localhost:5173

# Logging
LOG_LEVEL=info
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "student@sece.ac.in",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "prefix": "Mr",
  "userType": "student",
  "phone": "+91 9876543210",
  "department": "Computer Science Engineering",
  "rollNo": "20CS001",
  "year": "3rd Year",
  "section": "A",
  "accommodation": "Hostel",
  "block": "A Block",
  "roomNo": "A-201"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "student@sece.ac.in",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Announcements Endpoints

#### Get All Announcements
```http
GET /api/announcements?category=academic&priority=high&page=1&limit=10
Authorization: Bearer <token>
```

#### Create Announcement (Staff Only)
```http
POST /api/announcements
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Important Notice",
  "content": "This is an important announcement",
  "category": "academic",
  "priority": "high",
  "targetAudience": ["all", "students"],
  "isPinned": true
}
```

#### Toggle Bookmark
```http
POST /api/announcements/:id/bookmark
Authorization: Bearer <token>
```

### Complaints Endpoints

#### Submit Complaint (Students Only)
```http
POST /api/complaints
Authorization: Bearer <token>
Content-Type: application/json

{
  "category": "hostel",
  "subCategory": "Electrical",
  "priority": "high",
  "subject": "Power Outage",
  "description": "No power in my room",
  "location": "Block A, Room A-201"
}
```

#### Get Complaints
```http
GET /api/complaints?status=pending&category=hostel&page=1&limit=10
Authorization: Bearer <token>
```

#### Add Response to Complaint
```http
POST /api/complaints/:id/responses
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "We are working on this issue",
  "isInternal": false
}
```

### User Management Endpoints

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+91 9876543210",
  "bio": "Computer Science student"
}
```

#### Get All Users (Staff Only)
```http
GET /api/users?userType=student&department=Computer Science Engineering
Authorization: Bearer <token>
```

## 🗄️ Database Schema

### User Model
- Basic information (name, email, password)
- Role-based fields (student/staff specific)
- Authentication fields (tokens, verification)
- Profile preferences and statistics

### Announcement Model
- Content and metadata
- Categories and priorities
- Target audience filtering
- Read tracking and bookmarks
- Expiry and publishing controls

### Complaint Model
- Complaint details and categorization
- Status tracking and assignment
- Response system with internal notes
- Resolution tracking and ratings
- File attachments support

## 🔐 Security Features

### Authentication
- JWT-based authentication
- Refresh token mechanism
- Password hashing with bcrypt
- Token expiration handling

### Authorization
- Role-based access control (Student/Staff)
- Route-level permissions
- Resource ownership validation

### Input Validation
- Request body validation
- File upload validation
- SQL injection prevention
- XSS protection

### Rate Limiting
- API rate limiting
- IP-based restrictions
- Configurable limits

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Test Coverage
```bash
npm run test:coverage
```

## 📊 Database Seeding

The application includes a comprehensive seed script that creates:

- **Test Users**: Student, Staff, HOD, and Admin accounts
- **Sample Announcements**: Various categories and priorities
- **Test Complaints**: Different statuses and responses

### Run Seeding
```bash
npm run seed
```

### Test Credentials
After seeding, you can use these test accounts:

- **Student**: `student@sece.ac.in` / `student@123`
- **Staff**: `staff@sece.ac.in` / `staff@123`
- **HOD**: `hod@sece.ac.in` / `hod@123`
- **Admin**: `admin@sece.ac.in` / `admin@123`

## 🚀 Deployment

### Production Setup
1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set secure JWT secrets
4. Configure email settings
5. Set up proper CORS origins

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📝 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run seed` - Seed database with test data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation

## 🔄 Version History

- **v1.0.0** - Initial release with core features
- Authentication and user management
- Announcements system
- Complaints management
- Basic API structure

---

**CampusLink Backend** - Empowering campus management with modern technology. 