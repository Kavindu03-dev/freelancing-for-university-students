import express from 'express';
import clientController from '../controllers/clientController.js';
import auth from '../middleware/auth.js';
import imgbbUpload from '../middleware/imgbbUpload.js';

const router = express.Router();

// @route   GET /api/client/profile
// @desc    Get client profile
// @access  Private
router.get('/profile', auth.protect, clientController.getClientProfile);

// @route   PUT /api/client/profile
// @desc    Update client profile
// @access  Private
router.put('/profile', auth.protect, clientController.updateClientProfile);

// @route   DELETE /api/client/account
// @desc    Delete client account
// @access  Private
router.delete('/account', auth.protect, clientController.deleteAccount);

// @route   POST /api/client/profile-image
// @desc    Upload profile image
// @access  Private
router.post('/profile-image', auth.protect, imgbbUpload.single('profileImage'), clientController.uploadProfileImage);

// @route   DELETE /api/client/profile-image
// @desc    Remove profile image
// @access  Private
router.delete('/profile-image', auth.protect, clientController.removeProfileImage);

export default router;
