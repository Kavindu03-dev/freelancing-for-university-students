import User from '../models/User.js';
import { uploadToImgBB, cleanupTempFile } from '../middleware/imgbbUpload.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (user) {
      res.json({
        success: true,
        data: user
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Update common fields
    if (req.body.firstName !== undefined) user.firstName = req.body.firstName;
    if (req.body.lastName !== undefined) user.lastName = req.body.lastName;
    if (req.body.email !== undefined) user.email = req.body.email;
    if (req.body.phoneNumber !== undefined) user.phoneNumber = req.body.phoneNumber;
    if (req.body.address !== undefined) user.address = req.body.address;
    if (req.body.dateOfBirth !== undefined) user.dateOfBirth = req.body.dateOfBirth;
    if (req.body.skills !== undefined) user.skills = req.body.skills;
    if (req.body.bio !== undefined) user.bio = req.body.bio;
    if (req.body.hourlyRate !== undefined) user.hourlyRate = req.body.hourlyRate;
    if (req.body.professionalSummary !== undefined) user.professionalSummary = req.body.professionalSummary;

    // Update client-specific fields
    if (user.userType === 'client') {
      if (req.body.organization !== undefined) user.organization = req.body.organization;
      if (req.body.jobTitle !== undefined) user.jobTitle = req.body.jobTitle;
      if (req.body.contactPhone !== undefined) user.contactPhone = req.body.contactPhone;
      if (req.body.projectCategories !== undefined) user.projectCategories = req.body.projectCategories;
      if (req.body.companySize !== undefined) user.companySize = req.body.companySize;
      if (req.body.industry !== undefined) user.industry = req.body.industry;
      if (req.body.website !== undefined) user.website = req.body.website;
      if (req.body.companyDescription !== undefined) user.companyDescription = req.body.companyDescription;
    }

    // Update freelancer-specific fields
    if (user.userType === 'freelancer') {
      if (req.body.degreeProgram !== undefined) user.degreeProgram = req.body.degreeProgram;
      if (req.body.university !== undefined) user.university = req.body.university;
      if (req.body.gpa !== undefined) user.gpa = req.body.gpa;
      if (req.body.graduationYear !== undefined) user.graduationYear = req.body.graduationYear;
      if (req.body.technicalSkills !== undefined) user.technicalSkills = req.body.technicalSkills;
      if (req.body.experience !== undefined) user.experience = req.body.experience;
    }

    // Update university staff-specific fields
    if (user.userType === 'universityStaff') {
      if (req.body.staffRole !== undefined) user.staffRole = req.body.staffRole;
      if (req.body.department !== undefined) user.department = req.body.department;
      if (req.body.employeeId !== undefined) user.employeeId = req.body.employeeId;
      if (req.body.experience !== undefined) user.experience = req.body.experience;
      if (req.body.qualification !== undefined) user.qualification = req.body.qualification;
      if (req.body.professionalSummary !== undefined) user.professionalSummary = req.body.professionalSummary;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete CV file if it exists (for freelancers)
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
// @route   POST /api/users/profile-image
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
// @route   DELETE /api/users/profile-image
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

// @desc    Get all users (admin only)
// @route   GET /api/users/admin/all
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
  try {
    // Get query parameters for filtering and pagination
    const { 
      page = 1, 
      limit = 20, 
      userType, 
      status, 
      search 
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (userType && userType !== 'all') {
      filter.userType = userType;
    }
    

    
    if (status && status !== 'all') {
      if (status === 'active') {
        filter.status = 'active';
      } else if (status === 'suspended') {
        filter.status = 'suspended';
      }
    }
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get users with pagination and filtering
    const users = await User.find(filter)
      .select('-password') // Exclude password field
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / limit);

    // Get statistics
    const stats = {
      total: totalUsers,
      freelancers: await User.countDocuments({ userType: 'freelancer' }),
      clients: await User.countDocuments({ userType: 'client' }),
      universityStaff: await User.countDocuments({ userType: 'universityStaff' }),
      active: await User.countDocuments({ status: 'active' }),
      suspended: await User.countDocuments({ status: 'suspended' })
    };

    res.json({
      success: true,
      data: users,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalUsers,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      stats
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

// @desc    Verify user (admin only)
// @route   PUT /api/users/admin/:id/verify
// @access  Private (Admin only)
const verifyUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isVerified = true;
    await user.save();

    res.json({
      success: true,
      message: 'User verified successfully',
      data: {
        _id: user._id,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Verify user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify user',
      error: error.message
    });
  }
};

// @desc    Unverify user (admin only)
// @route   PUT /api/users/admin/:id/unverify
// @access  Private (Admin only)
const unverifyUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isVerified = false;
    await user.save();

    res.json({
      success: true,
      message: 'User unverified successfully',
      data: {
        _id: user._id,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Unverify user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unverify user',
      error: error.message
    });
  }
};

// @desc    Suspend user (admin only)
// @route   PUT /api/users/admin/:id/suspend
// @access  Private (Admin only)
const suspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.status = 'suspended';
    await user.save();

    res.json({
      success: true,
      message: 'User suspended successfully',
      data: {
        _id: user._id,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Suspend user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to suspend user',
      error: error.message
    });
  }
};

// @desc    Activate user (admin only)
// @route   PUT /api/users/admin/:id/activate
// @access  Private (Admin only)
const activateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.status = 'active';
    await user.save();

    res.json({
      success: true,
      message: 'User activated successfully',
      data: {
        _id: user._id,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Activate user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to activate user',
      error: error.message
    });
  }
};

// @desc    Delete user (admin only)
// @route   DELETE /api/users/admin/:id
// @access  Private (Admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete CV file if it exists (for freelancers)
    if (user.cvFile && user.cvFile.filePath) {
      try {
        const fs = await import('fs');
        if (fs.existsSync(user.cvFile.filePath)) {
          fs.unlinkSync(user.cvFile.filePath);
        }
      } catch (fileError) {
        console.error('Error deleting CV file:', fileError);
      }
    }

    // Delete profile image if it exists
    if (user.profileImage && user.profileImage.url) {
      try {
        await cleanupTempFile(user.profileImage.deleteUrl);
      } catch (imageError) {
        console.error('Error deleting profile image:', imageError);
      }
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
};

export default {
  getUserProfile,
  updateUserProfile,
  deleteAccount,
  uploadProfileImage,
  removeProfileImage,
  getAllUsers,
  verifyUser,
  unverifyUser,
  suspendUser,
  activateUser,
  deleteUser
};
