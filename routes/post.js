const express = require('express');
const PostController = require('../controllers/PostController');
const { authenticateJWT } = require('../middleware/auth');
const router = express.Router();

// Create a new post
router.post('/', authenticateJWT, PostController.createPost); // Accessible by farmers

// Get all posts
router.get('/', PostController.getAllPosts); // Accessible by all users
router.get('/group/:groupId', PostController.getGroupPosts); // Accessible by all users
router.get('/allowed', PostController.getAllAllowedPosts); // Accessible by all users
router.get('/created', authenticateJWT, PostController.getAllCreatedPosts); // Accessible by all users

// Get post by ID
router.get('/:postId', PostController.getPostById); // Accessible by all users

// Update post
router.put('/:postId', authenticateJWT, PostController.updatePost); // Accessible by farmers

// Delete post
router.delete('/:postId', authenticateJWT, PostController.deletePost); // Accessible by farmers

// Like a post
router.post('/:postId/like', authenticateJWT, PostController.likePost); // Accessible by all users

// Comment on a post
router.post('/:postId/comment', authenticateJWT, PostController.commentOnPost); // Accessible by all users

// Get comments for a post
router.get('/:postId/comments', PostController.getCommentsForPost); // Accessible by all users

// Get like count for a post
router.get('/:postId/like-count', PostController.getLikeCountForPost); // Accessible by all users

// Get users who liked a post
router.get('/:postId/users-who-liked', PostController.getUsersWhoLikedPost); // Accessible by all users

module.exports = router;
