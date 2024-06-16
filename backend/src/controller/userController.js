import { generateAPIError } from '../error/apiError.js';
import errorWrapper from '../middleware/errorWrapper.js';
import { userService } from '../service/userService.js';
import { responseUtils } from '../utils/responseUtils.js';

export const followUnFollowUser = errorWrapper(async (req, res, next) => {
  const { id } = req.params;
  if (!id) return next(generateAPIError('id should be provided', 400));
  const currentUserId = req.user._id;
  if (id === currentUserId)
    return next(
      generateAPIError('You are not allowed to follow/unfollow uourself', 400),
    );
  const data = await userService.followUnFollow(id, currentUserId, next);
  return responseUtils.success(res, {
    data,
    status: 200,
  });
});
