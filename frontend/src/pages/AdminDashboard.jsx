import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [adminUsername, setAdminUsername] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dateRange, setDateRange] = useState("30");
  const [selectedUserType, setSelectedUserType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const searchTimeout = useRef(null);
  const navigate = useNavigate();

  // Debug imports and functions
  console.log('🔍 AdminDashboard component initialized');
  console.log('🔍 navigate function:', typeof navigate);
  console.log('🔍 logout import:', typeof logout);

  // User statistics
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFreelancers: 0,
    totalClients: 0,
    totalProjects: 2341,
    totalRevenue: 45678,
    pendingApprovals: 23,
    activeProjects: 156,
    completedProjects: 2185,
    monthlyGrowth: 12.5,
    conversionRate: 8.3
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const [recentProjects] = useState([
    { id: 1, title: "Website Development", client: "Tech Corp", freelancer: "John Doe", status: "In Progress", budget: "$2500", progress: 75, category: "Web Development" },
    { id: 2, title: "Logo Design", client: "Startup Inc", freelancer: "Jane Smith", status: "Completed", budget: "$500", progress: 100, category: "Design" },
    { id: 3, title: "Content Writing", client: "Blog Media", freelancer: "Mike Johnson", status: "Pending", budget: "$300", progress: 0, category: "Writing" },
    { id: 4, title: "Mobile App Development", client: "Innovate Labs", freelancer: "Alex Chen", status: "In Progress", budget: "$5000", progress: 45, category: "Mobile Development" },
    { id: 5, title: "Digital Marketing Campaign", client: "Growth Co", freelancer: "Emily Rodriguez", status: "Completed", budget: "$1200", progress: 100, category: "Marketing" }
  ]);

  // Mock data for pending services of the admin dashboard
  const [pendingServices] = useState([
    { 
      id: 1, 
      title: "Professional Website Development", 
      freelancer: "Alex Johnson", 
      category: "Web Development",
      price: 500,
      description: "I will create a modern, responsive website using React and Node.js.",
      createdAt: "2024-01-16"
    },
    { 
      id: 2, 
      title: "Logo Design & Brand Identity", 
      freelancer: "Sarah Chen", 
      category: "Design",
      price: 150,
      description: "Professional logo design with brand guidelines.",
      createdAt: "2024-01-15"
    },
    { 
      id: 3, 
      title: "Content Writing & SEO", 
      freelancer: "Michael Rodriguez", 
      category: "Writing",
      price: 80,
      description: "High-quality content writing for blogs and websites.",
      createdAt: "2024-01-14"
    }
  ]);

  // Mock data for reported content of the admin dashboard
  const [reportedContent] = useState([
    {
      id: 1,
      type: "Service",
      title: "Suspicious Service Post",
      reporter: "user123",
      reason: "Spam/Inappropriate content",
      status: "Pending Review",
      reportedAt: "2024-01-16",
      content: "This service post contains inappropriate language and spam links...",
      severity: "High"
    },
    {
      id: 2,
      type: "Message",
      reporter: "user456",
      reason: "Harassment",
      status: "Under Investigation",
      reportedAt: "2024-01-15",
      content: "User sent inappropriate messages with offensive content...",
      severity: "Critical"
    },
    {
      id: 3,
      type: "Project",
      reporter: "user789",
      reason: "Fake project",
      status: "Resolved",
      reportedAt: "2024-01-14",
      content: "Project description contains false information...",
      severity: "Medium"
    }
  ]);

  // Mock data for university and faculty analytics of the admin dashboard
  const [universityStats] = useState([
    { name: "MIT", users: 245, projects: 156, revenue: 12500, growth: 15.2 },
    { name: "Stanford", users: 198, projects: 134, revenue: 10800, growth: 12.8 },
    { name: "Harvard", users: 167, projects: 98, revenue: 8900, growth: 9.5 },
    { name: "UC Berkeley", users: 145, projects: 87, revenue: 7200, growth: 11.3 },
    { name: "CMU", users: 123, projects: 76, revenue: 6500, growth: 8.9 }
  ]);

  const [facultyStats] = useState([
    { name: "Computer Science", users: 456, projects: 289, revenue: 23400, growth: 18.5 },
    { name: "Engineering", users: 389, projects: 234, revenue: 19800, growth: 14.2 },
    { name: "Business", users: 234, projects: 156, revenue: 12300, growth: 12.1 },
    { name: "Design", users: 198, projects: 134, revenue: 9800, growth: 16.8 },
    { name: "Marketing", users: 167, projects: 98, revenue: 7600, growth: 11.5 }
  ]);

  const [categoryStats] = useState([
    { name: "Web Development", projects: 456, revenue: 23400, successRate: 92.5, avgBudget: 2500 },
    { name: "Graphic Design", projects: 389, revenue: 18900, successRate: 88.7, avgBudget: 800 },
    { name: "Content Writing", projects: 234, revenue: 12300, successRate: 85.2, avgBudget: 300 },
    { name: "Mobile Development", projects: 198, revenue: 15600, successRate: 90.1, avgBudget: 4500 },
    { name: "Digital Marketing", projects: 167, revenue: 9800, successRate: 87.3, avgBudget: 1200 }
  ]);

  useEffect(() => {
    // Check if admin is logged in of the admin dashboard
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    const adminEmail = localStorage.getItem('adminEmail');
    
    if (!isLoggedIn || !adminEmail) {
      navigate('/admin/login');
      return;
    }
    
    setAdminUsername(adminEmail); // Use email as username for display of the admin dashboard
  }, [navigate]);

  // Function to fetch all users with filters
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const adminToken = localStorage.getItem('adminToken');
      
      // Build query parameters
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (selectedUserType !== 'all') params.append('userType', selectedUserType);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      
      console.log('🔍 Filtering users with:', {
        search: searchQuery.trim(),
        userType: selectedUserType,
        status: selectedStatus
      });
      
      const url = `http://localhost:5000/api/admin/users${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      } else {
        setError(data.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to update user status
  const updateUserStatus = async (userId, newStatus) => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update user status');
      }

      const data = await response.json();
      if (data.success) {
        // Refresh users list
        fetchUsers();
      } else {
        setError(data.message || 'Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      setError(error.message);
    }
  };

  // Function to view user details
  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  // Function to delete user
  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      const data = await response.json();
      if (data.success) {
        // Refresh users list
        fetchUsers();
      } else {
        setError(data.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError(error.message);
    }
  };

  // Function to fetch user statistics
  const fetchUserStats = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/users/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user statistics');
      }

      const data = await response.json();
      if (data.success) {
        setStats(prevStats => ({
          ...prevStats,
          totalUsers: data.data.totalUsers,
          totalFreelancers: data.data.freelancers,
          totalClients: data.data.clients
        }));
      }
    } catch (error) {
      console.error('Error fetching user statistics:', error);
    }
  };

  // Fetch users when component mounts or when users tab is active
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  // Fetch users when filters change
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [selectedUserType, selectedStatus]);

  // Fetch user statistics when component mounts
  useEffect(() => {
    fetchUserStats();
    
    // Cleanup function to clear timeout
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  const handleLogout = () => {
    console.log('🚪 handleLogout clicked!');
    try {
      logout(navigate);
      console.log('✅ logout function called successfully');
    } catch (error) {
      console.error('❌ Error in handleLogout:', error);
    }
  };

  // Direct logout function for testing
  const directLogout = () => {
    console.log('🧪 directLogout clicked!');
    try {
      // Clear localStorage directly
      localStorage.removeItem('adminLoggedIn');
      localStorage.removeItem('adminEmail');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminId');
      
      console.log('✅ localStorage cleared successfully');
      console.log('🚀 Navigating to home...');
      
      // Navigate to home
      navigate('/');
      console.log('✅ navigate called successfully');
    } catch (error) {
      console.error('❌ Error in directLogout:', error);
    }
  };

  // Debug function definitions
  console.log('🔍 Functions defined:');
  console.log('🔍 handleLogout:', typeof handleLogout);
  console.log('🔍 directLogout:', typeof directLogout);

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-yellow-200 hover:border-yellow-400 transform hover:-translate-y-2">
          <div className="flex items-center justify-between mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="text-right">
              <span className="text-green-500 text-sm font-medium">+{stats.monthlyGrowth}%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.totalUsers.toLocaleString()}</h3>
          <p className="text-gray-600">Total Users</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-yellow-200 hover:border-yellow-400 transform hover:-translate-y-2">
          <div className="flex items-center justify-between mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="text-right">
              <span className="text-blue-500 text-sm font-medium">{stats.activeProjects}</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.totalProjects.toLocaleString()}</h3>
          <p className="text-gray-600">Total Projects</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-yellow-200 hover:border-yellow-400 transform hover:-translate-y-2">
          <div className="flex items-center justify-between mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="text-right">
              <span className="text-green-500 text-sm font-medium">+{stats.conversionRate}%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">${stats.totalRevenue.toLocaleString()}</h3>
          <p className="text-gray-600">Total Revenue</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-yellow-200 hover:border-yellow-400 transform hover:-translate-y-2">
          <div className="flex items-center justify-between mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-right">
              <span className="text-purple-500 text-sm font-medium">New</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.pendingApprovals}</h3>
          <p className="text-gray-600">Pending Approvals</p>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-yellow-200 hover:border-yellow-400 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Freelancers</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalFreelancers}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-yellow-200 hover:border-yellow-400 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clients</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalClients}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-yellow-200 hover:border-yellow-400 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-gray-900">{stats.completedProjects}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-yellow-200 hover:border-yellow-400">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Recent Users</h3>
            <button className="text-yellow-600 hover:text-yellow-700 font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {users.slice(0, 4).map(user => (
              <div key={user._id} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-yellow-200 transition-all duration-200">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-black font-bold text-sm">
                    {user.firstName ? user.firstName.charAt(0) : 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.status === 'active' || !user.status ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : 'Active'}
                    </span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">
                      {user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {users.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No users found
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-yellow-200 hover:border-yellow-400">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Recent Projects</h3>
            <button className="text-yellow-600 hover:text-yellow-700 font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {recentProjects.slice(0, 4).map(project => (
              <div key={project.id} className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-yellow-200 transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{project.title}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    project.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                    project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{project.client} → {project.freelancer}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-900">{project.budget}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{project.category}</span>
                  </div>
                  {project.status === 'In Progress' && (
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                      </div>
                      <span className="text-xs text-gray-500">{project.progress}%</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      {/* User Management Header */}
      <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-yellow-200 hover:border-yellow-400">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">User Management</h3>
            <p className="text-gray-600 mt-1">Manage all users, suspend accounts, and enforce platform rules</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
              {users.length} Total Users
            </span>
            <button 
              onClick={fetchUsers}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* User Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <select 
            value={selectedUserType}
            onChange={(e) => setSelectedUserType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
          >
            <option value="all">All Types</option>
            <option value="freelancer">Freelancer</option>
            <option value="client">Client</option>
            <option value="universityStaff">University Staff</option>
          </select>
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              // Debounce search to avoid too many API calls
              clearTimeout(searchTimeout.current);
              searchTimeout.current = setTimeout(() => {
                fetchUsers();
              }, 300);
            }}
            placeholder="Search users, emails, or universities..."
            className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
          />
        </div>
        
        {/* Filter Summary and Clear Button */}
        <div className="flex justify-between items-center mb-6">
          {/* Active Filters Summary */}
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                Search: "{searchQuery}"
              </span>
            )}
            {selectedUserType !== 'all' && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                Type: {selectedUserType}
              </span>
            )}
            {selectedStatus !== 'all' && (
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                Status: {selectedStatus}
              </span>
            )}
          </div>
          
          {/* Clear Filters Button */}
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedUserType('all');
              setSelectedStatus('all');
            }}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Clear Filters
          </button>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-500 mr-2"></div>
              <span>Applying filters...</span>
            </div>
          ) : (
            <>
              Showing {users.length} user{users.length !== 1 ? 's' : ''}
              {(searchQuery || selectedUserType !== 'all' || selectedStatus !== 'all') && ' (filtered)'}
            </>
          )}
        </div>

        {/* Enhanced User Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                      <span className="ml-2 text-gray-600">Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="relative mr-3">
                          {user.profileImage && user.profileImage.url ? (
                            <img 
                              src={user.profileImage.url} 
                              alt={`${user.firstName} ${user.lastName}`}
                              className="w-10 h-10 rounded-full object-cover border-2 border-yellow-200"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className={`w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center border-2 border-yellow-200 ${user.profileImage && user.profileImage.url ? 'hidden' : ''}`}>
                            <span className="text-black font-bold text-sm">
                              {user.firstName ? user.firstName.charAt(0) : 'U'}
                            </span>
                          </div>
                      </div>
                      <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.userType === 'freelancer' ? 'bg-blue-100 text-blue-800' : 
                        user.userType === 'client' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                    }`}>
                        {user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' : 
                        user.status === 'suspended' ? 'bg-orange-100 text-orange-800' :
                        user.status === 'banned' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : 'Active'}
                    </span>
                  </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.university || user.organization || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => viewUserDetails(user)}
                          className="text-yellow-600 hover:text-yellow-900 px-2 py-1 rounded hover:bg-yellow-50"
                        >
                          View
                        </button>
                        {user.status === 'active' || !user.status ? (
                          <button 
                            onClick={() => updateUserStatus(user._id, 'suspended')}
                            className="text-orange-600 hover:text-orange-900 px-2 py-1 rounded hover:bg-orange-50"
                          >
                            Suspend
                          </button>
                        ) : user.status === 'suspended' ? (
                          <button 
                            onClick={() => updateUserStatus(user._id, 'active')}
                            className="text-green-600 hover:text-green-900 px-2 py-1 rounded hover:bg-green-50"
                          >
                            Activate
                          </button>
                      ) : null}
                        <button 
                          onClick={() => deleteUser(user._id)}
                          className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50"
                        >
                          Delete
                        </button>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>


    </div>
  );

  const renderProjects = () => (
    <div className="space-y-6">
      {/* Project Management Header */}
      <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-yellow-200 hover:border-yellow-400">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Project Management</h3>
            <p className="text-gray-600 mt-1">Monitor all projects, track progress, and manage disputes</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="bg-gradient-to-r from-blue-400 to-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
              {recentProjects.filter(p => p.status === 'In Progress').length} Active
            </span>
            <span className="bg-gradient-to-r from-green-400 to-green-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
              {recentProjects.filter(p => p.status === 'Completed').length} Completed
            </span>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl">
              Add Project
            </button>
          </div>
        </div>

        {/* Project Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <select className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="disputed">Disputed</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500">
            <option value="">All Categories</option>
            <option value="web-development">Web Development</option>
            <option value="design">Design</option>
            <option value="writing">Writing</option>
            <option value="marketing">Marketing</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500">
            <option value="">All Budgets</option>
            <option value="0-500">$0 - $500</option>
            <option value="500-1000">$500 - $1000</option>
            <option value="1000+">$1000+</option>
          </select>
          <input
            type="text"
            placeholder="Search projects..."
            className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
          />
        </div>

        {/* Enhanced Project Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Freelancer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentProjects.map(project => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{project.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.client}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.freelancer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.budget}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      project.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                      project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {project.status === 'In Progress' ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                        </div>
                        <span className="text-xs text-gray-500">{project.progress}%</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-yellow-600 hover:text-yellow-900 px-2 py-1 rounded hover:bg-yellow-50">View</button>
                      <button className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50">Edit</button>
                      <button className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Monitoring Tools */}
      <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-yellow-200 hover:border-yellow-400">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Project Monitoring & Dispute Resolution</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Monitoring Tools</h4>
            <div className="space-y-3">
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300">
                Monitor All Active Projects
              </button>
              <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-xl font-medium transition-all duration-300">
                Review Disputed Projects
              </button>
              <button className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300">
                Generate Progress Reports
              </button>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Automated Alerts</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="rounded text-yellow-500 focus:ring-yellow-400" defaultChecked />
                <span className="text-sm text-gray-700">Alert on project delays</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="rounded text-yellow-500 focus:ring-yellow-400" defaultChecked />
                <span className="text-sm text-gray-700">Notify on disputes</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="rounded text-yellow-500 focus:ring-yellow-400" />
                <span className="text-sm text-gray-700">Track milestone completions</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-yellow-200 hover:border-yellow-400">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Service Approvals</h3>
          <p className="text-gray-600 mt-1">Review and approve new service submissions</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
            {pendingServices.length} Pending
          </span>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl">
            Bulk Actions
          </button>
        </div>
      </div>
      
      <div className="space-y-6">
        {pendingServices.map(service => (
          <div key={service.id} className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:border-yellow-300 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{service.title}</h4>
                    <p className="text-yellow-600 font-medium">${service.price}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-gray-600">By: <span className="font-medium">{service.freelancer}</span></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="text-gray-600">Category: <span className="font-medium">{service.category}</span></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span className="text-gray-600">Price: <span className="font-medium">${service.price}</span></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-600">Posted: <span className="font-medium">{service.createdAt}</span></span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Approve</span>
              </button>
              <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Reject</span>
              </button>
              <button className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>View Details</span>
              </button>
            </div>
          </div>
        ))}
        
        {pendingServices.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">All caught up!</h3>
            <p className="text-gray-600 max-w-md mx-auto">No pending services to review. All submissions have been processed.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderModeration = () => (
    <div className="space-y-8">
      {/* Content Moderation Header */}
      <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-yellow-200 hover:border-yellow-400">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Content Moderation</h3>
            <p className="text-gray-600 mt-1">Review and manage reported content, spam, and inappropriate posts</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="bg-gradient-to-r from-red-400 to-red-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
              {reportedContent.filter(item => item.status === "Pending Review").length} Pending
            </span>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl">
              Bulk Actions
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <select className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500">
            <option value="">All Types</option>
            <option value="service">Service</option>
            <option value="message">Message</option>
            <option value="project">Project</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500">
            <option value="">All Severity</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500">
            <option value="">All Status</option>
            <option value="pending">Pending Review</option>
            <option value="investigation">Under Investigation</option>
            <option value="resolved">Resolved</option>
          </select>
          <input
            type="text"
            placeholder="Search reported content..."
            className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
          />
        </div>

        {/* Reported Content List */}
        <div className="space-y-4">
          {reportedContent.map(item => (
            <div key={item.id} className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:border-yellow-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                      item.severity === 'Critical' ? 'bg-red-500' :
                      item.severity === 'High' ? 'bg-orange-500' :
                      item.severity === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">{item.title}</h4>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className={`px-2 py-1 rounded-full font-medium ${
                          item.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                          item.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                          item.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {item.severity}
                        </span>
                        <span className="text-gray-600">Type: {item.type}</span>
                        <span className="text-gray-600">By: {item.reporter}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 leading-relaxed">{item.content}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="text-gray-600">Reason: <span className="font-medium">{item.reason}</span></span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-600">Reported: <span className="font-medium">{item.reportedAt}</span></span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-600">Status: <span className="font-medium">{item.status}</span></span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Approve</span>
                </button>
                <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Remove</span>
                </button>
                <button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span>Investigate</span>
                </button>
                <button className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spam Detection Tools */}
      <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-yellow-200 hover:border-yellow-400">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Spam Detection & Filtering</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Content Filters</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="rounded text-yellow-500 focus:ring-yellow-400" defaultChecked />
                <span className="text-sm text-gray-700">Auto-detect spam keywords</span>
              </label>
              <label className="flex items-center space-x3">
                <input type="checkbox" className="rounded text-yellow-500 focus:ring-yellow-400" defaultChecked />
                <span className="text-sm text-gray-700">Filter suspicious links</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="rounded text-yellow-500 focus:ring-yellow-400" defaultChecked />
                <span className="text-sm text-gray-700">Detect duplicate content</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="rounded text-yellow-500 focus:ring-yellow-500" />
                <span className="text-sm text-gray-700">AI-powered content analysis</span>
              </label>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Action Settings</h4>
            <div className="space-y-3">
              <select className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500">
                <option value="auto">Auto-flag suspicious content</option>
                <option value="manual">Manual review only</option>
                <option value="hybrid">Hybrid approach</option>
              </select>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500">
                <option value="warn">Warn user first</option>
                <option value="suspend">Suspend account immediately</option>
                <option value="ban">Ban account permanently</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-8">
      {/* Analytics Header */}
      <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-yellow-200 hover:border-yellow-400">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Advanced Analytics & Reports</h3>
            <p className="text-gray-600 mt-1">Comprehensive insights by university, faculty, and category</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl">
              Export Report
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <select
            value={selectedUniversity}
            onChange={(e) => setSelectedUniversity(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
          >
            <option value="all">All Universities</option>
            {universityStats.map(uni => (
              <option key={uni.name} value={uni.name}>{uni.name}</option>
            ))}
          </select>
          <select
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
          >
            <option value="all">All Faculties</option>
            {facultyStats.map(faculty => (
              <option key={faculty.name} value={faculty.name}>{faculty.name}</option>
            ))}
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
          >
            <option value="all">All Categories</option>
            {categoryStats.map(cat => (
              <option key={cat.name} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* University Performance */}
      <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-yellow-200 hover:border-yellow-400">
        <h3 className="text-xl font-bold text-gray-900 mb-6">University Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Users</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projects</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {universityStats.map(uni => (
                <tr key={uni.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{uni.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{uni.users.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{uni.projects.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${uni.revenue.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      uni.growth > 10 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      +{uni.growth}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Faculty Performance */}
      <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-yellow-200 hover:border-yellow-400">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Faculty Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faculty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projects</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {facultyStats.map(faculty => (
                <tr key={faculty.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{faculty.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{faculty.users.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{faculty.projects.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${faculty.revenue.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      faculty.growth > 10 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      +{faculty.growth}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Performance */}
      <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-yellow-200 hover:border-yellow-400">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Category Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projects</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Success Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Budget</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categoryStats.map(cat => (
                <tr key={cat.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{cat.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cat.projects.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${cat.revenue.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      cat.successRate > 90 ? 'bg-green-100 text-green-800' : 
                      cat.successRate > 80 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {cat.successRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${cat.avgBudget.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-yellow-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Admin Settings</h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Profile Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={adminUsername}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <input
                type="text"
                value="Super Admin"
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-gray-50"
              />
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Change Password</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Confirm new password"
              />
            </div>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-xl font-medium">
              Update Password
            </button>
          </div>
        </div>

        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">System Settings</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive email notifications for important events</p>
              </div>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-xl font-medium">
                Enabled
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
              </div>
              <button className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-xl font-medium">
                Disabled
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-black relative overflow-x-hidden">
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      


      {/* Main Content with Professional Sidebar Layout */}
      <div className="flex min-h-screen relative z-10">
        {/* Left Sidebar - Fixed width, full height, positioned at top */}
        <div className="w-64 bg-white shadow-2xl border-r border-gray-200 flex-shrink-0">
          {/* Sidebar Header */}
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-6 border-b border-yellow-300">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-yellow-400 font-bold text-lg">A</span>
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Admin Panel</h2>
                <p className="text-yellow-100 text-sm">Dashboard Navigation</p>
              </div>
            </div>
          </div>
          
          {/* Navigation Menu */}
          <div className="p-4">
            <nav className="flex flex-col space-y-1">
              {[
                { id: "overview", name: "Overview", icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" },
                { id: "users", name: "Users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" },
                { id: "projects", name: "Projects", icon: "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
                { id: "services", name: "Services", icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" },
                { id: "moderation", name: "Moderation", icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" },
                { id: "analytics", name: "Analytics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
                { id: "settings", name: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" }
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
              
              {/* Divider */}
              <div className="border-t border-gray-200 my-4"></div>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 text-left group text-red-600 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200"
              >
                <svg className="w-5 h-5 flex-shrink-0 transition-colors duration-200 text-red-500 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="font-medium">Logout</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8 pt-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {activeTab === "overview" && renderOverview()}
            {activeTab === "users" && renderUsers()}
            {activeTab === "projects" && renderProjects()}
            {activeTab === "services" && renderServices()}
            {activeTab === "moderation" && renderModeration()}
            {activeTab === "analytics" && renderAnalytics()}
            {activeTab === "settings" && renderSettings()}
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">User Details</h3>
                <button 
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              {/* Profile Picture */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  {selectedUser.profileImage && selectedUser.profileImage.url ? (
                    <img 
                      src={selectedUser.profileImage.url} 
                      alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                      className="w-32 h-32 rounded-full object-cover border-4 border-yellow-200 shadow-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center border-4 border-yellow-200 shadow-lg ${selectedUser.profileImage && selectedUser.profileImage.url ? 'hidden' : ''}`}>
                    <span className="text-4xl font-bold text-white">
                      {selectedUser.firstName ? selectedUser.firstName.charAt(0).toUpperCase() : 'U'}
                      {selectedUser.lastName ? selectedUser.lastName.charAt(0).toUpperCase() : ''}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <p className="text-gray-900">{selectedUser.firstName} {selectedUser.lastName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">{selectedUser.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">User Type</label>
                      <p className="text-gray-900 capitalize">{selectedUser.userType}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        selectedUser.status === 'active' ? 'bg-green-100 text-green-800' : 
                        selectedUser.status === 'suspended' ? 'bg-orange-100 text-orange-800' :
                        selectedUser.status === 'banned' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedUser.status ? selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1) : 'Active'}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                      <p className="text-gray-900">{selectedUser.phoneNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                      <p className="text-gray-900">{selectedUser.dateOfBirth || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <p className="text-gray-900">{selectedUser.address || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Joined Date</label>
                      <p className="text-gray-900">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* User Type Specific Information */}
                {selectedUser.userType === 'freelancer' && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Freelancer Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">University</label>
                        <p className="text-gray-900">{selectedUser.university || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Degree Program</label>
                        <p className="text-gray-900">{selectedUser.degreeProgram || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">GPA</label>
                        <p className="text-gray-900">{selectedUser.gpa || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Graduation Year</label>
                        <p className="text-gray-900">{selectedUser.graduationYear || 'N/A'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Technical Skills</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedUser.technicalSkills && selectedUser.technicalSkills.length > 0 ? (
                            selectedUser.technicalSkills.map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {skill}
                              </span>
                            ))
                          ) : (
                            <p className="text-gray-500">No skills listed</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedUser.userType === 'client' && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Client Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Organization</label>
                        <p className="text-gray-900">{selectedUser.organization || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Job Title</label>
                        <p className="text-gray-900">{selectedUser.jobTitle || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                        <p className="text-gray-900">{selectedUser.contactPhone || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Company Size</label>
                        <p className="text-gray-900">{selectedUser.companySize || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Industry</label>
                        <p className="text-gray-900">{selectedUser.industry || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Website</label>
                        <p className="text-gray-900">{selectedUser.website || 'N/A'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Project Categories</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedUser.projectCategories && selectedUser.projectCategories.length > 0 ? (
                            selectedUser.projectCategories.map((category, index) => (
                              <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                {category}
                              </span>
                            ))
                          ) : (
                            <p className="text-gray-500">No categories listed</p>
                          )}
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Company Description</label>
                        <p className="text-gray-900">{selectedUser.companyDescription || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedUser.userType === 'universityStaff' && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">University Staff Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Staff Role</label>
                        <p className="text-gray-900">{selectedUser.staffRole || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Department</label>
                        <p className="text-gray-900">{selectedUser.department || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                        <p className="text-gray-900">{selectedUser.employeeId || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Qualification</label>
                        <p className="text-gray-900">{selectedUser.qualification || 'N/A'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Experience</label>
                        <p className="text-gray-900">{selectedUser.experience || 'N/A'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Professional Summary</label>
                        <p className="text-gray-900">{selectedUser.professionalSummary || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Account Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Account Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email Verified</label>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        selectedUser.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedUser.isVerified ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Agreed to Terms</label>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        selectedUser.agreeToTerms ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedUser.agreeToTerms ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Marketing Consent</label>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        selectedUser.agreeToMarketing ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedUser.agreeToMarketing ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button 
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
