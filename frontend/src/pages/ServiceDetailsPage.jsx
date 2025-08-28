import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, getUserData } from '../utils/auth';
import PaymentModal from '../components/PaymentModal';
import PostPaymentModal from '../components/PostPaymentModal';

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
        
        const response = await fetch(`http://localhost:5000/api/services/${id}`);
        if (!response.ok) {
          throw new Error('Service not found');
        }
        
        const result = await response.json();
        if (result.success) {
          setService(result.data);
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
    
    if (service.type === 'gig') {
      setShowOrderModal(true);
    } else {
      // For job posts, show post payment modal
      setShowOrderModal(true);
    }
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
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium">
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
                        {service.deadline && (
                          <span>Deadline: {new Date(service.deadline).toLocaleDateString()}</span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Tags/Skills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {service.type === 'gig' ? (
                  <>
                    {service.skills && service.skills.map((skill, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                    {service.tags && service.tags.map((tag, index) => (
                      <span key={index} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </>
                ) : (
                  <>
                    {service.requiredSkills && service.requiredSkills.map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                    {service.location && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        📍 {service.location}
                      </span>
                    )}
                  </>
                )}
              </div>

                             {/* Gallery */}
               {service.images && service.images.length > 0 && (
                 <div className="mb-6">
                   {/* Gallery View Selector */}
                   {service.images.length > 1 && (
                     <div className="flex justify-center mb-4 space-x-2">
                       <button
                         onClick={() => setGalleryView('slideshow')}
                         className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                           galleryView === 'slideshow'
                             ? 'bg-yellow-500 text-black'
                             : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                         }`}
                       >
                         Slideshow
                       </button>
                       <button
                         onClick={() => setGalleryView('grid')}
                         className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                           galleryView === 'grid'
                             ? 'bg-yellow-500 text-black'
                             : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                         }`}
                       >
                         Grid View
                       </button>
                       <button
                         onClick={() => setGalleryView('masonry')}
                         className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                           galleryView === 'masonry'
                             ? 'bg-yellow-500 text-black'
                             : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                         }`}
                       >
                         Masonry
                       </button>
                     </div>
                   )}
                                                             {service.images.length === 1 ? (
                       // Single image display
                       <div className="w-full">
                         <img
                           src={service.images[0].url}
                           alt={service.images[0].caption || 'Service preview'}
                           className="w-full h-96 object-contain rounded-lg bg-gray-50"
                         />
                       </div>
                     ) : (
                       // Multiple images - different view modes
                       <>
                         {galleryView === 'slideshow' && (
                           <div className="relative w-full bg-gray-50 rounded-lg overflow-hidden">
                             {/* Current Image Container */}
                             <div className="relative flex justify-center items-center min-h-96 p-4">
                               <img
                                 src={service.images[activeImageIndex].url}
                                 alt={service.images[activeImageIndex].caption || `Service preview ${activeImageIndex + 1}`}
                                 className="max-w-full max-h-96 object-contain"
                               />
                               
                               {/* Navigation Arrows - positioned relative to image */}
                               <button
                                 onClick={() => {
                                   setActiveImageIndex(prev => prev === 0 ? service.images.length - 1 : prev - 1);
                                   setIsAutoPlaying(false);
                                 }}
                                 className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200 z-10"
                               >
                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                 </svg>
                               </button>
                               
                               <button
                                 onClick={() => {
                                   setActiveImageIndex(prev => prev === service.images.length - 1 ? 0 : prev + 1);
                                   setIsAutoPlaying(false);
                                 }}
                                 className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200 z-10"
                               >
                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                               </svg>
                               </button>
                               
                               {/* Image Counter - positioned at bottom of image area */}
                               <div className="absolute bottom-6 right-6 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                                 {activeImageIndex + 1} / {service.images.length}
                               </div>
                               
                               {/* Auto-play Toggle Button - positioned at bottom of image area */}
                               <button
                                 onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                                 className="absolute bottom-6 left-6 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200 z-10"
                                 title={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
                               >
                                 {isAutoPlaying ? (
                                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                   </svg>
                                 ) : (
                                   <svg className="w-4 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 0118 0z" />
                                   </svg>
                                 )}
                               </button>
                             </div>
                           </div>
                         )}

                         {galleryView === 'grid' && (
                           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                             {service.images.map((image, index) => (
                               <div key={index} className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
                                 <img
                                   src={image.url}
                                   alt={image.caption || `Service preview ${index + 1}`}
                                   className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                 />
                               </div>
                             ))}
                           </div>
                         )}

                         {galleryView === 'masonry' && (
                           <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                             {service.images.map((image, index) => (
                               <div key={index} className="break-inside-avoid mb-4">
                                 <img
                                   src={image.url}
                                   alt={image.caption || `Service preview ${index + 1}`}
                                   className="w-full rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                                 />
                               </div>
                             ))}
                           </div>
                         )}

                         {/* Thumbnail Navigation for Slideshow */}
                         {galleryView === 'slideshow' && (
                           <div className="flex justify-center mt-3 space-x-2">
                             {service.images.map((image, index) => (
                               <button
                                 key={index}
                                 onClick={() => {
                                   setActiveImageIndex(index);
                                   setIsAutoPlaying(false);
                                 }}
                                 className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                   index === activeImageIndex 
                                     ? 'border-yellow-500 scale-110' 
                                     : 'border-gray-300 hover:border-gray-400'
                                 }`}
                               >
                                 <img
                                   src={image.url}
                                   alt={image.caption || `Thumbnail ${index + 1}`}
                                   className="w-full h-full object-cover"
                                 />
                               </button>
                             ))}
                           </div>
                         )}
                       </>
                     )}
                 </div>
               )}

              {/* Portfolio */}
              {service.portfolio && service.portfolio.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Portfolio</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.portfolio.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                        )}
                        <h4 className="font-semibold text-gray-800 mb-2">{item.title}</h4>
                        <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                        {item.projectUrl && (
                          <a
                            href={item.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-yellow-600 hover:text-yellow-700 text-sm font-medium"
                          >
                            View Project →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', name: 'Overview' },
                    { id: 'faq', name: 'FAQ' },
                    { id: 'reviews', name: `Reviews (${service.reviews?.length || 0})` }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-yellow-500 text-yellow-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-4">About This Service</h3>
                      <p className="text-gray-600 leading-relaxed">{service.description}</p>
                    </div>

                    {service.requirements && (
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Requirements</h3>
                        <p className="text-gray-600 leading-relaxed">{service.requirements}</p>
                      </div>
                    )}

                    {service.whatYouGet && service.whatYouGet.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4">What You Get</h3>
                        <ul className="space-y-2">
                          {service.whatYouGet.map((item, index) => (
                            <li key={index} className="text-gray-600 flex items-center">
                              <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {hasPackages && (
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Service Packages</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {Object.entries(packages).map(([key, pkg]) => (
                            <div key={key} className="border border-gray-200 rounded-lg p-4">
                              <h4 className="font-semibold text-gray-800 mb-2">{pkg.name}</h4>
                              <p className="text-gray-600 text-sm mb-3">{pkg.description}</p>
                              <ul className="space-y-1">
                                {pkg.features && pkg.features.slice(0, 3).map((feature, index) => (
                                  <li key={index} className="text-sm text-gray-600 flex items-center">
                                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* FAQ Tab */}
                {activeTab === 'faq' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-800">Frequently Asked Questions</h3>
                    {service.faqs && service.faqs.length > 0 ? (
                      <div className="space-y-4">
                        {service.faqs.map((item, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-800 mb-2">{item.question}</h4>
                            <p className="text-gray-600">{item.answer}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No FAQs available for this service.</p>
                    )}
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-800">Reviews</h3>
                      <div className="text-right">
                        <div className="flex items-center">
                          <div className="flex text-yellow-400 mr-2">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`w-5 h-5 ${i < Math.floor(service.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-lg font-bold text-gray-800">{service.rating || 0}</span>
                        </div>
                        <p className="text-sm text-gray-600">{service.totalReviews || 0} reviews</p>
                      </div>
                    </div>

                    {service.reviews && service.reviews.length > 0 ? (
                      <div className="space-y-6">
                        {service.reviews.map((review) => (
                          <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0">
                            <div className="flex items-start space-x-4">
                              <img
                                src={review.client?.profileImage?.url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'}
                                alt={review.client?.firstName || 'User'}
                                className="w-12 h-12 rounded-full"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold text-gray-800">
                                    {review.client ? `${review.client.firstName} ${review.client.lastName}` : 'Anonymous User'}
                                  </h4>
                                  <span className="text-sm text-gray-500">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                
                                <div className="flex items-center mb-3">
                                  <div className="flex text-yellow-400 mr-2">
                                    {[...Array(5)].map((_, i) => (
                                      <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                    ))}
                                  </div>
                                </div>
                                
                                <p className="text-gray-600 mb-3">{review.comment}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No reviews yet for this service.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Package Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 sticky top-24">
              {hasPackages ? (
                <>
                  <div className="flex border-b border-gray-200 mb-6">
                    {Object.entries(packages).map(([key, pkg]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedPackage(key)}
                        className={`flex-1 py-3 px-4 text-center font-medium text-sm ${
                          selectedPackage === key
                            ? 'border-b-2 border-yellow-500 text-yellow-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {pkg.name}
                      </button>
                    ))}
                  </div>

                  {/* Selected Package Details */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gray-800">
                        ${packages[selectedPackage].price}
                      </h3>
                      <span className="text-gray-600">
                        {packages[selectedPackage].deliveryTime} {service.deliveryUnit || 'Days'} delivery
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4">{packages[selectedPackage].description}</p>

                    <ul className="space-y-2 mb-6">
                      {packages[selectedPackage].features && packages[selectedPackage].features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="text-sm text-gray-600 mb-6">
                      <div className="flex items-center justify-between">
                        <span>Revisions:</span>
                        <span>{packages[selectedPackage].revisions || 1}</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-800">
                      ${service.price}
                    </h3>
                    <span className="text-gray-600">
                      {service.deliveryTime} {service.deliveryUnit || 'Days'} delivery
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
                  {service.type === 'gig' ? 'Order Now' : 'Apply Now'}
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
                {service.type === 'gig' ? (
                  <>
                    {service.university && (
                      <p className="text-gray-600">{service.university}</p>
                    )}
                    {service.degreeProgram && (
                      <p className="text-gray-600 text-sm">{service.degreeProgram}</p>
                    )}
                  </>
                ) : (
                  <p className="text-gray-600">{service.clientId?.organization || 'Individual Client'}</p>
                )}
              </div>

              <div className="space-y-3 text-sm">
                {service.rating > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Rating:</span>
                    <div className="flex items-center">
                      <span className="text-yellow-600 mr-1">{service.rating}</span>
                      <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                )}
                
                {service.totalReviews > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Reviews:</span>
                    <span className="font-medium">{service.totalReviews}</span>
                  </div>
                )}
                
                {service.experience && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Experience:</span>
                    <span className="font-medium">{service.experience}</span>
                  </div>
                )}

              </div>

                             {/* Profile Details Section */}
               <div className="mt-6 pt-6 border-t border-gray-200">
                 <div className="space-y-4">
                   {/* Response Time */}
                   <div className="flex items-center justify-between">
                     <span className="text-gray-600 text-sm">Response Time</span>
                     <span className="text-sm font-medium text-gray-800">
                       {service.responseTime || 'Usually responds in 1 hour'}
                     </span>
                   </div>

                   {/* Last Seen */}
                   <div className="flex items-center justify-between">
                     <span className="text-gray-600 text-sm">Last Seen</span>
                     <span className="text-sm font-medium text-gray-800">
                       {service.lastSeen ? new Date(service.lastSeen).toLocaleDateString() : 'Recently'}
                     </span>
                   </div>

                   {/* Member Since */}
                   <div className="flex items-center justify-between">
                     <span className="text-gray-600 text-sm">Member Since</span>
                     <span className="text-sm font-medium text-gray-800">
                       {service.memberSince ? new Date(service.memberSince).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '2024'}
                     </span>
                   </div>

                                                            {/* Languages */}
                     <div className="flex items-center justify-between">
                       <span className="text-gray-600 text-sm">Languages</span>
                       <div className="flex gap-2 justify-end">
                         {service.languages && service.languages.length > 0 ? (
                           <>
                             {service.languages.slice(0, 3).map((language, index) => (
                               <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap">
                                 {language}
                               </span>
                             ))}
                             {service.languages.length > 3 && (
                               <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap">
                                 +{service.languages.length - 3}
                               </span>
                             )}
                           </>
                         ) : (
                           <>
                             <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap">
                               English
                             </span>
                             <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap">
                               Sinhala
                             </span>
                           </>
                         )}
                       </div>
                     </div>
                 </div>
               </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  to={service.type === 'gig' ? `/freelancer/${service.freelancerId}` : `/client/${service.clientId?._id}`}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors text-center block"
                >
                  {service.type === 'gig' ? 'View Freelancer Profile' : 'View Client Profile'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Contact {service.type === 'gig' ? service.freelancerName : `${service.clientId?.firstName} ${service.clientId?.lastName}`}
              </h2>
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
                  required
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Describe your project requirements..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                  <input
                    type="number"
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

      {/* Payment Modal */}
      {service.type === 'gig' ? (
        <PaymentModal
          isOpen={showOrderModal}
          onClose={closeOrderModal}
          service={service}
          selectedPackage={selectedPackage}
        />
      ) : (
        <PostPaymentModal
          isOpen={showOrderModal}
          onClose={closeOrderModal}
          post={service}
        />
      )}

    </div>
  );
}

export default ServiceDetailsPage;
