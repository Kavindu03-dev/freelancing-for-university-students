import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const checkUserUniversity = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all users
    const users = await User.find({}).select('firstName lastName userType university email');
    
    console.log(`\nTotal users: ${users.length}`);
    console.log('\n=== User University Field Analysis ===\n');

    let freelancers = 0;
    let clients = 0;
    let universityStaff = 0;
    let usersWithUniversity = 0;
    let usersWithoutUniversity = 0;

    users.forEach(user => {
      console.log(`User: ${user.firstName} ${user.lastName} (${user.email})`);
      console.log(`  Type: ${user.userType}`);
      console.log(`  University: ${user.university || 'NOT SET'}`);
      console.log('');

      // Count by user type
      if (user.userType === 'freelancer') {
        freelancers++;
      } else if (user.userType === 'client') {
        clients++;
      } else if (user.userType === 'universityStaff') {
        universityStaff++;
      }

      // Count university field status
      if (user.university && user.university.trim() !== '') {
        usersWithUniversity++;
      } else {
        usersWithoutUniversity++;
      }
    });

    console.log('\n=== Summary ===');
    console.log(`Freelancers: ${freelancers}`);
    console.log(`Clients: ${clients}`);
    console.log(`University Staff: ${universityStaff}`);
    console.log(`Users with university: ${usersWithUniversity}`);
    console.log(`Users without university: ${usersWithoutUniversity}`);

    // Show users without university by type
    console.log('\n=== Users Without University Field ===');
    users.forEach(user => {
      if (!user.university || user.university.trim() === '') {
        console.log(`${user.userType.toUpperCase()}: ${user.firstName} ${user.lastName} (${user.email})`);
      }
    });

    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkUserUniversity();
