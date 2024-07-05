import express from 'express';
import { protect } from '../middleware/auth.js';
import { getConversations, getMessages, sendMessage } from '../controller/messageController.js';

const router = express.Router();

router.post('/', protect,sendMessage);
router.get('/conversations', protect, getConversations);
router.get('/:otherUserId', protect,getMessages);


export default router;
