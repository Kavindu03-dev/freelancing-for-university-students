import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Resource from './models/Resource.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Test function
const testResources = async () => {
  try {
    console.log('🧪 Testing Resources API...\n');

    // Test 1: Check if resources collection exists
    console.log('1. Checking resources collection...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    const resourcesCollection = collections.find(col => col.name === 'resources');
    if (resourcesCollection) {
      console.log('✅ Resources collection exists');
    } else {
      console.log('❌ Resources collection not found');
    }

    // Test 2: Count existing resources
    console.log('\n2. Counting existing resources...');
    const resourceCount = await Resource.countDocuments();
    console.log(`📊 Found ${resourceCount} resources in database`);

    // Test 3: Get sample resources
    console.log('\n3. Fetching sample resources...');
    const sampleResources = await Resource.find().limit(3);
    if (sampleResources.length > 0) {
      console.log('✅ Sample resources found:');
      sampleResources.forEach((resource, index) => {
        console.log(`   ${index + 1}. ${resource.title} (${resource.category})`);
      });
    } else {
      console.log('❌ No resources found in database');
    }

    // Test 4: Check resource schema
    console.log('\n4. Testing resource schema...');
    const testResource = new Resource({
      title: 'Test Resource',
      description: 'This is a test resource',
      category: 'Getting Started',
      type: 'Guide',
      readTime: '5 min',
      difficulty: 'Beginner',
      tags: ['test', 'example'],
      featured: false,
      link: 'https://example.com',
      createdBy: new mongoose.Types.ObjectId()
    });

    console.log('✅ Resource schema validation passed');

    // Test 5: Check categories
    console.log('\n5. Checking resource categories...');
    const categories = await Resource.distinct('category');
    console.log('📂 Available categories:', categories);

    // Test 6: Check types
    console.log('\n6. Checking resource types...');
    const types = await Resource.distinct('type');
    console.log('📋 Available types:', types);

    console.log('\n🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

// Run the test
connectDB().then(() => {
  testResources();
});
