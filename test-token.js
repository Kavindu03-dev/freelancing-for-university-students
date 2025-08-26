// Test script to decode JWT token
// Run this in the browser console to test token decoding

function testTokenDecoding() {
  try {
    const token = localStorage.getItem('userToken');
    if (!token) {
      console.log('No token found');
      return;
    }
    
    console.log('=== Token Analysis ===');
    console.log('Full token:', token);
    
    const parts = token.split('.');
    console.log('Token parts count:', parts.length);
    console.log('Header:', parts[0]);
    console.log('Payload:', parts[1]);
    console.log('Signature:', parts[2]);
    
    // Decode payload
    const payload = JSON.parse(atob(parts[1]));
    console.log('Decoded payload:', payload);
    console.log('User ID from token:', payload.id);
    console.log('Token expiration:', new Date(payload.exp * 1000));
    
    // Compare with localStorage user data
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      console.log('User data from localStorage:', parsedUser);
      console.log('User ID from localStorage:', parsedUser._id);
      console.log('Are IDs the same?', payload.id === parsedUser._id);
    }
    
  } catch (error) {
    console.error('Error decoding token:', error);
  }
}

// Run the test
testTokenDecoding();
