import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout, isAuthenticated, getUserData } from "../utils/auth";

function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    if (isAuthenticated()) {
      setIsLoggedIn(true);
      setUserData(getUserData());
    } else {
      setIsLoggedIn(false);
      setUserData(null);
    }
  }, []);

  const handleLogout = () => {
    logout(navigate);
    setIsLoggedIn(false);
    setUserData(null);
  };

  return (
    <nav className="bg-black/90 backdrop-blur-sm shadow-lg border-b border-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">FlexiHire</h1>
              </Link>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="text-gray-300 hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">Home</Link>
              <a href="#" className="text-gray-300 hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">Services</a>
              <a href="#" className="text-gray-300 hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">Academic Help</a>
              <a href="#" className="text-gray-300 hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">How it Works</a>
              <a href="#" className="text-gray-300 hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">About</a>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-300 text-sm">
                    Welcome, {userData?.firstName || 'User'}!
                  </span>
                  <div className="relative group">
                    <button className="text-gray-300 hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                      Dashboard
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      {userData?.userType === 'client' ? (
                        <Link to="/client-dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Client Dashboard
                        </Link>
                      ) : (
                        <Link to="/student/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Student Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" className="text-gray-300 hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">Sign In</Link>
                <Link to="/join" className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black px-6 py-2 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                  Join Now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
