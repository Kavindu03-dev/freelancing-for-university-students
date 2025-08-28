import JobApplication from '../models/JobApplication.js';
import Post from '../models/Post.js';
import User from '../models/User.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create a new job application
export const createJobApplication = async (req, res) => {
  try {
    const {
      postId,
      fullName,
      email,
      phoneNumber,
      professionalTitle,
      coverLetter,
      portfolioLink
    } = req.body;

    // Handle uploaded files
    const uploadedFiles = req.files || [];
    const attachments = uploadedFiles.map(file => ({
      fileName: file.originalname,
      fileUrl: `/uploads/job-applications/${file.filename}`,
      fileType: file.mimetype
    }));

    const freelancerId = req.user.id;

    // Validate required fields
    if (!postId || !fullName || !email || !professionalTitle || !coverLetter) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if post exists and is active
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Job post not found'
      });
    }

    if (post.status !== 'Active' || !post.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This job post is no longer accepting applications'
      });
    }

    // Check if the user is trying to apply to their own post
    if (post.clientId.toString() === freelancerId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot apply to your own job post'
      });
    }

    // Check if user has already applied for this post
    const existingApplication = await JobApplication.findOne({
      postId,
      freelancerId
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job post'
      });
    }

    // Create the job application
    const jobApplication = new JobApplication({
      postId,
      clientId: post.clientId,
      freelancerId,
      fullName,
      email,
      phoneNumber,
      professionalTitle,
      coverLetter,
      portfolioLink,
      attachments: attachments || [],
      paymentAmount: post.budget,
      paymentStatus: post.budget > 0 ? 'Pending' : 'Not Required'
    });

    await jobApplication.save();

    // Update the post's application count
    await Post.findByIdAndUpdate(postId, {
      $inc: { applications: 1 }
    });

    res.status(201).json({
      success: true,
      message: 'Job application submitted successfully',
      data: jobApplication
    });

  } catch (error) {
    console.error('Error creating job application:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get all applications for a specific job post (for clients)
export const getApplicationsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const clientId = req.user.id;

    // Check if the user is the client who posted the job
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Job post not found'
      });
    }

    if (post.clientId.toString() !== clientId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only the job poster can view applications'
      });
    }

    const applications = await JobApplication.find({ postId })
      .populate('freelancerId', 'firstName lastName email profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: applications
    });

  } catch (error) {
    console.error('Error fetching applications by post:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get all applications submitted by a freelancer
export const getApplicationsByFreelancer = async (req, res) => {
  try {
    const freelancerId = req.user.id;

    const applications = await JobApplication.find({ freelancerId })
      .populate('postId', 'title type category budget deadline location requiredSkills degreeField')
      .populate('clientId', 'firstName lastName email profileImage clientOrganization')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: applications
    });

  } catch (error) {
    console.error('Error fetching applications by freelancer:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get all applications received by a client
export const getApplicationsByClient = async (req, res) => {
  try {
    const clientId = req.user.id;

    const applications = await JobApplication.find({ clientId })
      .populate('postId', 'title type category budget deadline location requiredSkills degreeField')
      .populate('freelancerId', 'firstName lastName email profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: applications
    });

  } catch (error) {
    console.error('Error fetching applications by client:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update application status (accept/decline)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, feedback, interviewDetails } = req.body;
    const clientId = req.user.id;

    const application = await JobApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if the user is the client who posted the job
    if (application.clientId.toString() !== clientId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only the job poster can update application status'
      });
    }

    // Validate status transition
    const validTransitions = {
      'Pending': ['Under Review', 'Accepted', 'Declined'],
      'Under Review': ['Accepted', 'Declined'],
      'Accepted': ['Interview Scheduled', 'Hired', 'Rejected'],
      'Interview Scheduled': ['Hired', 'Rejected'],
      'Declined': ['Rejected']
    };

    if (!validTransitions[application.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition from ${application.status} to ${status}`
      });
    }

    // Update the application
    const updateData = {
      status,
      updatedAt: Date.now()
    };

    if (feedback) {
      updateData.clientFeedback = feedback;
    }

    if (interviewDetails && (status === 'Interview Scheduled' || status === 'Accepted')) {
      updateData.interviewDetails = interviewDetails;
    }

    if (status === 'Accepted' || status === 'Interview Scheduled' || status === 'Hired') {
      updateData.respondedAt = Date.now();
    }

    const updatedApplication = await JobApplication.findByIdAndUpdate(
      applicationId,
      updateData,
      { new: true }
    ).populate('freelancerId', 'firstName lastName email profileImage')
     .populate('postId', 'title type category budget deadline location');

    res.status(200).json({
      success: true,
      message: `Application ${status.toLowerCase()} successfully`,
      data: updatedApplication
    });

  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Schedule interview for accepted applications
export const scheduleInterview = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { scheduledDate, scheduledTime, location, notes, isOnline, meetingLink } = req.body;
    const clientId = req.user.id;

    const application = await JobApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if the user is the client who posted the job
    if (application.clientId.toString() !== clientId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only the job poster can schedule interviews'
      });
    }

    // Check if application is accepted
    if (application.status !== 'Accepted') {
      return res.status(400).json({
        success: false,
        message: 'Can only schedule interviews for accepted applications'
      });
    }

    // Update the application with interview details
    const updatedApplication = await JobApplication.findByIdAndUpdate(
      applicationId,
      {
        status: 'Interview Scheduled',
        interviewDetails: {
          scheduledDate,
          scheduledTime,
          location,
          notes,
          isOnline,
          meetingLink
        },
        updatedAt: Date.now()
      },
      { new: true }
    ).populate('freelancerId', 'firstName lastName email profileImage')
     .populate('postId', 'title type category budget deadline location');

    res.status(200).json({
      success: true,
      message: 'Interview scheduled successfully',
      data: updatedApplication
    });

  } catch (error) {
    console.error('Error scheduling interview:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get a specific application by ID
export const getApplicationById = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.id;

    const application = await JobApplication.findById(applicationId)
      .populate('postId', 'title type category budget deadline location requiredSkills degreeField description')
      .populate('clientId', 'firstName lastName email profileImage clientOrganization')
      .populate('freelancerId', 'firstName lastName email profileImage');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if the user has access to this application
    if (application.freelancerId._id.toString() !== userId && 
        application.clientId._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });

  } catch (error) {
    console.error('Error fetching application by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete an application (only by the freelancer who submitted it)
export const deleteApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const freelancerId = req.user.id;

    const application = await JobApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if the user is the freelancer who submitted the application
    if (application.freelancerId.toString() !== freelancerId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only the applicant can delete their application'
      });
    }

    // Check if application can be deleted (only pending applications)
    if (application.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only delete pending applications'
      });
    }

    await JobApplication.findByIdAndDelete(applicationId);

    // Update the post's application count
    await Post.findByIdAndUpdate(application.postId, {
      $inc: { applications: -1 }
    });

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
