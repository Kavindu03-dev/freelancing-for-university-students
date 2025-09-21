import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

// PDF Export functionality
const exportToPDF = (analyticsData, filters) => {
  // Create a new window for PDF generation
  const printWindow = window.open('', '_blank');
  
  // Get current date and time
  const now = new Date();
  const dateString = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const timeString = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Create the HTML content for the PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Analytics Report - ${dateString}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #22cc9d;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #1f2937;
          margin: 0;
          font-size: 28px;
        }
        .header p {
          color: #6b7280;
          margin: 5px 0;
        }
        .filters {
          background: #f9fafb;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        .filters h3 {
          margin: 0 0 10px 0;
          color: #374151;
        }
        .filter-item {
          display: inline-block;
          margin-right: 20px;
          font-size: 14px;
        }
        .filter-label {
          font-weight: bold;
          color: #6b7280;
        }
        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .summary-card {
          background: linear-gradient(135deg, #22cc9d, #22cc9d);
          color: white;
          padding: 20px;
          border-radius: 12px;
          text-align: center;
        }
        .summary-card h3 {
          margin: 0 0 10px 0;
          font-size: 14px;
          opacity: 0.9;
        }
        .summary-card .number {
          font-size: 32px;
          font-weight: bold;
          margin: 0;
        }
        .section {
          margin-bottom: 40px;
        }
        .section h2 {
          color: #1f2937;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
        }
        .data-table th,
        .data-table td {
          border: 1px solid #e5e7eb;
          padding: 12px;
          text-align: left;
        }
        .data-table th {
          background: #f9fafb;
          font-weight: bold;
          color: #374151;
        }
        .data-table tr:nth-child(even) {
          background: #f9fafb;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #6b7280;
          font-size: 12px;
          border-top: 1px solid #e5e7eb;
          padding-top: 20px;
        }
        @media print {
          body { margin: 0; }
          .header { page-break-after: avoid; }
          .section { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Freelancing Platform Analytics Report</h1>
        <p>Generated on ${dateString} at ${timeString}</p>
        <p>Comprehensive insights and performance metrics</p>
      </div>

      <div class="filters">
        <h3>Report Filters Applied:</h3>
        <div class="filter-item">
          <span class="filter-label">Date Range:</span> ${filters.dateRange} days
        </div>
        <div class="filter-item">
          <span class="filter-label">University:</span> ${filters.university === 'all' ? 'All Universities' : filters.university}
        </div>
        <div class="filter-item">
          <span class="filter-label">Faculty:</span> ${filters.faculty === 'all' ? 'All Faculties' : filters.faculty}
        </div>
        <div class="filter-item">
          <span class="filter-label">Category:</span> ${filters.category === 'all' ? 'All Categories' : filters.category}
        </div>
      </div>

      <div class="summary-cards">
        <div class="summary-card">
          <h3>Total Universities</h3>
          <p class="number">${analyticsData.universityStats.length}</p>
        </div>
        <div class="summary-card">
          <h3>Total Faculties</h3>
          <p class="number">${analyticsData.facultyStats.length}</p>
        </div>
        <div class="summary-card">
          <h3>Total Categories</h3>
          <p class="number">${analyticsData.categoryStats.length}</p>
        </div>
        <div class="summary-card">
          <h3>Total Students</h3>
          <p class="number">${analyticsData.universityStats.reduce((sum, uni) => sum + uni.studentCount, 0)}</p>
        </div>
      </div>

      <div class="section">
        <h2>University Statistics</h2>
        <table class="data-table">
          <thead>
            <tr>
              <th>University</th>
              <th>Student Count</th>
              <th>Success Rate</th>
            </tr>
          </thead>
          <tbody>
            ${analyticsData.universityStats.map(uni => `
              <tr>
                <td>${uni.name}</td>
                <td>${uni.studentCount}</td>
                <td>${uni.successRate || 'N/A'}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="section">
        <h2>Faculty Statistics</h2>
        <table class="data-table">
          <thead>
            <tr>
              <th>Faculty</th>
              <th>Student Count</th>
              <th>Average Rating</th>
            </tr>
          </thead>
          <tbody>
            ${analyticsData.facultyStats.map(faculty => `
              <tr>
                <td>${faculty.name}</td>
                <td>${faculty.studentCount}</td>
                <td>${faculty.averageRating || 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="section">
        <h2>Category Statistics</h2>
        <table class="data-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Average Budget</th>
              <th>Completion Rate</th>
            </tr>
          </thead>
          <tbody>
            ${analyticsData.categoryStats.map(cat => `
              <tr>
                <td>${cat.name}</td>
                <td>$${cat.averageBudget || 0}</td>
                <td>${cat.completionRate || 'N/A'}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="footer">
        <p>This report was automatically generated by the Freelancing Platform Analytics System.</p>
        <p>For questions or support, please contact the platform administrators.</p>
      </div>
    </body>
    </html>
  `;

  // Write the HTML content to the new window
  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // Wait for content to load, then print
  printWindow.onload = function() {
    printWindow.print();
    printWindow.close();
  };
};

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [adminUsername, setAdminUsername] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("all");
  const [selectedFaculty, setSelectedFaculty] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dateRange, setDateRange] = useState("30");
  
  // Resources management state (Admin)
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [resourceSearchTerm, setResourceSearchTerm] = useState('');
  const [resourceCategory, setResourceCategory] = useState('');
  const [resourceDifficulty, setResourceDifficulty] = useState('');
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [showEditResourceModal, setShowEditResourceModal] = useState(false);
  const [showViewResourceModal, setShowViewResourceModal] = useState(false);
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
  
  // Contact Messages State
  const [contactMessages, setContactMessages] = useState([]);
  const [contactStats, setContactStats] = useState({});
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [contactFilters, setContactFilters] = useState({
    status: '',
    priority: '',
    category: ''
  });
  const [contactPagination, setContactPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalMessages: 0
  });
  
  const navigate = useNavigate();

  // View service details function
  const viewServiceDetails = (service) => {
    if (service.type === 'gig') {
      navigate(`/service/${service._id}`);
    } else {
      // For posts, we might need a different route or handle differently
      navigate(`/service/${service._id}`);
    }
  };

  // Debug imports and functions
  console.log('🔍 AdminDashboard component initialized');
  console.log('🔍 navigate function:', typeof navigate);
  console.log('🔍 logout import:', typeof logout);

  // Fetch pending posts for approval
  const fetchPendingPosts = async () => {
    try {
      setPostsLoading(true);
      setPostsError(null);
      
      // Try to get admin token first, fallback to userToken
      const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('userToken');
      
      if (!adminToken) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch('/api/posts/admin/pending', {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        }
        throw new Error('Failed to fetch pending posts');
      }
      
      const data = await response.json();
      setPendingPosts(data.posts || []);
    } catch (err) {
      setPostsError(err.message);
      console.error('Error fetching pending posts:', err);
    } finally {
      setPostsLoading(false);
    }
  };

  // Approve a post
  const approvePost = async (postId) => {
    try {
      const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('userToken');
      
      if (!adminToken) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`/api/posts/admin/${postId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        }
        throw new Error('Failed to approve post');
      }
      
      // Remove from pending list
      setPendingPosts(prev => prev.filter(post => post._id !== postId));
      
      // Show success message
      alert('Post approved successfully!');
    } catch (err) {
      console.error('Error approving post:', err);
      alert('Failed to approve post: ' + err.message);
    }
  };

  // Reject a post
  const rejectPost = async (postId, rejectionReason) => {
    try {
      const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('userToken');
      
      if (!adminToken) {
        throw new Error('Failed to reject post');
      }
      
      const response = await fetch(`/api/posts/admin/${postId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rejectionReason })
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        }
        throw new Error('Failed to reject post');
      }
      
      // Remove from pending list
      setPendingPosts(prev => prev.filter(post => post._id !== postId));
      
      // Show success message
      alert('Post rejected successfully!');
    } catch (err) {
      console.error('Error rejecting post:', err);
      alert('Failed to reject post: ' + err.message);
    }
  };

  // Resources: Fetch all (admin)
  const fetchResources = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('userToken');
      if (!adminToken) throw new Error('No authentication token found');

      const response = await fetch('/api/resources/admin/all', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch resources');
      const data = await response.json();
      setResources(data.data || []);
      setFilteredResources(data.data || []);
    } catch (err) {
      console.error('Error fetching resources:', err);
      alert('Failed to fetch resources: ' + err.message);
    }
  };

  // Resources: Apply filters
  useEffect(() => {
    let list = [...resources];
    const term = resourceSearchTerm.trim().toLowerCase();
    if (term) {
      list = list.filter(r => {
        const creatorName = r.createdBy && (r.createdBy.name || ((r.createdBy.firstName && r.createdBy.lastName) ? `${r.createdBy.firstName} ${r.createdBy.lastName}` : ''));
        return (
          (r.title || '').toLowerCase().includes(term) ||
          (r.description || '').toLowerCase().includes(term) ||
          (r.category || '').toLowerCase().includes(term) ||
          (r.type || '').toLowerCase().includes(term) ||
          (r.difficulty || '').toLowerCase().includes(term) ||
          (r.readTime || '').toLowerCase().includes(term) ||
          (Array.isArray(r.tags) && r.tags.some(t => (t || '').toLowerCase().includes(term))) ||
          (creatorName && creatorName.toLowerCase().includes(term))
        );
      });
    }
    if (resourceCategory) list = list.filter(r => r.category === resourceCategory);
    if (resourceDifficulty) list = list.filter(r => r.difficulty === resourceDifficulty);
    setFilteredResources(list);
  }, [resources, resourceSearchTerm, resourceCategory, resourceDifficulty]);

  // Resources: CRUD handlers
  const handleAddResource = async (e) => {
    e.preventDefault();
    try {
      const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('userToken');
      if (!adminToken) throw new Error('No authentication token found');

      const payload = { ...newResource };
      if (typeof payload.tags === 'string') {
        payload.tags = payload.tags.split(',').map(t => t.trim()).filter(Boolean);
      }

      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to add resource');
      }
      setShowAddResourceModal(false);
      setNewResource({ title:'', description:'', category:'', type:'', readTime:'', difficulty:'Beginner', tags:'', link:'', featured:false });
      fetchResources();
      alert('Resource added successfully!');
    } catch (err) {
      console.error('Error adding resource:', err);
      alert('Failed to add resource: ' + err.message);
    }
  };

  const handleEditResource = (resource) => {
    setSelectedResource(resource);
    setShowEditResourceModal(true);
  };

  const handleViewResource = (resource) => {
    setSelectedResource(resource);
    setShowViewResourceModal(true);
  };

  const handleUpdateResource = async (e) => {
    e.preventDefault();
    try {
      const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('userToken');
      if (!adminToken) throw new Error('No authentication token found');

      const payload = { ...selectedResource };
      if (typeof payload.tags === 'string') {
        payload.tags = payload.tags.split(',').map(t => t.trim()).filter(Boolean);
      }

      const response = await fetch(`/api/resources/${selectedResource._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to update resource');
      }
      const updated = await response.json();
      setResources(prev => prev.map(r => r._id === selectedResource._id ? updated.data : r));
      setShowEditResourceModal(false);
      setSelectedResource(null);
      alert('Resource updated successfully!');
    } catch (err) {
      console.error('Error updating resource:', err);
      alert('Failed to update resource: ' + err.message);
    }
  };

  const handleDeleteResource = async (resourceId) => {
    if (!window.confirm('Delete this resource (soft delete)?')) return;
    try {
      const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('userToken');
      if (!adminToken) throw new Error('No authentication token found');

      const response = await fetch(`/api/resources/${resourceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to delete resource');
      }
      fetchResources();
      alert('Resource deleted successfully');
    } catch (err) {
      console.error('Error deleting resource:', err);
      alert('Failed to delete resource: ' + err.message);
    }
  };

  const handlePermanentDeleteResource = async (resourceId) => {
    if (!window.confirm('Permanently delete this resource? This cannot be undone.')) return;
    try {
      const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('userToken');
      if (!adminToken) throw new Error('No authentication token found');

      const response = await fetch(`/api/resources/${resourceId}/permanent`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to permanently delete resource');
      }
      setResources(prev => prev.filter(r => r._id !== resourceId));
      alert('Resource permanently deleted');
    } catch (err) {
      console.error('Error permanently deleting resource:', err);
      alert('Failed to permanently delete resource: ' + err.message);
    }
  };

  // Approve a service (gig or post)
  const approveService = async (service) => {
    try {
      const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('userToken');
      
      if (!adminToken) {
        throw new Error('No authentication token found');
      }

      let response;
      if (service.type === 'gig') {
        // Approve gig
        response = await fetch(`/api/services/${service._id}/status`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: 'approved' })
        });
      } else {
        // Approve post
        response = await fetch(`/api/posts/admin/${service._id}/approve`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        });
      }
      
      if (!response.ok) {
        throw new Error('Failed to approve service');
      }
      
      // Update the service status in the list
      setPendingServices(prev => prev.map(s => 
        s._id === service._id 
          ? { ...s, status: 'approved' }
          : s
      ));
      
      // Show success message
      alert(`${service.type === 'gig' ? 'Gig' : 'Post'} approved successfully!`);
    } catch (err) {
      console.error('Error approving service:', err);
      alert('Failed to approve service: ' + err.message);
    }
  };

  // Reject a service (gig or post)
  const rejectService = async (service) => {
    try {
      const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('userToken');
      
      if (!adminToken) {
        throw new Error('No authentication token found');
      }

      let response;
      if (service.type === 'gig') {
        response = await fetch(`/api/services/${service._id}/status`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: 'rejected' })
        });
      } else {
        response = await fetch(`/api/posts/admin/${service._id}/reject`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ rejectionReason: 'Rejected by admin' })
        });
      }
      
      if (!response.ok) {
        throw new Error('Failed to reject service');
      }
      
      // Update the service status in the list
      setPendingServices(prev => prev.map(s => 
        s._id === service._id 
          ? { ...s, status: 'rejected' }
          : s
      ));
      
      alert('Service rejected successfully!');
    } catch (err) {
      console.error('Error rejecting service:', err);
      alert('Failed to reject service: ' + err.message);
    }
  };

  // Delete a gig permanently
  const deleteGig = async (gig) => {
    try {
      const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('userToken');
      
      if (!adminToken) {
        throw new Error('No authentication token found');
      }

      // Confirm deletion
      const confirmed = window.confirm(`Are you sure you want to permanently delete the gig "${gig.title}"? This action cannot be undone.`);
      if (!confirmed) {
        return; // User cancelled
      }

      const response = await fetch(`/api/services/${gig._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete gig');
      }
      
      // Remove the gig from the list
      setPendingServices(prev => prev.filter(s => s._id !== gig._id));
      
      // Show success message
      alert('Gig deleted successfully!');
    } catch (err) {
      console.error('Error deleting gig:', err);
      alert('Failed to delete gig: ' + err.message);
    }
  };

  // Delete a post permanently
  const deletePost = async (post) => {
    try {
      const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('userToken');
      
      if (!adminToken) {
        throw new Error('No authentication token found');
      }

      // Confirm deletion
      const confirmed = window.confirm(`Are you sure you want to permanently delete the post "${post.title}"? This action cannot be undone.`);
      if (!confirmed) {
        return; // User cancelled
      }

      const response = await fetch(`/api/posts/admin/${post._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      
      // Remove the post from the list
      setPendingServices(prev => prev.filter(s => s._id !== post._id));
      
      // Show success message
      alert('Post deleted successfully!');
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete post: ' + err.message);
    }
  };

  // Enhanced mock data for dashboard
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFreelancers: 0,
    totalClients: 0,
    totalGigs: 0,
    totalPosts: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
    newMessages: 0,
    monthlyGrowth: 0,
    conversionRate: 0
  });

  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState({
    total: 0,
    freelancers: 0,
    clients: 0,
    universityStaff: 0,
    active: 0,
    suspended: 0
  });
  const [userPagination, setUserPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [userFilters, setUserFilters] = useState({
    userType: 'all',
    status: 'all',
    search: ''
  });
  const [userLoading, setUserLoading] = useState(false);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  const [orderFilters, setOrderFilters] = useState({
    status: 'all',
    search: ''
  });



  // Fetch dashboard stats and data when component mounts
  useEffect(() => {
    fetchDashboardStats();
    fetchPendingPosts();
    fetchAllServices();
    fetchOrders();
  }, []);

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('userToken');
      
      if (!adminToken) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch('/api/admin/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      } else {
        console.error('Error fetching dashboard stats:', result.message);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  // Fetch all services (gigs and posts)
  const fetchAllServices = async () => {
    try {
      setServicesLoading(true);
      setServicesError(null);
      
      const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('userToken');
      
      if (!adminToken) {
        throw new Error('No authentication token found');
      }
      
      // Fetch all services (gigs and posts)
      const response = await fetch('/api/services', {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      
      const servicesData = await response.json();
      const allServices = servicesData.data || [];
      
      // Format services for display
      const formattedServices = allServices.map(service => ({
        ...service,
        price: service.price || service.budget,
        freelancer: service.freelancerName || service.clientName,
        category: service.category,
        status: service.status || service.approvalStatus || 'active'
      }));
      
      // Sort by creation date
      formattedServices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPendingServices(formattedServices);
      
      // Calculate gig and post counts for display purposes only
      const gigs = formattedServices.filter(service => service.type === 'gig');
      const posts = formattedServices.filter(service => service.type === 'post');
      
    } catch (err) {
      setServicesError(err.message);
      console.error('Error fetching services:', err);
    } finally {
      setServicesLoading(false);
    }
  };

  // State for pending services (both freelancer gigs and client posts)
  const [pendingServices, setPendingServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState(null);

  // State for pending posts approval
  const [pendingPosts, setPendingPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState(null);



  // Analytics state
  const [universityStats, setUniversityStats] = useState([]);
  const [facultyStats, setFacultyStats] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState(null);
  
  // Filtered analytics data
  const [filteredUniversityStats, setFilteredUniversityStats] = useState([]);
  const [filteredFacultyStats, setFilteredFacultyStats] = useState([]);
  const [filteredCategoryStats, setFilteredCategoryStats] = useState([]);










  // User management functions
  const fetchUsers = async (page = 1, filters = userFilters) => {
    try {
      setUserLoading(true);
      const adminToken = localStorage.getItem('adminToken');
      
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...filters
      });
      
      const response = await fetch(`/api/users/admin/all?${params}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data || []);
        setUserStats(data.stats || {});
        setUserPagination(data.pagination || {});
      } else {
        console.error('Error fetching users:', response.status);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setUserLoading(false);
    }
  };

  const handleUserFilterChange = (filterType, value) => {
    const newFilters = { ...userFilters, [filterType]: value };
    setUserFilters(newFilters);
    fetchUsers(1, newFilters);
  };

  const handleUserSearch = (searchTerm) => {
    const newFilters = { ...userFilters, search: searchTerm };
    setUserFilters(newFilters);
    fetchUsers(1, newFilters);
  };

  const handleUserPageChange = (page) => {
    fetchUsers(page, userFilters);
  };

  const handleUserAction = async (userId, action) => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      let method = 'PUT';
      let url = `/api/users/admin/${userId}/${action}`;
      
      // Use DELETE method for delete action
      if (action === 'delete') {
        method = 'DELETE';
        url = `/api/users/admin/${userId}`;
      }
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Refresh user data
        fetchUsers(userPagination.currentPage, userFilters);
      } else {
        console.error(`Error ${action} user:`, response.status);
      }
    } catch (error) {
      console.error(`Error ${action} user:`, error);
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserDetailsModal(true);
  };

  // Orders management functions
  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      setOrdersError(null);
      
      const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('userToken');
      
      if (!adminToken) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch('/api/orders/all', {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
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

  const handleOrderFilterChange = (filterType, value) => {
    const newFilters = { ...orderFilters, [filterType]: value };
    setOrderFilters(newFilters);
    // Apply filters locally since we already have all orders
    applyOrderFilters(newFilters);
  };

  const handleMarkOrderAsPaid = async (orderId) => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        console.error('No admin authentication token found');
        return;
      }

      const response = await fetch(`/api/orders/${orderId}/mark-paid`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (response.ok) {
        // Update the local orders state
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId
              ? { ...order, paymentStatus: 'Paid' }
              : order
          )
        );

        // Show success message
        alert('Order marked as paid successfully!');
      } else {
        const errorData = await response.json();
        console.error('Failed to mark order as paid:', errorData);
        alert(`Failed to mark order as paid: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error marking order as paid:', error);
      alert('Error marking order as paid. Please try again.');
    }
  };

  const handleSendMoneyToFreelancer = async (orderId, totalAmount) => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        console.error('No admin authentication token found');
        return;
      }

      // Calculate amounts: totalAmount is 110% (including 10% fee)
      // So freelancerAmount = totalAmount / 1.10, and websiteFee = totalAmount - freelancerAmount
      const freelancerAmount = totalAmount / 1.10;
      const websiteFee = totalAmount - freelancerAmount;

      // Show confirmation dialog with fee breakdown
      const confirmed = window.confirm(
        `Send money to freelancer?\n\n` +
        `Total Order Amount (110%): $${totalAmount.toFixed(2)}\n` +
        `Website Fee (10%): $${websiteFee.toFixed(2)}\n` +
        `Freelancer Receives (100%): $${freelancerAmount.toFixed(2)}\n\n` +
        `Do you want to proceed?`
      );

      if (!confirmed) {
        return;
      }

      const response = await fetch(`/api/orders/${orderId}/send-money-to-freelancer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          freelancerAmount,
          websiteFee,
          totalAmount
        })
      });

      if (response.ok) {
        // Update the local orders state
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId
              ? { ...order, paymentStatus: 'Paid', status: 'Completed' }
              : order
          )
        );

        // Show success message
        alert(`Money sent successfully!\n\nTotal Order Amount (110%): $${totalAmount.toFixed(2)}\nWebsite Fee (10%): $${websiteFee.toFixed(2)}\nFreelancer Received (100%): $${freelancerAmount.toFixed(2)}`);
      } else {
        const errorData = await response.json();
        console.error('Failed to send money to freelancer:', errorData);
        alert(`Failed to send money to freelancer: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error sending money to freelancer:', error);
      alert('Error sending money to freelancer. Please try again.');
    }
  };

  const applyOrderFilters = (filters) => {
    let filteredOrders = orders;
    
    if (filters.status !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.status === filters.status);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredOrders = filteredOrders.filter(order => 
        order.serviceId?.title?.toLowerCase().includes(searchTerm) ||
        order.clientId?.firstName?.toLowerCase().includes(searchTerm) ||
        order.clientId?.lastName?.toLowerCase().includes(searchTerm) ||
        order.freelancerId?.firstName?.toLowerCase().includes(searchTerm) ||
        order.freelancerId?.lastName?.toLowerCase().includes(searchTerm)
      );
    }
    
    setOrders(filteredOrders);
  };



  // Analytics functions
  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      setAnalyticsError(null);
      const adminToken = localStorage.getItem('adminToken');
      
      // Build query parameters with filters
      const params = new URLSearchParams({
        dateRange: dateRange,
        university: selectedUniversity !== 'all' ? selectedUniversity : '',
        faculty: selectedFaculty !== 'all' ? selectedFaculty : '',
        category: selectedCategory !== 'all' ? selectedCategory : ''
      });
      
      // Fetch all analytics data in parallel
      const [universityResponse, facultyResponse, categoryResponse] = await Promise.all([
        fetch(`http://localhost:5000/api/analytics/university?${params}`, {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        }),
        fetch(`http://localhost:5000/api/analytics/faculty?${params}`, {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        }),
        fetch(`http://localhost:5000/api/analytics/category?${params}`, {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        })
      ]);

      if (universityResponse.ok && facultyResponse.ok && categoryResponse.ok) {
        const [universityData, facultyData, categoryData] = await Promise.all([
          universityResponse.json(),
          facultyResponse.json(),
          categoryResponse.json()
        ]);

        setUniversityStats(universityData.data || []);
        setFacultyStats(facultyData.data || []);
        setCategoryStats(categoryData.data || []);
        
        // Apply filters to the data
        applyFilters(universityData.data || [], facultyData.data || [], categoryData.data || []);
      } else {
        setAnalyticsError('Failed to fetch analytics data');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setAnalyticsError('Error fetching analytics data');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Apply filters to analytics data
  const applyFilters = (universityData, facultyData, categoryData) => {
    let filteredUni = universityData;
    let filteredFaculty = facultyData;
    let filteredCat = categoryData;

    // Apply university filter
    if (selectedUniversity !== 'all') {
      filteredUni = universityData.filter(uni => uni.name === selectedUniversity);
      filteredFaculty = facultyData.filter(faculty => 
        faculty.university === selectedUniversity || !faculty.university
      );
      filteredCat = categoryData.filter(cat => 
        cat.university === selectedUniversity || !cat.university
      );
    }

    // Apply faculty filter
    if (selectedFaculty !== 'all') {
      filteredFaculty = filteredFaculty.filter(faculty => faculty.name === selectedFaculty);
      filteredUni = filteredUni.filter(uni => 
        uni.faculty === selectedFaculty || !uni.faculty
      );
      filteredCat = filteredCat.filter(cat => 
        cat.faculty === selectedFaculty || !cat.faculty
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filteredCat = filteredCat.filter(cat => cat.name === selectedCategory);
      filteredUni = filteredUni.filter(uni => 
        uni.category === selectedCategory || !uni.category
      );
      filteredFaculty = filteredFaculty.filter(faculty => 
        faculty.category === selectedCategory || !faculty.category
      );
    }

    setFilteredUniversityStats(filteredUni);
    setFilteredFacultyStats(filteredFaculty);
    setFilteredCategoryStats(filteredCat);
  };

  // Handle filter changes
  const handleAnalyticsFilterChange = (filterType, value) => {
    switch (filterType) {
      case 'university':
        setSelectedUniversity(value);
        break;
      case 'faculty':
        setSelectedFaculty(value);
        break;
      case 'category':
        setSelectedCategory(value);
        break;
      case 'dateRange':
        setDateRange(value);
        break;
      default:
        break;
    }
  };

  // Handle export report
  const handleExportReport = () => {
    try {
      // Prepare analytics data for export
      const analyticsData = {
        universityStats: filteredUniversityStats.length > 0 ? filteredUniversityStats : universityStats,
        facultyStats: filteredFacultyStats.length > 0 ? filteredFacultyStats : facultyStats,
        categoryStats: filteredCategoryStats.length > 0 ? filteredCategoryStats : categoryStats
      };

      // Prepare filters data
      const filters = {
        dateRange: dateRange,
        university: selectedUniversity,
        faculty: selectedFaculty,
        category: selectedCategory
      };

      // Check if we have data to export
      if (analyticsData.universityStats.length === 0 && 
          analyticsData.facultyStats.length === 0 && 
          analyticsData.categoryStats.length === 0) {
        alert('No data available to export. Please wait for analytics to load or adjust your filters.');
        return;
      }

      // Export the report
      exportToPDF(analyticsData, filters);
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Failed to export report. Please try again.');
    }
  };

  useEffect(() => {
    console.log('🔍 useEffect triggered');
    // Check if admin is logged in of the admin dashboard
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    const adminEmail = localStorage.getItem('adminEmail');
    
    console.log('🔍 isLoggedIn:', isLoggedIn);
    console.log('🔍 adminEmail:', adminEmail);
    
    if (!isLoggedIn || !adminEmail) {
      console.log('🔍 Redirecting to admin login');
      navigate('/admin/login');
      return;
    }
    
    console.log('🔍 Admin is logged in, setting username');
    setAdminUsername(adminEmail); // Use email as username for display of the admin dashboard
    
    fetchUsers(); // Fetch users when component mounts
    fetchAnalytics(); // Fetch analytics when component mounts
  }, [navigate]);

  // Fetch analytics when filters or activeTab changes
  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalytics();
    } else if (activeTab === 'contact') {
      fetchContactMessages();
      fetchContactStats();
    } else if (activeTab === 'resources') {
      fetchResources();
    }
  }, [dateRange, selectedUniversity, selectedFaculty, selectedCategory, activeTab, contactPagination.currentPage, contactFilters]);

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

  // Contact Messages Functions
  const fetchContactMessages = async () => {
    try {
      setContactLoading(true);
      setContactError(null);
      
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        throw new Error('No admin token found');
      }
      
      const queryParams = new URLSearchParams({
        page: contactPagination.currentPage,
        limit: 10,
        ...contactFilters
      });
      
      const response = await fetch(`http://localhost:5000/api/contact/admin/messages?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch contact messages');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setContactMessages(result.data.messages);
        setContactPagination(result.data.pagination);
      } else {
        throw new Error(result.message || 'Failed to fetch contact messages');
      }
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      setContactError(error.message);
    } finally {
      setContactLoading(false);
    }
  };

  const fetchContactStats = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        throw new Error('No admin token found');
      }
      
      const response = await fetch('http://localhost:5000/api/contact/admin/stats', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch contact stats');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setContactStats(result.data);
      }
    } catch (error) {
      console.error('Error fetching contact stats:', error);
    }
  };

  const handleReplyToMessage = async () => {
    if (!replyMessage.trim()) {
      alert('Please enter a reply message');
      return;
    }
    
    try {
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        throw new Error('No admin token found');
      }
      
      const response = await fetch(`http://localhost:5000/api/contact/admin/messages/${selectedMessage._id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          message: replyMessage,
          status: 'replied'
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send reply');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setShowMessageModal(false);
        setReplyMessage('');
        setSelectedMessage(null);
        fetchContactMessages(); // Refresh the messages
        alert('Reply sent successfully!');
      } else {
        throw new Error(result.message || 'Failed to send reply');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply: ' + error.message);
    }
  };



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

        <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-yellow-200 hover:border-yellow-400 transform hover:-translate-y-2">
          <div className="flex items-center justify-between mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-right">
              <span className="text-blue-500 text-sm font-medium">New</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.newMessages || 0}</h3>
          <p className="text-gray-600">New Messages</p>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              <p className="text-sm font-medium text-gray-600">Total Gigs</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalGigs}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-yellow-200 hover:border-yellow-400 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Posts</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalPosts}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
            <button 
              onClick={() => setActiveTab('users')}
              className="text-yellow-600 hover:text-yellow-700 font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {users.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <p className="text-sm">No users found</p>
              </div>
            ) : (
              users.slice(0, 4).map(user => (
              <div key={user._id} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-yellow-200 transition-all duration-200">
                {user.profileImage && user.profileImage.url ? (
                  <img 
                    src={user.profileImage.url} 
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-12 h-12 rounded-full object-cover shadow-lg border-2 border-gray-200 hover:shadow-xl transition-shadow duration-200"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg ${user.profileImage && user.profileImage.url ? 'hidden' : ''}`}>
                  <span className="text-black font-bold text-sm">
                    {user.firstName ? user.firstName.charAt(0) : 'U'}
                    {user.lastName ? user.lastName.charAt(0) : ''}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full border ${
                      user.isVerified 
                        ? 'bg-green-50/40 text-green-700 border-green-200' 
                        : 'bg-yellow-50/40 text-yellow-700 border-yellow-200'
                    }`}>
                      {user.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">
                      {user.userType === 'freelancer' ? 'Freelancer' : 
                       user.userType === 'client' ? 'Client' : 'University Staff'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Posts and Gigs Section */}
        <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-yellow-200 hover:border-yellow-400">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Recent Posts and Gigs</h3>
            <button 
              onClick={() => setActiveTab('services')}
              className="text-yellow-600 hover:text-yellow-700 font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {pendingServices.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <p className="text-sm">No posts or gigs found</p>
              </div>
            ) : (
              pendingServices.slice(0, 4).map(service => (
                <div key={service._id} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-yellow-200 transition-all duration-200">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                    service.type === 'gig' 
                      ? 'bg-gradient-to-br from-blue-400 to-blue-500' 
                      : 'bg-gradient-to-br from-green-400 to-green-500'
                  }`}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {service.type === 'gig' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      )}
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 line-clamp-1">
                      {service.title}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-1">{service.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full border ${
                        service.type === 'gig'
                          ? 'bg-blue-50/40 text-blue-700 border-blue-200'
                          : 'bg-green-50/40 text-green-700 border-green-200'
                      }`}>
                        {service.type === 'gig' ? 'Gig' : 'Post'}
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full border ${
                        service.status === 'pending'
                          ? 'bg-yellow-50/40 text-yellow-700 border-yellow-200'
                          : service.status === 'approved'
                          ? 'bg-green-50/40 text-green-700 border-green-200'
                          : 'bg-red-50/40 text-red-700 border-red-200'
                      }`}>
                        {service.status === 'pending' ? 'Pending' :
                         service.status === 'approved' ? 'Approved' : 'Rejected'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {new Date(service.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      ${service.price || service.budget}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>


      </div>
    </div>
  );

  const renderPostsApproval = () => (
    <div className="space-y-6">
      {/* Posts Approval Header */}
      <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-yellow-200 hover:border-yellow-400">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Posts Approval</h3>
            <p className="text-gray-600 mt-1">Review and approve/reject client job posts before they appear in services</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
              {pendingPosts.length} Pending Posts
            </span>
            <button 
              onClick={fetchPendingPosts}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Loading and Error States */}
        {postsLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading pending posts...</p>
          </div>
        )}

        {postsError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-800">Error: {postsError}</p>
          </div>
        )}

        {/* Posts Table */}
        {!postsLoading && !postsError && (
          <div className="overflow-x-auto">
            {pendingPosts.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Posts</h3>
                <p className="text-gray-600">All client posts have been reviewed.</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingPosts.map(post => (
                    <tr key={post._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{post.title}</div>
                          <div className="text-sm text-gray-500 mt-1 line-clamp-2">{post.description}</div>
                          <div className="text-xs text-gray-400 mt-2">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{post.type}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{post.clientName}</div>
                        <div className="text-sm text-gray-500">{post.clientOrganization}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${post.budget}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(post.deadline).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => approvePost(post._id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors duration-200"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => {
                              const reason = prompt('Please provide a reason for rejection:');
                              if (reason) rejectPost(post._id, reason);
                            }}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors duration-200"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
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
              {userStats.total} Total Users
            </span>
          </div>
        </div>

        {/* User Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{userStats.freelancers}</div>
            <div className="text-sm text-blue-800">Freelancers</div>
          </div>
          <div className="bg-green-50 p-4 rounded-xl border border-green-200">
            <div className="text-2xl font-bold text-green-600">{userStats.clients}</div>
            <div className="text-sm text-green-800">Clients</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">{userStats.universityStaff}</div>
            <div className="text-sm text-purple-800">Staff</div>
          </div>
          <div className="bg-green-50 p-4 rounded-xl border border-green-200">
            <div className="text-2xl font-bold text-green-600">{userStats.active}</div>
            <div className="text-sm text-green-800">Active</div>
          </div>
          <div className="bg-red-50 p-4 rounded-xl border border-red-200">
            <div className="text-2xl font-bold text-red-600">{userStats.suspended}</div>
            <div className="text-sm text-red-800">Suspended</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="text-2xl font-bold text-gray-600">{userPagination.totalUsers}</div>
            <div className="text-sm text-gray-800">Total</div>
          </div>
        </div>

        {/* User Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <select 
            value={userFilters.userType}
            onChange={(e) => handleUserFilterChange('userType', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
          >
            <option value="all">All Types</option>
            <option value="freelancer">Freelancer</option>
            <option value="client">Client</option>
            <option value="universityStaff">University Staff</option>
          </select>
          <select 
            value={userFilters.status}
            onChange={(e) => handleUserFilterChange('status', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
          <input
            type="text"
            placeholder="Search users..."
            value={userFilters.search}
            onChange={(e) => handleUserSearch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
          />
        </div>

        {/* Enhanced User Table */}
        <div className="overflow-x-auto">
          {userLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
              <span className="ml-3 text-gray-600">Loading users...</span>
            </div>
          ) : (
            <>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institution</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                          <p className="text-lg font-medium">No users found</p>
                          <p className="text-sm">Try adjusting your filters or search terms</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    users.map(user => (
                    <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.profileImage && user.profileImage.url ? (
                        <img 
                          src={user.profileImage.url} 
                          alt={`${user.firstName} ${user.lastName}`}
                          className="w-10 h-10 rounded-full object-cover mr-3 border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                          loading="lazy"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className={`w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mr-3 ${user.profileImage && user.profileImage.url ? 'hidden' : ''}`}>
                            <span className="text-black font-bold text-sm">
                              {user.firstName ? user.firstName.charAt(0) : 'U'}
                              {user.lastName ? user.lastName.charAt(0) : ''}
                            </span>
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
                          {user.userType === 'freelancer' ? 'Freelancer' : 
                           user.userType === 'client' ? 'Client' : 'University Staff'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                          {user.status === 'active' ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.userType === 'freelancer' 
                          ? (user.university || 'Not specified')
                          : user.userType === 'client'
                          ? (user.organization || 'Not specified')
                          : user.userType === 'universityStaff'
                          ? (user.department || 'Not specified')
                          : 'N/A'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleViewUser(user)}
                            className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50"
                          >
                            View
                          </button>
                          {user.status === 'active' ? (
                            <button 
                              onClick={() => handleUserAction(user._id, 'suspend')}
                              className="text-orange-600 hover:text-orange-900 px-2 py-1 rounded hover:bg-orange-50"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleUserAction(user._id, 'activate')}
                              className="text-green-600 hover:text-green-900 px-2 py-1 rounded hover:bg-green-50"
                            >
                              Activate
                            </button>
                          )}
                          <button 
                            onClick={() => handleUserAction(user._id, 'delete')}
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
              
              {/* Pagination */}
              {userPagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-700">
                    Showing page {userPagination.currentPage} of {userPagination.totalPages} 
                    ({userPagination.totalUsers} total users)
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUserPageChange(userPagination.currentPage - 1)}
                      disabled={!userPagination.hasPrevPage}
                      className={`px-3 py-2 text-sm font-medium rounded-lg ${
                        userPagination.hasPrevPage
                          ? 'bg-yellow-500 text-black hover:bg-yellow-600'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Previous
              </button>
                    <button
                      onClick={() => handleUserPageChange(userPagination.currentPage + 1)}
                      disabled={!userPagination.hasNextPage}
                      className={`px-3 py-2 text-sm font-medium rounded-lg ${
                        userPagination.hasNextPage
                          ? 'bg-yellow-500 text-black hover:bg-yellow-600'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Next
              </button>
            </div>
          </div>
              )}
            </>
          )}
            </div>
          </div>


    </div>
  );



  const renderServices = () => {
    // Separate gigs and posts
    const gigs = pendingServices.filter(service => service.type === 'gig');
    const posts = pendingServices.filter(service => service.type === 'job');

    return (
      <div className="space-y-8">
        {/* Header */}
    <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-yellow-200 hover:border-yellow-400">
          <div className="flex justify-between items-center mb-6">
        <div>
              <h3 className="text-2xl font-bold text-gray-900">Services Management</h3>
              <p className="text-gray-600 mt-1">Manage freelancer gigs and client job posts</p>
        </div>
        <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <span className="bg-gradient-to-r from-blue-400 to-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
                  {gigs.length} Gigs
                </span>
          <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
                  {posts.length} Posts
          </span>
              </div>
          <button 
                onClick={fetchAllServices}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
          >
                Refresh All
          </button>
        </div>
      </div>

      {/* Loading and Error States */}
      {servicesLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading all services...</p>
        </div>
      )}

      {servicesError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-red-800">Error: {servicesError}</p>
        </div>
      )}
        </div>

        {/* Freelancer Gigs Section */}
        <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-blue-200 hover:border-blue-400">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                  </div>
                  <div>
                <h4 className="text-xl font-bold text-gray-900">Freelancer Gigs</h4>
                <p className="text-gray-600 text-sm">Services offered by freelancers</p>
                    </div>
                  </div>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {gigs.filter(gig => gig.status === 'pending').length} Pending
            </span>
                </div>

          <div className="space-y-4">
            {!servicesLoading && !servicesError && gigs.length > 0 ? (
              gigs.map(gig => (
                <div key={gig._id} className="bg-gradient-to-r from-blue-50 to-white rounded-xl p-4 border border-blue-200 hover:border-blue-300 hover:shadow-md transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h5 className="text-lg font-semibold text-gray-900">{gig.title}</h5>
                        <span className="text-blue-600 font-medium">${gig.price}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          gig.status === 'pending' 
                            ? 'bg-orange-100 text-orange-800' 
                            : gig.status === 'approved' || gig.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {gig.status === 'pending' ? 'Pending' : 
                           gig.status === 'approved' || gig.status === 'active' ? 'Active' : 
                           gig.status === 'rejected' ? 'Rejected' : gig.status}
                        </span>
                  </div>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{gig.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>By: {gig.freelancer}</span>
                        <span>Category: {gig.category}</span>
                        <span>Posted: {new Date(gig.createdAt).toLocaleDateString()}</span>
                  </div>
                  </div>
                  </div>
                  <div className="flex space-x-2">
                    {gig.status === 'pending' && (
              <button 
                        onClick={() => deleteGig(gig)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                        Delete
              </button>
                    )}
              <button 
                      onClick={() => viewServiceDetails(gig)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                      View Details
              </button>
            </div>
          </div>
              ))
            ) : !servicesLoading && !servicesError && gigs.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
            </div>
                <h5 className="text-lg font-semibold text-gray-900 mb-2">No gigs available</h5>
                <p className="text-gray-600 text-sm">No freelancer gigs have been created yet.</p>
          </div>
            ) : null}
      </div>
    </div>

        {/* Client Posts Section */}
      <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-yellow-200 hover:border-yellow-400">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
          </div>
                      <div>
                <h4 className="text-xl font-bold text-gray-900">Client Job Posts</h4>
                <p className="text-gray-600 text-sm">Job opportunities posted by clients</p>
                      </div>
                    </div>
            <span className="bg-transparent text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
              {posts.filter(post => post.status === 'pending').length} Pending
                    </span>
                      </div>

          <div className="space-y-4">
            {!servicesLoading && !servicesError && posts.length > 0 ? (
              posts.map(post => (
                <div key={post._id} className="bg-gradient-to-r from-yellow-50 to-white rounded-xl p-4 border border-yellow-200 hover:border-yellow-300 hover:shadow-md transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h5 className="text-lg font-semibold text-gray-900">{post.title}</h5>
                        <span className="text-yellow-600 font-medium">${post.budget}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          post.status === 'pending' 
                            ? 'bg-transparent text-orange-800' 
                            : post.status === 'approved' || post.status === 'active'
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                          {post.status === 'pending' ? 'Pending' : 
                           post.status === 'approved' || post.status === 'active' ? 'Active' : 
                           post.status === 'rejected' ? 'Rejected' : post.status}
                    </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{post.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>By: {post.clientName}</span>
                        <span>Category: {post.category}</span>
                        <span>Posted: {new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                    <div className="flex space-x-2">
                    {post.status === 'pending' && (
                        <>
                          <button
                          onClick={() => approveService(post)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                          >
                          Approve
                          </button>
                          <button
                          onClick={() => rejectService(post)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                          >
                          Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => deletePost(post)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        Delete
                      </button>
          <button
                      onClick={() => viewServiceDetails(post)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
                      View Details
          </button>
        </div>
              </div>
              ))
            ) : !servicesLoading && !servicesError && posts.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
                <h5 className="text-lg font-semibold text-gray-900 mb-2">No job posts available</h5>
                <p className="text-gray-600 text-sm">No client job posts have been created yet.</p>
            </div>
            ) : null}
          </div>
              </div>
              </div>
    );
  };

  const renderOrders = () => (
    <div className="space-y-8">
      {/* Orders Header */}
      <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-yellow-200 hover:border-yellow-400">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Orders Management</h3>
            <p className="text-gray-600 mt-1">Monitor and manage all platform orders</p>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={fetchOrders}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300"
            >
              Refresh Orders
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <select
            value={orderFilters.status}
            onChange={(e) => handleOrderFilterChange('status', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Payment Confirmed">Payment Confirmed</option>
            <option value="In Progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Revision">Revision</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          
          <input
            type="text"
            placeholder="Search orders..."
            value={orderFilters.search}
            onChange={(e) => handleOrderFilterChange('search', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
          />
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600">No orders match your current filters.</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Current Orders</h3>
            <div className="space-y-4">
              {orders.filter(o => !Boolean(o?.paymentDetails?.paidAt)).map((order) => (
                <div key={order._id} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-gray-200 hover:border-yellow-400">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {order.serviceId?.title || 'Service Title'}
                        </h4>
                      </div>
                      {/* Status Display */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                          order.paymentStatus === 'Pending' ? 'bg-yellow-50/40 text-yellow-700 border-yellow-200' :
                          order.paymentStatus === 'Paid' ? 'bg-green-50/40 text-green-700 border-green-200' :
                          order.paymentStatus === 'Failed' ? 'bg-red-50/40 text-red-700 border-red-200' :
                          order.paymentStatus === 'Refunded' ? 'bg-gray-50/40 text-gray-700 border-gray-200' :
                          'bg-gray-50/40 text-gray-700 border-gray-200'
                        }`}>
                          Buyer: {order.paymentStatus === 'Paid' ? 'Paid' : 'Not Paid'}
                        </span>
                        {(() => {
                          const hasAdminPayout = Boolean(order?.paymentDetails?.paidAt);
                          const freelancerPaymentStatus = hasAdminPayout ? 'Paid' : 'Pending';
                            const badgeClass =
                            freelancerPaymentStatus === 'Pending' ? 'bg-yellow-50/40 text-yellow-700 border-yellow-200' :
                            freelancerPaymentStatus === 'Paid' ? 'bg-green-50/40 text-green-700 border-green-200' :
                            'bg-gray-50/40 text-gray-700 border-gray-200';
                          return (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${badgeClass}`}>
                              Freelancer Payment: {freelancerPaymentStatus}
                            </span>
                          );
                        })()}
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                          order.clientStatus === 'Pending' ? 'bg-yellow-50/40 text-yellow-700 border-yellow-200' :
                          order.clientStatus === 'Delivered' ? 'bg-green-50/40 text-green-700 border-green-200' :
                          order.clientStatus === 'Completed' ? 'bg-blue-50/40 text-blue-700 border-blue-200' :
                          'bg-gray-50/40 text-gray-700 border-gray-200'
                        }`}>
                          Client: {order.clientStatus || 'Pending'}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                          order.freelancerStatus === 'Pending' ? 'bg-yellow-50/40 text-yellow-700 border-yellow-200' :
                          order.freelancerStatus === 'In Progress' ? 'bg-purple-50/40 text-purple-700 border-purple-200' :
                          order.freelancerStatus === 'Completed' ? 'bg-green-50/40 text-green-700 border-green-200' :
                          'bg-gray-50/40 text-gray-700 border-gray-200'
                        }`}>
                          Freelancer: {order.freelancerStatus || 'Pending'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <p><strong>Client:</strong> {order.clientId?.firstName} {order.clientId?.lastName}</p>
                          <p><strong>Freelancer:</strong> {order.freelancerId?.firstName} {order.freelancerId?.lastName}</p>
                          <p><strong>Package:</strong> {order.packageDetails?.name}</p>
                        </div>
                        <div>
                          <p><strong>Amount:</strong> ${order.totalAmount}</p>
                          <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                          <p><strong>Deadline:</strong> {new Date(order.deadline).toLocaleDateString()}</p>
                        </div>
                      </div>
                      {order.requirements && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-700">
                            <strong>Requirements:</strong> {order.requirements}
                          </p>
                        </div>
                      )}
                      {/* Action Buttons */}
                      <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-200">
                        {order.clientStatus === 'Delivered' && order.freelancerStatus === 'Completed' && !Boolean(order?.paymentDetails?.paidAt) && (
                          <button
                            onClick={() => handleSendMoneyToFreelancer(order._id, order.totalAmount)}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                          >
                            Send Money to Freelancer (10% fee)
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {orders.filter(o => !Boolean(o?.paymentDetails?.paidAt)).length === 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-600">No current orders</div>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Past Orders</h3>
            <div className="space-y-4">
              {orders.filter(o => Boolean(o?.paymentDetails?.paidAt)).map((order) => (
                <div key={order._id} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {order.serviceId?.title || 'Service Title'}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium border bg-green-50/40 text-green-700 border-green-200">Freelancer Payment: Paid</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <p><strong>Client:</strong> {order.clientId?.firstName} {order.clientId?.lastName}</p>
                          <p><strong>Freelancer:</strong> {order.freelancerId?.firstName} {order.freelancerId?.lastName}</p>
                          <p><strong>Package:</strong> {order.packageDetails?.name}</p>
                        </div>
                        <div>
                          <p><strong>Amount:</strong> ${order.totalAmount}</p>
                          <p><strong>Paid To Freelancer:</strong> ${order?.paymentDetails?.freelancerAmount ?? 0}</p>
                          <p><strong>Paid At:</strong> {order?.paymentDetails?.paidAt ? new Date(order.paymentDetails.paidAt).toLocaleString() : '-'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {orders.filter(o => Boolean(o?.paymentDetails?.paidAt)).length === 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-600">No past orders</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderContactMessages = () => (
    <div className="space-y-8">
      {/* Contact Messages Header */}
      <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-yellow-200 hover:border-yellow-400">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Contact Messages</h3>
            <p className="text-gray-600 mt-1">Manage and respond to user inquiries</p>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => {
                setContactFilters({ status: '', priority: '', category: '' });
                setContactPagination(prev => ({ ...prev, currentPage: 1 }));
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Messages</p>
                <p className="text-2xl font-bold">{contactStats.total || 0}</p>
              </div>
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">New Messages</p>
                <p className="text-2xl font-bold">{contactStats.new || 0}</p>
              </div>
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Replied</p>
                <p className="text-2xl font-bold">{contactStats.replied || 0}</p>
              </div>
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <select
            value={contactFilters.status}
            onChange={(e) => setContactFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="in-progress">In Progress</option>
            <option value="replied">Replied</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          
          <select
            value={contactFilters.priority}
            onChange={(e) => setContactFilters(prev => ({ ...prev, priority: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          
          <select
            value={contactFilters.category}
            onChange={(e) => setContactFilters(prev => ({ ...prev, category: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
          >
            <option value="">All Categories</option>
            <option value="General Inquiry">General Inquiry</option>
            <option value="Technical Support">Technical Support</option>
            <option value="Account Issues">Account Issues</option>
            <option value="Payment Problems">Payment Problems</option>
            <option value="Report a Bug">Report a Bug</option>
            <option value="Feature Request">Feature Request</option>
            <option value="Partnership">Partnership</option>
            <option value="Media Inquiry">Media Inquiry</option>
            <option value="Legal Issues">Legal Issues</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Error Message */}
        {contactError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{contactError}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contact Messages List */}
      {contactLoading ? (
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contact messages...</p>
        </div>
      ) : contactMessages.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No contact messages found</h3>
          <p className="text-gray-600">No messages match your current filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contactMessages.map((message) => (
            <div key={message._id} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-gray-200 hover:border-yellow-400">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{message.subject}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      message.status === 'new' ? 'bg-yellow-100 text-yellow-800' :
                      message.status === 'replied' ? 'bg-blue-100 text-blue-800' :
                      message.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      message.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      message.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                      message.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      message.priority === 'normal' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {message.priority.charAt(0).toUpperCase() + message.priority.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span><strong>From:</strong> {message.name} ({message.email})</span>
                    <span><strong>Category:</strong> {message.category}</span>
                    <span><strong>Date:</strong> {new Date(message.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-700 mb-4 line-clamp-2">{message.message}</p>
                  
                  {/* Conversation Thread */}
                  {message.replies && message.replies.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {message.replies.map((reply, replyIndex) => (
                        <div key={replyIndex} className={`rounded-lg p-4 ${
                          reply.senderType === 'admin' 
                            ? 'bg-yellow-50/40 border border-yellow-200' 
                            : 'bg-blue-50/40 border border-blue-200'
                        }`}>
                          <div className="flex items-center space-x-2 mb-2">
                            <svg className={`w-4 h-4 ${
                              reply.senderType === 'admin' ? 'text-yellow-600' : 'text-blue-600'
                            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                            <span className={`text-sm font-medium ${
                              reply.senderType === 'admin' ? 'text-yellow-700' : 'text-blue-700'
                            }`}>
                              {reply.senderType === 'admin' ? 'Admin' : 'User'}
                            </span>
                            <span className={`text-xs ${
                              reply.senderType === 'admin' ? 'text-yellow-600' : 'text-blue-600'
                            }`}>
                              {new Date(reply.repliedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className={`whitespace-pre-wrap ${
                            reply.senderType === 'admin' ? 'text-yellow-800' : 'text-blue-800'
                          }`}>
                            {reply.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Legacy admin reply display for backward compatibility */}
                  {message.adminReply && (!message.replies || message.replies.length === 0) && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">Admin Reply</span>
                        <span className="text-xs text-gray-500">
                          {new Date(message.adminReply.repliedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{message.adminReply.message}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => {
                      setSelectedMessage(message);
                      setShowMessageModal(true);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    {message.adminReply || (message.replies && message.replies.length > 0) ? 'View & Reply' : 'Reply'}
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {/* Pagination */}
          {contactPagination.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-8">
              <button
                onClick={() => setContactPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                disabled={!contactPagination.hasPrevPage}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              <span className="px-4 py-2 text-gray-700">
                Page {contactPagination.currentPage} of {contactPagination.totalPages}
              </span>
              
              <button
                onClick={() => setContactPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                disabled={!contactPagination.hasNextPage}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
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
              onChange={(e) => handleAnalyticsFilterChange('dateRange', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
            <button 
              onClick={() => handleExportReport()}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <select
            value={selectedUniversity}
            onChange={(e) => handleAnalyticsFilterChange('university', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
          >
            <option value="all">All Universities</option>
            {universityStats.map(uni => (
              <option key={uni.name} value={uni.name}>{uni.name}</option>
            ))}
          </select>
          <select
            value={selectedFaculty}
            onChange={(e) => handleAnalyticsFilterChange('faculty', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
          >
            <option value="all">All Faculties</option>
            {facultyStats.map(faculty => (
              <option key={faculty.name} value={faculty.name}>{faculty.name}</option>
            ))}
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => handleAnalyticsFilterChange('category', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
          >
            <option value="all">All Categories</option>
            {categoryStats.map(cat => (
              <option key={cat.name} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Error Message */}
        {analyticsError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{analyticsError}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Analytics Summary Cards */}
      {!analyticsLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Total Universities</p>
                <p className="text-3xl font-bold">{universityStats.length}</p>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Faculties</p>
                <p className="text-3xl font-bold">{facultyStats.length}</p>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Categories</p>
                <p className="text-3xl font-bold">{categoryStats.length}</p>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold">
                  ${categoryStats.reduce((sum, cat) => sum + (cat.revenue || 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* University Performance */}
      <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-yellow-200 hover:border-yellow-400">
        <h3 className="text-xl font-bold text-gray-900 mb-6">University Performance</h3>
        
        {/* University Performance Chart */}
        {!analyticsLoading && filteredUniversityStats.length > 0 && (
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Revenue by University</h4>
            <div className="space-y-3">
              {filteredUniversityStats.slice(0, 5).map((uni, index) => {
                const maxRevenue = Math.max(...filteredUniversityStats.map(u => u.revenue));
                const percentage = maxRevenue > 0 ? (uni.revenue / maxRevenue) * 100 : 0;
                return (
                  <div key={uni.name} className="flex items-center space-x-4">
                    <div className="w-32 text-sm font-medium text-gray-700 truncate">{uni.name}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-transparent h-4 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%`, border: '1px solid rgba(250, 204, 21, 0.45)' }}
                      ></div>
                    </div>
                    <div className="w-20 text-sm font-medium text-gray-900">${uni.revenue.toLocaleString()}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          {analyticsLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
              <span className="ml-2 text-gray-600">Loading university data...</span>
            </div>
          ) : filteredUniversityStats.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No university data</h3>
              <p className="mt-1 text-sm text-gray-500">No university performance data available for the selected time period.</p>
            </div>
          ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Users</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {filteredUniversityStats.map(uni => (
                <tr key={uni.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{uni.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{uni.users.toLocaleString()}</td>
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
          )}
        </div>
      </div>

      {/* Faculty Performance */}
      <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-yellow-200 hover:border-yellow-400">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Faculty Performance</h3>
        
        {/* Faculty Performance Chart */}
        {!analyticsLoading && filteredFacultyStats.length > 0 && (
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Users by Faculty</h4>
            <div className="space-y-3">
              {filteredFacultyStats.slice(0, 5).map((faculty, index) => {
                const maxUsers = Math.max(...filteredFacultyStats.map(f => f.users));
                const percentage = maxUsers > 0 ? (faculty.users / maxUsers) * 100 : 0;
                return (
                  <div key={faculty.name} className="flex items-center space-x-4">
                    <div className="w-32 text-sm font-medium text-gray-700 truncate">{faculty.name}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="w-20 text-sm font-medium text-gray-900">{faculty.users.toLocaleString()}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          {analyticsLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
              <span className="ml-2 text-gray-600">Loading faculty data...</span>
            </div>
          ) : filteredFacultyStats.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No faculty data</h3>
              <p className="mt-1 text-sm text-gray-500">No faculty performance data available for the selected time period.</p>
            </div>
          ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faculty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {filteredFacultyStats.map(faculty => (
                <tr key={faculty.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{faculty.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{faculty.users.toLocaleString()}</td>
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
          )}
        </div>
      </div>

      {/* Category Performance */}
      <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-yellow-200 hover:border-yellow-400">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Category Performance</h3>
        
        {/* Category Performance Chart */}
        {!analyticsLoading && filteredCategoryStats.length > 0 && (
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Success Rate by Category</h4>
            <div className="space-y-3">
              {filteredCategoryStats.slice(0, 5).map((cat, index) => {
                return (
                  <div key={cat.name} className="flex items-center space-x-4">
                    <div className="w-32 text-sm font-medium text-gray-700 truncate">{cat.name}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                      <div 
                        className={`h-4 rounded-full transition-all duration-500 ${
                          cat.successRate > 90 ? 'bg-green-500' : 
                          cat.successRate > 80 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${cat.successRate}%` }}
                      ></div>
                    </div>
                    <div className="w-20 text-sm font-medium text-gray-900">{cat.successRate}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          {analyticsLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
              <span className="ml-2 text-gray-600">Loading category data...</span>
            </div>
          ) : filteredCategoryStats.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No category data</h3>
              <p className="mt-1 text-sm text-gray-500">No category performance data available for the selected time period.</p>
            </div>
          ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Success Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Budget</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategoryStats.map(cat => (
                <tr key={cat.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{cat.name}</div>
                  </td>
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
          )}
        </div>
      </div>
    </div>
  );

  const renderResources = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-yellow-200 hover:border-yellow-400">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Resources Management</h3>
            <p className="text-gray-600 mt-1">Create and manage platform-wide learning resources</p>
          </div>
          <button onClick={() => setShowAddResourceModal(true)} className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            <span>Add Resource</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Resources</p>
                <p className="text-3xl font-bold">{resources.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
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
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.784.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
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
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
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
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-yellow-200 hover:border-yellow-400">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="text-xl font-bold text-gray-900">All Resources</h4>
            {(resourceSearchTerm || resourceCategory || resourceDifficulty) && (
              <p className="text-sm text-gray-600 mt-1">Showing {filteredResources.length} of {resources.length} resources</p>
            )}
          </div>
          <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <input type="text" placeholder="Search resources..." value={resourceSearchTerm} onChange={(e) => setResourceSearchTerm(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500 min-w-[200px]" />
              <select value={resourceCategory} onChange={(e) => setResourceCategory(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500">
                <option value="">All Categories</option>
                {resourceCategories.map(category => (<option key={category} value={category}>{category}</option>))}
              </select>
              <select value={resourceDifficulty} onChange={(e) => setResourceDifficulty(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500">
                <option value="">All Difficulties</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            {(resourceSearchTerm || resourceCategory || resourceDifficulty) && (
              <button onClick={() => { setResourceSearchTerm(''); setResourceCategory(''); setResourceDifficulty(''); }} className="px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors duration-200">Clear Filters</button>
            )}
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
                <tr key={resource._id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{resource.title}</div>
                      <div className="text-sm text-gray-500">{resource.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{resource.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resource.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${resource.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' : resource.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{resource.difficulty}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resource.readTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{resource.featured ? (<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-transparent text-yellow-800">Featured</span>) : (<span className="text-gray-400">-</span>)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {resource.createdBy ? (
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-xs">{(() => {
                            const fullName = resource.createdBy.name || ((resource.createdBy.firstName && resource.createdBy.lastName) ? `${resource.createdBy.firstName} ${resource.createdBy.lastName}` : '');
                            return fullName ? fullName.split(' ').map(n => n[0]).join('') : 'U';
                          })()}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{resource.createdBy.name || ((resource.createdBy.firstName && resource.createdBy.lastName) ? `${resource.createdBy.firstName} ${resource.createdBy.lastName}` : 'Unknown')}</div>
                          <div className="text-xs text-gray-500">{resource.createdBy.userType || 'User'}</div>
                        </div>
                      </div>
                    ) : (<span className="text-gray-400">Unknown</span>)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button onClick={() => handleEditResource(resource)} className="text-blue-600 hover:text-blue-900 font-medium transition-colors duration-200">Edit</button>
                      <button onClick={() => handleViewResource(resource)} className="text-gray-700 hover:text-black font-medium transition-colors duration-200">View</button>
                      <button onClick={() => handlePermanentDeleteResource(resource._id)} className="text-red-600 hover:text-red-900 font-medium transition-colors duration-200">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{resources.length === 0 ? 'No resources yet' : 'No resources found'}</h3>
              <p className="text-gray-600 max-w-md mx-auto">{resources.length === 0 ? 'Start by adding the first resource for the platform.' : 'Try adjusting your search terms or filters.'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Resource Modal */}
      {showAddResourceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Add New Resource</h3>
              <button onClick={() => setShowAddResourceModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors duration-200"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <form onSubmit={handleAddResource} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input type="text" value={newResource.title} onChange={(e) => setNewResource({...newResource, title: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea value={newResource.description} onChange={(e) => setNewResource({...newResource, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500" rows="3" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select value={newResource.category} onChange={(e) => setNewResource({...newResource, category: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500" required>
                    <option value="">Select a category</option>
                    {resourceCategories.map(c => (<option key={c} value={c}>{c}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select value={newResource.type} onChange={(e) => setNewResource({...newResource, type: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500" required>
                    <option value="">Select a type</option>
                    {resourceTypes.map(t => (<option key={t} value={t}>{t}</option>))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Read Time</label>
                  <input type="text" value={newResource.readTime} onChange={(e) => setNewResource({...newResource, readTime: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500" placeholder="e.g., 15 min" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <select value={newResource.difficulty} onChange={(e) => setNewResource({...newResource, difficulty: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500" required>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Link</label>
                  <input type="url" value={newResource.link} onChange={(e) => setNewResource({...newResource, link: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500" placeholder="https://example.com/resource" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <input type="text" value={newResource.tags} onChange={(e) => setNewResource({...newResource, tags: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500" placeholder="e.g., freelancing, career, beginners (comma separated)" required />
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="featured" checked={newResource.featured} onChange={(e) => setNewResource({...newResource, featured: e.target.checked})} className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded" />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">Mark as featured resource</label>
              </div>
              <div className="flex space-x-4 pt-4">
                <button type="submit" className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl">Add Resource</button>
                <button type="button" onClick={() => setShowAddResourceModal(false)} className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl">Cancel</button>
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
              <button onClick={() => { setShowEditResourceModal(false); setSelectedResource(null); }} className="text-gray-400 hover:text-gray-600 transition-colors duration-200"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <form onSubmit={handleUpdateResource} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input type="text" value={selectedResource.title} onChange={(e) => setSelectedResource({...selectedResource, title: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea value={selectedResource.description} onChange={(e) => setSelectedResource({...selectedResource, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500" rows="3" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select value={selectedResource.category} onChange={(e) => setSelectedResource({...selectedResource, category: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500" required>
                    <option value="">Select a category</option>
                    {resourceCategories.map(c => (<option key={c} value={c}>{c}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select value={selectedResource.type} onChange={(e) => setSelectedResource({...selectedResource, type: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500" required>
                    <option value="">Select a type</option>
                    {resourceTypes.map(t => (<option key={t} value={t}>{t}</option>))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Read Time</label>
                  <input type="text" value={selectedResource.readTime} onChange={(e) => setSelectedResource({...selectedResource, readTime: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500" placeholder="e.g., 15 min" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <select value={selectedResource.difficulty} onChange={(e) => setSelectedResource({...selectedResource, difficulty: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500" required>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Link</label>
                  <input type="url" value={selectedResource.link} onChange={(e) => setSelectedResource({...selectedResource, link: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500" placeholder="https://example.com/resource" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <input type="text" value={selectedResource.tags ? (Array.isArray(selectedResource.tags) ? selectedResource.tags.join(', ') : selectedResource.tags) : ''} onChange={(e) => setSelectedResource({...selectedResource, tags: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500" placeholder="e.g., freelancing, career, beginners (comma separated)" required />
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="edit-featured" checked={!!selectedResource.featured} onChange={(e) => setSelectedResource({...selectedResource, featured: e.target.checked})} className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded" />
                <label htmlFor="edit-featured" className="ml-2 block text-sm text-gray-900">Mark as featured resource</label>
              </div>
              <div className="flex space-x-4 pt-4">
                <button type="submit" className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl">Update Resource</button>
                <button type="button" onClick={() => { setShowEditResourceModal(false); setSelectedResource(null); }} className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* View Resource Modal */}
      {showViewResourceModal && selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Resource Details</h3>
              <button onClick={() => { setShowViewResourceModal(false); setSelectedResource(null); }} className="text-gray-400 hover:text-gray-600 transition-colors duration-200"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Title</p>
                <p className="text-lg font-semibold text-gray-900">{selectedResource.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="text-gray-800 whitespace-pre-line">{selectedResource.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{selectedResource.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium">{selectedResource.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Difficulty</p>
                  <p className="font-medium">{selectedResource.difficulty}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Read Time</p>
                  <p className="font-medium">{selectedResource.readTime}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(selectedResource.tags) ? selectedResource.tags : (selectedResource.tags || '').split(',').map(t => t.trim()).filter(Boolean)).map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700">{tag}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Link</p>
                {selectedResource.link ? (
                  <a href={selectedResource.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-words">{selectedResource.link}</a>
                ) : (
                  <p className="text-gray-400">-</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">Featured</p>
                <p className="font-medium">{selectedResource.featured ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created By</p>
                {selectedResource.createdBy ? (
                  <p className="font-medium">{selectedResource.createdBy.name || ((selectedResource.createdBy.firstName && selectedResource.createdBy.lastName) ? `${selectedResource.createdBy.firstName} ${selectedResource.createdBy.lastName}` : 'Unknown')}</p>
                ) : (
                  <p className="text-gray-400">Unknown</p>
                )}
              </div>
              <div className="pt-4">
                <button onClick={() => { setShowViewResourceModal(false); setSelectedResource(null); }} className="w-full bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-medium transition-all duration-300">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
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
                { id: "services", name: "Services", icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" },
                { id: "orders", name: "Orders", icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" },
                { id: "posts", name: "Posts Approval", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
                { id: "resources", name: "Resources", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
                { id: "contact", name: "Contact Messages", icon: "M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
                { id: "analytics", name: "Analytics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }
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
            {activeTab === "services" && renderServices()}
            {activeTab === "orders" && renderOrders()}
            {activeTab === "posts" && renderPostsApproval()}
            {activeTab === "resources" && renderResources()}
            {activeTab === "contact" && renderContactMessages()}
            {activeTab === "analytics" && renderAnalytics()}
          </div>
        </div>
      </div>





      {/* User Details Modal */}
      {showUserDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">User Details</h3>
              <button
                onClick={() => setShowUserDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* User Profile Section */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center space-x-4 mb-4">
                  {selectedUser.profileImage && selectedUser.profileImage.url ? (
                    <img 
                      src={selectedUser.profileImage.url} 
                      alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                      className="w-30 h-30 rounded-full object-cover border-4 border-white shadow-lg hover:shadow-xl transition-shadow duration-200"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center text-white text-3xl font-bold ${selectedUser.profileImage && selectedUser.profileImage.url ? 'hidden' : ''}`}>
                    {selectedUser.firstName?.charAt(0) || selectedUser.username?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </h4>
                    <p className="text-gray-600">@{selectedUser.username}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      selectedUser.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedUser.status === 'active' ? 'Active' : 'Suspended'}
                    </span>
                  </div>
                </div>
              </div>

              {/* User Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{selectedUser.email}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      {selectedUser.phone || 'Not provided'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">User Type</label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg capitalize">
                      {selectedUser.userType === 'freelancer' ? 'Freelancer' : 
                       selectedUser.userType === 'client' ? 'Client' : 
                       selectedUser.userType === 'universityStaff' ? 'University Staff' : 
                       selectedUser.userType}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {selectedUser.userType === 'freelancer' ? 'University' : 
                       selectedUser.userType === 'client' ? 'Organization' : 
                       selectedUser.userType === 'universityStaff' ? 'Department' : 'Institution'}
                    </label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      {selectedUser.userType === 'freelancer' 
                        ? (selectedUser.university || 'Not specified')
                        : selectedUser.userType === 'client'
                        ? (selectedUser.organization || 'Not specified')
                        : selectedUser.userType === 'universityStaff'
                        ? (selectedUser.department || 'Not specified')
                        : 'Not specified'
                      }
                    </p>
                  </div>
                </div>

                {/* Additional fields based on user type */}
                {selectedUser.userType === 'freelancer' && (
                  <div className="space-y-4">
                    {selectedUser.degreeProgram && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Degree Program</label>
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{selectedUser.degreeProgram}</p>
                      </div>
                    )}
                    {selectedUser.graduationYear && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{selectedUser.graduationYear}</p>
                      </div>
                    )}
                  </div>
                )}

                {selectedUser.userType === 'client' && (
                  <div className="space-y-4">
                    {selectedUser.jobTitle && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{selectedUser.jobTitle}</p>
                      </div>
                    )}
                    {selectedUser.industry && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{selectedUser.industry}</p>
                      </div>
                    )}
                  </div>
                )}

                {selectedUser.userType === 'universityStaff' && (
                  <div className="space-y-4">
                    {selectedUser.staffRole && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Staff Role</label>
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{selectedUser.staffRole}</p>
                      </div>
                    )}
                    {selectedUser.employeeId && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{selectedUser.employeeId}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Joined Date</label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      {new Date(selectedUser.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Updated</label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      {new Date(selectedUser.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>



                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CV File</label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      {selectedUser.cvFile ? 'Uploaded' : 'Not uploaded'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              {selectedUser.bio && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{selectedUser.bio}</p>
                </div>
              )}

              {selectedUser.skills && selectedUser.skills.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.skills.map((skill, index) => (
                      <span key={index} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowUserDetailsModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                >
                  Close
                </button>
                {selectedUser.status === 'active' ? (
                  <button
                    onClick={() => {
                      handleUserAction(selectedUser._id, 'suspend');
                      setShowUserDetailsModal(false);
                    }}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                  >
                    Suspend User
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleUserAction(selectedUser._id, 'activate');
                      setShowUserDetailsModal(false);
                    }}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                  >
                    Activate User
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Message Reply Modal */}
      {showMessageModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Reply to Message</h3>
              <button
                onClick={() => {
                  setShowMessageModal(false);
                  setSelectedMessage(null);
                  setReplyMessage('');
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Original Message */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Original Message</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span><strong>From:</strong> {selectedMessage.name} ({selectedMessage.email})</span>
                    <span><strong>Subject:</strong> {selectedMessage.subject}</span>
                    <span><strong>Category:</strong> {selectedMessage.category}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span><strong>Priority:</strong> 
                      <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                        selectedMessage.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        selectedMessage.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        selectedMessage.priority === 'normal' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedMessage.priority.charAt(0).toUpperCase() + selectedMessage.priority.slice(1)}
                      </span>
                    </span>
                    <span><strong>Date:</strong> {new Date(selectedMessage.createdAt).toLocaleDateString()}</span>
                    <span><strong>Status:</strong> 
                      <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                        selectedMessage.status === 'new' ? 'bg-yellow-100 text-yellow-800' :
                        selectedMessage.status === 'replied' ? 'bg-blue-100 text-blue-800' :
                        selectedMessage.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        selectedMessage.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {selectedMessage.status.charAt(0).toUpperCase() + selectedMessage.status.slice(1)}
                      </span>
                    </span>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>
              </div>

              {/* Conversation Thread */}
              {(selectedMessage.replies && selectedMessage.replies.length > 0) && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Conversation Thread</h4>
                  <div className="space-y-3">
                    {selectedMessage.replies.map((reply, replyIndex) => (
                      <div key={replyIndex} className={`rounded-lg p-4 ${
                        reply.senderType === 'admin' 
                          ? 'bg-yellow-50 border border-yellow-200' 
                          : 'bg-blue-50 border border-blue-200'
                      }`}>
                        <div className="flex items-center space-x-2 mb-2">
                          <svg className={`w-4 h-4 ${
                            reply.senderType === 'admin' ? 'text-yellow-600' : 'text-blue-600'
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                          </svg>
                          <span className={`text-sm font-medium ${
                            reply.senderType === 'admin' ? 'text-yellow-800' : 'text-blue-800'
                          }`}>
                            {reply.senderType === 'admin' ? 'Admin' : 'User'}
                          </span>
                          <span className={`text-xs ${
                            reply.senderType === 'admin' ? 'text-yellow-600' : 'text-blue-600'
                          }`}>
                            {new Date(reply.repliedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className={`whitespace-pre-wrap ${
                          reply.senderType === 'admin' ? 'text-yellow-900' : 'text-blue-900'
                        }`}>
                          {reply.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Legacy admin reply display for backward compatibility */}
              {selectedMessage.adminReply && (!selectedMessage.replies || selectedMessage.replies.length === 0) && (
                <div className="bg-blue-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Previous Admin Reply</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                      <span>Replied on {new Date(selectedMessage.adminReply.repliedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.adminReply.message}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Reply Form */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  {(selectedMessage.adminReply || (selectedMessage.replies && selectedMessage.replies.length > 0)) ? 'Add Reply to Conversation' : 'Send Reply'}
                </h4>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="replyMessage" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Reply *
                    </label>
                    <textarea
                      id="replyMessage"
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                      placeholder="Type your reply here..."
                    />
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={replyMessage.trim() !== ''}
                        disabled
                        className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Message will be sent to {selectedMessage.email}</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowMessageModal(false);
                    setSelectedMessage(null);
                    setReplyMessage('');
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReplyToMessage}
                  disabled={!replyMessage.trim()}
                  className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl ${
                    replyMessage.trim()
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {(selectedMessage.adminReply || (selectedMessage.replies && selectedMessage.replies.length > 0)) ? 'Send Reply' : 'Send Reply'}
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
