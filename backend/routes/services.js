import express from 'express';
import { protect } from '../middleware/auth.js';
import serviceController from '../controllers/serviceController.js';
import upload from '../middleware/imgbbUpload.js';

const router = express.Router();

// Public routes - specific routes first to avoid conflicts
router.get('/freelancer/:id', serviceController.getServicesByFreelancer);
router.get('/admin/pending', protect, serviceController.getPendingServices);

// Generic routes
router.get('/', serviceController.getServices);
router.get('/:id', serviceController.getServiceById);

// Protected routes
router.post('/', protect, serviceController.createService);
router.post('/upload-images', protect, upload.array('images', 5), serviceController.uploadGigImages);
router.put('/:id', protect, serviceController.updateService);
router.delete('/:id', protect, serviceController.deleteService);
router.post('/:id/reviews', protect, serviceController.addReview);
router.put('/:id/status', protect, serviceController.updateServiceStatus);

export default router;
