const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, chatController.getChats);
router.post('/:userId', authMiddleware, chatController.createChat);

module.exports = router;

