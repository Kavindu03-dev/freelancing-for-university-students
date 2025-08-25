# ImgBB Integration Setup Guide

This guide explains how to set up ImgBB for profile image uploads in your freelancing platform.

## What is ImgBB?

ImgBB is a free image hosting service that allows you to upload images and get direct links to them. It's perfect for storing profile pictures and other user-uploaded images without using your own server storage.

## Setup Steps

### 1. Get ImgBB API Key

1. Go to [ImgBB.com](https://imgbb.com/)
2. Create a free account or log in
3. Go to your account settings
4. Look for "API Key" or "Developer" section
5. Generate a new API key
6. Copy the API key

### 2. Create Environment File

Create a `.env` file in your backend directory with the following content:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/flexihire

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# ImgBB API Configuration
IMGBB_API_KEY=your_actual_imgbb_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

**Important:** Replace `your_actual_imgbb_api_key_here` with the API key you got from ImgBB.

### 3. Install Dependencies

The required dependencies are already installed:
- `form-data` - For creating multipart form data
- `node-fetch` - For making HTTP requests to ImgBB API
- `multer` - For handling file uploads

### 4. How It Works

1. **Frontend**: User selects an image file
2. **Backend**: Receives the file via Multer middleware
3. **ImgBB Upload**: File is temporarily stored and then uploaded to ImgBB
4. **Database Update**: ImgBB returns image URLs which are stored in the user's profile
5. **Cleanup**: Temporary files are automatically deleted

### 5. API Endpoints

#### Upload Profile Image
- **POST** `/api/freelancer/profile-image`
- **POST** `/api/users/profile-image`
- **Body**: Form data with `profileImage` field
- **Headers**: `Authorization: Bearer <token>`

#### Response Format
```json
{
  "success": true,
  "message": "Profile image uploaded successfully",
  "data": {
    "profileImage": {
      "url": "https://i.ibb.co/...",
      "deleteUrl": "https://ibb.co/...",
      "uploadedAt": "2024-01-24T..."
    }
  }
}
```

### 6. File Types Supported

- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

### 7. File Size Limits

- Maximum file size: 5MB
- Files are automatically validated on both frontend and backend

### 8. Security Features

- File type validation
- File size validation
- Authentication required for uploads
- Temporary file cleanup
- User authorization checks

### 9. Troubleshooting

#### Common Issues

1. **"ImgBB API key not configured"**
   - Check your `.env` file
   - Ensure `IMGBB_API_KEY` is set correctly
   - Restart your server after changing `.env`

2. **"Invalid file type"**
   - Only image files are allowed
   - Check file extension and MIME type

3. **"File size too large"**
   - Maximum file size is 5MB
   - Compress your image or choose a smaller file

4. **Upload fails**
   - Check your internet connection
   - Verify ImgBB service is available
   - Check browser console for errors

#### Debug Mode

The frontend includes debug information in development mode. Check the browser console for:
- API response details
- File validation results
- Upload progress

### 10. Cost and Limitations

- **ImgBB Free Plan**: 
  - 32MB per image
  - Unlimited uploads
  - No account required for basic usage
  - Images may be deleted after 90 days of inactivity

- **ImgBB Pro Plan** ($5/month):
  - 32MB per image
  - Unlimited uploads
  - Images never expire
  - Priority support

### 11. Alternative Services

If you prefer different image hosting services, you can modify the `imgbbUpload.js` middleware:

- **Cloudinary** - More features, generous free tier
- **AWS S3** - Enterprise-grade, pay-per-use
- **Firebase Storage** - Google's solution, good free tier
- **Supabase Storage** - Open source alternative

### 12. Testing

1. Start your backend server
2. Log in as a freelancer
3. Go to Profile tab
4. Try uploading different image types and sizes
5. Check that images appear in the profile header
6. Verify images persist after logout/login

### 13. Production Considerations

- Set up proper environment variables
- Consider image compression for better performance
- Implement image resizing for different display sizes
- Add error logging and monitoring
- Consider implementing image backup strategies

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check the backend server logs
3. Verify your ImgBB API key is valid
4. Ensure all dependencies are installed
5. Check file permissions for upload directories
