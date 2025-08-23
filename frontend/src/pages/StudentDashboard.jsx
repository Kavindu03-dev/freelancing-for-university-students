import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [studentData, setStudentData] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Mock data
  const [stats] = useState({
    completedProjects: 12,
    activeProjects: 3,
    totalEarnings: 2800,
    skillsCount: 8
  });

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

  // Mock data for available opportunities
  const [availableOpportunities] = useState([
    {
      id: 1,
      title: "Website Redesign for E-commerce",
      client: "Tech Corp",
      type: "Project",
      category: "Web Development",
      budget: 800,
      deadline: "2024-02-15",
      location: "Remote",
      requiredSkills: ["React", "Node.js", "MongoDB"],
      degreeField: "Computer Science",
      description: "Redesign an existing e-commerce website with modern UI/UX",
      postedDate: "2024-01-15",
      tags: ["web development", "e-commerce", "UI/UX", "frontend"],
      degreeRelevance: 95,
      isBookmarked: false
    },
    {
      id: 2,
      title: "Logo Design for Startup",
      client: "Startup Inc",
      type: "Project",
      category: "Graphic Design",
      budget: 300,
      deadline: "2024-01-30",
      location: "Remote",
      requiredSkills: ["Adobe Illustrator", "Logo Design"],
      degreeField: "Graphic Design",
      description: "Create a modern logo for a tech startup",
      postedDate: "2024-01-10",
      tags: ["graphic design", "logo", "branding", "creative"],
      degreeRelevance: 85,
      isBookmarked: true
    },
    {
      id: 3,
      title: "Data Analysis Internship",
      client: "Research Corp",
      type: "Internship",
      category: "Data Analysis",
      budget: 500,
      deadline: "2024-03-01",
      location: "Hybrid",
      requiredSkills: ["Python", "Pandas", "SQL"],
      degreeField: "Computer Science",
      description: "Analyze customer data and create insights reports",
      postedDate: "2024-01-12",
      tags: ["data analysis", "python", "research", "analytics"],
      degreeRelevance: 90,
      isBookmarked: false
    },
    {
      id: 4,
      title: "Content Writing for Tech Blog",
      client: "Tech Media",
      type: "Freelance",
      category: "Content Writing",
      budget: 150,
      deadline: "2024-02-20",
      location: "Remote",
      requiredSkills: ["Content Writing", "SEO", "Technical Writing"],
      degreeField: "Communications",
      description: "Write engaging technical articles for a popular tech blog",
      postedDate: "2024-01-18",
      tags: ["content writing", "tech", "SEO", "blogging"],
      degreeRelevance: 70,
      isBookmarked: false
    },
    {
      id: 5,
      title: "Mobile App UI/UX Design",
      client: "App Studio",
      type: "Project",
      category: "UI/UX Design",
      budget: 1200,
      deadline: "2024-03-15",
      location: "Remote",
      requiredSkills: ["Figma", "UI/UX Design", "Mobile Design"],
      degreeField: "Design",
      description: "Design user interface and experience for a mobile fitness app",
      postedDate: "2024-01-20",
      tags: ["UI/UX", "mobile", "design", "fitness"],
      degreeRelevance: 80,
      isBookmarked: false
    },
    {
      id: 6,
      title: "Part-time Marketing Assistant",
      client: "Growth Marketing",
      type: "Part-time Job",
      category: "Marketing",
      budget: 25,
      deadline: "2024-02-28",
      location: "On-site",
      requiredSkills: ["Marketing", "Social Media", "Analytics"],
      degreeField: "Business",
      description: "Assist with social media marketing and campaign analytics",
      postedDate: "2024-01-22",
      tags: ["marketing", "social media", "analytics", "part-time"],
      degreeRelevance: 75,
      isBookmarked: true
    }
  ]);

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

  // Bookmarked opportunities
  const [bookmarkedOpportunities, setBookmarkedOpportunities] = useState(
    availableOpportunities && Array.isArray(availableOpportunities) ? availableOpportunities.filter(opp => opp.isBookmarked) : []
  );

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
    setAvailableOpportunities(prev => {
      if (!prev || !Array.isArray(prev)) return prev;
      return prev.map(opp => 
        opp.id === opportunityId ? { ...opp, isBookmarked: !opp.isBookmarked } : opp
      );
    });
    
    setBookmarkedOpportunities(prev => {
      if (!availableOpportunities || !Array.isArray(availableOpportunities)) return prev;
      const opportunity = availableOpportunities.find(opp => opp.id === opportunityId);
      if (!opportunity) return prev;
      if (opportunity.isBookmarked) {
        return prev && Array.isArray(prev) ? prev.filter(opp => opp.id !== opportunityId) : [];
      } else {
        return prev && Array.isArray(prev) ? [...prev, { ...opportunity, isBookmarked: true }] : [{ ...opportunity, isBookmarked: true }];
      }
    });
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

  // Calculate profile completeness
  const calculateProfileCompleteness = (studentData) => {
    if (!studentData) return 0;
    
    const fields = [
      studentData.firstName, studentData.lastName, studentData.email,
      studentData.degreeProgram, studentData.university, studentData.gpa,
      studentData.graduationYear, studentData.technicalSkills
    ];
    
    const completedFields = fields.filter(field => {
      if (field === null || field === undefined) return false;
      if (typeof field === 'string') return field.trim() !== '';
      if (typeof field === 'number') return field > 0;
      return Boolean(field);
    }).length;
    return Math.round((completedFields / fields.length) * 100);
  };

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

  const [applications] = useState([
    {
      id: 1,
      postId: 1,
      postTitle: "Website Redesign for E-commerce",
      status: "Pending",
      appliedDate: "2024-01-16"
    },
    {
      id: 2,
      postId: 2,
      postTitle: "Logo Design for Startup",
      status: "Shortlisted",
      appliedDate: "2024-01-11"
    }
  ]);

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

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsed = JSON.parse(userData);
      if (parsed.userType === 'student') {
        setStudentData(parsed);
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
            if (tabParam && ['overview', 'recommendations', 'opportunities', 'bookmarks', 'applications', 'portfolio', 'skills', 'profile'] && Array.isArray(['overview', 'recommendations', 'opportunities', 'bookmarks', 'applications', 'portfolio', 'skills', 'profile']) && ['overview', 'recommendations', 'opportunities', 'bookmarks', 'applications', 'portfolio', 'skills', 'profile'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('userToken');
    navigate('/');
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.completedProjects}</h3>
          <p className="text-gray-600">Completed Projects</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.activeProjects}</h3>
          <p className="text-gray-600">Active Projects</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-purple-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">${stats.totalEarnings}</h3>
          <p className="text-gray-600">Total Earnings</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-orange-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{profileCompleteness}%</h3>
          <p className="text-gray-600">Profile Complete</p>
        </div>
      </div>

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
      {recommendations && Array.isArray(recommendations) && recommendations.length > 0 && (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations && Array.isArray(recommendations) ? recommendations.slice(0, 3).map(opportunity => (
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
                  <span className="text-xs font-bold text-green-600">{opportunity.recommendationScore}% Match</span>
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">{opportunity.title}</h4>
                <p className="text-gray-600 text-xs mb-2">{opportunity.client}</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-green-600 font-semibold">${opportunity.budget}</span>
                  <span className="text-gray-500">{opportunity.skillMatchCount}/{opportunity.totalSkills} skills</span>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                <p>No recommendations available</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderBrowseOpportunities = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900">Available Opportunities</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab("bookmarks")}
            className="px-4 py-2 bg-yellow-500 text-white rounded-xl font-medium hover:bg-yellow-600 transition-all duration-300"
          >
            📚 Bookmarks ({bookmarkedOpportunities && Array.isArray(bookmarkedOpportunities) ? bookmarkedOpportunities.length : 0})
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
                  className={`text-2xl transition-all duration-300 ${
                    opportunity.isBookmarked ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                  }`}
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

  const renderApplications = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900">My Applications</h3>
      
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opportunity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications && Array.isArray(applications) ? applications.map(app => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{app.postTitle}</div>
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
                  <td className="px-6 py-4 text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">
                      View Details
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    No applications yet
                  </td>
                </tr>
              )}
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
          <h3 className="text-2xl font-bold text-gray-900">Recommended for You</h3>
          <p className="text-gray-600 mt-2">Based on your skills, degree, and profile completeness</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Profile Completeness</div>
          <div className="text-2xl font-bold text-blue-600">{profileCompleteness}%</div>
        </div>
      </div>

      {/* Profile Completeness Bar */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-lg font-semibold text-gray-900">Complete Your Profile</h4>
          <span className="text-sm text-gray-600">{profileCompleteness}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-400 to-blue-500 h-3 rounded-full transition-all duration-500" 
            style={{ width: `${profileCompleteness}%` }}
          ></div>
        </div>
        {profileCompleteness < 100 && (
          <p className="text-sm text-gray-600 mt-2">
            Complete your profile to get better recommendations and increase your chances of being hired!
          </p>
        )}
      </div>

      {recommendations && Array.isArray(recommendations) && recommendations.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-200">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No recommendations yet</h3>
          <p className="text-gray-600 mb-6">
            {profileCompleteness < 50 
              ? "Complete your profile to get personalized recommendations!" 
              : "Try updating your skills or browse all opportunities to find relevant projects."
            }
          </p>
          <button
            onClick={() => setActiveTab("profile")}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-all duration-300"
          >
            {profileCompleteness < 50 ? "Complete Profile" : "Browse All Opportunities"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {recommendations && Array.isArray(recommendations) ? recommendations.map(opportunity => (
            <div key={opportunity.id} className="bg-white rounded-2xl shadow-xl border border-blue-200 p-6 hover:shadow-2xl transition-shadow duration-300 relative">
              {/* Recommendation Score Badge */}
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-green-400 to-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                {opportunity.recommendationScore}% Match
              </div>
              
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
                    {opportunity.degreeRelevance}% Degree Match
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleBookmark(opportunity.id)}
                    className={`text-2xl transition-all duration-300 ${
                      opportunity.isBookmarked ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                    }`}
                  >
                    {opportunity.isBookmarked ? '★' : '☆'}
                  </button>
                  <span className="text-sm text-gray-500">{opportunity.postedDate}</span>
                </div>
              </div>
              
              <h4 className="text-lg font-bold text-gray-900 mb-2">{opportunity.title}</h4>
              <p className="text-gray-600 text-sm mb-3">{opportunity.client}</p>
              
              {/* Skills Match Indicator */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Skills Match:</span>
                  <span className="text-sm font-semibold text-green-600">
                    {opportunity.skillMatchCount}/{opportunity.totalSkills} skills
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${(opportunity.skillMatchCount / opportunity.totalSkills) * 100}%` }}
                  ></div>
                </div>
              </div>
              
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
                      <span key={skill} className={`px-2 py-1 text-xs rounded-full ${
                        studentData?.technicalSkills && typeof studentData.technicalSkills === 'string' && studentData.technicalSkills.toLowerCase().includes(skill.toLowerCase())
                          ? 'bg-green-100 text-green-800 border border-green-300'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
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
                className="w-full px-4 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-xl font-medium hover:from-green-500 hover:to-green-600 transition-all duration-300"
              >
                Apply Now - Perfect Match!
              </button>
            </div>
          )) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No recommendations available</p>
            </div>
          )}
        </div>
      )}
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
                    className="text-2xl text-yellow-500 transition-all duration-300"
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

  const renderPortfolio = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900">Project Portfolio</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeProjects && recentProjects && Array.isArray(activeProjects) && Array.isArray(recentProjects) ? 
          [...activeProjects, ...recentProjects].map(project => (
          <div key={project.id} className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
            <h4 className="text-lg font-bold text-gray-900 mb-2">{project.title}</h4>
            <p className="text-gray-600 text-sm mb-3">{project.client}</p>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-500">Earnings: ${project.earnings}</span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                project.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {project.status}
              </span>
            </div>
            {project.progress && (
              <div className="mb-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{project.progress}% Complete</p>
              </div>
            )}
            <button className="w-full px-4 py-2 border-2 border-blue-500 text-blue-500 rounded-xl font-medium hover:bg-blue-500 hover:text-white transition-all duration-300">
              View Details
            </button>
          </div>
        )) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No projects available</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900">Skills Management</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills && Array.isArray(skills) ? skills.map(skill => (
          <div key={skill.name} className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold text-gray-900">{skill.name}</h4>
              <span className={`px-2 py-1 text-xs rounded-full ${
                skill.level === 'Advanced' ? 'bg-green-100 text-green-800' :
                skill.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {skill.level}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">Used in {skill.projects} projects</p>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600">
                Update Level
              </button>
              <button className="w-full px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50">
                View Projects
              </button>
            </div>
          </div>
        )) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No skills added yet</p>
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
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-4xl font-bold text-black">
              {studentData?.firstName && typeof studentData.firstName === 'string' ? studentData.firstName.charAt(0) : 'S'}{studentData?.lastName && typeof studentData.lastName === 'string' ? studentData.lastName.charAt(0) : 'T'}
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full"></div>
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
                <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>4.9 (12 reviews)</span>
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
              Passionate {studentData?.degreeProgram || 'student'} with expertise in web development and design. 
              Looking for freelance opportunities to gain real-world experience and build a strong portfolio.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3">
            <button className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-2 rounded-lg font-semibold transition-colors">
              Edit Profile
            </button>
            <button className="bg-white hover:bg-gray-100 text-gray-800 px-6 py-2 rounded-lg font-semibold transition-colors">
              View Portfolio
            </button>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Academic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={`${studentData?.firstName || ''} ${studentData?.lastName || ''}`}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  value={studentData?.email || ''}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Degree Program</label>
                <input 
                  type="text" 
                  value={studentData?.degreeProgram || ''}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">University</label>
                <input 
                  type="text" 
                  value={studentData?.university || ''}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GPA</label>
                <input 
                  type="text" 
                  value={studentData?.gpa || ''}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
                <input 
                  type="text" 
                  value={studentData?.graduationYear || ''}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                  readOnly
                />
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
                  defaultValue="Passionate student with strong technical skills in web development, design, and programming. Eager to work on real-world projects and build a professional portfolio."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                  placeholder="$15-25/hour"
                  defaultValue="$20/hour"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Completed Projects</span>
                <span className="font-bold text-yellow-600">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Earnings</span>
                <span className="font-bold text-green-600">$2,800</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Client Rating</span>
                <span className="font-bold text-yellow-600">4.9/5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Response Time</span>
                <span className="font-bold text-yellow-600">2 hours</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {studentData?.technicalSkills && Array.isArray(studentData.technicalSkills) ? studentData.technicalSkills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  {skill}
                </span>
              )) : (
                <>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">React</span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Node.js</span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Python</span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">UI/UX Design</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
              { id: "bookmarks", name: "Bookmarks", icon: "📚" },
              { id: "applications", name: "My Applications", icon: "📝" },
              { id: "portfolio", name: "Portfolio", icon: "💼" },
              { id: "skills", name: "Skills", icon: "🛠️" },
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
            {activeTab === "opportunities" && renderBrowseOpportunities()}
            {activeTab === "bookmarks" && renderBookmarks()}
            {activeTab === "applications" && renderApplications()}
            {activeTab === "portfolio" && renderPortfolio()}
            {activeTab === "skills" && renderSkills()}
            {activeTab === "profile" && renderProfile()}
          </div>
        </div>

      {showApplicationForm && renderApplicationForm()}
    </div>
  );
}

export default StudentDashboard;

