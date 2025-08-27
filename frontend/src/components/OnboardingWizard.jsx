import React, { useState, useEffect } from 'react';

const OnboardingWizard = ({ isOpen, onClose, onComplete, currentProfileData, profileCompleteness }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const onboardingSteps = [
    {
      step: 1,
      title: "Basic Information",
      description: "Tell us about yourself",
      completion: 25,
      fields: ['firstName', 'lastName', 'email', 'phoneNumber', 'dateOfBirth']
    },
    {
      step: 2,
      title: "Academic Details",
      description: "Your educational background",
      completion: 50,
      fields: ['degreeProgram', 'university', 'gpa', 'graduationYear', 'academicAchievements']
    },
    {
      step: 3,
      title: "Skills & Portfolio",
      description: "Showcase your expertise",
      completion: 75,
      fields: ['technicalSkills', 'softSkills', 'portfolioProjects', 'certifications']
    },
    {
      step: 4,
      title: "Preferences & Goals",
      description: "Set your career objectives",
      completion: 100,
      fields: ['careerGoals', 'preferredWorkType', 'hourlyRate', 'availability', 'locationPreference']
    }
  ];

  useEffect(() => {
    if (currentProfileData) {
      setFormData(currentProfileData);
    }
  }, [currentProfileData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const stepFields = onboardingSteps[step - 1].fields;
    const newErrors = {};

    stepFields.forEach(field => {
      if (!formData[field] || (typeof formData[field] === 'string' && formData[field].trim() === '')) {
        newErrors[field] = `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
      }
    });

    // Step 1: Basic Information validations
    if (step === 1) {
      // First Name validation
      if (formData.firstName && formData.firstName.trim()) {
        if (formData.firstName.length < 2) {
          newErrors.firstName = 'First name must be at least 2 characters long';
        } else if (formData.firstName.length > 50) {
          newErrors.firstName = 'First name must be less than 50 characters';
        } else if (!/^[a-zA-Z\s]+$/.test(formData.firstName)) {
          newErrors.firstName = 'First name can only contain letters and spaces';
        }
      }

      // Last Name validation
      if (formData.lastName && formData.lastName.trim()) {
        if (formData.lastName.length < 2) {
          newErrors.lastName = 'Last name must be at least 2 characters long';
        } else if (formData.lastName.length > 50) {
          newErrors.lastName = 'Last name must be less than 50 characters';
        } else if (!/^[a-zA-Z\s]+$/.test(formData.lastName)) {
          newErrors.lastName = 'Last name can only contain letters and spaces';
        }
      }

      // Email validation
      if (formData.email && formData.email.trim()) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        } else if (formData.email.length > 254) {
          newErrors.email = 'Email address is too long';
        }
      }

      // Phone Number validation
      if (formData.phoneNumber && formData.phoneNumber.trim()) {
        const phoneRegex = /^\+94\d{9}$/;
        if (!phoneRegex.test(formData.phoneNumber)) {
          newErrors.phoneNumber = 'Phone number must be in format +94XXXXXXXXX';
        }
      }

      // Date of Birth validation
      if (formData.dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(formData.dateOfBirth);
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 16 || age > 100) {
          newErrors.dateOfBirth = 'Age must be between 16 and 100 years';
        }
      }
    }

    // Step 2: Academic Details validations
    if (step === 2) {
      // GPA validation
      if (formData.gpa && (formData.gpa < 0 || formData.gpa > 4)) {
        newErrors.gpa = 'GPA must be between 0 and 4';
      }

      // Graduation Year validation
      if (formData.graduationYear) {
        const currentYear = new Date().getFullYear();
        const gradYear = parseInt(formData.graduationYear);
        if (gradYear < currentYear - 10 || gradYear > currentYear + 10) {
          newErrors.graduationYear = 'Graduation year must be within reasonable range';
        }
      }

      // Degree Program validation
      if (formData.degreeProgram && formData.degreeProgram.trim()) {
        if (formData.degreeProgram.length < 3) {
          newErrors.degreeProgram = 'Degree program must be at least 3 characters';
        } else if (formData.degreeProgram.length > 100) {
          newErrors.degreeProgram = 'Degree program must be less than 100 characters';
        }
      }

      // University validation
      if (formData.university && formData.university.trim()) {
        if (formData.university.length < 3) {
          newErrors.university = 'University name must be at least 3 characters';
        } else if (formData.university.length > 100) {
          newErrors.university = 'University name must be less than 100 characters';
        }
      }
    }

    // Step 3: Skills & Portfolio validations
    if (step === 3) {
      // Technical Skills validation
      if (formData.technicalSkills && formData.technicalSkills.trim()) {
        if (formData.technicalSkills.length < 5) {
          newErrors.technicalSkills = 'Technical skills must be at least 5 characters';
        } else if (formData.technicalSkills.length > 500) {
          newErrors.technicalSkills = 'Technical skills must be less than 500 characters';
        }
      }

      // Soft Skills validation
      if (formData.softSkills && formData.softSkills.trim()) {
        if (formData.softSkills.length < 5) {
          newErrors.softSkills = 'Soft skills must be at least 5 characters';
        } else if (formData.softSkills.length > 500) {
          newErrors.softSkills = 'Soft skills must be less than 500 characters';
        }
      }

      // Portfolio Projects validation
      if (formData.portfolioProjects && formData.portfolioProjects.trim()) {
        if (formData.portfolioProjects.length < 10) {
          newErrors.portfolioProjects = 'Portfolio projects must be at least 10 characters';
        } else if (formData.portfolioProjects.length > 1000) {
          newErrors.portfolioProjects = 'Portfolio projects must be less than 1000 characters';
        }
      }
    }

    // Step 4: Preferences & Goals validations
    if (step === 4) {
      // Hourly Rate validation
      if (formData.hourlyRate && formData.hourlyRate < 0) {
        newErrors.hourlyRate = 'Hourly rate must be positive';
      } else if (formData.hourlyRate && formData.hourlyRate > 1000) {
        newErrors.hourlyRate = 'Hourly rate must be less than $1000';
      }

      // Career Goals validation
      if (formData.careerGoals && formData.careerGoals.trim()) {
        if (formData.careerGoals.length < 10) {
          newErrors.careerGoals = 'Career goals must be at least 10 characters';
        } else if (formData.careerGoals.length > 500) {
          newErrors.careerGoals = 'Career goals must be less than 500 characters';
        }
      }

      // Availability validation
      if (formData.availability && formData.availability.trim()) {
        if (formData.availability.length < 5) {
          newErrors.availability = 'Availability must be at least 5 characters';
        } else if (formData.availability.length > 200) {
          newErrors.availability = 'Availability must be less than 200 characters';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < onboardingSteps.length) {
        setCurrentStep(currentStep + 1);
      } else {
        handleComplete();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    if (validateStep(currentStep)) {
      onComplete(formData);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <input
                  type="text"
                  autoComplete="off"
                  value={formData.firstName || ''}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your first name"
                  maxLength={50}
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <input
                  type="text"
                  autoComplete="off"
                  value={formData.lastName || ''}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your last name"
                  maxLength={50}
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                autoComplete="off"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your email address"
                maxLength={254}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phoneNumber || ''}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dateOfBirth || ''}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Degree Program *</label>
                <select
                  value={formData.degreeProgram || ''}
                  onChange={(e) => handleInputChange('degreeProgram', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                    errors.degreeProgram ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select your degree program</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Business">Business</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Communications">Communications</option>
                  <option value="Other">Other</option>
                </select>
                {errors.degreeProgram && <p className="text-red-500 text-sm mt-1">{errors.degreeProgram}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">University *</label>
                <input
                  type="text"
                  value={formData.university || ''}
                  onChange={(e) => handleInputChange('university', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                    errors.university ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your university name"
                />
                {errors.university && <p className="text-red-500 text-sm mt-1">{errors.university}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  value={formData.gpa || ''}
                  onChange={(e) => handleInputChange('gpa', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                    errors.gpa ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your GPA (0-4)"
                />
                {errors.gpa && <p className="text-red-500 text-sm mt-1">{errors.gpa}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expected Graduation Year *</label>
                <select
                  value={formData.graduationYear || ''}
                  onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                    errors.graduationYear ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select graduation year</option>
                  {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() + i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                {errors.graduationYear && <p className="text-red-500 text-sm mt-1">{errors.graduationYear}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Academic Achievements</label>
              <textarea
                value={formData.academicAchievements || ''}
                onChange={(e) => handleInputChange('academicAchievements', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                rows="3"
                placeholder="List your academic achievements, honors, or relevant coursework"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Technical Skills *</label>
              <textarea
                value={formData.technicalSkills || ''}
                onChange={(e) => handleInputChange('technicalSkills', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                  errors.technicalSkills ? 'border-red-500' : 'border-gray-300'
                }`}
                rows="3"
                placeholder="List your technical skills (e.g., JavaScript, Python, React, UI/UX Design)"
              />
              {errors.technicalSkills && <p className="text-red-500 text-sm mt-1">{errors.technicalSkills}</p>}
              <p className="text-sm text-gray-500 mt-1">Separate skills with commas</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Soft Skills</label>
              <textarea
                value={formData.softSkills || ''}
                onChange={(e) => handleInputChange('softSkills', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                rows="3"
                placeholder="List your soft skills (e.g., Communication, Leadership, Problem Solving)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio Projects</label>
              <textarea
                value={formData.portfolioProjects || ''}
                onChange={(e) => handleInputChange('portfolioProjects', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                rows="3"
                placeholder="Describe your key projects, including technologies used and outcomes"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Certifications</label>
              <textarea
                value={formData.certifications || ''}
                onChange={(e) => handleInputChange('certifications', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                rows="2"
                placeholder="List any relevant certifications or online courses completed"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Career Goals *</label>
              <textarea
                value={formData.careerGoals || ''}
                onChange={(e) => handleInputChange('careerGoals', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                  errors.careerGoals ? 'border-red-500' : 'border-gray-300'
                }`}
                rows="3"
                placeholder="Describe your short-term and long-term career goals"
              />
              {errors.careerGoals && <p className="text-red-500 text-sm mt-1">{errors.careerGoals}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Work Type *</label>
                <select
                  value={formData.preferredWorkType || ''}
                  onChange={(e) => handleInputChange('preferredWorkType', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                    errors.preferredWorkType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select work type</option>
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Flexible">Flexible</option>
                </select>
                {errors.preferredWorkType && <p className="text-red-500 text-sm mt-1">{errors.preferredWorkType}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate ($) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.50"
                  value={formData.hourlyRate || ''}
                  onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                    errors.hourlyRate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your hourly rate"
                />
                {errors.hourlyRate && <p className="text-red-500 text-sm mt-1">{errors.hourlyRate}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability *</label>
                <select
                  value={formData.availability || ''}
                  onChange={(e) => handleInputChange('availability', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                    errors.availability ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select availability</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Internship">Internship</option>
                  <option value="Project-based">Project-based</option>
                </select>
                {errors.availability && <p className="text-red-500 text-sm mt-1">{errors.availability}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location Preference</label>
                <input
                  type="text"
                  value={formData.locationPreference || ''}
                  onChange={(e) => handleInputChange('locationPreference', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                  placeholder="Preferred work location or timezone"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Complete Your Profile</h2>
              <p className="text-blue-100">Step {currentStep} of {onboardingSteps.length}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            {onboardingSteps.map((step, index) => (
              <div key={step.step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                  currentStep > step.step 
                    ? 'bg-green-500 text-white' 
                    : currentStep === step.step 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > step.step ? '✓' : step.step}
                </div>
                {index < onboardingSteps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step.step ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep - 1) / (onboardingSteps.length - 1) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {onboardingSteps[currentStep - 1].title}
            </h3>
            <p className="text-gray-600">
              {onboardingSteps[currentStep - 1].description}
            </p>
          </div>

          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium transition-all duration-200 ${
                currentStep === 1 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              Previous
            </button>

            <div className="text-sm text-gray-500">
              {currentStep === onboardingSteps.length ? 'Final Step' : `Step ${currentStep} of ${onboardingSteps.length}`}
            </div>

            <button
              onClick={handleNext}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {currentStep === onboardingSteps.length ? 'Complete Profile' : 'Next Step'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
