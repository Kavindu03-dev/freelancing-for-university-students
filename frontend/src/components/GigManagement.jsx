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
    skills: '',
    portfolio: '',
    packages: {
      basic: {
        name: 'Basic',
        price: '',
        description: '',
        features: [''],
        deliveryTime: '',
        revisions: 1
      },
      standard: {
        name: 'Standard',
        price: '',
        description: '',
        features: [''],
        deliveryTime: '',
        revisions: 2
      },
      premium: {
        name: 'Premium',
        price: '',
        description: '',
        features: [''],
        deliveryTime: '',
        revisions: 3
      }
    }
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [activeStep, setActiveStep] = useState(1);

  // Function to get user ID from JWT token
  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) return null;
      
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
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
      
      if (!userId) {
        setError('Unable to get user ID from token');
        return;
      }
      
      const response = await fetch(`/api/services/freelancer/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setGigs(data.data || []);
      } else {
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
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePackageChange = (packageType, field, value) => {
    setFormData(prev => ({
      ...prev,
      packages: {
        ...prev.packages,
        [packageType]: {
          ...prev.packages[packageType],
          [field]: value
        }
      }
    }));
  };

  const handleFeatureChange = (packageType, index, value) => {
    setFormData(prev => ({
      ...prev,
      packages: {
        ...prev.packages,
        [packageType]: {
          ...prev.packages[packageType],
          features: prev.packages[packageType].features.map((feature, i) => 
            i === index ? value : feature
          )
        }
      }
    }));
  };

  const addFeature = (packageType) => {
    setFormData(prev => ({
      ...prev,
      packages: {
        ...prev.packages,
        [packageType]: {
          ...prev.packages[packageType],
          features: [...prev.packages[packageType].features, '']
        }
      }
    }));
  };

  const removeFeature = (packageType, index) => {
    setFormData(prev => ({
      ...prev,
      packages: {
        ...prev.packages,
        [packageType]: {
          ...prev.packages[packageType],
          features: prev.packages[packageType].features.filter((_, i) => i !== index)
        }
      }
    }));
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
    
    if (!formData.title?.trim()) errors.title = 'Title is required';
    if (!formData.description?.trim()) errors.description = 'Description is required';
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.skills?.trim()) errors.skills = 'Skills are required';
    
    // Validate packages
    const packages = formData.packages;
    if (!packages.basic.price || !packages.basic.description) {
      errors.packages = 'Basic package requires price and description';
    }
    if (!packages.standard.price || !packages.standard.description) {
      errors.packages = 'Standard package requires price and description';
    }
    if (!packages.premium.price || !packages.premium.description) {
      errors.packages = 'Premium package requires price and description';
    }

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
      
      // Prepare gig data with packages
      const gigData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: formData.packages.basic.price, // Use basic package price as main price
        duration: formData.packages.basic.deliveryTime || 1,
        skills: formData.skills,
        portfolio: formData.portfolio || '',
        images: images,
        packages: formData.packages
      };
      
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(gigData)
      });
      
      if (response.ok) {
        const result = await response.json();
        setSuccess('Gig created successfully!');
        resetForm();
        setShowCreateForm(false);
        fetchUserGigs();
      } else {
        const errorData = await response.json();
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
    
    if (!validateForm() || !editingGig) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      
      // Upload new images first if any are selected
      let newImages = [];
      if (selectedImages.length > 0) {
        newImages = await uploadImages();
        if (newImages.length === 0 && selectedImages.length > 0) {
          setError('Failed to upload new images. Please try again.');
          return;
        }
      }
      
      // Combine existing images (that weren't removed) with new images
      const finalImages = [...uploadedImages, ...newImages];
      
      // Prepare gig data with packages
      const gigData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: formData.packages.basic.price,
        duration: formData.packages.basic.deliveryTime || 1,
        skills: formData.skills,
        portfolio: formData.portfolio || '',
        images: finalImages,
        packages: formData.packages
      };
      
      const response = await fetch(`/api/services/${editingGig._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(gigData)
      });
      
      if (response.ok) {
        const result = await response.json();
        setSuccess('Gig updated successfully!');
        resetForm();
        setShowEditForm(false);
        setEditingGig(null);
        fetchUserGigs();
      } else {
        const errorData = await response.json();
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
      
      const response = await fetch(`/api/services/${gigId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setSuccess('Gig deleted successfully!');
        fetchUserGigs();
      } else {
        const errorData = await response.json();
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
      skills: Array.isArray(gig.skills) ? gig.skills.join(', ') : gig.skills || '',
      portfolio: gig.portfolio || '',
      packages: gig.packages || {
        basic: { name: 'Basic', price: '', description: '', features: [''], deliveryTime: '', revisions: 1 },
        standard: { name: 'Standard', price: '', description: '', features: [''], deliveryTime: '', revisions: 2 },
        premium: { name: 'Premium', price: '', description: '', features: [''], deliveryTime: '', revisions: 3 }
      }
    });
    
    // Load existing images if they exist
    if (gig.images && gig.images.length > 0) {
      setUploadedImages(gig.images);
    } else {
      setUploadedImages([]);
    }
    
    setSelectedImages([]);
    setShowEditForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      skills: '',
      portfolio: '',
      packages: {
        basic: { name: 'Basic', price: '', description: '', features: [''], deliveryTime: '', revisions: 1 },
        standard: { name: 'Standard', price: '', description: '', features: [''], deliveryTime: '', revisions: 2 },
        premium: { name: 'Premium', price: '', description: '', features: [''], deliveryTime: '', revisions: 3 }
      }
    });
    setSelectedImages([]);
    setUploadedImages([]);
    setFormErrors({});
    setActiveStep(1);
  };

  const closeForms = () => {
    setShowCreateForm(false);
    setShowEditForm(false);
    setEditingGig(null);
    resetForm();
    setError('');
    setSuccess('');
  };

  const nextStep = () => {
    if (activeStep < 3) setActiveStep(activeStep + 1);
  };

  const prevStep = () => {
    if (activeStep > 1) setActiveStep(activeStep - 1);
  };

  const renderPackageForm = (packageType, packageData) => (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border-2 border-gray-200 hover:border-yellow-400 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-black capitalize">{packageType} Package</h4>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Revisions:</span>
          <input
            type="number"
            min="0"
            max="10"
            value={packageData.revisions}
            onChange={(e) => handlePackageChange(packageType, 'revisions', parseInt(e.target.value))}
            className="w-16 px-2 py-1 text-sm border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Price (USD) *
          </label>
          <input
            type="number"
            min="1"
            value={packageData.price}
            onChange={(e) => handlePackageChange(packageType, 'price', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400"
            placeholder="e.g., 100"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Delivery Time (Days) *
          </label>
          <input
            type="number"
            min="1"
            value={packageData.deliveryTime}
            onChange={(e) => handlePackageChange(packageType, 'deliveryTime', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400"
            placeholder="e.g., 3"
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-black mb-2">
          Description *
        </label>
        <textarea
          value={packageData.description}
          onChange={(e) => handlePackageChange(packageType, 'description', e.target.value)}
          rows="3"
          className="w-full px-4 py-3 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400"
          placeholder={`Describe what's included in the ${packageType} package...`}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-black mb-2">
          Features
        </label>
        {packageData.features.map((feature, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={feature}
              onChange={(e) => handleFeatureChange(packageType, index, e.target.value)}
              className="flex-1 px-3 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400"
              placeholder="e.g., Responsive design"
            />
            <button
              type="button"
              onClick={() => removeFeature(packageType, index)}
              className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-300 hover:scale-105"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addFeature(packageType)}
          className="mt-2 px-4 py-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-lg transition-all duration-300 text-sm font-medium hover:scale-105"
        >
          + Add Feature
        </button>
      </div>
    </div>
  );

  const renderGigForm = () => (
    <div className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black p-6 rounded-t-2xl animate-slide-in-down">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">
                {showEditForm ? 'Edit Gig' : 'Create New Gig'}
              </h2>
              <p className="text-black/80 text-sm mt-1">
                {showEditForm ? 'Update your service details' : 'Create a new service to offer clients'}
              </p>
            </div>
            <button
              onClick={closeForms}
              className="text-black hover:text-gray-800 text-2xl font-bold transition-all duration-200 hover:scale-110"
            >
              ×
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200 animate-slide-in-down" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-center space-x-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  activeStep >= step 
                    ? 'bg-yellow-500 text-black shadow-md' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                <span className={`ml-2 text-sm font-medium transition-all duration-300 ${
                  activeStep >= step ? 'text-yellow-600' : 'text-gray-500'
                }`}>
                  {step === 1 ? 'Basic Info' : step === 2 ? 'Packages' : 'Media & Submit'}
                </span>
                {step < 3 && (
                  <div className={`w-16 h-0.5 ml-4 transition-all duration-300 ${
                    activeStep > step ? 'bg-yellow-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={showEditForm ? handleEditGig : handleCreateGig} className="p-6 space-y-6 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
          {/* Step 1: Basic Information */}
          {activeStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <label className="block text-sm font-medium text-black mb-2">
                    Gig Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400 ${
                      formErrors.title ? 'border-red-500' : 'border-gray-400'
                    }`}
                    placeholder="e.g., Professional Website Development"
                  />
                  {formErrors.title && (
                    <p className="text-red-500 text-sm mt-1 animate-shake">{formErrors.title}</p>
                  )}
                </div>

                <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                  <label className="block text-sm font-medium text-black mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400 ${
                      formErrors.category ? 'border-red-500' : 'border-gray-400'
                    }`}
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {formErrors.category && (
                    <p className="text-red-500 text-sm mt-1 animate-shake">{formErrors.category}</p>
                  )}
                </div>

                <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                  <label className="block text-sm font-medium text-black mb-2">
                    Required Skills *
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400 ${
                      formErrors.skills ? 'border-red-500' : 'border-gray-400'
                    }`}
                    placeholder="e.g., React, Node.js, MongoDB"
                  />
                  {formErrors.skills && (
                    <p className="text-red-500 text-sm mt-1 animate-shake">{formErrors.skills}</p>
                  )}
                </div>

                <div className="md:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                  <label className="block text-sm font-medium text-black mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400 ${
                      formErrors.description ? 'border-red-500' : 'border-gray-400'
                    }`}
                    placeholder="Describe your service in detail..."
                  />
                  {formErrors.description && (
                    <p className="text-red-500 text-sm mt-1 animate-shake">{formErrors.description}</p>
                  )}
                </div>

                <div className="md:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                  <label className="block text-sm font-medium text-black mb-2">
                    Portfolio Link (Optional)
                  </label>
                  <input
                    type="url"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400"
                    placeholder="https://your-portfolio.com"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Packages */}
          {activeStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>Service Packages</h3>
              <p className="text-gray-600 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>Define your service tiers with different features and pricing.</p>
              
              {formErrors.packages && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                  <p className="text-red-800 text-sm">{formErrors.packages}</p>
                </div>
              )}
              
              <div className="space-y-6">
                {renderPackageForm('basic', formData.packages.basic)}
                {renderPackageForm('standard', formData.packages.standard)}
                {renderPackageForm('premium', formData.packages.premium)}
              </div>
            </div>
          )}

          {/* Step 3: Media & Submit */}
          {activeStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>Media & Final Details</h3>
              
              <div className="space-y-6">
                <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <label className="block text-sm font-medium text-black mb-2">
                    Gig Images (Optional) - Max 5 images
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="w-full px-4 py-3 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Upload images related to your gig. Supported formats: JPEG, PNG, GIF, WebP. Max size: 5MB per image.
                  </p>
                  
                  {/* Current Images Display */}
                  {uploadedImages.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Current Images:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {uploadedImages.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={typeof image === 'string' ? image : (image.url || image)}
                              alt={`Current ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-gray-300"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/150x150?text=Image+Error';
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setUploadedImages(prev => prev.filter((_, i) => i !== index));
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-all duration-200"
                              title="Remove image"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Click the × button to remove images. You can add new images below.
                      </p>
                    </div>
                  )}

                  {/* Selected Images Preview */}
                  {selectedImages.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">New Images to Upload:</h4>
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
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-all duration-200"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload Progress */}
                  {isUploadingImages && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-500"></div>
                        <span className="text-sm text-yellow-700">Uploading images...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200 animate-slide-in-up" style={{ animationDelay: '0.9s' }}>
            <div className="flex space-x-4">
              {activeStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border-2 border-gray-400 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300 hover:border-yellow-400 hover:text-yellow-600"
                >
                  Previous
                </button>
              )}
              <button
                type="button"
                onClick={closeForms}
                className="px-6 py-3 border-2 border-gray-400 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300 hover:border-yellow-400 hover:text-yellow-600"
              >
                Cancel
              </button>
            </div>
            
            <div className="flex space-x-4">
              {activeStep < 3 && (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-xl font-medium hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Next
                </button>
              )}
              {activeStep === 3 && (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-xl font-medium hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl"
                >
                  {loading ? 'Saving...' : (showEditForm ? 'Update Gig' : 'Create Gig')}
                </button>
              )}
            </div>
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
          className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-xl font-medium hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-lg hover:shadow-xl"
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
          <div className="animate-spin w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your gigs...</p>
        </div>
      ) : gigs.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-200">
          <div className="text-6xl mb-4">💼</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No gigs yet</h3>
          <p className="text-gray-600 mb-6">Start creating gigs to offer your services to clients!</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-xl font-medium hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300"
          >
            Create Your First Gig
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {gigs.map(gig => (
            <div key={gig._id} className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 group">
              {/* Gig Header */}
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 text-black">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-xl font-bold leading-tight line-clamp-2">{gig.title}</h4>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditForm(gig)}
                      className="p-2 border border-gray-300 hover:border-yellow-500 rounded-lg transition-all duration-200 bg-transparent hover:bg-yellow-50"
                      title="Edit Gig"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteGig(gig._id)}
                      className="p-2 border border-gray-300 hover:border-red-500 rounded-lg transition-all duration-200 bg-transparent hover:bg-red-50"
                      title="Delete Gig"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-black/80 text-sm">
                  <span className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span>{gig.category}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{gig.deliveryTime || 1} {gig.deliveryUnit || 'Days'}</span>
                  </span>
                </div>
              </div>

              {/* Gig Content */}
              <div className="p-6">
                {/* Description */}
                <p className="text-gray-700 text-sm leading-relaxed mb-6 line-clamp-3">
                  {gig.description}
                </p>

                {/* Skills */}
                {gig.skills && gig.skills.length > 0 && (
                  <div className="mb-6">
                    <h5 className="text-sm font-semibold text-gray-900 mb-3">Skills Required</h5>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(gig.skills) ? gig.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 text-yellow-600 text-xs font-medium rounded-full border border-yellow-500 bg-transparent">
                          {skill}
                        </span>
                      )) : (
                        <span className="px-3 py-1 text-yellow-600 text-xs font-medium rounded-full border border-yellow-500 bg-transparent">
                          {gig.skills}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Packages Display */}
                {gig.packages && Object.keys(gig.packages).length > 0 && (
                  <div className="mb-6">
                    <h5 className="text-sm font-semibold text-gray-900 mb-3">Service Packages</h5>
                    <div className="space-y-3">
                      {Object.entries(gig.packages).map(([type, pkg]) => (
                        <div key={type} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs font-bold rounded-full border ${
                                type === 'basic' ? 'border-green-500 text-green-600 bg-transparent' :
                                type === 'standard' ? 'border-blue-500 text-blue-600 bg-transparent' :
                                'border-purple-500 text-purple-600 bg-transparent'
                              }`}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </span>
                              <span className="text-sm font-medium text-gray-700">{pkg.name}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-600">${pkg.price}</div>
                              <div className="text-xs text-gray-500">{pkg.deliveryTime} days</div>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{pkg.description}</p>
                          
                          {/* Features */}
                          {pkg.features && pkg.features.length > 0 && pkg.features[0] && (
                            <div className="space-y-1">
                              {pkg.features.slice(0, 3).map((feature, index) => (
                                <div key={index} className="flex items-center space-x-2 text-xs text-gray-600">
                                  <svg className="w-3 h-3 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span className="line-clamp-1">{feature}</span>
                                </div>
                              ))}
                              {pkg.features.length > 3 && (
                                <div className="text-xs text-gray-500 pt-1">
                                  +{pkg.features.length - 3} more features
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Revisions */}
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex justify-between items-center text-xs text-gray-500">
                              <span>Revisions:</span>
                              <span className="font-medium">{pkg.revisions || 1}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Portfolio */}
                {gig.portfolio && gig.portfolio.length > 0 && (
                  <div className="mb-6">
                    <h5 className="text-sm font-semibold text-gray-900 mb-3">Portfolio</h5>
                    <div className="space-y-2">
                      {Array.isArray(gig.portfolio) ? gig.portfolio.map((item, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <h6 className="text-sm font-medium text-gray-800 mb-1">{item.title}</h6>
                          <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>
                        </div>
                      )) : (
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <p className="text-sm text-gray-600">{gig.portfolio}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Status and Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${
                      gig.status === 'approved' ? 'border-green-500 text-green-600 bg-transparent' :
                      gig.status === 'pending' ? 'border-yellow-500 text-yellow-600 bg-transparent' :
                      gig.status === 'rejected' ? 'border-red-500 text-red-600 bg-transparent' :
                      'border-gray-400 text-gray-600 bg-transparent'
                    }`}>
                      {gig.status ? gig.status.charAt(0).toUpperCase() + gig.status.slice(1) : 'Draft'}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditForm(gig)}
                      className="px-4 py-2 text-sm bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteGig(gig._id)}
                      className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Form */}
      {(showCreateForm || showEditForm) && renderGigForm()}
    </div>
  );
};

export default GigManagement;
