import express from 'express';
import userController from '../controllers/userController.js';
import { getWalletBalance, exportWalletStatement } from '../controllers/userController.js';
import { protect, authenticateAdmin } from '../middleware/auth.js';
import imgbbUpload from '../middleware/imgbbUpload.js';

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, userController.getUserProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, userController.updateUserProfile);

// @route   DELETE /api/users/account
// @desc    Delete user account
// @access  Private
router.delete('/account', protect, userController.deleteAccount);

// @route   POST /api/users/profile-image
// @desc    Upload profile image
// @access  Private
router.post('/profile-image', protect, imgbbUpload.single('profileImage'), userController.uploadProfileImage);

// @route   DELETE /api/users/profile-image
// @desc    Remove profile image
// @access  Private
router.delete('/profile-image', protect, userController.removeProfileImage);

// @route   GET /api/users/dashboard/stats
// @desc    Get client dashboard statistics
// @access  Private
router.get('/dashboard/stats', protect, userController.getClientDashboardStats);

// @route   GET /api/users/wallet/balance
// @desc    Get authenticated user's wallet balance
// @access  Private
router.get('/wallet/balance', protect, getWalletBalance);

// @route   GET /api/users/wallet/statement
// @desc    Export freelancer wallet statement PDF (optional ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD)
// @access  Private (Freelancer)
router.get('/wallet/statement', protect, exportWalletStatement);

// @route   GET /api/users/admin/all
// @desc    Get all users (admin only)
// @access  Private (Admin only)
router.get('/admin/all', authenticateAdmin, userController.getAllUsers);

// @route   PUT /api/users/admin/:id/verify
// @desc    Verify user (admin only)
// @access  Private (Admin only)
router.put('/admin/:id/verify', authenticateAdmin, userController.verifyUser);

// @route   PUT /api/users/admin/:id/unverify
// @desc    Unverify user (admin only)
// @access  Private (Admin only)
router.put('/admin/:id/unverify', authenticateAdmin, userController.unverifyUser);

// @route   PUT /api/users/admin/:id/suspend
// @desc    Suspend user (admin only)
// @access  Private (Admin only)
router.put('/admin/:id/suspend', authenticateAdmin, userController.suspendUser);

// @route   PUT /api/users/admin/:id/activate
// @desc    Activate user (admin only)
// @access  Private (Admin only)
router.put('/admin/:id/activate', authenticateAdmin, userController.activateUser);

// @route   DELETE /api/users/admin/:id
// @desc    Delete user (admin only)
// @access  Private (Admin only)
router.delete('/admin/:id', authenticateAdmin, userController.deleteUser);

export default router;
