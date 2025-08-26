import React, { useState, useEffect } from 'react';

const ApplicationTracker = ({ applications, onUpdateApplication, onWithdrawApplication }) => {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');

  const applicationStatuses = {
    applied: { 
      status: "Applied", 
      color: "blue", 
      icon: "📝",
      actions: ["Withdraw", "Update", "View Details"],
      description: "Your application has been submitted and is under review"
    },
    shortlisted: { 
      status: "Shortlisted", 
      color: "yellow", 
      icon: "⭐",
      actions: ["Interview Prep", "Update", "View Details"],
      description: "Congratulations! You've been shortlisted for the next round"
    },
    interview: { 
      status: "Interview", 
      color: "orange", 
      icon: "🎯",
      actions: ["Schedule", "Prepare", "View Details"],
      description: "You have an upcoming interview - time to prepare!"
    },
    offered: { 
      status: "Offered", 
      color: "green", 
      icon: "🎉",
      actions: ["Accept", "Negotiate", "View Details"],
      description: "Great news! You've received an offer"
    },
    rejected: { 
      status: "Rejected", 
      color: "red", 
      icon: "❌",
      actions: ["Feedback", "Reapply", "View Details"],
      description: "Don't give up! Use this as a learning opportunity"
    },
    withdrawn: { 
      status: "Withdrawn", 
      color: "gray", 
      icon: "⏸️",
      actions: ["Reapply", "View Details"],
      description: "You've withdrawn this application"
    }
  };

  const getStatusInfo = (status) => {
    return applicationStatuses[status.toLowerCase()] || applicationStatuses.applied;
  };

  const getFilteredApplications = () => {
    if (filterStatus === 'All') return applications;
    return applications.filter(app => app.status.toLowerCase() === filterStatus.toLowerCase());
  };

  const handleAction = (action, application) => {
    switch (action) {
      case 'Withdraw':
        if (window.confirm('Are you sure you want to withdraw this application?')) {
          onWithdrawApplication(application.id);
        }
        break;
      case 'Update':
        // Handle application update
        console.log('Update application:', application.id);
        break;
      case 'View Details':
        setSelectedApplication(application);
        setShowDetails(true);
        break;
      case 'Interview Prep':
        // Navigate to interview prep resources
        console.log('Navigate to interview prep for:', application.id);
        break;
      case 'Schedule':
        // Handle interview scheduling
        console.log('Schedule interview for:', application.id);
        break;
      case 'Prepare':
        // Navigate to interview preparation
        console.log('Prepare for interview:', application.id);
        break;
      case 'Accept':
        if (window.confirm('Are you sure you want to accept this offer?')) {
          onUpdateApplication(application.id, 'accepted');
        }
        break;
      case 'Negotiate':
        // Handle offer negotiation
        console.log('Negotiate offer for:', application.id);
        break;
      case 'Feedback':
        // Request feedback
        console.log('Request feedback for:', application.id);
        break;
      case 'Reapply':
        // Handle reapplication
        console.log('Reapply for:', application.id);
        break;
      default:
        break;
    }
  };

  const renderApplicationCard = (application) => {
    const statusInfo = getStatusInfo(application.status);
    
    return (
      <div key={application.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${getStatusColorClass(statusInfo.color)}`}>
              {statusInfo.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{application.postTitle}</h3>
              <p className="text-sm text-gray-600">{application.client}</p>
            </div>
          </div>
          <div className="text-right">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(statusInfo.color)}`}>
              {statusInfo.status}
            </span>
            <p className="text-xs text-gray-500 mt-1">{application.appliedDate}</p>
          </div>
        </div>

        <p className="text-gray-700 mb-4">{statusInfo.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {statusInfo.actions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleAction(action, application)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                action === 'Withdraw' || action === 'Negotiate'
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : action === 'Accept'
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              {action}
            </button>
          ))}
        </div>

        {/* Application Timeline */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Application Timeline</h4>
          <div className="space-y-2">
            <div className="flex items-center text-xs text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>Applied on {application.appliedDate}</span>
            </div>
            {application.status !== 'Applied' && (
              <div className="flex items-center text-xs text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span>Status updated to {application.status}</span>
              </div>
            )}
            {application.interviewDate && (
              <div className="flex items-center text-xs text-gray-600">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                <span>Interview scheduled for {application.interviewDate}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const getStatusColorClass = (color) => {
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      orange: 'bg-orange-100 text-orange-600',
      green: 'bg-green-100 text-green-600',
      red: 'bg-red-100 text-red-600',
      gray: 'bg-gray-100 text-gray-600'
    };
    return colorClasses[color] || colorClasses.blue;
  };

  const getStatusBadgeClass = (color) => {
    const badgeClasses = {
      blue: 'bg-blue-100 text-blue-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      orange: 'bg-orange-100 text-orange-800',
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800',
      gray: 'bg-gray-100 text-gray-800'
    };
    return badgeClasses[color] || badgeClasses.blue;
  };

  const renderApplicationDetails = () => {
    if (!selectedApplication) return null;

    const statusInfo = getStatusInfo(selectedApplication.status);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Application Details</h2>
                <p className="text-blue-100">{selectedApplication.postTitle}</p>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="text-white hover:text-blue-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Application Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Application Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(statusInfo.color)}`}>
                        {statusInfo.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Applied Date:</span>
                      <span className="text-gray-900">{selectedApplication.appliedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Client:</span>
                      <span className="text-gray-900">{selectedApplication.client}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Position:</span>
                      <span className="text-gray-900">{selectedApplication.postTitle}</span>
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Next Steps</h3>
                  <div className="space-y-2">
                    {statusInfo.status === 'Applied' && (
                      <p className="text-sm text-gray-600">Your application is under review. You should hear back within 1-2 weeks.</p>
                    )}
                    {statusInfo.status === 'Shortlisted' && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Great! You've been shortlisted. Prepare for your interview:</p>
                        <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                          <li>Research the company</li>
                          <li>Review the job description</li>
                          <li>Prepare your portfolio</li>
                          <li>Practice common questions</li>
                        </ul>
                      </div>
                    )}
                    {statusInfo.status === 'Interview' && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Interview scheduled! Here's what to do:</p>
                        <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                          <li>Confirm the interview time</li>
                          <li>Test your equipment (if virtual)</li>
                          <li>Prepare your questions</li>
                          <li>Dress professionally</li>
                        </ul>
                      </div>
                    )}
                    {statusInfo.status === 'Offered' && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Congratulations! You have an offer. Consider:</p>
                        <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                          <li>Review the offer details</li>
                          <li>Negotiate if needed</li>
                          <li>Ask questions about the role</li>
                          <li>Consider the company culture</li>
                        </ul>
                      </div>
                    )}
                    {statusInfo.status === 'Rejected' && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Don't be discouraged! Use this opportunity to:</p>
                        <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                          <li>Request feedback</li>
                          <li>Identify areas for improvement</li>
                          <li>Update your skills if needed</li>
                          <li>Apply to similar positions</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions & Resources */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Actions</h3>
                  <div className="space-y-2">
                    {statusInfo.actions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleAction(action, selectedApplication)}
                        className={`w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          action === 'Withdraw' || action === 'Negotiate'
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : action === 'Accept'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resources */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Helpful Resources</h3>
                  <div className="space-y-2">
                    <a href="#" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-500">📚</span>
                        <span className="text-sm text-gray-700">Interview Preparation Guide</span>
                      </div>
                    </a>
                    <a href="#" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-2">
                        <span className="text-green-500">💼</span>
                        <span className="text-sm text-gray-700">Portfolio Tips</span>
                      </div>
                    </a>
                    <a href="#" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-2">
                        <span className="text-purple-500">🎯</span>
                        <span className="text-sm text-gray-700">Salary Negotiation Guide</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Applications</h2>
          <p className="text-gray-600">Track and manage your job applications</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Statuses</option>
            {Object.values(applicationStatuses).map((status) => (
              <option key={status.status} value={status.status}>{status.status}</option>
            ))}
          </select>

          {/* Stats */}
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Applications</p>
            <p className="text-2xl font-bold text-blue-600">{applications.length}</p>
          </div>
        </div>
      </div>

      {/* Applications Grid */}
      {getFilteredApplications().length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {getFilteredApplications().map(renderApplicationCard)}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📝</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-600">
            {filterStatus === 'All' 
              ? "You haven't applied to any jobs yet. Start browsing opportunities!"
              : `No applications with status "${filterStatus}" found.`
            }
          </p>
        </div>
      )}

      {/* Application Details Modal */}
      {showDetails && renderApplicationDetails()}
    </div>
  );
};

export default ApplicationTracker;
