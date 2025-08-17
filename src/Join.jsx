import React, { useState } from "react";
import { Link } from "react-router-dom";

function Join() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "client", // client or freelancer
    agreeToTerms: false,
    agreeToMarketing: false
  });

  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic here
    console.log('Registration:', formData);
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              FlexiHire
            </h1>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Join FlexiHire</h2>
          <p className="text-gray-600">Create your account and start your journey</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${step >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'bg-green-600 border-green-600 text-white' : 'border-gray-300'}`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">Account</span>
            </div>
            <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${step >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'bg-green-600 border-green-600 text-white' : 'border-gray-300'}`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">Profile</span>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
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
                      className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all duration-300"
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
                      className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all duration-300"
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
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all duration-300"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all duration-300"
                    placeholder="Create a strong password"
                  />
                  <p className="mt-1 text-sm text-gray-500">Must be at least 8 characters long</p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all duration-300"
                    placeholder="Confirm your password"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-8 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
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
                    <label className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 ${formData.userType === 'client' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                      <input
                        type="radio"
                        name="userType"
                        value="client"
                        checked={formData.userType === 'client'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.userType === 'client' ? 'border-green-500' : 'border-gray-300'}`}>
                          {formData.userType === 'client' && <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-semibold text-gray-900">Client</div>
                          <div className="text-sm text-gray-500">I want to hire freelancers</div>
                        </div>
                      </div>
                    </label>

                    <label className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 ${formData.userType === 'freelancer' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                      <input
                        type="radio"
                        name="userType"
                        value="freelancer"
                        checked={formData.userType === 'freelancer'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.userType === 'freelancer' ? 'border-green-500' : 'border-gray-300'}`}>
                          {formData.userType === 'freelancer' && <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-semibold text-gray-900">Freelancer</div>
                          <div className="text-sm text-gray-500">I want to offer my services</div>
                        </div>
                      </div>
                    </label>
                  </div>
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
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-green-300 rounded mt-1"
                    />
                    <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
                      I agree to the{" "}
                      <a href="#" className="text-green-600 hover:text-green-500 font-medium">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-green-600 hover:text-green-500 font-medium">
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
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-green-300 rounded mt-1"
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
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-8 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    Create Account
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
            <Link to="/signin" className="font-semibold text-green-600 hover:text-green-500 transition-colors duration-200">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Join;
