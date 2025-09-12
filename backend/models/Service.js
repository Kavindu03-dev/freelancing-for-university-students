import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  subcategory: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  priceType: {
    type: String,
    required: true,
    enum: ['Fixed', 'Hourly', 'Daily', 'Weekly', 'Monthly']
  },
  deliveryTime: {
    type: Number,
    required: true,
    min: 1
  },
  deliveryUnit: {
    type: String,
    required: true,
    enum: ['Days', 'Hours', 'Weeks', 'Months']
  },
  // New fields for packages and revisions
  packages: {
    basic: {
      name: { type: String, default: 'Basic' },
      price: { type: Number, required: true, min: 0 },
      description: { type: String, required: true },
      features: [{ type: String }],
      deliveryTime: { type: Number, required: true, min: 1 },
      revisions: { type: Number, default: 1, min: 0 }
    },
    standard: {
      name: { type: String, default: 'Standard' },
      price: { type: Number, required: true, min: 0 },
      description: { type: String, required: true },
      features: [{ type: String }],
      deliveryTime: { type: Number, required: true, min: 1 },
      revisions: { type: Number, default: 2, min: 0 }
    },
    premium: {
      name: { type: String, default: 'Premium' },
      price: { type: Number, required: true, min: 0 },
      description: { type: String, required: true },
      features: [{ type: String }],
      deliveryTime: { type: Number, required: true, min: 1 },
      revisions: { type: Number, default: 3, min: 0 }
    }
  },
  skills: [{
    type: String,
    trim: true
  }],
  portfolio: [{
    title: String,
    description: String,
    imageUrl: String,
    projectUrl: String
  }],
  images: [{
    url: String,
    caption: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  freelancerName: {
    type: String,
    required: true
  },
  freelancerAvatar: String,
  university: String,
  degreeProgram: String,
  gpa: String,
  experience: String,
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [String],
  requirements: String,
  whatYouGet: [String],
  faqs: [{
    question: String,
    answer: String
  }],
  reviews: [{
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
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
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Method to calculate average rating
serviceSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.totalReviews = 0;
    return;
  }
  
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.rating = totalRating / this.reviews.length;
  this.totalReviews = this.reviews.length;
};

// Indexes for better query performance
serviceSchema.index({ freelancerId: 1, isActive: 1 });
serviceSchema.index({ category: 1, isActive: 1 });
serviceSchema.index({ skills: 1 });
serviceSchema.index({ rating: -1 });
serviceSchema.index({ createdAt: -1 });
serviceSchema.index({ featured: 1, isActive: 1 });

const Service = mongoose.model('Service', serviceSchema);

export default Service;
