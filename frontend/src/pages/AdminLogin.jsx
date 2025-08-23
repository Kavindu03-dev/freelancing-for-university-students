import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Hardcoded admin credentials for development
    const validCredentials = {
      email: "admin@flexihire.com",
      password: "admin123"
    };

    // Check if credentials match
    console.log('Entered credentials:', credentials);
    console.log('Valid credentials:', validCredentials);
    console.log('Email match:', credentials.email === validCredentials.email);
    console.log('Password match:', credentials.password === validCredentials.password);
    
    if (credentials.email === validCredentials.email && credentials.password === validCredentials.password) {
      console.log('✅ Credentials match! Proceeding to dashboard...');
      
      // Store admin data
      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('adminEmail', credentials.email);
      localStorage.setItem('adminToken', 'admin-token-123');
      localStorage.setItem('adminId', 'admin-001');
      
      console.log('✅ Admin data stored in localStorage');
      console.log('✅ Attempting navigation to /admin/dashboard');
      
      // Navigate to admin dashboard
      navigate('/admin/dashboard');
      
      console.log('✅ Navigation called');
    } else {
      setError(`Invalid admin credentials. Expected: ${validCredentials.email} / ${validCredentials.password}, Got: ${credentials.email} / ${credentials.password}`);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
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

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <span className="text-black font-bold text-3xl">A</span>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent mb-2">
            Admin Login
          </h2>
          <p className="text-gray-600">Access the FlexiHire admin panel</p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-indigo-200/50">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={credentials.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500 transition-all duration-300"
                placeholder="Enter admin email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500 transition-all duration-300"
                  placeholder="Enter admin password"
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
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign In to Admin Panel"}
            </button>
          </form>



          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <div className="mb-4 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
              <p className="text-sm text-yellow-800 font-bold">
                🔑 <strong>ADMIN LOGIN CREDENTIALS:</strong>
              </p>
              <p className="text-sm text-yellow-800 mt-2">
                <strong>Email:</strong> admin@flexihire.com<br/>
                <strong>Password:</strong> admin123
              </p>
              <p className="text-xs text-yellow-700 mt-2 italic">
                Copy and paste these exactly as shown
              </p>
            </div>
            
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700 mb-2">
                <strong>Test Navigation:</strong>
              </p>
              <button
                onClick={() => {
                  console.log('🧪 Testing manual navigation...');
                  navigate('/admin/dashboard');
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                🧪 Test Go to Dashboard
              </button>
            </div>
            
            <button
              onClick={() => navigate('/')}
              className="text-yellow-600 hover:text-yellow-700 font-medium transition-colors duration-300"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;

