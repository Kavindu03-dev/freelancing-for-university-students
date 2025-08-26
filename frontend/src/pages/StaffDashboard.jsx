import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function StaffDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [staffData, setStaffData] = useState(null);
  const [professionalSummary, setProfessionalSummary] = useState({
    bio: '',
    areasOfExpertise: ''
  });
  const [isSavingSummary, setIsSavingSummary] = useState(false);
  const [summarySaveMessage, setSummarySaveMessage] = useState('');
  
  // Edit profile state
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    staffRole: '',
    department: '',
    employeeId: '',
    experience: '',
    qualification: '',
    bio: '',
    professionalSummary: ''
  });
  const [editErrors, setEditErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Mock data for student analytics
  const [studentStats] = useState({
    totalStudents: 1247,
    verifiedStudents: 1189,
    pendingVerification: 58,
    activeProjects: 234,
    completedProjects: 1890,
    totalRevenue: 45678
  });

  const [students] = useState([
    { id: 1, name: "John Doe", email: "john@mit.edu", university: "MIT", degreeProgram: "Computer Science", gpa: "3.8", status: "Verified", projects: 5, revenue: 2500 },
    { id: 2, name: "Jane Smith", email: "jane@stanford.edu", university: "Stanford", degreeProgram: "Engineering", gpa: "3.9", status: "Verified", projects: 8, revenue: 4200 },
    { id: 3, name: "Mike Johnson", email: "mike@harvard.edu", university: "Harvard", degreeProgram: "Business", gpa: "3.7", status: "Pending", projects: 0, revenue: 0 },
    { id: 4, name: "Sarah Wilson", email: "sarah@berkeley.edu", university: "UC Berkeley", degreeProgram: "Design", gpa: "3.6", status: "Verified", projects: 12, revenue: 6800 },
    { id: 5, name: "Alex Chen", email: "alex@cmu.edu", university: "CMU", degreeProgram: "Computer Science", gpa: "3.9", status: "Verified", projects: 15, revenue: 8900 }
  ]);

  const [verificationRequests, setVerificationRequests] = useState([]);
  const [loadingVerificationRequests, setLoadingVerificationRequests] = useState(false);

  useEffect(() => {
    // Check if staff is logged in
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsed = JSON.parse(userData);
      if (parsed.userType === 'universityStaff') {
        setStaffData(parsed);
      } else {
        navigate('/signin');
      }
    } else {
      navigate('/signin');
    }
  }, [navigate]);

  // Handle URL query parameter for tab
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam && ['overview', 'analytics', 'verification', 'profile'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  // Initialize professional summary state when staff data is loaded
  useEffect(() => {
    if (staffData) {
      setProfessionalSummary({
        bio: staffData.bio || '',
        areasOfExpertise: staffData.professionalSummary || ''
      });
    }
  }, [staffData]);

  // Fetch verification requests when component mounts
  useEffect(() => {
    if (staffData) {
      fetchVerificationRequests();
    }
  }, [staffData]);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('userToken');
    navigate('/');
  };

  // Edit profile functions
  const handleEditProfile = () => {
    setEditFormData({
      firstName: staffData?.firstName || '',
      lastName: staffData?.lastName || '',
      email: staffData?.email || '',
      phoneNumber: staffData?.phoneNumber || '',
      address: staffData?.address || '',
      staffRole: staffData?.staffRole || '',
      department: staffData?.department || '',
      employeeId: staffData?.employeeId || '',
      experience: staffData?.experience || '',
      qualification: staffData?.qualification || '',
      bio: staffData?.bio || '',
      professionalSummary: staffData?.professionalSummary || ''
    });
    setEditErrors({});
    setShowEditProfile(true);
  };

  const validateEditForm = () => {
    const errors = {};
    
    if (!editFormData.firstName.trim()) errors.firstName = 'First name is required';
    if (!editFormData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!editFormData.email.trim()) errors.email = 'Email is required';
    if (!editFormData.staffRole.trim()) errors.staffRole = 'Staff role is required';
    if (!editFormData.department.trim()) errors.department = 'Department is required';
    
    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateEditForm()) return;

    try {
      setIsSaving(true);
      const token = localStorage.getItem('userToken');
      
      if (!token) {
        alert('Authentication token not found. Please log in again.');
        return;
      }

      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      });

      const result = await response.json();

      if (result.success) {
        // Update local state
        const updatedData = { ...staffData, ...editFormData };
        setStaffData(updatedData);
        localStorage.setItem('userData', JSON.stringify(updatedData));
        
        setShowEditProfile(false);
        alert('Profile updated successfully!');
      } else {
        alert(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setShowEditProfile(false);
    setEditErrors({});
  };

  const verifyStudent = (studentId) => {
    // Simulate verification process
    console.log(`Verifying student ${studentId}`);
    // In real implementation, this would update the database
  };

  const rejectStudent = (studentId) => {
    // Simulate rejection process
    console.log(`Rejecting student ${studentId}`);
    // In real implementation, this would update the database
  };

  // Verification request functions
  const fetchVerificationRequests = async () => {
    try {
      setLoadingVerificationRequests(true);
      const token = localStorage.getItem('userToken');
      const response = await fetch('http://localhost:5000/api/verification/staff/requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (result.success) {
        setVerificationRequests(result.data);
      } else {
        console.error('Failed to fetch verification requests:', result.message);
      }
    } catch (error) {
      console.error('Error fetching verification requests:', error);
    } finally {
      setLoadingVerificationRequests(false);
    }
  };

  const respondToVerificationRequest = async (requestId, status, response) => {
    try {
      const token = localStorage.getItem('userToken');
      const apiResponse = await fetch(`http://localhost:5000/api/verification/request/${requestId}/respond`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status,
          staffResponse: response
        })
      });

      const result = await apiResponse.json();

      if (result.success) {
        // Refresh the verification requests
        fetchVerificationRequests();
        alert(`Verification request ${status} successfully`);
      } else {
        alert(`Failed to ${status} request: ${result.message}`);
      }
    } catch (error) {
      console.error('Error responding to verification request:', error);
      alert('Failed to respond to verification request');
    }
  };

  const handleSaveProfessionalSummary = async () => {
    try {
      setIsSavingSummary(true);
      setSummarySaveMessage('');

      // Get the auth token
      const token = localStorage.getItem('userToken');
      if (!token) {
        setSummarySaveMessage('Authentication token not found. Please log in again.');
        return;
      }

      // Prepare the data to send to backend
      const updateData = {
        bio: professionalSummary.bio,
        professionalSummary: professionalSummary.areasOfExpertise
      };

      // Make API call to update profile
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      const result = await response.json();

      if (result.success) {
        // Update the staff data with edited values
        const updatedData = { 
          ...staffData, 
          bio: updateData.bio,
          professionalSummary: updateData.professionalSummary
        };
        
        setStaffData(updatedData);
        
        // Save to localStorage
        localStorage.setItem('userData', JSON.stringify(updatedData));
        
        // Show success message
        setSummarySaveMessage('Professional summary saved successfully!');
        setTimeout(() => setSummarySaveMessage(''), 3000);
      } else {
        // Show error message from backend
        setSummarySaveMessage(`Failed to save: ${result.message}`);
      }
    } catch (error) {
      console.error('Error saving professional summary:', error);
      setSummarySaveMessage('Failed to save. Please try again.');
    } finally {
      setIsSavingSummary(false);
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-blue-200 hover:border-blue-400">
          <div className="flex items-center justify-between mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="text-right">
              <span className="text-green-500 text-sm font-medium">+{studentStats.verifiedStudents}</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{studentStats.totalStudents.toLocaleString()}</h3>
          <p className="text-gray-600">Total Students</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-green-200 hover:border-green-400">
          <div className="flex items-center justify-between mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-right">
              <span className="text-green-500 text-sm font-medium">{studentStats.verifiedStudents}</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{studentStats.verifiedStudents.toLocaleString()}</h3>
          <p className="text-gray-600">Verified Students</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-yellow-200 hover:border-yellow-400">
          <div className="flex items-center justify-between mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-right">
              <span className="text-yellow-500 text-sm font-medium">New</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{studentStats.pendingVerification}</h3>
          <p className="text-gray-600">Pending Verification</p>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-purple-200 hover:border-purple-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-3xl font-bold text-gray-900">{studentStats.activeProjects}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-indigo-200 hover:border-indigo-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Projects</p>
              <p className="text-3xl font-bold text-gray-900">{studentStats.completedProjects}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-green-200 hover:border-green-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">${studentStats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudentAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-blue-200 hover:border-blue-400">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Student Analytics</h3>
            <p className="text-gray-600 mt-1">Comprehensive overview of student performance and engagement</p>
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300">
            Export Report
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GPA</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projects</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map(student => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">{student.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.university}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.degreeProgram}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.gpa}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      student.status === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.projects}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${student.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderVerification = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-yellow-200 hover:border-yellow-400">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Student Verification Requests</h3>
            <p className="text-gray-600 mt-1">Review and respond to student verification requests</p>
          </div>
          <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-xl text-sm font-medium">
            {verificationRequests.filter(req => req.status === 'pending').length} Pending
          </span>
        </div>

        {loadingVerificationRequests ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading verification requests...</p>
          </div>
        ) : verificationRequests.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Verification Requests</h3>
            <p className="text-gray-600">No pending verification requests at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {verificationRequests.map(request => (
              <div key={request._id} className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:border-yellow-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">
                          {request.freelancerId?.firstName} {request.freelancerId?.lastName}
                        </h4>
                        <p className="text-yellow-600 font-medium">{request.freelancerId?.email}</p>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="text-gray-600">University: <span className="font-medium">{request.freelancerId?.university || 'Not specified'}</span></span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span className="text-gray-600">Program: <span className="font-medium">{request.freelancerId?.degreeProgram || 'Not specified'}</span></span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span className="text-gray-600">GPA: <span className="font-medium">{request.freelancerId?.gpa || 'Not specified'}</span></span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-600">Submitted: <span className="font-medium">{new Date(request.submittedAt).toLocaleDateString()}</span></span>
                      </div>
                    </div>

                    {request.requestMessage && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Request Message:</p>
                        <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">{request.requestMessage}</p>
                      </div>
                    )}

                    {request.staffResponse && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Your Response:</p>
                        <p className="text-gray-600 text-sm bg-blue-50 p-3 rounded-lg">{request.staffResponse}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {request.status === 'pending' && (
                  <div className="flex space-x-4">
                    <button 
                      onClick={() => respondToVerificationRequest(request._id, 'approved', 'Verification approved. Welcome to the platform!')}
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Approve</span>
                    </button>
                    <button 
                      onClick={() => respondToVerificationRequest(request._id, 'rejected', 'Verification rejected. Please provide additional documentation.')}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-black via-gray-900 to-black text-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          {/* Profile Picture */}
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-4xl font-bold text-black">
              {staffData?.firstName?.charAt(0)}{staffData?.lastName?.charAt(0)}
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full"></div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold mb-2">
              {staffData?.firstName} {staffData?.lastName}
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              University Staff • {staffData?.staffRole || 'Staff Member'} • {staffData?.department || 'Department'}
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>5.0 (15 reviews)</span>
              </div>
              
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>{staffData?.department || 'University Department'}</span>
              </div>

              <div className="flex items-center px-3 py-1 rounded-full bg-green-500">
                <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                <span className="text-sm font-medium">Active Staff</span>
              </div>
            </div>

            <p className="text-gray-300 max-w-2xl">
              {staffData?.bio || 'Dedicated university staff member committed to supporting student success and maintaining academic standards. Experienced in student verification, analytics, and academic oversight.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3">
            <button 
              onClick={handleEditProfile}
              className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Edit Profile
            </button>
            <button className="bg-white hover:bg-gray-100 text-gray-800 px-6 py-2 rounded-lg font-semibold transition-colors">
              View Reports
            </button>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Staff Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={`${staffData?.firstName || ''} ${staffData?.lastName || ''}`}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  value={staffData?.email || ''}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Staff Role</label>
                <input 
                  type="text" 
                  value={staffData?.staffRole || ''}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <input 
                  type="text" 
                  value={staffData?.department || ''}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Professional Summary</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                  placeholder="Tell us about your role and responsibilities..."
                  value={professionalSummary.bio || staffData?.bio || ''}
                  onChange={(e) => setProfessionalSummary(prev => ({ ...prev, bio: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Areas of Expertise</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                  placeholder="e.g., Student Services, Academic Affairs, Research Support"
                  value={professionalSummary.areasOfExpertise || staffData?.professionalSummary || ''}
                  onChange={(e) => setProfessionalSummary(prev => ({ ...prev, areasOfExpertise: e.target.value }))}
                />
              </div>
              
              {/* Save Message */}
              {summarySaveMessage && (
                <div className={`p-3 rounded-lg text-sm font-medium ${
                  summarySaveMessage.includes('successfully') 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {summarySaveMessage}
                </div>
              )}
              
              {/* Save Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSaveProfessionalSummary}
                  disabled={isSavingSummary}
                  className={`px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
                    isSavingSummary
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:scale-105'
                  }`}
                >
                  {isSavingSummary ? (
                    <div className="flex items-center space-x-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    'Save Professional Summary'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Staff Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Students Verified</span>
                <span className="font-bold text-yellow-600">1,189</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending Verifications</span>
                <span className="text-gray-600">58</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Students</span>
                <span className="font-bold text-yellow-600">1,247</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Years of Service</span>
                <span className="font-bold text-yellow-600">5+</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Responsibilities</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Student Verification</span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Academic Oversight</span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Data Analytics</span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Institutional Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!staffData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-x-hidden">
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      {/* Main Content with Professional Sidebar Layout */}
      <div className="flex min-h-screen relative z-10">
        {/* Left Sidebar - Fixed width, full height, positioned below header */}
        <div className="w-64 bg-white shadow-2xl border-r border-gray-200 flex-shrink-0 mt-20">
          {/* Sidebar Header */}
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-6 border-b border-yellow-300">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-yellow-500 font-bold text-lg">S</span>
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Staff Panel</h2>
                <p className="text-yellow-100 text-sm">Dashboard Navigation</p>
              </div>
            </div>
          </div>
          
          {/* Navigation Menu */}
          <div className="p-4">
            <nav className="flex flex-col space-y-1">
              {[
                { id: "overview", name: "Overview", icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" },
                { id: "analytics", name: "Student Analytics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
                { id: "verification", name: "Verification", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
                { id: "profile", name: "Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 text-left group ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-md"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent hover:border-gray-200"
                  }`}
                >
                  <svg className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${
                    activeTab === tab.id ? "text-black" : "text-gray-500 group-hover:text-yellow-500"
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                  </svg>
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8 pt-8 overflow-y-auto mt-20">
          <div className="max-w-7xl mx-auto">
            {activeTab === "overview" && renderOverview()}
            {activeTab === "analytics" && renderStudentAnalytics()}
            {activeTab === "verification" && renderVerification()}
            {activeTab === "profile" && renderProfile()}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">Edit Profile</h3>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editFormData.firstName}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                        editErrors.firstName ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {editErrors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{editErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editFormData.lastName}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                        editErrors.lastName ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {editErrors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{editErrors.lastName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                        editErrors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {editErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{editErrors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={editFormData.phoneNumber}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      value={editFormData.address}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Staff Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Staff Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Staff Role <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editFormData.staffRole}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, staffRole: e.target.value }))}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                        editErrors.staffRole ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Academic Advisor, Student Services Coordinator"
                    />
                    {editErrors.staffRole && (
                      <p className="text-red-500 text-sm mt-1">{editErrors.staffRole}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editFormData.department}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, department: e.target.value }))}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                        editErrors.department ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Computer Science, Student Affairs"
                    />
                    {editErrors.department && (
                      <p className="text-red-500 text-sm mt-1">{editErrors.department}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                    <input
                      type="text"
                      value={editFormData.employeeId}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                      placeholder="e.g., EMP001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                    <input
                      type="text"
                      value={editFormData.experience}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, experience: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                      placeholder="e.g., 5 years in student services"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Qualification</label>
                    <input
                      type="text"
                      value={editFormData.qualification}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, qualification: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                      placeholder="e.g., Master's in Education, PhD in Psychology"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Summary */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Professional Summary</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      rows="4"
                      value={editFormData.bio}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, bio: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                      placeholder="Tell us about your role and responsibilities..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Professional Summary</label>
                    <textarea
                      rows="3"
                      value={editFormData.professionalSummary}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, professionalSummary: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                      placeholder="Describe your areas of expertise and specializations..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end space-x-4">
              <button
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffDashboard;

