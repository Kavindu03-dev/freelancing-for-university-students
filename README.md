# Skills Management System


A comprehensive skills management system for the freelancing platform, allowing administrators to manage skills and displaying them in the public skills tab.

## Overview

This system provides:
- **Admin Dashboard**: A dedicated skills tab for administrators to add, edit, and manage skills
- **Public Display**: Skills are automatically displayed in the frontend skills tab
- **RESTful API**: Full CRUD operations for skills management
- **Database Integration**: MongoDB-based storage with Mongoose schemas

## Features

### Admin Features
- ✅ Add new skills with name, description, category, icon, average price, and popularity
- ✅ Edit existing skills
- ✅ Delete skills (soft delete)
- ✅ View all skills in a organized table
- ✅ Categorize skills by industry sectors

### Public Features
- ✅ View all available skills
- ✅ Skills grouped by category
- ✅ Display skill details including popularity and average pricing
- ✅ Responsive design for all devices

## Technical Implementation

### Backend (Node.js + Express + MongoDB)

#### Models
- **`Skill.js`**: Mongoose schema with fields:
  - `name`: Skill name (unique, required)
  - `description`: Detailed description
  - `category`: Skill category (e.g., Programming & Tech, Design & Creative)
  - `icon`: Emoji or icon representation
  - `avgPrice`: Average hourly rate
  - `popularity`: Popularity score (0-100)
  - `isActive`: Soft delete flag
  - `createdBy`: Admin reference
  - `timestamps`: Created/updated timestamps

#### Controllers
- **`skillController.js`**: Handles all skill-related operations:
  - `getAllSkills`: Retrieve all active skills
  - `getSkillsByCategory`: Get skills by specific category
  - `createSkill`: Add new skill (admin only)
  - `updateSkill`: Modify existing skill (admin only)
  - `deleteSkill`: Soft delete skill (admin only)
  - `getSkillStats`: Get skill statistics

#### Routes
- **`skills.js`**: API endpoints:
  - `GET /api/skills`: Public access to all skills
  - `GET /api/skills/category/:category`: Skills by category
  - `GET /api/skills/stats`: Skill statistics
  - `POST /api/skills`: Create skill (admin only)
  - `PUT /api/skills/:id`: Update skill (admin only)
  - `DELETE /api/skills/:id`: Delete skill (admin only)

#### Middleware
- **`authenticateAdmin`**: Protects admin-only routes
- **JWT-based authentication**: Secure admin operations

### Frontend (React)

#### Admin Dashboard
- **Skills Tab**: New tab in admin dashboard
- **Add Skill Modal**: Form for creating new skills
- **Skills Table**: Display all skills with edit/delete actions
- **Category Management**: Predefined skill categories

#### Public Skills Page
- **Dynamic Loading**: Fetches skills from API
- **Category Grouping**: Skills organized by category
- **Responsive Design**: Mobile-friendly layout
- **Loading States**: User feedback during data fetching

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Create .env file
   MONGODB_URI=mongodb://localhost:27017/freelancing-platform
   JWT_SECRET=your-secret-key
   ```

4. Seed the database:
   ```bash
   # Create admin user first
   node seedAdmin.js
   
   # Then seed skills
   node seedSkills.js
   ```

5. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Usage Guide

### For Administrators

1. **Access Admin Dashboard**
   - Login with admin credentials (admin@gmail.com / admin123)
   - Navigate to the "Skills" tab

2. **Add New Skill**
   - Click "Add New Skill" button
   - Fill in skill details:
     - Name: Unique skill identifier
     - Description: Detailed explanation
     - Category: Select from predefined options
     - Icon: Emoji representation
     - Average Price: Hourly rate
     - Popularity: Score from 0-100
   - Click "Add Skill" to save

3. **Manage Existing Skills**
   - View all skills in the table
   - Edit skills using the "Edit" button
   - Delete skills using the "Delete" button (soft delete)

### For Users

1. **View Skills**
   - Navigate to the "Skills" tab in the main navigation
   - Browse skills by category
   - View skill details and pricing information

## API Endpoints

### Public Endpoints
```
GET /api/skills              # Get all skills
GET /api/skills/category/:category  # Get skills by category
GET /api/skills/stats        # Get skill statistics
```

### Admin-Protected Endpoints
```
POST /api/skills             # Create new skill
PUT /api/skills/:id          # Update skill
DELETE /api/skills/:id       # Delete skill
```

## Data Flow

1. **Admin adds skill** → Backend validates → MongoDB stores → Frontend updates
2. **Public views skills** → Frontend fetches from API → Backend queries MongoDB → Returns skills data
3. **Skills displayed** → Grouped by category → Rendered in responsive grid

## Security Features

- **Admin Authentication**: JWT-based admin verification
- **Input Validation**: Server-side validation for all inputs
- **Soft Deletes**: Skills are marked inactive rather than permanently removed
- **CORS Protection**: Cross-origin request handling

## Future Enhancements

- **Skill Search**: Full-text search functionality
- **Skill Analytics**: Usage statistics and trends
- **Bulk Operations**: Import/export skills from CSV
- **Skill Recommendations**: AI-powered skill suggestions
- **Skill Verification**: Admin approval workflow for user-submitted skills

## Troubleshooting

### Common Issues

1. **Skills not loading**
   - Check if backend server is running
   - Verify MongoDB connection
   - Check browser console for errors

2. **Admin authentication fails**
   - Ensure admin user exists in database
   - Verify JWT_SECRET in environment
   - Check token expiration

3. **Database connection issues**
   - Verify MongoDB is running
   - Check connection string in .env
   - Ensure database exists

### Debug Mode

Enable debug logging by setting:
```bash
DEBUG=app:*
```

## Contributing

1. Follow the existing code structure
2. Use ES6 module syntax for new files
3. Maintain consistent error handling
4. Add appropriate validation and error messages
5. Test all endpoints before submitting

## License

This project is part of the Freelancing Platform for University Students.
