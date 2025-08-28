import Contact from '../models/Contact.js';
import User from '../models/User.js';
import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';

// Submit contact form message
export const submitContactMessage = async (req, res) => {
  try {
    const { name, email, subject, category, priority, message } = req.body;
    
    // Check if user is authenticated by looking for token
    let userId = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User.findById(decoded.id).select('-password');
        if (user) {
          userId = user._id;
        }
      } catch (error) {
        console.log('Token verification failed, proceeding without user ID');
      }
    }
    
    // Create new contact message
    const contactMessage = new Contact({
      name,
      email,
      userId,
      subject,
      category,
      priority,
      message
    });
    
    await contactMessage.save();
    
    res.status(201).json({
      success: true,
      message: 'Message sent successfully! We will get back to you soon.',
      data: contactMessage
    });
    
  } catch (error) {
    console.error('Error submitting contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again.',
      error: error.message
    });
  }
};

// Get all contact messages (admin only)
export const getAllContactMessages = async (req, res) => {
  try {
    const { status, priority, category, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get messages with pagination
    const messages = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'firstName lastName email userType')
      .populate('adminReply.adminId', 'name email')
      .populate('replies.senderId', 'firstName lastName email name');
    
    // Get total count for pagination
    const total = await Contact.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      data: {
        messages,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalMessages: total,
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1
        }
      }
    });
    
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact messages.',
      error: error.message
    });
  }
};

// Get single contact message (admin only)
export const getContactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    
    const message = await Contact.findById(id)
      .populate('userId', 'firstName lastName email userType')
      .populate('adminReply.adminId', 'name email')
      .populate('replies.senderId', 'firstName lastName email name');
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found.'
      });
    }
    
    res.status(200).json({
      success: true,
      data: message
    });
    
  } catch (error) {
    console.error('Error fetching contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact message.',
      error: error.message
    });
  }
};

// Reply to contact message (admin only)
export const replyToMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { message: replyMessage, status } = req.body;
    
    if (!replyMessage || replyMessage.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Reply message is required.'
      });
    }
    
    const contactMessage = await Contact.findById(id);
    
    if (!contactMessage) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found.'
      });
    }
    
    // Add admin reply to the conversation
    contactMessage.replies.push({
      message: replyMessage.trim(),
      senderType: 'admin',
      senderId: req.admin._id,
      senderModel: 'Admin',
      repliedAt: new Date()
    });
    
    // Update legacy adminReply field for backward compatibility
    contactMessage.adminReply = {
      message: replyMessage.trim(),
      adminId: req.admin._id,
      repliedAt: new Date()
    };
    
    // Update status if provided
    if (status) {
      contactMessage.status = status;
    } else if (contactMessage.status === 'new') {
      contactMessage.status = 'replied';
    }
    
    await contactMessage.save();
    
    // Populate the updated message
    const updatedMessage = await Contact.findById(id)
      .populate('userId', 'firstName lastName email userType')
      .populate('adminReply.adminId', 'name email')
      .populate('replies.senderId', 'firstName lastName email name');
    
    res.status(200).json({
      success: true,
      message: 'Reply sent successfully!',
      data: updatedMessage
    });
    
  } catch (error) {
    console.error('Error replying to contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send reply.',
      error: error.message
    });
  }
};

// Update message status (admin only)
export const updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required.'
      });
    }
    
    const contactMessage = await Contact.findById(id);
    
    if (!contactMessage) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found.'
      });
    }
    
    contactMessage.status = status;
    await contactMessage.save();
    
    res.status(200).json({
      success: true,
      message: 'Message status updated successfully!',
      data: contactMessage
    });
    
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update message status.',
      error: error.message
    });
  }
};

// User reply to contact message
export const userReplyToMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { message: replyMessage } = req.body;
    const userId = req.user._id;
    
    if (!replyMessage || replyMessage.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Reply message is required.'
      });
    }
    
    const contactMessage = await Contact.findById(id);
    
    if (!contactMessage) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found.'
      });
    }
    
    // Check if user owns this message
    if (contactMessage.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only reply to your own messages.'
      });
    }
    
    // Add user reply to the conversation
    contactMessage.replies.push({
      message: replyMessage.trim(),
      senderType: 'user',
      senderId: userId,
      senderModel: 'User',
      repliedAt: new Date()
    });
    
    // Update status to indicate ongoing conversation
    if (contactMessage.status === 'replied' || contactMessage.status === 'resolved') {
      contactMessage.status = 'in-progress';
    }
    
    await contactMessage.save();
    
    // Populate the updated message
    const updatedMessage = await Contact.findById(id)
      .populate('userId', 'firstName lastName email userType')
      .populate('replies.senderId', 'firstName lastName email name');
    
    res.status(200).json({
      success: true,
      message: 'Reply sent successfully!',
      data: updatedMessage
    });
    
  } catch (error) {
    console.error('Error sending user reply:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send reply.',
      error: error.message
    });
  }
};

// Get user's own contact messages
export const getUserContactMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const messages = await Contact.find({ userId })
      .sort({ createdAt: -1 })
      .populate('adminReply.adminId', 'name email')
      .populate('replies.senderId', 'firstName lastName email name');
    
    res.status(200).json({
      success: true,
      data: messages
    });
    
  } catch (error) {
    console.error('Error fetching user contact messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your messages.',
      error: error.message
    });
  }
};

// Get contact message statistics (admin only)
export const getContactStats = async (req, res) => {
  try {
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const priorityStats = await Contact.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const categoryStats = await Contact.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const totalMessages = await Contact.countDocuments();
    const newMessages = await Contact.countDocuments({ status: 'new' });
    const repliedMessages = await Contact.countDocuments({ status: 'replied' });
    const resolvedMessages = await Contact.countDocuments({ status: 'resolved' });
    
    res.status(200).json({
      success: true,
      data: {
        total: totalMessages,
        new: newMessages,
        replied: repliedMessages,
        resolved: resolvedMessages,
        statusBreakdown: stats,
        priorityBreakdown: priorityStats,
        categoryBreakdown: categoryStats
      }
    });
    
  } catch (error) {
    console.error('Error fetching contact stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact statistics.',
      error: error.message
    });
  }
};
