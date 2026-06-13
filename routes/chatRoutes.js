import express from 'express';
import {
  getConversations,
  getOrCreateConversation,
  getMessages,
  getUnreadCount,
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/conversations', protect, getConversations);
router.post('/conversations', protect, getOrCreateConversation);
router.get('/conversations/:id/messages', protect, getMessages);
router.get('/unread', protect, getUnreadCount);

export default router;
