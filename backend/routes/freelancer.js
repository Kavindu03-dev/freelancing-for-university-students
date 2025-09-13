import express from 'express';
import { protect } from '../middleware/auth.js';
import { getFreelancerOverview } from '../controllers/analyticsController.js';

const router = express.Router();

// Authenticated freelancer overview metrics
router.get('/overview', protect, getFreelancerOverview);

export default router;
