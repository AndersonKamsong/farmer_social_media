const express = require('express');
const UserController = require('../controllers/UserController');
const { authenticateJWT } = require('../middleware/auth');
const router = express.Router();

// Create an admin
router.post('/admin', authenticateJWT, UserController.createAdmin); // Only accessible by existing admins

// Register a user (farmer or normal user)
router.post('/register', UserController.registerUser);

// Login user
router.post('/login', UserController.loginUser);

// Get all users (admin access)
router.get('/',  UserController.getAllUsers); // Only accessible by admins

// Get all farmers (admin access)
router.get('/farmers', authenticateJWT, UserController.getAllFarmers); // Only accessible by admins

// Get user profile
router.get('/:userId', authenticateJWT, UserController.getUserProfile); // Accessible by user and admin
router.get('/:userId/followers', authenticateJWT, UserController.getFollowersForUser); // Accessible by user and admin

// Update user profile
router.put('/profile', authenticateJWT, UserController.updateUserProfile); // Accessible by user

// Follow a farmer
router.post('/:farmerId/follow',authenticateJWT, UserController.followFarmer); // Requires authentication

// Unfollow a farmer
router.delete('/:farmerId/unfollow',authenticateJWT, UserController.unfollowFarmer); // Requires authentication

// Get followers of a farmer
router.get('/:farmerId/followers', UserController.getFollowers); // Accessible by all users

// Get farmers that a user is following
router.get('/following', UserController.getFollowing); // Requires authentication

// Check if a user is following a farmer
router.get('/:farmerId/is-following', UserController.checkIfFollowing); // Requires authentication
// Block a user
router.get('/block/:id', UserController.blockUser);

// Reactivate a user
router.get('/reactivate/:id', UserController.reactivateUser);

module.exports = router;
