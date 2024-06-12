import { generateAPIError } from '../error/apiError.js';
import errorWrapper from '../middleware/errorWrapper.js';
import { authService } from '../service/authService.js';
import {
  userLoginValidation,
  userSignUpValidation,
} from '../validator/authValidation.js';
import { responseUtils } from '../utils/responseUtils.js';
import generateTokenAndSetCookies from '../utils/generateToken.js';

export const signUpUser = errorWrapper(async (req, res, next) => {
  // validate data
  const { error } = userSignUpValidation.validate(req.body);
  if (error) {
    return next(generateAPIError(error.details[0].message, 400));
  }
  // user creation
  const data = await authService.signUpUser(req.body, next);
  // create token and set up cookie
  generateTokenAndSetCookies(data._id, res);
  return responseUtils.success(res, {
    data,
    status: 200,
  });
});

export const loginUser = errorWrapper(async (req, res, next) => {
  // validate data
  const { error } = userLoginValidation.validate(req.body);
  if (error) {
    return next(generateAPIError(error.details[0].message, 400));
  }
  const data = await authService.loginUser(req.body, next);
  // create token and set up cookie
  generateTokenAndSetCookies(data._id, res);
  return responseUtils.success(res, {
    data,
    status: 200,
  });
});

export const logoutUser = errorWrapper(async (req, res) => {
  res.cookie('threadsUser', '', { maxAge: 1 });
  return responseUtils.success(res, {
    data: 'logout successful',
    status: 200,
  });
});
