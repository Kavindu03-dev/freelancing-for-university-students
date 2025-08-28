import multer from 'multer';
import path from 'path';
import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

// Configure storage for temporary file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/temp';
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const fileName = `profile-${uniqueSuffix}${fileExtension}`;
    cb(null, fileName);
  }
});

// File filter for allowed image types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, JPG, PNG, GIF, and WebP images are allowed.'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Function to upload image to ImgBB
export const uploadToImgBB = async (imagePath, apiKey) => {
  try {
    // Create form data
    const formData = new FormData();
    formData.append('image', fs.createReadStream(imagePath));
    
    // Upload to ImgBB
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`ImgBB API error: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(`ImgBB upload failed: ${result.error?.message || 'Unknown error'}`);
    }

    // Return the uploaded image data
    return {
      url: result.data.url,
      deleteUrl: result.data.delete_url,
      uploadedAt: new Date()
    };
  } catch (error) {
    console.error('ImgBB upload error:', error);
    throw error;
  }
};

// Function to clean up temporary file
export const cleanupTempFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('Temporary file cleaned up:', filePath);
    }
  } catch (error) {
    console.error('Error cleaning up temporary file:', error);
  }
};

export default upload;





