import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getStudentAnalytics,
  getVerificationRequests,
  verifyStudent,
  exportAnalyticsPDF
} from '../controllers/staffController.js';

const router = express.Router();

// All staff routes require authentication
router.use(protect);

// Student analytics routes
router.get('/student-analytics', getStudentAnalytics);
router.get('/verification-requests', getVerificationRequests);
router.put('/verify-student/:id', verifyStudent);
router.get('/export-analytics', exportAnalyticsPDF);

export default router;
