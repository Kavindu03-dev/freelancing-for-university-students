import express from 'express';
import auth from '../middleware/auth.js';
import serviceController from '../controllers/serviceController.js';

const router = express.Router();

// Public routes
router.get('/', serviceController.getServices);
router.get('/:id', serviceController.getServiceById);
router.get('/freelancer/:id', serviceController.getServicesByFreelancer);

// Protected routes
router.post('/', auth.protect, serviceController.createService);
router.put('/:id', auth.protect, serviceController.updateService);
router.delete('/:id', auth.protect, serviceController.deleteService);
router.post('/:id/reviews', auth.protect, serviceController.addReview);

// Admin routes
router.get('/admin/pending', auth.protect, serviceController.getPendingServices);
router.put('/:id/status', auth.protect, serviceController.updateServiceStatus);

export default router;
