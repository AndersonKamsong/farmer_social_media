const Notification = require('../models/Notification')
// Create a notification
exports.createNotification = (req, res) => {
    const { userId, message } = req.body; // Assuming userId comes from the request body
    Notification.createNotification(userId, message, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Notification created successfully.' });
    });
};

// Get all notifications for a user
exports.getNotifications = (req, res) => {
    const userId = req.user.id; // Assuming req.user is set by authentication middleware
    Notification.getNotificationsByUser(userId, (err, notifications) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(notifications);
    });
};

// Mark notification as read
exports.markAsRead = (req, res) => {
    const notificationId = req.params.notificationId;
    Notification.markAsRead(notificationId, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Notification marked as read.' });
    });
};

// Delete a notification
exports.deleteNotification = (req, res) => {
    const notificationId = req.params.notificationId;
    Notification.deleteNotification(notificationId, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Notification deleted successfully.' });
    });
};
