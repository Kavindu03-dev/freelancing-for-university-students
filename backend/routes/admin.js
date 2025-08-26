import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getUserStats
} from '../controllers/adminController.js';
import { protect } from '../middleware/adminAuth.js';

const router = express.Router();

// All admin routes require authentication
router.use(protect);

// User management routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/users/stats', getUserStats);

export default router;
