import User from '../models/User.js';
import { uploadToImgBB, cleanupTempFile } from '../middleware/imgbbUpload.js';

// @desc    Get freelancer profile
// @route   GET /api/freelancer/profile
// @access  Private
const getFreelancerProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.userType !== 'freelancer') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only freelancers can access this endpoint.'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get freelancer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update freelancer profile
// @route   PUT /api/freelancer/profile
// @access  Private
const updateFreelancerProfile = async (req, res) => {
  try {
    const { 
      firstName, lastName, email, bio, skills, technicalSkills, hourlyRate, 
      experience, education, portfolio, phoneNumber, address, country,
      degreeProgram, university, gpa, graduationYear, dateOfBirth
    } = req.body;

    // Find user and ensure they're a freelancer
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.userType !== 'freelancer') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only freelancers can access this endpoint.'
      });
    }

    // Update allowed fields
    const updateData = {};
    
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;
    if (bio !== undefined) updateData.bio = bio;
    if (skills !== undefined) updateData.skills = skills;
    if (technicalSkills !== undefined) updateData.technicalSkills = technicalSkills;
    if (hourlyRate !== undefined) updateData.hourlyRate = hourlyRate;
    if (experience !== undefined) updateData.experience = experience;
    if (education !== undefined) updateData.education = education;
    if (portfolio !== undefined) updateData.portfolio = portfolio;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (address !== undefined) updateData.address = address;
    if (country !== undefined) updateData.country = country;
    if (degreeProgram !== undefined) updateData.degreeProgram = degreeProgram;
    if (university !== undefined) updateData.university = university;
    if (gpa !== undefined) updateData.gpa = gpa;
    if (graduationYear !== undefined) updateData.graduationYear = graduationYear;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update freelancer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Add skill to freelancer profile
// @route   POST /api/freelancer/skills
// @access  Private
const addSkill = async (req, res) => {
  try {
    const { skill } = req.body;

    if (!skill || typeof skill !== 'string' || skill.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid skill'
      });
    }

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.userType !== 'freelancer') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only freelancers can access this endpoint.'
      });
    }

    // Check if skill already exists
    if (user.skills.includes(skill.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Skill already exists'
      });
    }

    // Add skill
    user.skills.push(skill.trim());
    await user.save();

    res.json({
      success: true,
      message: 'Skill added successfully',
      data: {
        skills: user.skills
      }
    });
  } catch (error) {
    console.error('Add skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Remove skill from freelancer profile
// @route   DELETE /api/freelancer/skills/:skill
// @access  Private
const removeSkill = async (req, res) => {
  try {
    const { skill } = req.params;

    if (!skill) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a skill to remove'
      });
    }

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.userType !== 'freelancer') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only freelancers can access this endpoint.'
      });
    }

    // Check if skill exists
    if (!user.skills.includes(skill)) {
      return res.status(400).json({
        success: false,
        message: 'Skill not found'
      });
    }

    // Remove skill
    user.skills = user.skills.filter(s => s !== skill);
    await user.save();

    res.json({
      success: true,
      message: 'Skill removed successfully',
      data: {
        skills: user.skills
      }
    });
  } catch (error) {
    console.error('Remove skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update freelancer skills (bulk update)
// @route   PUT /api/freelancer/skills
// @access  Private
const updateSkills = async (req, res) => {
  try {
    const { skills } = req.body;

    if (!skills || !Array.isArray(skills)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid skills array'
      });
    }

    // Validate each skill
    const validSkills = skills.filter(skill => 
      typeof skill === 'string' && skill.trim().length > 0
    );

    if (validSkills.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one valid skill'
      });
    }

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.userType !== 'freelancer') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only freelancers can access this endpoint.'
      });
    }

    // Update skills (remove duplicates and trim)
    user.skills = [...new Set(validSkills.map(skill => skill.trim()))];
    await user.save();

    res.json({
      success: true,
      message: 'Skills updated successfully',
      data: {
        skills: user.skills
      }
    });
  } catch (error) {
    console.error('Update skills error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all freelancers (for client browsing)
// @route   GET /api/freelancer/freelancers
// @access  Public
const getAllFreelancers = async (req, res) => {
  try {
    const { page = 1, limit = 10, skills, category } = req.query;

    // Build filter
    const filter = { userType: 'freelancer' };
    
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      filter.skills = { $in: skillsArray };
    }

    if (category) {
      filter.category = category;
    }

    // Pagination
    const skip = (page - 1) * limit;
    
    const freelancers = await User.find(filter)
      .select('-password -agreeToTerms -agreeToMarketing')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        freelancers,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalFreelancers: total,
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get freelancers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get freelancer by ID (public profile)
// @route   GET /api/freelancer/freelancers/:id
// @access  Public
const getFreelancerById = async (req, res) => {
  try {
    const { id } = req.params;

    const freelancer = await User.findById(id)
      .select('-password -agreeToTerms -agreeToMarketing')
      .where('userType', 'freelancer');

    if (!freelancer) {
      return res.status(404).json({
        success: false,
        message: 'Freelancer not found'
      });
    }

    res.json({
      success: true,
      data: freelancer
    });
  } catch (error) {
    console.error('Get freelancer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Upload CV/Resume
// @route   POST /api/freelancer/cv
// @access  Private
const uploadCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Find user and ensure they're a freelancer
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.userType !== 'freelancer') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only freelancers can access this endpoint.'
      });
    }

    // Delete old CV file if it exists
    if (user.cvFile && user.cvFile.filePath) {
      try {
        const fs = await import('fs');
        if (fs.existsSync(user.cvFile.filePath)) {
          fs.unlinkSync(user.cvFile.filePath);
        }
      } catch (error) {
        console.error('Error deleting old CV file:', error);
      }
    }

    // Update user with new CV file info
    const cvFileData = {
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      uploadedAt: new Date()
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { cvFile: cvFileData },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'CV uploaded successfully',
      data: {
        cvFile: updatedUser.cvFile
      }
    });
  } catch (error) {
    console.error('Upload CV error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete CV/Resume
// @route   DELETE /api/freelancer/cv
// @access  Private
const deleteCV = async (req, res) => {
  try {
    // Find user and ensure they're a freelancer
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.userType !== 'freelancer') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only freelancers can access this endpoint.'
      });
    }

    // Delete CV file if it exists
    if (user.cvFile && user.cvFile.filePath) {
      try {
        const fs = await import('fs');
        if (fs.existsSync(user.cvFile.filePath)) {
          fs.unlinkSync(user.cvFile.filePath);
        }
      } catch (error) {
        console.error('Error deleting CV file:', error);
      }
    }

    // Remove CV file info from user
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $unset: { cvFile: 1 } },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'CV deleted successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Delete CV error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/freelancer/account
// @access  Private
const deleteAccount = async (req, res) => {
  try {
    // Find user and ensure they're a freelancer
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.userType !== 'freelancer') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only freelancers can access this endpoint.'
      });
    }

    // Delete CV file if it exists
    if (user.cvFile && user.cvFile.filePath) {
      try {
        const fs = await import('fs');
        if (fs.existsSync(user.cvFile.filePath)) {
          fs.unlinkSync(user.cvFile.filePath);
        }
      } catch (error) {
        console.error('Error deleting CV file:', error);
      }
    }

    // Delete user account
    await User.findByIdAndDelete(req.user._id);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Upload profile image
// @route   POST /api/freelancer/profile-image
// @access  Private
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const user = await User.findById(req.user._id);
    
    if (!user) {
      // Clean up temp file
      cleanupTempFile(req.file.path);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.userType !== 'freelancer') {
      // Clean up temp file
      cleanupTempFile(req.file.path);
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only freelancers can access this endpoint.'
      });
    }

    // Get ImgBB API key from environment
    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      cleanupTempFile(req.file.path);
      return res.status(500).json({
        success: false,
        message: 'ImgBB API key not configured'
      });
    }

    // Upload image to ImgBB
    const imgbbResult = await uploadToImgBB(req.file.path, apiKey);
    
    // Clean up temp file
    cleanupTempFile(req.file.path);

    // Delete old profile image if it exists
    if (user.profileImage && user.profileImage.url) {
      // Note: ImgBB doesn't provide a way to delete images via API
      // The old image will remain on ImgBB servers
      console.log('Old profile image URL:', user.profileImage.url);
    }

    // Update user profile with new image
    user.profileImage = imgbbResult;
    await user.save();

    res.json({
      success: true,
      message: 'Profile image uploaded successfully',
      data: {
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Profile image upload error:', error);
    
    // Clean up temp file if it exists
    if (req.file && req.file.path) {
      cleanupTempFile(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to upload profile image',
      error: error.message
    });
  }
};

// @desc    Remove profile image
// @route   DELETE /api/freelancer/profile-image
// @access  Private
const removeProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.userType !== 'freelancer') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only freelancers can access this endpoint.'
      });
    }

    // Check if user has a profile image
    if (!user.profileImage || !user.profileImage.url) {
      return res.status(400).json({
        success: false,
        message: 'No profile image to remove'
      });
    }

    // Note: ImgBB doesn't provide a way to delete images via API
    // The image will remain on ImgBB servers, but we remove the reference
    console.log('Removing profile image reference:', user.profileImage.url);

    // Remove profile image reference from user
    user.profileImage = null;
    await user.save();

    res.json({
      success: true,
      message: 'Profile image removed successfully'
    });
  } catch (error) {
    console.error('Profile image remove error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to remove profile image',
      error: error.message
    });
  }
};

export default {
  getFreelancerProfile,
  updateFreelancerProfile,
  addSkill,
  removeSkill,
  updateSkills,
  getAllFreelancers,
  getFreelancerById,
  uploadCV,
  deleteCV,
  deleteAccount,
  uploadProfileImage,
  removeProfileImage
};

