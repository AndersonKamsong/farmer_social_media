const express = require('express');
const router = express.Router();
const AdminActionController = require('../controllers/AdminActionController');

// Create a new admin action
router.post('/', AdminActionController.createAdminAction); // Requires authentication

// Get all actions performed by the logged-in admin
router.get('/admin/actions', AdminActionController.getActionsByAdmin); // Requires authentication

// Get all actions related to a specific user
router.get('/user/:userId/actions', AdminActionController.getActionsByUser); // Requires authentication

// Get all actions related to a specific post
router.get('/post/:postId/actions', AdminActionController.getActionsByPost); // Requires authentication

module.exports = router;
