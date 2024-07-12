import { generateAPIError } from '../error/apiError.js';
import User from '../model/userModel.js';
import mongoose from 'mongoose';
import cloudinary from '../utils/cloudinary.js';

const getUserDetailsById = async (
  id,
  userName = null,
  userDetailsFlag = false,
  next,
) => {
  if (!id) {
    return next(generateAPIError('Must pass user _id', 400));
  }
  
  let user;

  if (userName && userName !== undefined && userName !==null) {
    user = await User.findOne({ $text: { $search: userName } }).select(
      '-password -following -followers',
    );
  } else {
    const fieldsToSelect = userDetailsFlag
      ? '-password'
      : '-password -following -followers';
    user = await User.findById(id).select(fieldsToSelect);
  }

  // console.log(user,'update part');

  if (!user) {
    return next(generateAPIError('User not found', 400));
  }

  return user;
};

const postPageProfile = async (userId, id, next) => {
  // console.log(id);
  const user = await User.findById(id).select('-password ');
  // console.log(user);
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
  // const userToModify = await getUserDetailsById(id, next);
  const userDetailsFlag = true;
  const userName = null;
  const currentUser = await getUserDetailsById(
    currentUserId,
    userName,
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
  const userNameForDetails = null;
  const checkUser = await getUserDetailsById(
    id,
    userNameForDetails,
    userDetailsFlag,
    next,
  );
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

const getSuggestedUsers = async (userId,next) => {
  // exclude the current user from suggested users array and exclude users that current user is already following
  // NEED UPDATION IN THIS QUERY
  const usersFollowedByYou = await User.findById(userId).select('following');
  const users = await User.aggregate([
    {
      $match: {
        _id: { $ne: userId },
      },
    },
    {
      $sample: { size: 10 },
    },
  ]);
  const filteredUsers = users.filter(
    (user) => !usersFollowedByYou.following.includes(user._id),
  );
  const suggestedUsers = filteredUsers.slice(0, 4);

  suggestedUsers.forEach((user) => (user.password = null));
  return suggestedUsers;
}

const freezeAccount = async (id, next) => {
  const user =await User.findById(id).select("-password -following -followers")
  if (!user) return next(generateAPIError("user not found", 404));
  user.isFrozen = true;
  await user.save();
  return {
    success: true,
    message: 'profile freezed',
  };
};

export const commonUserService = {
  getUserDetailsById,
};

export const userService = {
  followUnFollow,
  updateUserProfile,
  postPageProfile,
  getSuggestedUsers,
  freezeAccount,
};
