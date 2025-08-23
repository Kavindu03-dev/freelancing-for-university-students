// Authentication utility functions

export const logout = (navigate) => {
  try {
    // Clear all stored data
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminId');
    
    // Dispatch auth change event
    window.dispatchEvent(new Event('authStateChanged'));
    
    // Redirect to home page
    if (navigate) {
      navigate('/');
    } else {
      window.location.href = '/';
    }
    
  } catch (error) {
    console.error('❌ Error during logout:', error);
    // Fallback redirect
    window.location.href = '/';
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('userToken');
  const userData = localStorage.getItem('userData');
  return !!(token && userData);
};

export const isAdmin = () => {
  const adminLoggedIn = localStorage.getItem('adminLoggedIn');
  const adminEmail = localStorage.getItem('adminEmail');
  return !!(adminLoggedIn && adminEmail);
};

export const getUserData = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

export const getAuthToken = () => {
  return localStorage.getItem('userToken');
};

export const setAuthData = (token, userData) => {
  localStorage.setItem('userToken', token);
  localStorage.setItem('userData', JSON.stringify(userData));
  
  // Dispatch auth change event
  window.dispatchEvent(new Event('authStateChanged'));
};

