import express from 'express';
import { protect } from '../middleware/auth.js';
import serviceController from '../controllers/serviceController.js';

const router = express.Router();

// Public routes
router.get('/', serviceController.getServices);
router.get('/:id', serviceController.getServiceById);
router.get('/freelancer/:id', serviceController.getServicesByFreelancer);

// Protected routes
router.post('/', protect, serviceController.createService);
router.put('/:id', protect, serviceController.updateService);
router.delete('/:id', protect, serviceController.deleteService);
router.post('/:id/reviews', protect, serviceController.addReview);

// Admin routes
router.get('/admin/pending', protect, serviceController.getPendingServices);
router.put('/:id/status', protect, serviceController.updateServiceStatus);

export default router;
