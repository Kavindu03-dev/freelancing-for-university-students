import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout, isAuthenticated, getUserData } from "../utils/auth";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      if (isAuthenticated()) {
        setIsLoggedIn(true);
        setUserData(getUserData());
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    };

    // Check auth on mount
    checkAuth();

    // Listen for storage changes (when user signs in/out)
    const handleStorageChange = (e) => {
      if (e.key === 'userToken' || e.key === 'userData') {
        checkAuth();
      }
    };

    // Listen for custom auth events
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authStateChanged', handleAuthChange);
    
    // Add periodic auth check to ensure sync
    const authCheckInterval = setInterval(checkAuth, 2000);
    
    // Handle scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', handleAuthChange);
      clearInterval(authCheckInterval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout(navigate);
    setIsLoggedIn(false);
    setUserData(null);
    setIsUserDropdownOpen(false);
  };



  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Function to manually refresh auth state
  const refreshAuthState = () => {
    if (isAuthenticated()) {
      setIsLoggedIn(true);
      setUserData(getUserData());
    } else {
      setIsLoggedIn(false);
      setUserData(null);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-black/95 backdrop-blur-md shadow-lg border-b border-yellow-500' 
        : 'bg-black/90 backdrop-blur-sm'
    }`}>
      <div className="px-4 lg:px-8 mx-auto">
        <div className="flex justify-between items-center h-16 lg:h-20">
          
          {/* Left Side - Logo and Website Name */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                <span className="text-black font-bold text-sm">F</span>
              </div>
              <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                FlexiHire
              </h1>
            </Link>
          </div>

          {/* Center - Navigation Menu */}
                      <nav className="hidden lg:flex items-center space-x-8">
              <Link to="/" className="text-white hover:text-yellow-400 px-3 py-2 rounded-md text-base font-semibold transition-colors duration-200">Home</Link>
              
              <Link to="/services" className="text-white hover:text-yellow-400 px-3 py-2 rounded-md text-base font-semibold transition-colors duration-200">Services</Link>

              <Link to="/skills" className="text-white hover:text-yellow-400 px-3 py-2 rounded-md text-base font-semibold transition-colors duration-200">Skills</Link>
              <Link to="/resources" className="text-white hover:text-yellow-400 px-3 py-2 rounded-md text-base font-semibold transition-colors duration-200">Resources</Link>
              <Link to="/contact" className="text-white hover:text-yellow-400 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200">Contact</Link>
              <Link to="/about" className="text-white hover:text-yellow-400 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200">About Us</Link>
          </nav>

          {/* Right Side - Authentication Buttons */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-black font-semibold text-sm">
                    {userData?.firstName?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {userData?.firstName || 'User'}
                  </span>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User Dropdown */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2">
                    {userData?.userType === 'admin' && (
                      <Link to="/admin/dashboard" className="dropdown-item">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Admin Dashboard
                      </Link>
                    )}
                    {userData?.userType === 'client' && (
                      <Link to="/client-dashboard" className="dropdown-item">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Client Dashboard
                      </Link>
                    )}
                    {userData?.userType === 'student' && (
                      <Link to="/student/dashboard" className="dropdown-item">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Student Dashboard
                      </Link>
                    )}
                    <Link to="/profile" className="dropdown-item">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </Link>
                    <Link to="/messages" className="dropdown-item">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Messages
                    </Link>
                    <Link to="/orders" className="dropdown-item">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Orders
                    </Link>
                    <Link to="/settings" className="dropdown-item">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </Link>
                    <hr className="my-2 border-gray-100" />
                    <button onClick={handleLogout} className="dropdown-item text-red-600 hover:bg-red-50">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-3">
                <Link to="/signin" className="text-white hover:text-yellow-400 px-4 py-2 font-medium transition-colors duration-200">
                  Sign In
                </Link>
                <Link to="/join" className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                  Join Now
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg hover:bg-yellow-500/20 transition-colors duration-200"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-black border-t border-yellow-500">
            {/* Mobile Navigation Links */}
            <Link to="/" onClick={closeMobileMenu} className="block px-3 py-2 text-base font-medium text-white hover:text-yellow-400 hover:bg-yellow-500/20 rounded-md transition-colors duration-200">Home</Link>
            <Link to="/services" onClick={closeMobileMenu} className="block px-3 py-2 text-base font-medium text-white hover:text-yellow-400 hover:bg-yellow-500/20 rounded-md transition-colors duration-200">Services</Link>
            <Link to="/skills" onClick={closeMobileMenu} className="block px-3 py-2 text-base font-medium text-white hover:text-yellow-400 hover:bg-yellow-500/20 rounded-md transition-colors duration-200">Skills</Link>
            <Link to="/resources" onClick={closeMobileMenu} className="block px-3 py-2 text-base font-medium text-white hover:text-yellow-400 hover:bg-yellow-500/20 rounded-md transition-colors duration-200">Resources</Link>
            <Link to="/contact" onClick={closeMobileMenu} className="block px-3 py-2 text-base font-medium text-white hover:text-yellow-400 hover:bg-yellow-500/20 rounded-md transition-colors duration-200">Contact</Link>
            <Link to="/about" onClick={closeMobileMenu} className="block px-3 py-2 text-base font-medium text-white hover:text-yellow-400 hover:bg-yellow-500/20 rounded-md transition-colors duration-200">About Us</Link>

            {/* Mobile Auth Links */}
            {!isLoggedIn && (
              <div className="pt-4 border-t border-yellow-500 space-y-2">
                <Link to="/signin" onClick={closeMobileMenu} className="block w-full text-center text-white hover:text-yellow-400 px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                  Sign In
                </Link>
                <Link to="/join" onClick={closeMobileMenu} className="block w-full text-center bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black px-4 py-2 rounded-lg font-medium transition-all duration-300">
                  Join Now
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
