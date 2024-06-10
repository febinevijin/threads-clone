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

const loginUser = async (loginData, next) => {
  const { userName, password } = loginData;
  const user = await User.findOne({ $text: { $search: userName } }).select(
    '_id password name email userName',
  );
  if (user && (await bcrypt.compare(password, user.password))) {
    // Destructure the user object to exclude the password field
    const { password, ...userWithoutPassword } = user.toObject();

    // Return the user object without the password field
    return userWithoutPassword;
  } else {
    return next(generateAPIError('Invalid username or password', 400));
  }
};

export const authService = {
  signUpUser,
  loginUser,
};
