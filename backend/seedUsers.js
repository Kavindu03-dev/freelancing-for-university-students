import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flexihire', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedUsers = async () => {
  try {
    // Check if users already exist
    const existingUsers = await User.find({});
    
    if (existingUsers.length > 0) {
      console.log('Users already exist!');
      console.log('Total users:', existingUsers.length);
      mongoose.connection.close();
      return;
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('password123', saltRounds);

    // Create test freelancer
    const freelancerUser = new User({
      firstName: 'John',
      lastName: 'Freelancer',
      email: 'freelancer@university.edu',
      password: hashedPassword,
      userType: 'freelancer',
      phoneNumber: '+94-11-123-4567',
      dateOfBirth: '2000-05-15',
      address: 'Colombo, Sri Lanka',
      degreeProgram: 'Computer Science',
      university: 'University of Colombo',
      gpa: '3.8',
      technicalSkills: ['React', 'Node.js', 'Python', 'JavaScript'],
      graduationYear: '2025',
      agreeToTerms: true,
      agreeToMarketing: false,
      isVerified: false
    });

    // Create test client
    const clientUser = new User({
      firstName: 'Jane',
      lastName: 'Client',
      email: 'client@company.com',
      password: hashedPassword,
      userType: 'client',
      phoneNumber: '+94-11-987-6543',
      dateOfBirth: '1985-08-22',
      address: 'Colombo, Sri Lanka',
      organization: 'Tech Corp',
      jobTitle: 'Project Manager',
      contactPhone: '+94-11-987-6543',
      projectCategories: ['Web Development', 'Mobile Development'],
      companySize: '50-100 employees',
      industry: 'Technology',
      website: 'https://techcorp.lk',
      companyDescription: 'Leading technology company in Sri Lanka',
      agreeToTerms: true,
      agreeToMarketing: true,
      isVerified: false
    });

    // Create test university staff
    const staffUser = new User({
      firstName: 'Dr. Michael',
      lastName: 'Professor',
      email: 'staff@university.edu',
      password: hashedPassword,
      userType: 'universityStaff',
      phoneNumber: '+94-11-456-7890',
      dateOfBirth: '1975-03-10',
      address: 'Peradeniya, Sri Lanka',
      staffRole: 'Professor',
      department: 'Computer Science',
      employeeId: 'EMP12345',
      experience: '15+ years in academia and research',
      qualification: 'PhD in Computer Science',
      professionalSummary: 'Experienced professor with expertise in software engineering and AI',
      agreeToTerms: true,
      agreeToMarketing: false,
      isVerified: true
    });

    // Save all users
    await Promise.all([
      freelancerUser.save(),
      clientUser.save(),
      staffUser.save()
    ]);
    
    console.log('✅ Test users created successfully!');
    console.log('\n📚 Freelancer User:');
    console.log('   Email: freelancer@university.edu');
    console.log('   Password: password123');
    console.log('   Type: Freelancer');
    
    console.log('\n💼 Client User:');
    console.log('   Email: client@company.com');
    console.log('   Password: password123');
    console.log('   Type: Client');
    
    console.log('\n👨‍🏫 University Staff User:');
    console.log('   Email: staff@university.edu');
    console.log('   Password: password123');
    console.log('   Type: University Staff');
    
    console.log('\n🔑 All users use the same password: password123');

  } catch (error) {
    console.error('❌ Error creating test users:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seed function
seedUsers();

