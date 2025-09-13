import User from '../models/User.js';
import { uploadToImgBB, cleanupTempFile } from '../middleware/imgbbUpload.js';
import Post from '../models/Post.js';
import Order from '../models/Order.js';
import JobApplication from '../models/JobApplication.js';

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
      user.hourlyRate = req.body.hourlyRate !== undefined ? req.body.hourlyRate : user.hourlyRate;
      user.professionalSummary = req.body.professionalSummary || user.professionalSummary;

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
          bio: updatedUser.bio,
          hourlyRate: updatedUser.hourlyRate,
          professionalSummary: updatedUser.professionalSummary
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
    
    // Always exclude admin users from the list
    filter.userType = { $ne: 'admin' };
    
    if (userType && userType !== 'all') {
      // If a specific userType is requested, make sure it's not admin
      if (userType !== 'admin') {
        filter.userType = userType;
      }
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

    // Get statistics (excluding admin users)
    const stats = {
      total: totalUsers,
      freelancers: await User.countDocuments({ userType: 'freelancer' }),
      clients: await User.countDocuments({ userType: 'client' }),
      universityStaff: await User.countDocuments({ userType: 'universityStaff' }),
      active: await User.countDocuments({ userType: { $ne: 'admin' }, status: 'active' }),
      suspended: await User.countDocuments({ userType: { $ne: 'admin' }, status: 'suspended' })
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

export const getWalletBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ walletBalance: user.walletBalance || 0 });
  } catch (error) {
    res.status(500).json({ walletBalance: 0 });
  }
};

// @desc    Export freelancer wallet statement as PDF
// @route   GET /api/users/wallet/statement
// @access  Private (Freelancer)
export const exportWalletStatement = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('firstName lastName userType walletBalance');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.userType !== 'freelancer') {
      return res.status(403).json({ success: false, message: 'Only freelancers can export wallet statements' });
    }

    // Optional date range filtering via query params
    const { startDate, endDate } = req.query;
    const dateFilter = { freelancerId: userId, paymentStatus: 'Paid' };
    if (startDate || endDate) {
      dateFilter['paymentDetails.paidAt'] = {};
      if (startDate) dateFilter['paymentDetails.paidAt'].$gte = new Date(startDate);
      if (endDate) {
        // include entire end day
        const end = new Date(endDate);
        end.setHours(23,59,59,999);
        dateFilter['paymentDetails.paidAt'].$lte = end;
      }
    }

    const orders = await Order.find(dateFilter)
      .populate('serviceId', 'title')
      .sort({ 'paymentDetails.paidAt': 1 });

    // Aggregate totals per service category (if service has category field) & overall
    let totalEarnings = 0;
    const rows = orders.map(o => {
      const paidAt = o.paymentDetails?.paidAt ? new Date(o.paymentDetails.paidAt) : o.createdAt;
      const amount = Number(o.paymentDetails?.freelancerAmount || 0);
      totalEarnings += amount;
      return {
        date: paidAt.toISOString().split('T')[0],
        service: o.serviceId?.title || 'Service',
        orderId: o._id.toString().slice(-8),
        package: o.selectedPackage,
        amount
      };
    });

    // Generate PDF using pdfkit similar to staff report style
    const PDFDocument = (await import('pdfkit')).default;
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const fileName = `wallet-statement-${new Date().toISOString().split('T')[0]}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    doc.pipe(res);

    // Header
    doc.fontSize(18).text('Wallet Statement', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Freelancer: ${user.firstName || ''} ${user.lastName || ''}`);
    doc.text(`Generated: ${new Date().toLocaleString()}`);
    if (startDate || endDate) {
      doc.text(`Range: ${startDate || 'Beginning'} to ${endDate || 'Today'}`);
    }
    doc.moveDown(0.5);
    doc.text(`Current Wallet Balance: ${Number(user.walletBalance || 0).toFixed(2)}`);
    doc.text(`Total Earnings in Period: ${totalEarnings.toFixed(2)}`);
    doc.moveDown(1);

    // Table header
    const colX = { date: 40, service: 110, order: 300, pkg: 380, amount: 450 };
    doc.fontSize(11).font('Helvetica-Bold');
    doc.text('Date', colX.date, doc.y);
    doc.text('Service', colX.service, doc.y);
    doc.text('Order', colX.order, doc.y);
    doc.text('Pkg', colX.pkg, doc.y);
    doc.text('Amount', colX.amount, doc.y, { align: 'left' });
    doc.moveDown(0.3);
    doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.2);
    doc.font('Helvetica');

    rows.forEach(r => {
      const startY = doc.y;
      doc.text(r.date, colX.date, startY);
      doc.text(r.service, colX.service, startY, { width: 180 });
      doc.text(r.orderId, colX.order, startY);
      doc.text(r.package, colX.pkg, startY);
      doc.text(r.amount.toFixed(2), colX.amount, startY);
      doc.moveDown(0.2);
      // Add simple pagination check
      if (doc.y > 760) {
        doc.addPage();
        doc.font('Helvetica-Bold');
        doc.text('Date', colX.date, doc.y);
        doc.text('Service', colX.service, doc.y);
        doc.text('Order', colX.order, doc.y);
        doc.text('Pkg', colX.pkg, doc.y);
        doc.text('Amount', colX.amount, doc.y);
        doc.moveDown(0.3);
        doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.2);
        doc.font('Helvetica');
      }
    });

    if (rows.length === 0) {
      doc.text('No paid transactions in this period.', 40, doc.y + 10);
    }

    doc.end();
  } catch (error) {
    console.error('Wallet statement export error:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Failed to generate wallet statement PDF' });
    }
  }
};

// Get client dashboard statistics
export const getClientDashboardStats = async (req, res) => {
  try {
    const clientId = req.user._id;

    // Get posts statistics
    const postsStats = await Post.aggregate([
      { $match: { clientId: clientId } },
      {
        $group: {
          _id: null,
          totalPosts: { $sum: 1 },
          activePosts: {
            $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] }
          },
          completedPosts: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
          },
          totalBudget: { $sum: '$budget' }
        }
      }
    ]);

    // Get orders statistics
    const ordersStats = await Order.aggregate([
      { $match: { clientId: clientId } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          activeOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] }
          },
          completedOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
          },
          totalSpent: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Get applications statistics
    const applicationsStats = await JobApplication.aggregate([
      { $match: { clientId: clientId } },
      {
        $group: {
          _id: null,
          totalApplications: { $sum: 1 },
          pendingApplications: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
          },
          acceptedApplications: {
            $sum: { $cond: [{ $eq: ['$status', 'Accepted'] }, 1, 0] }
          },
          declinedApplications: {
            $sum: { $cond: [{ $eq: ['$status', 'Declined'] }, 1, 0] }
          }
        }
      }
    ]);

    // Get recent projects (last 5 posts)
    const recentProjects = await Post.find({ clientId: clientId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status budget createdAt');

    // Get recent applications (last 5)
    const recentApplications = await JobApplication.find({ clientId: clientId })
      .populate('freelancerId', 'firstName lastName professionalTitle')
      .populate('postId', 'title')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('status createdAt');

    // Get top freelancers (based on rating and completed projects)
    const topFreelancers = await User.aggregate([
      { $match: { userType: 'freelancer' } },
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'freelancerId',
          as: 'orders'
        }
      },
      {
        $addFields: {
          completedProjects: {
            $size: {
              $filter: {
                input: '$orders',
                cond: { $eq: ['$$this.status', 'Completed'] }
              }
            }
          },
          totalEarnings: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: '$orders',
                    cond: { $eq: ['$$this.status', 'Completed'] }
                  }
                },
                as: 'order',
                in: '$$order.totalAmount'
              }
            }
          }
        }
      },
      { $sort: { completedProjects: -1, totalEarnings: -1 } },
      { $limit: 4 },
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          university: 1,
          skills: 1,
          hourlyRate: 1,
          profileImage: 1,
          completedProjects: 1,
          totalEarnings: 1,
          rating: { $literal: 4.5 } // Default rating since it's not in the model
        }
      }
    ]);

    const stats = {
      posts: postsStats[0] || {
        totalPosts: 0,
        activePosts: 0,
        completedPosts: 0,
        totalBudget: 0
      },
      orders: ordersStats[0] || {
        totalOrders: 0,
        activeOrders: 0,
        completedOrders: 0,
        totalSpent: 0
      },
      applications: applicationsStats[0] || {
        totalApplications: 0,
        pendingApplications: 0,
        acceptedApplications: 0,
        declinedApplications: 0
      },
      recentProjects,
      recentApplications,
      topFreelancers
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching client dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
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
  deleteUser,
  getClientDashboardStats,
  getWalletBalance,
  exportWalletStatement
};
