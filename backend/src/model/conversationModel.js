import mongoose from 'mongoose';
import { ObjectId } from '../utils/mongoUtils.js';

const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: ObjectId, ref: 'users' }],
    lastMessage: {
      text: String,
      sender: { type: ObjectId, ref: 'users' },
      seen: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true },
);

const Conversation = mongoose.model('conversations', conversationSchema);

export default Conversation;
