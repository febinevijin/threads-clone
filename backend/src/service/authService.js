import { generateAPIError } from '../error/apiError.js';
import User from '../model/userModel.js';
import bcrypt from 'bcryptjs';

const signUpUser = async (userData, next) => {
  const { email, userName } = userData;
  const checkUserExists = await User.findOne({
    $or: [{ email }, { userName }],
  });
  if (checkUserExists)
    return next(generateAPIError('user already exists', 400));
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);
  userData.password = hashedPassword;
  const newUser = await User.create(userData);

  if (newUser) {
    return newUser;
  } else {
    return next(generateAPIError('invalid user data', 400));
  }
};

export const authService = {
  signUpUser,
};
