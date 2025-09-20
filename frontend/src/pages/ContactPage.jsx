import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { isAuthenticated, getUserData } from '../utils/auth';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
    priority: 'normal'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [userMessages, setUserMessages] = useState([]);
  const [userMessagesLoading, setUserMessagesLoading] = useState(false);
  const [userMessagesError, setUserMessagesError] = useState(null);
  const [showUserMessages, setShowUserMessages] = useState(false);
  const [replyingToMessage, setReplyingToMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [searchParams] = useSearchParams();

  // Check if user is authenticated
  const isUserAuthenticated = isAuthenticated();

  // Pre-fill form with user data if authenticated
  useEffect(() => {
    if (isUserAuthenticated) {
      const userData = getUserData();
      if (userData) {
        // Combine firstName and lastName for full name
        const fullName = userData.firstName && userData.lastName 
          ? `${userData.firstName} ${userData.lastName}`
          : userData.name || userData.fullName || '';
        
        setFormData(prev => ({
          ...prev,
          name: fullName,
          email: userData.email || ''
        }));
      }
    }
  }, [isUserAuthenticated]);

  // Listen for authentication state changes
  useEffect(() => {
    const handleAuthChange = () => {
      const userData = getUserData();
      if (userData && isAuthenticated()) {
        // Combine firstName and lastName for full name
        const fullName = userData.firstName && userData.lastName 
          ? `${userData.firstName} ${userData.lastName}`
          : userData.name || userData.fullName || '';
        
        setFormData(prev => ({
          ...prev,
          name: fullName,
          email: userData.email || ''
        }));
        
        // Scroll to contact form if user just signed in
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
          setTimeout(() => {
            contactForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 500);
        }
      }
    };

    window.addEventListener('authStateChanged', handleAuthChange);
    return () => window.removeEventListener('authStateChanged', handleAuthChange);
  }, []);

  // Fetch user messages
  const fetchUserMessages = async () => {
    if (!isUserAuthenticated) return;
    
    try {
      setUserMessagesLoading(true);
      setUserMessagesError(null);
      
      const token = localStorage.getItem('userToken');
      const response = await fetch('http://localhost:5000/api/contact/user/messages', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (result.success) {
        setUserMessages(result.data);
      } else {
        setUserMessagesError(result.message || 'Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching user messages:', error);
      setUserMessagesError('Failed to fetch your messages');
    } finally {
      setUserMessagesLoading(false);
    }
  };

  // Handle user reply to message
  const handleUserReply = async (messageId) => {
    if (!replyText.trim()) {
      alert('Please enter a reply message');
      return;
    }
    
    try {
      setReplyLoading(true);
      
      const token = localStorage.getItem('userToken');
      const response = await fetch(`http://localhost:5000/api/contact/user/messages/${messageId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: replyText
        })
      });

      const result = await response.json();

      if (result.success) {
        setReplyText('');
        setReplyingToMessage(null);
        fetchUserMessages(); // Refresh messages to show the new reply
        alert('Reply sent successfully!');
      } else {
        alert(result.message || 'Failed to send reply');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply');
    } finally {
      setReplyLoading(false);
    }
  };

  const categories = [
    'General Inquiry',
    'Technical Support',
    'Account Issues',
    'Payment Problems',
    'Report a Bug',
    'Feature Request',
    'Partnership',
    'Media Inquiry',
    'Legal Issues',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent submission if user is not authenticated
    if (!isUserAuthenticated) {
      alert('Please sign in to send a message');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('userToken');
      
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // Add authorization header only if user is authenticated
      if (isUserAuthenticated && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('http://localhost:5000/api/contact/submit', {
        method: 'POST',
        headers,
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          category: '',
          message: '',
          priority: 'normal'
        });
        // Refresh user messages after successful submission
        if (isUserAuthenticated) {
          fetchUserMessages();
        }
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: '📧',
      title: 'Email Support',
      description: 'Get help from our support team',
      contact: 'support@flexihire.com',
      responseTime: 'Usually responds within 24 hours'
    },
    {
      icon: '💬',
      title: 'Live Chat',
      description: 'Chat with us in real-time',
      contact: 'Available 24/7',
      responseTime: 'Average response time: 5 minutes'
    },
    {
      icon: '📞',
      title: 'Phone Support',
      description: 'Speak directly with our team',
      contact: '+94 (11) 123-4567',
      responseTime: 'Mon-Fri, 9AM-6PM'
    },
    {
      icon: '📍',
      title: 'Office Address',
      description: 'Visit us in person',
      contact: '123 Business Street, Kandy',
      responseTime: 'Kandy, Sri Lanka'
    }
  ];

  const faqItems = [
    {
      question: 'How do I get started as a freelancer?',
      answer: 'Simply sign up for a freelancer account, complete your profile, and start posting your services. Our getting started guide will walk you through the process.'
    },
    {
      question: 'How does the payment system work?',
      answer: 'We use a secure escrow system. Clients deposit funds when hiring, and payments are released to freelancers upon project completion and client approval.'
    },
    {
      question: 'What fees does FlexiHire charge?',
      answer: 'We charge a small service fee on completed transactions. Freelancers pay 10% on their first $500 with a client, then 5% thereafter.'
    },
    {
      question: 'How can I improve my profile visibility?',
      answer: 'Complete your profile 100%, add portfolio samples, get positive reviews, and stay active on the platform. Our algorithm favors complete and active profiles.'
    },
    {
      question: 'What if I have a dispute with a client/freelancer?',
      answer: 'We have a resolution center where you can file disputes. Our team mediates to find fair solutions for both parties.'
    },
    {
      question: 'Can I work with international clients?',
      answer: 'Yes! FlexiHire connects freelancers and clients globally. We support multiple currencies and payment methods for international transactions.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-900 via-green-700 to-green-500 text-white py-12 relative">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-6 max-w-4xl mx-auto">
              Have questions? We're here to help. Reach out to our support team anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg shadow-green-500/20 p-10 text-center hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-4xl mb-4">{info.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{info.title}</h3>
                <p className="text-gray-600 mb-3">{info.description}</p>
                <p className="text-yellow-600 font-semibold mb-2">{info.contact}</p>
                <p className="text-sm text-gray-500">{info.responseTime}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div id="contact-form">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Send us a Message</h2>
              
              {!isUserAuthenticated && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-red-800 mb-2">
                        Sign In Required
                      </h3>
                      <p className="text-red-700 mb-4">
                        You must be signed in to send us a message. Please sign in or create an account to continue.
                      </p>
                      <div className="flex space-x-3">
                        <Link
                          to="/signin?redirect=/contact"
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                        >
                          Sign In
                        </Link>
                        <Link
                          to="/join"
                          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                        >
                          Create Account
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {submitStatus === 'success' && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Thank you! Your message has been sent successfully.
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Sorry, there was an error sending your message. Please try again.
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isUserAuthenticated}
                      readOnly={isUserAuthenticated}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                        !isUserAuthenticated ? 'bg-gray-100 cursor-not-allowed opacity-50' : 
                        isUserAuthenticated ? 'bg-gray-50 cursor-not-allowed' : ''
                      }`}
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isUserAuthenticated}
                      readOnly={isUserAuthenticated}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                        !isUserAuthenticated ? 'bg-gray-100 cursor-not-allowed opacity-50' : 
                        isUserAuthenticated ? 'bg-gray-50 cursor-not-allowed' : ''
                      }`}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleInputChange}
                      disabled={!isUserAuthenticated}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                        !isUserAuthenticated ? 'bg-gray-100 cursor-not-allowed opacity-50' : ''
                      }`}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      disabled={!isUserAuthenticated}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                        !isUserAuthenticated ? 'bg-gray-100 cursor-not-allowed opacity-50' : ''
                      }`}
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    disabled={!isUserAuthenticated}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                      !isUserAuthenticated ? 'bg-gray-100 cursor-not-allowed opacity-50' : ''
                    }`}
                    placeholder="Brief description of your inquiry"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    disabled={!isUserAuthenticated}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none ${
                      !isUserAuthenticated ? 'bg-gray-100 cursor-not-allowed opacity-50' : ''
                    }`}
                    placeholder="Please provide detailed information about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !isUserAuthenticated}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                    isSubmitting || !isUserAuthenticated
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-yellow-500 hover:bg-yellow-400 text-black hover:shadow-lg transform hover:-translate-y-0.5'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending Message...
                    </div>
                  ) : !isUserAuthenticated ? (
                    'Sign In to Send Message'
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>

              {/* User Messages Section */}
              {isUserAuthenticated && (
                <div className="mt-12">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">Your Messages</h3>
                    <button
                      onClick={() => {
                        setShowUserMessages(!showUserMessages);
                        if (!showUserMessages && userMessages.length === 0) {
                          fetchUserMessages();
                        }
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>{showUserMessages ? 'Hide Messages' : 'View Messages'}</span>
                    </button>
                  </div>

                  {showUserMessages && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      {userMessagesLoading ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                          <p className="text-gray-600">Loading your messages...</p>
                        </div>
                      ) : userMessagesError ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <div className="flex">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <div className="ml-3">
                              <p className="text-sm text-red-800">{userMessagesError}</p>
                            </div>
                          </div>
                        </div>
                      ) : userMessages.length === 0 ? (
                        <div className="text-center py-8">
                          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <h4 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h4>
                          <p className="text-gray-600">You haven't sent any messages yet. Send your first message above!</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {userMessages.map((message) => (
                            <div key={message._id} className="bg-white rounded-lg p-6 border border-gray-200 hover:border-yellow-400 transition-colors duration-200">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-2">
                                    <h4 className="text-lg font-semibold text-gray-900">{message.subject}</h4>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      message.status === 'new' ? 'bg-yellow-100 text-yellow-800' :
                                      message.status === 'replied' ? 'bg-blue-100 text-blue-800' :
                                      message.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                      message.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                                      'bg-purple-100 text-purple-800'
                                    }`}>
                                      {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      message.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                                      message.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                      message.priority === 'normal' ? 'bg-blue-100 text-blue-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {message.priority.charAt(0).toUpperCase() + message.priority.slice(1)}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                    <span><strong>Category:</strong> {message.category}</span>
                                    <span><strong>Sent:</strong> {new Date(message.createdAt).toLocaleDateString()}</span>
                                  </div>
                                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                    <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
                                  </div>
                                  
                                  {/* Conversation Thread */}
                                  {message.replies && message.replies.length > 0 && (
                                    <div className="space-y-3 mb-4">
                                      {message.replies.map((reply, replyIndex) => (
                                        <div key={replyIndex} className={`rounded-lg p-4 ${
                                          reply.senderType === 'admin' 
                                            ? 'bg-yellow-50 border border-yellow-200' 
                                            : 'bg-blue-50 border border-blue-200'
                                        }`}>
                                          <div className="flex items-center space-x-2 mb-2">
                                            <svg className={`w-4 h-4 ${
                                              reply.senderType === 'admin' ? 'text-yellow-600' : 'text-blue-600'
                                            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                            </svg>
                                            <span className={`text-sm font-medium ${
                                              reply.senderType === 'admin' ? 'text-yellow-800' : 'text-blue-800'
                                            }`}>
                                              {reply.senderType === 'admin' ? 'Admin' : 'You'}
                                            </span>
                                            <span className={`text-xs ${
                                              reply.senderType === 'admin' ? 'text-yellow-600' : 'text-blue-600'
                                            }`}>
                                              {new Date(reply.repliedAt).toLocaleDateString()}
                                            </span>
                                          </div>
                                          <p className={`whitespace-pre-wrap ${
                                            reply.senderType === 'admin' ? 'text-yellow-900' : 'text-blue-900'
                                          }`}>
                                            {reply.message}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  
                                  {/* Legacy admin reply display for backward compatibility */}
                                  {message.adminReply && (!message.replies || message.replies.length === 0) && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                      <div className="flex items-center space-x-2 mb-2">
                                        <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                        </svg>
                                        <span className="text-sm font-medium text-yellow-800">Admin Reply</span>
                                        <span className="text-xs text-yellow-600">
                                          {new Date(message.adminReply.repliedAt).toLocaleDateString()}
                                        </span>
                                      </div>
                                      <p className="text-yellow-900 whitespace-pre-wrap">{message.adminReply.message}</p>
                                    </div>
                                  )}
                                  
                                  {/* Reply Button and Form */}
                                  {(message.adminReply || (message.replies && message.replies.length > 0)) && (
                                    <div className="mt-4">
                                      {replyingToMessage === message._id ? (
                                        <div className="space-y-3">
                                          <textarea
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                                            placeholder="Type your reply..."
                                          />
                                          <div className="flex space-x-2">
                                            <button
                                              onClick={() => handleUserReply(message._id)}
                                              disabled={replyLoading}
                                              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                                                replyLoading
                                                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                                  : 'bg-yellow-500 hover:bg-yellow-600 text-black'
                                              }`}
                                            >
                                              {replyLoading ? 'Sending...' : 'Send Reply'}
                                            </button>
                                            <button
                                              onClick={() => {
                                                setReplyingToMessage(null);
                                                setReplyText('');
                                              }}
                                              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-medium transition-colors duration-200"
                                            >
                                              Cancel
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <button
                                          onClick={() => setReplyingToMessage(message._id)}
                                          className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                                        >
                                          Reply to Admin
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Other Ways to Reach Us</h2>
              
              <div className="space-y-6 mb-12">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">🚀 For Business Partnerships</h3>
                  <p className="text-gray-600 mb-2">
                    Interested in partnering with FlexiHire? We'd love to hear from you.
                  </p>
                  <p className="text-yellow-600 font-medium">partnerships@flexihire.com</p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">📰 Media & Press</h3>
                  <p className="text-gray-600 mb-2">
                    Press inquiries and media requests welcome.
                  </p>
                  <p className="text-yellow-600 font-medium">press@flexihire.com</p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">⚖️ Legal & Compliance</h3>
                  <p className="text-gray-600 mb-2">
                    For legal matters, compliance issues, or DMCA requests.
                  </p>
                  <p className="text-yellow-600 font-medium">legal@flexihire.com</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">💡 Quick Tip</h3>
                <p className="text-gray-700">
                  Before contacting support, check out our comprehensive FAQ section below. 
                  Many common questions are answered there, and you might find the solution faster!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-start">
                  <span className="bg-yellow-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                  {item.question}
                </h3>
                <p className="text-gray-600 leading-relaxed ml-9">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Can't find what you're looking for?</p>
            <a
              href="#contact-form"
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('form').scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>

      {/* Social Media & Community */}
      <section className="py-16 bg-gradient-to-r from-black via-gray-900 to-black text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
          <p className="text-xl text-gray-300 mb-8">
            Follow us on social media for updates, tips, and community discussions
          </p>
          
          <div className="flex justify-center space-x-6">
            {/* Instagram */}
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="bg-white/10 hover:bg-white/20 p-4 rounded-full transition-all duration-300 transform hover:scale-110">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm5 3a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6zm5-1.75a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5z"/>
              </svg>
            </a>
            {/* X (Twitter) */}
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X" className="bg-white/10 hover:bg-white/20 p-4 rounded-full transition-all duration-300 transform hover:scale-110">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2H21l-7.5 8.6L22 22h-6.5l-4.8-6.6L4.756 22H2l7.8-9L2 2h6.5l4.5 6.2L18.244 2z"/>
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="bg-white/10 hover:bg-white/20 p-4 rounded-full transition-all duration-300 transform hover:scale-110">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            {/* Pinterest */}
            <a href="https://www.pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest" className="bg-white/10 hover:bg-white/20 p-4 rounded-full transition-all duration-300 transform hover:scale-110">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}

export default ContactPage;
