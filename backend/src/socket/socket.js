import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import Message from '../model/messageModel.js';
import Conversation from '../model/conversationModel.js';


const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        method: ['GET','POST']
    }
});

export const getRecipientSocketId = (recipientId) => {
    return userSocketMap[recipientId]
}

const userSocketMap = {}; // userId: socketId
io.on('connection', (socket) => {
    console.log('user connected', socket.id);
    const userId = socket.handshake.query.userId;

    if (userId != undefined) userSocketMap[userId] = socket.id;
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    // unseen - seen
    socket.on('markMessagesAsSeen', async ({ conversationId, userId }) => {
      
      try {
        await Message.updateMany(
          { conversationId, seen: false },
          { $set: { seen: true } },
        );
        io.to(userSocketMap[userId]).emit('messagesSeen', {
          conversationId,
        });
          await Conversation.updateOne(
            { _id: conversationId },
            { $set: { 'lastMessage.seen': true } },
          );
      } catch (error) {
        console.log(error);
      }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        delete userSocketMap[userId];
         io.emit('getOnlineUsers', Object.keys(userSocketMap));
     })
})



export {io,server,app};