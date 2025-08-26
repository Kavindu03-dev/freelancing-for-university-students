import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
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
  icon: {
    type: String,
    default: '⚡'
  },
  freelancers: {
    type: Number,
    default: 0
  },
  avgPrice: {
    type: Number,
    default: 0
  },
  popularity: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
}, {
  timestamps: true
});

// Index for better search performance
skillSchema.index({ name: 'text', description: 'text', category: 'text' });

export default mongoose.model('Skill', skillSchema);
