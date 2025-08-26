# Posts API Documentation

This document describes the Posts functionality that allows clients to create, manage, and track job/project posts.

## Overview

The Posts system enables clients to:
- Create job/project posts with detailed requirements
- Manage post status and updates
- Track applications and progress
- View post statistics and analytics

## Models

### Post Schema

```javascript
{
  title: String (required),
  type: String (enum: ['Job', 'Project', 'Internship', 'Freelance']),
  category: String (required),
  budget: Number (required, min: 0),
  deadline: Date (required),
  location: String (enum: ['Remote', 'On-site', 'Hybrid']),
  requiredSkills: [String],
  degreeField: String (required),
  description: String (required),
  attachments: [String],
  status: String (default: 'Active', enum: ['Active', 'In Progress', 'Completed', 'Cancelled', 'Expired']),
  applications: Number (default: 0),
  clientId: ObjectId (ref: 'User', required),
  clientName: String (required),
  clientOrganization: String,
  isActive: Boolean (default: true),
  timestamps: true
}
```

## API Endpoints

### Public Routes (No Authentication Required)

#### GET /api/posts
Get all active posts with optional filters
- Query parameters:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `category`: Filter by category
  - `type`: Filter by post type
  - `location`: Filter by location
  - `minBudget`: Minimum budget
  - `maxBudget`: Maximum budget
  - `status`: Filter by status
  - `search`: Search in title, description, or skills

#### GET /api/posts/:id
Get a single post by ID

### Protected Routes (Authentication Required)

#### POST /api/posts
Create a new post
- Body: Post data (see schema above)
- Headers: `Authorization: Bearer <token>`

#### GET /api/posts/client/:clientId
Get posts by specific client
- Query parameters:
  - `status`: Filter by status
  - `page`: Page number
  - `limit`: Items per page

#### GET /api/posts/client/:clientId/stats
Get post statistics for a client
- Returns: Total posts, active posts, completed posts, total budget, average budget, category breakdown

#### PUT /api/posts/:id
Update an existing post
- Body: Updated post data
- Headers: `Authorization: Bearer <token>`
- Note: Only the post owner can update

#### DELETE /api/posts/:id
Delete a post (soft delete)
- Headers: `Authorization: Bearer <token>`
- Note: Only the post owner can delete

## Usage Examples

### Creating a Post

```javascript
const response = await fetch('/api/posts', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: "Website Development",
    type: "Project",
    category: "Web Development",
    budget: 1000,
    deadline: "2024-12-31",
    location: "Remote",
    requiredSkills: "React, Node.js, MongoDB",
    degreeField: "Computer Science",
    description: "Develop a modern website with responsive design"
  })
});
```

### Fetching Client Posts

```javascript
const response = await fetch(`/api/posts/client/${clientId}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Updating a Post

```javascript
const response = await fetch(`/api/posts/${postId}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    budget: 1200,
    deadline: "2025-01-15"
  })
});
```

## Frontend Integration

The ClientDashboard component has been updated to:
- Fetch posts from the API on component mount
- Create new posts through the API
- Update existing posts
- Delete posts (soft delete)
- Display real-time statistics
- Show loading and error states

## Database Indexes

The Post model includes indexes for:
- `clientId` + `status` (for client post queries)
- `category` + `status` (for category filtering)
- `requiredSkills` (for skill-based searches)
- `createdAt` (for chronological sorting)

## Error Handling

All endpoints include proper error handling:
- Validation errors for required fields
- Authorization checks for protected operations
- Database error handling
- Consistent error response format

## Security Features

- Authentication required for create/update/delete operations
- Users can only modify their own posts
- Soft delete prevents data loss
- Input validation and sanitization

## Seeding Data

Use the `seedPosts.js` file to populate the database with sample posts:

```bash
node seedPosts.js
```

Note: Requires at least one client user to exist in the database.

## Future Enhancements

- Application tracking system
- Post analytics and reporting
- Advanced search and filtering
- Post templates and categories
- Integration with notification system
