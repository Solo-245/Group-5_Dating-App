const Message = require('../models/Message');
const Chat = require('../models/Chat');

const setupSocket = (io) => {
  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    socket.join(userId);

    socket.on('sendMessage', async ({ chatId, senderId, receiverId, text }) => {
      const message = await Message.create({ chatId, sender: senderId, receiver: receiverId, text });
      await Chat.findByIdAndUpdate(chatId, { lastMessage: text, updatedAt: Date.now() });

      io.to(receiverId).emit('newMessage', message);
    });

    socket.on('disconnect', () => {
      socket.leave(userId);
    });
  });
};

module.exports = setupSocket;
