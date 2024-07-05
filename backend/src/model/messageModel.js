import mongoose from 'mongoose';
import { ObjectId } from '../utils/mongoUtils.js';

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: ObjectId,
      ref: 'conversations',
    },
    sender: { type: ObjectId, ref: 'users' },
    text: String,
    seen: {
      type: Boolean,
      default: false,
    },
    img: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
);

const Message = mongoose.model('messages', messageSchema);

export default Message;
