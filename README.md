# FlexiHire - Freelancing Platform for University Students

A comprehensive freelancing platform designed specifically for university students to connect with clients, showcase their skills, and gain real-world experience through freelance projects.

## 🌟 Overview

FlexiHire is a full-stack web application that bridges the gap between talented university students and clients seeking quality freelance services. The platform provides a secure, user-friendly environment for students to build their portfolios while helping clients find reliable young talent for their projects.

### Key Features

- **🔐 Multi-Role Authentication**: Support for Students, Freelancers, Clients, and Administrators
- **📋 Project Management**: Complete project lifecycle from posting to delivery
- **💬 Real-time Messaging**: Built-in messaging system for seamless communication
- **📊 Admin Dashboard**: Comprehensive admin panel for platform management
- **🎨 Modern UI/UX**: Responsive design with smooth animations and transitions
- **🔒 Secure Payments**: Integrated payment system with escrow protection
- **📱 Mobile-First**: Fully responsive design for all devices

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18 with Vite
- Tailwind CSS for styling
- React Router for navigation
- Axios for API communication
- JWT for authentication

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT authentication
- RESTful API design
- File upload handling (CVs, portfolios, images)

**Database:**
- MongoDB Atlas (cloud) or local MongoDB
- Collections: Users, Projects, Messages, Applications, Resources, etc.

## 📁 Project Structure

```
freelancing-for-university-students/
├── backend/
│   ├── controllers/          # Business logic controllers
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API route definitions
│   ├── middleware/          # Authentication & validation
│   ├── uploads/             # File storage (CVs, images)
│   ├── scripts/             # Database seeding scripts
│   └── server.js            # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Helper functions
│   │   └── assets/         # Static assets (images, icons)
│   ├── public/             # Public static files
│   └── index.html          # Main HTML template
└── README.md
```

## 🚀 Features

### For Students/Freelancers
- ✅ Create professional profiles with portfolio showcase
- ✅ Browse and apply for freelance projects
- ✅ Real-time messaging with clients
- ✅ Track application status and project progress
- ✅ Secure payment processing
- ✅ Build reputation through reviews and ratings

### For Clients
- ✅ Post projects with detailed requirements
- ✅ Browse freelancer profiles and portfolios
- ✅ Review applications and hire talent
- ✅ Manage project milestones and payments
- ✅ Rate and review completed work

### For Administrators
- ✅ User management and moderation
- ✅ Project oversight and dispute resolution
- ✅ Platform analytics and reporting
- ✅ Content management and announcements
- ✅ System configuration and maintenance

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn package manager
- Git

### Backend Setup

1. **Clone and navigate to backend:**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration:**
   Create `.env` file in backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/flexihire
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5000
   NODE_ENV=development
   ```

3. **Database Setup:**
   ```bash
   # Create admin user
   node scripts/seedAdmin.js

   # Seed sample data (optional)
   node scripts/seedUsers.js
   node scripts/seedPosts.js
   node scripts/seedResources.js
   ```

4. **Start Backend Server:**
   ```bash
   npm start
   # Server runs on http://localhost:5000
   ```

### Frontend Setup

1. **Navigate to frontend:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   # Frontend runs on http://localhost:5173
   ```

### Production Deployment

1. **Build Frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start Production Server:**
   ```bash
   cd backend
   npm start
   ```

## 📖 Usage Guide

### Getting Started

1. **Admin Setup:**
   - Login with admin credentials (admin@gmail.com / admin123)
   - Access admin dashboard at `/admin`

2. **User Registration:**
   - Students can register as freelancers
   - Clients can post projects
   - Choose appropriate user type during signup

3. **Project Workflow:**
   - Clients post projects with requirements
   - Freelancers browse and apply
   - Clients review applications and hire
   - Work completed through milestones
   - Secure payments via escrow

### Key Pages & Features

- **🏠 Home Page**: Platform overview with featured projects
- **👥 About Us**: Company mission and team information
- **💼 Services**: Browse available freelance services
- **📚 Resources**: Educational content and guides
- **📞 Contact**: Support and inquiry forms
- **👤 Profile**: User dashboard and settings
- **💬 Messages**: Real-time communication system

## 🔌 API Documentation

### Authentication Endpoints
```
POST /api/auth/register     # User registration
POST /api/auth/login        # User login
POST /api/auth/logout       # User logout
GET  /api/auth/profile      # Get user profile
```

### Project Management
```
GET    /api/projects        # Get all projects
POST   /api/projects        # Create new project
GET    /api/projects/:id    # Get project details
PUT    /api/projects/:id    # Update project
DELETE /api/projects/:id    # Delete project
```

### User Management
```
GET    /api/users           # Get all users (admin)
GET    /api/users/:id       # Get user profile
PUT    /api/users/:id       # Update user profile
DELETE /api/users/:id       # Delete user (admin)
```

### Messaging System
```
GET    /api/messages        # Get user messages
POST   /api/messages        # Send new message
PUT    /api/messages/:id    # Mark as read
DELETE /api/messages/:id    # Delete message
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Cross-origin request handling
- **Rate Limiting**: Protection against abuse
- **File Upload Security**: Secure file handling with validation

## 🎨 Design System

### Color Palette
- **Primary**: Yellow (#FCD34D) - Brand color
- **Secondary**: Green (#10B981) - Accent color
- **Background**: Gray variations (#F9FAFB, #F3F4F6)
- **Text**: Dark gray (#1F2937) and light gray (#6B7280)

### Typography
- **Primary Font**: System font stack
- **Headings**: Bold weights for hierarchy
- **Body Text**: Regular weight for readability

### Components
- **Buttons**: Consistent styling with hover effects
- **Cards**: Shadow and border variations
- **Forms**: Validation states and error handling
- **Navigation**: Responsive header with mobile menu

## 📊 Database Schema

### Core Collections

**Users:**
```javascript
{
  name: String,
  email: String,
  password: String,
  role: ['student', 'freelancer', 'client', 'admin'],
  profile: {
    avatar: String,
    bio: String,
    skills: [String],
    portfolio: [String]
  },
  isVerified: Boolean,
  createdAt: Date
}
```

**Projects:**
```javascript
{
  title: String,
  description: String,
  budget: Number,
  category: String,
  status: ['open', 'in-progress', 'completed', 'cancelled'],
  clientId: ObjectId,
  freelancerId: ObjectId,
  applications: [ObjectId],
  createdAt: Date
}
```

**Messages:**
```javascript
{
  senderId: ObjectId,
  receiverId: ObjectId,
  content: String,
  projectId: ObjectId,
  isRead: Boolean,
  createdAt: Date
}
```

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Test Coverage
- Unit tests for utility functions
- Integration tests for API endpoints
- E2E tests for critical user flows

## 🚀 Deployment

### Environment Variables
```env
# Backend
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-production-secret
PORT=5000

# Frontend
VITE_API_URL=https://your-api-domain.com
```

### Docker Deployment
```dockerfile
# Build commands
docker build -t flexihire-backend .
docker build -t flexihire-frontend .

# Run containers
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Create Pull Request

### Development Guidelines
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Maintain code quality standards

## 📝 License

This project is developed for educational purposes as part of the Freelancing Platform for University Students initiative.

## 📞 Support

For support and questions:
- 📧 Email: support@flexihire.com
- 💬 Live Chat: Available on the platform
- 📱 Phone: +94 (11) 123-4567

## 🔄 Future Roadmap

- [ ] Mobile app development (React Native)
- [ ] Advanced AI-powered matching
- [ ] Video call integration
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Blockchain-based escrow system
- [ ] Integration with learning platforms

---

**Built with ❤️ for university students worldwide**
