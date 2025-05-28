const express = require('express');
const router = express.Router();
const { getMessages, sendMessage } = require('../controllers/messageController');
const authMiddleware = require('../middlewares/authMiddleware');


// Route to get messages for a specific chat
router.get('/:chatId', authMiddleware, getMessages);    
// Route to send a message in a specific chat
router.post('/:chatId', authMiddleware, sendMessage);

module.exports = router;


