import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index to prevent duplicate reviews for the same order
reviewSchema.index({ orderId: 1 }, { unique: true });

// Index for efficient querying by freelancer
reviewSchema.index({ freelancerId: 1 });

// Index for efficient querying by client
reviewSchema.index({ clientId: 1 });

export default mongoose.model('Review', reviewSchema);
