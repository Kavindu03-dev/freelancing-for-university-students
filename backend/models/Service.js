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
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
serviceSchema.index({ freelancerId: 1, isActive: 1 });
serviceSchema.index({ category: 1, isActive: 1 });
serviceSchema.index({ skills: 1 });
serviceSchema.index({ rating: -1 });
serviceSchema.index({ createdAt: -1 });
serviceSchema.index({ featured: 1, isActive: 1 });

const Service = mongoose.model('Service', serviceSchema);

export default Service;
