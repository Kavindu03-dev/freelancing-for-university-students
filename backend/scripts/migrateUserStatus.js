import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const migrateUserStatus = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update all existing users to have status field
    // Set all users to 'active' by default
    const result = await User.updateMany(
      { status: { $exists: false } },
      { $set: { status: 'active' } }
    );

    console.log(`Updated ${result.modifiedCount} users with status field`);
    
    // Verify the migration
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const suspendedUsers = await User.countDocuments({ status: 'suspended' });
    
    console.log(`Total users: ${totalUsers}`);
    console.log(`Active users: ${activeUsers}`);
    console.log(`Suspended users: ${suspendedUsers}`);

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the migration
migrateUserStatus();
