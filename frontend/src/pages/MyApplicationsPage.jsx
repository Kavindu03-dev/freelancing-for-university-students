import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (isAuthenticated()) {
      fetchApplications();
    }
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('/api/job-applications/my-applications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setApplications(result.data);
      } else {
        setError('Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteApplication = async (applicationId) => {
    if (window.confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('userToken');
        const response = await fetch(`/api/job-applications/${applicationId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          await fetchApplications(); // Refresh the list
        } else {
          const result = await response.json();
          setError(result.message || 'Failed to withdraw application');
        }
      } catch (error) {
        console.error('Error withdrawing application:', error);
        setError('Network error. Please try again.');
      }
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Under Review': 'bg-blue-100 text-blue-800',
      'Accepted': 'bg-green-100 text-green-800',
      'Declined': 'bg-red-100 text-red-800',
      'Interview Scheduled': 'bg-purple-100 text-purple-800',
      'Hired': 'bg-emerald-100 text-emerald-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">Please log in to view your applications.</p>
          <Link to="/signin" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Job Applications</h1>
          <p className="text-gray-600 mt-2">
            Track the status of all your job applications
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: 'All', count: applications.length },
                { key: 'Pending', label: 'Pending', count: applications.filter(app => app.status === 'Pending').length },
                { key: 'Under Review', label: 'Under Review', count: applications.filter(app => app.status === 'Under Review').length },
                { key: 'Accepted', label: 'Accepted', count: applications.filter(app => app.status === 'Accepted').length },
                { key: 'Interview Scheduled', label: 'Interview', count: applications.filter(app => app.status === 'Interview Scheduled').length },
                { key: 'Hired', label: 'Hired', count: applications.filter(app => app.status === 'Hired').length },
                { key: 'Declined', label: 'Declined', count: applications.filter(app => app.status === 'Declined').length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs font-medium">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all' 
                ? "You haven't submitted any job applications yet."
                : `No applications with status "${filter}" found.`
              }
            </p>
            <div className="mt-6">
              <Link
                to="/services"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Browse Job Posts
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <div key={application._id} className="bg-white shadow rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Job Post Title and Company */}
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {application.postId?.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                    </div>

                    {/* Company Info */}
                    <div className="flex items-center space-x-2 mb-3">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="text-sm text-gray-600">
                        {application.clientId?.clientOrganization || `${application.clientId?.firstName} ${application.clientId?.lastName}`}
                      </span>
                    </div>

                    {/* Job Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Type:</span> {application.postId?.type}
                      </div>
                      <div>
                        <span className="font-medium">Category:</span> {application.postId?.category}
                      </div>
                      <div>
                        <span className="font-medium">Budget:</span> ${application.postId?.budget}
                      </div>
                      <div>
                        <span className="font-medium">Location:</span> {application.postId?.location}
                      </div>
                    </div>

                    {/* Application Details */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Applied:</span> {formatDate(application.createdAt)}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Professional Title:</span> {application.professionalTitle}
                        </div>
                      </div>
                    </div>

                    {/* Interview Details */}
                    {application.interviewDetails && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Interview Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                          <div>
                            <span className="font-medium">Date:</span> {formatDate(application.interviewDetails.scheduledDate)}
                          </div>
                          <div>
                            <span className="font-medium">Time:</span> {application.interviewDetails.scheduledTime}
                          </div>
                          <div>
                            <span className="font-medium">Location:</span> {application.interviewDetails.location}
                          </div>
                          {application.interviewDetails.isOnline && (
                            <div>
                              <span className="font-medium">Meeting Link:</span> 
                              <a href={application.interviewDetails.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                                Join Meeting
                              </a>
                            </div>
                          )}
                        </div>
                        {application.interviewDetails.notes && (
                          <div className="mt-2 text-sm text-blue-800">
                            <span className="font-medium">Notes:</span> {application.interviewDetails.notes}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Client Feedback */}
                    {application.clientFeedback && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Client Feedback</h4>
                        <p className="text-sm text-gray-700">{application.clientFeedback}</p>
                      </div>
                    )}

                    {/* Attachments */}
                    {application.attachments && application.attachments.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Attachments</h4>
                        <div className="flex flex-wrap gap-2">
                          {application.attachments.map((attachment, index) => (
                            <a
                              key={index}
                              href={attachment.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {attachment.fileName}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="ml-4 flex flex-col space-y-2">
                    <Link
                      to={`/post/${application.postId?._id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Job Post
                    </Link>
                    {application.status === 'Pending' && (
                      <button
                        onClick={() => handleDeleteApplication(application._id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Withdraw
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplicationsPage;
