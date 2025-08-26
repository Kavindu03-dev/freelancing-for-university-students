import mongoose from 'mongoose';
import Post from './models/Post.js';
import User from './models/User.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const samplePosts = [
  {
    title: "Website Redesign for E-commerce",
    type: "Project",
    category: "Web Development",
    budget: 800,
    deadline: new Date('2024-12-31'),
    location: "Remote",
    requiredSkills: ["React", "Node.js", "MongoDB"],
    degreeField: "Computer Science",
    description: "Redesign an existing e-commerce website with modern UI/UX",
    attachments: ["requirements.pdf", "design-mockup.png"],
    status: "Active",
    approvalStatus: "Pending",
    applications: 0,
    isActive: true
  },
  {
    title: "Logo Design for Startup",
    type: "Project",
    category: "Graphic Design",
    budget: 300,
    deadline: new Date('2024-11-30'),
    location: "Remote",
    requiredSkills: ["Adobe Illustrator", "Logo Design"],
    degreeField: "Graphic Design",
    description: "Create a modern logo for a tech startup",
    attachments: ["brand-guidelines.pdf"],
    status: "Active",
    approvalStatus: "Pending",
    applications: 0,
    isActive: true
  },
  {
    title: "Mobile App Development",
    type: "Project",
    category: "Mobile Development",
    budget: 1500,
    deadline: new Date('2025-01-15'),
    location: "Remote",
    requiredSkills: ["React Native", "Firebase", "API Integration"],
    degreeField: "Computer Science",
    description: "Develop a cross-platform mobile app for task management",
    attachments: ["app-requirements.pdf", "wireframes.pdf"],
    status: "Active",
    approvalStatus: "Pending",
    applications: 0,
    isActive: true
  },
  {
    title: "Content Writing for Blog",
    type: "Job",
    category: "Content Writing",
    budget: 200,
    deadline: new Date('2024-12-20'),
    location: "Remote",
    requiredSkills: ["Content Writing", "SEO", "Blog Writing"],
    degreeField: "English",
    description: "Write engaging blog posts about technology trends and innovations",
    attachments: ["blog-guidelines.pdf", "sample-posts.pdf"],
    status: "Active",
    approvalStatus: "Pending",
    applications: 0,
    isActive: true
  },
  {
    title: "Digital Marketing Campaign",
    type: "Project",
    category: "Digital Marketing",
    budget: 1200,
    deadline: new Date('2025-02-01'),
    location: "Remote",
    requiredSkills: ["Social Media Marketing", "Google Ads", "Analytics"],
    degreeField: "Marketing",
    description: "Create and manage a comprehensive digital marketing campaign for a startup",
    attachments: ["marketing-brief.pdf", "target-audience.pdf"],
    status: "Active",
    approvalStatus: "Pending",
    applications: 0,
    isActive: true
  }
];

const seedPosts = async () => {
  try {
    // Clear existing posts
    await Post.deleteMany({});
    console.log('Cleared existing posts');

    // Get a sample client user (you may need to adjust this based on your user data)
    const clientUser = await User.findOne({ userType: 'client' });
    
    if (!clientUser) {
      console.log('No client user found. Please create a client user first.');
      return;
    }

    // Add client information to posts
    const postsWithClient = samplePosts.map(post => ({
      ...post,
      clientId: clientUser._id,
      clientName: `${clientUser.firstName} ${clientUser.lastName}`,
      clientOrganization: clientUser.organization || ''
    }));

    // Insert sample posts
    const createdPosts = await Post.insertMany(postsWithClient);
    console.log(`Created ${createdPosts.length} sample posts`);

    // Display created posts
    createdPosts.forEach(post => {
      console.log(`- ${post.title} (${post.type}) - $${post.budget}`);
    });

    console.log('Posts seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding posts:', error);
    process.exit(1);
  }
};

// Run the seeding
seedPosts();
