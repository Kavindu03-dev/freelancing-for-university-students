import express from 'express';
import {
  createJobApplication,
  getApplicationsByPost,
  getApplicationsByFreelancer,
  getApplicationsByClient,
  updateApplicationStatus,
  scheduleInterview,
  getApplicationById,
  deleteApplication
} from '../controllers/jobApplicationController.js';
import { protect } from '../middleware/auth.js';
import jobApplicationUpload from '../middleware/jobApplicationUpload.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Create a new job application with file uploads
router.post('/', jobApplicationUpload.array('attachments', 5), createJobApplication);

// Get applications for a specific job post (for clients)
router.get('/post/:postId', getApplicationsByPost);

// Get all applications submitted by the authenticated freelancer
router.get('/my-applications', getApplicationsByFreelancer);

// Get all applications received by the authenticated client
router.get('/received', getApplicationsByClient);

// Get a specific application by ID
router.get('/:applicationId', getApplicationById);

// Update application status (accept/decline)
router.patch('/:applicationId/status', updateApplicationStatus);

// Schedule interview for accepted applications
router.patch('/:applicationId/interview', scheduleInterview);

// Delete an application (only by the freelancer who submitted it)
router.delete('/:applicationId', deleteApplication);

export default router;
