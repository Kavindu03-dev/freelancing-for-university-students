import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

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

  const resources = [
    {
      id: 1,
      title: 'Complete Guide to Starting Your Freelance Career',
      description: 'Everything you need to know to launch your freelancing journey successfully.',
      category: 'Getting Started',
      type: 'Guide',
      readTime: '15 min',
      difficulty: 'Beginner',
      tags: ['freelancing', 'career', 'beginners'],
      featured: true,
      link: '#'
    },
    {
      id: 2,
      title: 'How to Write Winning Proposals',
      description: 'Master the art of proposal writing to win more clients and projects.',
      category: 'Best Practices',
      type: 'Tutorial',
      readTime: '10 min',
      difficulty: 'Intermediate',
      tags: ['proposals', 'clients', 'writing'],
      featured: true,
      link: '#'
    },
    {
      id: 3,
      title: 'Essential Tools Every Freelancer Needs',
      description: 'Discover the must-have tools and software to boost your productivity.',
      category: 'Tools & Software',
      type: 'Resource List',
      readTime: '8 min',
      difficulty: 'Beginner',
      tags: ['tools', 'productivity', 'software'],
      featured: true,
      link: '#'
    },
    {
      id: 4,
      title: 'Setting Your Freelance Rates: A Comprehensive Guide',
      description: 'Learn how to price your services competitively while ensuring profitability.',
      category: 'Pricing Strategies',
      type: 'Guide',
      readTime: '12 min',
      difficulty: 'Intermediate',
      tags: ['pricing', 'rates', 'business'],
      featured: false,
      link: '#'
    },
    {
      id: 5,
      title: 'Building Long-term Client Relationships',
      description: 'Strategies for maintaining and growing your client base over time.',
      category: 'Client Management',
      type: 'Article',
      readTime: '7 min',
      difficulty: 'Intermediate',
      tags: ['clients', 'relationships', 'retention'],
      featured: false,
      link: '#'
    },
    {
      id: 6,
      title: 'Freelance Contracts: What You Need to Know',
      description: 'Protect yourself and your business with proper legal documentation.',
      category: 'Legal & Contracts',
      type: 'Legal Guide',
      readTime: '20 min',
      difficulty: 'Advanced',
      tags: ['contracts', 'legal', 'protection'],
      featured: false,
      link: '#'
    },
    {
      id: 7,
      title: 'Marketing Your Freelance Services Online',
      description: 'Effective strategies to promote your services and attract clients.',
      category: 'Marketing',
      type: 'Strategy Guide',
      readTime: '14 min',
      difficulty: 'Intermediate',
      tags: ['marketing', 'promotion', 'online'],
      featured: false,
      link: '#'
    },
    {
      id: 8,
      title: 'Time Management for Freelancers',
      description: 'Master your schedule and increase productivity with proven techniques.',
      category: 'Best Practices',
      type: 'Tutorial',
      readTime: '9 min',
      difficulty: 'Beginner',
      tags: ['time management', 'productivity', 'organization'],
      featured: false,
      link: '#'
    },
    {
      id: 9,
      title: 'Building Your Personal Brand as a Freelancer',
      description: 'Create a strong personal brand that attracts your ideal clients.',
      category: 'Marketing',
      type: 'Branding Guide',
      readTime: '16 min',
      difficulty: 'Intermediate',
      tags: ['branding', 'marketing', 'personal brand'],
      featured: false,
      link: '#'
    },
    {
      id: 10,
      title: 'Scaling Your Freelance Business',
      description: 'Learn how to grow from solo freelancer to a successful agency.',
      category: 'Business Tips',
      type: 'Business Guide',
      readTime: '18 min',
      difficulty: 'Advanced',
      tags: ['scaling', 'business growth', 'agency'],
      featured: false,
      link: '#'
    }
  ];

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

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Freelancer Resources
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Everything you need to succeed as a freelancer - guides, tools, and expert advice
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  
                  <a
                    href={resource.link}
                    className="w-full bg-yellow-500 text-black py-3 px-4 rounded-lg font-semibold hover:bg-yellow-400 transition-colors duration-300 text-center block"
                  >
                    Read Now
                  </a>
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
              {selectedCategory === 'All' ? 'All Resources' : selectedCategory}
            </h2>
            <p className="text-gray-600">
              {filteredResources.length} resources found
            </p>
          </div>

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
                  
                  <a
                    href={resource.link}
                    className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-300 text-center block"
                  >
                    Read Article
                  </a>
                </div>
              </div>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-500 mb-2">No resources found</h3>
              <p className="text-gray-400">Try adjusting your search or category filter</p>
            </div>
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

      {/* Newsletter Signup */}
      <section className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Stay Updated</h2>
          <p className="text-xl mb-8 text-gray-300">
            Get the latest freelancing tips, resources, and opportunities delivered to your inbox
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                autoComplete="off"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-yellow-500"
              />
              <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold transition-colors duration-300">
                Subscribe
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-3">
              No spam, unsubscribe at any time
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}

export default ResourcesPage;
