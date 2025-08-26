# Skills Management System

This document describes the implementation of the skills management system for the freelancing platform.

## Overview

The skills management system allows administrators to:
- Add new skills with categories, descriptions, icons, and metadata
- View all skills in an organized table format
- Edit existing skills
- Delete skills (soft delete)
- Skills are automatically displayed in the frontend Skills page

## Backend Implementation

### 1. Skill Model (`backend/models/Skill.js`)
- **Fields:**
  - `name`: Skill name (unique, required)
  - `description`: Skill description (required)
  - `category`: Skill category (required)
  - `icon`: Emoji or icon representation (default: ⚡)
  - `freelancers`: Number of freelancers with this skill (default: 0)
  - `avgPrice`: Average hourly rate (default: 0)
  - `popularity`: Popularity score 0-100 (default: 0)
  - `isActive`: Soft delete flag (default: true)
  - `createdBy`: Admin who created the skill (required)

### 2. Skill Controller (`backend/controllers/skillController.js`)
- **Endpoints:**
  - `GET /api/skills` - Get all active skills
  - `GET /api/skills/category/:category` - Get skills by category
  - `POST /api/skills` - Create new skill (admin only)
  - `PUT /api/skills/:id` - Update skill (admin only)
  - `DELETE /api/skills/:id` - Soft delete skill (admin only)
  - `GET /api/skills/stats` - Get skill statistics

### 3. Skills Routes (`backend/routes/skills.js`)
- Public routes for viewing skills
- Protected routes for admin operations

## Frontend Implementation

### 1. Admin Dashboard (`frontend/src/pages/AdminDashboard.jsx`)
- **New Tab:** "Skills" tab added to admin navigation
- **Features:**
  - View all skills in a table format
  - Add new skills via modal form
  - Delete skills
  - Skills count display
  - Responsive design matching existing dashboard style

### 2. Skills Page (`frontend/src/pages/SkillsPage.jsx`)
- **Updated to:**
  - Fetch skills from backend API instead of hardcoded data
  - Display skills added through admin dashboard
  - Fallback to default data if API fails
  - Loading states for better UX

## Setup Instructions

### 1. Backend Setup
```bash
cd backend
npm install
```

### 2. Database Setup
Ensure MongoDB is running and update your `.env` file with:
```
MONGODB_URI=mongodb://localhost:27017/your-database-name
```

### 3. Seed Initial Data (Optional)
```bash
cd backend
node seedSkills.js
```

### 4. Start Backend Server
```bash
cd backend
npm start
```

### 5. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Usage

### Adding Skills as Admin
1. Navigate to Admin Dashboard
2. Click on "Skills" tab
3. Click "Add Skill" button
4. Fill in the form:
   - Skill Name (e.g., "React Development")
   - Description (e.g., "Modern JavaScript library for building UIs")
   - Category (select from dropdown)
   - Icon (emoji, e.g., "⚛️")
   - Popularity (0-100)
   - Average Price/Hour ($)
5. Click "Add Skill"

### Viewing Skills
- **Admin:** View in Admin Dashboard > Skills tab
- **Public:** View in Skills page (`/skills`)

## API Endpoints

### Public Endpoints
- `GET /api/skills` - Get all active skills
- `GET /api/skills/category/:category` - Get skills by category
- `GET /api/skills/stats` - Get skill statistics

### Admin Endpoints (Require Authentication)
- `POST /api/skills` - Create new skill
- `PUT /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Soft delete skill

## Data Flow

1. **Admin adds skill** → Backend API → Database
2. **Frontend Skills page** → Fetches from Backend API → Displays skills
3. **Real-time updates** → Skills appear immediately after admin adds them

## Features

- ✅ Add new skills with rich metadata
- ✅ Categorize skills for better organization
- ✅ Soft delete (skills are hidden but not permanently removed)
- ✅ Admin-only access for management
- ✅ Public access for viewing
- ✅ Responsive design
- ✅ Loading states and error handling
- ✅ Fallback data if API fails

## Future Enhancements

- Edit skill functionality
- Bulk import/export skills
- Skill analytics and reporting
- Skill popularity tracking
- Integration with freelancer profiles
- Advanced search and filtering

## Troubleshooting

### Common Issues
1. **Skills not appearing:** Check if backend server is running
2. **API errors:** Verify MongoDB connection and environment variables
3. **Admin access denied:** Ensure proper authentication middleware

### Debug Steps
1. Check browser console for errors
2. Verify backend server logs
3. Test API endpoints with Postman/Insomnia
4. Check MongoDB connection and data

## Security

- Admin-only routes are protected with authentication middleware
- Input validation on all fields
- Soft delete prevents data loss
- Rate limiting can be added for production use
