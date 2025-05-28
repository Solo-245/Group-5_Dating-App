const Message = require('../models/Message');


exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await Message.find({ chatId }).sort('createdAt');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { receiverId, text } = req.body;

    const message = await Message.create({
      chatId,
      sender: req.user.id,
      receiver: receiverId,
      text,
    });

    res.json(message);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};

