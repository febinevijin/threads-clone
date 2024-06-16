import express from 'express';
import { followUnFollowUser } from '../controller/userController.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();

router.put('/follow/:id', protect, followUnFollowUser);

export default router;
