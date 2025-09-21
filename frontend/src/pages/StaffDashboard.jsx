import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProfileImageUpload from "../components/ProfileImageUpload";

function StaffDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [staffData, setStaffData] = useState(null);

  
  // Edit profile state
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    staffRole: '',
    department: '',
    employeeId: '',
    experience: '',
    qualification: '',
    bio: ''
  });
  const [editErrors, setEditErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingProfileImage, setIsUploadingProfileImage] = useState(false);
  const [isRemovingProfileImage, setIsRemovingProfileImage] = useState(false);
  const [showProfileImageMenu, setShowProfileImageMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Student analytics state
  const [studentStats, setStudentStats] = useState({
    totalStudents: 0,
    verifiedStudents: 0,
    pendingVerification: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalRevenue: 0
  });

  const [students, setStudents] = useState([]);
  const [loadingStudentAnalytics, setLoadingStudentAnalytics] = useState(false);

  const [verificationRequests, setVerificationRequests] = useState([]);
  const [loadingVerificationRequests, setLoadingVerificationRequests] = useState(false);

  // Resources management state
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [showMyResourcesOnly, setShowMyResourcesOnly] = useState(false);
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [showEditResourceModal, setShowEditResourceModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    category: '',
    type: '',
    readTime: '',
    difficulty: 'Beginner',
    tags: '',
    link: '',
    featured: false
  });
  const [resourceCategories] = useState([
    'Getting Started',
    'Best Practices',
    'Tools & Software',
    'Business Tips',
    'Marketing',
    'Legal & Contracts',
    'Pricing Strategies',
    'Client Management'
  ]);
  const [resourceTypes] = useState([
    'Guide',
    'Tutorial',
    'Resource List',
    'Article',
    'Legal Guide',
    'Strategy Guide',
    'Branding Guide',
    'Business Guide'
  ]);

  // Fetch student analytics data
  const fetchStudentAnalytics = async () => {
    try {
      setLoadingStudentAnalytics(true);
      const token = localStorage.getItem('userToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch('http://localhost:5000/api/staff/student-analytics', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch student analytics');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setStudentStats(result.data.stats);
        setStudents(result.data.students);
      } else {
        console.error('Error fetching student analytics:', result.message);
      }
    } catch (error) {
      console.error('Error fetching student analytics:', error);
    } finally {
      setLoadingStudentAnalytics(false);
    }
  };

  // Fetch verification requests
  const fetchVerificationRequests = async () => {
    try {
      setLoadingVerificationRequests(true);
      const token = localStorage.getItem('userToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch('http://localhost:5000/api/staff/verification-requests', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch verification requests');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setVerificationRequests(result.data);
      } else {
        console.error('Error fetching verification requests:', result.message);
      }
    } catch (error) {
      console.error('Error fetching verification requests:', error);
    } finally {
      setLoadingVerificationRequests(false);
    }
  };

  // Function to fetch complete profile data from backend
  const fetchCompleteProfile = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Update staff data with complete profile
          setStaffData(result.data);
          // Update localStorage with complete data
          localStorage.setItem('userData', JSON.stringify(result.data));
        }
      }
    } catch (error) {
      console.error('Error fetching complete profile:', error);
    }
  };

  useEffect(() => {
    // Check if staff is logged in
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsed = JSON.parse(userData);
      if (parsed.userType === 'universityStaff') {
        setStaffData(parsed);
        // Also fetch fresh data from backend to ensure we have the latest profile image
        fetchCompleteProfile();
      } else {
        navigate('/signin');
      }
    } else {
      navigate('/signin');
    }
  }, [navigate]);

  // Handle URL query parameter for tab
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam && ['overview', 'analytics', 'verification', 'profile'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);



  // Fetch verification requests when component mounts
  useEffect(() => {
    if (staffData) {
      fetchStudentAnalytics();
      fetchVerificationRequests();
    }
  }, [staffData]);

  // Resources management functions
  const fetchResources = async () => {
    try {
      const userToken = localStorage.getItem('userToken');
      const response = await fetch('http://localhost:5000/api/resources/staff/all', {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setResources(data.data || []);
        setFilteredResources(data.data || []);
      } else {
        console.error('Failed to fetch resources');
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  // Filter and search resources
  const filterResources = useCallback(() => {
    let filtered = [...resources];

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      
      filtered = filtered.filter(resource => {
        const titleMatch = resource.title && resource.title.toLowerCase().includes(term);
        const descMatch = resource.description && resource.description.toLowerCase().includes(term);
        const tagsMatch = resource.tags && Array.isArray(resource.tags) && resource.tags.some(tag => tag.toLowerCase().includes(term));
        const categoryMatch = resource.category && resource.category.toLowerCase().includes(term);
        const typeMatch = resource.type && resource.type.toLowerCase().includes(term);
        const difficultyMatch = resource.difficulty && resource.difficulty.toLowerCase().includes(term);
        const readTimeMatch = resource.readTime && resource.readTime.toLowerCase().includes(term);
        const creatorName = resource.createdBy && (resource.createdBy.name || 
          (resource.createdBy.firstName && resource.createdBy.lastName ? 
           `${resource.createdBy.firstName} ${resource.createdBy.lastName}` : ''));
        const creatorMatch = creatorName && creatorName.toLowerCase().includes(term);
        
        return titleMatch || descMatch || tagsMatch || categoryMatch || typeMatch || difficultyMatch || readTimeMatch || creatorMatch;
      });
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty) {
      filtered = filtered.filter(resource => resource.difficulty === selectedDifficulty);
    }

    // Filter by my resources only
    if (showMyResourcesOnly) {
      filtered = filtered.filter(resource => 
        staffData && resource.createdBy && resource.createdBy._id === staffData._id
      );
    }

    setFilteredResources(filtered);
  }, [searchTerm, selectedCategory, selectedDifficulty, showMyResourcesOnly, resources, staffData]);

  // Update filtered resources when any filter changes
  useEffect(() => {
    filterResources();
  }, [filterResources]);

  // Close profile image menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileImageMenu && !event.target.closest('.profile-image-container')) {
        setShowProfileImageMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileImageMenu]);

  const handleEditResource = (resource) => {
    setSelectedResource(resource);
    setShowEditResourceModal(true);
  };

  const handleDeleteResource = async (resourceId) => {
    if (window.confirm('Are you sure you want to permanently delete this resource? This action cannot be undone.')) {
      try {
        const userToken = localStorage.getItem('userToken');
        const response = await fetch(`http://localhost:5000/api/resources/staff/${resourceId}/permanent`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setResources(prev => prev.filter(resource => resource._id !== resourceId));
          alert('Resource permanently deleted successfully!');
        } else {
          const errorData = await response.json();
          alert('Failed to delete resource: ' + (errorData.message || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error deleting resource:', error);
        alert('Failed to delete resource: ' + error.message);
      }
    }
  };

  const handleUpdateResource = async (e) => {
    e.preventDefault();
    try {
      const userToken = localStorage.getItem('userToken');
      
      const resourceData = { ...selectedResource };
      if (resourceData.tags && typeof resourceData.tags === 'string') {
        resourceData.tags = resourceData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      }
      
      const response = await fetch(`http://localhost:5000/api/resources/staff/${selectedResource._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resourceData)
      });
      
      if (response.ok) {
        const updatedResource = await response.json();
        setResources(prev => prev.map(resource => 
          resource._id === selectedResource._id ? updatedResource.data : resource
        ));
        setShowEditResourceModal(false);
        setSelectedResource(null);
        alert('Resource updated successfully!');
      } else {
        const errorData = await response.json();
        alert('Failed to update resource: ' + (errorData.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating resource:', error);
      alert('Failed to update resource: ' + error.message);
    }
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    try {
      const userToken = localStorage.getItem('userToken');
      const response = await fetch('http://localhost:5000/api/resources/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(newResource)
      });

      if (response.ok) {
        setShowAddResourceModal(false);
        setNewResource({
          title: '',
          description: '',
          category: '',
          type: '',
          readTime: '',
          difficulty: 'Beginner',
          tags: '',
          link: '',
          featured: false
        });
        fetchResources();
        alert('Resource added successfully!');
      } else {
        const errorData = await response.json();
        alert('Failed to add resource: ' + (errorData.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding resource:', error);
      alert('Failed to add resource: ' + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('userToken');
    navigate('/');
  };

  // Edit profile functions
  const handleEditProfile = () => {
    setEditFormData({
      firstName: staffData?.firstName || '',
      lastName: staffData?.lastName || '',
      email: staffData?.email || '',
      phoneNumber: staffData?.phoneNumber || '',
      address: staffData?.address || '',
      staffRole: staffData?.staffRole || '',
      department: staffData?.department || '',
      employeeId: staffData?.employeeId || '',
      experience: staffData?.experience || '',
      qualification: staffData?.qualification || '',
      bio: staffData?.bio || ''
    });
    setEditErrors({});
    setShowEditProfile(true);
  };

  const validateEditForm = () => {
    const errors = {};
    
    if (!editFormData.firstName.trim()) errors.firstName = 'First name is required';
    if (!editFormData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!editFormData.email.trim()) errors.email = 'Email is required';
    if (!editFormData.staffRole.trim()) errors.staffRole = 'Staff role is required';
    if (!editFormData.department.trim()) errors.department = 'Department is required';
    
    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateEditForm()) return;

    try {
      setIsSaving(true);
      const token = localStorage.getItem('userToken');
      
      if (!token) {
        alert('Authentication token not found. Please log in again.');
        return;
      }

      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      });

      const result = await response.json();

      if (result.success) {
        // Update local state
        const updatedData = { ...staffData, ...editFormData };
        setStaffData(updatedData);
        localStorage.setItem('userData', JSON.stringify(updatedData));
        
        setShowEditProfile(false);
        alert('Profile updated successfully!');
      } else {
        alert(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setShowEditProfile(false);
    setEditErrors({});
  };

  // Profile Image Upload Functions
  const handleProfileImageUpload = async (file) => {
    try {
      setIsUploadingProfileImage(true);
      
      const token = localStorage.getItem('userToken');
      if (!token) {
        alert('Please log in to upload profile image');
        return;
      }

      const formData = new FormData();
      formData.append('profileImage', file);

      const response = await fetch('http://localhost:5000/api/users/profile-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Update staff data with new profile image
          setStaffData(prev => ({
            ...prev,
            profileImage: result.data.profileImage
          }));
          
          // Update localStorage
          const currentUserData = JSON.parse(localStorage.getItem('userData') || '{}');
          const updatedUserData = {
            ...currentUserData,
            profileImage: result.data.profileImage
          };
          localStorage.setItem('userData', JSON.stringify(updatedUserData));
          
          alert('Profile image uploaded successfully!');
        } else {
          alert(result.message || 'Failed to upload profile image');
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to upload profile image');
      }
    } catch (error) {
      console.error('Profile image upload error:', error);
      alert('Failed to upload profile image. Please try again.');
    } finally {
      setIsUploadingProfileImage(false);
    }
  };

  const handleProfileImageRemove = async () => {
    try {
      setIsRemovingProfileImage(true);
      
      const token = localStorage.getItem('userToken');
      if (!token) {
        alert('Please log in to remove profile image');
        return;
      }

      // Call backend API to remove profile image
      const response = await fetch('http://localhost:5000/api/users/profile-image', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (result.success) {
        // Update local state
        setStaffData(prev => ({
          ...prev,
          profileImage: null
        }));
        
        // Update localStorage
        const currentUserData = JSON.parse(localStorage.getItem('userData') || '{}');
        const updatedUserData = {
          ...currentUserData,
          profileImage: null
        };
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
        
        alert('Profile image removed successfully!');
      } else {
        alert(`Failed to remove profile image: ${result.message}`);
      }
    } catch (error) {
      console.error('Profile image remove error:', error);
      alert('Failed to remove profile image. Please try again.');
    } finally {
      setIsRemovingProfileImage(false);
    }
  };

  const verifyStudent = (studentId) => {
    // Simulate verification process
    console.log(`Verifying student ${studentId}`);
    // In real implementation, this would update the database
  };

  const rejectStudent = (studentId) => {
    // Simulate rejection process
    console.log(`Rejecting student ${studentId}`);
    // In real implementation, this would update the database
  };

  const respondToVerificationRequest = async (requestId, status, response) => {
    try {
      const token = localStorage.getItem('userToken');
      
      if (status === 'approved') {
        const apiResponse = await fetch(`http://localhost:5000/api/staff/verify-student/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
          }
      });

      const result = await apiResponse.json();

      if (result.success) {
          // Refresh the data
          fetchStudentAnalytics();
        fetchVerificationRequests();
          alert('Student verified successfully!');
      } else {
          alert(`Failed to verify student: ${result.message}`);
        }
      } else {
        // Handle rejection if needed
        console.log(`Rejecting verification request ${requestId}`);
        alert('Rejection functionality not implemented yet');
      }
    } catch (error) {
      console.error('Error responding to verification request:', error);
      alert('Failed to respond to verification request');
    }
  };

  // Handle PDF export
  const handleExportPDF = async () => {
    try {
      const token = localStorage.getItem('userToken');
      
      if (!token) {
        alert('Authentication token not found. Please log in again.');
        return;
      }

      // Show loading state
      const exportButton = document.querySelector('[data-export-pdf]');
      if (exportButton) {
        exportButton.disabled = true;
        exportButton.innerHTML = '<svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Generating PDF...';
      }

      const response = await fetch('http://localhost:5000/api/staff/export-analytics', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Create blob from response
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        // Create download link
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = `student-analytics-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Clean up
        window.URL.revokeObjectURL(url);
        
        alert('PDF report downloaded successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to export PDF: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF report');
    } finally {
      // Reset button state
      const exportButton = document.querySelector('[data-export-pdf]');
      if (exportButton) {
        exportButton.disabled = false;
        exportButton.innerHTML = '<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg><span>Export PDF</span>';
      }
    }
  };



  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-blue-200 hover:border-blue-400">
          <div className="flex items-center justify-between mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="text-right">
              <span className="text-green-500 text-sm font-medium">+{studentStats.verifiedStudents}</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{studentStats.totalStudents.toLocaleString()}</h3>
          <p className="text-gray-600">Total Students</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-green-200 hover:border-green-400">
          <div className="flex items-center justify-between mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-right">
              <span className="text-green-500 text-sm font-medium">{studentStats.verifiedStudents}</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{studentStats.verifiedStudents.toLocaleString()}</h3>
          <p className="text-gray-600">Verified Students</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-yellow-200 hover:border-yellow-400">
          <div className="flex items-center justify-between mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-right">
              <span className="text-yellow-500 text-sm font-medium">New</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{studentStats.pendingVerification}</h3>
          <p className="text-gray-600">Pending Verification</p>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-purple-200 hover:border-purple-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-3xl font-bold text-gray-900">{studentStats.activeProjects}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-indigo-200 hover:border-indigo-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Projects</p>
              <p className="text-3xl font-bold text-gray-900">{studentStats.completedProjects}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-green-200 hover:border-green-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">${studentStats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Student Verification Status Chart */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Student Verification Status</h3>
          <div className="flex items-center justify-center h-64">
            <div className="relative w-48 h-48">
              {/* Pie Chart */}
              <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 36 36">
                {/* Background circle */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                
                {/* Verified Students */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray={`${(studentStats.verifiedStudents / (studentStats.totalStudents || 1)) * 100} ${100 - (studentStats.verifiedStudents / (studentStats.totalStudents || 1)) * 100}`}
                  strokeLinecap="round"
                />
                
                {/* Pending Verification */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#22cc9d"
                  strokeWidth="3"
                  strokeDasharray={`${(studentStats.pendingVerification / (studentStats.totalStudents || 1)) * 100} ${100 - (studentStats.pendingVerification / (studentStats.totalStudents || 1)) * 100}`}
                  strokeDashoffset={`-${(studentStats.verifiedStudents / (studentStats.totalStudents || 1)) * 100}`}
                  strokeLinecap="round"
                />
              </svg>
              
              {/* Center text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{studentStats.totalStudents}</div>
                  <div className="text-sm text-gray-600">Total Students</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Verified ({studentStats.verifiedStudents})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Pending ({studentStats.pendingVerification})</span>
            </div>
          </div>
        </div>

        {/* Project Status Chart */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Project Status Overview</h3>
          <div className="space-y-4">
            {/* Active Projects */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Active Projects</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(studentStats.activeProjects / (studentStats.activeProjects + studentStats.completedProjects || 1)) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-gray-900 w-8 text-right">{studentStats.activeProjects}</span>
              </div>
            </div>
            
            {/* Completed Projects */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-indigo-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Completed Projects</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(studentStats.completedProjects / (studentStats.activeProjects + studentStats.completedProjects || 1)) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-gray-900 w-8 text-right">{studentStats.completedProjects}</span>
              </div>
            </div>
          </div>
          
          {/* Total Projects */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{studentStats.activeProjects + studentStats.completedProjects}</div>
              <div className="text-sm text-gray-600">Total Projects</div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue and Activity Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Revenue Overview */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Revenue Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">${studentStats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            
            {/* Revenue per student calculation */}
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-gray-600">Average Revenue per Student</p>
              <p className="text-xl font-bold text-blue-600">
                ${studentStats.totalStudents > 0 ? (studentStats.totalRevenue / studentStats.totalStudents).toFixed(2) : '0.00'}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{studentStats.pendingVerification} pending verifications</p>
                <p className="text-xs text-gray-600">Requires staff attention</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{studentStats.verifiedStudents} students verified</p>
                <p className="text-xs text-gray-600">Successfully processed</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{studentStats.activeProjects} active projects</p>
                <p className="text-xs text-gray-600">Currently in progress</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderResources = () => (
    <div className="space-y-8">
      {/* Resources Header */}
      <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-yellow-200 hover:border-yellow-400">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Resources Management</h3>
            <p className="text-gray-600 mt-1">Manage educational resources and guides for freelancers</p>
          </div>
          <button
            onClick={() => setShowAddResourceModal(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Resource</span>
          </button>
        </div>

        {/* Resources Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Resources</p>
                <p className="text-3xl font-bold">{resources.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Featured</p>
                <p className="text-3xl font-bold">{resources.filter(r => r.featured).length}</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.784.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Categories</p>
                <p className="text-3xl font-bold">{resourceCategories.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Types</p>
                <p className="text-3xl font-bold">{resourceTypes.length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resources List */}
      <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-yellow-200 hover:border-yellow-400">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="text-xl font-bold text-gray-900">All Resources</h4>
            {(searchTerm || selectedCategory || selectedDifficulty || showMyResourcesOnly) && (
              <p className="text-sm text-gray-600 mt-1">
                Showing {filteredResources.length} of {resources.length} resources
                {searchTerm && ` matching "${searchTerm}"`}
                {selectedCategory && ` in "${selectedCategory}" category`}
                {selectedDifficulty && ` with "${selectedDifficulty}" difficulty`}
                {showMyResourcesOnly && ` (my resources only)`}
              </p>
            )}
          </div>
          <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500 min-w-[200px]"
              />
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
              >
                <option value="">All Categories</option>
                {resourceCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select 
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
              >
                <option value="">All Difficulties</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showMyResourcesOnly}
                  onChange={(e) => setShowMyResourcesOnly(e.target.checked)}
                  className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                />
                <span className={`text-sm ${showMyResourcesOnly ? 'text-yellow-600 font-medium' : 'text-gray-700'}`}>
                  My Resources
                </span>
                {showMyResourcesOnly && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Active
                  </span>
                )}
              </label>

              {(searchTerm || selectedCategory || selectedDifficulty || showMyResourcesOnly) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                    setSelectedDifficulty('');
                    setShowMyResourcesOnly(false);
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors duration-200"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Read Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResources.map((resource, index) => (
                <tr key={resource.id || index} className={`hover:bg-gray-50 ${
                  staffData && resource.createdBy && resource.createdBy._id === staffData._id 
                    ? 'bg-blue-50 border-l-4 border-blue-400' 
                    : ''
                }`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{resource.title}</div>
                      <div className="text-sm text-gray-500">{resource.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {resource.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resource.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      resource.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                      resource.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {resource.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resource.readTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {resource.featured ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-transparent text-yellow-800">
                        Featured
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {resource.createdBy ? (
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-xs">
                            {(() => {
                              const fullName = resource.createdBy.name || 
                                (resource.createdBy.firstName && resource.createdBy.lastName ? 
                                 `${resource.createdBy.firstName} ${resource.createdBy.lastName}` : '');
                              return fullName ? fullName.split(' ').map(n => n[0]).join('') : 'U';
                            })()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {resource.createdBy.name || 
                             (resource.createdBy.firstName && resource.createdBy.lastName ? 
                              `${resource.createdBy.firstName} ${resource.createdBy.lastName}` : 
                              'Unknown')}
                          </div>
                          <div className="text-xs text-gray-500">
                            {resource.createdBy.userType === 'universityStaff' ? 'Staff Member' : 
                             resource.createdBy.userType === 'admin' ? 'Administrator' : 
                             resource.createdBy.userType || 'User'}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">Unknown</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {/* Show edit/delete buttons only if staff member owns the resource */}
                      {staffData && resource.createdBy && resource.createdBy._id === staffData._id ? (
                        <>
                          <button 
                            onClick={() => handleEditResource(resource)}
                            className="text-blue-600 hover:text-blue-900 font-medium transition-colors duration-200"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteResource(resource._id)}
                            className="text-red-600 hover:text-red-900 font-medium transition-colors duration-200"
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-400 text-sm">View Only</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {resources.length === 0 ? 'No resources yet' : 'No resources found'}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {resources.length === 0 
                  ? 'Start by adding the first resource to help freelancers succeed.'
                  : showMyResourcesOnly 
                    ? 'You haven\'t created any resources yet. Try creating your first resource!'
                    : 'Try adjusting your search terms or filters.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStudentAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-blue-200 hover:border-blue-400">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Student Analytics</h3>
            <p className="text-gray-600 mt-1">Comprehensive overview of student performance and engagement</p>
          </div>
          <button 
            onClick={handleExportPDF}
            data-export-pdf
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export PDF</span>
          </button>
        </div>

        {loadingStudentAnalytics ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading student analytics...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Student Data Available</h3>
            <p className="text-gray-600">No student analytics data found at the moment.</p>
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GPA</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projects</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map(student => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">{student.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.university}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.degreeProgram}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.gpa}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      (student.status === 'Verified' || student.status === 'Pending') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.projects}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${student.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );

  const renderVerification = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-yellow-200 hover:border-yellow-400">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Student Verification Requests</h3>
              <p className="text-gray-600 mt-1">Review and respond to student verification requests</p>
            </div>
            <span className="bg-transparent text-black px-4 py-2 rounded-xl text-sm font-medium">
              {verificationRequests.filter(req => req.status === 'pending').length} Pending
            </span>
          </div>

        {loadingVerificationRequests ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading verification requests...</p>
          </div>
        ) : verificationRequests.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Verification Requests</h3>
            <p className="text-gray-600">No pending verification requests at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {verificationRequests.map(request => (
              <div key={request._id} className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:border-yellow-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">
                          {request.firstName} {request.lastName}
                        </h4>
                        <p className="text-yellow-600 font-medium">{request.email}</p>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-transparent text-black">
                          Pending Verification
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="text-gray-600">University: <span className="font-medium">{request.university || 'Not specified'}</span></span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span className="text-gray-600">Program: <span className="font-medium">{request.degreeProgram || 'Not specified'}</span></span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span className="text-gray-600">GPA: <span className="font-medium">{request.gpa || 'Not specified'}</span></span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-600">Joined: <span className="font-medium">{new Date(request.createdAt).toLocaleDateString()}</span></span>
                      </div>
                    </div>


                  </div>
                </div>
                
                  <div className="flex space-x-4">
                    <button 
                      onClick={() => respondToVerificationRequest(request._id, 'approved', 'Verification approved. Welcome to the platform!')}
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Approve</span>
                    </button>
                    <button 
                      onClick={() => respondToVerificationRequest(request._id, 'rejected', 'Verification rejected. Please provide additional documentation.')}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Reject</span>
                    </button>
                  </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-black via-gray-900 to-black text-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          {/* Profile Picture */}
          <div className="relative group profile-image-container">
            {staffData?.profileImage?.url ? (
          <div className="relative">
                <img
                  src={staffData.profileImage.url}
                  alt="Profile"
                  className={`w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg cursor-pointer transition-all duration-200 ${
                    isUploadingProfileImage ? 'opacity-50' : 'group-hover:scale-105 group-hover:shadow-xl'
                  }`}
                  onClick={() => setShowProfileImageMenu(!showProfileImageMenu)}
                />
                {/* Status indicator */}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                {/* Click indicator */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                {/* Profile Image Options Menu */}
                {showProfileImageMenu && (
                  <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-40" onClick={() => setShowProfileImageMenu(false)} />
                    
                    {/* Menu */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setShowProfileImageMenu(false);
                            document.getElementById('change-profile-image-input').click();
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 transition-colors"
                        >
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span>Change Photo</span>
                        </button>
                        <button
                          onClick={async () => {
                            setShowProfileImageMenu(false);
                            if (confirm('Are you sure you want to remove your profile picture?')) {
                              await handleProfileImageRemove();
                            }
                          }}
                          disabled={isRemovingProfileImage}
                          className={`w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors ${
                            isRemovingProfileImage ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {isRemovingProfileImage ? (
                            <>
                              <svg className="animate-spin w-4 h-4 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Removing...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span>Remove Photo</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                )}
                
                {/* Hidden file input for changing photo */}
                <input
                  id="change-profile-image-input"
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif,.webp"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      // Validate file type
                      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                      if (!allowedTypes.includes(file.type)) {
                        alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
                        return;
                      }

                      // Validate file size (5MB)
                      if (file.size > 5 * 1024 * 1024) {
                        alert('File size must be less than 5MB');
                        return;
                      }

                      handleProfileImageUpload(file);
                    }
                  }}
                  className="hidden"
                  disabled={isUploadingProfileImage}
                />
              </div>
            ) : (
              <div className="relative">
                <div 
                  className={`w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-4xl font-bold text-black cursor-pointer transition-all duration-200 ${
                    isUploadingProfileImage ? 'opacity-50' : 'group-hover:scale-105 group-hover:shadow-xl'
                  }`}
                  onClick={() => document.getElementById('upload-profile-image-input').click()}
                >
              {staffData?.firstName?.charAt(0)}{staffData?.lastName?.charAt(0)}
            </div>
                
                {/* Hidden file input for uploading photo */}
                <input
                  id="upload-profile-image-input"
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif,.webp"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      // Validate file type
                      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                      if (!allowedTypes.includes(file.type)) {
                        alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
                        return;
                      }

                      // Validate file size (5MB)
                      if (file.size > 5 * 1024 * 1024) {
                        alert('File size must be less than 5MB');
                        return;
                      }

                      handleProfileImageUpload(file);
                    }
                  }}
                  className="hidden"
                  disabled={isUploadingProfileImage}
                />
              </div>
            )}
            
            {/* Upload progress indicator */}
            {isUploadingProfileImage && (
              <div className="absolute inset-0 bg-black bg-opacity-70 rounded-full flex items-center justify-center">
                <div className="text-center text-white">
                  <svg className="animate-spin w-8 h-8 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-sm font-medium">Uploading...</p>
                </div>
              </div>
            )}
            
            {/* Upload instruction */}
            <div className="text-center mt-2">
              <p className="text-xs text-gray-300 opacity-75">
                {staffData?.profileImage?.url ? 'Click for options' : 'Click to upload photo'}
              </p>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold mb-2">
              {staffData?.firstName} {staffData?.lastName}
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              University Staff • {staffData?.staffRole || 'Staff Member'} • {staffData?.department || 'Department'}
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>5.0 (15 reviews)</span>
              </div>
              
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>{staffData?.department || 'University Department'}</span>
              </div>

              <div className="flex items-center px-3 py-1 rounded-full bg-green-500">
                <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                <span className="text-sm font-medium">Active Staff</span>
              </div>
            </div>

            <p className="text-gray-300 max-w-2xl">
              {staffData?.bio || 'Dedicated university staff member committed to supporting student success and maintaining academic standards. Experienced in student verification, analytics, and academic oversight.'}
              {staffData?.profileImage?.url && (
                <span className="block mt-2 text-sm text-green-300">
                  ✓ Professional profile picture uploaded
                </span>
              )}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3">
            <button 
              onClick={handleEditProfile}
              className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Edit Profile
            </button>
            <button className="bg-white hover:bg-gray-100 text-gray-800 px-6 py-2 rounded-lg font-semibold transition-colors">
              View Reports
            </button>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Staff Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={`${staffData?.firstName || ''} ${staffData?.lastName || ''}`}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  value={staffData?.email || ''}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Staff Role</label>
                <input 
                  type="text" 
                  value={staffData?.staffRole || ''}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <input 
                  type="text" 
                  value={staffData?.department || ''}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                  readOnly
                />
              </div>
            </div>
          </div>


        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Staff Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Students Verified</span>
                <span className="font-bold text-yellow-600">1,189</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending Verifications</span>
                <span className="text-gray-600">58</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Students</span>
                <span className="font-bold text-yellow-600">1,247</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Years of Service</span>
                <span className="font-bold text-yellow-600">5+</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Responsibilities</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-transparent text-yellow-800 rounded-full text-sm font-medium">Student Verification</span>
              <span className="px-3 py-1 bg-transparent text-yellow-800 rounded-full text-sm font-medium">Academic Oversight</span>
              <span className="px-3 py-1 bg-transparent text-yellow-800 rounded-full text-sm font-medium">Data Analytics</span>
              <span className="px-3 py-1 bg-transparent text-yellow-800 rounded-full text-sm font-medium">Institutional Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!staffData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-x-hidden">
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      {/* Main Content with Professional Sidebar Layout */}
      <div className="flex min-h-screen relative z-10">
        {/* Left Sidebar - Fixed width, full height, positioned below header */}
        <div className="w-64 bg-white shadow-2xl border-r border-gray-200 flex-shrink-0 mt-20">
          {/* Sidebar Header */}
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-6 border-b border-yellow-300">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-yellow-500 font-bold text-lg">S</span>
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Staff Panel</h2>
                <p className="text-yellow-100 text-sm">Dashboard Navigation</p>
              </div>
            </div>
          </div>
          
          {/* Navigation Menu */}
          <div className="p-4">
            <nav className="flex flex-col space-y-1">
              {[
                { id: "overview", name: "Overview", icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" },
                { id: "analytics", name: "Student Analytics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
                { id: "verification", name: "Verification", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
                { id: "profile", name: "Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 text-left group ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-md"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent hover:border-gray-200"
                  }`}
                >
                  <svg className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${
                    activeTab === tab.id ? "text-black" : "text-gray-500 group-hover:text-yellow-500"
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                  </svg>
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8 pt-8 overflow-y-auto mt-20">
          <div className="max-w-7xl mx-auto">
            {activeTab === "overview" && renderOverview()}
            {activeTab === "analytics" && renderStudentAnalytics()}
            {activeTab === "verification" && renderVerification()}
            {activeTab === "profile" && renderProfile()}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">Edit Profile</h3>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Profile Image Upload */}
              <ProfileImageUpload
                currentImage={staffData?.profileImage}
                onImageUpload={handleProfileImageUpload}
                onImageRemove={handleProfileImageRemove}
                isUploading={isUploadingProfileImage}
                className="mb-6"
              />

              {/* Personal Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editFormData.firstName}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                        editErrors.firstName ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {editErrors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{editErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editFormData.lastName}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                        editErrors.lastName ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {editErrors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{editErrors.lastName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                        editErrors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {editErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{editErrors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={editFormData.phoneNumber}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      value={editFormData.address}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Staff Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Staff Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Staff Role <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editFormData.staffRole}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, staffRole: e.target.value }))}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                        editErrors.staffRole ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Academic Advisor, Student Services Coordinator"
                    />
                    {editErrors.staffRole && (
                      <p className="text-red-500 text-sm mt-1">{editErrors.staffRole}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editFormData.department}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, department: e.target.value }))}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                        editErrors.department ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Computer Science, Student Affairs"
                    />
                    {editErrors.department && (
                      <p className="text-red-500 text-sm mt-1">{editErrors.department}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                    <input
                      type="text"
                      value={editFormData.employeeId}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                      placeholder="e.g., EMP001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                    <input
                      type="text"
                      value={editFormData.experience}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, experience: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                      placeholder="e.g., 5 years in student services"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Qualification</label>
                    <input
                      type="text"
                      value={editFormData.qualification}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, qualification: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                      placeholder="e.g., Master's in Education, PhD in Psychology"
                    />
                  </div>
                </div>
              </div>

              {/* Personal Bio */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Personal Bio</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      rows="4"
                      value={editFormData.bio}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, bio: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                    placeholder="Tell us about your role, responsibilities, and what you do to support students..."
                    />
                  <p className="text-sm text-gray-500 mt-2">
                    This bio will be displayed on your profile and helps others understand your role and expertise.
                  </p>
                  </div>
                  </div>


            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end space-x-4">
              <button
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Resource Modal */}
      {showAddResourceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Add New Resource</h3>
              <button
                onClick={() => setShowAddResourceModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddResource} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newResource.title}
                  onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
                  placeholder="e.g., Complete Guide to Starting Your Freelance Career"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newResource.description}
                  onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
                  placeholder="Describe the resource..."
                  rows="3"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newResource.category}
                    onChange={(e) => setNewResource({...newResource, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
                    required
                  >
                    <option value="">Select a category</option>
                    {resourceCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={newResource.type}
                    onChange={(e) => setNewResource({...newResource, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
                    required
                  >
                    <option value="">Select a type</option>
                    {resourceTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Read Time</label>
                  <input
                    type="text"
                    value={newResource.readTime}
                    onChange={(e) => setNewResource({...newResource, readTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
                    placeholder="e.g., 15 min"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <select
                    value={newResource.difficulty}
                    onChange={(e) => setNewResource({...newResource, difficulty: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
                    required
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Link</label>
                  <input
                    type="url"
                    value={newResource.link}
                    onChange={(e) => setNewResource({...newResource, link: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
                    placeholder="https://example.com/resource"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <input
                  type="text"
                  value={newResource.tags}
                  onChange={(e) => setNewResource({...newResource, tags: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
                  placeholder="e.g., freelancing, career, beginners (comma separated)"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={newResource.featured}
                  onChange={(e) => setNewResource({...newResource, featured: e.target.checked})}
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                  Mark as featured resource
                </label>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                >
                  Add Resource
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddResourceModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Resource Modal */}
      {showEditResourceModal && selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Edit Resource</h3>
              <button
                onClick={() => {
                  setShowEditResourceModal(false);
                  setSelectedResource(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdateResource} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={selectedResource.title}
                  onChange={(e) => setSelectedResource({...selectedResource, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
                  placeholder="e.g., Complete Guide to Starting Your Freelance Career"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={selectedResource.description}
                  onChange={(e) => setSelectedResource({...selectedResource, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
                  placeholder="Describe the resource..."
                  rows="3"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedResource.category}
                    onChange={(e) => setSelectedResource({...selectedResource, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
                    required
                  >
                    <option value="">Select a category</option>
                    {resourceCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={selectedResource.type}
                    onChange={(e) => setSelectedResource({...selectedResource, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
                    required
                  >
                    <option value="">Select a type</option>
                    {resourceTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Read Time</label>
                  <input
                    type="text"
                    value={selectedResource.readTime}
                    onChange={(e) => setSelectedResource({...selectedResource, readTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
                    placeholder="e.g., 15 min"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <select
                    value={selectedResource.difficulty}
                    onChange={(e) => setSelectedResource({...selectedResource, difficulty: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
                    required
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Link</label>
                  <input
                    type="url"
                    value={selectedResource.link}
                    onChange={(e) => setSelectedResource({...selectedResource, link: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
                    placeholder="https://example.com/resource"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <input
                  type="text"
                  value={selectedResource.tags ? (Array.isArray(selectedResource.tags) ? selectedResource.tags.join(', ') : selectedResource.tags) : ''}
                  onChange={(e) => setSelectedResource({...selectedResource, tags: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
                  placeholder="e.g., freelancing, career, beginners (comma separated)"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="edit-featured"
                  checked={selectedResource.featured}
                  onChange={(e) => setSelectedResource({...selectedResource, featured: e.target.checked})}
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <label htmlFor="edit-featured" className="ml-2 block text-sm text-gray-900">
                  Mark as featured resource
                </label>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                >
                  Update Resource
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditResourceModal(false);
                    setSelectedResource(null);
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffDashboard;

