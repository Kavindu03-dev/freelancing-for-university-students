import React, { useState, useEffect } from 'react';

const OnboardingWizard = ({ isOpen, onClose, onComplete, currentProfileData, profileCompleteness }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [stepDirection, setStepDirection] = useState('next');

  const onboardingSteps = [
    {
      step: 1,
      title: "Basic Information",
      description: "Tell us about yourself",
      completion: 25,
      fields: ['firstName', 'lastName', 'email', 'phoneNumber', 'dateOfBirth'],
      requiredFields: ['firstName', 'lastName', 'email']
    },
    {
      step: 2,
      title: "Academic Details",
      description: "Your educational background",
      completion: 50,
      fields: ['degreeProgram', 'university', 'gpa', 'graduationYear', 'academicAchievements'],
      requiredFields: ['degreeProgram', 'university', 'graduationYear']
    },
    {
      step: 3,
      title: "Skills & Portfolio",
      description: "Showcase your expertise",
      completion: 75,
      fields: ['technicalSkills', 'softSkills', 'portfolioProjects', 'certifications'],
      requiredFields: ['technicalSkills']
    },
    {
      step: 4,
      title: "Preferences & Goals",
      description: "Set your career objectives",
      completion: 100,
      fields: ['careerGoals', 'preferredWorkType', 'hourlyRate', 'availability', 'locationPreference'],
      requiredFields: ['careerGoals', 'preferredWorkType', 'hourlyRate', 'availability']
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
    const stepData = onboardingSteps[step - 1];
    const requiredFields = stepData.requiredFields;
    const newErrors = {};

    // Only validate required fields
    requiredFields.forEach(field => {
      if (!formData[field] || (typeof formData[field] === 'string' && formData[field].trim() === '')) {
        newErrors[field] = `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
      }
    });

    // Special validations
    if (step === 2 && formData.gpa && (formData.gpa < 0 || formData.gpa > 4)) {
      newErrors.gpa = 'GPA must be between 0 and 4';
    }

    if (step === 4 && formData.hourlyRate && formData.hourlyRate < 0) {
      newErrors.hourlyRate = 'Hourly rate must be positive';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (validateStep(currentStep)) {
      if (currentStep < onboardingSteps.length) {
        setIsAnimating(true);
        setStepDirection('next');
        await new Promise(resolve => setTimeout(resolve, 150));
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      } else {
        handleComplete();
      }
    }
  };

  const handlePrevious = async () => {
    if (currentStep > 1) {
      setIsAnimating(true);
      setStepDirection('prev');
      await new Promise(resolve => setTimeout(resolve, 150));
      setCurrentStep(currentStep - 1);
      setIsAnimating(false);
    }
  };

  const handleComplete = () => {
    if (validateStep(currentStep)) {
      onComplete(formData);
    }
  };

  const renderStepContent = () => {
    const stepContent = (() => {
      switch (currentStep) {
        case 1:
          return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <label className="block text-sm font-medium text-black mb-2">First Name *</label>
                  <input
                    type="text"
                    value={formData.firstName || ''}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400 ${
                      errors.firstName ? 'border-red-500' : 'border-gray-400'
                    }`}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1 animate-shake">{errors.firstName}</p>}
                </div>
                
                <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <label className="block text-sm font-medium text-black mb-2">Last Name *</label>
                  <input
                    type="text"
                    value={formData.lastName || ''}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400 ${
                      errors.lastName ? 'border-red-500' : 'border-gray-400'
                    }`}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1 animate-shake">{errors.lastName}</p>}
                </div>
              </div>

              <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <label className="block text-sm font-medium text-black mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400 ${
                    errors.email ? 'border-red-500' : 'border-gray-400'
                  }`}
                  placeholder="Enter your email address"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1 animate-shake">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                   <label className="block text-sm font-medium text-black mb-2">Phone Number</label>
                   <input
                     type="tel"
                     value={formData.phoneNumber || ''}
                     onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                     className="w-full px-4 py-3 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400"
                     placeholder="Enter your phone number"
                   />
                 </div>
                 
                 <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                   <label className="block text-sm font-medium text-black mb-2">Date of Birth</label>
                   <input
                     type="date"
                     value={formData.dateOfBirth || ''}
                     onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                     className="w-full px-4 py-3 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400"
                   />
                 </div>
              </div>
            </div>
          );

        case 2:
          return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <label className="block text-sm font-medium text-black mb-2">Degree Program *</label>
                  <select
                    value={formData.degreeProgram || ''}
                    onChange={(e) => handleInputChange('degreeProgram', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400 ${
                      errors.degreeProgram ? 'border-red-500' : 'border-gray-400'
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
                  {errors.degreeProgram && <p className="text-red-500 text-sm mt-1 animate-shake">{errors.degreeProgram}</p>}
                </div>
                
                <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <label className="block text-sm font-medium text-black mb-2">University *</label>
                  <input
                    type="text"
                    value={formData.university || ''}
                    onChange={(e) => handleInputChange('university', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400 ${
                      errors.university ? 'border-red-500' : 'border-gray-400'
                    }`}
                    placeholder="Enter your university name"
                  />
                  {errors.university && <p className="text-red-500 text-sm mt-1 animate-shake">{errors.university}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <label className="block text-sm font-medium text-black mb-2">GPA</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    value={formData.gpa || ''}
                    onChange={(e) => handleInputChange('gpa', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400 ${
                      errors.gpa ? 'border-red-500' : 'border-gray-400'
                    }`}
                    placeholder="Enter your GPA (0-4)"
                  />
                  {errors.gpa && <p className="text-red-500 text-sm mt-1 animate-shake">{errors.gpa}</p>}
                </div>
                
                <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <label className="block text-sm font-medium text-black mb-2">Expected Graduation Year *</label>
                  <select
                    value={formData.graduationYear || ''}
                    onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400 ${
                      errors.graduationYear ? 'border-red-500' : 'border-gray-400'
                    }`}
                  >
                    <option value="">Select graduation year</option>
                    {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() + i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  {errors.graduationYear && <p className="text-red-500 text-sm mt-1 animate-shake">{errors.graduationYear}</p>}
                </div>
              </div>

              <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <label className="block text-sm font-medium text-black mb-2">Academic Achievements</label>
                <textarea
                  value={formData.academicAchievements || ''}
                  onChange={(e) => handleInputChange('academicAchievements', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400"
                  rows="3"
                  placeholder="List your academic achievements, honors, or relevant coursework"
                />
              </div>
            </div>
          );

        case 3:
          return (
            <div className="space-y-6">
              <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <label className="block text-sm font-medium text-black mb-2">Technical Skills *</label>
                <textarea
                  value={formData.technicalSkills || ''}
                  onChange={(e) => handleInputChange('technicalSkills', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400 ${
                    errors.technicalSkills ? 'border-red-500' : 'border-gray-400'
                  }`}
                  rows="3"
                  placeholder="List your technical skills (e.g., JavaScript, Python, React, UI/UX Design)"
                />
                {errors.technicalSkills && <p className="text-red-500 text-sm mt-1 animate-shake">{errors.technicalSkills}</p>}
                <p className="text-sm text-black mt-1">Separate skills with commas</p>
              </div>

              <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <label className="block text-sm font-medium text-black mb-2">Soft Skills</label>
                <textarea
                  value={formData.softSkills || ''}
                  onChange={(e) => handleInputChange('softSkills', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400"
                  rows="3"
                  placeholder="List your soft skills (e.g., Communication, Leadership, Problem Solving)"
                />
              </div>

              <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <label className="block text-sm font-medium text-black mb-2">Portfolio Projects</label>
                <textarea
                  value={formData.portfolioProjects || ''}
                  onChange={(e) => handleInputChange('portfolioProjects', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400"
                  rows="3"
                  placeholder="Describe your key projects, including technologies used and outcomes"
                />
              </div>

              <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <label className="block text-sm font-medium text-black mb-2">Certifications</label>
                <textarea
                  value={formData.certifications || ''}
                  onChange={(e) => handleInputChange('certifications', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400"
                  rows="2"
                  placeholder="List any relevant certifications or online courses completed"
                />
              </div>
            </div>
          );

        case 4:
          return (
            <div className="space-y-6">
              <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <label className="block text-sm font-medium text-black mb-2">Career Goals *</label>
                <textarea
                  value={formData.careerGoals || ''}
                  onChange={(e) => handleInputChange('careerGoals', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400 ${
                    errors.careerGoals ? 'border-red-500' : 'border-gray-400'
                  }`}
                  rows="3"
                  placeholder="Describe your short-term and long-term career goals"
                />
                {errors.careerGoals && <p className="text-red-500 text-sm mt-1 animate-shake">{errors.careerGoals}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <label className="block text-sm font-medium text-black mb-2">Preferred Work Type *</label>
                  <select
                    value={formData.preferredWorkType || ''}
                    onChange={(e) => handleInputChange('preferredWorkType', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400 ${
                      errors.preferredWorkType ? 'border-red-500' : 'border-gray-400'
                    }`}
                  >
                    <option value="">Select work type</option>
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                  {errors.preferredWorkType && <p className="text-red-500 text-sm mt-1 animate-shake">{errors.preferredWorkType}</p>}
                </div>
                
                <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <label className="block text-sm font-medium text-black mb-2">Hourly Rate ($) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.50"
                    value={formData.hourlyRate || ''}
                    onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400 ${
                      errors.hourlyRate ? 'border-red-500' : 'border-gray-400'
                    }`}
                    placeholder="Enter your hourly rate"
                  />
                  {errors.hourlyRate && <p className="text-red-500 text-sm mt-1 animate-shake">{errors.hourlyRate}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <label className="block text-sm font-medium text-black mb-2">Availability *</label>
                  <select
                    value={formData.availability || ''}
                    onChange={(e) => handleInputChange('availability', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400 ${
                      errors.availability ? 'border-red-500' : 'border-gray-400'
                    }`}
                  >
                    <option value="">Select availability</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                    <option value="Project-based">Project-based</option>
                  </select>
                  {errors.availability && <p className="text-red-500 text-sm mt-1 animate-shake">{errors.availability}</p>}
                </div>
                
                <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                  <label className="block text-sm font-medium text-black mb-2">Location Preference</label>
                  <input
                    type="text"
                    value={formData.locationPreference || ''}
                    onChange={(e) => handleInputChange('locationPreference', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400"
                    placeholder="Preferred work location or timezone"
                  />
                </div>
              </div>
            </div>
          );

        default:
          return null;
      }
    })();

    return (
      <div 
        key={currentStep}
        className={`transition-all duration-500 ease-in-out ${
          isAnimating 
            ? stepDirection === 'next' 
              ? 'opacity-0 translate-x-8' 
              : 'opacity-0 -translate-x-8'
            : 'opacity-100 translate-x-0'
        }`}
      >
        {stepContent}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-300 animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black p-6 rounded-t-2xl animate-slide-in-down">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Complete Your Profile</h2>
              <p className="text-black/70">Step {currentStep} of {onboardingSteps.length}</p>
            </div>
            <button
              onClick={onClose}
              className="text-black hover:text-black/70 transition-all duration-300 hover:scale-110 transform"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="p-6 border-b border-gray-300 bg-white/70 backdrop-blur-sm animate-slide-in-down" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-4">
            {onboardingSteps.map((step, index) => (
              <div key={step.step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ease-in-out transform hover:scale-110 ${
                  currentStep > step.step 
                    ? 'bg-green-500 text-white' 
                    : currentStep === step.step 
                    ? 'bg-yellow-500 text-black' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {currentStep > step.step ? '✓' : step.step}
                </div>
                {index < onboardingSteps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 transition-all duration-500 ease-in-out ${
                    currentStep > step.step ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-yellow-500 to-green-500 h-2 rounded-full transition-all duration-1000 ease-out transform origin-left"
              style={{ width: `${(currentStep - 1) / (onboardingSteps.length - 1) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6 bg-white/50 backdrop-blur-sm animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-black mb-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              {onboardingSteps[currentStep - 1].title}
            </h3>
            <p className="text-gray-700 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              {onboardingSteps[currentStep - 1].description}
            </p>
          </div>

          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-300 bg-gradient-to-r from-gray-100/90 to-gray-200/90 backdrop-blur-sm rounded-b-2xl animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`px-6 py-3 border-2 border-gray-400 text-gray-700 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                currentStep === 1 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-gray-100 hover:border-gray-500 hover:text-black'
              }`}
            >
              Previous
            </button>

            <div className="text-sm text-black font-medium animate-pulse">
              {currentStep === onboardingSteps.length ? 'Final Step' : `Step ${currentStep} of ${onboardingSteps.length}`}
            </div>

            <button
              onClick={handleNext}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-xl font-medium transition-all duration-300 hover:from-yellow-600 hover:to-yellow-700 transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-xl active:scale-95"
            >
              {currentStep === onboardingSteps.length ? 'Complete Profile' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
