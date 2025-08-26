import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function FreelancerProfilePopup({ freelancer, isOpen, onClose, onContact }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !freelancer) return null;

  const handleContact = () => {
    onContact(freelancer);
    onClose();
  };

  const handleViewMessages = () => {
    // Navigate to messages page with the freelancer's conversation
    navigate(`/messages?freelancer=${freelancer.id}`);
    onClose();
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="text-center">
        {freelancer.profileImage ? (
          <img 
            src={freelancer.profileImage} 
            alt={freelancer.name}
            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
          />
        ) : (
          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-bold text-2xl">{freelancer.name.charAt(0)}</span>
          </div>
        )}
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{freelancer.name}</h2>
        <p className="text-gray-600 mb-1">{freelancer.university}</p>
        <p className="text-blue-600 font-medium mb-3">{freelancer.degreeProgram}</p>
        
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className="flex items-center">
            <span className="text-yellow-500 text-xl mr-1">★</span>
            <span className="font-semibold">{freelancer.rating}</span>
            <span className="text-gray-500 text-sm ml-1">({freelancer.completedProjects} reviews)</span>
          </div>
          <div className="flex items-center">
            <span className="text-green-600 font-semibold">${freelancer.hourlyRate}/hr</span>
          </div>
        </div>

        <div className="flex justify-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            freelancer.availability === 'Available' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {freelancer.availability}
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {freelancer.completedProjects} projects
          </span>
        </div>
      </div>

      {/* Skills */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {freelancer.skills.map(skill => (
            <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Experience & Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Experience</h4>
          <p className="text-gray-600 text-sm">{freelancer.experience}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Profile Complete</h4>
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${freelancer.profileCompleteness}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium">{freelancer.profileCompleteness}%</span>
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      {freelancer.portfolio && freelancer.portfolio.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Projects</h3>
          <div className="space-y-3">
            {freelancer.portfolio.slice(0, 3).map((project, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3">
                <h4 className="font-medium text-gray-900 mb-1">{project.title || `Project ${index + 1}`}</h4>
                <p className="text-gray-600 text-sm mb-2">{project.description || 'Project description'}</p>
                {project.technologies && (
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 3).map(tech => (
                      <span key={tech} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderPortfolio = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio</h3>
      {freelancer.portfolio && freelancer.portfolio.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {freelancer.portfolio.map((project, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">{project.title || `Project ${index + 1}`}</h4>
              <p className="text-gray-600 text-sm mb-3">{project.description || 'Project description'}</p>
              {project.technologies && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.technologies.map(tech => (
                    <span key={tech} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
              {project.link && (
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Project →
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-4">📁</div>
          <p className="text-gray-600">No portfolio items available</p>
        </div>
      )}
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Reviews</h3>
      {freelancer.reviews && freelancer.reviews.length > 0 ? (
        <div className="space-y-4">
          {freelancer.reviews.map((review, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{review.client || 'Client'}</span>
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span className="text-sm font-medium">{review.rating}</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{review.comment || 'Great work!'}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-4">⭐</div>
          <p className="text-gray-600">No reviews yet</p>
        </div>
      )}
    </div>
  );

  const renderMessages = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-gray-400 text-4xl mb-4">💬</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Start a Conversation</h3>
        <p className="text-gray-600 mb-6">Connect with {freelancer.name} to discuss your project requirements.</p>
        
        <div className="space-y-3">
          <button
            onClick={handleContact}
            className="w-full bg-gradient-to-r from-blue-400 to-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-500 hover:to-blue-600 transition-all duration-300"
          >
            Send Message
          </button>
          <button
            onClick={handleViewMessages}
            className="w-full border-2 border-blue-500 text-blue-500 py-3 px-6 rounded-lg font-medium hover:bg-blue-50 transition-all duration-300"
          >
            View All Messages
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Freelancer Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: '👤' },
              { id: 'portfolio', name: 'Portfolio', icon: '📁' },
              { id: 'reviews', name: 'Reviews', icon: '⭐' },
              { id: 'messages', name: 'Messages', icon: '💬' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'portfolio' && renderPortfolio()}
          {activeTab === 'reviews' && renderReviews()}
          {activeTab === 'messages' && renderMessages()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleContact}
            className="px-6 py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-lg font-medium hover:from-blue-500 hover:to-blue-600 transition-colors"
          >
            Contact {freelancer.name}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FreelancerProfilePopup;
