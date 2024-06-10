import mongoose from 'mongoose';
import { ObjectId } from '../utils/mongoUtils.js';

const postSchema = mongoose.Schema(
  {
    postedBy: {
      type: ObjectId,
      ref: 'users',
      required: true,
    },
    text: {
      type: String,
      maxLength: 500,
    },
    img: {
      type: String,
    },
    likes: {
      // array of user ids
      type: [ObjectId],
      ref: 'users',
      default: [],
    },
    replies: [
      {
        userId: {
          type: ObjectId,
          ref: 'users',
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        userProfilePic: {
          type: String,
        },
        username: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Post = mongoose.model('posts', postSchema);

export default Post;
