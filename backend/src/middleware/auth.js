import { generateAPIError } from '../error/apiError.js';
import { commonUserService } from '../service/userService.js';
import { verifyAccessKey } from '../utils/generateToken.js';
import errorWrapper from './errorWrapper.js';

export const protect = errorWrapper(async (req, res, next) => {
  const token = req.cookies.threadsUser;
  if (!token) return next(generateAPIError('Key unavailable', 401));
  const decodedToken = verifyAccessKey(token, process.env.JWT_SECRET);
  if (decodedToken) {
    let userName = null;
    let userDetailsFlag = false;
    const user = await commonUserService.getUserDetailsById(
      decodedToken.userId,
      userName,
      userDetailsFlag,
      next,
    );
     if (!user) return next(generateAPIError('unauthorized', 401));
    req.user = user;
    next();
  } else {
    return next(generateAPIError('unauthorized', 401));
  }
});
