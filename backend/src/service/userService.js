import { generateAPIError } from '../error/apiError.js';
import User from '../model/userModel.js';
import mongoose from 'mongoose';
import cloudinary from '../utils/cloudinary.js';

const getUserDetailsById = async (id, userDetailsFlag = false, next) => {
  if (!id) {
    return next(generateAPIError('Must pass user _id', 400));
  }
  // Select fields based on userDetailsFlag flag
  const fieldsToSelect = userDetailsFlag
    ? '-password'
    : '-password -following -followers';
  // Find the user by id and select the required fields
  const user = await User.findById(id).select(fieldsToSelect);
  if (!user) return next(generateAPIError('user not found', 400));
 
  return user

};

const postPageProfile = async (userId, id, next) => {
  console.log(id);
  const user = await User.findById(id).select('-password ');
  console.log(user);
  if (!user) return next(generateAPIError('user not found', 400));
  //  // Find the post user and check if the id is present in the following array
  const isFollow = await User.findOne({
    _id: userId,
    following: { $elemMatch: { $eq: id } },
  });
  // Convert the post document to a plain JavaScript object
  const userObject = user.toObject();
  if (isFollow) {
    return { ...userObject, isFollowing: true };
  } else {
    return { ...userObject, isFollowing: false };
  }
};

const followUnFollow = async (id, currentUserId, next) => {
  const userToModify = await getUserDetailsById(id, next);
  const userDetailsFlag = true;
  const currentUser = await getUserDetailsById(
    currentUserId,
    userDetailsFlag,
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

const updateUserProfile = async (id, userData, next) => {
  const { name, email, userName, bio } = userData;
  let { profilePic } = userData;
  const userDetailsFlag = true;
  const checkUser = await getUserDetailsById(id, userDetailsFlag, next);
  // check user exist with same email or userName
  const query = {
    $or: [{ email }, { userName }],
    _id: { $ne: checkUser._id },
  };

  const existingUser = await User.findOne(query).select('email userName');
  if (existingUser) {
    if (existingUser.email === email) {
      return next(generateAPIError('Email already exists', 400));
    }
    if (existingUser.userName === userName) {
      return next(generateAPIError('Username already exists', 400));
    }
  }

  // upload profile picture to cloudinary

  if (profilePic) {
    if (checkUser.profilePic) {
      await cloudinary.uploader.destroy(
        checkUser.profilePic.split('/').pop().split('.')[0],
      );
    }
    const uploadedResponse = await cloudinary.uploader.upload(profilePic);
    profilePic = uploadedResponse.secure_url;
  }
  // process.exit(1);
  // update profile
  const updateProfile = await User.findOneAndUpdate(
    { _id: checkUser._id },
    {
      $set: {
        name,
        email,
        userName,
        bio,
        profilePic,
      },
    },
    {
      new: true, // To return the updated document
      projection: 'name email userName bio profilePic', // To return only specified fields
    },
  );

  return {
    userData: updateProfile,
    message: 'profile updated',
  };
};

export const commonUserService = {
  getUserDetailsById,
};

export const userService = {
  followUnFollow,
  updateUserProfile,
  postPageProfile,
};
