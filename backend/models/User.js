import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // Common fields
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
  password: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    enum: ['freelancer', 'client', 'universityStaff', 'admin'],
    required: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'suspended'],
    default: 'active'
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
  
  // Profile Image
  profileImage: {
    url: {
      type: String,
      trim: true
    },
    deleteUrl: {
      type: String,
      trim: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  
  // Freelancer-specific fields
  degreeProgram: {
    type: String,
    trim: true
  },
  university: {
    type: String,
    trim: true
  },
  gpa: {
    type: String,
    trim: true
  },
  technicalSkills: [{
    type: String,
    trim: true
  }],
  graduationYear: {
    type: String,
    trim: true
  },
  cvFile: {
    type: {
      originalName: {
        type: String,
        trim: true
      },
      fileName: {
        type: String,
        trim: true
      },
      filePath: {
        type: String,
        trim: true
      },
      fileSize: {
        type: Number
      },
      mimeType: {
        type: String,
        trim: true
      },
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    },
    required: false,
    default: undefined
  },
  
  // Client fields
  organization: {
    type: String,
    trim: true
  },
  jobTitle: {
    type: String,
    trim: true
  },
  contactPhone: {
    type: String,
    trim: true
  },
  projectCategories: [{
    type: String,
    trim: true
  }],
  companySize: {
    type: String,
    trim: true
  },
  industry: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  companyDescription: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  
  // University Staff fields
  staffRole: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  employeeId: {
    type: String,
    trim: true
  },
  experience: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  qualification: {
    type: String,
    trim: true
  },
  professionalSummary: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  
  // Legacy fields for backward compatibility
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
  
  // Wallet
  walletBalance: {
    type: Number,
    min: 0,
    default: 0
  },
  
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
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('User', userSchema);
