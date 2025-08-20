import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ServicesPage() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [showHireModal, setShowHireModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isFreelancer, setIsFreelancer] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Form state for posting a job
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    duration: '',
    skills: '',
    portfolio: ''
  });

  // Categories for filtering
  const categories = [
    'All',
    'Web Development',
    'Mobile Development',
    'Design',
    'Writing',
    'Marketing',
    'Data Analysis',
    'Video & Animation',
    'Music & Audio',
    'Programming',
    'Business',
    'Other'
  ];

  // Mock data for services (in real app, this would come from API)
  const mockServices = [
    {
      id: 1,
      title: 'Professional Website Development',
      description: 'I will create a modern, responsive website using React and Node.js. Includes SEO optimization and mobile-first design.',
      category: 'Web Development',
      price: 500,
      duration: '2 weeks',
      skills: 'React, Node.js, MongoDB, SEO',
      freelancer: {
        name: 'Alex Johnson',
        rating: 4.8,
        reviews: 127,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
      },
      status: 'approved',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      title: 'Logo Design & Brand Identity',
      description: 'Professional logo design with brand guidelines. Includes multiple concepts and unlimited revisions.',
      category: 'Design',
      price: 150,
      duration: '1 week',
      skills: 'Adobe Illustrator, Photoshop, Branding',
      freelancer: {
        name: 'Sarah Chen',
        rating: 4.9,
        reviews: 89,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
      },
      status: 'approved',
      createdAt: '2024-01-14'
    },
    {
      id: 3,
      title: 'Content Writing & SEO',
      description: 'High-quality content writing for blogs, websites, and social media. Includes SEO optimization and keyword research.',
      category: 'Writing',
      price: 80,
      duration: '3 days',
      skills: 'Content Writing, SEO, Copywriting',
      freelancer: {
        name: 'Michael Rodriguez',
        rating: 4.7,
        reviews: 156,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
      },
      status: 'pending',
      createdAt: '2024-01-16'
    }
  ];

  useEffect(() => {
    // Load user data from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    
    if (userData) {
      setIsAdmin(userData.userType === 'admin');
      setIsFreelancer(userData.userType === 'freelancer');
      setIsClient(userData.userType === 'client');
    }

    // Load services (in real app, this would be an API call)
    setServices(mockServices);
    setFilteredServices(mockServices);
  }, []);

  useEffect(() => {
    // Filter services based on category and search query
    let filtered = services;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.skills.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  }, [services, selectedCategory, searchQuery]);

  const handlePostJob = (e) => {
    e.preventDefault();
    
    const newJob = {
      id: Date.now(),
      ...jobForm,
      freelancer: {
        name: user?.firstName + ' ' + user?.lastName,
        rating: 0,
        reviews: 0,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
      },
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setServices(prev => [newJob, ...prev]);
    setShowPostJobModal(false);
    setJobForm({
      title: '',
      description: '',
      category: '',
      price: '',
      duration: '',
      skills: '',
      portfolio: ''
    });
  };

  const handleApproveService = (serviceId) => {
    setServices(prev => 
      prev.map(service => 
        service.id === serviceId 
          ? { ...service, status: 'approved' }
          : service
      )
    );
  };

  const handleRejectService = (serviceId) => {
    setServices(prev => 
      prev.filter(service => service.id !== serviceId)
    );
  };

  const handleHire = (service) => {
    setSelectedService(service);
    setShowHireModal(true);
  };

  const confirmHire = () => {
    // In real app, this would send a request to the backend
    alert(`You have successfully hired ${selectedService.freelancer.name} for ${selectedService.title}!`);
    setShowHireModal(false);
    setSelectedService(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 py-16">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Find the Perfect Service
            </h1>
            <p className="text-xl md:text-2xl text-yellow-100 mb-8 max-w-3xl mx-auto">
              Discover talented freelancers offering professional services at competitive prices
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for services, skills, or freelancers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 text-lg rounded-full border-2 border-white/20 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:border-white/40 backdrop-blur-sm"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Post Job Button for Freelancers */}
            {isFreelancer && (
              <button
                onClick={() => setShowPostJobModal(true)}
                className="bg-white text-yellow-600 px-8 py-3 rounded-full font-semibold hover:bg-yellow-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Post Your Service
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Available Services
            </h2>
            <p className="text-gray-300">
              {filteredServices.length} services found
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <div key={service.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                {/* Status Badge */}
                {service.status === 'pending' && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium">
                      Pending Approval
                    </span>
                  </div>
                )}

                {/* Service Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">{service.title}</h3>
                    <span className="text-2xl font-bold text-yellow-400">${service.price}</span>
                  </div>

                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {service.description}
                  </p>

                  <div className="flex items-center mb-4">
                    <img
                      src={service.freelancer.avatar}
                      alt={service.freelancer.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="text-white font-medium">{service.freelancer.name}</p>
                      <div className="flex items-center">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-4 h-4 ${i < Math.floor(service.freelancer.rating) ? 'text-yellow-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-gray-400 text-sm ml-2">
                          ({service.freelancer.reviews})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-400">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Duration: {service.duration}
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                      Skills: {service.skills}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {isClient && service.status === 'approved' && (
                      <button
                        onClick={() => handleHire(service)}
                        className="flex-1 bg-yellow-500 text-black py-2 px-4 rounded-lg font-semibold hover:bg-yellow-400 transition-colors duration-300"
                      >
                        Hire Now
                      </button>
                    )}
                    
                    {isAdmin && service.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApproveService(service.id)}
                          className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-400 transition-colors duration-300"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectService(service.id)}
                          className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-400 transition-colors duration-300"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    <Link
                      to={`/service/${service.id}`}
                      className="flex-1 bg-gray-700 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-300 text-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No services found</h3>
              <p className="text-gray-500">Try adjusting your search or category filter</p>
            </div>
          )}
        </div>
      </section>

      {/* Post Job Modal */}
      {showPostJobModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Post Your Service</h2>
              <button
                onClick={() => setShowPostJobModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handlePostJob} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Service Title
                </label>
                <input
                  type="text"
                  required
                  value={jobForm.title}
                  onChange={(e) => setJobForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                  placeholder="e.g., Professional Website Development"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={jobForm.description}
                  onChange={(e) => setJobForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                  placeholder="Describe your service in detail..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    required
                    value={jobForm.category}
                    onChange={(e) => setJobForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  >
                    <option value="">Select Category</option>
                    {categories.slice(1).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={jobForm.price}
                    onChange={(e) => setJobForm(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                    placeholder="100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    required
                    value={jobForm.duration}
                    onChange={(e) => setJobForm(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                    placeholder="e.g., 2 weeks"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Skills Required
                  </label>
                  <input
                    type="text"
                    required
                    value={jobForm.skills}
                    onChange={(e) => setJobForm(prev => ({ ...prev, skills: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                    placeholder="e.g., React, Node.js, MongoDB"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Portfolio Link (Optional)
                </label>
                <input
                  type="url"
                  value={jobForm.portfolio}
                  onChange={(e) => setJobForm(prev => ({ ...prev, portfolio: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                  placeholder="https://your-portfolio.com"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-yellow-500 text-black py-3 px-6 rounded-lg font-semibold hover:bg-yellow-400 transition-colors duration-300"
                >
                  Post Service
                </button>
                <button
                  type="button"
                  onClick={() => setShowPostJobModal(false)}
                  className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-500 transition-colors duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hire Modal */}
      {showHireModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Confirm Hire</h2>
              <p className="text-gray-300 mb-6">
                Are you sure you want to hire <span className="text-yellow-400 font-semibold">{selectedService.freelancer.name}</span> for <span className="text-yellow-400 font-semibold">{selectedService.title}</span>?
              </p>
              
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Service Price:</span>
                  <span className="text-2xl font-bold text-yellow-400">${selectedService.price}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Duration:</span>
                  <span className="text-white">{selectedService.duration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Freelancer Rating:</span>
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">{selectedService.freelancer.rating}</span>
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={confirmHire}
                  className="flex-1 bg-yellow-500 text-black py-3 px-6 rounded-lg font-semibold hover:bg-yellow-400 transition-colors duration-300"
                >
                  Confirm Hire
                </button>
                <button
                  onClick={() => setShowHireModal(false)}
                  className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-500 transition-colors duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServicesPage;
