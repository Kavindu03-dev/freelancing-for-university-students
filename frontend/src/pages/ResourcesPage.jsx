import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

function ResourcesPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const resourceCategories = [
    'All',
    'Getting Started',
    'Best Practices',
    'Tools & Software',
    'Business Tips',
    'Marketing',
    'Legal & Contracts',
    'Pricing Strategies',
    'Client Management'
  ];

  const resourceDifficulties = [
    'All',
    'Beginner',
    'Intermediate',
    'Advanced'
  ];

  const resourceTypes = [
    'All',
    'Guide',
    'Tutorial',
    'Article',
    'Resource List',
    'Legal Guide',
    'Strategy Guide',
    'Branding Guide',
    'Business Guide'
  ];

  // Fetch resources from backend
  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/resources');
      
      if (response.ok) {
        const data = await response.json();
        setResources(data.data || []);
      } else {
        setError('Failed to fetch resources');
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
      setError('Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  };

  // Fetch resources on component mount
  useEffect(() => {
    fetchResources();
  }, []);

  const tools = [
    {
      name: 'Figma',
      description: 'Collaborative design tool for UI/UX',
      category: 'Design',
      pricing: 'Free + Paid',
      rating: 4.8,
      link: 'https://figma.com'
    },
    {
      name: 'Trello',
      description: 'Project management and organization',
      category: 'Productivity',
      pricing: 'Free + Paid',
      rating: 4.6,
      link: 'https://trello.com'
    },
    {
      name: 'Slack',
      description: 'Team communication and collaboration',
      category: 'Communication',
      pricing: 'Free + Paid',
      rating: 4.7,
      link: 'https://slack.com'
    },
    {
      name: 'Canva',
      description: 'Graphic design made simple',
      category: 'Design',
      pricing: 'Free + Paid',
      rating: 4.5,
      link: 'https://canva.com'
    },
    {
      name: 'Zoom',
      description: 'Video conferencing and meetings',
      category: 'Communication',
      pricing: 'Free + Paid',
      rating: 4.4,
      link: 'https://zoom.us'
    },
    {
      name: 'Google Workspace',
      description: 'Productivity suite for business',
      category: 'Productivity',
      pricing: 'Paid',
      rating: 4.6,
      link: 'https://workspace.google.com'
    }
  ];

  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      // Category filter
      const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
      
      // Difficulty filter
      const matchesDifficulty = selectedDifficulty === 'All' || resource.difficulty === selectedDifficulty;
      
      // Type filter
      const matchesType = selectedType === 'All' || resource.type === selectedType;
      
      // Search filter
      const matchesSearch = searchQuery === '' || (() => {
        const query = searchQuery.toLowerCase();
        const titleMatch = resource.title && resource.title.toLowerCase().includes(query);
        const descMatch = resource.description && resource.description.toLowerCase().includes(query);
        const tagsMatch = resource.tags && Array.isArray(resource.tags) && 
          resource.tags.some(tag => tag.toLowerCase().includes(query));
        const categoryMatch = resource.category && resource.category.toLowerCase().includes(query);
        const typeMatch = resource.type && resource.type.toLowerCase().includes(query);
        const difficultyMatch = resource.difficulty && resource.difficulty.toLowerCase().includes(query);
        const readTimeMatch = resource.readTime && resource.readTime.toLowerCase().includes(query);
        
        return titleMatch || descMatch || tagsMatch || categoryMatch || typeMatch || difficultyMatch || readTimeMatch;
      })();
      
      return matchesCategory && matchesDifficulty && matchesType && matchesSearch;
    });
  }, [resources, selectedCategory, selectedDifficulty, selectedType, searchQuery]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Guide': return '📚';
      case 'Tutorial': return '🎯';
      case 'Article': return '📝';
      case 'Resource List': return '📋';
      case 'Legal Guide': return '⚖️';
      case 'Strategy Guide': return '🎯';
      case 'Branding Guide': return '🎨';
      case 'Business Guide': return '💼';
      default: return '📄';
    }
  };

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setSelectedType('All');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-900 via-green-700 to-green-500 text-white py-12 relative">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Freelancer Resources
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-6 max-w-4xl mx-auto">
              Everything you need to succeed as a freelancer - guides, tools, and expert advice
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search resources, guides, and tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 text-lg rounded-full border-2 border-yellow-500 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:border-yellow-400 backdrop-blur-sm"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-12 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Categories</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {resourceCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-yellow-500 text-black shadow-lg'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Filters */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            {/* Difficulty Filter */}
            <div className="flex flex-col items-center">
              <label className="text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              >
                {resourceDifficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex flex-col items-center">
              <label className="text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              >
                {resourceTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters Button */}
            {(selectedCategory !== 'All' || selectedDifficulty !== 'All' || selectedType !== 'All' || searchQuery) && (
              <div className="flex flex-col items-center">
                <label className="text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Active Filters Display */}
          {(selectedCategory !== 'All' || selectedDifficulty !== 'All' || selectedType !== 'All' || searchQuery) && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Showing {filteredResources.length} of {resources.length} resources
                {searchQuery && ` matching "${searchQuery}"`}
                {selectedCategory !== 'All' && ` in "${selectedCategory}" category`}
                {selectedDifficulty !== 'All' && ` with "${selectedDifficulty}" difficulty`}
                {selectedType !== 'All' && ` of "${selectedType}" type`}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Featured Resources</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {resources.filter(resource => resource.featured).map((resource) => (
              <div key={resource.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border-2 border-yellow-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl">{getTypeIcon(resource.type)}</div>
                    <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                      Featured
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{resource.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{resource.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(resource.difficulty)}`}>
                      {resource.difficulty}
                    </span>
                    <span className="text-sm text-gray-500">{resource.readTime} read</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {resource.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => navigate(`/resource/${resource._id}`)}
                    className="w-full bg-yellow-500 text-black py-3 px-4 rounded-lg font-semibold hover:bg-yellow-400 transition-colors duration-300 text-center block"
                  >
                    Read Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Resources */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {selectedCategory === 'All' && selectedDifficulty === 'All' && selectedType === 'All' && !searchQuery 
                ? 'All Resources' 
                : 'Filtered Resources'
              }
            </h2>
          </div>

          {loading && (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-500 mb-2">Loading resources...</h3>
              <p className="text-gray-400">Please wait while we fetch the latest resources</p>
            </div>
          )}

          {error && (
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-500 mb-2">Error loading resources</h3>
              <p className="text-gray-400 mb-4">{error}</p>
              <button 
                onClick={fetchResources}
                className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors duration-300"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              {filteredResources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResources.map((resource) => (
                  <div key={resource.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-2xl">{getTypeIcon(resource.type)}</div>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {resource.type}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{resource.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">{resource.description}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
                          {resource.difficulty}
                        </span>
                        <span className="text-xs text-gray-500">{resource.readTime}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {resource.tags.slice(0, 2).map((tag, index) => (
                          <span key={index} className="bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => navigate(`/resource/${resource._id}`)}
                        className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-300 text-center block"
                      >
                        Read Article
                      </button>
                    </div>
                  </div>
                ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-500 mb-2">No resources found</h3>
                  <p className="text-gray-400 mb-4">
                    {resources.length === 0 
                      ? 'No resources are available at the moment.'
                      : 'Try adjusting your search terms or filters.'
                    }
                  </p>
                  {(selectedCategory !== 'All' || selectedDifficulty !== 'All' || selectedType !== 'All' || searchQuery) && (
                    <button
                      onClick={clearAllFilters}
                      className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors duration-300"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Recommended Tools */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Recommended Tools</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{tool.name}</h3>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-600">{tool.rating}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{tool.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {tool.category}
                  </span>
                  <span className="text-sm text-gray-500">{tool.pricing}</span>
                </div>
                
                <a
                  href={tool.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-yellow-500 text-black py-2 px-4 rounded-lg font-semibold hover:bg-yellow-400 transition-colors duration-300 text-center block"
                >
                  Visit Tool
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      

    </div>
  );
}

export default ResourcesPage;
