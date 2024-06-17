import express from 'express';
import {
  followUnFollowUser,
  getProfile,
  updateUserProfile,
} from '../controller/userController.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();

router.put('/follow/:id', protect, followUnFollowUser);
router.get('/profile', protect, getProfile);
router.put('/update/:id', protect, updateUserProfile);

export default router;
