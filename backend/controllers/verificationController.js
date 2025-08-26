import User from '../models/User.js';
import VerificationRequest from '../models/VerificationRequest.js';

// @desc    Get all staff members
// @route   GET /api/verification/staff
// @access  Private
const getStaffMembers = async (req, res) => {
  try {
    const staffMembers = await User.find({ 
      userType: 'universityStaff'
    }).select('firstName lastName email staffRole department');

    res.json({
      success: true,
      data: staffMembers
    });
  } catch (error) {
    console.error('Get staff members error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch staff members',
      error: error.message
    });
  }
};

// @desc    Create verification request
// @route   POST /api/verification/request
// @access  Private
const createVerificationRequest = async (req, res) => {
  try {
    const { staffId, requestMessage } = req.body;
    const freelancerId = req.user.id;

    // Check if freelancer already has a pending request
    const existingRequest = await VerificationRequest.findOne({
      freelancerId,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending verification request'
      });
    }

    // Verify staff member exists
    const staffMember = await User.findOne({
      _id: staffId,
      userType: 'universityStaff'
    });

    if (!staffMember) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    const verificationRequest = new VerificationRequest({
      freelancerId,
      staffId,
      requestMessage
    });

    await verificationRequest.save();

    res.status(201).json({
      success: true,
      message: 'Verification request submitted successfully',
      data: verificationRequest
    });
  } catch (error) {
    console.error('Create verification request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit verification request',
      error: error.message
    });
  }
};

// @desc    Get verification requests for staff
// @route   GET /api/verification/staff/requests
// @access  Private (Staff only)
const getStaffVerificationRequests = async (req, res) => {
  try {
    const staffId = req.user.id;

    const requests = await VerificationRequest.find({ staffId })
      .populate('freelancerId', 'firstName lastName email university degreeProgram gpa')
      .sort({ submittedAt: -1 });

    res.json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('Get staff verification requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch verification requests',
      error: error.message
    });
  }
};

// @desc    Respond to verification request
// @route   PUT /api/verification/request/:id/respond
// @access  Private (Staff only)
const respondToVerificationRequest = async (req, res) => {
  try {
    const { status, staffResponse } = req.body;
    const requestId = req.params.id;
    const staffId = req.user.id;

    const verificationRequest = await VerificationRequest.findById(requestId);

    if (!verificationRequest) {
      return res.status(404).json({
        success: false,
        message: 'Verification request not found'
      });
    }

    if (verificationRequest.staffId.toString() !== staffId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to respond to this request'
      });
    }

    if (verificationRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request has already been responded to'
      });
    }

    verificationRequest.status = status;
    verificationRequest.staffResponse = staffResponse;
    verificationRequest.respondedAt = new Date();

    await verificationRequest.save();

    // If approved, update user verification status
    if (status === 'approved') {
      await User.findByIdAndUpdate(verificationRequest.freelancerId, {
        isVerified: true
      });
    }

    res.json({
      success: true,
      message: `Verification request ${status} successfully`,
      data: verificationRequest
    });
  } catch (error) {
    console.error('Respond to verification request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to respond to verification request',
      error: error.message
    });
  }
};

// @desc    Get freelancer's verification status
// @route   GET /api/verification/status
// @access  Private
const getVerificationStatus = async (req, res) => {
  try {
    const freelancerId = req.user.id;

    const verificationRequest = await VerificationRequest.findOne({
      freelancerId
    }).sort({ submittedAt: -1 });

    const user = await User.findById(freelancerId).select('isVerified');

    res.json({
      success: true,
      data: {
        isVerified: user.isVerified,
        verificationRequest
      }
    });
  } catch (error) {
    console.error('Get verification status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch verification status',
      error: error.message
    });
  }
};

export {
  getStaffMembers,
  createVerificationRequest,
  getStaffVerificationRequests,
  respondToVerificationRequest,
  getVerificationStatus
};
