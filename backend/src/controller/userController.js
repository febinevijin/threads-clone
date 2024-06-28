import { generateAPIError } from '../error/apiError.js';
import errorWrapper from '../middleware/errorWrapper.js';
import { commonUserService, userService } from '../service/userService.js';
import { responseUtils } from '../utils/responseUtils.js';

export const followUnFollowUser = errorWrapper(async (req, res, next) => {
  const { id } = req.params;
  if (!id) return next(generateAPIError('id should be provided', 400));
  const currentUserId = req.user._id;
  if (id === currentUserId)
    return next(
      generateAPIError('You are not allowed to follow/unfollow yourself', 400),
    );
  const data = await userService.followUnFollow(id, currentUserId, next);
  return responseUtils.success(res, {
    data,
    status: 200,
  });
});

export const getProfile = errorWrapper(async (req, res, next) => {
  const userDetailsFlag = true;

  const data = await commonUserService.getUserDetailsById(
    req.user._id,
    userDetailsFlag,

    next,
  );
  return responseUtils.success(res, {
    data,
    status: 200,
  });
});
export const postPageProfile = errorWrapper(async (req, res, next) => {
  const { id } = req.params;
  if (!id) return next(generateAPIError('id should be provided', 400));

  const data = await userService.postPageProfile(req.user._id, id, next);
  return responseUtils.success(res, {
    data,
    status: 200,
  });
});

export const updateUserProfile = errorWrapper(async (req, res, next) => {
  const { id } = req.params;
  if (!id || id === undefined)
    return next(generateAPIError('id should be provided', 400));
  const data = await userService.updateUserProfile(id, req.body, next);
  return responseUtils.success(res, {
    data,
    status: 200,
  });
});
