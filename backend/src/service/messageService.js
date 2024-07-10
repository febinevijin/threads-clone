import { generateAPIError } from '../error/apiError.js';
import Conversation from '../model/conversationModel.js';
import Message from '../model/messageModel.js';
import { getRecipientSocketId, io } from '../socket/socket.js';

const sendMessage = async (senderId, data, next) => {
  const { recipientId, message, img } = data;
  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, recipientId] },
  });
  if (!conversation) {
    conversation = new Conversation({
      participants: [senderId, recipientId],
      lastMessage: {
        text: message,
        sender: senderId,
      },
    });
    await conversation.save();
  }

  const newMessage = new Message({
    conversationId: conversation._id,
    sender: senderId,
    text: message,
    img: img || '',
  });

  await Promise.all([
    newMessage.save(),
    conversation.updateOne({
      lastMessage: {
        text: message,
        sender: senderId,
      },
    }),
  ]);

  const recipientSocketId = getRecipientSocketId(recipientId);
  if (recipientSocketId) {
    io.to(recipientSocketId).emit('newMessage', newMessage);
  }

  return newMessage;
};
const getMessages = async (userId, otherUserId, next) => {
  const conversation = await Conversation.findOne({
    participants: { $all: [userId, otherUserId] },
  });

  if (!conversation) {
    return next(generateAPIError('Conversation not found', 404));
  }

  const messages = await Message.find({
    conversationId: conversation._id,
  }).sort({ createdAt: 1 });

  return messages;
};
const getConversations = async (userId, next) => {
  const conversations = await Conversation.find({
    participants: userId,
  }).populate({
    path: 'participants',
    select: 'userName profilePic',
  });
  // need improvement in this code
  // remove the current user from the participants array
  conversations.forEach((conversation) => {
    conversation.participants = conversation.participants.filter(
      (participant) => participant._id.toString() !== userId.toString(),
    );
  });

  return conversations;
};

export const messageService = {
  sendMessage,
  getMessages,
  getConversations,
};
