import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
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
    trim: true,
    enum: [
      'Getting Started',
      'Best Practices',
      'Tools & Software',
      'Business Tips',
      'Marketing',
      'Legal & Contracts',
      'Pricing Strategies',
      'Client Management'
    ]
  },
  type: {
    type: String,
    required: true,
    trim: true,
    enum: [
      'Guide',
      'Tutorial',
      'Resource List',
      'Article',
      'Legal Guide',
      'Strategy Guide',
      'Branding Guide',
      'Business Guide'
    ]
  },
  readTime: {
    type: String,
    required: true,
    trim: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  tags: [{
    type: String,
    trim: true
  }],
  featured: {
    type: Boolean,
    default: false
  },
  link: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for better search performance
resourceSchema.index({ title: 'text', description: 'text', category: 'text', tags: 'text' });
resourceSchema.index({ category: 1, featured: 1 });
resourceSchema.index({ createdAt: -1 });

export default mongoose.model('Resource', resourceSchema);
