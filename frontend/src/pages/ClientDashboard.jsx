import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

function ClientDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Project state
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
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
          ))}
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
    </div>
  );
}

export default ClientDashboard;
