import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { isAuthenticated, getUserData } from '../utils/auth';

function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const currentUser = getUserData();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const token = typeof window !== 'undefined'
    ? (localStorage.getItem('userToken') || (localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).token : null))
    : null;

  // Mock conversations data
  const mockConversations = [
    {
      id: 1,
      participant: {
        id: 2,
        name: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
        isOnline: true,
        lastSeen: 'Online'
      },
      lastMessage: {
        text: 'Thanks for the quick response! I\'ll review the proposal and get back to you.',
        timestamp: '2024-01-20T14:30:00Z',
        senderId: 2
      },
      unreadCount: 2,
      projectTitle: 'E-commerce Website Development',
      status: 'active'
    },
    {
      id: 2,
      participant: {
        id: 3,
        name: 'Michael Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
        isOnline: false,
        lastSeen: '2 hours ago'
      },
      lastMessage: {
        text: 'Perfect! The logo design looks exactly what I was looking for.',
        timestamp: '2024-01-20T12:15:00Z',
        senderId: 3
      },
      unreadCount: 0,
      projectTitle: 'Brand Identity Package',
      status: 'completed'
    },
    {
      id: 3,
      participant: {
        id: 4,
        name: 'Emily Watson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
        isOnline: true,
        lastSeen: 'Online'
      },
      lastMessage: {
        text: 'Could you please send me the final files in PSD format as well?',
        timestamp: '2024-01-20T10:45:00Z',
        senderId: 4
      },
      unreadCount: 1,
      projectTitle: 'Mobile App UI Design',
      status: 'in_progress'
    },
    {
      id: 4,
      participant: {
        id: 5,
        name: 'David Kim',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
        isOnline: false,
        lastSeen: '1 day ago'
      },
      lastMessage: {
        text: 'When can we schedule a call to discuss the project requirements?',
        timestamp: '2024-01-19T16:20:00Z',
        senderId: 5
      },
      unreadCount: 0,
      projectTitle: 'Content Writing Project',
      status: 'pending'
    }
  ];

  // Mock messages for selected conversation
  const mockMessages = {
    1: [
      {
        id: 1,
        text: 'Hi! I\'m interested in your web development service. Could you tell me more about what\'s included?',
        senderId: 2,
        timestamp: '2024-01-20T09:00:00Z',
        type: 'text'
      },
      {
        id: 2,
        text: 'Hello Sarah! Thanks for your interest. I\'d be happy to help with your project. The service includes responsive design, SEO optimization, and source code delivery.',
        senderId: currentUser?.id || 1,
        timestamp: '2024-01-20T09:15:00Z',
        type: 'text'
      },
      {
        id: 3,
        text: 'That sounds great! What\'s your timeline for a 5-page business website?',
        senderId: 2,
        timestamp: '2024-01-20T09:30:00Z',
        type: 'text'
      },
      {
        id: 4,
        text: 'For a 5-page business website, I can deliver it within 7-10 days. Here\'s a custom offer for your project:',
        senderId: currentUser?.id || 1,
        timestamp: '2024-01-20T10:00:00Z',
        type: 'text'
      },
      {
        id: 5,
        text: '',
        senderId: currentUser?.id || 1,
        timestamp: '2024-01-20T10:01:00Z',
        type: 'offer',
        offer: {
          title: 'Custom Business Website',
          description: '5-page responsive website with modern design',
          price: 450,
          deliveryTime: '10 days',
          revisions: 3
        }
      },
      {
        id: 6,
        text: 'Thanks for the quick response! I\'ll review the proposal and get back to you.',
        senderId: 2,
        timestamp: '2024-01-20T14:30:00Z',
        type: 'text'
      }
    ]
  };

  useEffect(() => {
    const fetchConversations = async () => {
      if (!isAuthenticated() || !token) return;
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/messages/conversations', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data?.success) {
          const formatted = (data.conversations || []).map((conv) => {
            const other = (conv.participants || []).find(p => (p?._id || p) !== (currentUser?._id || currentUser?.id));
            return {
              id: conv._id,
              participant: {
                id: other?._id || other,
                name: other ? `${other.firstName || ''} ${other.lastName || ''}`.trim() || 'User' : 'User',
                avatar: other?.profileImage?.url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
                isOnline: false,
                lastSeen: ''
              },
              lastMessage: { text: '', timestamp: conv.lastMessageAt || conv.updatedAt || conv.createdAt, senderId: '' },
              unreadCount: 0,
              projectTitle: conv.orderId ? 'Order Conversation' : 'Conversation',
              status: 'active'
            };
          });
          setConversations(formatted);
        }
      } catch (e) {
        console.error('Fetch conversations failed', e);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [currentUser?._id]);

  useEffect(() => {
    if (!isAuthenticated()) return;
    const searchParams = new URLSearchParams(location.search);
    const conversationId = searchParams.get('conversation');
    if (conversationId && conversations.length > 0) {
      const found = conversations.find(c => c.id === conversationId);
      if (found) {
        setSelectedConversation(found);
        // fetch messages
        (async () => {
          try {
            const res = await fetch(`http://localhost:5000/api/messages/conversations/${conversationId}/messages`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data?.success) {
              const mapped = (data.messages || []).map((m) => ({
                id: m._id,
                text: m.text,
                senderId: m.senderId,
                timestamp: m.createdAt,
                type: m.type
              }));
              setMessages(mapped);
            }
          } catch (e) {
            console.error('Fetch messages failed', e);
          }
        })();
      }
    }
  }, [location.search, conversations]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    (async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/messages/conversations/${conversation.id}/messages`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data?.success) {
          const mapped = (data.messages || []).map((m) => ({
            id: m._id,
            text: m.text,
            senderId: m.senderId,
            timestamp: m.createdAt,
            type: m.type
          }));
          setMessages(mapped);
        }
      } catch (e) {
        console.error('Fetch messages failed', e);
      }
    })();
    
    // Mark as read
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversation.id 
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;
    try {
      const res = await fetch(`http://localhost:5000/api/messages/conversations/${selectedConversation.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: newMessage })
      });
      const data = await res.json();
      if (data?.success && data.message) {
        setMessages(prev => [...prev, {
          id: data.message._id,
          text: data.message.text,
          senderId: data.message.senderId,
          timestamp: data.message.createdAt,
          type: data.message.type
        }]);
        setNewMessage('');
      }
    } catch (err) {
      console.error('Send message failed', err);
    }
  };

  const handleSendOffer = () => {
    if (!selectedConversation) return;

    const offerMessage = {
      id: messages.length + 1,
      text: '',
      senderId: currentUser?.id || 1,
      timestamp: new Date().toISOString(),
      type: 'offer',
      offer: {
        title: 'Custom Project Offer',
        description: 'Tailored solution for your specific needs',
        price: 300,
        deliveryTime: '7 days',
        revisions: 2
      }
    };

    setMessages(prev => [...prev, offerMessage]);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.projectTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">Please log in to view your messages.</p>
          <Link to="/signin" className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
          <div className="flex h-full">
            {/* Conversations Sidebar */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Messages</h1>
                
                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length > 0 ? (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => handleConversationSelect(conversation)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedConversation?.id === conversation.id ? 'bg-yellow-50 border-l-4 border-l-yellow-500' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="relative">
                          <img
                            src={conversation.participant.avatar}
                            alt={conversation.participant.name}
                            className="w-12 h-12 rounded-full"
                          />
                          {conversation.participant.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-sm font-semibold text-gray-800 truncate">
                              {conversation.participant.name}
                            </h3>
                            <div className="flex items-center space-x-2">
                              {conversation.unreadCount > 0 && (
                                <span className="bg-yellow-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                  {conversation.unreadCount}
                                </span>
                              )}
                              <span className="text-xs text-gray-500">
                                {formatTime(conversation.lastMessage.timestamp)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mb-2">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(conversation.status)}`}>
                              {conversation.status.replace('_', ' ')}
                            </span>
                          </div>
                          
                          <p className="text-xs text-gray-600 mb-1 truncate">
                            {conversation.projectTitle}
                          </p>
                          
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.lastMessage.senderId === (currentUser?._id || currentUser?.id) ? 'You: ' : ''}
                            {conversation.lastMessage.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p>No conversations found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-6 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <img
                            src={selectedConversation.participant.avatar}
                            alt={selectedConversation.participant.name}
                            className="w-12 h-12 rounded-full"
                          />
                          {selectedConversation.participant.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        
                        <div>
                          <h2 className="text-xl font-bold text-gray-800">
                            {selectedConversation.participant.name}
                          </h2>
                          <p className="text-sm text-gray-600">
                            {selectedConversation.participant.isOnline ? 'Online' : selectedConversation.participant.lastSeen}
                          </p>
                          <p className="text-sm text-gray-500">
                            {selectedConversation.projectTitle}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleSendOffer}
                          className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Send Offer
                        </button>
                        
                        <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((message) => (
                      <div key={message.id}>
                        {message.type === 'text' ? (
                          <div className={`flex ${message.senderId === (currentUser?._id || currentUser?.id) ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.senderId === (currentUser?._id || currentUser?.id)
                                ? 'bg-yellow-500 text-black'
                                : 'bg-gray-200 text-gray-800'
                            }`}>
                              <p className="text-sm">{message.text}</p>
                              <p className={`text-xs mt-1 ${
                                message.senderId === (currentUser?._id || currentUser?.id) ? 'text-black/70' : 'text-gray-500'
                              }`}>
                                {formatTime(message.timestamp)}
                              </p>
                            </div>
                          </div>
                        ) : message.type === 'offer' ? (
                          <div className={`flex ${message.senderId === (currentUser?._id || currentUser?.id) ? 'justify-end' : 'justify-start'}`}>
                            <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                              <div className="flex items-center mb-3">
                                <div className="bg-yellow-100 p-2 rounded-full mr-3">
                                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                  </svg>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-800">Custom Offer</h4>
                                  <p className="text-xs text-gray-500">{formatTime(message.timestamp)}</p>
                                </div>
                              </div>
                              
                              <h3 className="font-bold text-gray-800 mb-2">{message.offer.title}</h3>
                              <p className="text-gray-600 text-sm mb-3">{message.offer.description}</p>
                              
                              <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Price:</span>
                                  <span className="font-bold text-gray-800">${message.offer.price}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Delivery:</span>
                                  <span className="text-gray-800">{message.offer.deliveryTime}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Revisions:</span>
                                  <span className="text-gray-800">{message.offer.revisions}</span>
                                </div>
                              </div>
                              
                              {message.senderId !== (currentUser?._id || currentUser?.id) && (
                                <div className="flex space-x-2">
                                  <button className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black py-2 px-4 rounded-lg font-medium text-sm transition-colors">
                                    Accept
                                  </button>
                                  <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium text-sm transition-colors">
                                    Decline
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ))}
                    
                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <form onSubmit={handleSendMessage} className="flex items-end space-x-4">
                      <div className="flex-1">
                        <textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          rows={1}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage(e);
                            }
                          }}
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          className="p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                        </button>
                        
                        <button
                          type="submit"
                          disabled={!newMessage.trim()}
                          className="bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-300 disabled:cursor-not-allowed text-black p-3 rounded-lg transition-colors"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </button>
                      </div>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-lg font-medium">Select a conversation</p>
                    <p className="text-sm">Choose a conversation from the sidebar to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessagesPage;
