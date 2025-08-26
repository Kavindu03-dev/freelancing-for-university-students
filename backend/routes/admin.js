import express from 'express';
import adminController from '../controllers/adminController.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// All routes require admin authentication
router.use(adminAuth.protect);

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin)
router.get('/users', adminController.getAllUsers);

// @route   GET /api/admin/users/stats
// @desc    Get user statistics
// @access  Private (Admin)
router.get('/users/stats', adminController.getUserStats);

// @route   GET /api/admin/users/:id
// @desc    Get user by ID
// @access  Private (Admin)
router.get('/users/:id', adminController.getUserById);

// @route   PUT /api/admin/users/:id/status
// @desc    Update user status
// @access  Private (Admin)
router.put('/users/:id/status', adminController.updateUserStatus);

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private (Admin)
router.delete('/users/:id', adminController.deleteUser);

export default router;
