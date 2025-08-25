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

    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.email = req.body.email || user.email;
      user.skills = req.body.skills || user.skills;
      user.bio = req.body.bio || user.bio;

      const updatedUser = await user.save();

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          _id: updatedUser._id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          userType: updatedUser.userType,
          skills: updatedUser.skills,
          bio: updatedUser.bio
        }
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
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

export default {
  getUserProfile,
  updateUserProfile,
  deleteAccount,
  uploadProfileImage,
  removeProfileImage
};
