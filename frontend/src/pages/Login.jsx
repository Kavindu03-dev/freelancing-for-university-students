import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { setAuthData } from "../utils/auth";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect');

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters long";
    return "";
  };

  const validateForm = () => {
    const newErrors = {};
    
    newErrors.email = validateEmail(formData.email);
    newErrors.password = validatePassword(formData.password);
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {

      // Make API call to backend for login
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const result = await response.json();

      if (result.success) {
        // Store initial user data and token
        setAuthData(result.data.token, result.data);
        
        // For all users, fetch complete profile data to ensure we have the latest data including profile images
        try {
          let profileEndpoint = '';
          if (result.data.userType === 'freelancer') {
            profileEndpoint = 'http://localhost:5000/api/freelancer/profile';
          } else if (result.data.userType === 'client') {
            profileEndpoint = 'http://localhost:5000/api/users/profile';
          } else if (result.data.userType === 'universityStaff') {
            profileEndpoint = 'http://localhost:5000/api/users/profile';
          }
          
          if (profileEndpoint) {
            const profileResponse = await fetch(profileEndpoint, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${result.data.token}`
              }
            });
            
            if (profileResponse.ok) {
              const profileResult = await profileResponse.json();
              if (profileResult.success) {
                // Update localStorage with complete profile data
                localStorage.setItem('userData', JSON.stringify(profileResult.data));
                // Dispatch auth change event to update components
                window.dispatchEvent(new Event('authStateChanged'));
              }
            }
          }
        } catch (error) {
          console.error('Error fetching complete profile:', error);
          // Continue with login even if profile fetch fails
        }
        
        // Redirect based on user type or redirect parameter
        const userType = result.data.userType;
        
        // If there's a redirect parameter, use it (except for admin users)
        if (redirectTo && userType !== 'admin') {
          navigate(redirectTo);
        } else {
          // Default redirect based on user type
          if (userType === 'admin') { 
            navigate('/admin/dashboard');
          } else if (userType === 'universityStaff') {
            navigate('/staff/dashboard');
          } else if (userType === 'freelancer') {
            navigate('/freelancer/dashboard');
          } else if (userType === 'client') {
            navigate('/client/dashboard');
          } else {
            // Default redirect for other user types
            navigate('/');
          }
        }
      } else {
        // Handle login errors
        setErrors({ general: result.message || 'Invalid credentials. Please try again.' });
        triggerShake();
      }






    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Network error. Please check your connection and try again.' });
      triggerShake();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
        `}
      </style>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden pt-30">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Floating Geometric Shapes */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full animate-bounce"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full animate-bounce delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-br from-green-400/30 to-emerald-400/30 rounded-full animate-bounce delay-2000"></div>
          <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-gradient-to-br from-orange-400/30 to-yellow-400/30 rounded-full animate-bounce delay-1500"></div>
          
          {/* Floating Icons */}
          <div className="absolute top-32 left-20 text-blue-500/40 text-3xl animate-pulse">⚛️</div>
          <div className="absolute top-48 right-32 text-purple-500/40 text-3xl animate-pulse delay-500">💻</div>
          <div className="absolute bottom-32 left-32 text-green-500/40 text-3xl animate-pulse delay-1000">🚀</div>
          <div className="absolute bottom-48 right-16 text-orange-500/40 text-3xl animate-pulse delay-1500">⚡</div>
          
          {/* Subtle Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(99,102,241,0.1)_1px,transparent_0)] bg-[size:20px_20px]"></div>
        </div>

      <div className="max-w-6xl mx-auto flex items-center justify-center">
        {/* Left Side - Image */}
        <div className="hidden lg:block w-1/2 pr-12 relative">
          <div className="relative">
            {/* Main Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                alt="Professional team working together"
                className="w-full h-[500px] object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
              
              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-8">
                <h3 className="text-3xl font-bold mb-4 text-center text-white">Welcome Back!</h3>
                <p className="text-lg text-center mb-6 leading-relaxed text-white">
                  Join thousands of professionals building their careers through FlexiHire
                </p>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-6 w-full max-w-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">10K+</div>
                                                        <div className="text-sm text-white">Active Freelancers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">5K+</div>
                  <div className="text-sm text-white">Completed Projects</div>
                </div>
                </div>
              </div>
            </div>
            
            {/* Secondary Image - Small circular image */}
            <div className="absolute -bottom-6 -right-6">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=388&q=80" 
                  alt="Happy professional"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-300 rounded-full opacity-20"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-yellow-400 rounded-full opacity-30"></div>
          </div>
          
          {/* Additional floating elements */}
          <div className="absolute top-20 right-0 w-12 h-12 bg-yellow-200 rounded-full opacity-40 animate-pulse"></div>
          <div className="absolute bottom-20 left-0 w-8 h-8 bg-yellow-300 rounded-full opacity-30 animate-bounce"></div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 max-w-md">
        {/* Header */}




        {/* Sign In Form */}
        <div className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-indigo-200/50 transition-all duration-500 ${
          isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''
        }`}>
          {/* General Error Display */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {errors.general}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 ${
                  errors.email 
                    ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-gray-200 focus:border-gray-500'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 ${
                    errors.password 
                      ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-gray-200 focus:border-gray-500'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-yellow-500 hover:text-yellow-400 transition-colors duration-200">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-xl font-semibold shadow-lg transition-all duration-300 transform ${
                  isSubmitting 
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black hover:shadow-xl hover:-translate-y-0.5'
                }`}
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </button>
              
              {/* Admin Login Button */}
              <button
                type="button"
                onClick={() => navigate('/admin/login')}
                className="w-full mt-3 py-3 px-4 rounded-xl font-semibold shadow-lg transition-all duration-300 transform bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white hover:shadow-xl hover:-translate-y-0.5 border-2 border-transparent hover:border-indigo-300"
              >
                🔐 Admin Login
              </button>
            </div>
          </form>
        </div>


        </div>
      </div>
    </div>
    </>
  );
}

export default Login;
