// Authentication utility functions

export const logout = (navigate) => {
  // Clear all stored data
  localStorage.removeItem('userToken');
  localStorage.removeItem('userData');
  localStorage.removeItem('adminLoggedIn');
  localStorage.removeItem('adminUsername');
  
  // Redirect to home page
  if (navigate) {
    navigate('/');
  } else {
    window.location.href = '/';
  }
  
  // Optional: Show success message
  alert('Logged out successfully!');
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('userToken');
  const userData = localStorage.getItem('userData');
  return !!(token && userData);
};

export const isAdmin = () => {
  const adminLoggedIn = localStorage.getItem('adminLoggedIn');
  const adminUsername = localStorage.getItem('adminUsername');
  return !!(adminLoggedIn && adminUsername);
};

export const getUserData = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

export const getAuthToken = () => {
  return localStorage.getItem('userToken');
};

