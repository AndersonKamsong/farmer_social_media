const express = require('express');
const GroupMembershipController = require('../controllers/GroupMembershipController');
const { authenticateJWT } = require('../middleware/auth');
const router = express.Router();

// Join a group
router.post('/join', authenticateJWT, GroupMembershipController.joinGroup); // Accessible by all users

// Leave a group
router.post('/leave', authenticateJWT, GroupMembershipController.leaveGroup); // Accessible by all users

// Get all members of a group
router.get('/:groupId/members', GroupMembershipController.getGroupMembers); // Accessible by all users

// Check if user is a member of a group
router.post('/is-member', authenticateJWT, GroupMembershipController.isUserMember); // Accessible by all users
// Set a member as admin
router.post('/set-admin', authenticateJWT, GroupMembershipController.setMemberAsAdmin); // Requires authentication

// Remove a member from a group
router.delete('/remove-member', authenticateJWT, GroupMembershipController.removeMember); // Requires authentication

module.exports = router;
