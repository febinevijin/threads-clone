import express from 'express';
const router = express.Router();

router.get('/users', (req, res) => {
  res.send('hai');
});

export default router;
