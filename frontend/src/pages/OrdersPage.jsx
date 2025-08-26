import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated, getUserData } from '../utils/auth';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [deliveryData, setDeliveryData] = useState({
    message: '',
    files: []
  });
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: ''
  });
  
  const currentUser = getUserData();
  const isFreelancer = currentUser?.userType === 'freelancer';

  // Mock orders data
  const mockOrders = [
    {
      id: 'ORD-001',
      title: 'E-commerce Website Development',
      description: 'Modern responsive e-commerce website with payment integration',
      status: 'in_progress',
      price: 450,
      createdAt: '2024-01-15T10:00:00Z',
      dueDate: '2024-01-25T23:59:59Z',
      deliveredAt: null,
      completedAt: null,
      
      client: {
        id: 2,
        name: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
        rating: 4.9
      },
      
      freelancer: {
        id: 1,
        name: 'Alex Johnson',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
        rating: 4.8
      },
      
      package: {
        name: 'Standard',
        deliveryTime: '10 days',
        revisions: 3,
        features: [
          'Up to 5 Pages',
          'Responsive Design',
          'Payment Integration',
          'Admin Panel',
          '3 Revisions'
        ]
      },
      
      milestones: [
        {
          id: 1,
          title: 'Design Mockups',
          description: 'Create wireframes and design mockups',
          status: 'completed',
          dueDate: '2024-01-18T23:59:59Z',
          completedAt: '2024-01-17T14:30:00Z'
        },
        {
          id: 2,
          title: 'Frontend Development',
          description: 'Develop responsive frontend components',
          status: 'in_progress',
          dueDate: '2024-01-22T23:59:59Z',
          completedAt: null
        },
        {
          id: 3,
          title: 'Backend Integration',
          description: 'API development and database setup',
          status: 'pending',
          dueDate: '2024-01-24T23:59:59Z',
          completedAt: null
        },
        {
          id: 4,
          title: 'Testing & Deployment',
          description: 'Final testing and deployment',
          status: 'pending',
          dueDate: '2024-01-25T23:59:59Z',
          completedAt: null
        }
      ],
      
      activities: [
        {
          id: 1,
          type: 'order_created',
          message: 'Order has been created',
          timestamp: '2024-01-15T10:00:00Z',
          user: 'Sarah Chen'
        },
        {
          id: 2,
          type: 'milestone_completed',
          message: 'Design Mockups milestone completed',
          timestamp: '2024-01-17T14:30:00Z',
          user: 'Alex Johnson'
        },
        {
          id: 3,
          type: 'message',
          message: 'Client approved the design mockups',
          timestamp: '2024-01-18T09:15:00Z',
          user: 'Sarah Chen'
        }
      ],
      
      deliverables: [],
      review: null
    },
    
    {
      id: 'ORD-002',
      title: 'Brand Identity Design',
      description: 'Complete brand identity package including logo and guidelines',
      status: 'delivered',
      price: 250,
      createdAt: '2024-01-10T14:00:00Z',
      dueDate: '2024-01-17T23:59:59Z',
      deliveredAt: '2024-01-16T18:30:00Z',
      completedAt: null,
      
      client: {
        id: 3,
        name: 'Michael Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
        rating: 4.7
      },
      
      freelancer: {
        id: 1,
        name: 'Alex Johnson',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
        rating: 4.8
      },
      
      package: {
        name: 'Premium',
        deliveryTime: '7 days',
        revisions: 5,
        features: [
          'Logo Design',
          'Brand Guidelines',
          'Business Card Design',
          'Letterhead Design',
          '5 Revisions'
        ]
      },
      
      milestones: [
        {
          id: 1,
          title: 'Logo Concepts',
          description: 'Initial logo concepts and variations',
          status: 'completed',
          dueDate: '2024-01-12T23:59:59Z',
          completedAt: '2024-01-11T16:00:00Z'
        },
        {
          id: 2,
          title: 'Brand Guidelines',
          description: 'Complete brand identity guidelines',
          status: 'completed',
          dueDate: '2024-01-16T23:59:59Z',
          completedAt: '2024-01-15T12:30:00Z'
        }
      ],
      
      activities: [
        {
          id: 1,
          type: 'order_created',
          message: 'Order has been created',
          timestamp: '2024-01-10T14:00:00Z',
          user: 'Michael Rodriguez'
        },
        {
          id: 2,
          type: 'delivery',
          message: 'Order has been delivered',
          timestamp: '2024-01-16T18:30:00Z',
          user: 'Alex Johnson'
        }
      ],
      
      deliverables: [
        {
          id: 1,
          name: 'Brand_Identity_Package.zip',
          size: '15.2 MB',
          type: 'application/zip',
          url: '#'
        },
        {
          id: 2,
          name: 'Logo_Files.ai',
          size: '8.5 MB',
          type: 'application/illustrator',
          url: '#'
        }
      ],
      
      review: null
    },
    
    {
      id: 'ORD-003',
      title: 'Mobile App UI Design',
      description: 'Modern UI design for fitness tracking mobile app',
      status: 'completed',
      price: 350,
      createdAt: '2024-01-05T09:00:00Z',
      dueDate: '2024-01-12T23:59:59Z',
      deliveredAt: '2024-01-11T20:15:00Z',
      completedAt: '2024-01-13T10:30:00Z',
      
      client: {
        id: 4,
        name: 'Emily Watson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
        rating: 4.6
      },
      
      freelancer: {
        id: 1,
        name: 'Alex Johnson',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
        rating: 4.8
      },
      
      package: {
        name: 'Standard',
        deliveryTime: '7 days',
        revisions: 3,
        features: [
          'UI Design',
          'Prototyping',
          'Mobile Responsive',
          'Source Files',
          '3 Revisions'
        ]
      },
      
      milestones: [
        {
          id: 1,
          title: 'Wireframes',
          description: 'App wireframes and user flow',
          status: 'completed',
          dueDate: '2024-01-08T23:59:59Z',
          completedAt: '2024-01-07T11:00:00Z'
        },
        {
          id: 2,
          title: 'UI Design',
          description: 'High-fidelity UI designs',
          status: 'completed',
          dueDate: '2024-01-11T23:59:59Z',
          completedAt: '2024-01-10T15:45:00Z'
        }
      ],
      
      activities: [
        {
          id: 1,
          type: 'order_created',
          message: 'Order has been created',
          timestamp: '2024-01-05T09:00:00Z',
          user: 'Emily Watson'
        },
        {
          id: 2,
          type: 'delivery',
          message: 'Order has been delivered',
          timestamp: '2024-01-11T20:15:00Z',
          user: 'Alex Johnson'
        },
        {
          id: 3,
          type: 'completed',
          message: 'Order marked as completed',
          timestamp: '2024-01-13T10:30:00Z',
          user: 'Emily Watson'
        }
      ],
      
      deliverables: [
        {
          id: 1,
          name: 'App_UI_Design.fig',
          size: '12.8 MB',
          type: 'application/figma',
          url: '#'
        },
        {
          id: 2,
          name: 'Assets_Export.zip',
          size: '25.4 MB',
          type: 'application/zip',
          url: '#'
        }
      ],
      
      review: {
        rating: 5,
        comment: 'Excellent work! The design exceeded my expectations and was delivered on time.',
        createdAt: '2024-01-13T11:00:00Z'
      }
    }
  ];

  useEffect(() => {
    if (isAuthenticated()) {
      setOrders(mockOrders);
    }
  }, []);

  const getFilteredOrders = () => {
    switch (activeTab) {
      case 'active':
        return orders.filter(order => ['in_progress', 'delivered'].includes(order.status));
      case 'completed':
        return orders.filter(order => order.status === 'completed');
      case 'cancelled':
        return orders.filter(order => order.status === 'cancelled');
      default:
        return orders;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'delivered': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMilestoneStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'pending': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysLeft = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleDeliver = (order) => {
    setSelectedOrder(order);
    setShowDeliveryModal(true);
  };

  const handleSubmitDelivery = (e) => {
    e.preventDefault();
    // Handle delivery submission
    setOrders(prev => 
      prev.map(order => 
        order.id === selectedOrder.id 
          ? { ...order, status: 'delivered', deliveredAt: new Date().toISOString() }
          : order
      )
    );
    setShowDeliveryModal(false);
    setDeliveryData({ message: '', files: [] });
  };

  const handleReview = (order) => {
    setSelectedOrder(order);
    setShowReviewModal(true);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    // Handle review submission
    setOrders(prev => 
      prev.map(order => 
        order.id === selectedOrder.id 
          ? { 
              ...order, 
              status: 'completed', 
              completedAt: new Date().toISOString(),
              review: {
                rating: reviewData.rating,
                comment: reviewData.comment,
                createdAt: new Date().toISOString()
              }
            }
          : order
      )
    );
    setShowReviewModal(false);
    setReviewData({ rating: 5, comment: '' });
  };

  const tabs = [
    { id: 'active', name: 'Active Orders', count: orders.filter(o => ['in_progress', 'delivered'].includes(o.status)).length },
    { id: 'completed', name: 'Completed', count: orders.filter(o => o.status === 'completed').length },
    { id: 'cancelled', name: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length }
  ];

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">Please log in to view your orders.</p>
          <Link to="/signin" className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {isFreelancer ? 'My Orders' : 'Manage Orders'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isFreelancer ? 'Track your ongoing projects and deliveries' : 'Monitor your project orders and milestones'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-yellow-500 text-yellow-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {getFilteredOrders().length > 0 ? (
            getFilteredOrders().map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h2 className="text-xl font-bold text-gray-800">{order.title}</h2>
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{order.description}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          Order #{order.id}
                        </div>
                        
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 12v-2m-6 2h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                          </svg>
                          Created {formatDate(order.createdAt)}
                        </div>
                        
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Due {formatDate(order.dueDate)}
                          {order.status === 'in_progress' && (
                            <span className={`ml-2 px-2 py-1 rounded text-xs ${
                              getDaysLeft(order.dueDate) <= 1 ? 'bg-red-100 text-red-800' :
                              getDaysLeft(order.dueDate) <= 3 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {getDaysLeft(order.dueDate)} days left
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800 mb-2">${order.price}</div>
                      <div className="flex items-center space-x-3">
                        {isFreelancer && order.status === 'in_progress' && (
                          <button
                            onClick={() => handleDeliver(order)}
                            className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium transition-colors"
                          >
                            Deliver Order
                          </button>
                        )}
                        
                        {!isFreelancer && order.status === 'delivered' && (
                          <button
                            onClick={() => handleReview(order)}
                            className="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                          >
                            Accept & Review
                          </button>
                        )}
                        
                        <Link
                          to={`/messages?order=${order.id}`}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Message
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Participants */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Team</h3>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={order.client.avatar}
                            alt={order.client.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-gray-800">{order.client.name}</p>
                            <p className="text-sm text-gray-500">Client</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <img
                            src={order.freelancer.avatar}
                            alt={order.freelancer.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-gray-800">{order.freelancer.name}</p>
                            <p className="text-sm text-gray-500">Freelancer</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Package Details */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Package: {order.package.name}</h3>
                      <ul className="space-y-2">
                        {order.package.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Milestones */}
                  {order.milestones && order.milestones.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Milestones</h3>
                      <div className="space-y-4">
                        {order.milestones.map((milestone, index) => (
                          <div key={milestone.id} className="flex items-start space-x-4">
                            <div className={`w-4 h-4 rounded-full mt-1 flex-shrink-0 ${getMilestoneStatusColor(milestone.status)}`}></div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-800">{milestone.title}</h4>
                                <span className="text-sm text-gray-500">
                                  Due {formatDate(milestone.dueDate)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                              {milestone.completedAt && (
                                <p className="text-xs text-green-600 mt-1">
                                  Completed on {formatDateTime(milestone.completedAt)}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Deliverables */}
                  {order.deliverables && order.deliverables.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Deliverables</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {order.deliverables.map((file) => (
                          <div key={file.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                            <div className="bg-blue-100 p-2 rounded-lg mr-3">
                              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">{file.name}</p>
                              <p className="text-sm text-gray-500">{file.size}</p>
                            </div>
                            <a
                              href={file.url}
                              className="bg-blue-500 hover:bg-blue-400 text-white px-3 py-1 rounded text-sm transition-colors"
                            >
                              Download
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Review */}
                  {order.review && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Client Review</h3>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <div className="flex text-yellow-400 mr-2">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`w-5 h-5 ${i < order.review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="font-semibold text-gray-800">{order.review.rating} stars</span>
                        </div>
                        <p className="text-gray-700">{order.review.comment}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          Reviewed on {formatDateTime(order.review.createdAt)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-500 mb-2">No orders found</h3>
              <p className="text-gray-400 mb-8">
                {activeTab === 'active' ? 'You don\'t have any active orders.' : 
                 activeTab === 'completed' ? 'No completed orders yet.' : 
                 'No cancelled orders.'}
              </p>
              <Link
                to="/services"
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {isFreelancer ? 'Find New Projects' : 'Browse Services'}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Delivery Modal */}
      {showDeliveryModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Deliver Order</h2>
              <button
                onClick={() => setShowDeliveryModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitDelivery} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={deliveryData.message}
                  onChange={(e) => setDeliveryData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Describe what you've delivered and any important notes..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Files
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-600">Click to upload files or drag and drop</p>
                  <p className="text-sm text-gray-500">PNG, JPG, PDF, ZIP up to 100MB</p>
                  <input type="file" multiple className="hidden" />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  Deliver Order
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeliveryModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Review Order</h2>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setReviewData(prev => ({ ...prev, rating }))}
                      className={`text-2xl ${
                        rating <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'
                      } hover:text-yellow-400 transition-colors`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Comment
                </label>
                <textarea
                  required
                  rows={4}
                  value={reviewData.comment}
                  onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Share your experience working with this freelancer..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-500 hover:bg-green-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default OrdersPage;
