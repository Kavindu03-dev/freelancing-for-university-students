import express from 'express';
import {
  placePostOrderStripe,
  verifyPostOrderStripePayment,
  getAllPostOrders,
  getPostOrderById,
  updatePostOrderStatus,
  cancelPostOrder
} from '../controllers/postOrderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Post order management routes
router.post('/stripe', placePostOrderStripe);
router.post('/verify', verifyPostOrderStripePayment);
router.get('/all', getAllPostOrders);
router.get('/:orderId', getPostOrderById);
router.put('/:orderId/status', updatePostOrderStatus);
router.delete('/:orderId', cancelPostOrder);

export default router;
