const User = require('../models/User');

// @desc    Get student profile
// @route   GET /api/student/profile
// @access  Private
const getStudentProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
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
    console.error('Get student profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update student profile
// @route   PUT /api/student/profile
// @access  Private
const updateStudentProfile = async (req, res) => {
  try {
    const { firstName, lastName, bio, skills, hourlyRate, experience, education, portfolio, phoneNumber, country } = req.body;

    // Find user and ensure they're a freelancer
    const user = await User.findById(req.user.id);
    
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
    if (bio !== undefined) updateData.bio = bio;
    if (skills !== undefined) updateData.skills = skills;
    if (hourlyRate !== undefined) updateData.hourlyRate = hourlyRate;
    if (experience !== undefined) updateData.experience = experience;
    if (education !== undefined) updateData.education = education;
    if (portfolio !== undefined) updateData.portfolio = portfolio;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (country !== undefined) updateData.country = country;

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update student profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Add skill to student profile
// @route   POST /api/student/skills
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

    const user = await User.findById(req.user.id);
    
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

// @desc    Remove skill from student profile
// @route   DELETE /api/student/skills/:skill
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

    const user = await User.findById(req.user.id);
    
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

// @desc    Update student skills (bulk update)
// @route   PUT /api/student/skills
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

    const user = await User.findById(req.user.id);
    
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
// @route   GET /api/student/freelancers
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
// @route   GET /api/student/freelancers/:id
// @access  Public
const getFreelancerProfile = async (req, res) => {
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

module.exports = {
  getStudentProfile,
  updateStudentProfile,
  addSkill,
  removeSkill,
  updateSkills,
  getAllFreelancers,
  getFreelancerProfile
};

