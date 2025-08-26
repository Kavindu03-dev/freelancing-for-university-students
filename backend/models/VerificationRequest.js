import mongoose from 'mongoose';

const verificationRequestSchema = new mongoose.Schema({
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  requestMessage: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  staffResponse: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  respondedAt: {
    type: Date
  }
});

// Index for efficient queries
verificationRequestSchema.index({ freelancerId: 1, status: 1 });
verificationRequestSchema.index({ staffId: 1, status: 1 });

export default mongoose.model('VerificationRequest', verificationRequestSchema);
