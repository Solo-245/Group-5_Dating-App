const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/api/chats', chatRoutes);
app.use('/api/chats', messageRoutes);

module.exports = app;