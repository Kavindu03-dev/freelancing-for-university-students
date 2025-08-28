import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FreelancerProfilePopup from "../components/FreelancerProfilePopup";

function ClientDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [clientData, setClientData] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Posts state
  const [jobPosts, setJobPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Stats state
  const [stats, setStats] = useState({
    postedProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalSpent: 0,
    totalOrders: 0,
    activeOrders: 0,
    completedOrders: 0
  });

  // Projects derived from posts
  const projects = jobPosts.slice(0, 3).map(post => ({
    id: post._id,
    title: post.title,
    freelancer: "Pending Assignment",
    status: post.status,
    budget: post.budget,
    progress: post.status === 'Completed' ? 100 : post.status === 'In Progress' ? 60 : 0
  }));

  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationsError, setApplicationsError] = useState(null);

  // Form state for creating/editing posts
  const [postForm, setPostForm] = useState({
    title: "",
    type: "Project",
    category: "",
    budget: "",
    deadline: "",
    location: "Remote",
    requiredSkills: "",
    degreeField: "",
    description: "",
    attachments: []
  });

  // Mock data for form options
  const postTypes = ["Job", "Project", "Internship", "Freelance"];
  const categories = ["Web Development", "Mobile Development", "Graphic Design", "Content Writing", "Data Analysis", "AI/ML"];
  const degreeFields = ["Computer Science", "Engineering", "Business", "Design", "Marketing", "Finance"];
  const locations = ["Remote", "On-site", "Hybrid"];

  // State for freelancers data
  const [recommendedFreelancers, setRecommendedFreelancers] = useState([]);
  const [loadingFreelancers, setLoadingFreelancers] = useState(true);
  const [freelancersError, setFreelancersError] = useState(null);
  
  // State for orders
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  
  // State for freelancer profile popup
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const [showFreelancerPopup, setShowFreelancerPopup] = useState(false);
  
  // Edit profile state
  
  // Fetch applications for the client
  const fetchApplications = async () => {
    try {
      setApplicationsLoading(true);
      setApplicationsError(null);
      
      const token = localStorage.getItem('userToken');
      const response = await fetch('/api/job-applications/received', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
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
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    organization: '',
    jobTitle: '',
    contactPhone: '',
    projectCategories: [],
    companySize: '',
    industry: '',
    website: '',
    companyDescription: ''
  });
  const [editErrors, setEditErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Recommendation algorithms
  const getRecommendedFreelancers = (postRequirements = null) => {
    if (!postRequirements) {
      return recommendedFreelancers.sort((a, b) => b.rating - a.rating);
    }

    return recommendedFreelancers
      .map(freelancer => {
        let score = 0;
        
        // Skills match (40% weight)
        const requiredSkills = postRequirements.requiredSkills || [];
        const skillMatches = requiredSkills.filter(skill => 
          freelancer.skills.some(freelancerSkill => 
            freelancerSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(freelancerSkill.toLowerCase())
          )
        ).length;
        score += (skillMatches / requiredSkills.length) * 40;
        
        // Rating (25% weight)
        score += (freelancer.rating / 5) * 25;
        
        // Profile completeness (20% weight)
        score += (freelancer.profileCompleteness / 100) * 20;
        
        // Experience (15% weight)
        score += Math.min(freelancer.completedProjects / 20, 1) * 15;
        
        return {
          ...freelancer,
          recommendationScore: Math.round(score),
          skillMatchCount: skillMatches,
          totalRequiredSkills: requiredSkills.length
        };
      })
      .filter(freelancer => freelancer.recommendationScore > 30)
      .sort((a, b) => b.recommendationScore - a.recommendationScore);
  };

  // API functions
  const fetchPosts = async () => {
    if (!clientData?._id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('userToken');
      const response = await fetch(`/api/posts/client/${clientData._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const data = await response.json();
      setJobPosts(data.posts || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    if (!clientData?._id) return;
    
    try {
      setLoadingOrders(true);
      setOrdersError(null);
      
      const token = localStorage.getItem('userToken');
      const response = await fetch('http://localhost:5000/api/orders/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (err) {
      setOrdersError(err.message);
      console.error('Error fetching orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const createPostAPI = async (postData) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('userToken');
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create post');
      }
      
      const data = await response.json();
      return data.post;
    } catch (err) {
      setError(err.message);
      console.error('Error creating post:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePostAPI = async (postId, postData) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('userToken');
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update post');
      }
      
      const data = await response.json();
      return data.post;
    } catch (err) {
      setError(err.message);
      console.error('Error updating post:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePostAPI = async (postId) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('userToken');
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete post');
      }
      
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error deleting post:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsed = JSON.parse(userData);
      if (parsed.userType === 'client') {
        setClientData(parsed);
      } else {
        navigate('/signin');
      }
    } else {
      navigate('/signin');
    }
  }, [navigate]);

  // Calculate stats from posts and orders
  const calculateStats = (posts, ordersList = []) => {
    const totalPosts = posts.length;
    const activePosts = posts.filter(post => post.status === 'Active').length;
    const completedPosts = posts.filter(post => post.status === 'Completed').length;
    const totalSpent = posts.reduce((sum, post) => sum + (post.budget || 0), 0);
    
    const totalOrders = ordersList.length;
    const activeOrders = ordersList.filter(order => order.status === 'In Progress').length;
    const completedOrders = ordersList.filter(order => order.status === 'Completed').length;
    
    setStats({
      postedProjects: totalPosts,
      activeProjects: activePosts,
      completedProjects: completedPosts,
      totalSpent,
      totalOrders,
      activeOrders,
      completedOrders
    });
  };

  // Fetch posts when client data is available
  useEffect(() => {
    if (clientData?._id) {
      fetchPosts();
      fetchOrders();
    }
  }, [clientData]);

  // Update stats when posts change
  useEffect(() => {
    calculateStats(jobPosts);
  }, [jobPosts]);

  // Handle URL query parameter for tab
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam && ['overview', 'recommendations', 'posts', 'applications', 'orders', 'profile'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);
  
  // Fetch applications when applications tab or overview tab is active
  useEffect(() => {
    if ((activeTab === 'applications' || activeTab === 'overview') && clientData?._id) {
      fetchApplications();
    }
  }, [activeTab, clientData]);

  // Fetch freelancers from API
  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        setLoadingFreelancers(true);
        setFreelancersError(null);
        
        const response = await fetch('http://localhost:5000/api/freelancer/freelancers');
        if (!response.ok) {
          throw new Error('Failed to fetch freelancers');
        }
        
        const data = await response.json();
        
        if (data.success && data.data.freelancers) {
          // Transform the data to match the expected format
          const transformedFreelancers = data.data.freelancers.map(freelancer => ({
            id: freelancer._id,
            name: `${freelancer.firstName} ${freelancer.lastName}`,
            university: freelancer.university || 'Not specified',
            degreeProgram: freelancer.degreeProgram || 'Not specified',
            gpa: freelancer.gpa || 'Not specified',
            skills: freelancer.skills || freelancer.technicalSkills || [],
            experience: freelancer.experience || 'Not specified',
            completedProjects: freelancer.portfolio?.length || 0,
            rating: 4.5, // Default rating since it's not in the model
            hourlyRate: freelancer.hourlyRate || 25,
            availability: 'Available', // Default since it's not in the model
            profileCompleteness: calculateProfileCompleteness(freelancer),
            lastActive: 'Recently', // Default since it's not in the model
            portfolio: freelancer.portfolio || [],
            reviews: [], // Default empty reviews since they're not in the model
            profileImage: freelancer.profileImage?.url || null
          }));
          
          setRecommendedFreelancers(transformedFreelancers);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching freelancers:', error);
        setFreelancersError(error.message);
      } finally {
        setLoadingFreelancers(false);
      }
    };

    fetchFreelancers();
  }, []);

  // Helper function to calculate profile completeness
  const calculateProfileCompleteness = (freelancer) => {
    let score = 0;
    const fields = [
      freelancer.firstName, freelancer.lastName, freelancer.email,
      freelancer.university, freelancer.degreeProgram, freelancer.gpa,
      freelancer.skills?.length > 0, freelancer.experience,
      freelancer.profileImage?.url, freelancer.portfolio?.length > 0
    ];
    
    fields.forEach(field => {
      if (field && (typeof field === 'string' ? field.trim() !== '' : field)) {
        score += 10;
      }
    });
    
    return Math.min(score, 100);
  };

  // Edit profile functions
  const handleEditProfile = () => {
    setEditFormData({
      firstName: clientData?.firstName || '',
      lastName: clientData?.lastName || '',
      email: clientData?.email || '',
      phoneNumber: clientData?.phoneNumber || '',
      address: clientData?.address || '',
      organization: clientData?.organization || '',
      jobTitle: clientData?.jobTitle || '',
      contactPhone: clientData?.contactPhone || '',
      projectCategories: clientData?.projectCategories || [],
      companySize: clientData?.companySize || '',
      industry: clientData?.industry || '',
      website: clientData?.website || '',
      companyDescription: clientData?.companyDescription || ''
    });
    setEditErrors({});
    setShowEditProfile(true);
  };

  const validateEditForm = () => {
    const errors = {};
    
    if (!editFormData.firstName.trim()) errors.firstName = 'First name is required';
    if (!editFormData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!editFormData.email.trim()) errors.email = 'Email is required';
    if (!editFormData.organization.trim()) errors.organization = 'Organization is required';
    if (!editFormData.jobTitle.trim()) errors.jobTitle = 'Job title is required';
    
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
        const updatedData = { ...clientData, ...editFormData };
        setClientData(updatedData);
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

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('userToken');
    navigate('/');
  };

  const handleCreatePost = async () => {
    try {
      if (editingPost) {
        // Update existing post
        const updatedPost = await updatePostAPI(editingPost._id, postForm);
        setJobPosts(prev => prev.map(post => 
          post._id === editingPost._id ? updatedPost : post
        ));
        setEditingPost(null);
      } else {
        // Create new post
        const newPost = await createPostAPI(postForm);
        setJobPosts(prev => [newPost, ...prev]);
      }
      
      setShowCreateForm(false);
      setPostForm({
        title: "",
        type: "Project",
        category: "",
        budget: "",
        deadline: "",
        location: "Remote",
        requiredSkills: "",
        degreeField: "",
        description: "",
        attachments: []
      });
    } catch (error) {
      // Error is already handled in the API functions
      console.error('Error in handleCreatePost:', error);
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setPostForm({
      title: post.title,
      type: post.type,
      category: post.category,
      budget: post.budget,
      deadline: post.deadline.split('T')[0], // Convert ISO date to YYYY-MM-DD format
      location: post.location,
      requiredSkills: Array.isArray(post.requiredSkills) ? post.requiredSkills.join(", ") : post.requiredSkills,
      degreeField: post.degreeField,
      description: post.description,
      attachments: post.attachments || []
    });
    setShowCreateForm(true);
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePostAPI(postId);
        setJobPosts(prev => prev.filter(post => post._id !== postId));
        setApplications(prev => prev.filter(app => app.postId !== postId));
      } catch (error) {
        // Error is already handled in the API function
        console.error('Error in handleDeletePost:', error);
      }
    }
  };

  const handleApplicationAction = (applicationId, action) => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId ? { ...app, status: action } : app
    ));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setPostForm(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files.map(f => f.name)]
    }));
  };

  // Freelancer popup functions
  const handleViewProfile = (freelancer) => {
    setSelectedFreelancer(freelancer);
    setShowFreelancerPopup(true);
  };

  const handleCloseFreelancerPopup = () => {
    setShowFreelancerPopup(false);
    setSelectedFreelancer(null);
  };

  const handleContactFreelancer = (freelancer) => {
    // TODO: Implement contact functionality
    console.log('Contacting freelancer:', freelancer);
    // You can add logic here to open a contact form or redirect to messaging
  };

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.postedProjects}</h3>
          <p className="text-gray-600">Posted Projects</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.activeProjects}</h3>
          <p className="text-gray-600">Active Projects</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-purple-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.completedProjects}</h3>
          <p className="text-gray-600">Completed</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-orange-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">${stats.totalSpent}</h3>
          <p className="text-gray-600">Total Spent</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Projects</h3>
        <div className="space-y-4">
          {projects.map(project => (
            <div key={project.id} className="border border-gray-200 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-gray-900">{project.title}</h4>
                  <p className="text-gray-600">{project.freelancer}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">${project.budget}</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    project.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Recent Applications</h3>
          <button
            onClick={() => setActiveTab("applications")}
            className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            View All →
          </button>
        </div>
        <div className="space-y-4">
          {applicationsLoading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded mb-1"></div>
                <div className="h-3 bg-gray-300 rounded w-20"></div>
              </div>
            ))
          ) : applicationsError ? (
            // Error state
            <div className="text-center py-4">
              <p className="text-red-500 text-sm">Failed to load applications</p>
            </div>
          ) : applications.length === 0 ? (
            // Empty state
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm">No applications yet</p>
            </div>
          ) : (
            // Recent applications
            applications.slice(0, 3).map(app => (
              <div key={app._id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-gray-900">{app.fullName}</h4>
                    <p className="text-gray-600">{app.professionalTitle}</p>
                    <p className="text-sm text-gray-500">{app.postId?.title || 'Job Post'}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      app.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      app.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                      app.status === 'Declined' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {app.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(app.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Top Recommended Freelancers */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Top Recommended Freelancers</h3>
          <button
            onClick={() => setActiveTab("recommendations")}
            className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            View All →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {loadingFreelancers ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-4 animate-pulse">
                <div className="flex justify-between items-start mb-2">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div className="w-8 h-4 bg-gray-300 rounded"></div>
                </div>
                <div className="h-4 bg-gray-300 rounded mb-1"></div>
                <div className="h-3 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded mb-2"></div>
                <div className="flex justify-between items-center">
                  <div className="h-3 bg-gray-300 rounded w-16"></div>
                  <div className="h-3 bg-gray-300 rounded w-20"></div>
                </div>
              </div>
            ))
          ) : freelancersError ? (
            // Error state
            <div className="col-span-full text-center py-8">
              <div className="text-red-500 mb-2">⚠️</div>
              <p className="text-gray-600 mb-4">Failed to load freelancers</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Try Again
              </button>
            </div>
          ) : recommendedFreelancers.length === 0 ? (
            // Empty state
            <div className="col-span-full text-center py-8">
              <div className="text-gray-400 mb-2">👥</div>
              <p className="text-gray-600">No freelancers available at the moment</p>
            </div>
          ) : (
            // Freelancer cards
            getRecommendedFreelancers().slice(0, 4).map(freelancer => (
              <div key={freelancer.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors duration-300">
                <div className="flex justify-between items-start mb-2">
                  {freelancer.profileImage ? (
                    <img 
                      src={freelancer.profileImage} 
                      alt={freelancer.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{freelancer.name.charAt(0)}</span>
                    </div>
                  )}
                  <span className="text-xs font-bold text-green-600">{freelancer.rating}★</span>
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">{freelancer.name}</h4>
                <p className="text-gray-600 text-xs mb-2">{freelancer.university}</p>
                <div className="text-xs text-gray-500 mb-2">
                  {freelancer.skills.slice(0, 2).join(', ')}
                  {freelancer.skills.length > 2 && '...'}
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-green-600 font-semibold">${freelancer.hourlyRate}/hr</span>
                  <span className="text-gray-500">{freelancer.completedProjects} projects</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderCreatePost = () => (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900">
          {editingPost ? 'Edit Post' : 'Create New Post'}
        </h3>
        <button
          onClick={() => {
            setShowCreateForm(false);
            setEditingPost(null);
            setPostForm({
              title: "",
              type: "Project",
              category: "",
              budget: "",
              deadline: "",
              location: "Remote",
              requiredSkills: "",
              degreeField: "",
              description: "",
              attachments: []
            });
          }}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleCreatePost(); }} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Post Title *</label>
            <input
              type="text"
              required
              value={postForm.title}
              onChange={(e) => setPostForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
              placeholder="Enter post title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Post Type *</label>
            <select
              required
              value={postForm.type}
              onChange={(e) => setPostForm(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
            >
              {postTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <select
              required
              value={postForm.category}
              onChange={(e) => setPostForm(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Budget/Stipend ($) *</label>
            <input
              type="number"
              required
              value={postForm.budget}
              onChange={(e) => setPostForm(prev => ({ ...prev, budget: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
              placeholder="Enter budget amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Deadline *</label>
            <input
              type="date"
              required
              value={postForm.deadline}
              onChange={(e) => setPostForm(prev => ({ ...prev, deadline: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
            <select
              required
              value={postForm.location}
              onChange={(e) => setPostForm(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills *</label>
            <input
              type="text"
              required
              value={postForm.requiredSkills}
              onChange={(e) => setPostForm(prev => ({ ...prev, requiredSkills: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
              placeholder="e.g., React, Node.js, MongoDB"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Degree Field *</label>
            <select
              required
              value={postForm.degreeField}
              onChange={(e) => setPostForm(prev => ({ ...prev, degreeField: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
            >
              <option value="">Select degree field</option>
              {degreeFields.map(field => (
                <option key={field} value={field}>{field}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
          <textarea
            required
            rows={4}
            value={postForm.description}
            onChange={(e) => setPostForm(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
            placeholder="Describe the job/project requirements, responsibilities, and expectations"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Supporting Materials</label>
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
          />
          <p className="text-sm text-gray-500 mt-1">Upload PDFs, images, briefs, or requirement documents</p>
        </div>

        {postForm.attachments.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Attached Files:</label>
            <div className="flex flex-wrap gap-2">
              {postForm.attachments.map((file, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {file}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => {
              setShowCreateForm(false);
              setEditingPost(null);
            }}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600'
            } text-white`}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {editingPost ? 'Updating...' : 'Creating...'}
              </div>
            ) : (
              editingPost ? 'Update Post' : 'Create Post'
            )}
          </button>
        </div>
      </form>
    </div>
  );

  const renderManagePosts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900">Manage Job & Project Posts</h3>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-6 py-3 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-xl font-medium hover:from-green-500 hover:to-green-600"
        >
          + Create New Post
        </button>
      </div>

      {showCreateForm && renderCreatePost()}

      {loading && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading posts...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading posts</h3>
              <p className="mt-2 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobPosts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <svg className="h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-lg font-medium text-gray-900 mb-2">No posts yet</p>
                        <p className="text-gray-600">Create your first job or project post to get started!</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  jobPosts.map(post => (
                    <tr key={post._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{post.title}</div>
                          <div className="text-sm text-gray-500">{post.category}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {post.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">${post.budget}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(post.deadline).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{post.applications}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          post.status === 'Active' ? 'bg-green-100 text-green-800' : 
                          post.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          post.status === 'Completed' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEditPost(post)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderApplications = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900">Job Applications</h3>
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
      
      {/* Applications Summary */}
      {!applicationsLoading && !applicationsError && (
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
      
      {applicationsLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading applications...</p>
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
            You haven't received any job applications yet.
          </p>
        </div>
      )}
      
      {!applicationsLoading && !applicationsError && applications.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Post</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Professional Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map(app => (
                  <tr key={app._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{app.postId?.title || 'Job Post'}</div>
                        <div className="text-sm text-gray-500">{app.postId?.type || 'N/A'}</div>
                        <div className="text-sm text-gray-500">${app.postId?.budget || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{app.fullName}</div>
                        <div className="text-sm text-gray-500">{app.email}</div>
                        {app.phoneNumber && (
                          <div className="text-sm text-gray-500">{app.phoneNumber}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{app.professionalTitle}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(app.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        app.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        app.status === 'Under Review' ? 'bg-blue-100 text-blue-800' :
                        app.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                        app.status === 'Interview Scheduled' ? 'bg-purple-100 text-purple-800' :
                        app.status === 'Hired' ? 'bg-emerald-100 text-emerald-800' :
                        app.status === 'Declined' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium space-x-2">
                      <button
                        onClick={() => navigate(`/client/applications`)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderRecommendations = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Find Perfect Freelancers</h3>
          <p className="text-gray-600 mt-2">AI-powered recommendations based on skills, ratings, and experience</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Total Available</div>
          <div className="text-2xl font-bold text-blue-600">{recommendedFreelancers.length}</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Skills</label>
            <input
              type="text"
              placeholder="e.g., React, Python, Design..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">University</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Universities</option>
              <option value="MIT">MIT</option>
              <option value="Stanford">Stanford</option>
              <option value="UC Berkeley">UC Berkeley</option>
              <option value="Carnegie Mellon">Carnegie Mellon</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Ratings</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.0">4.0+ Stars</option>
              <option value="3.5">3.5+ Stars</option>
            </select>
          </div>
        </div>
      </div>

      {/* Freelancer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {loadingFreelancers ? (
          // Loading skeleton
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                  <div>
                    <div className="h-5 bg-gray-300 rounded mb-1"></div>
                    <div className="h-4 bg-gray-300 rounded mb-1"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-6 bg-gray-300 rounded mb-1"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                </div>
              </div>
              <div className="space-y-3 mb-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                    <div className="h-4 bg-gray-300 rounded w-16"></div>
                  </div>
                ))}
              </div>
              <div className="mb-4">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-6 bg-gray-300 rounded w-16"></div>
                  ))}
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="flex-1 h-10 bg-gray-300 rounded-xl"></div>
                <div className="w-20 h-10 bg-gray-300 rounded-xl"></div>
              </div>
            </div>
          ))
        ) : freelancersError ? (
          // Error state
          <div className="col-span-full text-center py-12">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to load freelancers</h3>
            <p className="text-gray-600 mb-6">{freelancersError}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : recommendedFreelancers.length === 0 ? (
          // Empty state
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No freelancers available</h3>
            <p className="text-gray-600">There are currently no freelancers registered in the system.</p>
          </div>
        ) : (
          // Freelancer cards
          getRecommendedFreelancers().map(freelancer => (
            <div key={freelancer.id} className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-shadow duration-300 relative">
              {/* Recommendation Score Badge */}
              {freelancer.recommendationScore && (
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-green-400 to-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  {freelancer.recommendationScore}% Match
                </div>
              )}
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  {freelancer.profileImage ? (
                    <img 
                      src={freelancer.profileImage} 
                      alt={freelancer.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl">{freelancer.name.charAt(0)}</span>
                    </div>
                  )}
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{freelancer.name}</h4>
                    <p className="text-gray-600 text-sm">{freelancer.university}</p>
                    <p className="text-blue-600 text-sm font-medium">{freelancer.degreeProgram}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{freelancer.rating}★</div>
                  <div className="text-sm text-gray-500">{freelancer.completedProjects} projects</div>
                </div>
              </div>

              {/* Skills Match */}
              {freelancer.skillMatchCount !== undefined && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Skills Match:</span>
                    <span className="text-sm font-semibold text-green-600">
                      {freelancer.skillMatchCount}/{freelancer.totalRequiredSkills} skills
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${(freelancer.skillMatchCount / freelancer.totalRequiredSkills) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Hourly Rate:</span>
                  <span className="font-semibold text-green-600">${freelancer.hourlyRate}/hr</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Availability:</span>
                  <span className="font-semibold">{freelancer.availability}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Profile Complete:</span>
                  <span className="font-semibold">{freelancer.profileCompleteness}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Last Active:</span>
                  <span className="font-semibold">{freelancer.lastActive}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {freelancer.skills.map(skill => (
                    <span key={skill} className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recent Reviews */}
              {freelancer.reviews.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Recent Reviews:</p>
                  <div className="space-y-2">
                    {freelancer.reviews.slice(0, 2).map((review, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium text-gray-700">{review.client}</span>
                          <span className="text-xs text-yellow-600">{review.rating}★</span>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleViewProfile(freelancer)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-xl font-medium hover:from-blue-500 hover:to-blue-600 transition-all duration-300"
                >
                  View Profile
                </button>
                <button 
                  onClick={() => handleContactFreelancer(freelancer)}
                  className="px-4 py-2 border-2 border-green-500 text-green-500 rounded-xl font-medium hover:bg-green-500 hover:text-white transition-all duration-300"
                >
                  Contact
                </button>
              </div>
            </div>
          ))
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
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-4xl font-bold text-black">
              {clientData?.firstName?.charAt(0)}{clientData?.lastName?.charAt(0)}
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 border-4 border-white rounded-full"></div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold mb-2">
              {clientData?.firstName} {clientData?.lastName}
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              Client • {clientData?.jobTitle || 'Professional'} • {clientData?.organization || 'Organization'}
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>4.8 (8 reviews)</span>
              </div>
              
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>{clientData?.organization || 'Organization'}</span>
              </div>

              <div className="flex items-center px-3 py-1 rounded-full bg-blue-500">
                <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                <span className="text-sm font-medium">Active Client</span>
              </div>
            </div>

            <p className="text-gray-300 max-w-2xl">
              Experienced client looking for talented student freelancers to help bring projects to life. 
              Committed to providing clear requirements and fair compensation for quality work.
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
              Post New Job
            </button>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={`${clientData?.firstName || ''} ${clientData?.lastName || ''}`}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  value={clientData?.email || ''}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
                <input 
                  type="text" 
                  value={clientData?.organization || ''}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                <input 
                  type="text" 
                  value={clientData?.jobTitle || ''}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500"
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Project Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500"
                  placeholder="e.g., Technology, Healthcare, Education"
                  defaultValue="Technology"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Budget Range</label>
                  <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500">
                    <option value="">Select budget range</option>
                    <option value="under-500">Under $500</option>
                    <option value="500-1000">$500 - $1,000</option>
                    <option value="1000-2500">$1,000 - $2,500</option>
                    <option value="2500-5000">$2,500 - $5,000</option>
                    <option value="over-5000">Over $5,000</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Timeline</label>
                  <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500">
                    <option value="">Select timeline</option>
                    <option value="1-2-weeks">1-2 weeks</option>
                    <option value="1-month">1 month</option>
                    <option value="2-3-months">2-3 months</option>
                    <option value="3-6-months">3-6 months</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
                <textarea
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500"
                  placeholder="Describe your typical project needs and requirements..."
                  defaultValue="Looking for talented student freelancers to help with web development, design, and content creation projects. Prefer students with strong technical skills and good communication."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Client Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Posted Projects</span>
                <span className="font-bold text-green-600">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Spent</span>
                <span className="font-bold text-green-600">$4,200</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Completed Projects</span>
                <span className="font-bold text-blue-600">5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Projects</span>
                <span className="font-bold text-yellow-600">3</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Preferred Skills</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Web Development</span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">UI/UX Design</span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Content Writing</span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Graphic Design</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-8">
      {/* Orders Header */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">My Orders</h2>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Total Orders: {orders.length}</span>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200">
        {loadingOrders ? (
          // Loading skeleton
          <div className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4 animate-pulse">
                  <div className="flex justify-between items-start mb-2">
                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                  </div>
                  <div className="h-3 bg-gray-300 rounded mb-2 w-1/2"></div>
                  <div className="h-3 bg-gray-300 rounded mb-2 w-2/3"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-3 bg-gray-300 rounded w-16"></div>
                    <div className="h-3 bg-gray-300 rounded w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : ordersError ? (
          // Error state
          <div className="p-6 text-center">
            <div className="text-red-500 mb-2 text-4xl">⚠️</div>
            <p className="text-gray-600 mb-4">Failed to load orders</p>
            <button 
              onClick={fetchOrders} 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          // Empty state
          <div className="p-6 text-center">
            <div className="text-gray-400 mb-2 text-4xl">📦</div>
            <p className="text-gray-600 mb-4">No orders yet</p>
            <p className="text-gray-500 text-sm">Start by ordering services from our talented freelancers</p>
            <button 
              onClick={() => setActiveTab("recommendations")} 
              className="mt-4 px-6 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 font-medium"
            >
              Browse Services
            </button>
          </div>
        ) : (
          // Orders list
          <div className="divide-y divide-gray-200">
            {orders.map((order) => (
              <div key={order._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {order.serviceId?.title || 'Service Order'}
                      </h3>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Package:</span> {order.selectedPackage}
                      </div>
                      <div>
                        <span className="font-medium">Amount:</span> ${order.totalAmount}
                      </div>
                      <div>
                        <span className="font-medium">Payment:</span> 
                        <span className={`ml-1 ${
                          order.paymentStatus === 'Paid' ? 'text-green-600' :
                          order.paymentStatus === 'Pending' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Created:</span> {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    {order.requirements && (
                      <div className="mt-3">
                        <span className="font-medium text-gray-700">Requirements:</span>
                        <p className="text-gray-600 mt-1">{order.requirements}</p>
                      </div>
                    )}
                    
                    {order.deadline && (
                      <div className="mt-2">
                        <span className="font-medium text-gray-700">Deadline:</span>
                        <p className="text-gray-600 mt-1">{new Date(order.deadline).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-2 lg:items-end">
                    <button className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium text-sm border border-blue-200 rounded-lg hover:bg-blue-50">
                      View Details
                    </button>
                    {order.status === 'In Progress' && (
                      <button className="px-4 py-2 text-green-600 hover:text-green-800 font-medium text-sm border border-green-200 rounded-lg hover:bg-green-50">
                        Track Progress
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (!clientData) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Left Sidebar - Fixed width, full height, positioned below header */}
      <div className="w-64 bg-white shadow-2xl border-r border-gray-200 flex-shrink-0 mt-20">
        {/* Sidebar Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-6 border-b border-yellow-300">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-yellow-500 font-bold text-lg">C</span>
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Client Panel</h2>
              <p className="text-yellow-100 text-sm">Dashboard Navigation</p>
            </div>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <div className="p-4">
          <nav className="flex flex-col space-y-1">
            {[
              { id: "overview", name: "Overview", icon: "📊" },
              { id: "recommendations", name: "Find Freelancers", icon: "🔍" },
              { id: "posts", name: "Manage Posts", icon: "📝" },
              { id: "applications", name: "Applications", icon: "📋" },
              { id: "orders", name: "My Orders", icon: "📦" },
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
              </button>
            ))}
          </nav>
        </div>
      </div>

              {/* Main Content Area */}
        <div className="flex-1 p-8 pt-8 overflow-y-auto mt-20">
          <div className="max-w-7xl mx-auto">
            {activeTab === "overview" && renderOverview()}
            {activeTab === "recommendations" && renderRecommendations()}
            {activeTab === "posts" && renderManagePosts()}
            {activeTab === "applications" && renderApplications()}
            {activeTab === "orders" && renderOrders()}
            {activeTab === "profile" && renderProfile()}
          </div>
        </div>

        {/* Edit Profile Modal */}
        {showEditProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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

                {/* Company Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Organization <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={editFormData.organization}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, organization: e.target.value }))}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                          editErrors.organization ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {editErrors.organization && (
                        <p className="text-red-500 text-sm mt-1">{editErrors.organization}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={editFormData.jobTitle}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                          editErrors.jobTitle ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {editErrors.jobTitle && (
                        <p className="text-red-500 text-sm mt-1">{editErrors.jobTitle}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                      <input
                        type="tel"
                        value={editFormData.contactPhone}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                      <select
                        value={editFormData.companySize}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, companySize: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                      >
                        <option value="">Select company size</option>
                        <option value="1-10 employees">1-10 employees</option>
                        <option value="11-50 employees">11-50 employees</option>
                        <option value="51-100 employees">51-100 employees</option>
                        <option value="101-500 employees">101-500 employees</option>
                        <option value="500+ employees">500+ employees</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                      <input
                        type="text"
                        value={editFormData.industry}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, industry: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                        placeholder="e.g., Technology, Healthcare, Education"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                      <input
                        type="url"
                        value={editFormData.website}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, website: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Description</label>
                      <textarea
                        rows="3"
                        value={editFormData.companyDescription}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, companyDescription: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                        placeholder="Describe your company and what you do..."
                      />
                    </div>
                  </div>
                </div>

                {/* Project Categories */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Project Categories</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Web Development', 'Mobile Development', 'Design', 'Writing', 'Marketing', 'Data Analysis', 'AI/ML', 'Other'].map(category => (
                      <label key={category} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editFormData.projectCategories.includes(category)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditFormData(prev => ({
                                ...prev,
                                projectCategories: [...prev.projectCategories, category]
                              }));
                            } else {
                              setEditFormData(prev => ({
                                ...prev,
                                projectCategories: prev.projectCategories.filter(cat => cat !== category)
                              }));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
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

        {/* Freelancer Profile Popup */}
        <FreelancerProfilePopup
          freelancer={selectedFreelancer}
          isOpen={showFreelancerPopup}
          onClose={handleCloseFreelancerPopup}
          onContact={handleContactFreelancer}
        />
    </div>
  );
}

export default ClientDashboard;

