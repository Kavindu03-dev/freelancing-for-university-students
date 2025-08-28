import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema({
  // Job post reference
  postId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Post', 
    required: true 
  },
  
  // Client who posted the job
  clientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Freelancer applying for the job
  freelancerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Application details
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  
  email: {
    type: String,
    required: true,
    trim: true
  },
  
  phoneNumber: {
    type: String,
    trim: true
  },
  
  professionalTitle: {
    type: String,
    required: true,
    trim: true
  },
  
  coverLetter: {
    type: String,
    required: true,
    trim: true
  },
  
  portfolioLink: {
    type: String,
    trim: true
  },
  
  // File attachments
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileType: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Application status
  status: { 
    type: String, 
    enum: [
      'Pending',           // Initial state when application is submitted
      'Under Review',      // Client is reviewing the application
      'Accepted',          // Application accepted by client
      'Declined',          // Application declined by client
      'Interview Scheduled', // Interview scheduled for accepted applications
      'Hired',             // Freelancer hired for the job
      'Rejected'           // Final rejection
    ], 
    default: 'Pending' 
  },
  
  // Client feedback
  clientFeedback: {
    type: String,
    trim: true
  },
  
  // Interview details (if accepted)
  interviewDetails: {
    scheduledDate: Date,
    scheduledTime: String,
    location: String,
    notes: String,
    isOnline: {
      type: Boolean,
      default: false
    },
    meetingLink: String
  },
  
  // Payment details (if applicable)
  paymentAmount: {
    type: Number,
    min: 0
  },
  
  paymentStatus: { 
    type: String, 
    enum: ['Not Required', 'Pending', 'Paid', 'Failed'], 
    default: 'Not Required' 
  },
  
  // Timestamps
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
  
  // Client action timestamps
  reviewedAt: Date,
  respondedAt: Date,
  
  // Status change history
  statusHistory: [{
    status: {
      type: String,
      enum: [
        'Pending',
        'Under Review', 
        'Accepted',
        'Interview Scheduled',
        'Hired',
        'Declined',
        'Rejected'
      ]
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    changedBy: {
      type: String,
      enum: ['Client', 'System'],
      default: 'Client'
    },
    reason: String,
    feedback: String
  }]
});

// Update the updatedAt field before saving
jobApplicationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for better query performance
jobApplicationSchema.index({ postId: 1, status: 1 });
jobApplicationSchema.index({ freelancerId: 1, status: 1 });
jobApplicationSchema.index({ clientId: 1, status: 1 });
jobApplicationSchema.index({ createdAt: -1 });

const JobApplication = mongoose.models.JobApplication || mongoose.model('JobApplication', jobApplicationSchema);

export default JobApplication;

