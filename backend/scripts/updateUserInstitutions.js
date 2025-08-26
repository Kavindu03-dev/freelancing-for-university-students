import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const updateUserInstitutions = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all users
    const users = await User.find({});
    
    console.log(`\nTotal users found: ${users.length}`);
    console.log('\n=== Updating User Institution Information ===\n');

    let updatedCount = 0;
    let skippedCount = 0;

    for (const user of users) {
      let needsUpdate = false;
      let updateData = {};

      // Check freelancers without university
      if (user.userType === 'freelancer' && (!user.university || user.university.trim() === '')) {
        updateData.university = 'University Information Pending';
        needsUpdate = true;
        console.log(`Freelancer ${user.firstName} ${user.lastName}: Setting university to "University Information Pending"`);
      }

      // Check clients without organization
      if (user.userType === 'client' && (!user.organization || user.organization.trim() === '')) {
        updateData.organization = 'Organization Information Pending';
        needsUpdate = true;
        console.log(`Client ${user.firstName} ${user.lastName}: Setting organization to "Organization Information Pending"`);
      }

      // Check university staff without department
      if (user.userType === 'universityStaff' && (!user.department || user.department.trim() === '')) {
        updateData.department = 'Department Information Pending';
        needsUpdate = true;
        console.log(`University Staff ${user.firstName} ${user.lastName}: Setting department to "Department Information Pending"`);
      }

      if (needsUpdate) {
        try {
          await User.findByIdAndUpdate(user._id, updateData);
          updatedCount++;
        } catch (error) {
          console.error(`Error updating user ${user._id}:`, error.message);
        }
      } else {
        skippedCount++;
      }
    }

    console.log('\n=== Update Summary ===');
    console.log(`Users updated: ${updatedCount}`);
    console.log(`Users skipped (already have institution info): ${skippedCount}`);

    // Verify the updates
    console.log('\n=== Verification ===');
    const freelancersWithoutUniversity = await User.countDocuments({ 
      userType: 'freelancer', 
      $or: [{ university: { $exists: false } }, { university: '' }, { university: null }] 
    });
    const clientsWithoutOrganization = await User.countDocuments({ 
      userType: 'client', 
      $or: [{ organization: { $exists: false } }, { organization: '' }, { organization: null }] 
    });
    const staffWithoutDepartment = await User.countDocuments({ 
      userType: 'universityStaff', 
      $or: [{ department: { $exists: false } }, { department: '' }, { department: null }] 
    });

    console.log(`Freelancers without university: ${freelancersWithoutUniversity}`);
    console.log(`Clients without organization: ${clientsWithoutOrganization}`);
    console.log(`University staff without department: ${staffWithoutDepartment}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateUserInstitutions();
