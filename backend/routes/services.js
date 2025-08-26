import express from 'express';
import { protect } from '../middleware/auth.js';
import serviceController from '../controllers/serviceController.js';

const router = express.Router();

// Public routes
router.get('/', serviceController.getServices);
router.get('/:id', serviceController.getServiceById);
router.get('/freelancer/:id', serviceController.getServicesByFreelancer);

// Protected routes
<<<<<<< HEAD
router.post('/', protect, serviceController.createService);
router.put('/:id', protect, serviceController.updateService);
router.delete('/:id', protect, serviceController.deleteService);
router.post('/:id/reviews', protect, serviceController.addReview);
=======
router.post('/', auth.protect, serviceController.createService);
router.put('/:id', auth.protect, serviceController.updateService);
router.delete('/:id', auth.protect, serviceController.deleteService);
router.post('/:id/reviews', auth.protect, serviceController.addReview);
>>>>>>> parent of 55105d7 (gig)

// Admin routes
router.get('/admin/pending', protect, serviceController.getPendingServices);
router.put('/:id/status', protect, serviceController.updateServiceStatus);

export default router;
