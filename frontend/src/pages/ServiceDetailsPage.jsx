import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { isAuthenticated, getUserData } from '../utils/auth';

function ServiceDetailsPage() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState('basic');
  const [showContactModal, setShowContactModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({
    message: '',
    budget: '',
    deadline: ''
  });

  // Mock service data (in real app, fetch from API)
  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockService = {
        id: id,
        title: 'Professional Website Development with React & Node.js',
        description: 'I will create a modern, responsive website using the latest technologies. Perfect for businesses looking to establish a strong online presence.',
        category: 'Web Development',
        subcategory: 'Frontend Development',
        tags: ['React', 'Node.js', 'MongoDB', 'Responsive Design', 'SEO'],
        
        freelancer: {
          id: 1,
          name: 'Alex Johnson',
          username: 'alexjohnson_dev',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
          rating: 4.9,
          reviewCount: 127,
          level: 'Level 2 Seller',
          responseTime: '1 hour',
          lastSeen: '2 hours ago',
          memberSince: 'March 2020',
          languages: ['English', 'Spanish'],
          location: 'United States',
          description: 'Full-stack developer with 5+ years of experience in modern web technologies.',
          completedOrders: 234,
          ongoingOrders: 3
        },

        packages: {
          basic: {
            name: 'Basic',
            price: 150,
            deliveryTime: '3 days',
            revisions: 1,
            description: 'Simple landing page with responsive design',
            features: [
              '1 Page Website',
              'Responsive Design',
              'Basic SEO',
              '1 Revision',
              'Source Code'
            ]
          },
          standard: {
            name: 'Standard',
            price: 350,
            deliveryTime: '7 days',
            revisions: 3,
            description: 'Multi-page website with advanced features',
            features: [
              'Up to 5 Pages',
              'Responsive Design',
              'Advanced SEO',
              'Contact Form',
              '3 Revisions',
              'Source Code',
              'Speed Optimization'
            ]
          },
          premium: {
            name: 'Premium',
            price: 650,
            deliveryTime: '14 days',
            revisions: 5,
            description: 'Complete web solution with backend integration',
            features: [
              'Up to 10 Pages',
              'Responsive Design',
              'Advanced SEO',
              'Contact Form',
              'Backend Integration',
              'Database Setup',
              '5 Revisions',
              'Source Code',
              'Speed Optimization',
              '30 Days Support'
            ]
          }
        },

        extras: [
          {
            id: 1,
            name: 'Extra Fast Delivery (24 hours)',
            price: 50,
            description: 'Get your project delivered within 24 hours'
          },
          {
            id: 2,
            name: 'Additional Revision',
            price: 25,
            description: 'One extra revision round'
          },
          {
            id: 3,
            name: 'Logo Design',
            price: 75,
            description: 'Custom logo design for your brand'
          }
        ],

        gallery: [
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1555421689-491a97ff2040?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],

        faq: [
          {
            question: 'What do you need to get started?',
            answer: 'I need your business requirements, preferred design style, content, and any specific features you want included.'
          },
          {
            question: 'Do you provide hosting services?',
            answer: 'I can help you set up hosting, but hosting costs are separate. I can recommend reliable hosting providers.'
          },
          {
            question: 'Will my website be mobile-friendly?',
            answer: 'Yes, all websites I create are fully responsive and optimized for mobile devices.'
          },
          {
            question: 'Do you provide ongoing support?',
            answer: 'Yes, I offer 30 days of free support with the premium package. Extended support is available as an add-on.'
          }
        ],

        reviews: [
          {
            id: 1,
            user: {
              name: 'Sarah Chen',
              avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
            },
            rating: 5,
            date: '2024-01-15',
            comment: 'Excellent work! Alex delivered exactly what I needed and was very professional throughout the process.',
            helpful: 12
          },
          {
            id: 2,
            user: {
              name: 'Michael Rodriguez',
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
            },
            rating: 5,
            date: '2024-01-10',
            comment: 'Great communication and fast delivery. The website looks amazing and works perfectly on all devices.',
            helpful: 8
          },
          {
            id: 3,
            user: {
              name: 'Emily Watson',
              avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
            },
            rating: 4,
            date: '2024-01-05',
            comment: 'Very satisfied with the result. Minor revisions were needed but Alex was quick to implement them.',
            helpful: 5
          }
        ],

        stats: {
          totalOrders: 234,
          completionRate: 98,
          onTimeDelivery: 96,
          averageRating: 4.9
        }
      };

      setService(mockService);
      setLoading(false);
    };

    fetchService();
  }, [id]);

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
      window.location.href = '/signin';
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

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Service Not Found</h1>
          <p className="text-gray-600 mb-8">The service you're looking for doesn't exist.</p>
          <Link to="/services" className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
            Browse Services
          </Link>
        </div>
      </div>
    );
  }

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
              
              {/* Freelancer Info */}
              <div className="flex items-center mb-6">
                <img
                  src={service.freelancer.avatar}
                  alt={service.freelancer.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <div className="flex items-center">
                    <h3 className="font-semibold text-gray-800 mr-2">{service.freelancer.name}</h3>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium">
                      {service.freelancer.level}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="flex items-center mr-4">
                      <div className="flex text-yellow-400 mr-1">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-4 h-4 ${i < Math.floor(service.freelancer.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span>{service.freelancer.rating} ({service.freelancer.reviewCount})</span>
                    </div>
                    <span>{service.freelancer.completedOrders} orders completed</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {service.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Gallery */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {service.gallery.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Service preview ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', name: 'Overview' },
                    { id: 'faq', name: 'FAQ' },
                    { id: 'reviews', name: `Reviews (${service.reviews.length})` }
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

                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-4">What You Get</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Object.entries(service.packages).map(([key, pkg]) => (
                          <div key={key} className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-800 mb-2">{pkg.name}</h4>
                            <p className="text-gray-600 text-sm mb-3">{pkg.description}</p>
                            <ul className="space-y-1">
                              {pkg.features.slice(0, 3).map((feature, index) => (
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
                  </div>
                )}

                {/* FAQ Tab */}
                {activeTab === 'faq' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-800">Frequently Asked Questions</h3>
                    <div className="space-y-4">
                      {service.faq.map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-800 mb-2">{item.question}</h4>
                          <p className="text-gray-600">{item.answer}</p>
                        </div>
                      ))}
                    </div>
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
                              <svg key={i} className={`w-5 h-5 ${i < Math.floor(service.freelancer.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-lg font-bold text-gray-800">{service.freelancer.rating}</span>
                        </div>
                        <p className="text-sm text-gray-600">{service.freelancer.reviewCount} reviews</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {service.reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                          <div className="flex items-start space-x-4">
                            <img
                              src={review.user.avatar}
                              alt={review.user.name}
                              className="w-12 h-12 rounded-full"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-gray-800">{review.user.name}</h4>
                                <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
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
                              
                              <div className="flex items-center text-sm text-gray-500">
                                <button className="flex items-center hover:text-gray-700">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                  </svg>
                                  Helpful ({review.helpful})
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Package Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 sticky top-24">
              <div className="flex border-b border-gray-200 mb-6">
                {Object.entries(service.packages).map(([key, pkg]) => (
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
                    ${service.packages[selectedPackage].price}
                  </h3>
                  <span className="text-gray-600">
                    {service.packages[selectedPackage].deliveryTime} delivery
                  </span>
                </div>

                <p className="text-gray-600 mb-4">{service.packages[selectedPackage].description}</p>

                <ul className="space-y-2 mb-6">
                  {service.packages[selectedPackage].features.map((feature, index) => (
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
                    <span>{service.packages[selectedPackage].revisions}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleOrderNow}
                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-3 px-6 rounded-lg font-semibold transition-colors"
                  >
                    Order Now
                  </button>
                  
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-colors"
                  >
                    Contact Freelancer
                  </button>
                </div>
              </div>

              {/* Extras */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-semibold text-gray-800 mb-4">Add Extras</h4>
                <div className="space-y-3">
                  {service.extras.map((extra) => (
                    <label key={extra.id} className="flex items-start">
                      <input
                        type="checkbox"
                        className="mt-1 mr-3 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-800">{extra.name}</span>
                          <span className="text-sm font-semibold text-gray-800">+${extra.price}</span>
                        </div>
                        <p className="text-xs text-gray-600">{extra.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Freelancer Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center mb-6">
                <img
                  src={service.freelancer.avatar}
                  alt={service.freelancer.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-bold text-gray-800">{service.freelancer.name}</h3>
                <p className="text-gray-600">{service.freelancer.level}</p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Response time:</span>
                  <span className="font-medium">{service.freelancer.responseTime}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Last seen:</span>
                  <span className="font-medium">{service.freelancer.lastSeen}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Member since:</span>
                  <span className="font-medium">{service.freelancer.memberSince}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Languages:</span>
                  <span className="font-medium">{service.freelancer.languages.join(', ')}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  to={`/freelancer/${service.freelancer.id}`}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors text-center block"
                >
                  View Profile
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
              <h2 className="text-2xl font-bold text-gray-800">Contact {service.freelancer.name}</h2>
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

      {/* Order Confirmation Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Confirm Your Order</h2>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">{service.packages[selectedPackage].name} Package</h3>
              <p className="text-gray-600 text-sm mb-3">{service.packages[selectedPackage].description}</p>
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Price:</span>
                <span className="font-bold text-gray-800">${service.packages[selectedPackage].price}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Delivery:</span>
                <span className="font-medium text-gray-800">{service.packages[selectedPackage].deliveryTime}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={confirmOrder}
                className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                Confirm Order
              </button>
              <button
                onClick={() => setShowOrderModal(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default ServiceDetailsPage;
