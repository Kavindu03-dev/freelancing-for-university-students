import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

function StudentManagementSystem() {
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Profile state
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    university: "",
    major: "",
    graduationYear: "",
    skills: [],
    bio: "",
    hourlyRate: "",
    availability: "full-time"
  });

  // Portfolio state
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [newPortfolioItem, setNewPortfolioItem] = useState({
    title: "",
    description: "",
    category: "",
    skills: [],
    imageUrl: "",
    projectUrl: "",
    completionDate: ""
  });

  // Projects state
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
    skills: [],
    proposal: ""
  });

  // Work history state
  const [workHistory, setWorkHistory] = useState([]);

  // Earnings state
  const [earnings, setEarnings] = useState({
    totalEarned: 0,
    pendingAmount: 0,
    withdrawnAmount: 0,
    transactions: []
  });

  // Loading states
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingSkills, setIsUpdatingSkills] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  
  // Messages
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
  const [skillsMessage, setSkillsMessage] = useState({ type: '', text: '' });
  
  // Profile display control
  const [showProfileSummary, setShowProfileSummary] = useState(() => {
    // Check localStorage for user preference
    const saved = localStorage.getItem('showProfileSummary');
    return saved ? JSON.parse(saved) : false;
  });
  const [lastProfileLoad, setLastProfileLoad] = useState(null);

  // Function to format phone number for display
  const formatPhoneForDisplay = (phone) => {
    if (!phone) return 'Not specified';
    
    // If phone already has country code (starts with +), format it nicely
    if (phone.startsWith('+')) {
      const countryCode = phone.substring(0, 3); // Most country codes are 2-3 digits
      const number = phone.substring(3);
      
      // Format based on length
      if (number.length === 10) {
        // US/Canada format: (XXX) XXX-XXXX
        return `${countryCode} (${number.substring(0, 3)}) ${number.substring(3, 6)}-${number.substring(6)}`;
      } else if (number.length === 11) {
        // Some countries with 11 digits
        return `${countryCode} ${number.substring(0, 4)} ${number.substring(4, 7)} ${number.substring(7)}`;
      } else if (number.length === 9) {
        // Some countries with 9 digits
        return `${countryCode} ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`;
      } else {
        // Generic format for other lengths
        return `${countryCode} ${number}`;
      }
    }
    
    // If no country code, return as is
    return phone;
  };

  useEffect(() => {
    // Load user data from localStorage
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      const user = JSON.parse(userDataStr);
      setUserData(user);
      setProfileData(prev => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
        country: user.country || "",
        skills: user.skills || [],
        bio: user.bio || "",
        hourlyRate: user.hourlyRate || "",
        experience: user.experience || "",
        education: user.education || "",
        category: user.category || ""
      }));
    }

    // Load profile data from backend
    loadProfileFromBackend();
    
    // Load mock data for demonstration
    loadMockData();
    
    // Show profile summary by default on first load
    setTimeout(() => setShowProfileSummary(true), 1000);
  }, []);

  // Effect to show profile summary when profile data changes
  useEffect(() => {
    if (profileData.firstName && profileData.lastName) {
      setShowProfileSummary(true);
    }
  }, [profileData]);

  // Effect to save profile summary preference to localStorage
  useEffect(() => {
    localStorage.setItem('showProfileSummary', JSON.stringify(showProfileSummary));
  }, [showProfileSummary]);

  const loadProfileFromBackend = async () => {
    try {
      setIsLoadingProfile(true);
      const token = localStorage.getItem('userToken');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/student/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (result.success && result.data) {
        const profile = result.data;
        setProfileData(prev => ({
          ...prev,
          firstName: profile.firstName || "",
          lastName: profile.lastName || "",
          email: profile.email || "",
          phone: profile.phoneNumber || "",
          country: profile.country || "",
          skills: profile.skills || [],
          bio: profile.bio || "",
          hourlyRate: profile.hourlyRate || "",
          experience: profile.experience || "",
          education: profile.education || "",
          category: profile.category || ""
        }));
        
        // Show profile summary after loading data
        setShowProfileSummary(true);
        
        // Set last load timestamp
        setLastProfileLoad(new Date());
        
        // Show success message
        setProfileMessage({ type: 'success', text: 'Profile data refreshed successfully!' });
        setTimeout(() => setProfileMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      console.error('Error loading profile from backend:', error);
      setProfileMessage({ type: 'error', text: 'Failed to refresh profile data' });
      setTimeout(() => setProfileMessage({ type: '', text: '' }), 5000);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const loadMockData = () => {
    // Mock portfolio items
    setPortfolioItems([
      {
        id: 1,
        title: "E-commerce Website",
        description: "Full-stack e-commerce platform built with React and Node.js",
        category: "Web Development",
        skills: ["React", "Node.js", "MongoDB"],
        imageUrl: "https://via.placeholder.com/300x200",
        projectUrl: "https://example.com",
        completionDate: "2024-01-15"
      }
    ]);

    // Mock projects
    setProjects([
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

    // Mock work history
    setWorkHistory([
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

    // Mock earnings
    setEarnings({
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
  };

  const handleProfileUpdate = async () => {
    try {
      setIsUpdatingProfile(true);
      const token = localStorage.getItem('userToken');
      if (!token) {
        alert('Please log in to update your profile');
        return;
      }

      // Prepare data for backend
      const updateData = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        bio: profileData.bio,
        skills: profileData.skills,
        hourlyRate: parseFloat(profileData.hourlyRate) || 0,
        experience: `${profileData.university ? `University: ${profileData.university}` : ''}${profileData.major ? `, Major: ${profileData.major}` : ''}${profileData.graduationYear ? `, Graduation Year: ${profileData.graduationYear}` : ''}`.replace(/^,\s*/, ''),
        education: `${profileData.university ? `University: ${profileData.university}` : ''}${profileData.major ? `, Major: ${profileData.major}` : ''}${profileData.graduationYear ? `, Graduation Year: ${profileData.graduationYear}` : ''}`.replace(/^,\s*/, ''),
        category: profileData.availability === 'full-time' ? 'Web Development' : 'Other' // Default category
      };

      const response = await fetch('http://localhost:5000/api/student/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      const result = await response.json();

      if (result.success) {
        // Update local storage with new data
        const currentUserData = JSON.parse(localStorage.getItem('userData'));
        const updatedUserData = { ...currentUserData, ...updateData };
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
        
        // Update userData state
        setUserData(updatedUserData);
        
        setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
        // Auto-hide profile summary after 10 seconds
        setTimeout(() => {
          setProfileMessage({ type: '', text: '' });
          setShowProfileSummary(false);
        }, 10000);
      } else {
        setProfileMessage({ type: 'error', text: result.message || "Failed to update profile" });
        setTimeout(() => setProfileMessage({ type: '', text: '' }), 5000);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const addPortfolioItem = () => {
    if (newPortfolioItem.title && newPortfolioItem.description) {
      const item = {
        ...newPortfolioItem,
        id: Date.now(),
        skills: newPortfolioItem.skills.filter(skill => skill.trim())
      };
      setPortfolioItems([...portfolioItems, item]);
      setNewPortfolioItem({
        title: "",
        description: "",
        category: "",
        skills: [],
        imageUrl: "",
        projectUrl: "",
        completionDate: ""
      });
    }
  };

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

  const removePortfolioItem = (id) => {
    setPortfolioItems(portfolioItems.filter(item => item.id !== id));
  };

  const removeProject = (id) => {
    setProjects(projects.filter(project => project.id !== id));
  };

  const addSkill = (field, skill) => {
    if (skill.trim() && !profileData[field].includes(skill.trim())) {
      setProfileData(prev => ({
        ...prev,
        [field]: [...prev[field], skill.trim()]
      }));
    }
  };

  const updateSkillsInBackend = async (newSkills) => {
    try {
      setIsUpdatingSkills(true);
      const token = localStorage.getItem('userToken');
      if (!token) {
        alert('Please log in to update skills');
        return;
      }

      const response = await fetch('http://localhost:5000/api/student/skills', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ skills: newSkills })
      });

      const result = await response.json();

      if (result.success) {
        // Update local storage
        const currentUserData = JSON.parse(localStorage.getItem('userData'));
        const updatedUserData = { ...currentUserData, skills: newSkills };
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
        
        // Update userData state
        setUserData(updatedUserData);
        
        setSkillsMessage({ type: 'success', text: 'Skills updated successfully!' });
        // Auto-hide skills summary after 8 seconds
        setTimeout(() => setSkillsMessage({ type: '', text: '' }), 8000);
      } else {
        setSkillsMessage({ type: 'error', text: result.message || 'Failed to update skills' });
        setTimeout(() => setSkillsMessage({ type: '', text: '' }), 5000);
      }
    } catch (error) {
      console.error('Error updating skills in backend:', error);
    } finally {
      setIsUpdatingSkills(false);
    }
  };

  const removeSkill = (field, skillToRemove) => {
    setProfileData(prev => ({
      ...prev,
      [field]: prev[field].filter(skill => skill !== skillToRemove)
    }));
  };

  const handleLogout = () => {
    logout(navigate);
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowProfileSummary(!showProfileSummary)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium underline"
            >
              {showProfileSummary ? 'Hide Profile Summary' : 'View Current Profile'}
            </button>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={showProfileSummary}
                onChange={(e) => setShowProfileSummary(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Always show
            </label>
            <button
              onClick={loadProfileFromBackend}
              disabled={isLoadingProfile}
              className={`text-sm font-medium underline ${
                isLoadingProfile 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-green-600 hover:text-green-700'
              }`}
              title="Refresh profile data from server"
            >
              {isLoadingProfile ? '⏳ Loading...' : '↻ Refresh'}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              value={profileData.firstName}
              onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              value={profileData.lastName}
              onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={profileData.email}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Enter phone number with country code (e.g., +1234567890)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
            {profileData.phone && (
              <p className="mt-1 text-xs text-gray-500">
                Display format: {formatPhoneForDisplay(profileData.phone)}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
            <input
              type="text"
              value={profileData.country}
              onChange={(e) => setProfileData(prev => ({ ...prev, country: e.target.value }))}
              placeholder="Enter your country"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              value={profileData.location}
              onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate ($)</label>
            <input
              type="number"
              value={profileData.hourlyRate}
              onChange={(e) => setProfileData(prev => ({ ...prev, hourlyRate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">University</label>
            <input
              type="text"
              value={profileData.university}
              onChange={(e) => setProfileData(prev => ({ ...prev, university: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Major</label>
            <input
              type="text"
              value={profileData.major}
              onChange={(e) => setProfileData(prev => ({ ...prev, major: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
            <input
              type="number"
              value={profileData.graduationYear}
              onChange={(e) => setProfileData(prev => ({ ...prev, graduationYear: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
            <select
              value={profileData.availability}
              onChange={(e) => setProfileData(prev => ({ ...prev, availability: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="freelance">Freelance</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSkillsMessage({ type: 'success', text: 'Showing current skills' })}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium underline"
            >
              View Current Skills
            </button>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={skillsMessage.type === 'success'}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSkillsMessage({ type: 'success', text: 'Showing current skills' });
                  } else {
                    setSkillsMessage({ type: '', text: '' });
                  }
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Always show
            </label>
          </div>
        </div>
        
        {/* Skills Update Message */}
        {skillsMessage.text && (
          <div className={`p-3 rounded-lg mb-4 ${
            skillsMessage.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {skillsMessage.text}
          </div>
        )}
        <div className="mb-4">
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Add a skill"
              disabled={isUpdatingSkills}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const newSkill = e.target.value.trim();
                  if (newSkill) {
                    addSkill('skills', newSkill);
                    // Update skills in backend immediately
                    const newSkills = [...profileData.skills, newSkill];
                    updateSkillsInBackend(newSkills);
                    e.target.value = '';
                  }
                }
              }}
              className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                isUpdatingSkills ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            />
            {isUpdatingSkills && (
              <div className="flex items-center text-gray-500 text-sm">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-500 mr-2"></div>
                Updating...
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {profileData.skills.map((skill, index) => (
              <span key={index} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {skill}
                <button
                  onClick={() => {
                    removeSkill('skills', skill);
                    // Update skills in backend immediately
                    const newSkills = profileData.skills.filter(s => s !== skill);
                    updateSkillsInBackend(newSkills);
                  }}
                  disabled={isUpdatingSkills}
                  className={`text-yellow-600 hover:text-yellow-800 ${
                    isUpdatingSkills ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Skills Update Summary - Shows after successful skills update */}
      {skillsMessage.type === 'success' && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm border border-blue-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="text-green-600 mr-2">✓</span>
              Skills Updated Successfully
            </h3>
            <button
              onClick={() => setSkillsMessage({ type: '', text: '' })}
              className="text-gray-400 hover:text-gray-600 text-lg font-bold"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 text-sm uppercase tracking-wide mb-3">Current Skills</h4>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.length > 0 ? (
                  profileData.skills.map((skill, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm italic">No skills added yet</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-blue-200">
              <span>Total skills: {profileData.skills.length}</span>
              <span className="text-green-600 font-medium">✓ Skills Saved</span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bio</h3>
        <textarea
          value={profileData.bio}
          onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
          rows="4"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          placeholder="Tell clients about your experience and expertise..."
        />
      </div>

      {/* Profile Update Message */}
      {profileMessage.text && (
        <div className={`p-3 rounded-lg ${
          profileMessage.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {profileMessage.text}
        </div>
      )}

      {/* Current Profile Summary - Shows after successful update or when requested */}
      {(profileMessage.type === 'success' || showProfileSummary) && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 shadow-sm border border-yellow-200">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                Current Profile Summary
              </h3>
              {lastProfileLoad && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Fresh Data
                </span>
              )}
            </div>
            <button
              onClick={() => setShowProfileSummary(false)}
              className="text-gray-400 hover:text-gray-600 text-lg font-bold"
            >
              ×
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information Summary */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700 text-sm uppercase tracking-wide">Personal Information</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Name:</span>
                  <span className="font-medium text-gray-900">{profileData.firstName} {profileData.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Email:</span>
                  <span className="font-medium text-gray-900">{profileData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Phone:</span>
                  <span className="font-medium text-gray-900">{formatPhoneForDisplay(profileData.phone)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Country:</span>
                  <span className="font-medium text-gray-900">{profileData.country || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Location:</span>
                  <span className="font-medium text-gray-900">{profileData.location || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Hourly Rate:</span>
                  <span className="font-medium text-gray-900">${profileData.hourlyRate || '0'}/hr</span>
                </div>
              </div>
            </div>

            {/* Academic Information Summary */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700 text-sm uppercase tracking-wide">Academic Information</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">University:</span>
                  <span className="font-medium text-gray-900">{profileData.university || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Major:</span>
                  <span className="font-medium text-gray-900">{profileData.major || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Graduation Year:</span>
                  <span className="font-medium text-gray-900">{profileData.graduationYear || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Availability:</span>
                  <span className="font-medium text-gray-900 capitalize">{profileData.availability || 'Not specified'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Summary */}
          <div className="mt-6">
            <h4 className="font-medium text-gray-700 text-sm uppercase tracking-wide mb-3">Skills & Expertise</h4>
            <div className="flex flex-wrap gap-2">
              {profileData.skills.length > 0 ? (
                profileData.skills.map((skill, index) => (
                  <span key={index} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 text-sm italic">No skills added yet</span>
              )}
            </div>
          </div>

          {/* Bio Summary */}
          {profileData.bio && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-700 text-sm uppercase tracking-wide mb-3">Bio</h4>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-gray-700 leading-relaxed">{profileData.bio}</p>
              </div>
            </div>
          )}

          {/* Last Updated Info */}
          <div className="mt-6 pt-4 border-t border-yellow-200">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Profile last updated: {new Date().toLocaleString()}</span>
              <span className="text-green-600 font-medium">✓ Successfully Saved</span>
            </div>
            
            {lastProfileLoad && (
              <div className="flex items-center justify-between text-sm text-gray-500 mt-1">
                <span>Data last loaded: {lastProfileLoad.toLocaleString()}</span>
                <span className="text-blue-600 text-xs">↻ Fresh from server</span>
              </div>
            )}
            
            {/* Quick Actions */}
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => setShowProfileSummary(false)}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Hide Summary
              </button>
              <button
                onClick={() => window.print()}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Print Profile
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleProfileUpdate}
          disabled={isUpdatingProfile}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            isUpdatingProfile 
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
              : 'bg-yellow-500 text-black hover:bg-yellow-600'
          }`}
        >
          {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
        </button>
      </div>
    </div>
  );

  const renderPortfolioTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Portfolio Item</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={newPortfolioItem.title}
              onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={newPortfolioItem.category}
              onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="">Select Category</option>
              <option value="Web Development">Web Development</option>
              <option value="Mobile Development">Mobile Development</option>
              <option value="Design">Design</option>
              <option value="Writing">Writing</option>
              <option value="Marketing">Marketing</option>
              <option value="Data Analysis">Data Analysis</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={newPortfolioItem.description}
              onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, description: e.target.value }))}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skills Used</label>
            <input
              type="text"
              placeholder="Add skills (comma separated)"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const skills = e.target.value.split(',').map(s => s.trim());
                  setNewPortfolioItem(prev => ({ ...prev, skills: [...prev.skills, ...skills] }));
                  e.target.value = '';
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Completion Date</label>
            <input
              type="date"
              value={newPortfolioItem.completionDate}
              onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, completionDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
            <input
              type="url"
              value={newPortfolioItem.imageUrl}
              onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, imageUrl: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project URL</label>
            <input
              type="url"
              value={newPortfolioItem.projectUrl}
              onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, projectUrl: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={addPortfolioItem}
            className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600"
          >
            Add Portfolio Item
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolioItems.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{item.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {item.skills.map((skill, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{item.completionDate}</span>
                <button
                  onClick={() => removePortfolioItem(item.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProjectsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
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
  );

  const renderWorkHistoryTab = () => (
    <div className="space-y-6">
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
  );

  const renderEarningsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
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
  );

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to access the Student Management System</p>
          <Link to="/signin" className="text-yellow-500 hover:text-yellow-600 mt-2 inline-block">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Management System</h1>
              <p className="text-gray-600">Welcome back, {userData.firstName}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-yellow-500 hover:text-yellow-600">
                ← Back to Home
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "profile", label: "Profile & Skills", icon: "👤" },
              { id: "portfolio", label: "Portfolio", icon: "🎨" },
              { id: "projects", label: "Project Applications", icon: "📋" },
              { id: "work-history", label: "Work History", icon: "📊" },
              { id: "earnings", label: "Earnings & Payments", icon: "💰" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-yellow-500 text-yellow-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {activeTab === "profile" && renderProfileTab()}
          {activeTab === "portfolio" && renderPortfolioTab()}
          {activeTab === "projects" && renderProjectsTab()}
          {activeTab === "work-history" && renderWorkHistoryTab()}
          {activeTab === "earnings" && renderEarningsTab()}
        </div>
      </div>
    </div>
  );
}

export default StudentManagementSystem;
