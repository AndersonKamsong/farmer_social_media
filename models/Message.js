// models/Message.js
const db = require('../config/db');

exports.createMessage = (senderId, receiverId, content, callback) => {
    const query = 'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)';
    db.query(query, [senderId, receiverId, content], (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};

exports.getMessagesBetweenUsers = (userId1, userId2, callback) => {
    const query = `
        SELECT * FROM messages 
        WHERE (sender_id = ? AND receiver_id = ?) 
            OR (sender_id = ? AND receiver_id = ?) 
        ORDER BY sent_at ASC
    `;
    db.query(query, [userId1, userId2, userId2, userId1], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

exports.getMessages = (userId, callback) => {
    const query = `
        SELECT * FROM messages 
        WHERE sender_id = ? OR receiver_id = ? 
        ORDER BY sent_at DESC
    `;
    db.query(query, [userId, userId], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};
