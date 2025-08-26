import express from 'express';
import userController from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
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

export default router;
