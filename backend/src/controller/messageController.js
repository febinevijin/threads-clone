import errorWrapper from '../middleware/errorWrapper.js';
import { messageService } from '../service/messageService.js';
import { responseUtils } from '../utils/responseUtils.js';

export const sendMessage = errorWrapper(async (req, res, next) => {
  const senderId = req.user._id;
  const data = await messageService.sendMessage(senderId, req.body, next);
  return responseUtils.success(res, {
    data,
    status: 200,
  });
});

export const getMessages = errorWrapper(async (req, res, next) => {
  const { otherUserId } = req.params;
  const userId = req.user._id;
  const data = await messageService.getMessages(userId, otherUserId, next);
  return responseUtils.success(res, {
    data,
    status: 200,
  });
});
export const getConversations = errorWrapper(async (req, res, next) => {
  const userId = req.user._id;
  const data = await messageService.getConversations(
    userId,
    next,
  );
  return responseUtils.success(res, {
    data,
    status: 200,
  });
});
