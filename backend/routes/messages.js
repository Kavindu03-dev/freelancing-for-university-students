import express from 'express';
import { protect as authUser } from '../middleware/auth.js';
import { createOrGetConversation, listConversations, getMessages, sendMessage } from '../controllers/messageController.js';

const router = express.Router();

router.use(authUser);

router.post('/conversations', createOrGetConversation);
router.get('/conversations', listConversations);
router.get('/conversations/:conversationId/messages', getMessages);
router.post('/conversations/:conversationId/messages', sendMessage);

export default router;


