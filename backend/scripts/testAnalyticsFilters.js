import mongoose from 'mongoose';
import { getUniversityAnalytics, getFacultyAnalytics, getCategoryAnalytics } from '../controllers/analyticsController.js';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/freelancing-platform');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Mock req and res objects for testing
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

// Test analytics with different filters
const testAnalytics = async () => {
  console.log('🧪 Testing Analytics with Filters...\n');

  // Test 1: No filters
  console.log('📊 Test 1: No filters');
  const { req: req1, res: res1 } = createMockReqRes({ dateRange: '30' });
  await getUniversityAnalytics(req1, res1);
  console.log('\n' + '='.repeat(50) + '\n');

  // Test 2: With university filter
  console.log('📊 Test 2: With university filter');
  const { req: req2, res: res2 } = createMockReqRes({ 
    dateRange: '30', 
    university: 'University of Technology' 
  });
  await getUniversityAnalytics(req2, res2);
  console.log('\n' + '='.repeat(50) + '\n');

  // Test 3: With faculty filter
  console.log('📊 Test 3: With faculty filter');
  const { req: req3, res: res3 } = createMockReqRes({ 
    dateRange: '30', 
    faculty: 'Computer Science' 
  });
  await getFacultyAnalytics(req3, res3);
  console.log('\n' + '='.repeat(50) + '\n');

  // Test 4: With category filter
  console.log('📊 Test 4: With category filter');
  const { req: req4, res: res4 } = createMockReqRes({ 
    dateRange: '30', 
    category: 'Web Development' 
  });
  await getCategoryAnalytics(req4, res4);
  console.log('\n' + '='.repeat(50) + '\n');

  // Test 5: Multiple filters
  console.log('📊 Test 5: Multiple filters');
  const { req: req5, res: res5 } = createMockReqRes({ 
    dateRange: '30', 
    university: 'University of Technology',
    faculty: 'Computer Science',
    category: 'Web Development'
  });
  await getUniversityAnalytics(req5, res5);
  console.log('\n' + '='.repeat(50) + '\n');

  console.log('✅ Analytics filter tests completed!');
};

// Run the tests
const runTests = async () => {
  await connectDB();
  await testAnalytics();
  mongoose.connection.close();
  console.log('Database connection closed');
};

runTests().catch(console.error);

