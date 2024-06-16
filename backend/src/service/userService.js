import { generateAPIError } from '../error/apiError.js';
import User from '../model/userModel.js';
import mongoose from 'mongoose';

const getUserDetailsById = async (id, followerDetails = false, next) => {
  if (!id) {
    return next(generateAPIError('Must pass user _id', 400));
  }
  // Select fields based on followerDetails flag
  const fieldsToSelect = followerDetails
    ? '-password'
    : '-password -following -followers';
  // Find the user by id and select the required fields
  const user = await User.findById(id).select(fieldsToSelect);
  if (!user) return next(generateAPIError('user not found', 400));
  return user;
};

const followUnFollow = async (id, currentUserId, next) => {
  const userToModify = await getUserDetailsById(id, next);
  const followerDetails = true;
  const currentUser = await getUserDetailsById(
    currentUserId,
    followerDetails,
    next,
  );
  const isFollowing = currentUser.following.includes(id);
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const opts = { session, new: true };
    if (isFollowing) {
      await User.findByIdAndUpdate(
        id,
        {
          $pull: { followers: currentUserId },
        },
        opts,
      );
      await User.findByIdAndUpdate(
        currentUserId,
        {
          $pull: { following: id },
        },
        opts,
      );
      await session.commitTransaction();
      session.endSession();
      return {
        message: 'User unfollowed successfully',
      };
    } else {
      await User.findByIdAndUpdate(
        id,
        {
          $push: { followers: currentUserId },
        },
        opts,
      );
      await User.findByIdAndUpdate(
        currentUserId,
        {
          $push: { following: id },
        },
        opts,
      );
    }
    await session.commitTransaction();
    session.endSession();
    return {
      message: 'User followed successfully',
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(generateAPIError('unsuccessful transaction', 400));
  }
};

export const commonUserService = {
  getUserDetailsById,
};

export const userService = {
  followUnFollow,
};
