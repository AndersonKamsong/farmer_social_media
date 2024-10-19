// routes/messages.js
const express = require('express');
const router = express.Router();
const MessageController = require('../controllers/MessageController');
const { authenticateJWT } = require('../middleware/auth');

// Requires authentication middleware
router.post('/',authenticateJWT, MessageController.createMessage);
router.get('/', MessageController.getUserMessages); // Get messages for the logged-in user
router.get('/:userId', authenticateJWT, MessageController.getMessagesBetweenUsers);

module.exports = router;
