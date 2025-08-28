import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

const ClientApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      fetchApplications();
    }
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('/api/job-applications/received', {
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

  const handleStatusUpdate = async (applicationId, newStatus, feedback = '') => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`/api/job-applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus, feedback })
      });

      if (response.ok) {
        await fetchApplications(); // Refresh the list
        setShowStatusModal(false);
        setSelectedApplication(null);
      } else {
        const result = await response.json();
        setError(result.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Network error. Please try again.');
    }
  };

  const handleInterviewSchedule = async (applicationId, interviewData) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`/api/job-applications/${applicationId}/interview`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(interviewData)
      });

      if (response.ok) {
        await fetchApplications(); // Refresh the list
        setShowInterviewModal(false);
        setSelectedApplication(null);
      } else {
        const result = await response.json();
        setError(result.message || 'Failed to schedule interview');
      }
    } catch (error) {
      console.error('Error scheduling interview:', error);
      setError('Network error. Please try again.');
    }
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
          <p className="text-gray-600 mb-4">Please log in to view applications.</p>
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
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
          <p className="text-gray-600 mt-2">
            Review and manage applications for your job posts
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
                ? "You haven't received any job applications yet."
                : `No applications with status "${filter}" found.`
              }
            </p>
            <div className="mt-6">
              <Link
                to="/post-job"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Post a Job
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <div key={application._id} className="bg-white shadow rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Job Post Title */}
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {application.postId?.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                    </div>

                    {/* Applicant Info */}
                    <div className="flex items-center space-x-2 mb-3">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-sm text-gray-600">
                        {application.fullName} - {application.professionalTitle}
                      </span>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Email:</span> {application.email}
                      </div>
                      {application.phoneNumber && (
                        <div>
                          <span className="font-medium">Phone:</span> {application.phoneNumber}
                        </div>
                      )}
                      {application.portfolioLink && (
                        <div>
                          <span className="font-medium">Portfolio:</span> 
                          <a href={application.portfolioLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                            View Portfolio
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Cover Letter Preview */}
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Cover Letter</h4>
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {application.coverLetter}
                      </p>
                      {application.coverLetter.length > 150 && (
                        <button
                          onClick={() => setSelectedApplication(application)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-1"
                        >
                          Read full cover letter
                        </button>
                      )}
                    </div>

                    {/* Attachments */}
                    {application.attachments && application.attachments.length > 0 && (
                      <div className="mb-4">
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

                    {/* Application Details */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Applied:</span> {formatDate(application.createdAt)}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Job Type:</span> {application.postId?.type}
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
                        <h4 className="font-medium text-gray-900 mb-2">Your Feedback</h4>
                        <p className="text-sm text-gray-700">{application.clientFeedback}</p>
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
                    
                    {/* Status Update Actions */}
                    {application.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedApplication(application);
                            setShowStatusModal(true);
                          }}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => {
                            setSelectedApplication(application);
                            setShowStatusModal(true);
                          }}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Decline
                        </button>
                      </>
                    )}

                    {application.status === 'Accepted' && (
                      <button
                        onClick={() => {
                          setSelectedApplication(application);
                          setShowInterviewModal(true);
                        }}
                        className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                      >
                        Schedule Interview
                      </button>
                    )}

                    {application.status === 'Interview Scheduled' && (
                      <button
                        onClick={() => {
                          setSelectedApplication(application);
                          setShowStatusModal(true);
                        }}
                        className="text-emerald-600 hover:text-emerald-800 text-sm font-medium"
                      >
                        Hire
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {showStatusModal && selectedApplication && (
        <StatusUpdateModal
          application={selectedApplication}
          onClose={() => {
            setShowStatusModal(false);
            setSelectedApplication(null);
          }}
          onUpdate={handleStatusUpdate}
        />
      )}

      {/* Interview Schedule Modal */}
      {showInterviewModal && selectedApplication && (
        <InterviewScheduleModal
          application={selectedApplication}
          onClose={() => {
            setShowInterviewModal(false);
            setSelectedApplication(null);
          }}
          onSchedule={handleInterviewSchedule}
        />
      )}
    </div>
  );
};

// Status Update Modal Component
const StatusUpdateModal = ({ application, onClose, onUpdate }) => {
  const [status, setStatus] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!status) return;

    setIsSubmitting(true);
    await onUpdate(application._id, status, feedback);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Update Application Status</h3>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select status</option>
              {application.status === 'Pending' && (
                <>
                  <option value="Under Review">Under Review</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Declined">Declined</option>
                </>
              )}
              {application.status === 'Under Review' && (
                <>
                  <option value="Accepted">Accepted</option>
                  <option value="Declined">Declined</option>
                </>
              )}
              {application.status === 'Accepted' && (
                <>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Hired">Hired</option>
                  <option value="Rejected">Rejected</option>
                </>
              )}
              {application.status === 'Interview Scheduled' && (
                <>
                  <option value="Hired">Hired</option>
                  <option value="Rejected">Rejected</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feedback (Optional)
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Provide feedback to the applicant..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !status}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Interview Schedule Modal Component
const InterviewScheduleModal = ({ application, onClose, onSchedule }) => {
  const [interviewData, setInterviewData] = useState({
    scheduledDate: '',
    scheduledTime: '',
    location: '',
    notes: '',
    isOnline: false,
    meetingLink: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!interviewData.scheduledDate || !interviewData.scheduledTime || !interviewData.location) return;

    setIsSubmitting(true);
    await onSchedule(application._id, interviewData);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Schedule Interview</h3>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interview Date
            </label>
            <input
              type="date"
              value={interviewData.scheduledDate}
              onChange={(e) => setInterviewData(prev => ({ ...prev, scheduledDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interview Time
            </label>
            <input
              type="time"
              value={interviewData.scheduledTime}
              onChange={(e) => setInterviewData(prev => ({ ...prev, scheduledTime: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={interviewData.location}
              onChange={(e) => setInterviewData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Office address or meeting room"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isOnline"
              checked={interviewData.isOnline}
              onChange={(e) => setInterviewData(prev => ({ ...prev, isOnline: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isOnline" className="ml-2 block text-sm text-gray-900">
              Online Interview
            </label>
          </div>

          {interviewData.isOnline && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Link
              </label>
              <input
                type="url"
                value={interviewData.meetingLink}
                onChange={(e) => setInterviewData(prev => ({ ...prev, meetingLink: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://meet.google.com/..."
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              value={interviewData.notes}
              onChange={(e) => setInterviewData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any additional information for the candidate..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !interviewData.scheduledDate || !interviewData.scheduledTime || !interviewData.location}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Scheduling...' : 'Schedule Interview'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientApplicationsPage;

