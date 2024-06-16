import { generateAPIError } from '../error/apiError.js';
import User from '../model/userModel.js';

const getUserDetailsById = async (id, next) => {
  if (!id) return next(generateAPIError('must pass user _id', 400));
  const user = await User.findById(id).select(
    '-password -following -followers',
  );
  if (!user) return next(generateAPIError('user not found', 400));
  return user;
};

export const commonUserService = {
  getUserDetailsById,
};
