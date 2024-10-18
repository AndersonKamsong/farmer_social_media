const db = require('../config/db');

// Create a new notification
exports.createNotification = (userId, message, callback) => {
    const query = 'INSERT INTO notifications (user_id, message) VALUES (?, ?)';
    db.query(query, [userId, message], (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};

// Get all notifications for a user
exports.getNotificationsByUser = (userId, callback) => {
    const query = 'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC';
    db.query(query, [userId], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

// Mark notification as read
exports.markAsRead = (notificationId, callback) => {
    const query = 'UPDATE notifications SET is_read = TRUE WHERE id = ?';
    db.query(query, [notificationId], (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};

// Delete a notification
exports.deleteNotification = (notificationId, callback) => {
    const query = 'DELETE FROM notifications WHERE id = ?';
    db.query(query, [notificationId], (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};
