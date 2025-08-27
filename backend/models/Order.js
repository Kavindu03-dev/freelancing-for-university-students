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
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
