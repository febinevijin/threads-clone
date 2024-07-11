import express from 'express';
import {
  followUnFollowUser,
  getProfile,
  postPageProfile,
  updateUserProfile,
  getSuggestedUsers,
} from '../controller/userController.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();

router.put('/follow/:id', protect, followUnFollowUser);
router.get('/profile', protect, getProfile);
router.get('/suggested', protect, getSuggestedUsers);
// for ost page
router.get('/post-page/:id', protect, postPageProfile);
router.put('/update/:id', protect, updateUserProfile);

export default router;
