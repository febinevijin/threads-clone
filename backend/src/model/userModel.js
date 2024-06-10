import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minLength: 6,
      required: true,
    },
    profilePic: {
      type: String,
      default: '',
    },
    following: {
      type: [String],
      default: [],
    },
    followers: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
);

const User = mongoose.model('users', userSchema);

export default User;
