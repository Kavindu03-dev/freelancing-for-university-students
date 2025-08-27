import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ResourceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [recentResources, setRecentResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:5000/api/resources/${id}`);
        
        if (response.ok) {
          const data = await response.json();
          setResource(data.data);
          // Trigger animation after data loads
          setTimeout(() => setIsVisible(true), 100);
        } else {
          setError('Resource not found');
        }
      } catch (error) {
        console.error('Error fetching resource:', error);
        setError('Failed to fetch resource');
      } finally {
        setLoading(false);
      }
    };

    const fetchRecentResources = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/resources');
        if (response.ok) {
          const data = await response.json();
          // Get the 2 most recent resources, excluding the current one
          const recent = data.data
            .filter(r => r._id !== id)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 2);
          setRecentResources(recent);
        }
      } catch (error) {
        console.error('Error fetching recent resources:', error);
      }
    };

    if (id) {
      fetchResource();
      fetchRecentResources();
    }
  }, [id]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Intermediate': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Advanced': return 'text-rose-600 bg-rose-50 border-rose-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '🌱';
      case 'Intermediate': return '🚀';
      case 'Advanced': return '⚡';
      default: return '📚';
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

  const getCategoryColor = (category) => {
    const colors = {
      'Getting Started': 'bg-blue-50 text-blue-700 border-blue-200',
      'Best Practices': 'bg-green-50 text-green-700 border-green-200',
      'Tools & Software': 'bg-purple-50 text-purple-700 border-purple-200',
      'Business Tips': 'bg-orange-50 text-orange-700 border-orange-200',
      'Marketing': 'bg-pink-50 text-pink-700 border-pink-200',
      'Legal & Contracts': 'bg-red-50 text-red-700 border-red-200',
      'Pricing Strategies': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'Client Management': 'bg-teal-50 text-teal-700 border-teal-200'
    };
    return colors[category] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent mx-auto mb-6"></div>
              <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-yellow-600 animate-ping mx-auto"></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">Loading Resource</h3>
            <p className="text-gray-500 text-lg">Preparing an amazing learning experience for you...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md mx-auto">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Resource Not Found</h3>
              <p className="text-gray-600 mb-8">{error || 'The resource you are looking for does not exist.'}</p>
              <button 
                onClick={() => navigate('/resources')}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-8 py-3 rounded-xl font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Back to Resources
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-20">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button 
          onClick={() => navigate('/resources')}
          className="group flex items-center text-gray-600 hover:text-gray-800 transition-all duration-300 mb-6 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm hover:shadow-md"
        >
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Resources
        </button>
      </div>

      {/* Main Content */}
      <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-white via-yellow-50 to-orange-50 rounded-3xl shadow-2xl overflow-hidden mb-8 border border-yellow-100">
          <div className="relative p-8 md:p-12">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-400 rounded-full translate-y-12 -translate-x-12"></div>
            </div>
            
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="text-6xl animate-bounce">{getTypeIcon(resource.type)}</div>
                <div className="flex items-center space-x-3">
                  {resource.featured && (
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                      ⭐ Featured
                    </span>
                  )}
                  <span className="bg-white/80 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-full text-sm font-semibold border border-gray-200">
                    {resource.type}
                  </span>
                </div>
              </div>
              
              {/* Title */}
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                {resource.title}
              </h1>
              
              {/* Description */}
              <p className="text-xl text-gray-600 leading-relaxed max-w-4xl">
                {resource.description}
              </p>
            </div>
          </div>
        </div>

        {/* Resource Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              
              {/* Meta Information Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-blue-600">Read Time</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{resource.readTime}</p>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-xl">{getDifficultyIcon(resource.difficulty)}</span>
                    </div>
                    <span className="text-sm font-medium text-emerald-600">Difficulty</span>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getDifficultyColor(resource.difficulty)}`}>
                    {resource.difficulty}
                  </span>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-purple-600">Category</span>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getCategoryColor(resource.category)}`}>
                    {resource.category}
                  </span>
                </div>
              </div>

              {/* Tags Section */}
              {resource.tags && resource.tags.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Related Topics
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {resource.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium border border-gray-200 hover:from-gray-200 hover:to-gray-300 transition-all duration-300 cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Publication Date */}
              {resource.createdAt && (
                <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Published
                  </h3>
                  <p className="text-gray-600 text-lg">{formatDate(resource.createdAt)}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-black py-4 px-8 rounded-xl font-bold hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 transform hover:scale-105 shadow-lg text-center group"
                >
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Read Full Article
                  </span>
                </a>
                <button
                  onClick={() => navigate('/resources')}
                  className="flex-1 bg-white text-gray-700 py-4 px-8 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 border-2 border-gray-200 hover:border-gray-300 transform hover:scale-105 shadow-lg"
                >
                  Browse More Resources
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Type</span>
                  <span className="font-semibold text-gray-800">{resource.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="font-semibold text-gray-800">{resource.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Difficulty</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(resource.difficulty)}`}>
                    {resource.difficulty}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Read Time</span>
                  <span className="font-semibold text-gray-800">{resource.readTime}</span>
                </div>
              </div>
            </div>

                         {/* Share Section */}
             <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-6 border border-blue-100">
               <h3 className="text-lg font-bold text-gray-800 mb-4">Share This Resource</h3>
               <div className="flex space-x-3">
                 <a
                   href={`https://wa.me/?text=${encodeURIComponent(`Check out this amazing resource: ${resource.title} - ${window.location.href}`)}`}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="flex-1 bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center justify-center"
                   title="Share on WhatsApp"
                 >
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                   </svg>
                 </a>
                 <a
                   href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(resource.title)}&summary=${encodeURIComponent(resource.description)}`}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
                   title="Share on LinkedIn"
                 >
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                   </svg>
                 </a>
                 <a
                   href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(resource.title)}`}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="flex-1 bg-blue-800 text-white p-3 rounded-lg hover:bg-blue-900 transition-colors duration-300 flex items-center justify-center"
                   title="Share on Facebook"
                 >
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                   </svg>
                 </a>
               </div>
             </div>

                         {/* Related Resources */}
             <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
               <h3 className="text-lg font-bold text-gray-800 mb-4">You Might Also Like</h3>
               <div className="space-y-3">
                 {recentResources.length > 0 ? (
                   recentResources.map((recentResource) => (
                     <div 
                       key={recentResource._id}
                       onClick={() => navigate(`/resource/${recentResource._id}`)}
                       className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-300 cursor-pointer border border-gray-200 hover:border-gray-300 hover:shadow-md transform hover:scale-105"
                     >
                       <div className="flex items-start justify-between mb-2">
                         <div className="text-2xl mr-3">{getTypeIcon(recentResource.type)}</div>
                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recentResource.difficulty)}`}>
                           {recentResource.difficulty}
                         </span>
                       </div>
                       <h4 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">
                         {recentResource.title}
                       </h4>
                       <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                         {recentResource.description}
                       </p>
                       <div className="flex items-center justify-between">
                         <span className="text-xs text-gray-500">{recentResource.category}</span>
                         <span className="text-xs text-gray-500">{recentResource.readTime}</span>
                       </div>
                     </div>
                   ))
                 ) : (
                   <div className="text-center py-6">
                     <div className="text-gray-400 mb-2">
                       <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                       </svg>
                     </div>
                     <p className="text-sm text-gray-500">No other resources available</p>
                   </div>
                 )}
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResourceDetailPage;
