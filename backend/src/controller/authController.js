import { generateAPIError } from '../error/apiError.js';
import errorWrapper from '../middleware/errorWrapper.js';
import { authService } from '../service/authService.js';
import { userSignUpValidation } from '../validator/signUpValidation.js';
import { responseUtils } from '../utils/responseUtils.js';

export const signUpUser = errorWrapper(async (req, res, next) => {
  const { error } = userSignUpValidation.validate(req.body);
  if (error) {
    return next(generateAPIError(error.details[0].message, 400));
    //   return res.status(400).json({ error: error.details[0].message });
  }
  const data = await authService.signUpUser(req.body, next);
  return responseUtils.success(res, {
    data,
    status: 200,
  });
});
