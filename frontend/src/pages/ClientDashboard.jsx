import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function ClientDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [clientData, setClientData] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

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

  // Mock data for recommended freelancers
  const [recommendedFreelancers, setRecommendedFreelancers] = useState([
    {
      id: 1,
      name: "John Student",
      university: "MIT",
      degreeProgram: "Computer Science",
      gpa: "3.8",
      skills: ["React", "Node.js", "MongoDB", "Python", "AWS"],
      experience: "2 years web development",
      completedProjects: 15,
      rating: 4.8,
      hourlyRate: 25,
      availability: "20 hours/week",
      profileCompleteness: 95,
      lastActive: "2 days ago",
      portfolio: "https://john-portfolio.com",
      reviews: [
        { client: "Tech Corp", rating: 5, comment: "Excellent work quality and communication" },
        { client: "Startup Inc", rating: 4, comment: "Very reliable and skilled developer" }
      ]
    },
    {
      id: 2,
      name: "Sarah Wilson",
      university: "Stanford",
      degreeProgram: "Computer Science",
      gpa: "3.9",
      skills: ["React", "Vue.js", "Python", "Machine Learning", "Data Analysis"],
      experience: "1.5 years frontend development",
      completedProjects: 12,
      rating: 4.9,
      hourlyRate: 30,
      availability: "25 hours/week",
      profileCompleteness: 90,
      lastActive: "1 day ago",
      portfolio: "https://sarah-portfolio.com",
      reviews: [
        { client: "AI Labs", rating: 5, comment: "Outstanding ML implementation skills" },
        { client: "Data Corp", rating: 5, comment: "Great analytical thinking and execution" }
      ]
    },
    {
      id: 3,
      name: "Mike Johnson",
      university: "UC Berkeley",
      degreeProgram: "Graphic Design",
      gpa: "3.7",
      skills: ["Adobe Illustrator", "Photoshop", "Figma", "UI/UX Design", "Branding"],
      experience: "3 years design experience",
      completedProjects: 20,
      rating: 4.7,
      hourlyRate: 35,
      availability: "30 hours/week",
      profileCompleteness: 88,
      lastActive: "3 days ago",
      portfolio: "https://mike-design.com",
      reviews: [
        { client: "Design Studio", rating: 5, comment: "Creative and professional designer" },
        { client: "Brand Corp", rating: 4, comment: "Great understanding of brand identity" }
      ]
    },
    {
      id: 4,
      name: "Emily Chen",
      university: "Carnegie Mellon",
      degreeProgram: "Data Science",
      gpa: "3.9",
      skills: ["Python", "R", "SQL", "Machine Learning", "Statistical Analysis"],
      experience: "2 years data science",
      completedProjects: 18,
      rating: 4.8,
      hourlyRate: 28,
      availability: "22 hours/week",
      profileCompleteness: 92,
      lastActive: "1 day ago",
      portfolio: "https://emily-data.com",
      reviews: [
        { client: "Research Corp", rating: 5, comment: "Exceptional analytical skills" },
        { client: "Tech Startup", rating: 4, comment: "Very thorough and detail-oriented" }
      ]
    }
  ]);

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

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsed = JSON.parse(userData);
      if (parsed.userType === 'jobSeeker') {
        setClientData(parsed);
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
    if (tabParam && ['overview', 'recommendations', 'posts', 'applications', 'profile'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('userToken');
    navigate('/');
  };

  const handleCreatePost = () => {
    if (editingPost) {
      // Update existing post
      setJobPosts(prev => prev.map(post => 
        post.id === editingPost.id ? { ...post, ...postForm } : post
      ));
      setEditingPost(null);
    } else {
      // Create new post
      const newPost = {
        id: Date.now(),
        ...postForm,
        status: "Active",
        applications: 0,
        createdDate: new Date().toISOString().split('T')[0]
      };
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
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setPostForm({
      title: post.title,
      type: post.type,
      category: post.category,
      budget: post.budget,
      deadline: post.deadline,
      location: post.location,
      requiredSkills: post.requiredSkills.join(", "),
      degreeField: post.degreeField,
      description: post.description,
      attachments: post.attachments
    });
    setShowCreateForm(true);
  };

  const handleDeletePost = (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setJobPosts(prev => prev.filter(post => post.id !== postId));
      setApplications(prev => prev.filter(app => app.postId !== postId));
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
          {getRecommendedFreelancers().slice(0, 4).map(freelancer => (
            <div key={freelancer.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors duration-300">
              <div className="flex justify-between items-start mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{freelancer.name.charAt(0)}</span>
                </div>
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
          ))}
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
            className="px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-xl font-medium hover:from-blue-500 hover:to-blue-600"
          >
            {editingPost ? 'Update Post' : 'Create Post'}
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
              {jobPosts.map(post => (
                <tr key={post.id} className="hover:bg-gray-50">
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
                  <td className="px-6 py-4 text-sm text-gray-900">{post.deadline}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{post.applications}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      post.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
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
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderApplications = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900">Student Applications</h3>
      
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map(app => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{app.studentName}</div>
                      <div className="text-sm text-gray-500">{app.degreeProgram}</div>
                      <div className="text-sm text-gray-500">GPA: {app.gpa}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{app.university}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {app.skills.map(skill => (
                        <span key={skill} className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{app.appliedDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      app.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      app.status === 'Shortlisted' ? 'bg-blue-100 text-blue-800' :
                      app.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium space-x-2">
                    {app.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleApplicationAction(app.id, 'Shortlisted')}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Shortlist
                        </button>
                        <button
                          onClick={() => handleApplicationAction(app.id, 'Rejected')}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button className="text-green-600 hover:text-green-900">
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
        {getRecommendedFreelancers().map(freelancer => (
          <div key={freelancer.id} className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-shadow duration-300">
            {/* Recommendation Score Badge */}
            {freelancer.recommendationScore && (
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-green-400 to-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                {freelancer.recommendationScore}% Match
              </div>
            )}
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">{freelancer.name.charAt(0)}</span>
                </div>
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
            
            <div className="flex space-x-2">
              <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-xl font-medium hover:from-blue-500 hover:to-blue-600 transition-all duration-300">
                View Profile
              </button>
              <button className="px-4 py-2 border-2 border-green-500 text-green-500 rounded-xl font-medium hover:bg-green-500 hover:text-white transition-all duration-300">
                Contact
              </button>
            </div>
          </div>
        ))}
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
            <button className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-2 rounded-lg font-semibold transition-colors">
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
            {activeTab === "profile" && renderProfile()}
          </div>
        </div>
    </div>
  );
}

export default ClientDashboard;

