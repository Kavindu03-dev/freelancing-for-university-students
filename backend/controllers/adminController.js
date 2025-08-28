import User from '../models/User.js';
import Service from '../models/Service.js';
import Post from '../models/Post.js';
import Contact from '../models/Contact.js';
import Order from '../models/Order.js';

// @desc    Get all users with filters
// @route   GET /api/admin/users
// @access  Admin only
export const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      userType,
      status,
      search,
      university,
      faculty
    } = req.query;

    const filter = {};

    // Apply filters
    if (userType) filter.userType = userType;
    if (status) filter.status = status;
    if (university) filter.university = university;
    if (faculty) filter.faculty = faculty;

    // Search functionality
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { organization: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Admin only
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Admin only
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['active', 'pending', 'suspended', 'banned'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }
    
    const user = await User.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User status updated successfully',
      user
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user status',
      error: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin only
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

// @desc    Get user statistics
// @route   GET /api/admin/users/stats
// @access  Admin only
export const getUserStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
          pendingUsers: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          suspendedUsers: { $sum: { $cond: [{ $eq: ['$status', 'suspended'] }, 1, 0] } },
          bannedUsers: { $sum: { $cond: [{ $eq: ['$status', 'banned'] }, 1, 0] } }
        }
      }
    ]);

    const userTypeStats = await User.aggregate([
      {
        $group: {
          _id: '$userType',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const universityStats = await User.aggregate([
      { $match: { university: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$university',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      stats: stats[0] || {
        totalUsers: 0,
        activeUsers: 0,
        pendingUsers: 0,
        suspendedUsers: 0,
        bannedUsers: 0
      },
      userTypeStats,
      universityStats
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user stats',
      error: error.message
    });
  }
};

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private (Admin only)
export const getDashboardStats = async (req, res) => {
  try {
    // Get user statistics
    const totalUsers = await User.countDocuments({ userType: { $ne: 'admin' } });
    const totalFreelancers = await User.countDocuments({ userType: 'freelancer' });
    const totalClients = await User.countDocuments({ userType: 'client' });
    const totalUniversityStaff = await User.countDocuments({ userType: 'universityStaff' });

    // Get service/gig statistics
    const totalGigs = await Service.countDocuments({ isActive: true });
    const pendingGigs = await Service.countDocuments({ status: 'pending' });

    // Get post statistics
    const totalPosts = await Post.countDocuments({ isActive: true });
    const pendingPosts = await Post.countDocuments({ approvalStatus: 'Pending' });

    // Get contact message statistics
    const totalMessages = await Contact.countDocuments({});
    const newMessages = await Contact.countDocuments({ status: 'new' });
    const repliedMessages = await Contact.countDocuments({ status: 'replied' });

    // Calculate total revenue from completed orders
    const revenueData = await Order.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Calculate pending approvals (gigs + posts)
    const pendingApprovals = pendingGigs + pendingPosts;

    // Calculate monthly growth (users created in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newUsersThisMonth = await User.countDocuments({
      userType: { $ne: 'admin' },
      createdAt: { $gte: thirtyDaysAgo }
    });

    const previousMonthUsers = await User.countDocuments({
      userType: { $ne: 'admin' },
      createdAt: { 
        $gte: new Date(thirtyDaysAgo.getTime() - 30 * 24 * 60 * 60 * 1000),
        $lt: thirtyDaysAgo
      }
    });

    const monthlyGrowth = previousMonthUsers > 0 
      ? ((newUsersThisMonth - previousMonthUsers) / previousMonthUsers * 100).toFixed(1)
      : newUsersThisMonth > 0 ? 100 : 0;

    // Calculate conversion rate (users who have completed at least one order)
    const usersWithOrders = await Order.distinct('userId');
    const conversionRate = totalUsers > 0 
      ? ((usersWithOrders.length / totalUsers) * 100).toFixed(1)
      : 0;

    res.json({
      success: true,
      data: {
        // User stats
        totalUsers,
        totalFreelancers,
        totalClients,
        totalUniversityStaff,
        
        // Service stats
        totalGigs,
        pendingGigs,
        
        // Post stats
        totalPosts,
        pendingPosts,
        
        // Contact stats
        totalMessages,
        newMessages,
        repliedMessages,
        
        // Financial stats
        totalRevenue,
        pendingApprovals,
        
        // Growth stats
        monthlyGrowth: parseFloat(monthlyGrowth),
        conversionRate: parseFloat(conversionRate)
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
};
