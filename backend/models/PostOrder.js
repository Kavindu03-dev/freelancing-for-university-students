import mongoose from "mongoose";

const postOrderSchema = new mongoose.Schema({
  clientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  freelancerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  postId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Post', 
    required: true 
  },
  postDetails: {
    title: { type: String, required: true },
    type: { type: String, required: true },
    category: { type: String, required: true },
    budget: { type: Number, required: true },
    description: { type: String, required: true },
    requiredSkills: [{ type: String }],
    degreeField: { type: String, required: true },
    location: { type: String, required: true }
  },
  totalAmount: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: [
      'Pending',           // Initial state when order is placed
      'Payment Confirmed', // Payment has been verified
      'In Progress',       // Freelancer is working on the project
      'Review',            // Work completed, waiting for client review
      'Revision',          // Client requested revisions
      'Completed',         // Order has been completed
      'Cancelled'          // Order has been cancelled
    ], 
    default: 'Pending' 
  },
  requirements: {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  paymentMethod: { 
    type: String, 
    enum: ['Stripe', 'COD'], 
    required: true 
  },
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'], 
    default: 'Pending' 
  },
  stripeSessionId: String,
  stripePaymentIntentId: String,
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
postOrderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const PostOrder = mongoose.models.JobApplication || mongoose.model('JobApplication', postOrderSchema, 'jobapplications');

export default PostOrder;
