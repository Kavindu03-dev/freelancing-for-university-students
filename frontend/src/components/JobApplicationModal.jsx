import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

const JobApplicationModal = ({ isOpen, onClose, post }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    professionalTitle: '',
    coverLetter: '',
    portfolioLink: ''
  });
  
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get user info from localStorage if available
  React.useEffect(() => {
    if (isOpen && isAuthenticated()) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Check if the current user is the post owner
      if (user._id === post?.clientId?._id) {
        setError('You cannot apply to your own job post');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.email || ''
      }));
    }
  }, [isOpen, post]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      file,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size
    }));
    
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('Full Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email Address is required');
      return false;
    }
    if (!formData.professionalTitle.trim()) {
      setError('Professional Title/Role is required');
      return false;
    }
    if (!formData.coverLetter.trim()) {
      setError('Cover Letter/Proposal is required');
      return false;
    }
    if (formData.coverLetter.trim().length < 50) {
      setError('Cover Letter should be at least 50 characters long');
      return false;
    }
    return true;
  };

  // Check if current user is the post owner
  const isPostOwner = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user._id === post?.clientId?._id;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if the current user is the post owner
    if (isPostOwner()) {
      setError('You cannot apply to your own job post');
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Prepare form data for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('postId', post._id);
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phoneNumber', formData.phoneNumber);
      formDataToSend.append('professionalTitle', formData.professionalTitle);
      formDataToSend.append('coverLetter', formData.coverLetter);
      formDataToSend.append('portfolioLink', formData.portfolioLink);

      // Add file attachments
      attachments.forEach((attachment, index) => {
        formDataToSend.append(`attachments`, attachment.file);
      });

      const token = localStorage.getItem('userToken');
      const response = await fetch('/api/job-applications', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('Job application submitted successfully!');
        setTimeout(() => {
          onClose();
          navigate('/my-applications');
        }, 2000);
      } else {
        setError(result.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        professionalTitle: '',
        coverLetter: '',
        portfolioLink: ''
      });
      setAttachments([]);
      setError('');
      setSuccess('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Apply for {post?.title}
            </h2>
            {/* Check if current user is the post owner */}
            {(() => {
              const user = JSON.parse(localStorage.getItem('user') || '{}');
              if (user._id === post?.clientId?._id) {
                return (
                  <p className="text-red-600 text-sm mt-1">
                    ⚠️ You cannot apply to your own job post
                  </p>
                );
              }
              return null;
            })()}
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Check if current user is the post owner */}
          {(() => {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user._id === post?.clientId?._id) {
              return (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  <strong>Access Denied:</strong> You cannot apply to your own job post. This form is disabled.
                </div>
              );
            }
            return null;
          })()}
          {/* Job Post Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Job Post Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Type:</span> {post?.type}
              </div>
              <div>
                <span className="font-medium">Category:</span> {post?.category}
              </div>
              <div>
                <span className="font-medium">Budget:</span> ${post?.budget}
              </div>
              <div>
                <span className="font-medium">Location:</span> {post?.location}
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
                               <input
                   type="text"
                   id="fullName"
                   name="fullName"
                   value={formData.fullName}
                   onChange={handleInputChange}
                   required
                   disabled={isPostOwner()}
                   className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isPostOwner() ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                   placeholder="Enter your full name"
                 />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
                             <input
                 type="email"
                 id="email"
                 name="email"
                 value={formData.email}
                 onChange={handleInputChange}
                 required
                 disabled={isPostOwner()}
                 className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isPostOwner() ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                 placeholder="Enter your email address"
               />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number (Optional)
              </label>
                             <input
                 type="tel"
                 id="phoneNumber"
                 name="phoneNumber"
                 value={formData.phoneNumber}
                 onChange={handleInputChange}
                 disabled={isPostOwner()}
                 className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isPostOwner() ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                 placeholder="Enter your phone number"
               />
            </div>

            <div>
              <label htmlFor="professionalTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Professional Title/Role *
              </label>
                             <input
                 type="text"
                 id="professionalTitle"
                 name="professionalTitle"
                 value={formData.professionalTitle}
                 onChange={handleInputChange}
                 required
                 disabled={isPostOwner()}
                 className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isPostOwner() ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                 placeholder="e.g., Graphic Designer, Web Developer"
               />
            </div>
          </div>

          {/* Portfolio Link */}
          <div>
            <label htmlFor="portfolioLink" className="block text-sm font-medium text-gray-700 mb-1">
              Portfolio/Website Link (Optional)
            </label>
                         <input
               type="url"
               id="portfolioLink"
               name="portfolioLink"
               value={formData.portfolioLink}
               onChange={handleInputChange}
               disabled={isPostOwner()}
               className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isPostOwner() ? 'bg-gray-100 cursor-not-allowed' : ''}`}
               placeholder="https://your-portfolio.com"
             />
          </div>

          {/* Cover Letter */}
          <div>
            <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">
              Cover Letter/Proposal *
            </label>
                         <textarea
               id="coverLetter"
               name="coverLetter"
               value={formData.coverLetter}
               onChange={handleInputChange}
               required
               rows={6}
               disabled={isPostOwner()}
               className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isPostOwner() ? 'bg-gray-100 cursor-not-allowed' : ''}`}
               placeholder="Explain why you're suitable for this position, your relevant experience, and how you can contribute to the project..."
             />
            <p className="text-sm text-gray-500 mt-1">
              Minimum 50 characters. Current: {formData.coverLetter.length}
            </p>
          </div>

          {/* File Attachments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attachments (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                             <input
                 ref={fileInputRef}
                 type="file"
                 multiple
                 onChange={handleFileChange}
                 accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                 disabled={isPostOwner()}
                 className="hidden"
               />
               <button
                 type="button"
                 onClick={() => fileInputRef.current?.click()}
                 disabled={isPostOwner()}
                 className={`px-4 py-2 rounded-md transition-colors ${
                   isPostOwner() 
                     ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                     : 'bg-blue-600 text-white hover:bg-blue-700'
                 }`}
               >
                 Choose Files
               </button>
              <p className="text-sm text-gray-500 mt-2">
                Supported formats: PDF, DOC, DOCX, JPG, PNG, TXT
              </p>
            </div>

            {/* Display selected files */}
            {attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Selected Files:</h4>
                {attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm text-gray-700">{attachment.fileName}</span>
                      <span className="text-xs text-gray-500">
                        ({(attachment.fileSize / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
              {success}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
                         <button
               type="submit"
               disabled={isSubmitting || isPostOwner()}
               className={`px-6 py-2 text-white rounded-md transition-colors flex items-center space-x-2 ${
                 isPostOwner() 
                   ? 'bg-gray-400 cursor-not-allowed' 
                   : 'bg-blue-600 hover:bg-blue-700 disabled:opacity-50'
               }`}
             >
                             {isPostOwner() ? (
                 <span>Cannot Apply to Own Post</span>
               ) : isSubmitting ? (
                 <>
                   <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                   </svg>
                   <span>Submitting...</span>
                 </>
               ) : (
                 <span>Submit Application</span>
               )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobApplicationModal;

