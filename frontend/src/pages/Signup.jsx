import React, { useState } from "react";
import { Link } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "client", // client or freelancer
    skills: [],
    bio: "",
    agreeToTerms: false,
    agreeToMarketing: false
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError("");
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all required fields");
      return;
    }
    
    if (formData.skills.length === 0) {
      setError("Please add at least one skill");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    
    if (!formData.agreeToTerms) {
      setError("You must agree to the terms of service");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        // Store user data and token
        localStorage.setItem('userToken', result.data.token);
        localStorage.setItem('userData', JSON.stringify(result.data));
        
        // Show success message
        alert('Registration successful! Redirecting...');
        
        // Redirect to appropriate page based on user type
        if (result.data.userType === 'client') {
          window.location.href = '/client-dashboard';
        } else {
          window.location.href = '/freelancer-dashboard';
        }
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent mb-2">
              FlexiHire
            </h1>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Join FlexiHire</h2>
          <p className="text-gray-600">Create your account and start your journey</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${step >= 1 ? 'text-yellow-500' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'bg-yellow-500 border-yellow-500 text-black' : 'border-gray-300'}`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">Account</span>
            </div>
            <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-yellow-500' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${step >= 2 ? 'text-yellow-500' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'bg-yellow-500 border-yellow-500 text-black' : 'border-gray-300'}`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">Profile</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-yellow-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                      First name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-yellow-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                      Last name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-yellow-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

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
                    className="w-full px-4 py-3 border-2 border-yellow-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300"
                    placeholder="Enter your email"
                  />
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
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pr-12 border-2 border-yellow-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300"
                      placeholder="Create a strong password"
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
                  <p className="mt-1 text-sm text-gray-500">Must be at least 8 characters long</p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pr-12 border-2 border-yellow-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showConfirmPassword ? (
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

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black py-3 px-8 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    Next Step
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    I want to join as a:
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 ${formData.userType === 'client' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 hover:border-yellow-300'}`}>
                      <input
                        type="radio"
                        name="userType"
                        value="client"
                        checked={formData.userType === 'client'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.userType === 'client' ? 'border-yellow-500' : 'border-gray-300'}`}>
                          {formData.userType === 'client' && <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-semibold text-gray-900">Client</div>
                          <div className="text-sm text-gray-500">I want to hire freelancers</div>
                        </div>
                      </div>
                    </label>

                    <label className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 ${formData.userType === 'freelancer' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 hover:border-yellow-300'}`}>
                      <input
                        type="radio"
                        name="userType"
                        value="freelancer"
                        checked={formData.userType === 'freelancer'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.userType === 'freelancer' ? 'border-yellow-500' : 'border-gray-300'}`}>
                          {formData.userType === 'freelancer' && <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-semibold text-gray-900">Freelancer</div>
                          <div className="text-sm text-gray-500">I want to offer my services</div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Skills Input */}
                <div>
                  <label htmlFor="skills" className="block text-sm font-semibold text-gray-700 mb-2">
                    Skills {formData.userType === 'freelancer' ? '(What services do you offer?)' : '(What skills are you looking for?)'}
                  </label>
                  <div className="flex flex-wrap gap-2 p-3 border-2 border-yellow-300 rounded-xl min-h-[60px]">
                    {formData.skills.map((skill, index) => (
                      <span key={index} className="bg-yellow-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {skill}
                        <button 
                          type="button" 
                          onClick={() => {
                            const newSkills = formData.skills.filter((_, i) => i !== index);
                            setFormData(prev => ({ ...prev, skills: newSkills }));
                          }}
                          className="text-red-500 hover:text-red-700 font-bold text-lg leading-none"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder={formData.userType === 'freelancer' ? "Add a skill..." : "Add a skill..."}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          const newSkill = e.target.value.trim();
                          if (!formData.skills.includes(newSkill)) {
                            setFormData(prev => ({ 
                              ...prev, 
                              skills: [...prev.skills, newSkill] 
                            }));
                          }
                          e.target.value = '';
                        }
                      }}
                      className="flex-1 outline-none text-sm"
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Press Enter to add each skill. Click the × to remove skills.
                  </p>
                  
                  {/* Quick Add Skills */}
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Quick add common skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.userType === 'freelancer' ? 
                        // Freelancer skills
                        ['JavaScript', 'React', 'Node.js', 'Python', 'Design', 'Writing', 'Marketing', 'Data Analysis'].map((skill) => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => {
                              if (!formData.skills.includes(skill)) {
                                setFormData(prev => ({ 
                                  ...prev, 
                                  skills: [...prev.skills, skill] 
                                }));
                              }
                            }}
                            disabled={formData.skills.includes(skill)}
                            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                              formData.skills.includes(skill)
                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
                            }`}
                          >
                            + {skill}
                          </button>
                        ))
                        :
                        // Client skills
                        ['Web Development', 'Mobile App', 'Design', 'Content Writing', 'Marketing', 'Data Analysis', 'Consulting', 'Translation'].map((skill) => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => {
                              if (!formData.skills.includes(skill)) {
                                setFormData(prev => ({ 
                                  ...prev, 
                                  skills: [...prev.skills, skill] 
                                }));
                              }
                            }}
                            disabled={formData.skills.includes(skill)}
                            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                              formData.skills.includes(skill)
                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
                            }`}
                          >
                            + {skill}
                          </button>
                        ))
                      }
                    </div>
                  </div>
                </div>

                {/* Bio Input */}
                <div>
                  <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 mb-2">
                    Bio {formData.userType === 'freelancer' ? '(Tell clients about your experience)' : '(Tell freelancers about your project needs)'}
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows="3"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-yellow-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300 resize-none"
                    placeholder={formData.userType === 'freelancer' ? "Describe your experience, expertise, and what services you offer..." : "Describe your project, company, or what you're looking for..."}
                    maxLength="500"
                  />
                  <p className={`mt-1 text-sm ${
                    formData.bio.length >= 450 ? 'text-orange-600' : 
                    formData.bio.length >= 500 ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {formData.bio.length}/500 characters
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <input
                      id="agreeToTerms"
                      name="agreeToTerms"
                      type="checkbox"
                      required
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-yellow-300 rounded mt-1"
                    />
                    <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
                      I agree to the{" "}
                      <a href="#" className="text-yellow-500 hover:text-yellow-400 font-medium">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-yellow-500 hover:text-yellow-400 font-medium">
                        Privacy Policy
                      </a>
                    </label>
                  </div>

                  <div className="flex items-start">
                    <input
                      id="agreeToMarketing"
                      name="agreeToMarketing"
                      type="checkbox"
                      checked={formData.agreeToMarketing}
                      onChange={handleChange}
                      className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-yellow-300 rounded mt-1"
                    />
                    <label htmlFor="agreeToMarketing" className="ml-2 block text-sm text-gray-700">
                      I agree to receive marketing communications from FlexiHire
                    </label>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="text-gray-600 hover:text-gray-800 py-3 px-6 rounded-xl font-semibold transition-colors duration-200"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black py-3 px-8 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              </>
            )}
          </form>

          
        </div>

        {/* Sign In Link */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/signin" className="font-semibold text-yellow-500 hover:text-yellow-400 transition-colors duration-200">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
