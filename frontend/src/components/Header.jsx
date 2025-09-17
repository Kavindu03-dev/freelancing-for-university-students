import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout, isAuthenticated, getUserData } from "../utils/auth";
import Logo from "../assets/Logo.png";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Services dropdown state
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const servicesButtonRef = useRef(null);
  const servicesMenuRef = useRef(null);

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Function to check if a navigation link is active
  const isActiveLink = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };



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

    // Check auth on mount and refresh auth state every 2 seconds
    checkAuth();

    // Listen for storage changes (when user signs in/out)
    const handleStorageChange = (e) => {
      if (e.key === 'userToken' || e.key === 'userData') {
        checkAuth();
      }
    };

    // Listen for custom auth events to refresh auth state
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authStateChanged', handleAuthChange);
    
    // Add periodic auth check to ensure sync with backend
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

  const handleDeleteAccount = async () => {
    // Show confirmation dialog
    const isConfirmed = window.confirm(
      '⚠️ WARNING: This action cannot be undone!\n\n' +
      'Are you absolutely sure you want to delete your account?\n\n' +
      'This will permanently delete:\n' +
      '• Your profile and all data\n' +
      '• Your CV/resume files\n' +
      '• All your project history\n' +
      '• Your account credentials\n\n' +
      'Type "DELETE" to confirm:'
    );

    if (!isConfirmed) return;

    const userInput = prompt('Please type "DELETE" to confirm account deletion:');
    if (userInput !== 'DELETE') {
      alert('Account deletion cancelled. Your account is safe.');
      return;
    }

    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        alert('Authentication token not found. Please log in again.');
        return;
      }

      // Determine the correct endpoint based on user type
      const endpoint = userData?.userType === 'freelancer' 
        ? 'http://localhost:5000/api/freelancer/account'
        : 'http://localhost:5000/api/users/account';

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (result.success) {
        alert('Account deleted successfully. You will be redirected to the home page.');
        // Clear all local data
        localStorage.clear();
        // Redirect to home page
        navigate('/');
      } else {
        alert(`Failed to delete account: ${result.message}`);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again.');
    }
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

  // Close services dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (isServicesOpen) {
        if (
          servicesMenuRef.current && !servicesMenuRef.current.contains(e.target) &&
          servicesButtonRef.current && !servicesButtonRef.current.contains(e.target)
        ) {
          setIsServicesOpen(false);
        }
      }
    }
    function handleEsc(e) {
      if (e.key === 'Escape') setIsServicesOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isServicesOpen]);

  // Close dropdown on route change
  useEffect(() => {
    setIsServicesOpen(false);
  }, [location.pathname]);

  const openServices = () => setIsServicesOpen(true);
  const closeServices = () => setIsServicesOpen(false);
  const toggleServices = () => setIsServicesOpen(o => !o);

  const handleServicesKeyDown = (e) => {
    if (['Enter', ' '].includes(e.key)) {
      e.preventDefault();
      toggleServices();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isServicesOpen) setIsServicesOpen(true);
      setTimeout(() => {
        const first = servicesMenuRef.current?.querySelector('a');
        first && first.focus();
      }, 0);
    } else if (e.key === 'Escape') {
      closeServices();
      servicesButtonRef.current?.focus();
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
          
          {/* Left Side - Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <img 
                src={Logo} 
                alt="Logo" 
                className="h-10 w-auto group-hover:scale-105 transition-all duration-300"
              />
            </Link>
          </div>

          {/* Center - Navigation Menu */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-base font-semibold transition-all duration-200 ${
                isActiveLink('/') 
                  ? 'text-yellow-400 bg-yellow-400/10 border-b-2 border-yellow-400 shadow-lg' 
                  : 'text-white hover:text-yellow-400'
              }`}
            >
              Home
            </Link>
            
            {/* Services Dropdown (Desktop) */}
            <div 
              className="relative hidden lg:block"
              onMouseEnter={openServices}
              onMouseLeave={closeServices}
            >
              <button
                ref={servicesButtonRef}
                type="button"
                aria-haspopup="true"
                aria-expanded={isServicesOpen}
                onClick={(e) => {
                  // If already open, treat click on label (not on a submenu) as navigation to default gigs tab
                  if (isServicesOpen) {
                    closeServices();
                    // navigate to gigs default
                    window.location.href = '/services?tab=gigs';
                  } else {
                    toggleServices();
                  }
                }}
                onKeyDown={handleServicesKeyDown}
                className={`px-3 py-2 rounded-md text-base font-semibold transition-all duration-200 flex items-center gap-1 ${
                  isActiveLink('/services')
                    ? 'text-yellow-400 bg-yellow-400/10 border-b-2 border-yellow-400 shadow-lg'
                    : 'text-white hover:text-yellow-400'
                }`}
              >
                Services
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                ref={servicesMenuRef}
                className={`absolute left-0 top-full w-56 rounded-xl border border-gray-700 bg-gray-900/95 backdrop-blur-md shadow-xl ring-1 ring-black/40 overflow-hidden transform origin-top transition-all duration-150 ${
                  isServicesOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}
                role="menu"
                aria-label="Services submenu"
              >
                <div className="py-2">
                  <Link
                    to="/services?tab=gigs"
                    onClick={closeServices}
                    role="menuitem"
                    className="flex items-start gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 focus:bg-gray-800 focus:outline-none"
                  >
                    <span className="mt-0.5">🚀</span>
                    <span>
                      <span className="block font-medium text-yellow-400">Gigs</span>
                      <span className="block text-xs text-gray-400">Browse freelancer services</span>
                    </span>
                  </Link>
                  <Link
                    to="/services?tab=posts"
                    onClick={closeServices}
                    role="menuitem"
                    className="flex items-start gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 focus:bg-gray-800 focus:outline-none"
                  >
                    <span className="mt-0.5">💼</span>
                    <span>
                      <span className="block font-medium text-yellow-400">Job Post</span>
                      <span className="block text-xs text-gray-400">Client job postings</span>
                    </span>
                  </Link>
                </div>
              </div>
            </div>


            
            <Link 
              to="/resources" 
              className={`px-3 py-2 rounded-md text-base font-semibold transition-all duration-200 ${
                isActiveLink('/resources') 
                  ? 'text-yellow-400 bg-yellow-400/10 border-b-2 border-yellow-400 shadow-lg' 
                  : 'text-white hover:text-yellow-400'
              }`}
            >
              Resources
            </Link>
            
            <Link 
              to="/contact" 
              className={`px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                isActiveLink('/contact') 
                  ? 'text-yellow-400 bg-yellow-400/10 border-b-2 border-yellow-400 shadow-lg' 
                  : 'text-white hover:text-yellow-400'
              }`}
            >
              Contact Us
            </Link>
            
            <Link 
              to="/about" 
              className={`px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                isActiveLink('/about') 
                  ? 'text-yellow-400 bg-yellow-400/10 border-b-2 border-yellow-400 shadow-lg' 
                  : 'text-white hover:text-yellow-400'
              }`}
            >
              About Us
            </Link>
          </nav>

          {/* Right Side - Authentication Buttons */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800/50 transition-colors duration-200"
                >
                  {userData?.profileImage?.url ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm">
                      <img 
                        src={userData.profileImage.url} 
                        alt={`${userData?.firstName || 'User'}'s profile`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-black font-semibold text-sm" style={{display: 'none'}}>
                        {userData?.firstName?.charAt(0) || 'U'}
                      </div>
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-black font-semibold text-sm">
                      {userData?.firstName?.charAt(0) || 'U'}
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-medium text-white">
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
                      <Link to="/admin/dashboard" className="dropdown-item" onClick={() => setIsUserDropdownOpen(false)}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Admin Dashboard
                      </Link>
                    )}
                    {userData?.userType === 'client' && (
                      <Link to="/client/dashboard" className="dropdown-item" onClick={() => setIsUserDropdownOpen(false)}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Client Dashboard
                      </Link>
                    )}
                    {userData?.userType === 'freelancer' && (
                      <Link to="/freelancer/dashboard" className="dropdown-item" onClick={() => setIsUserDropdownOpen(false)}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Freelancer Dashboard
                      </Link>
                    )}
                    {userData?.userType === 'admin' && (
                      <Link to="/admin/dashboard?tab=profile" className="dropdown-item" onClick={() => setIsUserDropdownOpen(false)}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </Link>
                    )}
                    {userData?.userType === 'client' && (
                      <Link to="/client/dashboard?tab=profile" className="dropdown-item" onClick={() => setIsUserDropdownOpen(false)}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </Link>
                    )}
                    {userData?.userType === 'freelancer' && (
                      <Link to="/freelancer/dashboard?tab=profile" className="dropdown-item" onClick={() => setIsUserDropdownOpen(false)}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </Link>
                    )}
                    {userData?.userType === 'universityStaff' && (
                      <Link to="/staff/dashboard?tab=profile" className="dropdown-item" onClick={() => setIsUserDropdownOpen(false)}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </Link>
                    )}
                    <Link to="/messages" className="dropdown-item" onClick={() => setIsUserDropdownOpen(false)}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Messages
                    </Link>
                    <Link to="/orders" className="dropdown-item" onClick={() => setIsUserDropdownOpen(false)}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Orders
                    </Link>

                    <Link to="/settings" className="dropdown-item" onClick={() => setIsUserDropdownOpen(false)}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </Link>
                    <hr className="my-2 border-gray-100" />
                    <button onClick={handleDeleteAccount} className="dropdown-item text-red-600 hover:bg-red-50">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete Account
                    </button>
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
            <Link 
              to="/" 
              onClick={closeMobileMenu} 
              className={`block px-3 py-2 text-base font-medium rounded-md transition-all duration-200 ${
                isActiveLink('/') 
                  ? 'text-yellow-400 bg-yellow-500/20 border-l-4 border-yellow-400 shadow-lg' 
                  : 'text-white hover:text-yellow-400 hover:bg-yellow-500/20'
              }`}
            >
              Home
            </Link>
            {/* Mobile Services Accordion */}
            <div className="border border-yellow-500/30 rounded-md overflow-hidden">
              <button
                type="button"
                onClick={() => setIsServicesOpen(o => !o)}
                className={`w-full flex items-center justify-between px-3 py-2 text-base font-medium transition-all duration-200 ${
                  isActiveLink('/services') ? 'text-yellow-400' : 'text-white hover:text-yellow-400'
                }`}
                aria-haspopup="true"
                aria-expanded={isServicesOpen}
              >
                <span>Services</span>
                <svg
                  className={`w-5 h-5 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isServicesOpen && (
                <div className="bg-black/60 backdrop-blur-sm border-t border-yellow-500/20">
                  <Link
                    to="/services?tab=gigs"
                    onClick={() => { closeMobileMenu(); setIsServicesOpen(false); }}
                    className="flex items-start gap-3 px-5 py-3 text-sm text-gray-200 hover:bg-yellow-500/10"
                  >
                    <span className="mt-0.5">🚀</span>
                    <span>
                      <span className="block font-medium text-yellow-400">Gigs</span>
                      <span className="block text-xs text-gray-400">Freelancer services</span>
                    </span>
                  </Link>
                  <Link
                    to="/services?tab=posts"
                    onClick={() => { closeMobileMenu(); setIsServicesOpen(false); }}
                    className="flex items-start gap-3 px-5 py-3 text-sm text-gray-200 hover:bg-yellow-500/10"
                  >
                    <span className="mt-0.5">💼</span>
                    <span>
                      <span className="block font-medium text-yellow-400">Job Post</span>
                      <span className="block text-xs text-gray-400">Client job postings</span>
                    </span>
                  </Link>
                </div>
              )}
            </div>

            <Link 
              to="/resources" 
              onClick={closeMobileMenu} 
              className={`block px-3 py-2 text-base font-medium rounded-md transition-all duration-200 ${
                isActiveLink('/resources') 
                  ? 'text-yellow-400 bg-yellow-500/20 border-l-4 border-yellow-400 shadow-lg' 
                  : 'text-white hover:text-yellow-400 hover:bg-yellow-500/20'
              }`}
            >
              Resources
            </Link>
            <Link 
              to="/contact" 
              onClick={closeMobileMenu} 
              className={`block px-3 py-2 text-base font-medium rounded-md transition-all duration-200 ${
                isActiveLink('/contact') 
                  ? 'text-yellow-400 bg-yellow-500/20 border-l-4 border-yellow-400 shadow-lg' 
                  : 'text-white hover:text-yellow-400 hover:bg-yellow-500/20'
              }`}
            >
              Contact Us
            </Link>
            <Link 
              to="/about" 
              onClick={closeMobileMenu} 
              className={`block px-3 py-2 text-base font-medium rounded-md transition-all duration-200 ${
                isActiveLink('/about') 
                  ? 'text-yellow-400 bg-yellow-500/20 border-l-4 border-yellow-400 shadow-lg' 
                  : 'text-white hover:text-yellow-400 hover:bg-yellow-500/20'
              }`}
            >
              About Us
            </Link>

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
