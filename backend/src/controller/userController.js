import errorWrapper from '../middleware/errorWrapper.js';

export const followUnFollowUser = errorWrapper(async (req, res) => {
  res.json({
    data: 'hi',
  });
});
