# Student Management System API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication Routes

### POST /api/auth/signup
**Register a new user**

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "userType": "freelancer",
  "skills": ["JavaScript", "React", "Node.js"],
  "bio": "Full-stack developer with 3 years of experience",
  "agreeToTerms": true,
  "agreeToMarketing": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "userType": "freelancer",
    "skills": ["JavaScript", "React", "Node.js"],
    "bio": "Full-stack developer with 3 years of experience",
    "agreeToTerms": true,
    "agreeToMarketing": false,
    "token": "jwt_token_here"
  }
}
```

### POST /api/auth/login
**Login user**

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "_id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "userType": "freelancer",
    "skills": ["JavaScript", "React", "Node.js"],
    "bio": "Full-stack developer with 3 years of experience",
    "agreeToTerms": true,
    "agreeToMarketing": false,
    "token": "jwt_token_here"
  }
}
```

---

## 👤 Student Profile Management

### GET /api/student/profile
**Get student profile (Protected)**

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "userType": "freelancer",
    "skills": ["JavaScript", "React", "Node.js"],
    "bio": "Full-stack developer with 3 years of experience",
    "hourlyRate": 45,
    "experience": "3 years of web development experience",
    "education": "Bachelor's in Computer Science",
    "category": "Web Development",
    "portfolio": [...],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### PUT /api/student/profile
**Update student profile (Protected)**

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "bio": "Updated bio information",
  "hourlyRate": 50,
  "experience": "4 years of experience",
  "education": "Master's in Computer Science",
  "category": "Web Development"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    // Updated user object
  }
}
```

---

## 🎯 Skills Management

### POST /api/student/skills
**Add a new skill (Protected)**

**Request Body:**
```json
{
  "skill": "Python"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Skill added successfully",
  "data": {
    "skills": ["JavaScript", "React", "Node.js", "Python"]
  }
}
```

### PUT /api/student/skills
**Update all skills (Protected)**

**Request Body:**
```json
{
  "skills": ["JavaScript", "React", "Node.js", "Python", "MongoDB"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Skills updated successfully",
  "data": {
    "skills": ["JavaScript", "React", "Node.js", "Python", "MongoDB"]
  }
}
```

### DELETE /api/student/skills/:skill
**Remove a skill (Protected)**

**Response:**
```json
{
  "success": true,
  "message": "Skill removed successfully",
  "data": {
    "skills": ["JavaScript", "React", "Node.js"]
  }
}
```

---

## 🖼️ Portfolio Management

### GET /api/student/portfolio
**Get portfolio items (Protected)**

**Response:**
```json
{
  "success": true,
  "data": {
    "portfolio": [
      {
        "_id": "portfolio_item_id",
        "title": "E-commerce Website",
        "description": "A full-stack e-commerce platform",
        "link": "https://example.com/project",
        "image": "https://example.com/image.jpg"
      }
    ]
  }
}
```

### POST /api/student/portfolio
**Add portfolio item (Protected)**

**Request Body:**
```json
{
  "title": "New Project",
  "description": "Project description here",
  "link": "https://example.com/project",
  "image": "https://example.com/image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Portfolio item added successfully",
  "data": {
    "portfolio": [...]
  }
}
```

### PUT /api/student/portfolio/:itemId
**Update portfolio item (Protected)**

**Request Body:**
```json
{
  "title": "Updated Project Title",
  "description": "Updated description",
  "link": "https://example.com/updated",
  "image": "https://example.com/updated.jpg"
}
```

### DELETE /api/student/portfolio/:itemId
**Remove portfolio item (Protected)**

---

## 👥 Freelancer Discovery (Public)

### GET /api/student/freelancers
**Get all freelancers with pagination and filtering**

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `skills`: Comma-separated skills to filter by
- `category`: Category to filter by

**Example:**
```
GET /api/student/freelancers?page=1&limit=5&skills=JavaScript,React&category=Web Development
```

**Response:**
```json
{
  "success": true,
  "data": {
    "freelancers": [
      {
        "_id": "user_id",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "userType": "freelancer",
        "skills": ["JavaScript", "React", "Node.js"],
        "bio": "Full-stack developer",
        "hourlyRate": 45,
        "category": "Web Development",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalFreelancers": 50,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

### GET /api/student/freelancers/:id
**Get specific freelancer profile (Public)**

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "userType": "freelancer",
    "skills": ["JavaScript", "React", "Node.js"],
    "bio": "Full-stack developer",
    "hourlyRate": 45,
    "experience": "3 years of experience",
    "education": "Bachelor's in Computer Science",
    "category": "Web Development",
    "portfolio": [...],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 📊 User Model Schema

```javascript
{
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ['client', 'freelancer'], required: true },
  skills: [{ type: String, trim: true }],
  bio: { type: String, trim: true, maxlength: 500 },
  hourlyRate: { type: Number, min: 0, default: 0 },
  experience: { type: String, trim: true, maxlength: 1000 },
  education: { type: String, trim: true, maxlength: 500 },
  category: { type: String, enum: ['Web Development', 'Mobile Development', 'Design', 'Writing', 'Marketing', 'Data Analysis', 'Other'] },
  portfolio: [{
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    link: { type: String, trim: true },
    image: { type: String, trim: true }
  }],
  agreeToTerms: { type: Boolean, required: true, default: false },
  agreeToMarketing: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}
```

---

## 🚨 Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (in development)"
}
```

**Common HTTP Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

---

## 🔒 Security Features

1. **JWT Authentication**: All protected routes require valid JWT tokens
2. **User Type Validation**: Freelancer-only endpoints check user type
3. **Input Validation**: All inputs are validated and sanitized
4. **Password Hashing**: Passwords are hashed using bcrypt
5. **CORS Enabled**: Cross-origin requests are supported
6. **Rate Limiting**: Built-in protection against abuse

---

## 🧪 Testing the API

### Using cURL:

**Signup:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "password123",
    "userType": "freelancer",
    "skills": ["JavaScript"],
    "bio": "Test bio",
    "agreeToTerms": true
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Get Profile (with token):**
```bash
curl -X GET http://localhost:5000/api/student/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## 📝 Notes

- All timestamps are in ISO 8601 format
- Skills are stored as arrays and can be filtered/searched
- Portfolio items support images and links
- The API supports pagination for large datasets
- Public endpoints don't require authentication
- Protected endpoints require valid JWT tokens
- User type validation ensures proper access control

