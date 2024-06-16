import { generateAPIError } from '../error/apiError.js';
import { commonUserService } from '../service/userService.js';
import { verifyAccessKey } from '../utils/generateToken.js';
import errorWrapper from './errorWrapper.js';

export const protect = errorWrapper(async (req, res, next) => {
  const token = req.cookies.threadsUser;
  if (!token) return next(generateAPIError('Key unavailable', 401));
  const decodedToken = verifyAccessKey(token, process.env.JWT_SECRET);
  if (decodedToken) {
    const user = await commonUserService.getUserDetailsById(
      decodedToken.userId,
      next,
    );
    req.user = user;
    next();
  } else {
    return next(generateAPIError('unauthorized', 401));
  }
});
