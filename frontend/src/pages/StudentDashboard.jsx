import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import VerificationRequestPopup from "../components/VerificationRequestPopup";
import OnboardingWizard from "../components/OnboardingWizard";
import ApplicationTracker from "../components/ApplicationTracker";
import EnhancedRecommendations from "../components/EnhancedRecommendations";
import GigManagement from "../components/GigManagement";
import MessagesPage from "./MessagesPage";
function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [studentData, setStudentData] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfileData, setEditedProfileData] = useState({});
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const [isUploadingCV, setIsUploadingCV] = useState(false);
  const [isUploadingProfileImage, setIsUploadingProfileImage] = useState(false);
  const [isRemovingProfileImage, setIsRemovingProfileImage] = useState(false);
  const [showProfileImageMenu, setShowProfileImageMenu] = useState(false);
  const [professionalSummary, setProfessionalSummary] = useState({
    bio: '',
    hourlyRate: ''
  });
  const [isSavingSummary, setIsSavingSummary] = useState(false);
  const [summarySaveMessage, setSummarySaveMessage] = useState('');
  const [showOnboardingWizard, setShowOnboardingWizard] = useState(false);
  // Notification state
  const [bookmarkNotification, setBookmarkNotification] = useState({ show: false, message: '', type: '' });
  // Verification state
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState({
    isVerified: false,
    verificationRequest: null
  });
  const navigate = useNavigate();
  const location = useLocation();
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
  // Dynamic overview stats
  const [stats, setStats] = useState({
    completedProjects: 0,
    activeProjects: 0,
    totalEarnings: 0,
    skillsCount: 0,
    ratingAverage: 0,
    totalReviews: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const res = await fetch('/api/freelancer/overview', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Failed to load overview');
        const d = data.data;
        setStats(prev => ({
          ...prev,
            completedProjects: d.completedProjects,
            activeProjects: d.activeProjects,
            totalEarnings: d.totalEarnings,
            ratingAverage: d.ratingAverage,
            totalReviews: d.totalReviews,
            loading: false,
            error: null
        }));
      } catch (e) {
        console.error('Overview fetch error', e);
        setStats(prev => ({ ...prev, loading: false, error: e.message || 'Error' }));
      }
    };
    fetchOverview();
  }, []);
  const [activeProjects] = useState([
    { id: 1, title: "Website Redesign", client: "Tech Corp", status: "In Progress", earnings: 800, progress: 60 },
    { id: 2, title: "Logo Design", client: "Startup Inc", status: "In Progress", earnings: 300, progress: 80 },
    { id: 3, title: "Mobile App Development", client: "Innovation Labs", status: "In Progress", earnings: 1500, progress: 30 }
  ]);
  const [recentProjects] = useState([
    { id: 4, title: "Content Writing", client: "Marketing Pro", status: "Completed", earnings: 200, completedDate: "2024-01-10" },
    { id: 5, title: "Data Analysis", client: "Research Corp", status: "Completed", earnings: 400, completedDate: "2024-01-05" }
  ]);
  const [skills] = useState([
    { name: "React", level: "Advanced", projects: 5 },
    { name: "Node.js", level: "Intermediate", projects: 3 },
    { name: "Python", level: "Advanced", projects: 4 },
    { name: "UI/UX Design", level: "Intermediate", projects: 2 }
  ]);
  // Posts from database
  const [availableOpportunities, setAvailableOpportunities] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState(null);
  // Function to fetch posts from database
  const fetchPosts = async () => {
    try {
      setPostsLoading(true);
      setPostsError(null);
              const response = await fetch('/api/posts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.posts) {
          // Transform posts to match the expected format
          const transformedPosts = data.posts.map(post => ({
            id: post._id,
            title: post.title,
            client: post.clientName,
            type: post.type,
            category: post.category,
            budget: post.budget,
            deadline: post.deadline,
            location: post.location,
            requiredSkills: post.requiredSkills || [],
            degreeField: post.degreeField,
            description: post.description,
            postedDate: post.createdAt,
            tags: [post.category, post.type, ...(post.requiredSkills || [])],
            degreeRelevance: 85, // Default relevance score
            isBookmarked: false,
            clientOrganization: post.clientOrganization,
            status: post.status,
            applications: post.applications
          }));
          setAvailableOpportunities(transformedPosts);
        } else {
          setPostsError('Failed to fetch posts');
        }
      } else {
        setPostsError('Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPostsError('Error fetching posts');
    } finally {
      setPostsLoading(false);
    }
  };
  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  // Aggregated rating for student's services (gigs)
  const [serviceRating, setServiceRating] = useState({ avg: null, total: 0, loading: true, error: null });
  // Filter and search state
  const [filters, setFilters] = useState({
    searchQuery: "",
    selectedType: "All",
    selectedCategory: "All",
    selectedDegreeField: "All",
    selectedLocation: "All",
    minBudget: "",
    maxBudget: "",
    selectedTags: []
  });

  // Fetch services to compute rating whenever studentData is available
  useEffect(() => {
    const fetchServiceRating = async () => {
      if (!studentData?._id) return;
      try {
        setServiceRating(prev => ({ ...prev, loading: true, error: null }));
        const res = await fetch(`/api/services?freelancerId=${studentData._id}`);
        const json = await res.json();
        if (!json.success || !Array.isArray(json.data)) throw new Error(json.message || 'Failed');
        const services = json.data;
        const rated = services.filter(s => typeof s.rating === 'number' && (s.totalReviews || 0) > 0);
        if (rated.length === 0) {
          setServiceRating({ avg: 0, total: 0, loading: false, error: null });
          return;
        }
        const total = rated.reduce((sum, s) => sum + (s.totalReviews || 0), 0);
        const weighted = rated.reduce((sum, s) => sum + (s.rating * (s.totalReviews || 0)), 0);
        const avg = weighted / total;
        setServiceRating({ avg: Number(avg.toFixed(2)), total, loading: false, error: null });
      } catch (e) {
        console.error('Service rating fetch error', e);
        setServiceRating({ avg: 0, total: 0, loading: false, error: 'N/A' });
      }
    };
    fetchServiceRating();
  }, [studentData?._id]);
  // Bookmarked opportunities
  const [bookmarkedOpportunities, setBookmarkedOpportunities] = useState([]);
  // Recommendations state
  const [recommendations, setRecommendations] = useState([]);
  const [profileCompleteness, setProfileCompleteness] = useState(0);
  // Filter options
  const filterOptions = {
    types: ["All", "Project", "Internship", "Freelance", "Part-time Job"],
    categories: ["All", "Web Development", "Graphic Design", "Data Analysis", "Content Writing", "UI/UX Design", "Marketing"],
    degreeFields: ["All", "Computer Science", "Graphic Design", "Communications", "Design", "Business"],
    locations: ["All", "Remote", "On-site", "Hybrid"],
    tags: ["web development", "e-commerce", "UI/UX", "frontend", "graphic design", "logo", "branding", "creative", "data analysis", "python", "research", "analytics", "content writing", "tech", "SEO", "blogging", "mobile", "design", "fitness", "marketing", "social media", "part-time"]
  };
  // Helper functions
  const toggleBookmark = (opportunityId) => {
    // Find the opportunity in available opportunities
    const opportunity = availableOpportunities.find(opp => opp.id === opportunityId);
    if (!opportunity) return;
    const isCurrentlyBookmarked = opportunity.isBookmarked;
    // Update available opportunities
    setAvailableOpportunities(prev => {
      if (!prev || !Array.isArray(prev)) return prev;
      return prev.map(opp => 
        opp.id === opportunityId ? { ...opp, isBookmarked: !opp.isBookmarked } : opp
      );
    });
    // Update bookmarked opportunities
    setBookmarkedOpportunities(prev => {
      if (isCurrentlyBookmarked) {
        // Remove from bookmarks
        return prev.filter(opp => opp.id !== opportunityId);
      } else {
        // Add to bookmarks
        const opportunityToAdd = { ...opportunity, isBookmarked: true };
        return [...prev, opportunityToAdd];
      }
    });
    // Show notification
    const message = isCurrentlyBookmarked 
      ? `Removed "${opportunity.title}" from bookmarks` 
      : `Added "${opportunity.title}" to bookmarks`;
    setBookmarkNotification({
      show: true,
      message,
      type: isCurrentlyBookmarked ? 'removed' : 'added'
    });
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setBookmarkNotification({ show: false, message: '', type: '' });
    }, 3000);
  };
  const getFilteredOpportunities = () => {
    if (!availableOpportunities || !Array.isArray(availableOpportunities)) return [];
    return availableOpportunities.filter(opportunity => {
      // Search query filter
              if (filters.searchQuery && opportunity.title && typeof opportunity.title === 'string' && !opportunity.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
            opportunity.description && typeof opportunity.description === 'string' && !opportunity.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
            opportunity.client && typeof opportunity.client === 'string' && !opportunity.client.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
        return false;
      }
      // Type filter
      if (filters.selectedType !== "All" && opportunity.type !== filters.selectedType) {
        return false;
      }
      // Category filter
      if (filters.selectedCategory !== "All" && opportunity.category !== filters.selectedCategory) {
        return false;
      }
      // Degree field filter
      if (filters.selectedDegreeField !== "All" && opportunity.degreeField !== filters.selectedDegreeField) {
        return false;
      }
      // Location filter
      if (filters.selectedLocation !== "All" && opportunity.location !== filters.selectedLocation) {
        return false;
      }
      // Budget filter
      if (filters.minBudget && opportunity.budget < (parseInt(filters.minBudget) || 0)) {
        return false;
      }
      if (filters.maxBudget && opportunity.budget > (parseInt(filters.maxBudget) || 0)) {
        return false;
      }
      // Tags filter
              if (filters.selectedTags && Array.isArray(filters.selectedTags) && filters.selectedTags.length > 0 && opportunity.tags && Array.isArray(opportunity.tags) && 
            !filters.selectedTags.some(tag => opportunity.tags.includes(tag))) {
        return false;
      }
      return true;
    });
  };
  const clearFilters = () => {
    setFilters({
      searchQuery: "",
      selectedType: "All",
      selectedCategory: "All",
      selectedDegreeField: "All",
      selectedLocation: "All",
      minBudget: "",
      maxBudget: "",
      selectedTags: []
    });
  };
  // Orders management functions
  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      setOrdersError(null);
      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await fetch('/api/orders/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const result = await response.json();
      if (result.success) {
        setOrders(result.orders || []);
      } else {
        setOrdersError(result.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrdersError('Failed to fetch orders');
    } finally {
      setOrdersLoading(false);
    }
  };
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await fetch(`/api/orders/status/${orderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
                 body: JSON.stringify({ status: newStatus, statusType: 'freelancer' })
      });
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
      const result = await response.json();
      if (result.success) {
        // Update the order in local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId 
                             ? { ...order, status: newStatus, freelancerStatus: newStatus }
              : order
          )
        );
        return true;
      } else {
        throw new Error(result.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  };
  // Handle profile editing
  const handleEditProfile = () => {
    setShowEditPopup(true);
    setEditFormData({
      firstName: studentData?.firstName || '',
      lastName: studentData?.lastName || '',
      email: studentData?.email || '',
      phoneNumber: studentData?.phoneNumber || '',
      address: studentData?.address || '',
      degreeProgram: studentData?.degreeProgram || '',
      university: studentData?.university || '',
      gpa: studentData?.gpa || '',
      graduationYear: studentData?.graduationYear || '',
      dateOfBirth: studentData?.dateOfBirth || '',
      technicalSkills: studentData?.technicalSkills || [],
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setEditErrors({});
  };
  const handleSaveProfile = async () => {
    // Validate form
    if (!validateEditForm()) return;
    try {
      // Get the auth token
      const token = localStorage.getItem('userToken');
      if (!token) {
        alert('Authentication token not found. Please log in again.');
        return;
      }
      // Prepare the data to send to backend
      const updateData = {
        firstName: editFormData.firstName,
        lastName: editFormData.lastName,
        // Email is not included as it cannot be changed
        phoneNumber: editFormData.phoneNumber,
        address: editFormData.address,
        degreeProgram: editFormData.degreeProgram,
        university: editFormData.university,
        gpa: editFormData.gpa,
        graduationYear: editFormData.graduationYear,
        dateOfBirth: editFormData.dateOfBirth,
        technicalSkills: editFormData.technicalSkills
      };
      // Make API call to update profile
      const response = await fetch('/api/freelancer/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });
      const result = await response.json();
      if (result.success) {
        // Update the student data with edited values
        const updatedData = { 
          ...studentData, 
          ...updateData
        };
        setStudentData(updatedData);
        // Save to localStorage
        localStorage.setItem('userData', JSON.stringify(updatedData));
        // Close popup
        setShowEditPopup(false);
        // Recalculate profile completeness
        const newCompleteness = calculateProfileCompleteness(updatedData);
        setProfileCompleteness(newCompleteness);
        // Show success message
        alert("Profile updated successfully!");
      } else {
        // Show error message from backend
        alert(`Failed to update profile: ${result.message}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };
  const validateEditForm = () => {
    const errors = {};
    if (!editFormData.firstName.trim()) errors.firstName = "First name is required";
    if (!editFormData.lastName.trim()) errors.lastName = "Last name is required";
    // Email is read-only, so no validation needed
    // Validate technical skills
    if (!editFormData.technicalSkills || editFormData.technicalSkills.length === 0) {
      errors.technicalSkills = "At least one technical skill is required";
    }
    // Password validation (only if trying to change password)
    if (editFormData.newPassword || editFormData.confirmPassword) {
      if (!editFormData.currentPassword) errors.currentPassword = "Current password is required";
      if (!editFormData.newPassword) errors.newPassword = "New password is required";
      else if (editFormData.newPassword.length < 8) errors.newPassword = "Password must be at least 8 characters";
      if (editFormData.newPassword !== editFormData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    }
    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleCancelEdit = () => {
    setShowEditPopup(false);
    setEditFormData({});
    setEditErrors({});
  };
  const handleOnboardingComplete = async (formData) => {
    try {
      // Get the auth token
      const token = localStorage.getItem('userToken');
      if (!token) {
        alert('Authentication token not found. Please log in again.');
        return;
      }
      // Prepare the data to send to backend
      const updateData = {
        ...formData,
        // Convert skills back to string if needed
        technicalSkills: Array.isArray(formData.technicalSkills) ? 
          formData.technicalSkills.join(', ') : formData.technicalSkills
      };
      // Make API call to update profile
      const response = await fetch('/api/freelancer/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });
      const result = await response.json();
      if (result.success) {
        // Update the student data with edited values
        const updatedData = { 
          ...studentData, 
          ...updateData
        };
        setStudentData(updatedData);
        // Save to localStorage
        localStorage.setItem('userData', JSON.stringify(updatedData));
        // Close onboarding wizard
        setShowOnboardingWizard(false);
        // Recalculate profile completeness
        const newCompleteness = calculateProfileCompleteness(updatedData);
        setProfileCompleteness(newCompleteness);
        // Show success message
        alert("Profile completed successfully!");
      } else {
        // Show error message from backend
        alert(`Failed to complete profile: ${result.message}`);
      }
    } catch (error) {
      console.error('Error completing profile:', error);
      alert('Failed to complete profile. Please try again.');
    }
  };
  const handleSaveProfessionalSummary = async () => {
    try {
      setIsSavingSummary(true);
      setSummarySaveMessage('');
      // Get the auth token
      const token = localStorage.getItem('userToken');
      if (!token) {
        setSummarySaveMessage('Authentication token not found. Please log in again.');
        return;
      }
      // Prepare the data to send to backend
      const updateData = {
        bio: professionalSummary.bio,
        hourlyRate: parseFloat(professionalSummary.hourlyRate.replace(/[^0-9.]/g, '')) || 0
      };
      // Make API call to update profile
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });
      const result = await response.json();
      if (result.success) {
        // Update the student data with edited values
        const updatedData = { 
          ...studentData, 
          bio: updateData.bio,
          hourlyRate: updateData.hourlyRate
        };
        setStudentData(updatedData);
        // Save to localStorage
        localStorage.setItem('userData', JSON.stringify(updatedData));
        // Show success message
        setSummarySaveMessage('Professional summary saved successfully!');
        setTimeout(() => setSummarySaveMessage(''), 3000);
      } else {
        // Show error message from backend
        setSummarySaveMessage(`Failed to save: ${result.message}`);
      }
    } catch (error) {
      console.error('Error saving professional summary:', error);
      setSummarySaveMessage('Failed to save. Please try again.');
    } finally {
      setIsSavingSummary(false);
    }
  };
  // Calculate profile completeness
  const calculateProfileCompleteness = (studentData) => {
    if (!studentData) return 0;
    const fields = [
      studentData.firstName, studentData.lastName, studentData.email,
      studentData.degreeProgram, studentData.university, studentData.gpa,
      studentData.graduationYear, studentData.technicalSkills, studentData.dateOfBirth
    ];
    const completedFields = fields.filter(field => {
      if (field === null || field === undefined) return false;
      if (typeof field === 'string') return field.trim() !== '';
      if (typeof field === 'number') return field > 0;
      if (Array.isArray(field)) return field.length > 0;
      return Boolean(field);
    }).length;
    // CV file is optional and doesn't count towards profile completeness
    // Only count it if it's actually uploaded with valid data
    let cvBonus = 0;
    if (isValidCVFile(studentData.cvFile)) {
      cvBonus = 1;
    }
    const totalFields = fields.length + cvBonus;
    const totalCompleted = completedFields + cvBonus;
    return Math.round((totalCompleted / totalFields) * 100);
  };
  // Calculate initial profile completeness when component mounts
  useEffect(() => {
    if (studentData) {
      const completeness = calculateProfileCompleteness(studentData);
      setProfileCompleteness(completeness);
    }
  }, [studentData]);
  // Generate personalized recommendations
  const generateRecommendations = () => {
    if (!studentData) return [];
    const studentSkills = studentData.technicalSkills && typeof studentData.technicalSkills === 'string' ? 
      studentData.technicalSkills.split(',').map(skill => skill.trim().toLowerCase()) : [];
    const studentDegree = studentData.degreeProgram?.toLowerCase() || '';
    if (!availableOpportunities || !Array.isArray(availableOpportunities)) return [];
    return availableOpportunities
      .map(opportunity => {
        let score = 0;
        // Skills match (40% weight)
        const skillMatches = opportunity.requiredSkills && Array.isArray(opportunity.requiredSkills) ? 
          opportunity.requiredSkills.filter(skill => 
            studentSkills && Array.isArray(studentSkills) && studentSkills.some(studentSkill => 
              studentSkill.includes(skill && typeof skill === 'string' ? skill.toLowerCase() : '') || 
              (skill && typeof skill === 'string' ? skill.toLowerCase() : '').includes(studentSkill)
            )
          ).length : 0;
        score += opportunity.requiredSkills && Array.isArray(opportunity.requiredSkills) ? 
          (skillMatches / opportunity.requiredSkills.length) * 40 : 0;
        // Degree relevance (30% weight)
        if (opportunity.degreeField && typeof opportunity.degreeField === 'string' && 
            opportunity.degreeField.toLowerCase() === studentDegree) {
          score += 30;
        } else if (opportunity.degreeField && typeof opportunity.degreeField === 'string' && 
                   (opportunity.degreeField.toLowerCase().includes(studentDegree) || 
                    (studentDegree && typeof studentDegree === 'string' && studentDegree.includes(opportunity.degreeField.toLowerCase())))) {
          score += 20;
        }
        // Profile completeness bonus (20% weight)
        score += (profileCompleteness / 100) * 20;
        // Activity bonus (10% weight)
        const recentActivity = (stats?.activeProjects || 0) + (stats?.completedProjects || 0);
        if (recentActivity > 10) score += 10;
        else if (recentActivity > 5) score += 5;
        return {
          ...opportunity,
          recommendationScore: Math.round(score),
          skillMatchCount: skillMatches,
          totalSkills: opportunity.requiredSkills && Array.isArray(opportunity.requiredSkills) ? 
            opportunity.requiredSkills.length : 0
        };
      })
      .filter(opp => opp && opp.recommendationScore > 30) // Only show relevant recommendations
      .sort((a, b) => (a && b ? b.recommendationScore - a.recommendationScore : 0))
      .slice(0, 6); // Top 6 recommendations
  };
  // Update recommendations when student data changes
  useEffect(() => {
    if (studentData) {
      const completeness = calculateProfileCompleteness(studentData);
      setProfileCompleteness(completeness);
      const recs = generateRecommendations();
      setRecommendations(recs);
    }
  }, [studentData, availableOpportunities, stats]);
  // Sync bookmarked opportunities when available opportunities are loaded
  useEffect(() => {
    if (availableOpportunities && Array.isArray(availableOpportunities)) {
      const bookmarked = availableOpportunities.filter(opp => opp.isBookmarked);
      setBookmarkedOpportunities(bookmarked);
    }
  }, [availableOpportunities]);
  // Initialize professional summary state when student data is loaded
  useEffect(() => {
    if (studentData) {
      setProfessionalSummary({
        bio: studentData.bio || '',
        hourlyRate: studentData.hourlyRate ? `$${studentData.hourlyRate}/hour` : ''
      });
    }
  }, [studentData]);
  // CV Upload Functions
  const handleCVUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Only PDF, DOC, DOCX, JPEG, JPG, and PNG files are allowed.');
      return;
    }
    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size too large. Maximum size is 5MB.');
      return;
    }
    setCvFile(file);
    setIsUploadingCV(true);
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        alert('Authentication token not found. Please log in again.');
        return;
      }
      const formData = new FormData();
      formData.append('cvFile', file);
      const response = await fetch('/api/freelancer/cv', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const result = await response.json();
      if (result.success) {
        // Update student data with CV info
        setStudentData(prev => ({
          ...prev,
          cvFile: result.data.cvFile
        }));
        // Update localStorage
        const updatedData = { ...studentData, cvFile: result.data.cvFile };
        localStorage.setItem('userData', JSON.stringify(updatedData));
        // Recalculate profile completeness
        const newCompleteness = calculateProfileCompleteness(updatedData);
        setProfileCompleteness(newCompleteness);
        alert('CV uploaded successfully!');
      } else {
        alert(`Failed to upload CV: ${result.message}`);
      }
    } catch (error) {
      console.error('Error uploading CV:', error);
      alert('Failed to upload CV. Please try again.');
    } finally {
      setIsUploadingCV(false);
    }
  };
  const handleCVDelete = async () => {
    if (!studentData?.cvFile) return;
    if (!confirm('Are you sure you want to delete your CV?')) return;
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        alert('Authentication token not found. Please log in again.');
        return;
      }
      const response = await fetch('/api/freelancer/cv', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (result.success) {
        // Remove CV from student data
        setStudentData(prev => {
          const { cvFile, ...rest } = prev;
          return rest;
        });
        // Update localStorage
        const updatedData = { ...studentData };
        delete updatedData.cvFile;
        localStorage.setItem('userData', JSON.stringify(updatedData));
        // Recalculate profile completeness
        const newCompleteness = calculateProfileCompleteness(updatedData);
        setProfileCompleteness(newCompleteness);
        setCvFile(null);
        alert('CV deleted successfully!');
      } else {
        alert(`Failed to delete CV: ${result.message}`);
      }
    } catch (error) {
      console.error('Error deleting CV:', error);
      alert('Failed to delete CV. Please try again.');
    }
  };
  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationsError, setApplicationsError] = useState(null);
  // Application form state
  const [applicationForm, setApplicationForm] = useState({
    coverLetter: "",
    proposedTimeline: "",
    relevantExperience: "",
    portfolioLink: "",
    additionalNotes: "",
    cvFile: null,
    academicQualifications: "",
    availability: "",
    expectedGraduation: ""
  });
  // Function to fetch applications for the freelancer
  const fetchApplications = async () => {
    try {
      setApplicationsLoading(true);
      setApplicationsError(null);
      const token = localStorage.getItem('userToken');
      if (!token) return;
      const response = await fetch('/api/job-applications/my-applications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        console.log('Fetched applications:', result.data); // Debug log
        console.log('Applications structure:', result.data?.map(app => ({
          id: app._id,
          status: app.status,
          hasInterviewDetails: !!app.interviewDetails,
          interviewDetails: app.interviewDetails
        })));
        setApplications(result.data || []);
      } else {
        const errorData = await response.json();
        setApplicationsError(errorData.message || 'Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplicationsError('Network error. Please try again.');
    } finally {
      setApplicationsLoading(false);
    }
  };
  // Function to fetch complete profile data from backend
  const fetchCompleteProfile = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) return;
      const response = await fetch('/api/freelancer/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Debug: Log the data to see what's being received
          console.log('Fetched profile data:', result.data);
          console.log('CV file data:', result.data.cvFile);
          // Clean up invalid CV data if it exists
          let cleanedData = { ...result.data };
          if (cleanedData.cvFile && !isValidCVFile(cleanedData.cvFile)) {
            console.log('Removing invalid CV data:', cleanedData.cvFile);
            delete cleanedData.cvFile;
          }
          // Update student data with complete profile including CV
          setStudentData(cleanedData);
          // Update localStorage with complete data
          localStorage.setItem('userData', JSON.stringify(cleanedData));
          // Recalculate profile completeness
          const newCompleteness = calculateProfileCompleteness(cleanedData);
          setProfileCompleteness(newCompleteness);
        }
      }
    } catch (error) {
      console.error('Error fetching complete profile:', error);
    }
  };
  // Function to refresh user data (can be called manually if needed)
  const refreshUserData = () => {
    fetchCompleteProfile();
  };
  // Fetch applications when applications tab is active
  useEffect(() => {
    if (activeTab === 'applications' && studentData?._id) {
      fetchApplications();
    }
  }, [activeTab, studentData]);
  // Handle application withdrawal
  const handleWithdrawApplication = async (applicationId) => {
    if (window.confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('userToken');
        const response = await fetch(`/api/job-applications/${applicationId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          // Refresh applications list
          await fetchApplications();
        } else {
          const result = await response.json();
          alert(result.message || 'Failed to withdraw application');
        }
      } catch (error) {
        console.error('Error withdrawing application:', error);
        alert('Network error. Please try again.');
      }
    }
  };
  // Helper function to check if CV data is valid
  const isValidCVFile = (cvData) => {
    return cvData && 
           cvData.fileName && 
           cvData.filePath && 
           cvData.originalName &&
           cvData.fileSize &&
           cvData.fileSize > 0;
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
      const response = await fetch('/api/freelancer/profile-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Update student data with new profile image
          setStudentData(prev => ({
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
      const response = await fetch('/api/freelancer/profile-image', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (result.success) {
        // Update local state
        setStudentData(prev => ({
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
  // Function to delete user account
  const handleDeleteAccount = async () => {
    // Show confirmation dialog
    const isConfirmed = window.confirm(
      '⚠️ WARNING: This action cannot be undone!\n\n' +
      'Are you absolutely sure you want to delete your account?\n\n' +
      'This will permanently delete:\n' +
      '• Your profile and all data\n' +
      '• Your CV/resume files\n' +
      '• All your project history\n' +
      '• Your account credentials\n\n' +
      'Type "DELETE" to confirm:'
    );
    if (!isConfirmed) return;
    const userInput = prompt('Please type "DELETE" to confirm account deletion:');
    if (userInput !== 'DELETE') {
      alert('Account deletion cancelled. Your account is safe.');
      return;
    }
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        alert('Authentication token not found. Please log in again.');
        return;
      }
      const response = await fetch('/api/freelancer/account', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (result.success) {
        alert('Account deleted successfully. You will be redirected to the home page.');
        // Clear all local data
        localStorage.clear();
        // Redirect to home page
        navigate('/');
      } else {
        alert(`Failed to delete account: ${result.message}`);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again.');
    }
  };
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsed = JSON.parse(userData);
      console.log('Initial user data from localStorage:', parsed);
      console.log('CV file from localStorage:', parsed.cvFile);
      if (parsed.userType === 'freelancer') {
        // Clean up invalid CV data if it exists
        let cleanedData = { ...parsed };
        if (cleanedData.cvFile && !isValidCVFile(cleanedData.cvFile)) {
          console.log('Removing invalid CV data from localStorage:', cleanedData.cvFile);
          delete cleanedData.cvFile;
          // Update localStorage with cleaned data
          localStorage.setItem('userData', JSON.stringify(cleanedData));
        }
        setStudentData(cleanedData);
        // Fetch complete profile data from backend to ensure CV data is up to date
        fetchCompleteProfile();
      } else {
        navigate('/signin');
      }
    } else {
      navigate('/signin');
    }
  }, [navigate]);
  // Listen for auth state changes (when user logs in/out)
  useEffect(() => {
    const handleAuthChange = () => {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsed = JSON.parse(userData);
        if (parsed.userType === 'freelancer') {
          setStudentData(parsed);
          // Fetch fresh data from backend
          fetchCompleteProfile();
        }
      }
    };
    window.addEventListener('authStateChanged', handleAuthChange);
    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);
  // Fetch orders when orders tab is active
  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);
  // Handle URL query parameter for tab
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
          if (tabParam && ['overview', 'recommendations', 'opportunities', 'bookmarks', 'applications', 'profile', 'completeProfile'].includes(tabParam)) {
      // If trying to access completeProfile but profile is already complete, redirect to profile tab
      if (tabParam === 'completeProfile' && profileCompleteness >= 100) {
        setActiveTab('profile');
      } else {
        setActiveTab(tabParam);
      }
    }
  }, [location.search, profileCompleteness]);
  // Fetch verification status when component mounts
  useEffect(() => {
    if (studentData) {
      fetchVerificationStatus();
    }
  }, [studentData]);
  // Fetch posts when component mounts
  useEffect(() => {
    fetchPosts();
  }, []);
  // Fetch applications when component mounts
  useEffect(() => {
    if (studentData) {
      fetchApplications();
    }
  }, [studentData]);
  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('userToken');
    navigate('/');
  };
  // Verification functions
  const fetchVerificationStatus = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('/api/verification/status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (result.success) {
        setVerificationStatus(result.data);
      }
    } catch (error) {
      console.error('Error fetching verification status:', error);
    }
  };
  const handleVerificationRequest = () => {
    setShowVerificationPopup(true);
  };
  const handleVerificationRequestSubmitted = () => {
    fetchVerificationStatus();
  };
  const handleApply = (post) => {
    setSelectedPost(post);
    setShowApplicationForm(true);
  };
  const handleSubmitApplication = () => {
    if (!selectedPost) return;
    const newApplication = {
      id: Date.now(),
      postId: selectedPost.id,
      postTitle: selectedPost.title,
      status: "Pending",
      appliedDate: new Date().toISOString().split('T')[0]
    };
    // In a real app, this would be sent to the backend
    console.log("Application submitted:", { post: selectedPost, form: applicationForm });
    setShowApplicationForm(false);
    setSelectedPost(null);
    setApplicationForm({
      coverLetter: "",
      proposedTimeline: "",
      relevantExperience: "",
      portfolioLink: "",
      additionalNotes: "",
      cvFile: null,
      academicQualifications: "",
      availability: "",
      expectedGraduation: ""
    });
    // Show success message
    alert("Application submitted successfully!");
  };
  const renderOverview = () => (
    <div className="space-y-8">
      {/* Profile Completion Notification */}
      {profileCompleteness < 100 && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-3xl">🎯</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Complete Your Profile</h3>
                <p className="text-blue-100">
                  Your profile is {profileCompleteness}% complete. Add missing information to unlock better opportunities!
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowOnboardingWizard(true)}
              className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300"
            >
              Complete Now
            </button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-200">
          <p className="text-gray-600 text-sm mb-1">Completed Projects</p>
          <h3 className="text-3xl font-bold text-gray-900">{stats.loading ? '…' : stats.completedProjects}</h3>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-200">
          <p className="text-gray-600 text-sm mb-1">Active Projects</p>
          <h3 className="text-3xl font-bold text-gray-900">{stats.loading ? '…' : stats.activeProjects}</h3>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-purple-200">
          <p className="text-gray-600 text-sm mb-1">Total Earnings</p>
          <h3 className="text-3xl font-bold text-gray-900">{stats.loading ? '…' : `$${stats.totalEarnings}`}</h3>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-yellow-200">
          <p className="text-gray-600 text-sm mb-1">Rating</p>
          <h3 className="text-3xl font-bold text-gray-900 flex items-center">{stats.loading ? '…' : `${stats.ratingAverage}`}
            {!stats.loading && <span className="ml-2 text-yellow-500 text-xl">★</span>}
          </h3>
          <p className="text-xs text-gray-500 mt-1">{stats.loading ? '' : `${stats.totalReviews} review${stats.totalReviews === 1 ? '' : 's'}`}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-orange-200">
          <p className="text-gray-600 text-sm mb-1">Profile Complete</p>
          <h3 className="text-3xl font-bold text-gray-900">{profileCompleteness}%</h3>
          {profileCompleteness < 100 && (
            <button
              onClick={() => setShowOnboardingWizard(true)}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition-all duration-300"
            >
              Complete Now
            </button>
          )}
        </div>
      </div>
      {stats.error && (
        <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-xl">{stats.error}</div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Active Projects</h3>
          <div className="space-y-4">
            {activeProjects && Array.isArray(activeProjects) ? activeProjects.map(project => (
              <div key={project.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-gray-900">{project.title}</h4>
                    <p className="text-gray-600">{project.client}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">${project.earnings}</p>
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {project.status}
                    </span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{project.progress}% Complete</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                <p>No active projects</p>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Projects</h3>
          <div className="space-y-4">
            {recentProjects && Array.isArray(recentProjects) ? recentProjects.map(project => (
              <div key={project.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-gray-900">{project.title}</h4>
                    <p className="text-gray-600">{project.client}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">${project.earnings}</p>
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      {project.status}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Completed: {project.completedDate}</p>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                <p>No recent projects</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Top Recommendations */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Top Recommendations</h3>
          <button
            onClick={() => setActiveTab("recommendations")}
            className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            View All →
          </button>
        </div>
        {postsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading recommendations...</p>
          </div>
        ) : postsError ? (
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">⚠️</div>
            <p className="text-gray-600 mb-4">{postsError}</p>
            <button
              onClick={fetchPosts}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : recommendations && Array.isArray(recommendations) && recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.slice(0, 3).map(opportunity => (
              <div key={opportunity.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors duration-300">
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    opportunity.type === 'Project' ? 'bg-blue-100 text-blue-800' :
                    opportunity.type === 'Internship' ? 'bg-green-100 text-green-800' :
                    opportunity.type === 'Freelance' ? 'bg-purple-100 text-purple-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {opportunity.type}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full border border-green-500 text-green-600 bg-transparent">
                    {opportunity.recommendationScore}% Match
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">{opportunity.title}</h4>
                <p className="text-gray-600 text-xs mb-2">{opportunity.client}</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-green-600 font-semibold">${opportunity.budget}</span>
                  <span className="text-gray-500">{opportunity.skillMatchCount}/{opportunity.totalSkills} skills</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No recommendations available</p>
            <p className="text-sm mt-2">Complete your profile to get personalized recommendations</p>
          </div>
        )}
      </div>
    </div>
  );
  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900">My Orders</h3>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-all duration-300"
        >
          Refresh Orders
        </button>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Orders</p>
              <p className="text-2xl font-bold">{orders.length}</p>
            </div>
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Pending</p>
              <p className="text-2xl font-bold">{orders.filter(o => o.status === 'Pending').length}</p>
            </div>
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">In Progress</p>
              <p className="text-2xl font-bold">{orders.filter(o => o.status === 'In Progress').length}</p>
            </div>
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Completed</p>
              <p className="text-2xl font-bold">{orders.filter(o => o.status === 'Completed').length}</p>
            </div>
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      {/* Orders List */}
      {ordersLoading ? (
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      ) : ordersError ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{ordersError}</p>
            </div>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-600">You haven't received any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-gray-200 hover:border-yellow-400">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {order.serviceId?.title || 'Service Title'}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      (order.freelancerStatus || order.status) === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      (order.freelancerStatus || order.status) === 'In Progress' ? 'bg-purple-100 text-purple-800' :
                      (order.freelancerStatus || order.status) === 'Completed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.freelancerStatus || order.status}
                    </span>
                    {(() => {
                      const hasAdminPayout = Boolean(order?.paymentDetails?.paidAt);
                      const effectivePaymentStatus = (order.paymentStatus === 'Paid' && !hasAdminPayout)
                        ? 'Pending'
                        : (order.paymentStatus || 'Pending');
                      const badgeClass =
                        effectivePaymentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        effectivePaymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                        effectivePaymentStatus === 'Failed' ? 'bg-red-100 text-red-800' :
                        effectivePaymentStatus === 'Refunded' ? 'bg-gray-100 text-gray-800' :
                        'bg-gray-100 text-gray-800';
                      return (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}>
                          {effectivePaymentStatus}
                        </span>
                      );
                    })()}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div>
                      <p><strong>Client:</strong> {order.clientId?.firstName} {order.clientId?.lastName}</p>
                      <p><strong>Package:</strong> {order.packageDetails?.name}</p>
                      <p><strong>Amount:</strong> ${order.totalAmount}</p>
                    </div>
                    <div>
                      <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                      <p><strong>Deadline:</strong> {new Date(order.deadline).toLocaleDateString()}</p>
                      <p><strong>Requirements:</strong> {order.requirements}</p>
                    </div>
                  </div>
                  {/* Status Update Section for Freelancers */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Update Project Status:</label>
                        <select
                          value={order.freelancerStatus || order.status}
                          onChange={async (e) => {
                            try {
                              const newStatus = e.target.value;
                              await updateOrderStatus(order._id, newStatus);
                              // Show success message
                              alert('Order status updated successfully!');
                            } catch (error) {
                              alert('Failed to update order status: ' + error.message);
                            }
                          }}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Last updated: {new Date(order.updatedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  const [walletBalance, setWalletBalance] = useState(0);
  const fetchWalletBalance = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) return;
      const response = await fetch('/api/users/wallet/balance', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setWalletBalance(Number(data.walletBalance || 0));
      }
    } catch (e) {
      // noop
    }
  };
  useEffect(() => {
    if (activeTab === 'wallet') {
      fetchWalletBalance();
      fetchOrders();
    }
  }, [activeTab]);
  const [walletSearch, setWalletSearch] = useState("");
  const [downloadingStatement, setDownloadingStatement] = useState(false);
  const downloadWalletStatement = async () => {
    try {
      setDownloadingStatement(true);
      const token = localStorage.getItem('userToken');
      if (!token) {
        alert('You must be logged in to download the statement.');
        return;
      }
      const params = new URLSearchParams();
      // Potential future date range filters can be appended here
      const res = await fetch(`/api/users/wallet/statement?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to generate statement');
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wallet-statement-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Download failed: ' + err.message);
    } finally {
      setDownloadingStatement(false);
    }
  };
  const renderWallet = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900">Wallet</h3>
        <div className="flex items-center space-x-3">
          <button
            onClick={downloadWalletStatement}
            disabled={downloadingStatement}
            className={`px-4 py-2 rounded-lg font-medium text-white transition-colors duration-200 ${downloadingStatement ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {downloadingStatement ? 'Generating PDF...' : 'Download Statement'}
          </button>
        </div>
      </div>
      {/* Wallet Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Earnings</p>
              <p className="text-2xl font-bold">${walletBalance.toFixed(2)}</p>
            </div>
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Available Balance</p>
              <p className="text-2xl font-bold">${walletBalance.toFixed(2)}</p>
            </div>
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Pending Payments</p>
              <p className="text-2xl font-bold">$0.00</p>
            </div>
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      {/* Transaction History */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-semibold text-gray-900">Transaction History</h4>
          <input
            type="text"
            value={walletSearch}
            onChange={(e) => setWalletSearch(e.target.value)}
            placeholder="Search by title or category..."
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-xs"
          />
        </div>
        {(() => {
          const paidOrders = (orders || []).filter(o => Boolean(o?.paymentDetails?.paidAt));
          const transactions = paidOrders.map(o => ({
            id: o._id,
            title: o.serviceId?.title || 'Service',
            category: o.serviceId?.category || 'Other',
            amount: Number(o?.paymentDetails?.freelancerAmount || 0),
            date: o?.paymentDetails?.paidAt ? new Date(o.paymentDetails.paidAt) : null
          }));
          const filtered = transactions.filter(t => {
            const q = walletSearch.trim().toLowerCase();
            if (!q) return true;
            return t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
          });
          const categoryTotals = filtered.reduce((acc, t) => {
            const key = t.category;
            acc[key] = (acc[key] || 0) + t.amount;
            return acc;
          }, {});
          return (
            <div className="space-y-6">
              <div>
                <h5 className="text-sm font-semibold text-gray-700 mb-2">Category-wise Earnings</h5>
                {Object.keys(categoryTotals).length === 0 ? (
                  <p className="text-gray-500 text-sm">No earnings yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(categoryTotals).map(([cat, total]) => (
                      <div key={cat} className="border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                        <span className="text-gray-700 text-sm">{cat}</span>
                        <span className="text-gray-900 font-semibold">${total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <h5 className="text-sm font-semibold text-gray-700 mb-2">Transactions</h5>
                {filtered.length === 0 ? (
                  <div className="text-center py-10">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <p className="text-gray-500">No matching transactions.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filtered.map(t => (
                      <div key={t.id} className="py-3 flex items-center justify-between">
                        <div>
                          <p className="text-gray-900 font-medium">{t.title}</p>
                          <p className="text-gray-500 text-sm">{t.category}{t.date ? ` • ${t.date.toLocaleString()}` : ''}</p>
                        </div>
                        <div className="text-green-600 font-semibold">+${t.amount.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </div>
      {/* Removed Withdraw Funds and Payment Methods sections */}
    </div>
  );
  const renderBrowseOpportunities = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900">Available Opportunities</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab("bookmarks")}
            className="px-4 py-2 bg-yellow-500 text-white rounded-xl font-medium hover:bg-yellow-600 transition-all duration-300 relative"
          >
            📚 Bookmarks 
            {bookmarkedOpportunities && Array.isArray(bookmarkedOpportunities) && bookmarkedOpportunities.length > 0 && (
              <span className="ml-2 bg-white text-yellow-500 px-2 py-1 rounded-full text-xs font-bold">
                {bookmarkedOpportunities.length}
              </span>
            )}
          </button>
        </div>
      </div>
      {/* Advanced Filters */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search opportunities..."
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={filters.selectedType}
              onChange={(e) => setFilters(prev => ({ ...prev, selectedType: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {filterOptions.types && Array.isArray(filterOptions.types) ? filterOptions.types.map(type => (
                <option key={type} value={type}>{type}</option>
              )) : null}
            </select>
          </div>
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filters.selectedCategory}
              onChange={(e) => setFilters(prev => ({ ...prev, selectedCategory: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {filterOptions.categories && Array.isArray(filterOptions.categories) ? filterOptions.categories.map(category => (
                <option key={category} value={category}>{category}</option>
              )) : null}
            </select>
          </div>
          {/* Degree Field Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Degree Field</label>
            <select
              value={filters.selectedDegreeField}
              onChange={(e) => setFilters(prev => ({ ...prev, selectedDegreeField: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {filterOptions.degreeFields && Array.isArray(filterOptions.degreeFields) ? filterOptions.degreeFields.map(field => (
                <option key={field} value={field}>{field}</option>
              )) : null}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <select
              value={filters.selectedLocation}
              onChange={(e) => setFilters(prev => ({ ...prev, selectedLocation: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {filterOptions.locations && Array.isArray(filterOptions.locations) ? filterOptions.locations.map(location => (
                <option key={location} value={location}>{location}</option>
              )) : null}
            </select>
          </div>
          {/* Budget Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Min Budget ($)</label>
            <input
              type="number"
              placeholder="Min"
              value={filters.minBudget}
              onChange={(e) => setFilters(prev => ({ ...prev, minBudget: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Budget ($)</label>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxBudget}
              onChange={(e) => setFilters(prev => ({ ...prev, maxBudget: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        {/* Tags Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Skills/Tags</label>
          <div className="flex flex-wrap gap-2">
            {filterOptions.tags && Array.isArray(filterOptions.tags) ? filterOptions.tags.map(tag => (
              <button
                key={tag}
                onClick={() => {
                  setFilters(prev => ({
                    ...prev,
                    selectedTags: prev.selectedTags && Array.isArray(prev.selectedTags) && prev.selectedTags.includes(tag)
                      ? (prev.selectedTags && Array.isArray(prev.selectedTags) ? prev.selectedTags.filter(t => t !== tag) : [])
                      : [...(prev.selectedTags || []), tag]
                  }));
                }}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                  filters.selectedTags && Array.isArray(filters.selectedTags) && filters.selectedTags.includes(tag)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tag}
              </button>
            )) : null}
          </div>
        </div>
        {/* Filter Actions */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Showing {getFilteredOpportunities() && Array.isArray(getFilteredOpportunities()) ? getFilteredOpportunities().length : 0} of {availableOpportunities && Array.isArray(availableOpportunities) ? availableOpportunities.length : 0} opportunities
          </span>
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Clear All Filters
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {getFilteredOpportunities() && Array.isArray(getFilteredOpportunities()) ? getFilteredOpportunities().map(opportunity => (
          <div key={opportunity.id} className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="flex space-x-2">
                <span className={`px-3 py-1 text-xs rounded-full ${
                  opportunity.type === 'Project' ? 'bg-blue-100 text-blue-800' :
                  opportunity.type === 'Internship' ? 'bg-green-100 text-green-800' :
                  opportunity.type === 'Freelance' ? 'bg-purple-100 text-purple-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {opportunity.type}
                </span>
                <span className={`px-3 py-1 text-xs rounded-full ${
                  opportunity.degreeRelevance >= 90 ? 'bg-green-100 text-green-800' :
                  opportunity.degreeRelevance >= 70 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {opportunity.degreeRelevance}% Match
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleBookmark(opportunity.id)}
                  className={`text-2xl transition-all duration-300 hover:scale-110 ${
                    opportunity.isBookmarked ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                  }`}
                  title={opportunity.isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
                >
                  {opportunity.isBookmarked ? '★' : '☆'}
                </button>
                <span className="text-sm text-gray-500">{opportunity.postedDate}</span>
              </div>
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">{opportunity.title}</h4>
            <p className="text-gray-600 text-sm mb-3">{opportunity.client}</p>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Budget:</span>
                <span className="font-semibold text-green-600">${opportunity.budget}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Deadline:</span>
                <span className="font-semibold">{opportunity.deadline}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Location:</span>
                <span className="font-semibold">{opportunity.location}</span>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Required Skills:</p>
              <div className="flex flex-wrap gap-1">
                {opportunity.requiredSkills && Array.isArray(opportunity.requiredSkills) ? 
                  opportunity.requiredSkills.map(skill => (
                    <span key={skill} className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {skill}
                    </span>
                  )) : <span className="text-gray-400 text-xs">No skills specified</span>
                }
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Tags:</p>
              <div className="flex flex-wrap gap-1">
                {opportunity.tags && Array.isArray(opportunity.tags) ? 
                  opportunity.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                      {tag}
                    </span>
                  )) : <span className="text-gray-400 text-xs">No tags specified</span>
                }
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{opportunity.description}</p>
            <button
              onClick={() => handleApply(opportunity)}
              className="w-full px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-xl font-medium hover:from-blue-500 hover:to-blue-600 transition-all duration-300"
            >
              Apply Now
            </button>
          </div>
        )) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No opportunities available</p>
          </div>
        )}
      </div>
    </div>
  );
  const renderApplicationForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Apply to: {selectedPost?.title}</h3>
            <button
              onClick={() => {
                setShowApplicationForm(false);
                setSelectedPost(null);
              }}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmitApplication(); }} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cover Letter *</label>
              <textarea
                required
                rows={4}
                value={applicationForm.coverLetter}
                onChange={(e) => setApplicationForm(prev => ({ ...prev, coverLetter: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                placeholder="Explain why you're the best fit for this opportunity..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Proposed Timeline *</label>
              <input
                type="text"
                required
                value={applicationForm.proposedTimeline}
                onChange={(e) => setApplicationForm(prev => ({ ...prev, proposedTimeline: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                placeholder="e.g., 2 weeks, 1 month"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Relevant Experience *</label>
              <textarea
                required
                rows={3}
                value={applicationForm.relevantExperience}
                onChange={(e) => setApplicationForm(prev => ({ ...prev, relevantExperience: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                placeholder="Describe your relevant experience and projects..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio Link</label>
              <input
                type="url"
                value={applicationForm.portfolioLink}
                onChange={(e) => setApplicationForm(prev => ({ ...prev, portfolioLink: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                placeholder="https://your-portfolio.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CV/Resume Upload *</label>
              <input
                type="file"
                required
                accept=".pdf,.doc,.docx"
                onChange={(e) => setApplicationForm(prev => ({ ...prev, cvFile: e.target.files[0] }))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">Upload your CV/Resume (PDF, DOC, DOCX)</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Academic Qualifications *</label>
              <textarea
                required
                rows={3}
                value={applicationForm.academicQualifications}
                onChange={(e) => setApplicationForm(prev => ({ ...prev, academicQualifications: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                placeholder="List your academic achievements, certifications, relevant courses..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Availability *</label>
              <input
                type="text"
                required
                value={applicationForm.availability}
                onChange={(e) => setApplicationForm(prev => ({ ...prev, availability: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                placeholder="e.g., 20 hours/week, flexible schedule, weekends only"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expected Graduation</label>
              <input
                type="text"
                value={applicationForm.expectedGraduation}
                onChange={(e) => setApplicationForm(prev => ({ ...prev, expectedGraduation: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                placeholder="e.g., May 2025, December 2024"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
              <textarea
                rows={3}
                value={applicationForm.additionalNotes}
                onChange={(e) => setApplicationForm(prev => ({ ...prev, additionalNotes: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                placeholder="Any additional information you'd like to share..."
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowApplicationForm(false);
                  setSelectedPost(null);
                }}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-xl font-medium hover:from-blue-500 hover:to-blue-600"
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
  const renderBookmarks = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900">Bookmarked Opportunities</h3>
        <button
          onClick={() => setActiveTab("opportunities")}
          className="px-4 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-all duration-300"
        >
          ← Back to Browse
        </button>
        </div>
      {bookmarkedOpportunities && Array.isArray(bookmarkedOpportunities) && bookmarkedOpportunities.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-200">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookmarks yet</h3>
          <p className="text-gray-600 mb-6">Start browsing opportunities and bookmark the ones you're interested in!</p>
          <button
            onClick={() => setActiveTab("opportunities")}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-all duration-300"
          >
            Browse Opportunities
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {bookmarkedOpportunities && Array.isArray(bookmarkedOpportunities) ? bookmarkedOpportunities.map(opportunity => (
            <div key={opportunity.id} className="bg-white rounded-2xl shadow-xl border border-yellow-200 p-6 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="flex space-x-2">
                  <span className={`px-3 py-1 text-xs rounded-full ${
                    opportunity.type === 'Project' ? 'bg-blue-100 text-blue-800' :
                    opportunity.type === 'Internship' ? 'bg-green-100 text-green-800' :
                    opportunity.type === 'Freelance' ? 'bg-purple-100 text-purple-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {opportunity.type}
                  </span>
                  <span className={`px-3 py-1 text-xs rounded-full ${
                    opportunity.degreeRelevance >= 90 ? 'bg-green-100 text-green-800' :
                    opportunity.degreeRelevance >= 70 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {opportunity.degreeRelevance}% Match
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleBookmark(opportunity.id)}
                    className="text-2xl text-yellow-500 transition-all duration-300 hover:scale-110"
                    title="Remove from bookmarks"
                  >
                    ★
                  </button>
                  <span className="text-sm text-gray-500">{opportunity.postedDate}</span>
                </div>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">{opportunity.title}</h4>
              <p className="text-gray-600 text-sm mb-3">{opportunity.client}</p>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Budget:</span>
                  <span className="font-semibold text-green-600">${opportunity.budget}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Deadline:</span>
                  <span className="font-semibold">{opportunity.deadline}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Location:</span>
                  <span className="font-semibold">{opportunity.location}</span>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Required Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {opportunity.requiredSkills && Array.isArray(opportunity.requiredSkills) ? 
                    opportunity.requiredSkills.map(skill => (
                      <span key={skill} className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {skill}
                      </span>
                    )) : <span className="text-gray-400 text-xs">No skills specified</span>
                  }
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Tags:</p>
                <div className="flex flex-wrap gap-1">
                  {opportunity.tags && Array.isArray(opportunity.tags) ? 
                    opportunity.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                        {tag}
                      </span>
                    )) : <span className="text-gray-400 text-xs">No tags specified</span>
                  }
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{opportunity.description}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleApply(opportunity)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-xl font-medium hover:from-blue-500 hover:to-blue-600 transition-all duration-300"
                >
                  Apply Now
                </button>
                <button
                  onClick={() => toggleBookmark(opportunity.id)}
                  className="px-4 py-2 border-2 border-yellow-500 text-yellow-500 rounded-xl font-medium hover:bg-yellow-500 hover:text-white transition-all duration-300"
                >
                  Remove
                </button>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No bookmarked opportunities</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
  const renderProfile = () => (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-black via-gray-900 to-black text-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          {/* Profile Picture */}
          <div className="relative group profile-image-container">
            {studentData?.profileImage?.url ? (
              <div className="relative">
                <img
                  src={studentData.profileImage.url}
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
                  {studentData?.firstName && typeof studentData.firstName === 'string' ? studentData.firstName.charAt(0) : 'S'}{studentData?.lastName && typeof studentData.lastName === 'string' ? studentData.lastName.charAt(0) : 'T'}
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
                {studentData?.profileImage?.url ? 'Click for options' : 'Click to upload photo'}
              </p>
            </div>
          </div>
          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold mb-2">
              {studentData?.firstName} {studentData?.lastName}
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              Student Freelancer • {studentData?.degreeProgram || 'Student'}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
              <div className="flex items-center">
                <div className="flex items-center mr-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-5 h-5 ${serviceRating.avg && i < Math.round(serviceRating.avg) ? 'text-yellow-400' : 'text-gray-600'} transition-colors`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                {serviceRating.loading ? (
                  <span className="text-sm text-gray-400">Loading...</span>
                ) : serviceRating.error ? (
                  <span className="text-sm text-gray-400">N/A</span>
                ) : (
                  <span className="text-sm text-gray-200 font-medium">{serviceRating.avg} ({serviceRating.total} review{serviceRating.total !== 1 ? 's' : ''})</span>
                )}
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{studentData?.university || 'University'}</span>
              </div>
              <div className="flex items-center px-3 py-1 rounded-full bg-green-500">
                <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                <span className="text-sm font-medium">Available Now</span>
              </div>
            </div>
            <p className="text-gray-300 max-w-2xl">
              {studentData?.bio || `Passionate ${studentData?.degreeProgram || 'student'} with expertise in web development and design. Looking for freelance opportunities to gain real-world experience and build a strong portfolio.`}
              {studentData?.profileImage?.url && (
                <span className="block mt-2 text-sm text-green-300">
                  ✓ Professional profile picture uploaded
                </span>
              )}
            </p>
          </div>
          {/* Action Buttons */}
          <div className="flex flex-col space-y-3">
            {profileCompleteness < 100 && (
              <button 
                onClick={() => setActiveTab("completeProfile")}
                className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Complete Profile
              </button>
            )}
            <button 
              onClick={handleEditProfile}
              className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              {isEditingProfile ? 'Cancel Edit' : 'Edit Profile'}
            </button>
            <button className="bg-white hover:bg-gray-100 text-gray-800 px-6 py-2 rounded-lg font-semibold transition-colors">
              View Portfolio
            </button>
            {!verificationStatus.isVerified && (
              <button 
                onClick={handleVerificationRequest}
                className="bg-green-500 hover:bg-green-400 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                {verificationStatus.verificationRequest?.status === 'pending' ? 'Request Pending' : 'Verify Now'}
              </button>
            )}
            {verificationStatus.isVerified && (
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors cursor-default">
                ✓ Verified
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">Personal Information</h3>
              {profileCompleteness < 100 && (
                <button
                  onClick={() => setActiveTab("completeProfile")}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-all duration-300"
                >
                  Complete Profile
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input 
                  type="text" 
                  value={studentData?.firstName || ''}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input 
                  type="text" 
                  value={studentData?.lastName || ''}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-blue-200 focus:border-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={studentData?.email || ''}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  value={studentData?.phoneNumber || 'Not specified'}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                    studentData?.phoneNumber ? 'border-gray-300' : 'border-gray-300 bg-gray-50'
                  }`}
                  readOnly
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input 
                  type="text" 
                  value={studentData?.address || 'Not specified'}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                    studentData?.address ? 'border-gray-300' : 'border-gray-300 bg-gray-50'
                  }`}
                  readOnly
                />
              </div>
            </div>
          </div>
          {/* Contact & Social Information Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">Contact & Social</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Contact Method</label>
                <div className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-50">
                  <span className="text-sm text-gray-600">
                    {studentData?.phoneNumber ? 'Phone & Email' : 'Email Only'}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Response Time</label>
                <div className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-50">
                  <span className="text-sm text-gray-600">Within 24 hours</span>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
                <div className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-50">
                  <span className="text-sm text-gray-600">
                    {studentData?.linkedinProfile || 'Not specified'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">Academic Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Degree Program
                  {!studentData?.degreeProgram && <span className="text-red-500 ml-1">*</span>}
                </label>
                {isEditingProfile ? (
                  <input 
                    type="text" 
                    value={editedProfileData.degreeProgram || ''}
                    onChange={(e) => setEditedProfileData({...editedProfileData, degreeProgram: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                    placeholder="Enter your degree program"
                  />
                ) : (
                  <input 
                    type="text" 
                    value={studentData?.degreeProgram || 'Not specified'}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                      studentData?.degreeProgram ? 'border-gray-300' : 'border-red-300 bg-red-50'
                    }`}
                    readOnly
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  University
                  {!studentData?.university && <span className="text-red-500 ml-1">*</span>}
                </label>
                {isEditingProfile ? (
                  <input 
                    type="text" 
                    value={editedProfileData.university || ''}
                    onChange={(e) => setEditedProfileData({...editedProfileData, university: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                    placeholder="Enter your university"
                  />
                ) : (
                  <input 
                    type="text" 
                    value={studentData?.university || 'Not specified'}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                      studentData?.university ? 'border-gray-300' : 'border-red-300 bg-red-50'
                    }`}
                    readOnly
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GPA
                  {!studentData?.gpa && <span className="text-red-500 ml-1">*</span>}
                </label>
                {isEditingProfile ? (
                  <input 
                    type="text" 
                    value={editedProfileData.gpa || ''}
                    onChange={(e) => setEditedProfileData({...editedProfileData, gpa: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                    placeholder="Enter your GPA (e.g., 3.8)"
                  />
                ) : (
                  <input 
                    type="text" 
                    value={studentData?.gpa || 'Not specified'}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                      studentData?.gpa ? 'border-gray-300' : 'border-red-300 bg-red-50'
                    }`}
                    readOnly
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Graduation Year
                  {!studentData?.graduationYear && <span className="text-red-500 ml-1">*</span>}
                </label>
                {isEditingProfile ? (
                  <input 
                    type="text" 
                    value={editedProfileData.graduationYear || ''}
                    onChange={(e) => setEditedProfileData({...editedProfileData, graduationYear: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                    placeholder="Enter graduation year (e.g., 2025)"
                  />
                ) : (
                  <input 
                    type="text" 
                    value={studentData?.graduationYear || 'Not specified'}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                      studentData?.graduationYear ? 'border-gray-300' : 'border-red-300 bg-red-50'
                    }`}
                    readOnly
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                {isEditingProfile ? (
                  <input 
                    type="date" 
                    value={editedProfileData.dateOfBirth || ''}
                    onChange={(e) => setEditedProfileData({...editedProfileData, dateOfBirth: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                  />
                ) : (
                  <input 
                    type="text" 
                    value={studentData?.dateOfBirth || 'Not specified'}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                    readOnly
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CV/Resume
                  {!studentData?.cvFile && <span className="text-red-500 ml-1">*</span>}
                </label>
                <div className={`w-full px-4 py-3 border-2 rounded-xl ${
                  studentData?.cvFile ? 'border-gray-300 bg-green-50' : 'border-red-300 bg-red-50'
                }`}>
                  <span className={`text-sm ${studentData?.cvFile ? 'text-green-700' : 'text-red-600'}`}>
                    {studentData?.cvFile ? 'CV uploaded' : 'CV not uploaded'}
                  </span>
                </div>
              </div>
            </div>
            {/* Edit Mode Action Buttons */}
            {isEditingProfile && (
              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCancelEdit}
                  className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
          {/* Skills & Expertise Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">Skills & Expertise</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technical Skills
                  {(!studentData?.technicalSkills || studentData.technicalSkills.length === 0) && <span className="text-red-500 ml-1">*</span>}
                </label>
                {isEditingProfile ? (
                  <input 
                    type="text" 
                    value={editedProfileData.technicalSkills ? editedProfileData.technicalSkills.join(', ') : ''}
                    onChange={(e) => {
                      const skills = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill);
                      setEditedProfileData({...editedProfileData, technicalSkills: skills});
                    }}
                    className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                    placeholder="Enter skills separated by commas (e.g., React, Node.js, Python)"
                  />
                ) : (
                  <div className={`w-full px-4 py-3 border-2 rounded-xl ${
                    studentData?.technicalSkills && studentData.technicalSkills.length > 0 ? 'border-gray-300 bg-gray-50' : 'border-red-300 bg-red-50'
                  }`}>
                    {studentData?.technicalSkills && studentData.technicalSkills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {studentData.technicalSkills.map((skill, index) => (
                          <span key={index} className="px-3 py-1 border border-blue-300 text-blue-600 rounded-full text-sm font-medium bg-transparent">
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-red-600">No technical skills specified</span>
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Programming Languages</label>
                <div className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-50">
                  <span className="text-sm text-gray-600">
                    {studentData?.programmingSkills || 'Not specified'}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Frameworks & Tools</label>
                <div className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-50">
                  <span className="text-sm text-gray-600">
                    {studentData?.frameworks || 'Not specified'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Professional Summary</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                  placeholder="Tell us about yourself, your skills, and what you're looking for..."
                  value={professionalSummary.bio || studentData?.bio || ''}
                  onChange={(e) => setProfessionalSummary(prev => ({ ...prev, bio: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                  placeholder="$15-25/hour"
                  value={professionalSummary.hourlyRate || (studentData?.hourlyRate ? `$${studentData.hourlyRate}/hour` : '')}
                  onChange={(e) => setProfessionalSummary(prev => ({ ...prev, hourlyRate: e.target.value }))}
                />
              </div>
              {/* Save Message */}
              {summarySaveMessage && (
                <div className={`p-3 rounded-lg text-sm font-medium ${
                  summarySaveMessage.includes('successfully') 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {summarySaveMessage}
                </div>
              )}
              {/* Save Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSaveProfessionalSummary}
                  disabled={isSavingSummary}
                  className={`px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
                    isSavingSummary
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:scale-105'
                  }`}
                >
                  {isSavingSummary ? (
                    <div className="flex items-center space-x-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    'Save Professional Summary'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Stats</h3>
            {stats.loading ? (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <svg className="animate-spin h-4 w-4 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Loading overview...</span>
              </div>
            ) : stats.error ? (
              <div className="text-sm text-red-600">{stats.error}</div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completed Projects</span>
                  <span className="font-bold text-yellow-600">{stats.completedProjects}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Projects</span>
                  <span className="font-bold text-blue-600">{stats.activeProjects}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Earnings</span>
                  <span className="font-bold text-green-600">${stats.totalEarnings.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Rating</span>
                  <span className="font-bold text-yellow-600">{stats.ratingAverage ? stats.ratingAverage.toFixed(2) : '0.00'}/5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Reviews</span>
                  <span className="font-bold text-purple-600">{stats.totalReviews}</span>
                </div>
              </div>
            )}
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {studentData?.technicalSkills && Array.isArray(studentData.technicalSkills) ? studentData.technicalSkills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 border border-yellow-500 text-yellow-600 rounded-full text-sm font-medium bg-transparent"
                >
                  {skill}
                </span>
              )) : (
                <>
                  <span className="px-3 py-1 border border-yellow-500 text-yellow-600 rounded-full text-sm font-medium bg-transparent">React</span>
                  <span className="px-3 py-1 border border-yellow-500 text-yellow-600 rounded-full text-sm font-medium bg-transparent">Node.js</span>
                  <span className="px-3 py-1 border border-yellow-500 text-yellow-600 rounded-full text-sm font-medium bg-transparent">Python</span>
                  <span className="px-3 py-1 border border-yellow-500 text-yellow-600 rounded-full text-sm font-medium bg-transparent">UI/UX Design</span>
                </>
              )}
            </div>
          </div>
          {/* CV/Resume Upload Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">CV/Resume</h3>
              <button
                onClick={refreshUserData}
                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                title="Refresh CV data"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            {/* Debug info - remove this after testing */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-4 p-2 bg-gray-100 rounded text-xs text-gray-600">
                <strong>Debug:</strong> CV Data: {JSON.stringify(studentData?.cvFile, null, 2)}
                <br />
                <strong>Is Valid CV:</strong> {isValidCVFile(studentData?.cvFile) ? 'Yes' : 'No'}
              </div>
            )}
            <div className="space-y-4">
              {isValidCVFile(studentData?.cvFile) ? (
                <div className="border-2 border-green-200 bg-green-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{studentData.cvFile.originalName}</p>
                        <p className="text-sm text-gray-500">
                          {(studentData.cvFile.fileSize / 1024 / 1024).toFixed(2)} MB • 
                          {new Date(studentData.cvFile.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <a
                                                  href={`/${studentData.cvFile.filePath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                      >
                        View
                      </a>
                      <button
                        onClick={handleCVDelete}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Upload your CV/Resume</h4>
                  <p className="text-gray-500 mb-4">
                    Upload your CV or resume in PDF, DOC, DOCX, JPEG, JPG, or PNG format (max 5MB)
                  </p>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleCVUpload}
                      className="hidden"
                      disabled={isUploadingCV}
                    />
                    <span className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                      isUploadingCV ? 'opacity-50 cursor-not-allowed' : ''
                    }`}>
                      {isUploadingCV ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Uploading...
                        </>
                      ) : (
                        'Choose File'
                      )}
                    </span>
                  </label>
                </div>
              )}
            </div>
          </div>
          {/* Danger Zone - Account Deletion */}
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl shadow-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-red-800">Danger Zone</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-red-700 mb-3">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">What will be deleted:</h4>
                  <ul className="text-red-700 text-sm space-y-1">
                    <li>• Your complete profile and personal information</li>
                    <li>• All uploaded CV/resume files</li>
                    <li>• Project history and applications</li>
                    <li>• Account credentials and authentication</li>
                    <li>• All associated data and preferences</li>
                  </ul>
                </div>
              </div>
              <button
                onClick={handleDeleteAccount}
                className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors duration-200 border-2 border-red-600 hover:border-red-700"
              >
                🗑️ Delete My Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  // Edit Profile Popup Form
  const renderEditProfilePopup = () => {
    if (!showEditPopup) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Edit Profile</h2>
                <p className="text-blue-100 text-sm mt-1">Update your profile information (email cannot be changed)</p>
              </div>
              <button
                onClick={handleCancelEdit}
                className="text-white hover:text-gray-200 text-2xl font-bold"
              >
                ×
              </button>
            </div>
          </div>
          {/* Form */}
          <div className="p-6 space-y-6">
            {/* Information Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-blue-800">What you can edit:</h4>
                  <ul className="text-xs text-blue-700 mt-1 space-y-1">
                    <li>• Personal information (name, phone, address)</li>
                    <li>• Academic details (degree, university, GPA, graduation year)</li>
                    <li>• Skills and expertise</li>
                    <li>• Password (optional)</li>
                  </ul>
                  <p className="text-xs text-blue-600 mt-2 font-medium">
                    <span className="font-semibold">Security Note:</span> Email address cannot be changed for security reasons. 
                    Contact support if you need to update your email.
                  </p>
                </div>
              </div>
            </div>
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    value={editFormData.firstName || ''}
                    onChange={(e) => setEditFormData({...editFormData, firstName: e.target.value})}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                      editErrors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter first name"
                  />
                  {editErrors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{editErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    value={editFormData.lastName || ''}
                    onChange={(e) => setEditFormData({...editFormData, lastName: e.target.value})}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                      editErrors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter last name"
                  />
                  {editErrors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{editErrors.lastName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email * 
                    <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Read Only
                    </span>
                  </label>
                  <input
                    type="email"
                    value={editFormData.email || ''}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed"
                    readOnly
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed for security reasons</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={editFormData.phoneNumber || ''}
                    onChange={(e) => setEditFormData({...editFormData, phoneNumber: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    value={editFormData.address || ''}
                    onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                    placeholder="Enter your address"
                  />
                </div>
              </div>
            </div>
            {/* Academic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Academic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Degree Program</label>
                  <input
                    type="text"
                    value={editFormData.degreeProgram || ''}
                    onChange={(e) => setEditFormData({...editFormData, degreeProgram: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                    placeholder="Enter degree program"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">University</label>
                  <input
                    type="text"
                    value={editFormData.university || ''}
                    onChange={(e) => setEditFormData({...editFormData, university: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                    placeholder="Enter university"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GPA</label>
                  <input
                    type="text"
                    value={editFormData.gpa || ''}
                    onChange={(e) => setEditFormData({...editFormData, gpa: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                    placeholder="Enter GPA (e.g., 3.8)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
                  <input
                    type="text"
                    value={editFormData.graduationYear || ''}
                    onChange={(e) => setEditFormData({...editFormData, graduationYear: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                    placeholder="Enter graduation year (e.g., 2025)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={editFormData.dateOfBirth || ''}
                    onChange={(e) => setEditFormData({...editFormData, dateOfBirth: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            {/* Skills & Expertise */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Skills & Expertise</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Technical Skills
                    {(!editFormData.technicalSkills || editFormData.technicalSkills.length === 0) && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <input 
                    type="text" 
                    value={editFormData.technicalSkills ? editFormData.technicalSkills.join(', ') : ''}
                    onChange={(e) => {
                      const skills = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill);
                      setEditFormData({...editFormData, technicalSkills: skills});
                    }}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                      editErrors.technicalSkills ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter skills separated by commas (e.g., React, Node.js, Python)"
                  />
                  {editErrors.technicalSkills && (
                    <p className="text-red-500 text-sm mt-1">{editErrors.technicalSkills}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Separate multiple skills with commas</p>
                </div>
              </div>
            </div>
            {/* Password Change */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Change Password (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={editFormData.currentPassword || ''}
                      onChange={(e) => setEditFormData({...editFormData, currentPassword: e.target.value})}
                      className={`w-full px-4 py-3 pr-10 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                        editErrors.currentPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {editErrors.currentPassword && (
                    <p className="text-red-500 text-sm mt-1">{editErrors.currentPassword}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={editFormData.newPassword || ''}
                      onChange={(e) => setEditFormData({...editFormData, newPassword: e.target.value})}
                      className={`w-full px-4 py-3 pr-10 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                        editErrors.newPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showNewPassword ? (
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {editErrors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">{editErrors.newPassword}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={editFormData.confirmPassword || ''}
                      onChange={(e) => setEditFormData({...editFormData, confirmPassword: e.target.value})}
                      className={`w-full px-4 py-3 pr-10 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                        editErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {editErrors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{editErrors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                onClick={handleCancelEdit}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  if (!studentData) return <div>Loading...</div>;
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Left Sidebar - Fixed width, full height, positioned below header */}
      <div className="w-64 bg-white shadow-2xl border-r border-gray-200 flex-shrink-0 mt-20">
        {/* Sidebar Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-6 border-b border-yellow-300">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-yellow-500 font-bold text-lg">S</span>
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Student Panel</h2>
              <p className="text-yellow-100 text-sm">Dashboard Navigation</p>
            </div>
          </div>
        </div>
        {/* Navigation Menu */}
        <div className="p-4">
          <nav className="flex flex-col space-y-1">
            {[
              { id: "overview", name: "Overview", icon: "📊" },
              { id: "recommendations", name: "Recommended", icon: "⭐" },
              { id: "opportunities", name: "Browse Opportunities", icon: "🔍" },
              { id: "bookmarks", name: "Bookmarks", icon: "📚", count: bookmarkedOpportunities.length },
              { id: "applications", name: "My Applications", icon: "📝" },
              { id: "gigs", name: "My Gigs", icon: "💼" },
              { id: "orders", name: "My Orders", icon: "📦" },
              { id: "wallet", name: "Wallet", icon: "💰" },
              { id: "messages", name: "Messages", icon: "💬" },
              { id: "profile", name: "Profile", icon: "👤" }
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
                <span className="text-lg flex-shrink-0">{tab.icon}</span>
                <span className="font-medium">{tab.name}</span>
                {tab.count > 0 && (
                  <span className="ml-auto bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>
              {/* Main Content Area */}
        <div className="flex-1 p-8 pt-8 overflow-y-auto mt-20">
          {/* Bookmark Notification */}
          {bookmarkNotification.show && (
            <div className={`fixed top-24 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
              bookmarkNotification.type === 'added' 
                ? 'bg-green-500 text-white' 
                : 'bg-yellow-500 text-white'
            }`}>
              <div className="flex items-center space-x-2">
                <span className="text-lg">
                  {bookmarkNotification.type === 'added' ? '★' : '☆'}
                </span>
                <span className="font-medium">{bookmarkNotification.message}</span>
                <button
                  onClick={() => setBookmarkNotification({ show: false, message: '', type: '' })}
                  className="ml-2 text-white hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
          <div className="max-w-7xl mx-auto">
            {activeTab === "overview" && renderOverview()}
            {activeTab === "recommendations" && (
              <EnhancedRecommendations
                availableOpportunities={availableOpportunities}
                studentData={studentData}
                profileCompleteness={profileCompleteness}
                onApply={handleApply}
                onBookmark={toggleBookmark}
                loading={postsLoading}
                error={postsError}
                onRetry={fetchPosts}
              />
            )}
            {activeTab === "opportunities" && renderBrowseOpportunities()}
            {activeTab === "bookmarks" && renderBookmarks()}
            {activeTab === "orders" && renderOrders()}
            {activeTab === "wallet" && renderWallet()}
            {activeTab === "applications" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">My Applications</h2>
                  <button
                    onClick={fetchApplications}
                    disabled={applicationsLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    {applicationsLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Refreshing...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Refresh</span>
                      </>
                    )}
                  </button>
                </div>
                {applicationsLoading && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your applications...</p>
                  </div>
                )}
                {applicationsError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    {applicationsError}
                  </div>
                )}
                {!applicationsLoading && !applicationsError && applications.length === 0 && (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      You haven't submitted any job applications yet.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={() => setActiveTab('opportunities')}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Browse Job Opportunities
                      </button>
                    </div>
                  </div>
                )}
                {/* Applications Summary Cards */}
                {!applicationsLoading && !applicationsError && applications && applications.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                      <div className="text-2xl font-bold text-blue-600">{applications.length}</div>
                      <div className="text-sm text-gray-600">Total Applications</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                      <div className="text-2xl font-bold text-yellow-600">
                        {applications.filter(app => app.status === 'Pending').length}
                                </div>
                      <div className="text-sm text-gray-600">Pending Review</div>
                                </div>
                    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                      <div className="text-2xl font-bold text-green-600">
                        {applications.filter(app => app.status === 'Accepted').length}
                      </div>
                      <div className="text-sm text-gray-600">Accepted</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                      <div className="text-2xl font-bold text-purple-600">
                        {applications.filter(app => app.status === 'Interview Scheduled').length}
                      </div>
                      <div className="text-sm text-gray-600">Interviews</div>
                    </div>
                  </div>
                )}
                {/* Detailed Applications View */}
                {!applicationsLoading && !applicationsError && applications && applications.length > 0 && (
                  <div className="space-y-6">
                    {applications.map(app => (
                      <div key={app._id} className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                        {/* Application Header */}
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-2xl font-bold text-gray-900">
                                {app.postId?.title || 'Job Post Title'}
                              </h3>
                              <span className={`px-3 py-1 text-sm font-medium rounded-full border bg-transparent ${
                                  app.status === 'Pending' ? 'border-yellow-500 text-yellow-600' :
                                  app.status === 'Under Review' ? 'border-blue-500 text-blue-600' :
                                  app.status === 'Accepted' ? 'border-green-500 text-green-600' :
                                  app.status === 'Interview Scheduled' ? 'border-purple-500 text-purple-600' :
                                  app.status === 'Hired' ? 'border-emerald-500 text-emerald-600' :
                                  app.status === 'Declined' ? 'border-red-500 text-red-600' :
                                  'border-gray-400 text-gray-600'
                                }`}>
                                  {app.status}
                                </span>
                            </div>
                            <p className="text-gray-600 text-lg">
                              {app.postId?.type || 'Job Type'} • ${app.postId?.budget || 'Budget'}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            {app.status === 'Pending' && (
                              <button
                                onClick={() => handleWithdrawApplication(app._id)}
                                className="px-4 py-2 text-red-600 hover:text-red-800 font-medium border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                              >
                                Withdraw
                              </button>
                            )}
                          </div>
                        </div>
                        {/* Application Details Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Left Column - Applicant & Job Info */}
                          <div className="space-y-6">
                            {/* Applicant Information */}
                            <div className="bg-gray-50 rounded-xl p-4">
                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Applicant Information
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Name:</span>
                                  <span className="font-medium text-gray-900">
                                    {studentData?.firstName} {studentData?.lastName}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Email:</span>
                                  <span className="font-medium text-gray-900">{studentData?.email}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Phone:</span>
                                  <span className="font-medium text-gray-900">
                                    {studentData?.phoneNumber || 'Not specified'}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Portfolio:</span>
                                  <a 
                                    href="#" 
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                  >
                                    View Portfolio
                                  </a>
                                </div>
                              </div>
                            </div>
                            {/* Cover Letter */}
                            <div className="bg-gray-50 rounded-xl p-4">
                              <h4 className="font-semibold text-gray-900 mb-3">Cover Letter</h4>
                              <p className="text-gray-700 text-sm leading-relaxed">
                                {app.coverLetter || 'No cover letter provided'}
                              </p>
                            </div>
                            {/* Application & Job Details */}
                            <div className="bg-gray-50 rounded-xl p-4">
                              <h4 className="font-semibold text-gray-900 mb-3">Application Details</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Applied:</span>
                                  <span className="font-medium text-gray-900">
                                {new Date(app.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                      month: 'long',
                                  day: 'numeric'
                                })}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Job Type:</span>
                                  <span className="font-medium text-gray-900">
                                    {app.postId?.type || 'Project'}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Budget:</span>
                                  <span className="font-medium text-green-600">
                                    ${app.postId?.budget || 'N/A'}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Deadline:</span>
                                  <span className="font-medium text-gray-900">
                                    {app.postId?.deadline || 'Not specified'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Right Column - Interview & Additional Info */}
                          <div className="space-y-6">
                            {/* Interview Details Section */}
                            {app.status === 'Interview Scheduled' ? (
                              app.interviewDetails && typeof app.interviewDetails === 'object' ? (
                                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                  <h4 className="font-semibold text-blue-900 mb-3">Interview Details</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-blue-700">Date:</span>
                                      <span className="font-medium text-blue-900">
                                        {(() => {
                                          try {
                                            if (app.interviewDetails.scheduledDate) {
                                              const date = new Date(app.interviewDetails.scheduledDate);
                                              if (!isNaN(date.getTime())) {
                                                return date.toLocaleDateString('en-US', {
                                                  year: 'numeric',
                                                  month: 'long',
                                                  day: 'numeric'
                                                });
                                              }
                                            }
                                            return 'TBD';
                                          } catch (error) {
                                            console.error('Error formatting date:', error);
                                            return 'TBD';
                                          }
                                        })()}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-blue-700">Time:</span>
                                      <span className="font-medium text-blue-900">
                                        {app.interviewDetails.scheduledTime || 'TBD'}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-blue-700">Location:</span>
                                      <span className="font-medium text-blue-900">
                                        {app.interviewDetails.location || 'TBD'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                                  <h4 className="font-semibold text-yellow-900 mb-3">Interview Scheduled</h4>
                                  <p className="text-yellow-700 text-sm">Interview has been scheduled but details are not yet available.</p>
                                </div>
                              )
                            ) : null}
                            {/* Skills & Qualifications */}
                            <div className="bg-gray-50 rounded-xl p-4">
                              <h4 className="font-semibold text-gray-900 mb-3">Skills & Qualifications</h4>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="text-gray-600">Required Skills:</span>
                                  <div className="mt-1 flex flex-wrap gap-1">
                                    {app.postId?.requiredSkills && Array.isArray(app.postId.requiredSkills) ? 
                                      app.postId.requiredSkills.map(skill => (
                                        <span key={skill} className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                          {skill}
                                        </span>
                                      )) : (
                                        <span className="text-gray-400 text-xs">No skills specified</span>
                                      )
                                    }
                                  </div>
                                </div>
                                <div className="pt-2">
                                  <span className="text-gray-600">Your Skills:</span>
                                  <div className="mt-1 flex flex-wrap gap-1">
                                    {studentData?.technicalSkills && Array.isArray(studentData.technicalSkills) ? 
                                      studentData.technicalSkills.map(skill => (
                                        <span key={skill} className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                          {skill}
                                        </span>
                                      )) : (
                                        <span className="text-gray-400 text-xs">No skills specified</span>
                                      )
                                    }
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* Client Feedback - Only show if provided */}
                            {app.clientFeedback && (
                              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                                <h4 className="font-semibold text-yellow-900 mb-3">Client Feedback</h4>
                                <p className="text-yellow-800 text-sm">
                                  {app.clientFeedback}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        {/* Application Actions */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                              Application ID: {app._id}
                            </div>
                            <div className="flex space-x-3">
                                {app.status === 'Pending' && (
                                  <button
                                    onClick={() => handleWithdrawApplication(app._id)}
                                  className="px-4 py-2 text-red-600 hover:text-red-800 font-medium border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                                  >
                                  Withdraw Application
                                  </button>
                                )}
                    </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === "gigs" && (
              <GigManagement user={studentData} />
            )}
            {activeTab === "messages" && (
               <MessagesPage />
             )}
            {activeTab === "profile" && renderProfile()}
          </div>
        </div>
      {showApplicationForm && renderApplicationForm()}
      {renderEditProfilePopup()}
      {/* Onboarding Wizard */}
      <OnboardingWizard
        isOpen={showOnboardingWizard}
        onClose={() => setShowOnboardingWizard(false)}
        onComplete={handleOnboardingComplete}
        currentProfileData={studentData}
        profileCompleteness={profileCompleteness}
      />
      {/* Verification Request Popup */}
      <VerificationRequestPopup
        isOpen={showVerificationPopup}
        onClose={() => setShowVerificationPopup(false)}
        onRequestSubmitted={handleVerificationRequestSubmitted}
      />
    </div>
  );
}
export default StudentDashboard;
