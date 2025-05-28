const express = require('express');
const http = require('http');
require('dotenv').config();
const PORT = process.env.PORT || 3456
const connectToDB = require('./db.js');

const { Server } = require('socket.io');
const setupSocket = require('./sockets/socket');

const router = require('./routes/user.router.js');
const authMiddleware = require('./middlewares/authMiddleware.js');

const app = express(); // ✅ Define app BEFORE using it

const server = http.createServer(app); // ✅ Now it's safe to use
const io = new Server(server, { cors: { origin: '*' } });

setupSocket(io);

connectToDB().then(() => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/api/user', router);

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  // These lines seem to have errors — fix module names if needed
  // e.g., chatRouter instead of chat.router.js (which is a syntax error)
  // Ensure you import and use the correct routers
  const chatRouter = require('./routes/chat.router.js');
  const messageRouter = require('./routes/message.router.js');
  const userRouter = require('./routes/user.router.js');

  app.use('/api/chats', authMiddleware, chatRouter);
  app.use('/api/messages', authMiddleware, messageRouter);
  app.use('/api/users', userRouter);

  server.listen(PORT, () => {
    console.log(`🚀 Server is listening on PORT: http://localhost:${PORT}`);
  });
});
