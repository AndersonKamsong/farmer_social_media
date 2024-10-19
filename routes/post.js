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

router.get('/:id/list', PostController.getAllPostsAdmin);

// Get post by ID
router.get('/:postId', PostController.getPostById); // Accessible by all users

// Update post
router.put('/:postId', authenticateJWT, PostController.updatePost); // Accessible by farmers

// Delete post
router.delete('/:postId', authenticateJWT, PostController.deletePost); // Accessible by farmers

// Like a post
router.post('/:postId/like', authenticateJWT, PostController.likePost); // Accessible by all users
router.get('/:postId/likes', PostController.getLikesForPost); // Accessible by all users

router.post('/:postId/dislike', authenticateJWT, PostController.dislikePost); // Accessible by all users

// Comment on a post
router.post('/:postId/comment', authenticateJWT, PostController.commentOnPost); // Accessible by all users
router.get('/user/:userId/posts', PostController.getPostsByUserId);
// Get comments for a post
router.get('/:postId/comments', PostController.getCommentsForPost); // Accessible by all users

// Get like count for a post
router.get('/:postId/like-count', PostController.getLikeCountForPost); // Accessible by all users

// Get users who liked a post
router.get('/:postId/users-who-liked', PostController.getUsersWhoLikedPost); // Accessible by all users
// Block a post
// router.put('/block/:postId', authenticateJWT, PostController.blockPost);

// Reactivate a blocked post
// router.put('/reactivate/:postId', authenticateJWT, PostController.reactivatePost);
// Get all posts for admin

// Block a post
router.put('/block/:id', PostController.blockPost);

// Reactivate a post
router.put('/reactivate/:id', PostController.reactivatePost);
module.exports = router;
