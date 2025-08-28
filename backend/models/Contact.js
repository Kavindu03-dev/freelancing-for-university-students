import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  // User information
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional, in case user is not logged in
  },
  
  // Message details
  subject: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  
  // Status and admin handling
  status: {
    type: String,
    enum: ['new', 'in-progress', 'replied', 'resolved', 'closed'],
    default: 'new'
  },
  
  // Conversation thread
  replies: [{
    message: {
      type: String,
      trim: true,
      required: true
    },
    senderType: {
      type: String,
      enum: ['user', 'admin'],
      required: true
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'replies.senderModel'
    },
    senderModel: {
      type: String,
      enum: ['User', 'Admin']
    },
    repliedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Legacy admin reply field for backward compatibility
  adminReply: {
    message: {
      type: String,
      trim: true
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    repliedAt: {
      type: Date
    }
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
contactSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
