import express from 'express';
import {
  createPost,
  getAllPosts,
  getPostsByClient,
  getPostById,
  updatePost,
  deletePost,
  getPostStats,
  getPendingPosts,
  approvePost,
  rejectPost,
  adminDeletePost
} from '../controllers/postController.js';
import { protect } from '../middleware/auth.js';
import { protect as adminProtect } from '../middleware/adminAuth.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/', getAllPosts);

// Protected routes (authentication required)
router.use(protect);

// Client-specific routes (must come before :id route to avoid conflicts)
router.post('/', createPost);
router.get('/client/:clientId', getPostsByClient);
router.get('/client/:clientId/stats', getPostStats);

// Post management routes
router.get('/:id', getPostById);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

// Admin approval routes (require admin authentication)
router.get('/admin/pending', adminProtect, getPendingPosts);
router.put('/admin/:postId/approve', adminProtect, approvePost);
router.put('/admin/:postId/reject', adminProtect, rejectPost);
router.delete('/admin/:postId', adminProtect, adminDeletePost);

export default router;
