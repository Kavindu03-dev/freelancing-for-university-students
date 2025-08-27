import express from 'express';
import { 
  getAllResources, 
  getResourcesByCategory, 
  getFeaturedResources,
  getResourceStats,
  searchResources,
  getResourceById,
  getAllResourcesForAdmin,
  createResource, 
  updateResource, 
  deleteResource,
  restoreResource,
  permanentlyDeleteResource
} from '../controllers/resourceController.js';
import { authenticateAdmin, authenticateStaff } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllResources);
router.get('/category/:category', getResourcesByCategory);
router.get('/featured', getFeaturedResources);
router.get('/stats', getResourceStats);
router.get('/search', searchResources);

// Admin routes
router.get('/admin/all', authenticateAdmin, getAllResourcesForAdmin);
router.post('/', authenticateAdmin, createResource);
router.put('/:id', authenticateAdmin, updateResource);
router.delete('/:id', authenticateAdmin, deleteResource);
router.put('/:id/restore', authenticateAdmin, restoreResource);
router.delete('/:id/permanent', authenticateAdmin, permanentlyDeleteResource);

// Staff routes
router.get('/staff/all', authenticateStaff, getAllResourcesForAdmin);
router.post('/staff', authenticateStaff, createResource);
router.put('/staff/:id', authenticateStaff, updateResource);
router.delete('/staff/:id', authenticateStaff, deleteResource);
router.delete('/staff/:id/permanent', authenticateStaff, permanentlyDeleteResource);

// Dynamic routes (must be last)
router.get('/:id', getResourceById);

export default router;
