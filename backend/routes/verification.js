import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getStaffMembers,
  createVerificationRequest,
  getStaffVerificationRequests,
  respondToVerificationRequest,
  getVerificationStatus
} from '../controllers/verificationController.js';

const router = express.Router();

// @route   GET /api/verification/staff
// @desc    Get all staff members
// @access  Private
router.get('/staff', protect, getStaffMembers);

// @route   POST /api/verification/request
// @desc    Create verification request
// @access  Private
router.post('/request', protect, createVerificationRequest);

// @route   GET /api/verification/staff/requests
// @desc    Get verification requests for staff
// @access  Private (Staff only)
router.get('/staff/requests', protect, getStaffVerificationRequests);

// @route   PUT /api/verification/request/:id/respond
// @desc    Respond to verification request
// @access  Private (Staff only)
router.put('/request/:id/respond', protect, respondToVerificationRequest);

// @route   GET /api/verification/status
// @desc    Get freelancer's verification status
// @access  Private
router.get('/status', protect, getVerificationStatus);

export default router;
