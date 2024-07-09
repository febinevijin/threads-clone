import express from 'express';
import {
  createPost,
  deletePost,
  getPost,
  getPostById,
  getUserPost,
  replyToPost,
  togglePostLike,
} from '../controller/postController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/feed', protect, getPost);
router.get('/user-post/:id', protect, getUserPost);
router.get('/:id', protect, getPostById);
router.post('/create', protect, createPost);
router.delete('/delete/:id', protect, deletePost);
router.put('/like/:id', protect, togglePostLike);
router.put('/reply/:id', protect, replyToPost);

export default router;
