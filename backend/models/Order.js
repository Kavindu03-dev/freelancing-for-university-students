import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
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
  serviceId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Service', 
    required: true 
  },
  selectedPackage: { 
    type: String, 
    enum: ['basic', 'standard', 'premium'], 
    required: true 
  },
  packageDetails: {
    name: String,
    price: Number,
    description: String,
    features: [String],
    deliveryTime: Number,
    revisions: Number
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
  clientStatus: {
    type: String,
    enum: [
      'Pending',           // Initial state
      'Delivered',         // Client marked as delivered
      'Completed'          // Client completed the order
    ],
    default: 'Pending'
  },
  freelancerStatus: {
    type: String,
    enum: [
      'Pending',           // Initial state
      'In Progress',       // Freelancer is working
      'Completed'          // Freelancer completed the work
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
  paymentDetails: {
    freelancerAmount: Number,
    websiteFee: Number,
    totalAmount: Number,
    paidAt: Date,
    transactionId: String
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
  ,
  // Review info (set after client marks delivered and submits a review for the related service)
  reviewSubmitted: {
    type: Boolean,
    default: false
  },
  review: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String, trim: true },
    createdAt: { type: Date }
  }
});

// Update the updatedAt field before saving
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
