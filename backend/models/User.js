const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    enum: ['client', 'freelancer'],
    required: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  bio: {
    type: String,
    trim: true,
    maxlength: 500
  },
  hourlyRate: {
    type: Number,
    min: 0,
    default: 0
  },
  experience: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  education: {
    type: String,
    trim: true,
    maxlength: 500
  },
  portfolio: [{
    title: {
      type: String,
      trim: true,
      required: true
    },
    description: {
      type: String,
      trim: true
    },
    link: {
      type: String,
      trim: true
    },
    image: {
      type: String,
      trim: true
    }
  }],
  category: {
    type: String,
    trim: true,
    enum: ['Web Development', 'Mobile Development', 'Design', 'Writing', 'Marketing', 'Data Analysis', 'Other']
  },
  agreeToTerms: {
    type: Boolean,
    required: true,
    default: false
  },
  agreeToMarketing: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
