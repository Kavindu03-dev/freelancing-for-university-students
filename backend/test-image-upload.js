// Test script for image upload functionality
import dotenv from 'dotenv';
import { uploadToImgBB, cleanupTempFile } from './middleware/imgbbUpload.js';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

const testImageUpload = async () => {
  console.log('=== Testing Image Upload ===');
  console.log('IMGBB_API_KEY:', process.env.IMGBB_API_KEY ? 'Set' : 'NOT SET');
  console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'NOT SET');
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'NOT SET');
  
  if (!process.env.IMGBB_API_KEY) {
    console.error('❌ IMGBB_API_KEY is not set in .env file');
    console.log('Please create a .env file with your ImgBB API key');
    return;
  }
  
  // Create a test image file (simple text file for testing)
  const testImagePath = path.join('uploads', 'test', 'test-image.jpg');
  
  // Ensure directory exists
  const testDir = path.dirname(testImagePath);
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }
  
  // Create a simple test image (this is just for testing the API connection)
  const testImageContent = 'This is a test image content';
  fs.writeFileSync(testImagePath, testImageContent);
  
  try {
    console.log('📤 Testing ImgBB upload...');
    const result = await uploadToImgBB(testImagePath, process.env.IMGBB_API_KEY);
    console.log('✅ Upload successful:', result);
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
  } finally {
    // Clean up test file
    cleanupTempFile(testImagePath);
  }
};

// Run the test
testImageUpload().catch(console.error);
