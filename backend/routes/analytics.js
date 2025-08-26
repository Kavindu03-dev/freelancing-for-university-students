import express from 'express';
import { authenticateAdmin } from '../middleware/auth.js';
import {
  getUniversityAnalytics,
  getFacultyAnalytics,
  getCategoryAnalytics,
  getAnalyticsSummary
} from '../controllers/analyticsController.js';

const router = express.Router();

// All analytics routes require admin authentication
router.use(authenticateAdmin);

// Get university performance analytics
router.get('/university', getUniversityAnalytics);

// Get faculty performance analytics
router.get('/faculty', getFacultyAnalytics);

// Get category performance analytics
router.get('/category', getCategoryAnalytics);

// Get overall analytics summary
router.get('/summary', getAnalyticsSummary);

export default router;
