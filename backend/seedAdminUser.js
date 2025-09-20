import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const seedAdminUser = async () => {
  try {
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@gmail.com', userType: 'admin' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists in User model!');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 User Type:', existingAdmin.userType);
      console.log('📅 Created at:', existingAdmin.createdAt);
      mongoose.connection.close();
      return;
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('admin123', saltRounds);

    // Create new admin user in User model
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@gmail.com',
      password: hashedPassword,
      userType: 'admin',
      agreeToTerms: true,
      isVerified: true,
      status: 'active'
    });

    // Save to database
    await adminUser.save();
    
    console.log('✅ Admin user created successfully in User model!');
    console.log('📧 Email: admin@gmail.com');
    console.log('🔑 Password: admin123');
    console.log('👤 User Type: admin');
    console.log('🆔 ID:', adminUser._id);
    console.log('📅 Created at:', adminUser.createdAt);

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seed function
seedAdminUser();
