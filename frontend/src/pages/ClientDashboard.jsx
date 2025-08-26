import React, { useState, useEffect } from "react";
<<<<<<< Updated upstream
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

function ClientDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [userData, setUserData] = useState(null);
=======
import { useNavigate, useLocation } from "react-router-dom";
import ProfileImageUpload from "../components/ProfileImageUpload";

function ClientDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [clientData, setClientData] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
<<<<<<< Updated upstream
=======
  
  // Profile editing states
>>>>>>> Stashed changes
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUploadingProfileImage, setIsUploadingProfileImage] = useState(false);
  const [isRemovingProfileImage, setIsRemovingProfileImage] = useState(false);
  const [showProfileImageMenu, setShowProfileImageMenu] = useState(false);
<<<<<<< Updated upstream
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaveMessage, setProfileSaveMessage] = useState('');
>>>>>>> Stashed changes
=======
  
>>>>>>> Stashed changes
  const navigate = useNavigate();

<<<<<<< Updated upstream
  // Project state
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
=======
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

  // Close profile image menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileImageMenu && !event.target.closest('.profile-image-menu')) {
        setShowProfileImageMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileImageMenu]);

  // Mock data
  const [stats] = useState({
    postedProjects: 8,
    activeProjects: 3,
    completedProjects: 5,
    totalSpent: 4200
  });

  const [projects] = useState([
    { id: 1, title: "Website Redesign", freelancer: "John Student", status: "In Progress", budget: 800, progress: 60 },
    { id: 2, title: "Logo Design", freelancer: "Sarah Wilson", status: "Completed", budget: 300, progress: 100 },
    { id: 3, title: "Mobile App Development", freelancer: "Mike Johnson", status: "In Progress", budget: 1500, progress: 30 }
  ]);

  // Mock data for job/project posts
  const [jobPosts, setJobPosts] = useState([
    {
      id: 1,
      title: "Website Redesign for E-commerce",
      type: "Project",
      category: "Web Development",
      budget: 800,
      deadline: "2024-02-15",
      location: "Remote",
      status: "Active",
      applications: 12,
      requiredSkills: ["React", "Node.js", "MongoDB"],
      degreeField: "Computer Science",
      description: "Redesign an existing e-commerce website with modern UI/UX",
      attachments: ["requirements.pdf", "design-mockup.png"]
    },
    {
      id: 2,
      title: "Logo Design for Startup",
      type: "Project",
      category: "Graphic Design",
      budget: 300,
      deadline: "2024-01-30",
      location: "Remote",
      status: "Completed",
      applications: 8,
      requiredSkills: ["Adobe Illustrator", "Logo Design"],
      degreeField: "Graphic Design",
      description: "Create a modern logo for a tech startup",
      attachments: ["brand-guidelines.pdf"]
    }
  ]);

  const [applications, setApplications] = useState([
    {
      id: 1,
      postId: 1,
      studentName: "John Student",
      university: "MIT",
      degreeProgram: "Computer Science",
      gpa: "3.8",
      skills: ["React", "Node.js", "MongoDB"],
      experience: "2 years web development",
      status: "Pending",
      appliedDate: "2024-01-15"
    },
    {
      id: 2,
      postId: 1,
      studentName: "Sarah Wilson",
      university: "Stanford",
      degreeProgram: "Computer Science",
      gpa: "3.9",
      skills: ["React", "Vue.js", "Python"],
      experience: "1 year frontend development",
      status: "Shortlisted",
      appliedDate: "2024-01-14"
    }
  ]);

  // Form state for creating/editing posts
  const [postForm, setPostForm] = useState({
>>>>>>> Stashed changes
    title: "",
    description: "",
    budget: "",
    category: "",
    skills: [],
    deadline: "",
    projectType: "one-time"
  });

  // Freelancer state
  const [freelancers, setFreelancers] = useState([]);
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);

  // Proposals state
  const [proposals, setProposals] = useState([]);

  // Messages state
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Load user data from localStorage
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      const user = JSON.parse(userDataStr);
      setUserData(user);
    }

    // Load mock data for demonstration
    loadMockData();
  }, []);

  const loadMockData = () => {
    // Mock projects
    setProjects([
      {
        id: 1,
        title: "E-commerce Website Development",
        description: "Need a modern e-commerce website with payment integration",
        budget: "$2000",
        category: "Web Development",
        skills: ["React", "Node.js", "MongoDB"],
        deadline: "2024-05-15",
        projectType: "one-time",
        status: "open",
        proposals: 5,
        createdAt: "2024-03-01"
      },
      {
        id: 2,
        title: "Logo Design for Startup",
        description: "Looking for a professional logo design for our tech startup",
        budget: "$300",
        category: "Design",
        skills: ["Logo Design", "Branding", "Illustrator"],
        deadline: "2024-04-20",
        projectType: "one-time",
        status: "in-progress",
        proposals: 3,
        createdAt: "2024-02-15"
      }
    ]);

    // Mock freelancers
    setFreelancers([
      {
        id: 1,
        name: "Sarah Johnson",
        title: "Full-Stack Developer",
        skills: ["React", "Node.js", "Python", "MongoDB"],
        rating: 4.8,
        completedProjects: 25,
        hourlyRate: 45,
        avatar: "https://via.placeholder.com/60x60",
        isOnline: true
      },
      {
        id: 2,
        name: "Mike Chen",
        title: "UI/UX Designer",
        skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
        rating: 4.9,
        completedProjects: 18,
        hourlyRate: 55,
        avatar: "https://via.placeholder.com/60x60",
        isOnline: false
      }
    ]);

    // Mock proposals
    setProposals([
      {
        id: 1,
        projectId: 1,
        freelancerId: 1,
        freelancerName: "Sarah Johnson",
        proposal: "I have extensive experience building e-commerce platforms. I'll create a responsive, SEO-optimized website with secure payment integration.",
        budget: "$1800",
        timeline: "4 weeks",
        rating: 4.8,
        completedProjects: 25
      },
      {
        id: 2,
        projectId: 1,
        freelancerId: 2,
        freelancerName: "Mike Chen",
        proposal: "I can design a modern, user-friendly interface for your e-commerce site with excellent conversion optimization.",
        budget: "$2200",
        timeline: "5 weeks",
        rating: 4.9,
        completedProjects: 18
      }
    ]);

    // Mock messages
    setMessages([
      {
        id: 1,
        from: "Sarah Johnson",
        message: "Hi! I'm interested in your e-commerce project. Can we discuss the requirements?",
        timestamp: "2024-03-01 10:30 AM",
        isRead: false
      }
    ]);
  };

  const createProject = () => {
    if (newProject.title && newProject.description && newProject.budget) {
      const project = {
        ...newProject,
        id: Date.now(),
        status: "open",
        proposals: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setProjects([...projects, project]);
      setNewProject({
        title: "",
        description: "",
        budget: "",
        category: "",
        skills: [],
        deadline: "",
        projectType: "one-time"
      });
    }
  };

  const updateProjectStatus = (projectId, newStatus) => {
    setProjects(projects.map(project => 
      project.id === projectId ? { ...project, status: newStatus } : project
    ));
  };

  const removeProject = (projectId) => {
    setProjects(projects.filter(project => project.id !== projectId));
  };

  const addSkill = (skill) => {
    if (skill.trim() && !newProject.skills.includes(skill.trim())) {
      setNewProject(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }));
    }
  };

  const removeSkill = (skillToRemove) => {
    setNewProject(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

<<<<<<< Updated upstream
<<<<<<< Updated upstream
  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        from: userData?.firstName || "You",
        message: newMessage.trim(),
        timestamp: new Date().toLocaleString(),
        isRead: false
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const handleLogout = () => {
    logout(navigate);
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Projects</h3>
          <p className="text-3xl font-bold text-blue-600">
            {projects.filter(p => p.status === 'open' || p.status === 'in-progress').length}
          </p>
=======
=======
>>>>>>> Stashed changes
  // Handle profile editing
  const handleEditProfile = () => {
    setShowEditPopup(true);
    setEditFormData({
      firstName: clientData?.firstName || '',
      lastName: clientData?.lastName || '',
      email: clientData?.email || '',
      phoneNumber: clientData?.phoneNumber || '',
      address: clientData?.address || '',
      organization: clientData?.organization || '',
      jobTitle: clientData?.jobTitle || '',
<<<<<<< Updated upstream
      industry: clientData?.industry || '',
      companySize: clientData?.companySize || '',
      website: clientData?.website || '',
      bio: clientData?.bio || '',
=======
      contactPhone: clientData?.contactPhone || '',
      companySize: clientData?.companySize || '',
      industry: clientData?.industry || '',
      website: clientData?.website || '',
      companyDescription: clientData?.companyDescription || '',
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
      setIsSavingProfile(true);
      setProfileSaveMessage('');

      // Get the auth token
      const token = localStorage.getItem('userToken');
      if (!token) {
        setProfileSaveMessage('Authentication token not found. Please log in again.');
=======
      // Get the auth token
      const token = localStorage.getItem('userToken');
      if (!token) {
        alert('Authentication token not found. Please log in again.');
>>>>>>> Stashed changes
        return;
      }

      // Prepare the data to send to backend
      const updateData = {
        firstName: editFormData.firstName,
        lastName: editFormData.lastName,
<<<<<<< Updated upstream
        // Email is not included as it cannot be changed
=======
>>>>>>> Stashed changes
        phoneNumber: editFormData.phoneNumber,
        address: editFormData.address,
        organization: editFormData.organization,
        jobTitle: editFormData.jobTitle,
<<<<<<< Updated upstream
        industry: editFormData.industry,
        companySize: editFormData.companySize,
        website: editFormData.website,
        bio: editFormData.bio
      };

      // Make API call to update profile
      const response = await fetch('http://localhost:5000/api/client/profile', {
=======
        contactPhone: editFormData.contactPhone,
        companySize: editFormData.companySize,
        industry: editFormData.industry,
        website: editFormData.website,
        companyDescription: editFormData.companyDescription
      };

      // Make API call to update profile
      const response = await fetch('http://localhost:5000/api/users/profile', {
>>>>>>> Stashed changes
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      const result = await response.json();

      if (result.success) {
        // Update the client data with edited values
        const updatedData = { 
          ...clientData, 
          ...updateData
        };
        
        setClientData(updatedData);
        
        // Save to localStorage
        localStorage.setItem('userData', JSON.stringify(updatedData));
        
        // Close popup
        setShowEditPopup(false);
        
        // Show success message
<<<<<<< Updated upstream
        setProfileSaveMessage('Profile updated successfully!');
        setTimeout(() => setProfileSaveMessage(''), 3000);
      } else {
        // Show error message from backend
        setProfileSaveMessage(`Failed to update profile: ${result.message}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setProfileSaveMessage('Failed to update profile. Please try again.');
    } finally {
      setIsSavingProfile(false);
=======
        alert("Profile updated successfully!");
      } else {
        // Show error message from backend
        alert(`Failed to update profile: ${result.message}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
>>>>>>> Stashed changes
    }
  };

  const validateEditForm = () => {
    const errors = {};
    
    if (!editFormData.firstName.trim()) errors.firstName = "First name is required";
    if (!editFormData.lastName.trim()) errors.lastName = "Last name is required";
    if (!editFormData.organization.trim()) errors.organization = "Organization is required";
    if (!editFormData.jobTitle.trim()) errors.jobTitle = "Job title is required";
    
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
<<<<<<< Updated upstream
    setProfileSaveMessage('');
=======
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
      const response = await fetch('http://localhost:5000/api/client/profile-image', {
=======
      const response = await fetch('http://localhost:5000/api/users/profile-image', {
>>>>>>> Stashed changes
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Update client data with new profile image
          setClientData(prev => ({
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

<<<<<<< Updated upstream
      // Call backend API to remove profile image
      const response = await fetch('http://localhost:5000/api/client/profile-image', {
=======
      const response = await fetch('http://localhost:5000/api/users/profile-image', {
>>>>>>> Stashed changes
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

<<<<<<< Updated upstream
      const result = await response.json();

      if (result.success) {
        // Update local state
        setClientData(prev => ({
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
=======
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Update client data to remove profile image
          setClientData(prev => ({
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
          alert(result.message || 'Failed to remove profile image');
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to remove profile image');
      }
    } catch (error) {
      console.error('Profile image removal error:', error);
>>>>>>> Stashed changes
      alert('Failed to remove profile image. Please try again.');
    } finally {
      setIsRemovingProfileImage(false);
    }
  };

<<<<<<< Updated upstream
  // Function to delete user account
  const handleDeleteAccount = async () => {
    // Show confirmation dialog
    const isConfirmed = window.confirm(
      '⚠️ WARNING: This action cannot be undone!\n\n' +
      'Are you absolutely sure you want to delete your account?\n\n' +
      'This will permanently delete:\n' +
      '• Your profile and all data\n' +
      '• All your project posts\n' +
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

      const response = await fetch('http://localhost:5000/api/client/account', {
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

=======
>>>>>>> Stashed changes
  const renderOverview = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.postedProjects}</h3>
          <p className="text-gray-600">Posted Projects</p>
>>>>>>> Stashed changes
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Projects</h3>
          <p className="text-3xl font-bold text-green-600">{projects.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Proposals</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {proposals.length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Messages</h3>
          <p className="text-3xl font-bold text-purple-600">
            {messages.filter(m => !m.isRead).length}
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {projects.slice(0, 3).map((project) => (
            <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{project.title}</h4>
                <p className="text-sm text-gray-600">Created on {project.createdAt}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                project.status === 'open' ? 'bg-green-100 text-green-800' :
                project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setActiveTab("create-project")}
            className="p-4 border-2 border-dashed border-yellow-300 rounded-lg text-center hover:border-yellow-400 hover:bg-yellow-50 transition-colors"
          >
            <div className="text-2xl mb-2">➕</div>
            <div className="font-medium text-gray-900">Create New Project</div>
            <div className="text-sm text-gray-600">Post a new job opportunity</div>
          </button>
          <button
            onClick={() => setActiveTab("freelancers")}
            className="p-4 border-2 border-dashed border-blue-300 rounded-lg text-center hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <div className="text-2xl mb-2">👥</div>
            <div className="font-medium text-gray-900">Browse Freelancers</div>
            <div className="text-sm text-gray-600">Find talented professionals</div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderCreateProjectTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Project</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
            <input
              type="text"
              value={newProject.title}
              onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="e.g., E-commerce Website Development"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={newProject.category}
              onChange={(e) => setNewProject(prev => ({ ...prev, category: e.target.value }))}
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Budget ($)</label>
            <input
              type="number"
              value={newProject.budget}
              onChange={(e) => setNewProject(prev => ({ ...prev, budget: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="e.g., 1000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
            <select
              value={newProject.projectType}
              onChange={(e) => setNewProject(prev => ({ ...prev, projectType: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="one-time">One-time Project</option>
              <option value="ongoing">Ongoing Work</option>
              <option value="hourly">Hourly Rate</option>
            </select>
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
                  skills.forEach(skill => addSkill(skill));
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
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Describe your project requirements, goals, and any specific details..."
            />
          </div>
        </div>

        {/* Skills Display */}
        {newProject.skills.length > 0 && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Skills Added:</label>
            <div className="flex flex-wrap gap-2">
              {newProject.skills.map((skill, index) => (
                <span key={index} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="text-yellow-600 hover:text-yellow-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={createProject}
            className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600"
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );

  const renderProjectsTab = () => (
    <div className="space-y-6">
      {projects.map((project) => (
        <div key={project.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-semibold text-gray-900 text-lg">{project.title}</h4>
              <p className="text-gray-600 mt-1">{project.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                project.status === 'open' ? 'bg-green-100 text-green-800' :
                project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </span>
              <button
                onClick={() => removeProject(project.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <span className="text-sm text-gray-500">Budget:</span>
              <p className="font-medium">{project.budget}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Category:</span>
              <p className="font-medium">{project.category}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Deadline:</span>
              <p className="font-medium">{project.deadline}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Proposals:</span>
              <p className="font-medium">{project.proposals}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-4">
            {project.skills.map((skill, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                {skill}
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            {project.status === 'open' && (
              <button
                onClick={() => updateProjectStatus(project.id, 'in-progress')}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
              >
                Start Project
              </button>
            )}
            {project.status === 'in-progress' && (
              <button
                onClick={() => updateProjectStatus(project.id, 'completed')}
                className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600"
              >
                Mark Complete
              </button>
            )}
            <button
              onClick={() => setActiveTab("proposals")}
              className="bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm hover:bg-yellow-600"
            >
              View Proposals ({project.proposals})
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderFreelancersTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Browse Freelancers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {freelancers.map((freelancer) => (
            <div key={freelancer.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <img src={freelancer.avatar} alt={freelancer.name} className="w-12 h-12 rounded-full" />
                <div>
                  <h4 className="font-semibold text-gray-900">{freelancer.name}</h4>
                  <p className="text-sm text-gray-600">{freelancer.title}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ml-auto ${freelancer.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(freelancer.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600">{freelancer.rating}</span>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {freelancer.skills.slice(0, 3).map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {skill}
                  </span>
                ))}
                {freelancer.skills.length > 3 && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                    +{freelancer.skills.length - 3} more
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-600">{freelancer.completedProjects} projects</span>
                <span className="text-sm font-medium text-gray-900">${freelancer.hourlyRate}/hr</span>
              </div>

              <button
                onClick={() => {
                  setSelectedFreelancer(freelancer);
                  setActiveTab("messages");
                }}
                className="w-full bg-yellow-500 text-black py-2 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
              >
                Contact
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

<<<<<<< Updated upstream
<<<<<<< Updated upstream
  const renderProposalsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Proposals</h3>
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <div key={proposal.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{proposal.freelancerName}</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(proposal.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{proposal.rating} • {proposal.completedProjects} projects</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{proposal.budget}</p>
                  <p className="text-sm text-gray-600">{proposal.timeline}</p>
                </div>
=======
=======
  // Edit Profile Popup Modal
  const renderEditProfileModal = () => {
    if (!showEditPopup) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Edit Profile</h2>
              <button
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      value={editFormData.firstName}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 ${
                        editErrors.firstName ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                      }`}
                    />
                    {editErrors.firstName && <p className="text-red-500 text-sm mt-1">{editErrors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                      type="text"
                      value={editFormData.lastName}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 ${
                        editErrors.lastName ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                      }`}
                    />
                    {editErrors.lastName && <p className="text-red-500 text-sm mt-1">{editErrors.lastName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={editFormData.email}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-gray-50"
                      readOnly
                    />
                    <p className="text-gray-500 text-sm mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={editFormData.phoneNumber}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      value={editFormData.address}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                      placeholder="Enter address"
                    />
                  </div>
                </div>
              </div>

              {/* Company Information */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organization *</label>
                    <input
                      type="text"
                      value={editFormData.organization}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, organization: e.target.value }))}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 ${
                        editErrors.organization ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                      }`}
                      placeholder="Enter organization name"
                    />
                    {editErrors.organization && <p className="text-red-500 text-sm mt-1">{editErrors.organization}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                    <input
                      type="text"
                      value={editFormData.jobTitle}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 ${
                        editErrors.jobTitle ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                      }`}
                      placeholder="Enter job title"
                    />
                    {editErrors.jobTitle && <p className="text-red-500 text-sm mt-1">{editErrors.jobTitle}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                    <input
                      type="tel"
                      value={editFormData.contactPhone}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                      placeholder="Enter contact phone"
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
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="500+">500+ employees</option>
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
                      placeholder="https://www.example.com"
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

              {/* Password Change Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Change Password (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={editFormData.currentPassword}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 pr-12 ${
                          editErrors.currentPassword ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                        }`}
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {editErrors.currentPassword && <p className="text-red-500 text-sm mt-1">{editErrors.currentPassword}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={editFormData.newPassword}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 pr-12 ${
                          editErrors.newPassword ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                        }`}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showNewPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {editErrors.newPassword && <p className="text-red-500 text-sm mt-1">{editErrors.newPassword}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={editFormData.confirmPassword}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 pr-12 ${
                          editErrors.confirmPassword ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                        }`}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {editErrors.confirmPassword && <p className="text-red-500 text-sm mt-1">{editErrors.confirmPassword}</p>}
                  </div>
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

>>>>>>> Stashed changes
  const renderProfile = () => (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-black via-gray-900 to-black text-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          {/* Profile Picture */}
          <div className="relative">
<<<<<<< Updated upstream
            {clientData?.profileImage ? (
              <img
                src={clientData.profileImage}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-4xl font-bold text-black">
                {clientData?.firstName?.charAt(0)}{clientData?.lastName?.charAt(0)}
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 border-4 border-white rounded-full"></div>
=======
            {clientData?.profileImage?.url ? (
              <div className="relative">
                <img 
                  src={clientData.profileImage.url} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 border-4 border-white rounded-full"></div>
                <button
                  onClick={() => setShowProfileImageMenu(!showProfileImageMenu)}
                  className="absolute top-0 right-0 w-8 h-8 bg-gray-800 bg-opacity-75 text-white rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
                
                {showProfileImageMenu && (
                  <div className="absolute top-10 right-0 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 min-w-[150px] profile-image-menu">
                    <label className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            handleProfileImageUpload(e.target.files[0]);
                            setShowProfileImageMenu(false);
                          }
                        }}
                        className="hidden"
                      />
                      Change Photo
                    </label>
                    <button
                      onClick={() => {
                        handleProfileImageRemove();
                        setShowProfileImageMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Remove Photo
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-4xl font-bold text-black">
                  {clientData?.firstName?.charAt(0)}{clientData?.lastName?.charAt(0)}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 border-4 border-white rounded-full"></div>
                <label className="absolute top-0 right-0 w-8 h-8 bg-gray-800 bg-opacity-75 text-white rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-200 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        handleProfileImageUpload(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </label>
              </div>
            )}
>>>>>>> Stashed changes
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
>>>>>>> Stashed changes
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg mb-3">
                <p className="text-gray-700 text-sm">{proposal.proposal}</p>
              </div>

              <div className="flex gap-2">
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600">
                  Accept Proposal
                </button>
                <button className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600">
                  Decline
                </button>
                <button className="bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm hover:bg-yellow-600">
                  Message
                </button>
              </div>
            </div>
<<<<<<< Updated upstream
          ))}
=======

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
            <button 
              onClick={() => setActiveTab("posts")}
              className="bg-white hover:bg-gray-100 text-gray-800 px-6 py-2 rounded-lg font-semibold transition-colors"
            >
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-50"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  value={clientData?.email || ''}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-50"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
                <input 
                  type="text" 
                  value={clientData?.organization || ''}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-50"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                <input 
                  type="text" 
                  value={clientData?.jobTitle || ''}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-50"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  value={clientData?.phoneNumber || ''}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-50"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <input 
                  type="text" 
                  value={clientData?.industry || ''}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-50"
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
                  value={clientData?.industry || ''}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-50"
                  readOnly
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                  <input 
                    type="text" 
                    value={clientData?.companySize || ''}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-50"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input 
                    type="url" 
                    value={clientData?.website || ''}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-50"
                    readOnly
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  rows="4"
                  value={clientData?.bio || ''}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-50"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Image Upload */}
          <ProfileImageUpload
            currentImage={clientData?.profileImage ? { url: clientData.profileImage, uploadedAt: new Date() } : null}
            onImageUpload={handleProfileImageUpload}
            onImageRemove={handleProfileImageRemove}
            isUploading={isUploadingProfileImage}
            className=""
          />

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
>>>>>>> Stashed changes
        </div>
      </div>
    </div>
  );

  const renderMessagesTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Messages {selectedFreelancer && `- ${selectedFreelancer.name}`}
        </h3>
        
        <div className="h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 mb-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.from === (userData?.firstName || "You") ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.from === (userData?.firstName || "You") 
                    ? 'bg-yellow-500 text-black' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm">{message.message}</p>
                  <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
          <button
            onClick={sendMessage}
            className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to access the Client Dashboard</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Client Dashboard</h1>
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
              { id: "overview", label: "Overview", icon: "📊" },
              { id: "create-project", label: "Create Project", icon: "➕" },
              { id: "projects", label: "My Projects", icon: "📋" },
              { id: "freelancers", label: "Browse Freelancers", icon: "👥" },
              { id: "proposals", label: "Proposals", icon: "📝" },
              { id: "messages", label: "Messages", icon: "💬" }
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

<<<<<<< Updated upstream
<<<<<<< Updated upstream
        {/* Tab Content */}
        <div className="min-h-[600px]">
          {activeTab === "overview" && renderOverviewTab()}
          {activeTab === "create-project" && renderCreateProjectTab()}
          {activeTab === "projects" && renderProjectsTab()}
          {activeTab === "freelancers" && renderFreelancersTab()}
          {activeTab === "proposals" && renderProposalsTab()}
          {activeTab === "messages" && renderMessagesTab()}
        </div>
      </div>
=======
              {/* Main Content Area */}
        <div className="flex-1 p-8 pt-8 overflow-y-auto mt-20">
          <div className="max-w-7xl mx-auto">
            {activeTab === "overview" && renderOverview()}
            {activeTab === "recommendations" && renderRecommendations()}
            {activeTab === "posts" && renderManagePosts()}
            {activeTab === "applications" && renderApplications()}
            {activeTab === "profile" && renderProfile()}
                  </div>
      </div>

      {/* Edit Profile Popup */}
      {showEditPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Edit Profile</h3>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ✕
                </button>
              </div>

              {profileSaveMessage && (
                <div className={`mb-4 p-3 rounded-lg ${
                  profileSaveMessage.includes('successfully') 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {profileSaveMessage}
                </div>
              )}

              <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      required
                      value={editFormData.firstName || ''}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                        editErrors.firstName ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {editErrors.firstName && <p className="text-red-500 text-sm mt-1">{editErrors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={editFormData.lastName || ''}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                        editErrors.lastName ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {editErrors.lastName && <p className="text-red-500 text-sm mt-1">{editErrors.lastName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={editFormData.email || ''}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-50"
                      readOnly
                    />
                    <p className="text-gray-500 text-sm mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={editFormData.phoneNumber || ''}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organization *</label>
                    <input
                      type="text"
                      required
                      value={editFormData.organization || ''}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, organization: e.target.value }))}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                        editErrors.organization ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter organization name"
                    />
                    {editErrors.organization && <p className="text-red-500 text-sm mt-1">{editErrors.organization}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                    <input
                      type="text"
                      required
                      value={editFormData.jobTitle || ''}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                        editErrors.jobTitle ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter job title"
                    />
                    {editErrors.jobTitle && <p className="text-red-500 text-sm mt-1">{editErrors.jobTitle}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    <select
                      value={editFormData.industry || ''}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, industry: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                    >
                      <option value="">Select Industry</option>
                      <option value="Technology">Technology</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Education">Education</option>
                      <option value="Finance">Finance</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Retail">Retail</option>
                      <option value="Consulting">Consulting</option>
                      <option value="Non-Profit">Non-Profit</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                    <select
                      value={editFormData.companySize || ''}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, companySize: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                    >
                      <option value="">Select Company Size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501-1000">501-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <input
                      type="url"
                      value={editFormData.website || ''}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, website: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                      placeholder="https://your-website.com"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                      rows={2}
                      value={editFormData.address || ''}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                      placeholder="Enter your address"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      rows={4}
                      value={editFormData.bio || ''}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, bio: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                      placeholder="Tell us about yourself and your organization..."
                    />
                  </div>
                </div>

                {/* Password Change Section */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Change Password (Optional)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={editFormData.currentPassword || ''}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 pr-12 ${
                            editErrors.currentPassword ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? "🙈" : "👁️"}
                        </button>
                      </div>
                      {editErrors.currentPassword && <p className="text-red-500 text-sm mt-1">{editErrors.currentPassword}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={editFormData.newPassword || ''}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 pr-12 ${
                            editErrors.newPassword ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showNewPassword ? "🙈" : "👁️"}
                        </button>
                      </div>
                      {editErrors.newPassword && <p className="text-red-500 text-sm mt-1">{editErrors.newPassword}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={editFormData.confirmPassword || ''}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 pr-12 ${
                            editErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showConfirmPassword ? "🙈" : "👁️"}
                        </button>
                      </div>
                      {editErrors.confirmPassword && <p className="text-red-500 text-sm mt-1">{editErrors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="border-t border-red-200 pt-6">
                  <h4 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h4>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h5 className="font-semibold text-red-900">Delete Account</h5>
                        <p className="text-red-700 text-sm">Permanently delete your account and all associated data</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleDeleteAccount}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-xl font-medium hover:from-blue-500 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSavingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
>>>>>>> Stashed changes
=======
      {/* Main Content Area */}
      <div className="flex-1 p-8 pt-8 overflow-y-auto mt-20">
        <div className="max-w-7xl mx-auto">
          {activeTab === "overview" && renderOverview()}
          {activeTab === "recommendations" && renderRecommendations()}
          {activeTab === "posts" && renderManagePosts()}
          {activeTab === "applications" && renderApplications()}
          {activeTab === "profile" && renderProfile()}
        </div>
      </div>
      
      {/* Edit Profile Modal */}
      {renderEditProfileModal()}
>>>>>>> Stashed changes
    </div>
  );
}

export default ClientDashboard;
