import mongoose from 'mongoose';
import Skill from './models/Skill.js';
import Admin from './models/Admin.js';
import dotenv from 'dotenv';

dotenv.config();

const skillsData = [
  {
    name: 'React Development',
    description: 'Building modern web applications with React.js',
    category: 'Programming & Tech',
    icon: '⚛️',
    avgPrice: 45,
    popularity: 95,
    freelancers: 1250
  },
  {
    name: 'Node.js Backend',
    description: 'Server-side JavaScript development with Node.js',
    category: 'Programming & Tech',
    icon: '🟢',
    avgPrice: 50,
    popularity: 90,
    freelancers: 980
  },
  {
    name: 'UI/UX Design',
    description: 'Creating beautiful and functional user interfaces',
    category: 'Design & Creative',
    icon: '🎨',
    avgPrice: 55,
    popularity: 88,
    freelancers: 2100
  },
  {
    name: 'Digital Marketing',
    description: 'Strategic marketing campaigns for online businesses',
    category: 'Digital Marketing',
    icon: '📱',
    avgPrice: 40,
    popularity: 85,
    freelancers: 1100
  },
  {
    name: 'Content Writing',
    description: 'Engaging and SEO-optimized content creation',
    category: 'Writing & Translation',
    icon: '✍️',
    avgPrice: 35,
    popularity: 82,
    freelancers: 1800
  },
  {
    name: 'Video Editing',
    description: 'Professional video editing and post-production',
    category: 'Video & Animation',
    icon: '🎬',
    avgPrice: 60,
    popularity: 80,
    freelancers: 1100
  },
  {
    name: 'Data Analysis',
    description: 'Data insights and business intelligence',
    category: 'Data & Analytics',
    icon: '📊',
    avgPrice: 65,
    popularity: 78,
    freelancers: 850
  },
  {
    name: 'Business Consulting',
    description: 'Strategic business advice and planning',
    category: 'Business & Consulting',
    icon: '💼',
    avgPrice: 70,
    popularity: 75,
    freelancers: 650
  }
];

const seedSkills = async () => {
  try {
    // Connect to MongoDB using the same connection as the server
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Get admin user for createdBy field
    const admin = await Admin.findOne({ email: 'admin@gmail.com' });
    if (!admin) {
      throw new Error('Admin user not found. Please run seedAdmin.js first.');
    }
    console.log('Found admin user:', admin.email);

    // Clear existing skills
    await Skill.deleteMany({});
    console.log('Cleared existing skills');

    // Add createdBy field to each skill
    const skillsWithAdmin = skillsData.map(skill => ({
      ...skill,
      createdBy: admin._id
    }));

    // Insert new skills
    const result = await Skill.insertMany(skillsWithAdmin);
    console.log(`Successfully seeded ${result.length} skills`);

    // Display seeded skills
    console.log('\nSeeded skills:');
    result.forEach(skill => {
      console.log(`- ${skill.name} (${skill.category})`);
    });

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding skills:', error);
    process.exit(1);
  }
};

seedSkills();
