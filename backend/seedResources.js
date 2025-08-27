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

// Sample resources data
const sampleResources = [
  {
    title: 'Complete Guide to Starting Your Freelance Career',
    description: 'Everything you need to know to launch your freelancing journey successfully. From setting up your profile to landing your first client, this comprehensive guide covers all the essential steps.',
    category: 'Getting Started',
    type: 'Guide',
    readTime: '15 min',
    difficulty: 'Beginner',
    tags: ['freelancing', 'career', 'beginners', 'getting started'],
    featured: true,
    link: 'https://example.com/complete-freelance-guide'
  },
  {
    title: 'How to Write Winning Proposals',
    description: 'Master the art of proposal writing to win more clients and projects. Learn proven techniques for crafting compelling proposals that stand out from the competition.',
    category: 'Best Practices',
    type: 'Tutorial',
    readTime: '10 min',
    difficulty: 'Intermediate',
    tags: ['proposals', 'clients', 'writing', 'winning'],
    featured: true,
    link: 'https://example.com/winning-proposals-guide'
  },
  {
    title: 'Essential Tools Every Freelancer Needs',
    description: 'Discover the must-have tools and software to boost your productivity. From project management to time tracking, find the perfect tools for your workflow.',
    category: 'Tools & Software',
    type: 'Resource List',
    readTime: '8 min',
    difficulty: 'Beginner',
    tags: ['tools', 'productivity', 'software', 'essential'],
    featured: true,
    link: 'https://example.com/freelancer-tools'
  },
  {
    title: 'Setting Your Freelance Rates: A Comprehensive Guide',
    description: 'Learn how to price your services competitively while ensuring profitability. Understand different pricing models and strategies for different types of projects.',
    category: 'Pricing Strategies',
    type: 'Guide',
    readTime: '12 min',
    difficulty: 'Intermediate',
    tags: ['pricing', 'rates', 'business', 'profitability'],
    featured: false,
    link: 'https://example.com/freelance-pricing-guide'
  },
  {
    title: 'Building Long-term Client Relationships',
    description: 'Strategies for maintaining and growing your client base over time. Learn how to build trust, communicate effectively, and create lasting partnerships.',
    category: 'Client Management',
    type: 'Article',
    readTime: '7 min',
    difficulty: 'Intermediate',
    tags: ['clients', 'relationships', 'retention', 'communication'],
    featured: false,
    link: 'https://example.com/client-relationships'
  },
  {
    title: 'Freelance Contracts: What You Need to Know',
    description: 'Protect yourself and your business with proper legal documentation. Understand the essential elements of freelance contracts and when to use them.',
    category: 'Legal & Contracts',
    type: 'Legal Guide',
    readTime: '20 min',
    difficulty: 'Advanced',
    tags: ['contracts', 'legal', 'protection', 'business'],
    featured: false,
    link: 'https://example.com/freelance-contracts'
  },
  {
    title: 'Marketing Your Freelance Services Online',
    description: 'Effective strategies to promote your services and attract clients. Learn about social media marketing, content creation, and building an online presence.',
    category: 'Marketing',
    type: 'Strategy Guide',
    readTime: '14 min',
    difficulty: 'Intermediate',
    tags: ['marketing', 'promotion', 'online', 'social media'],
    featured: false,
    link: 'https://example.com/freelance-marketing'
  },
  {
    title: 'Time Management for Freelancers',
    description: 'Master your schedule and increase productivity with proven techniques. Learn how to balance multiple projects and maintain work-life balance.',
    category: 'Best Practices',
    type: 'Tutorial',
    readTime: '9 min',
    difficulty: 'Beginner',
    tags: ['time management', 'productivity', 'organization', 'balance'],
    featured: false,
    link: 'https://example.com/time-management-freelancers'
  },
  {
    title: 'Building Your Personal Brand as a Freelancer',
    description: 'Create a strong personal brand that attracts your ideal clients. Learn how to differentiate yourself and build credibility in your niche.',
    category: 'Marketing',
    type: 'Branding Guide',
    readTime: '16 min',
    difficulty: 'Intermediate',
    tags: ['branding', 'marketing', 'personal brand', 'credibility'],
    featured: false,
    link: 'https://example.com/personal-branding-freelancers'
  },
  {
    title: 'Scaling Your Freelance Business',
    description: 'Learn how to grow from solo freelancer to a successful agency. Understand the challenges and opportunities of scaling your freelance business.',
    category: 'Business Tips',
    type: 'Business Guide',
    readTime: '18 min',
    difficulty: 'Advanced',
    tags: ['scaling', 'business growth', 'agency', 'expansion'],
    featured: false,
    link: 'https://example.com/scaling-freelance-business'
  }
];

// Seed function
const seedResources = async () => {
  try {
    // Clear existing resources
    await Resource.deleteMany({});
    console.log('Cleared existing resources');

    // Get admin user ID from existing admin
    const adminUser = await mongoose.model('Admin').findOne({ email: 'admin@gmail.com' });
    if (!adminUser) {
      console.error('No admin user found. Please run seedAdmin.js first.');
      process.exit(1);
    }
    const adminId = adminUser._id;

    // Add admin ID to each resource
    const resourcesWithAdmin = sampleResources.map(resource => ({
      ...resource,
      createdBy: adminId
    }));

    // Insert resources
    const insertedResources = await Resource.insertMany(resourcesWithAdmin);
    console.log(`Successfully seeded ${insertedResources.length} resources`);

    // Display some stats
    const totalResources = await Resource.countDocuments();
    const featuredResources = await Resource.countDocuments({ featured: true });
    
    console.log('\nResource Statistics:');
    console.log(`Total Resources: ${totalResources}`);
    console.log(`Featured Resources: ${featuredResources}`);

    // Show category distribution
    const categoryStats = await Resource.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\nCategory Distribution:');
    categoryStats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} resources`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding resources:', error);
    process.exit(1);
  }
};

// Run the seed function
connectDB().then(() => {
  seedResources();
});
