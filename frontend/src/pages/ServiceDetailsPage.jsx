import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, getUserData } from '../utils/auth';
import PaymentModal from '../components/PaymentModal';
import JobApplicationModal from '../components/JobApplicationModal';

function ServiceDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState('basic');
  const [showContactModal, setShowContactModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contactForm, setContactForm] = useState({
    message: '',
    budget: '',
    deadline: ''
  });
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [galleryView, setGalleryView] = useState('slideshow'); // 'slideshow', 'grid', 'masonry'

  // Fetch service data from backend
  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching service with ID:', id);
        const response = await fetch(`/api/services/${id}`);
        if (!response.ok) {
          throw new Error('Service not found');
        }
        
        const result = await response.json();
        console.log('Service API response:', result);
        
        if (result.success) {
          setService(result.data);
          console.log('Service data set:', result.data);
          console.log('Service images:', result.data.images);
        } else {
          throw new Error(result.message || 'Failed to fetch service');
        }
      } catch (err) {
        console.error('Error fetching service:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  // Auto-play slideshow effect
  useEffect(() => {
    if (!isAutoPlaying || !service?.images || service.images.length <= 1) return;

    const interval = setInterval(() => {
      setActiveImageIndex(prev => (prev + 1) % service.images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, service?.images]);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Handle contact form submission
    console.log('Contact form submitted:', contactForm);
    setShowContactModal(false);
    setContactForm({ message: '', budget: '', deadline: '' });
  };

  const handleOrderNow = () => {
    if (!isAuthenticated()) {
      // Redirect to login
      navigate('/signin');
      return;
    }
    setShowOrderModal(true);
  };

  const confirmOrder = () => {
    // Handle order confirmation
    console.log('Order confirmed for package:', selectedPackage);
    setShowOrderModal(false);
    // In real app, redirect to payment or order management
  };

  const closeOrderModal = () => {
    setShowOrderModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Service Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The service you\'re looking for doesn\'t exist.'}</p>
          <Link to="/services" className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
            Browse Services
          </Link>
        </div>
      </div>
    );
  }

  // Check if service has packages, if not, create default ones
  const hasPackages = service.packages && Object.keys(service.packages).length > 0;
  const defaultPackages = {
    basic: {
      name: 'Basic',
      price: service.price,
      description: service.description,
      features: service.whatYouGet || ['Basic service delivery'],
      deliveryTime: service.deliveryTime || 1,
      revisions: 1
    }
  };

  const packages = hasPackages ? service.packages : defaultPackages;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to="/services" className="text-gray-500 hover:text-gray-700">Services</Link>
            <span className="text-gray-400">/</span>
            <Link to={`/services?category=${service.category}`} className="text-gray-500 hover:text-gray-700">{service.category}</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800 font-medium truncate">{service.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Service Header */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{service.title}</h1>
              
              {/* Freelancer/Client Info */}
              <div className="flex items-center mb-6">
                <img
                  src={
                    service.type === 'gig' 
                      ? (service.freelancerAvatar || service.freelancerId?.profileImage?.url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80')
                      : (service.clientId?.profileImage?.url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80')
                  }
                  alt={service.type === 'gig' ? service.freelancerName : `${service.clientId?.firstName} ${service.clientId?.lastName}`}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <div className="flex items-center">
                    <h3 className="font-semibold text-gray-800 mr-2">
                      {service.type === 'gig' ? service.freelancerName : `${service.clientId?.firstName} ${service.clientId?.lastName}`}
                    </h3>
                    {service.university && (
                      <span className="bg-transparent border border-yellow-400/50 text-yellow-700 px-2 py-0.5 rounded text-sm font-medium backdrop-blur-sm">
                        {service.university}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    {service.type === 'gig' ? (
                      <>
                        <div className="flex items-center mr-4">
                          <div className="flex text-yellow-400 mr-1">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`w-4 h-4 ${i < Math.floor(service.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span>{service.rating || 0} ({service.totalReviews || 0})</span>
                        </div>
                        {service.experience && (
                          <span>{service.experience} experience</span>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="mr-4">{service.clientId?.organization || 'Individual Client'}</span>
                        <span>{service.location || 'Remote'}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Service Description */}
              <p className="text-gray-600 text-lg leading-relaxed mb-6">{service.description}</p>

              {/* Service Tags */}
              {service.tags && service.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {service.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Image Gallery */}
            {console.log('Rendering gallery section. Images:', service.images, 'Length:', service.images?.length)}
            {service.images && service.images.length > 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Gallery</h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setGalleryView('slideshow')}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        galleryView === 'slideshow' 
                          ? 'bg-yellow-500 text-black' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Slideshow
                    </button>
                    <button
                      onClick={() => setGalleryView('grid')}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        galleryView === 'grid' 
                          ? 'bg-yellow-500 text-black' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Grid
                    </button>
                  </div>
                </div>

                {galleryView === 'slideshow' ? (
                  <div className="relative">
                    {console.log('Rendering slideshow. Active image:', activeImageIndex, 'Image URL:', service.images[activeImageIndex])}
                    <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                      <img
                        src={service.images[activeImageIndex].url}
                        alt={service.images[activeImageIndex].caption || `${service.title} - Image ${activeImageIndex + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => console.error('Image failed to load:', e.target.src)}
                        onLoad={() => console.log('Image loaded successfully:', service.images[activeImageIndex].url)}
                      />
                    </div>
                    
                    {service.images.length > 1 && (
                      <>
                        <button
                          onClick={() => setActiveImageIndex(prev => prev === 0 ? service.images.length - 1 : prev - 1)}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setActiveImageIndex(prev => (prev + 1) % service.images.length)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        
                        <div className="flex justify-center mt-4 space-x-2">
                          {service.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setActiveImageIndex(index)}
                              className={`w-3 h-3 rounded-full ${
                                index === activeImageIndex ? 'bg-yellow-500' : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {console.log('Rendering grid view. Images:', service.images)}
                    {service.images.map((image, index) => (
                      <div key={index} className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
                        <img
                          src={image.url}
                          alt={image.caption || `${service.title} - Image ${index + 1}`}
                          className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                          onError={(e) => console.error('Grid image failed to load:', e.target.src)}
                          onLoad={() => console.log('Grid image loaded successfully:', image.url)}
                          onClick={() => {
                            setGalleryView('slideshow');
                            setActiveImageIndex(index);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-4">🖼️</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Images Available</h3>
                  <p className="text-gray-500">This service doesn't have any images yet.</p>
                  {console.log('No images found. Service data:', service)}
                </div>
              </div>
            )}

            {/* Service Details Tabs */}
            <div className="bg-white rounded-xl shadow-lg">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {['overview', 'packages', 'reviews'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                        activeTab === tab
                          ? 'border-yellow-500 text-yellow-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {service.whatYouGet && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">What You'll Get</h3>
                        <ul className="space-y-2">
                          {service.whatYouGet.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              <span className="text-gray-600">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {service.requirements && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Requirements</h3>
                        <ul className="space-y-2">
                          {service.requirements.map((req, index) => (
                            <li key={index} className="flex items-start">
                              <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                              <span className="text-gray-600">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {service.additionalInfo && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Additional Information</h3>
                        <p className="text-gray-600">{service.additionalInfo}</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'packages' && (
                  <div className="space-y-6">
                    {Object.entries(packages).map(([key, pkg]) => (
                      <div key={key} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-semibold text-gray-800">{pkg.name}</h3>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-800">${pkg.price}</div>
                            <div className="text-sm text-gray-600">{pkg.deliveryTime} {pkg.deliveryUnit || 'Days'} delivery</div>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4">{pkg.description}</p>
                        
                        {pkg.features && pkg.features.length > 0 && (
                          <ul className="space-y-2 mb-4">
                            {pkg.features.map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="text-gray-600">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>{pkg.revisions} revision{pkg.revisions !== 1 ? 's' : ''}</span>
                          <button
                            onClick={() => {
                              setSelectedPackage(key);
                              handleOrderNow();
                            }}
                            className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-md font-medium transition-colors"
                          >
                            Select Package
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="py-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="mr-2">Reviews</span>
                      <span className="text-yellow-600 text-sm font-medium">{service.rating || 0} / 5 ({service.totalReviews || 0})</span>
                    </h3>
                    {!service.reviews || service.reviews.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-gray-400 text-4xl mb-4">⭐</div>
                        <p className="text-gray-500">No reviews yet. Order this service to be the first reviewer.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {service.reviews.slice().reverse().map((rev, idx) => (
                          <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <div className="flex text-yellow-400">
                                  {[...Array(5)].map((_, i) => (
                                    <svg key={i} className={`w-4 h-4 ${i < rev.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                                <span className="text-sm font-medium text-gray-800">{rev.rating}/5</span>
                              </div>
                              <span className="text-xs text-gray-500">{rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : ''}</span>
                            </div>
                            <p className="text-gray-700 text-sm whitespace-pre-line">{rev.comment}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Pricing Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              {service.type === 'gig' ? (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Packages</h3>
                  {packages && Object.keys(packages).length > 0 ? (
                    <div className="space-y-4">
                      {Object.entries(packages).map(([key, pkg]) => (
                        <div
                          key={key}
                          className={`border rounded-lg p-4 transition-all cursor-pointer ${selectedPackage === key ? 'border-yellow-500 shadow-md bg-yellow-50' : 'border-gray-200 hover:border-yellow-400'}`}
                          onClick={() => setSelectedPackage(key)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-800">{pkg.name}</h4>
                            <span className="text-gray-800 font-bold">${pkg.price}</span>
                          </div>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-3">{pkg.description}</p>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{pkg.deliveryTime} {pkg.deliveryUnit || 'Days'} delivery</span>
                            <span>{pkg.revisions} revision{pkg.revisions !== 1 ? 's' : ''}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-600 text-sm">No packages configured.</div>
                  )}
                </div>
              ) : (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-800">
                      ${service.budget || 'Negotiable'}
                    </h3>
                    <span className="text-gray-600">
                      {service.deadline ? `Deadline: ${new Date(service.deadline).toLocaleDateString()}` : 'No deadline set'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={handleOrderNow}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  {service.type === 'gig' ? `Order ${packages[selectedPackage]?.name || ''}` : 'Apply Now'}
                </button>
                <button
                  onClick={() => setShowContactModal(true)}
                  className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  {service.type === 'gig' ? 'Contact Freelancer' : 'Contact Client'}
                </button>
              </div>
            </div>

            {/* Freelancer/Client Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center mb-6">
                <img
                  src={
                    service.type === 'gig' 
                      ? (service.freelancerAvatar || service.freelancerId?.profileImage?.url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80')
                      : (service.clientId?.profileImage?.url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80')
                  }
                  alt={service.type === 'gig' ? service.freelancerName : `${service.clientId?.firstName} ${service.clientId?.lastName}`}
                  className="w-20 h-20 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-bold text-gray-800">
                  {service.type === 'gig' ? service.freelancerName : `${service.clientId?.firstName} ${service.clientId?.lastName}`}
                </h3>
                <p className="text-gray-600">
                  {service.type === 'gig' ? 'Freelancer' : 'Client'}
                </p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => setShowContactModal(true)}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  {service.type === 'gig' ? 'Contact Freelancer' : 'Contact Client'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                {service.type === 'gig' ? 'Contact Freelancer' : 'Contact Client'}
              </h3>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Describe your project requirements..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                  <input
                    type="text"
                    value={contactForm.budget}
                    onChange={(e) => setContactForm(prev => ({ ...prev, budget: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="$500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                  <input
                    type="date"
                    value={contactForm.deadline}
                    onChange={(e) => setContactForm(prev => ({ ...prev, deadline: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  Send Message
                </button>
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal for Gigs, Job Application Modal for Job Posts */}
      {service.type === 'gig' ? (
        <PaymentModal
          isOpen={showOrderModal}
          onClose={closeOrderModal}
          service={service}
          selectedPackage={selectedPackage}
        />
      ) : (
        <JobApplicationModal
          isOpen={showOrderModal}
          onClose={closeOrderModal}
          post={service}
        />
      )}
    </div>
  );
}

export default ServiceDetailsPage;
