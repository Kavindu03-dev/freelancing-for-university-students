import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { getUserData, isAuthenticated } from '../utils/auth';

function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeProfile, setActiveProfile] = useState('current'); // 'current' or 'other'
  const [activeTab, setActiveTab] = useState('overview');
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    skills: [],
    hourlyRate: '',
    availability: 'available',
    languages: [],
    experience: '',
    education: '',
    portfolio: []
  });

  const availabilityOptions = [
    { value: 'available', label: 'Available Now', color: 'green' },
    { value: 'busy', label: 'Busy', color: 'yellow' },
    { value: 'unavailable', label: 'Unavailable', color: 'red' }
  ];

  const languageOptions = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
    'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Russian'
  ];

  const skillCategories = [
    'Web Development', 'Mobile Development', 'Design', 'Writing',
    'Marketing', 'Data Analysis', 'Video & Animation', 'Music & Audio',
    'Programming', 'Business', 'Translation', 'Other'
  ];

  // Portfolio state
  const [portfolioItems, setPortfolioItems] = useState([
    {
      id: 1,
      title: 'E-commerce Website',
      description: 'Modern responsive e-commerce site with React and Node.js',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      technologies: ['React', 'Node.js', 'MongoDB'],
      link: '#'
    },
    {
      id: 2,
      title: 'Mobile App Design',
      description: 'UI/UX design for fitness tracking mobile application',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      technologies: ['Figma', 'Adobe XD', 'Prototyping'],
      link: '#'
    },
    {
      id: 3,
      title: 'Brand Identity Package',
      description: 'Complete branding solution including logo, guidelines, and assets',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      technologies: ['Illustrator', 'Photoshop', 'InDesign'],
      link: '#'
    }
  ]);

  // Projects state
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "Blog Website Development",
      status: "active",
      budget: "$500",
      deadline: "2024-04-15",
      client: "John Doe",
      proposal: "I will create a modern blog website with WordPress customization..."
    }
  ]);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
    skills: [],
    proposal: ""
  });

  // Work history state
  const [workHistory, setWorkHistory] = useState([
    {
      id: 1,
      projectTitle: "Logo Design for Startup",
      client: "Tech Startup Inc",
      completionDate: "2024-03-10",
      rating: 5,
      review: "Excellent work! Very professional and creative design.",
      earnings: 200
    }
  ]);

  // Earnings state
  const [earnings, setEarnings] = useState({
    totalEarned: 1200,
    pendingAmount: 300,
    withdrawnAmount: 900,
    transactions: [
      {
        id: 1,
        type: "payment",
        amount: 200,
        date: "2024-03-10",
        description: "Logo Design Project"
      }
    ]
  });

  // Mock statistics
  const stats = {
    totalProjects: 47,
    completedProjects: 45,
    totalEarnings: 12450,
    clientRating: 4.9,
    responseTime: '2 hours',
    successRate: 96
  };

  // Role switching state
  const [roleSwitchRequest, setRoleSwitchRequest] = useState({
    isRequested: false,
    requestedRole: '',
    requestDate: null,
    status: 'pending' // 'pending', 'approved', 'rejected'
  });

  // Client-specific state
  const [clientProfile, setClientProfile] = useState({
    companyName: '',
    industry: '',
    projectBudget: '',
    projectTimeline: '',
    preferredSkills: [],
    projectDescription: '',
    contactPreferences: 'email'
  });

  // Freelancer-specific state
  const [freelancerProfile, setFreelancerProfile] = useState({
    hourlyRate: '',
    availability: 'available',
    portfolio: [],
    certifications: [],
    workPreferences: 'remote'
  });

  useEffect(() => {
    if (isAuthenticated()) {
      const user = getUserData();
      setUserData(user);
      setProfileData({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        location: user?.location || '',
        bio: user?.bio || '',
        skills: user?.skills || [],
        hourlyRate: user?.hourlyRate || '',
        availability: user?.availability || 'available',
        languages: user?.languages || ['English'],
        experience: user?.experience || '',
        education: user?.education || '',
        portfolio: user?.portfolio || []
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillAdd = (skill) => {
    if (!profileData.skills.includes(skill)) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleLanguageToggle = (language) => {
    setProfileData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(lang => lang !== language)
        : [...prev.languages, language]
    }));
  };

  // Project management functions
  const addProject = () => {
    if (newProject.title && newProject.description && newProject.budget) {
      const project = {
        ...newProject,
        id: Date.now(),
        status: "pending",
        skills: newProject.skills.filter(skill => skill.trim())
      };
      setProjects([...projects, project]);
      setNewProject({
        title: "",
        description: "",
        budget: "",
        deadline: "",
        skills: [],
        proposal: ""
      });
    }
  };

  const removeProject = (id) => {
    setProjects(projects.filter(project => project.id !== id));
  };

  // Portfolio management functions
  const addPortfolioItem = () => {
    // Implementation for adding portfolio items
  };

  const removePortfolioItem = (id) => {
    setPortfolioItems(portfolioItems.filter(item => item.id !== id));
  };

  // Role switching functions
  const requestRoleSwitch = (newRole) => {
    setRoleSwitchRequest({
      isRequested: true,
      requestedRole: newRole,
      requestDate: new Date(),
      status: 'pending'
    });
    // In a real app, this would send a request to the backend
    alert(`Request to become ${newRole} has been submitted and is pending approval.`);
  };

  const cancelRoleSwitchRequest = () => {
    setRoleSwitchRequest({
      isRequested: false,
      requestedRole: '',
      requestDate: null,
      status: 'pending'
    });
  };

  const getCurrentUserRole = () => {
    return userData?.userType || 'client';
  };

  const isClient = () => getCurrentUserRole() === 'client';
  const isFreelancer = () => getCurrentUserRole() === 'freelancer' || getCurrentUserRole() === 'student';

  const handleSave = () => {
    // In a real app, this would save to the backend
    localStorage.setItem('userData', JSON.stringify({
      ...userData,
      ...profileData
    }));
    setIsEditing(false);
    // Trigger auth state refresh
    window.dispatchEvent(new Event('authStateChanged'));
  };

  const getAvailabilityColor = (availability) => {
    const option = availabilityOptions.find(opt => opt.value === availability);
    return option ? option.color : 'gray';
  };

  const clientTabs = [
    { id: 'overview', name: 'Company Overview', icon: '🏢' },
    { id: 'projects', name: 'My Projects', icon: '📋' },
    { id: 'hiring', name: 'Hiring History', icon: '👥' },
    { id: 'budget', name: 'Budget & Payments', icon: '💰' },
    { id: 'preferences', name: 'Preferences', icon: '⚙️' }
  ];

  const freelancerTabs = [
    { id: 'overview', name: 'Professional Overview', icon: '👤' },
    { id: 'portfolio', name: 'Portfolio', icon: '💼' },
    { id: 'projects', name: 'Project Applications', icon: '📋' },
    { id: 'work-history', name: 'Work History', icon: '📊' },
    { id: 'earnings', name: 'Earnings & Payments', icon: '💰' },
    { id: 'stats', name: 'Statistics', icon: '📈' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ];

  const getCurrentTabs = () => {
    return isClient() ? clientTabs : freelancerTabs;
  };

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">Please log in to view your profile.</p>
          <Link to="/signin" className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      {/* Profile Header */}
      <section className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-4xl font-bold text-black">
                {userData?.firstName?.charAt(0)}{userData?.lastName?.charAt(0)}
              </div>
              <div className={`absolute -bottom-2 -right-2 w-8 h-8 bg-${getAvailabilityColor(profileData.availability)}-500 border-4 border-white rounded-full`}></div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2">
                {profileData.firstName} {profileData.lastName}
              </h1>
              <p className="text-xl text-gray-300 mb-4">
                {userData?.userType === 'student' ? 'Student Freelancer' : 'Professional Freelancer'}
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>{stats.clientRating} ({stats.completedProjects} reviews)</span>
                </div>
                
                {profileData.location && (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{profileData.location}</span>
                  </div>
                )}

                <div className={`flex items-center px-3 py-1 rounded-full bg-${getAvailabilityColor(profileData.availability)}-500`}>
                  <div className={`w-2 h-2 bg-white rounded-full mr-2`}></div>
                  <span className="text-sm font-medium">
                    {availabilityOptions.find(opt => opt.value === profileData.availability)?.label}
                  </span>
                </div>
              </div>

              {profileData.bio && (
                <p className="text-gray-300 max-w-2xl">
                  {profileData.bio}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
              {isEditing && (
                <button
                  onClick={handleSave}
                  className="bg-green-500 hover:bg-green-400 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Profile Type Navigation */}
      <section className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Profile Type Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveProfile('current')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeProfile === 'current'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {isClient() ? 'Client Profile' : 'Freelancer Profile'}
              </button>
              <button
                onClick={() => setActiveProfile('other')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeProfile === 'other'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {isClient() ? 'Freelancer Profile' : 'Client Profile'}
              </button>
            </div>

            {/* Role Switch Request */}
            {activeProfile === 'other' && (
              <div className="flex items-center space-x-3">
                {roleSwitchRequest.isRequested ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      Request to become {roleSwitchRequest.requestedRole} is pending...
                    </span>
                    <button
                      onClick={cancelRoleSwitchRequest}
                      className="text-sm text-red-600 hover:text-red-700 underline"
                    >
                      Cancel Request
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => requestRoleSwitch(isClient() ? 'freelancer' : 'client')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Request to become {isClient() ? 'Freelancer' : 'Client'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      {activeProfile === 'current' && (
        <section className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8 overflow-x-auto">
              {getCurrentTabs().map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-yellow-500 text-yellow-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tab Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Client Overview Tab */}
          {isClient() && activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Company Info */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Company Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                      <input
                        type="text"
                        value={clientProfile.companyName}
                        onChange={(e) => setClientProfile(prev => ({ ...prev, companyName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="Enter company name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                      <input
                        type="text"
                        value={clientProfile.industry}
                        onChange={(e) => setClientProfile(prev => ({ ...prev, industry: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="e.g., Technology, Healthcare"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Project Requirements</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Project Budget Range</label>
                        <select
                          value={clientProfile.projectBudget}
                          onChange={(e) => setClientProfile(prev => ({ ...prev, projectBudget: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        >
                          <option value="">Select budget range</option>
                          <option value="under-1000">Under $1,000</option>
                          <option value="1000-5000">$1,000 - $5,000</option>
                          <option value="5000-10000">$5,000 - $10,000</option>
                          <option value="10000-25000">$10,000 - $25,000</option>
                          <option value="over-25000">Over $25,000</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Project Timeline</label>
                        <select
                          value={clientProfile.projectTimeline}
                          onChange={(e) => setClientProfile(prev => ({ ...prev, projectTimeline: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        >
                          <option value="">Select timeline</option>
                          <option value="1-2-weeks">1-2 weeks</option>
                          <option value="1-month">1 month</option>
                          <option value="2-3-months">2-3 months</option>
                          <option value="3-6-months">3-6 months</option>
                          <option value="6-months-plus">6+ months</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
                      <textarea
                        value={clientProfile.projectDescription}
                        onChange={(e) => setClientProfile(prev => ({ ...prev, projectDescription: e.target.value }))}
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="Describe your project needs and requirements..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Preferences</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="contactPreferences"
                        value="email"
                        checked={clientProfile.contactPreferences === 'email'}
                        onChange={(e) => setClientProfile(prev => ({ ...prev, contactPreferences: e.target.value }))}
                        className="mr-2 text-yellow-500 focus:ring-yellow-500"
                      />
                      <span className="text-gray-700">Email</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="contactPreferences"
                        value="phone"
                        checked={clientProfile.contactPreferences === 'phone'}
                        onChange={(e) => setClientProfile(prev => ({ ...prev, contactPreferences: e.target.value }))}
                        className="mr-2 text-yellow-500 focus:ring-yellow-500"
                      />
                      <span className="text-gray-700">Phone</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="contactPreferences"
                        value="both"
                        checked={clientProfile.contactPreferences === 'both'}
                        onChange={(e) => setClientProfile(prev => ({ ...prev, contactPreferences: e.target.value }))}
                        className="mr-2 text-yellow-500 focus:ring-yellow-500"
                      />
                      <span className="text-gray-700">Both</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Freelancer Overview Tab */}
          {!isClient() && activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Info */}
              <div className="lg:col-span-2 space-y-8">
                {/* About Section */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">About Me</h3>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="Tell clients about yourself, your experience, and what makes you unique..."
                    />
                  ) : (
                    <p className="text-gray-600 leading-relaxed">
                      {profileData.bio || 'No bio available. Click "Edit Profile" to add one.'}
                    </p>
                  )}
                </div>

                {/* Skills Section */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Skills</h3>
                  {isEditing ? (
                    <div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                        {skillCategories.map((skill) => (
                          <button
                            key={skill}
                            onClick={() => handleSkillAdd(skill)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              profileData.skills.includes(skill)
                                ? 'bg-yellow-500 text-black'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.length > 0 ? (
                      profileData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium ${
                            isEditing ? 'cursor-pointer hover:bg-red-100 hover:text-red-800' : ''
                          }`}
                          onClick={isEditing ? () => handleSkillRemove(skill) : undefined}
                        >
                          {skill} {isEditing && '×'}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">No skills listed yet.</p>
                    )}
                  </div>
                </div>

                {/* Experience Section */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Experience</h3>
                  {isEditing ? (
                    <textarea
                      name="experience"
                      value={profileData.experience}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="Describe your work experience, previous projects, and achievements..."
                    />
                  ) : (
                    <p className="text-gray-600 leading-relaxed">
                      {profileData.experience || 'No experience information available.'}
                    </p>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Contact Info */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    {isEditing ? (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                          <input
                            type="tel"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                          <input
                            type="text"
                            name="location"
                            value={profileData.location}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            placeholder="City, Country"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate ($)</label>
                          <input
                            type="number"
                            name="hourlyRate"
                            value={profileData.hourlyRate}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            placeholder="50"
                            min="1"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="text-gray-600">{profileData.email}</span>
                        </div>
                        {profileData.phone && (
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="text-gray-600">{profileData.phone}</span>
                          </div>
                        )}
                        {profileData.hourlyRate && (
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            <span className="text-gray-600">${profileData.hourlyRate}/hour</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Languages */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Languages</h3>
                  {isEditing ? (
                    <div className="space-y-2">
                      {languageOptions.map((language) => (
                        <label key={language} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={profileData.languages.includes(language)}
                            onChange={() => handleLanguageToggle(language)}
                            className="mr-2 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                          />
                          <span className="text-gray-700">{language}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profileData.languages.map((language, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {language}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Availability */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Availability</h3>
                  {isEditing ? (
                    <select
                      name="availability"
                      value={profileData.availability}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      {availabilityOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className={`inline-flex items-center px-3 py-2 rounded-full bg-${getAvailabilityColor(profileData.availability)}-100 text-${getAvailabilityColor(profileData.availability)}-800`}>
                      <div className={`w-2 h-2 bg-${getAvailabilityColor(profileData.availability)}-500 rounded-full mr-2`}></div>
                      <span className="text-sm font-medium">
                        {availabilityOptions.find(opt => opt.value === profileData.availability)?.label}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Portfolio Tab */}
          {activeTab === 'portfolio' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Portfolio</h2>
                <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-lg font-semibold transition-colors">
                  Add Project
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {portfolioItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                      <p className="text-gray-600 mb-4">{item.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.technologies.map((tech, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                            {tech}
                          </span>
                        ))}
                      </div>
                      
                      <a
                        href={item.link}
                        className="text-yellow-600 hover:text-yellow-500 font-medium flex items-center"
                      >
                        View Project
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Client Projects Tab */}
          {isClient() && activeTab === 'projects' && (
            <div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Post New Project</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                    <input
                      type="text"
                      placeholder="Enter project title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
                      <option value="">Select budget range</option>
                      <option value="under-1000">Under $1,000</option>
                      <option value="1000-5000">$1,000 - $5,000</option>
                      <option value="5000-10000">$5,000 - $10,000</option>
                      <option value="10000-25000">$10,000 - $25,000</option>
                      <option value="over-25000">Over $25,000</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timeline</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
                      <option value="">Select timeline</option>
                      <option value="1-2-weeks">1-2 weeks</option>
                      <option value="1-month">1 month</option>
                      <option value="2-3-months">2-3 months</option>
                      <option value="3-6-months">3-6 months</option>
                      <option value="6-months-plus">6+ months</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills</label>
                    <input
                      type="text"
                      placeholder="e.g., React, Node.js, UI/UX Design"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
                    <textarea
                      rows="4"
                      placeholder="Describe your project requirements, goals, and any specific details..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <button className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600">
                    Post Project
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">My Posted Projects</h3>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="text-center text-gray-500 py-8">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-lg font-medium">No projects posted yet</p>
                    <p className="text-sm">Start by posting your first project above</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Freelancer Projects Tab */}
          {!isClient() && activeTab === 'projects' && (
            <div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit New Project Proposal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                    <input
                      type="text"
                      value={newProject.title}
                      onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget ($)</label>
                    <input
                      type="number"
                      value={newProject.budget}
                      onChange={(e) => setNewProject(prev => ({ ...prev, budget: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                    <input
                      type="date"
                      value={newProject.deadline}
                      onChange={(e) => setNewProject(prev => ({ ...prev, deadline: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills</label>
                    <input
                      type="text"
                      placeholder="Add skills (comma separated)"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const skills = e.target.value.split(',').map(s => s.trim());
                          setNewProject(prev => ({ ...prev, skills: [...prev.skills, ...skills] }));
                          e.target.value = '';
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
                    <textarea
                      value={newProject.description}
                      onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Proposal</label>
                    <textarea
                      value={newProject.proposal}
                      onChange={(e) => setNewProject(prev => ({ ...prev, proposal: e.target.value }))}
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Explain why you're the best fit for this project..."
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={addProject}
                    className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600"
                  >
                    Submit Proposal
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">{project.title}</h4>
                        <p className="text-gray-600 mt-1">{project.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        project.status === 'active' ? 'bg-green-100 text-green-800' :
                        project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-gray-500">Budget:</span>
                        <p className="font-medium">{project.budget}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Deadline:</span>
                        <p className="font-medium">{project.deadline}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Client:</span>
                        <p className="font-medium">{project.client}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Skills:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {project.skills.map((skill, index) => (
                            <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <h5 className="font-medium text-gray-900 mb-2">Proposal:</h5>
                      <p className="text-gray-600 text-sm">{project.proposal}</p>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => removeProject(project.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Client Hiring History Tab */}
          {isClient() && activeTab === 'hiring' && (
            <div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hiring History</h3>
                <div className="space-y-4">
                  <div className="text-center text-gray-500 py-8">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-lg font-medium">No hiring history yet</p>
                    <p className="text-sm">Start by posting projects and hiring freelancers</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Client Budget Tab */}
          {isClient() && activeTab === 'budget' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Spent</h3>
                  <p className="text-3xl font-bold text-red-600">$0</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Projects</h3>
                  <p className="text-3xl font-bold text-blue-600">0</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Completed Projects</h3>
                  <p className="text-3xl font-bold text-green-600">0</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
                <div className="space-y-4">
                  <div className="text-center text-gray-500 py-8">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <p className="text-lg font-medium">No payment methods added</p>
                    <p className="text-sm">Add a payment method to start hiring freelancers</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Client Preferences Tab */}
          {isClient() && activeTab === 'preferences' && (
            <div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Preferences</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Communication Preferences</h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500" defaultChecked />
                        <span className="text-gray-700">Email notifications for project updates</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500" defaultChecked />
                        <span className="text-gray-700">SMS notifications for urgent matters</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500" />
                        <span className="text-gray-700">Weekly progress reports</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Project Preferences</h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500" defaultChecked />
                        <span className="text-gray-700">Prefer experienced freelancers</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500" />
                        <span className="text-gray-700">Require portfolio review</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500" defaultChecked />
                        <span className="text-gray-700">Prefer milestone-based payments</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Freelancer Work History Tab */}
          {!isClient() && activeTab === 'work-history' && (
            <div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Work History & Reviews</h3>
                <div className="space-y-4">
                  {workHistory.map((work) => (
                    <div key={work.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{work.projectTitle}</h4>
                          <p className="text-gray-600 text-sm">Client: {work.client}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">${work.earnings}</p>
                          <p className="text-gray-500 text-sm">{work.completionDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-600">Rating:</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < work.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-700 text-sm italic">"{work.review}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Earnings Tab */}
          {activeTab === 'earnings' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Earned</h3>
                  <p className="text-3xl font-bold text-green-600">${earnings.totalEarned}</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending Amount</h3>
                  <p className="text-3xl font-bold text-yellow-600">${earnings.pendingAmount}</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Withdrawn</h3>
                  <p className="text-3xl font-bold text-blue-600">${earnings.withdrawnAmount}</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction History</h3>
                <div className="space-y-3">
                  {earnings.transactions.map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center py-3 border-b last:border-b-0">
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500">{transaction.date}</p>
                      </div>
                      <div className="text-right">
                        <span className={`font-semibold ${
                          transaction.type === 'payment' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'payment' ? '+' : '-'}${transaction.amount}
                        </span>
                        <p className="text-xs text-gray-500 capitalize">{transaction.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Withdraw Funds</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount ($)</label>
                    <input
                      type="number"
                      placeholder="Enter amount to withdraw"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
                      <option value="">Select Payment Method</option>
                      <option value="bank">Bank Transfer</option>
                      <option value="paypal">PayPal</option>
                      <option value="stripe">Stripe</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <button className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600">
                    Request Withdrawal
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Statistics Tab */}
          {activeTab === 'stats' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Statistics & Analytics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.totalProjects}</div>
                  <div className="text-gray-600">Total Projects</div>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{stats.completedProjects}</div>
                  <div className="text-gray-600">Completed</div>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">${stats.totalEarnings.toLocaleString()}</div>
                  <div className="text-gray-600">Total Earnings</div>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{stats.clientRating}</div>
                  <div className="text-gray-600">Client Rating</div>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">{stats.responseTime}</div>
                  <div className="text-gray-600">Avg Response Time</div>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">{stats.successRate}%</div>
                  <div className="text-gray-600">Success Rate</div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-800">Project completed: E-commerce Website</p>
                      <p className="text-sm text-gray-500">2 days ago</p>
                    </div>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Completed</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-800">New client message received</p>
                      <p className="text-sm text-gray-500">1 week ago</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Message</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-gray-800">Profile viewed by 12 potential clients</p>
                      <p className="text-sm text-gray-500">2 weeks ago</p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">Views</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Account Settings</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={profileData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={profileData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>
                    
                    <button
                      onClick={handleSave}
                      className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Notification Preferences</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500" defaultChecked />
                        <span className="text-gray-700">Email notifications for new messages</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500" defaultChecked />
                        <span className="text-gray-700">Project updates and milestones</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500" />
                        <span className="text-gray-700">Marketing emails and promotions</span>
                      </label>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Privacy Settings</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500" defaultChecked />
                        <span className="text-gray-700">Make profile visible to clients</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500" />
                        <span className="text-gray-700">Show online status</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500" defaultChecked />
                        <span className="text-gray-700">Allow direct contact from clients</span>
                      </label>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-red-800 mb-4">Danger Zone</h3>
                    <p className="text-red-600 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button className="bg-red-500 hover:bg-red-400 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other Profile Content */}
          {activeProfile === 'other' && (
            <div className="text-center py-16">
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl text-white">
                      {isClient() ? '💼' : '🏢'}
                    </span>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {isClient() ? 'Freelancer Profile' : 'Client Profile'}
                  </h2>
                  
                  <p className="text-gray-600 mb-6">
                    {isClient() 
                      ? "You're currently viewing the freelancer profile. To access freelancer features, you need to request a role switch."
                      : "You're currently viewing the client profile. To access client features, you need to request a role switch."
                    }
                  </p>

                  {roleSwitchRequest.isRequested ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center justify-center space-x-2 text-blue-800">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">
                          Request to become {roleSwitchRequest.requestedRole} is pending approval
                        </span>
                      </div>
                      <p className="text-sm text-blue-600 mt-2 text-center">
                        Requested on: {roleSwitchRequest.requestDate?.toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-medium text-gray-800 mb-2">
                          {isClient() ? 'What you can do as a Freelancer:' : 'What you can do as a Client:'}
                        </h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {isClient() ? [
                            '• Browse and apply for projects',
                            '• Build your portfolio',
                            '• Set your hourly rates',
                            '• Manage client relationships',
                            '• Track earnings and payments'
                          ] : [
                            '• Post projects and hire freelancers',
                            '• Review proposals and portfolios',
                            '• Manage project budgets',
                            '• Track project progress',
                            '• Rate and review freelancers'
                          ]}
                        </ul>
                      </div>
                      
                      <button
                        onClick={() => requestRoleSwitch(isClient() ? 'freelancer' : 'client')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                      >
                        Request to become {isClient() ? 'Freelancer' : 'Client'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default ProfilePage;
