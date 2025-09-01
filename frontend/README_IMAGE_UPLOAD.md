# Image Upload Setup for Job Posts

This document explains how to set up image upload functionality for job posts using ImgBB.

## Setup Instructions

### 1. Get ImgBB API Key

1. Go to [https://api.imgbb.com/](https://api.imgbb.com/)
2. Sign up for a free account
3. Get your API key from the dashboard

### 2. Configure Environment Variable

Create a `.env` file in the frontend directory with:

```bash
VITE_IMGBB_API_KEY=your_actual_api_key_here
```

### 3. Restart Development Server

After adding the environment variable, restart your React development server:

```bash
npm start
```

## Features

- **Multiple Image Upload**: Clients can upload multiple images when creating job posts
- **Image Preview**: Shows uploaded images with option to remove them
- **Automatic Storage**: Images are automatically uploaded to ImgBB and URLs are stored in the database
- **Display**: Images are displayed on the ServicesPage for all users to see

## How It Works

1. Client selects images when creating a job post
2. Images are uploaded to ImgBB via their API
3. Image URLs and metadata are stored in the database
4. Images are displayed on the ServicesPage for all users
5. Images support slideshow, grid, and masonry views

## File Structure

- `frontend/src/pages/ClientDashboard.jsx` - Image upload form
- `frontend/src/pages/ServicesPage.jsx` - Image display
- `backend/models/Post.js` - Database schema for images
- `backend/controllers/postController.js` - Backend API for handling images

## Troubleshooting

- **Images not uploading**: Check your ImgBB API key in the .env file
- **Images not displaying**: Ensure the backend is running and the Post model has been updated
- **API errors**: Check the browser console for detailed error messages
