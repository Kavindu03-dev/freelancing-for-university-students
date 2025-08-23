# Signup Backend System

This document explains the complete backend system for user registration in FlexiHire.

## User Types Supported

### 1. Student (`student`)
- **Required Fields**: firstName, lastName, email, password, userType, agreeToTerms, degreeProgram, university
- **Optional Fields**: phoneNumber, dateOfBirth, address, gpa, technicalSkills, graduationYear, agreeToMarketing

### 2. Job Seeker (`jobSeeker`)
- **Required Fields**: firstName, lastName, email, password, userType, agreeToTerms, organization
- **Optional Fields**: phoneNumber, dateOfBirth, address, jobTitle, contactPhone, projectCategories, companySize, industry, website, companyDescription, agreeToMarketing

### 3. University Staff (`universityStaff`)
- **Required Fields**: firstName, lastName, email, password, userType, agreeToTerms, staffRole, department
- **Optional Fields**: phoneNumber, dateOfBirth, address, employeeId, experience, qualification, professionalSummary, agreeToMarketing

## API Endpoints

### POST `/api/auth/signup`
**User Registration**

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "userType": "student",
  "agreeToTerms": true,
  "agreeToMarketing": false,
  
  // Student-specific fields
  "degreeProgram": "Computer Science",
  "university": "University of Colombo",
  "gpa": "3.8",
  "technicalSkills": ["React", "Node.js"],
  "graduationYear": "2025",
  
  // Common optional fields
  "phoneNumber": "+94-11-123-4567",
  "dateOfBirth": "2000-05-15",
  "address": "Colombo, Sri Lanka"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "user_id_here",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "userType": "student",
    "phoneNumber": "+94-11-123-4567",
    "dateOfBirth": "2000-05-15",
    "address": "Colombo, Sri Lanka",
    "isVerified": false,
    "agreeToTerms": true,
    "agreeToMarketing": false,
    "token": "jwt_token_here"
  }
}
```

### POST `/api/auth/login`
**User Login**

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
    "_id": "user_id_here",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "userType": "student",
    "phoneNumber": "+94-11-123-4567",
    "dateOfBirth": "2000-05-15",
    "address": "Colombo, Sri Lanka",
    "isVerified": false,
    "agreeToTerms": true,
    "agreeToMarketing": false,
    "token": "jwt_token_here",
    
    // Student-specific fields
    "degreeProgram": "Computer Science",
    "university": "University of Colombo",
    "gpa": "3.8",
    "technicalSkills": ["React", "Node.js"],
    "graduationYear": "2025"
  }
}
```

## Database Schema

### User Collection
```javascript
{
  // Common fields
  _id: ObjectId,
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  userType: String (required, enum: ['student', 'jobSeeker', 'universityStaff']),
  phoneNumber: String,
  dateOfBirth: String,
  address: String,
  isVerified: Boolean (default: false),
  agreeToTerms: Boolean (required, default: false),
  agreeToMarketing: Boolean (default: false),
  
  // Student fields
  degreeProgram: String,
  university: String,
  gpa: String,
  technicalSkills: [String],
  graduationYear: String,
  
  // Job Seeker fields
  organization: String,
  jobTitle: String,
  contactPhone: String,
  projectCategories: [String],
  companySize: String,
  industry: String,
  website: String,
  companyDescription: String,
  
  // University Staff fields
  staffRole: String,
  department: String,
  employeeId: String,
  experience: String,
  qualification: String,
  professionalSummary: String,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

## Setup Instructions

### 1. Environment Variables
Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/flexihire
JWT_SECRET=your_jwt_secret_key_here
```

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Seed the Database
```bash
# Create admin user
npm run seed:admin

# Create test users (student, job seeker, staff)
npm run seed:users
```

### 4. Start the Server
```bash
npm run dev
```

## Test Credentials

### Admin User
- **Email**: `admin@flexihire.com`
- **Password**: `admin123`

### Student User
- **Email**: `student@university.edu`
- **Password**: `password123`

### Job Seeker User
- **Email**: `client@company.com`
- **Password**: `password123`

### University Staff User
- **Email**: `staff@university.edu`
- **Password**: `password123`

## Validation Rules

### Password Requirements
- Minimum 8 characters
- No maximum limit

### Required Fields by User Type
- **All Users**: firstName, lastName, email, password, userType, agreeToTerms
- **Students**: degreeProgram, university
- **Job Seekers**: organization
- **University Staff**: staffRole, department

### Email Validation
- Must be unique across all users
- Standard email format validation
- Automatically converted to lowercase

## Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Tokens**: Secure authentication tokens
- **Input Validation**: Comprehensive field validation
- **Unique Constraints**: Email uniqueness enforced
- **Data Sanitization**: Automatic trimming and formatting

## Error Handling

### Common Error Responses
```json
{
  "success": false,
  "message": "Error description here"
}
```

### HTTP Status Codes
- **200**: Success
- **201**: Created (User registered)
- **400**: Bad Request (Validation errors)
- **401**: Unauthorized (Invalid credentials)
- **500**: Internal Server Error

## Testing

### Test the Signup API
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "password123",
    "userType": "student",
    "agreeToTerms": true,
    "degreeProgram": "Computer Science",
    "university": "University of Colombo"
  }'
```

### Test the Login API
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Frontend Integration

The backend is designed to work seamlessly with the existing signup form. The frontend should:

1. **Send Data**: Include all required fields based on user type
2. **Handle Response**: Process success/error responses appropriately
3. **Store Token**: Save JWT token for authenticated requests
4. **Redirect**: Navigate to appropriate dashboard based on userType

## Future Enhancements

- **Email Verification**: Send verification emails to new users
- **Password Reset**: Allow users to reset forgotten passwords
- **Profile Updates**: Enable users to update their profiles
- **File Uploads**: Support for CV/resume uploads
- **Social Login**: Integration with Google, Facebook, etc.
- **Two-Factor Authentication**: Enhanced security for admin users

