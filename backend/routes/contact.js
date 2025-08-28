import express from 'express';
import {
  submitContactMessage,
  getAllContactMessages,
  getContactMessage,
  replyToMessage,
  updateMessageStatus,
  getContactStats,
  getUserContactMessages,
  userReplyToMessage
} from '../controllers/contactController.js';
import { protect as auth } from '../middleware/auth.js';
import { protect as adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

// Public route - submit contact message (optional auth)
router.post('/submit', submitContactMessage);

// User routes - require user authentication
router.get('/user/messages', auth, getUserContactMessages);
router.post('/user/messages/:id/reply', auth, userReplyToMessage);

// Admin routes - require admin authentication
router.get('/admin/messages', adminAuth, getAllContactMessages);
router.get('/admin/messages/:id', adminAuth, getContactMessage);
router.post('/admin/messages/:id/reply', adminAuth, replyToMessage);
router.patch('/admin/messages/:id/status', adminAuth, updateMessageStatus);
router.get('/admin/stats', adminAuth, getContactStats);

export default router;
