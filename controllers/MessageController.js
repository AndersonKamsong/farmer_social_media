// controllers/MessageController.js
const Message = require('../models/Message');

exports.createMessage = (req, res) => {
    const { receiverId, content } = req.body; // Expecting receiverId and content in the request body
    const senderId = req.user.id; // Assuming user ID is available in the request object (e.g., from authentication)
    console.log(req.body);
    Message.createMessage(senderId, receiverId, content, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Message sent successfully.', result: result });
    });
};

exports.getUserMessages = (req, res) => {
    const userId = req.user.id; // Assuming user ID is available in the request object
    Message.getMessages(userId, (err, messages) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(messages);
    });
};

//  get messages between two users
exports.getMessagesBetweenUsers = (req, res) => {
    const { userId } = req.params; // Expecting user IDs as route parameters
    let userId1 = req.user.id;
    let userId2 = userId
    console.log(userId1);
    console.log("userId2");
    console.log(userId2);
    Message.getMessagesBetweenUsers(userId1, userId2, (err, messages) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(messages);
    });
};