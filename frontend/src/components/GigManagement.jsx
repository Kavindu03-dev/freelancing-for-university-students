import React, { useState, useEffect } from 'react';

const GigManagement = ({ user }) => {
  const [gigs, setGigs] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingGig, setEditingGig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    duration: '',
    skills: '',
    portfolio: ''
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const [formErrors, setFormErrors] = useState({});

  // Function to get user ID from JWT token
  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        console.log('No token found in localStorage');
        return null;
      }
      
      console.log('Token structure:', token);
      console.log('Token parts:', token.split('.'));
      
      // Decode JWT token (payload is the second part)
      const payload = token.split('.')[1];
      console.log('Token payload (base64):', payload);
      
      const decoded = JSON.parse(atob(payload));
      console.log('Decoded token payload:', decoded);
      console.log('User ID from token:', decoded.id);
      
      return decoded.id;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const categories = [
    'Web Development',
    'Mobile Development',
    'Design',
    'Writing',
    'Marketing',
    'Data Analysis',
    'Video & Animation',
    'Music & Audio',
    'Programming',
    'Business',
    'Other'
  ];

  // Fetch user's gigs on component mount
  useEffect(() => {
    fetchUserGigs();
  }, []);

  const fetchUserGigs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      const userId = getUserIdFromToken();
      
      console.log('=== User ID Comparison ===');
      console.log('User ID from JWT token:', userId);
      console.log('User ID from localStorage (user._id):', user?._id);
      console.log('Are they the same?', userId === user?._id);
      console.log('Token:', token);
      
      if (!userId) {
        setError('Unable to get user ID from token');
        return;
      }
      
      const response = await fetch(`/api/services/freelancer/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Fetch response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched gigs:', data);
        setGigs(data.data || []);
      } else {
        const errorData = await response.json();
        console.log('Fetch error:', errorData);
        setError('Failed to fetch gigs');
      }
    } catch (error) {
      console.error('Error fetching gigs:', error);
      setError('Failed to fetch gigs');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }
    
    setSelectedImages(imageFiles);
  };

  const uploadImages = async () => {
    if (selectedImages.length === 0) return [];
    
    try {
      setIsUploadingImages(true);
      const formData = new FormData();
      
      selectedImages.forEach((image, index) => {
        formData.append('images', image);
      });
      
      const token = localStorage.getItem('userToken');
      const response = await fetch('/api/services/upload-images', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (response.ok) {
        const result = await response.json();
        setUploadedImages(result.data);
        return result.data;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload images');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      setError(error.message || 'Failed to upload images');
      return [];
    } finally {
      setIsUploadingImages(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    console.log('=== VALIDATION DEBUG ===');
    console.log('Title:', formData.title, 'Valid:', !!formData.title?.trim());
    console.log('Description:', formData.description, 'Valid:', !!formData.description?.trim());
    console.log('Category:', formData.category, 'Valid:', !!formData.category);
    console.log('Price:', formData.price, 'Valid:', !!(formData.price && Number(formData.price) > 0));
    console.log('Duration:', formData.duration, 'Valid:', !!formData.duration);
    console.log('Skills:', formData.skills, 'Valid:', !!formData.skills?.trim());
    
    if (!formData.title?.trim()) errors.title = 'Title is required';
    if (!formData.description?.trim()) errors.description = 'Description is required';
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.price || Number(formData.price) <= 0) errors.price = 'Valid price is required';
    if (!formData.duration || formData.duration.toString().trim() === '') errors.duration = 'Duration is required';
    if (!formData.skills?.trim()) errors.skills = 'Skills are required';

    console.log('Validation errors:', errors);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateGig = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      
      // Upload images first if any are selected
      let images = [];
      if (selectedImages.length > 0) {
        images = await uploadImages();
        if (images.length === 0 && selectedImages.length > 0) {
          setError('Failed to upload images. Please try again.');
          return;
        }
      }
      
      // Prepare gig data with images and proper field mapping
      const gigData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: formData.price,
        duration: formData.duration, // Send as duration, backend will map to deliveryTime
        skills: formData.skills, // Backend will handle string to array conversion
        portfolio: formData.portfolio || '',
        images: images
      };
      
      console.log('Creating gig with data:', gigData);
      console.log('Token:', token);
      
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(gigData)
      });

      console.log('Create response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Create success:', result);
        setSuccess('Gig created successfully!');
        setFormData({
          title: '',
          description: '',
          category: '',
          price: '',
          duration: '',
          skills: '',
          portfolio: ''
        });
        setSelectedImages([]);
        setUploadedImages([]);
        setShowCreateForm(false);
        fetchUserGigs(); // Refresh the list
      } else {
        const errorData = await response.json();
        console.log('Create error:', errorData);
        setError(errorData.message || 'Failed to create gig');
      }
    } catch (error) {
      console.error('Error creating gig:', error);
      setError('Failed to create gig');
    } finally {
      setLoading(false);
    }
  };

  const handleEditGig = async (e) => {
    e.preventDefault();
    
    console.log('=== EDIT GIG DEBUG ===');
    console.log('Form data:', formData);
    console.log('Selected images:', selectedImages);
    console.log('Uploaded images:', uploadedImages);
    console.log('Editing gig:', editingGig);
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      
      // Upload new images if any are selected
      let images = editingGig.images || []; // Keep existing images
      if (selectedImages.length > 0) {
        const newImages = await uploadImages();
        if (newImages.length > 0) {
          images = [...images, ...newImages]; // Add new images to existing ones
        }
      }
      
      // Prepare gig data with proper field mapping
      const gigData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: formData.price,
        duration: formData.duration, // Send as duration, backend will map to deliveryTime
        skills: formData.skills, // Backend will handle string to array conversion
        portfolio: formData.portfolio || '',
        images: images
      };
      
      console.log('Editing gig:', editingGig._id);
      console.log('Form data:', gigData);
      console.log('Token:', token);
      console.log('Request payload:', JSON.stringify(gigData));
      
      const response = await fetch(`/api/services/${editingGig._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(gigData)
      });

      console.log('Edit response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Edit success:', result);
        setSuccess('Gig updated successfully!');
        setShowEditForm(false);
        setEditingGig(null);
        setFormData({
          title: '',
          description: '',
          category: '',
          price: '',
          duration: '',
          skills: '',
          portfolio: ''
        });
        setSelectedImages([]);
        setUploadedImages([]);
        fetchUserGigs(); // Refresh the list
      } else {
        const errorData = await response.json();
        console.log('Edit error status:', response.status);
        console.log('Edit error data:', errorData);
        setError(errorData.message || 'Failed to update gig');
      }
    } catch (error) {
      console.error('Error updating gig:', error);
      setError('Failed to update gig');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGig = async (gigId) => {
    if (!window.confirm('Are you sure you want to delete this gig?')) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      console.log('Deleting gig:', gigId);
      console.log('Token:', token);
      
      const response = await fetch(`/api/services/${gigId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Delete response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Delete success:', result);
        setSuccess('Gig deleted successfully!');
        fetchUserGigs(); // Refresh the list
      } else {
        const errorData = await response.json();
        console.log('Delete error:', errorData);
        setError(errorData.message || 'Failed to delete gig');
      }
    } catch (error) {
      console.error('Error deleting gig:', error);
      setError('Failed to delete gig');
    } finally {
      setLoading(false);
    }
  };

  const openEditForm = (gig) => {
    setEditingGig(gig);
    setFormData({
      title: gig.title || '',
      description: gig.description || '',
      category: gig.category || '',
      price: gig.price || '',
      duration: (gig.deliveryTime || gig.duration || '').toString(), // Ensure duration is a string
      skills: Array.isArray(gig.skills) ? gig.skills.join(', ') : (gig.skills || ''),
      portfolio: Array.isArray(gig.portfolio) && gig.portfolio.length > 0 ? gig.portfolio[0].description || '' : (gig.portfolio || '')
    });
    // Set existing images for editing
    setUploadedImages(gig.images || []);
    setSelectedImages([]); // Clear any new selected images
    setShowEditForm(true);
  };

  const closeForms = () => {
    setShowCreateForm(false);
    setShowEditForm(false);
    setEditingGig(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      price: '',
      duration: '',
      skills: '',
      portfolio: ''
    });
    setSelectedImages([]);
    setUploadedImages([]);
    setFormErrors({});
    setError('');
    setSuccess('');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending Review' },
      approved: { color: 'bg-green-100 text-green-800', text: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', text: 'Rejected' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const renderGigForm = (isEdit = false) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">
                {isEdit ? 'Edit Gig' : 'Create New Gig'}
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                {isEdit ? 'Update your gig information' : 'Create a new service to offer clients'}
              </p>
            </div>
            <button
              onClick={closeForms}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={isEdit ? handleEditGig : handleCreateGig} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gig Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                  formErrors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Professional Website Development"
              />
              {formErrors.title && (
                <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                  formErrors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {formErrors.category && (
                <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (USD) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="1"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                  formErrors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 100"
              />
              {formErrors.price && (
                <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>
              )}
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration *
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                  formErrors.duration ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 3-5 days"
              />
              {formErrors.duration && (
                <p className="text-red-500 text-sm mt-1">{formErrors.duration}</p>
              )}
            </div>

            {/* Skills */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Skills *
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                  formErrors.skills ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., React, Node.js, MongoDB"
              />
              {formErrors.skills && (
                <p className="text-red-500 text-sm mt-1">{formErrors.skills}</p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 ${
                  formErrors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe your service in detail..."
              />
              {formErrors.description && (
                <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
              )}
            </div>

            {/* Portfolio Link */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portfolio Link (Optional)
              </label>
              <input
                type="url"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                placeholder="https://your-portfolio.com"
              />
            </div>

            {/* Gig Images */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gig Images (Optional) - Max 5 images
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Upload images related to your gig. Supported formats: JPEG, PNG, GIF, WebP. Max size: 5MB per image.
              </p>
              
              {/* Selected Images Preview */}
              {selectedImages.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Images:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== index))}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Uploaded Images Display */}
              {uploadedImages.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image.url}
                          alt={image.caption}
                          className="w-full h-24 object-cover rounded-lg border border-gray-300"
                        />
                        <p className="text-xs text-gray-600 mt-1 truncate">{image.caption}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Progress */}
              {isUploadingImages && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    <span className="text-sm text-blue-700">Uploading images...</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={closeForms}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : (isEdit ? 'Update Gig' : 'Create Gig')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">My Gigs</h3>
          <p className="text-gray-600 mt-2">Manage your services and offerings</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
        >
          + Create New Gig
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-800">{success}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Gigs List */}
      {loading && gigs.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-200">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your gigs...</p>
        </div>
      ) : gigs.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-200">
          <div className="text-6xl mb-4">💼</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No gigs yet</h3>
          <p className="text-gray-600 mb-6">Start creating gigs to offer your services to clients!</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-all duration-300"
          >
            Create Your First Gig
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {gigs.map(gig => (
            <div key={gig._id} className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-shadow duration-300">
              {/* Status Badge */}
              <div className="flex justify-between items-start mb-4">
                {getStatusBadge(gig.status)}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openEditForm(gig)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteGig(gig._id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Gig Info */}
              <h4 className="text-lg font-bold text-gray-900 mb-2">{gig.title}</h4>
              <p className="text-gray-600 text-sm mb-3 line-clamp-3">{gig.description}</p>
              
              {/* Gig Images */}
              {gig.images && gig.images.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Images:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {gig.images.slice(0, 4).map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image.url}
                          alt={image.caption || `Gig image ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg border border-gray-200"
                        />
                        {index === 3 && gig.images.length > 4 && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs font-medium">+{gig.images.length - 4}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Category:</span>
                  <span className="font-semibold text-blue-600">{gig.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Price:</span>
                  <span className="font-semibold text-green-600">${gig.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Duration:</span>
                  <span className="font-semibold">{gig.deliveryTime ? `${gig.deliveryTime} Days` : gig.duration}</span>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {Array.isArray(gig.skills) 
                    ? gig.skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {skill}
                        </span>
                      ))
                    : gig.skills.split(',').map((skill, index) => (
                        <span key={index} className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {skill.trim()}
                        </span>
                      ))
                  }
                </div>
              </div>

              {/* Rating */}
              {gig.rating > 0 && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(gig.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span>{gig.rating.toFixed(1)} ({gig.totalReviews} reviews)</span>
                </div>
              )}

              {/* Created Date */}
              <div className="text-xs text-gray-500 mt-4 pt-4 border-t border-gray-200">
                Created: {new Date(gig.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Forms */}
      {showCreateForm && renderGigForm(false)}
      {showEditForm && renderGigForm(true)}
    </div>
  );
};

export default GigManagement;
