import User from '../models/User.js';
import Admin from '../models/Admin.js';

// @desc    Get all users with filters (Admin only)
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const { search, userType, status } = req.query;
    
    // Build filter object
    const filter = {};
    const conditions = [];
    
    // Search filter (search in firstName, lastName, email, university)
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      conditions.push({
        $or: [
          { firstName: searchRegex },
          { lastName: searchRegex },
          { email: searchRegex },
          { university: searchRegex }
        ]
      });
    }
    
    // User type filter
    if (userType && userType !== 'all') {
      conditions.push({ userType: userType });
    }
    
    // Status filter
    if (status && status !== 'all') {
      if (status === 'active') {
        // For active status, include users with status 'active' OR users without status field (default active)
        conditions.push({
          $or: [
            { status: 'active' },
            { status: { $exists: false } },
            { status: null }
          ]
        });
      } else {
        // For other statuses, filter normally
        conditions.push({ status: status });
      }
    }
    

    
    // Combine all conditions with $and
    if (conditions.length > 0) {
      filter.$and = conditions;
    }
    
    console.log('🔍 Filtering users with:', JSON.stringify(filter, null, 2));
    
    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: users,
      total: users.length
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Get user by ID (Admin only)
// @route   GET /api/admin/users/:id
// @access  Private (Admin)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Update user status (Admin only)
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['active', 'suspended', 'banned'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid status is required (active, suspended, banned)' 
      });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Add status field if it doesn't exist
    user.status = status;
    await user.save();
    
    res.json({
      success: true,
      message: `User status updated to ${status}`,
      data: {
        _id: user._id,
        email: user.email,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
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
      } catch (error) {
        console.error('Error deleting CV file:', error);
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
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Get user statistics (Admin only)
// @route   GET /api/admin/users/stats
// @access  Private (Admin)
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const freelancers = await User.countDocuments({ userType: 'freelancer' });
    const clients = await User.countDocuments({ userType: 'client' });
    const universityStaff = await User.countDocuments({ userType: 'universityStaff' });
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const unverifiedUsers = await User.countDocuments({ isVerified: false });
    
    // Get users by university (for freelancers)
    const universityStats = await User.aggregate([
      { $match: { userType: 'freelancer', university: { $exists: true, $ne: '' } } },
      { $group: { _id: '$university', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Get recent users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentUsers = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    
    res.json({
      success: true,
      data: {
        totalUsers,
        freelancers,
        clients,
        universityStaff,
        verifiedUsers,
        unverifiedUsers,
        recentUsers,
        universityStats
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

export default {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getUserStats
};
