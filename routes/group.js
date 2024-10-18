const express = require('express');
const GroupController = require('../controllers/GroupController');
const { authenticateJWT } = require('../middleware/auth');
const router = express.Router();

// Create a new group
router.post('/', authenticateJWT, GroupController.createGroup); // Accessible by farmers

// Get all groups
router.get('/', GroupController.getAllGroups); // Accessible by all users
// Get all groups
router.get('/created',authenticateJWT, GroupController.getAllCreatedGroups); // Accessible by user connected
// Get group by ID
router.get('/:groupId', GroupController.getGroupById); // Accessible by all users
// Route to get all groups a user belongs to
router.get('/:userId/groups', GroupController.getUserGroups);
// Update group
router.put('/:groupId', authenticateJWT, GroupController.updateGroup); // Accessible by farmers

// Delete group
router.delete('/:groupId', authenticateJWT, GroupController.deleteGroup); // Accessible by farmers

// Add post to group
router.post('/add-post', authenticateJWT, GroupController.addPostToGroup); // Accessible by farmers

// Get posts from group
router.get('/:groupId/posts', GroupController.getPostsFromGroup); // Accessible by all users

module.exports = router;
