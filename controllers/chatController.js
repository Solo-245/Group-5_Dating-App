const Chat = require('../models/Chat');
const User = require('../models/user');

exports.getChats = async (req, res) => {
  const chats = await Chat.find({ participants: req.user.id }).sort('-updatedAt');
  res.json(chats);
};

exports.createChat = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(req.user.id);
  if (!user.matches.includes(userId)) {
    return res.status(403).json({ message: 'You are not matched with this user.' });
  }

  let chat = await Chat.findOne({ participants: { $all: [req.user.id, userId] } });
  if (!chat) {
    chat = await Chat.create({ participants: [req.user.id, userId] });
  }
  res.json(chat);
};
