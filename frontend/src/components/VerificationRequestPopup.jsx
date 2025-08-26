import React, { useState, useEffect } from 'react';

function VerificationRequestPopup({ isOpen, onClose, onRequestSubmitted }) {
  const [staffMembers, setStaffMembers] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchStaffMembers();
    }
  }, [isOpen]);

  const fetchStaffMembers = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('http://localhost:5000/api/verification/staff', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (result.success) {
        setStaffMembers(result.data);
      } else {
        setError('Failed to fetch staff members');
      }
    } catch (error) {
      console.error('Error fetching staff members:', error);
      setError('Failed to fetch staff members');
    }
  };

  const handleSubmitRequest = async () => {
    if (!selectedStaff) {
      setError('Please select a staff member');
      return;
    }

    if (!requestMessage.trim()) {
      setError('Please provide a request message');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const token = localStorage.getItem('userToken');
      const response = await fetch('http://localhost:5000/api/verification/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          staffId: selectedStaff,
          requestMessage: requestMessage.trim()
        })
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('Verification request submitted successfully!');
        setTimeout(() => {
          onRequestSubmitted();
          onClose();
        }, 2000);
      } else {
        setError(result.message || 'Failed to submit request');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      setError('Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-gray-900">Request Verification</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Staff Member Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Staff Member <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {staffMembers.map((staff) => (
                <div
                  key={staff._id}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedStaff === staff._id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedStaff(staff._id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {staff.firstName} {staff.lastName}
                      </h4>
                      <p className="text-sm text-gray-600">{staff.email}</p>
                      <p className="text-sm text-gray-500">
                        {staff.staffRole} • {staff.department}
                      </p>
                    </div>
                    {selectedStaff === staff._id && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {staffMembers.length === 0 && (
              <p className="text-gray-500 text-center py-4">No staff members available</p>
            )}
          </div>

          {/* Request Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Request Message <span className="text-red-500">*</span>
            </label>
            <textarea
              rows="4"
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
              placeholder="Please provide a brief message explaining why you need verification..."
            />
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="p-3 bg-red-100 text-red-800 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-100 text-green-800 rounded-lg text-sm">
              {success}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end space-x-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmitRequest}
            disabled={loading || !selectedStaff || !requestMessage.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerificationRequestPopup;
