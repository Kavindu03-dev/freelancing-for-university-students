const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000/api';

// Test the signup endpoint
async function testSignup() {
  console.log('🧪 Testing Signup API...');
  
  try {
    const signupData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123',
      userType: 'student',
      agreeToTerms: true,
      degreeProgram: 'Computer Science',
      university: 'University of Colombo',
      phoneNumber: '+94-11-123-4567',
      technicalSkills: ['JavaScript', 'React']
    };

    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupData)
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Signup successful!');
      console.log('   User ID:', result.data._id);
      console.log('   Token:', result.data.token ? 'Generated' : 'Not generated');
      return result.data;
    } else {
      console.log('❌ Signup failed:', result.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Signup test error:', error.message);
    return null;
  }
}

// Test the login endpoint
async function testLogin(email, password) {
  console.log('\n🔐 Testing Login API...');
  
  try {
    const loginData = {
      email: email,
      password: password
    };

    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Login successful!');
      console.log('   User Type:', result.data.userType);
      console.log('   Name:', `${result.data.firstName} ${result.data.lastName}`);
      return result.data;
    } else {
      console.log('❌ Login failed:', result.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Login test error:', error.message);
    return null;
  }
}

// Test admin login
async function testAdminLogin() {
  console.log('\n👑 Testing Admin Login API...');
  
  try {
    const adminData = {
      email: 'admin@flexihire.com',
      password: 'admin123'
    };

    const response = await fetch(`${BASE_URL}/auth/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adminData)
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Admin login successful!');
      console.log('   Admin ID:', result.data._id);
      console.log('   Token:', result.data.token ? 'Generated' : 'Not generated');
      return result.data;
    } else {
      console.log('❌ Admin login failed:', result.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Admin login test error:', error.message);
    return null;
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting API Tests...\n');
  
  // Test signup
  const newUser = await testSignup();
  
  if (newUser) {
    // Test login with the new user
    await testLogin('test@example.com', 'password123');
  }
  
  // Test admin login
  await testAdminLogin();
  
  console.log('\n✨ API Tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testSignup, testLogin, testAdminLogin };

