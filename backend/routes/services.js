const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createService,
  getServices,
  getServiceById,
  updateServiceStatus,
  getServicesByFreelancer,
  getPendingServices,
  updateService,
  deleteService,
  addReview
} = require('../controllers/serviceController');

// Public routes
router.get('/', getServices);
router.get('/:id', getServiceById);
router.get('/freelancer/:id', getServicesByFreelancer);

// Protected routes
router.post('/', protect, createService);
router.put('/:id', protect, updateService);
router.delete('/:id', protect, deleteService);
router.post('/:id/reviews', protect, addReview);

// Admin routes
router.get('/admin/pending', protect, getPendingServices);
router.put('/:id/status', protect, updateServiceStatus);

module.exports = router;
