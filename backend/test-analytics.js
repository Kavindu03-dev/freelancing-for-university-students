import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { getUniversityAnalytics, getFacultyAnalytics, getCategoryAnalytics } from './controllers/analyticsController.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Mock request and response objects
const createMockReqRes = (query = {}) => {
  const req = { query };
  const res = {
    json: (data) => {
      console.log('Response:', JSON.stringify(data, null, 2));
      return res;
    },
    status: (code) => {
      console.log('Status:', code);
      return res;
    }
  };
  return { req, res };
};

// Test analytics functions
const testAnalytics = async () => {
  try {
    console.log('Testing University Analytics...');
    const { req: req1, res: res1 } = createMockReqRes({ dateRange: '30' });
    await getUniversityAnalytics(req1, res1);

    console.log('\nTesting Faculty Analytics...');
    const { req: req2, res: res2 } = createMockReqRes({ dateRange: '30' });
    await getFacultyAnalytics(req2, res2);

    console.log('\nTesting Category Analytics...');
    const { req: req3, res: res3 } = createMockReqRes({ dateRange: '30' });
    await getCategoryAnalytics(req3, res3);

  } catch (error) {
    console.error('Test error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
};

// Run tests
connectDB().then(testAnalytics);
