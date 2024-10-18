const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/NotificationController');

// Create a notification
router.post('/', NotificationController.createNotification); // Requires authentication

// Get all notifications for the logged-in user
router.get('/', NotificationController.getNotifications); // Requires authentication

// Mark notification as read
router.put('/:notificationId/read', NotificationController.markAsRead); // Requires authentication

// Delete a notification
router.delete('/:notificationId', NotificationController.deleteNotification); // Requires authentication

module.exports = router;
