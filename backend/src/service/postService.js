import { generateAPIError } from '../error/apiError.js';
import Post from '../model/postModel.js';
import User from '../model/userModel.js';
import cloudinary from '../utils/cloudinary.js';

const getPost = async (userId, options, next) => {
  const user = await User.findById(userId);
  if (!user) {
    return next(generateAPIError('user not found', 400));
  }
  const following = user.following;
  // const posts = await Post.find({ postedBy: { $in: following } }, {}, options);
  const posts = await Post.find(
    { postedBy: { $in: following } },
    {},
    options,
  ).populate('replies.userId', 'name userName profilePic');
  return posts;
};

const getPostById = async (id, userId, next) => {
  const post = await Post.findById(id).populate(
    'replies.userId',
    'name userName profilePic',
  );;
  if (!post) {
    return next(generateAPIError('post not found', 400));
  }
  return post;
};

const getUserPost = async ( userId, next) => {
  const post = await Post.find({ postedBy: userId })
    .sort({ createdAt: -1 })
    .populate('replies.userId', 'name userName profilePic');
  if (!post) {
    return next(generateAPIError('post not found', 400));
  }
  return post;
};

const createPost = async (postData, userId, next) => {
  let { text, img } = postData;
  if (img) {
    const uploadedResponse = await cloudinary.uploader.upload(img);
    img = uploadedResponse.secure_url;
  }
  const newPost = new Post({ postedBy: userId, text, img });
  await newPost.save();
  return newPost;
};

const deletePost = async (id, next) => {
  const post = await Post.findById(id);
  if (!post) {
    return next(generateAPIError('post not found', 400));
  }
  	if (post.img) {
      const imgId = post.img.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(imgId);
    }
  await Post.findByIdAndDelete(id);

  return { message: 'post deleted' };
};

const togglePostLike = async (postId, userId, next) => {
  const post = await Post.findById(postId);
  if (!post) {
    return next(generateAPIError('post not found', 400));
  }
  // check user liked the post
  const checkUserLikePost = post.likes.includes(userId);
  if (checkUserLikePost) {
    // unlike post
    await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
    return { message: 'post unliked successfully' };
  } else {
    // like post
    post.likes.push(userId);
    await post.save();
    return { message: 'post liked successfully' };
  }
};

const replyToPost = async (text, postId, userId, next) => {
  const post = await Post.findById(postId);
  if (!post) {
    return next(generateAPIError('post not found', 400));
  }
  const reply = { userId, text };
  post.replies.push(reply);
  await post.save();
  return { message: 'reply added successfully' };
};

export const postService = {
  createPost,
  getPost,
  getPostById,
  getUserPost,
  deletePost,
  togglePostLike,
  replyToPost,
};
