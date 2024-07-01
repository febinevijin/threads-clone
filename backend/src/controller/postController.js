import { generateAPIError } from '../error/apiError.js';
import errorWrapper from '../middleware/errorWrapper.js';
import { postService } from '../service/postService.js';
import { getPaginationOptions } from '../utils/paginationUtils.js';
import { responseUtils } from '../utils/responseUtils.js';
import {
  userPostValidation,
  userReplyValidation,
} from '../validator/postValidation.js';

export const getPost = errorWrapper(async (req, res, next) => {
  const paginationOptions = getPaginationOptions({
    limit: req.query?.limit,
    page: req.query?.page,
  });
  const options = {
    ...paginationOptions,
    sort: { createdAt: -1 },
  };
  const userId = req.user._id;
  const data = await postService.getPost(userId, { options }, next);
  return responseUtils.success(res, {
    data,
    status: 200,
  });
});
export const getPostById = errorWrapper(async (req, res, next) => {
  //  const paginationOptions = getPaginationOptions({
  //    limit: req.query?.limit,
  //    page: req.query?.page,
  //  });
  //  const options = {
  //    ...paginationOptions,
  //    sort: { createdAt: -1 },
  // };

  const id = req.params.id;
  const userId = req.user._id;
  if (!id) return next(generateAPIError('must provide post id', 400));
  const data = await postService.getPostById(id, userId, next);
  return responseUtils.success(res, {
    data,
    status: 200,
  });
});

export const getUserPost = errorWrapper(async (req, res, next) => {
  const userId = req.user._id;
  console.log(userId);
  const data = await postService.getUserPost(userId, next);
  return responseUtils.success(res, {
    data,
    status: 200,
  });
});

export const createPost = errorWrapper(async (req, res, next) => {
  // validate post data
  const { error } = userPostValidation.validate(req.body);
  if (error) {
    return next(generateAPIError(error.details[0].message, 400));
  }
  let userId = req.user._id;
  const data = await postService.createPost(req.body, userId, next);
  return responseUtils.success(res, {
    data,
    status: 200,
  });
});

export const deletePost = errorWrapper(async (req, res, next) => {
  const id = req.params.id;

  if (!id) return next(generateAPIError('must provide post id', 400));
  const data = await postService.deletePost(id, next);
  return responseUtils.success(res, {
    data,
    status: 200,
  });
});

export const togglePostLike = errorWrapper(async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.user._id;

  if (!postId) return next(generateAPIError('must provide post id', 400));
  const data = await postService.togglePostLike(postId, userId, next);
  return responseUtils.success(res, {
    data,
    status: 200,
  });
});

export const replyToPost = errorWrapper(async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.user._id;
  if (!postId) return next(generateAPIError('must provide post id', 400));

  // validate post data
  const { error } = userReplyValidation.validate(req.body);
  if (error) {
    return next(generateAPIError(error.details[0].message, 400));
  }
  const text = req.body.text;
  const data = await postService.replyToPost(text, postId, userId, next);
  return responseUtils.success(res, {
    data,
    status: 200,
  });
});
