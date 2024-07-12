import express from 'express';
import {
  followUnFollowUser,
  getProfile,
  postPageProfile,
  updateUserProfile,
  getSuggestedUsers,
  freezeAccount,
  searchUsers,
} from '../controller/userController.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();

router.put('/follow/:id', protect, followUnFollowUser);
router.get('/profile', protect, getProfile);
router.get('/suggested', protect, getSuggestedUsers);
router.get('/search', protect, searchUsers);
// for ost page
router.get('/post-page/:id', protect, postPageProfile);
router.put('/update/:id', protect, updateUserProfile);
router.put('/freeze/', protect, freezeAccount);

export default router;
