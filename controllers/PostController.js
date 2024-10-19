const Post = require('../models/Post');

// Create a new post
exports.createPost = (req, res) => {
    const { title, content, groupId } = req.body;
    console.log(req.body);
    const farmerId = req.user.id; // Extract farmer ID from JWT token
    Post.createPost(title, content, farmerId, groupId, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Post created successfully', postId: result.insertId });
    });
};

// Get all posts
exports.getAllPosts = (req, res) => {
    Post.getAllPosts((err, posts) => {
        if (err) return res.status(500).json({ error: err.message });
        // console.log(posts);
        res.status(200).json(posts);
    });
};
exports.getAllPostsAdmin = (req, res) => {
    Post.getAllPostsAdmin((err, posts) => {
        if (err) return res.status(500).json({ error: err.message });
        console.log(posts);
        res.status(200).json(posts);
    });
};
exports.blockPost = (req, res) => {
    const postId = req.params.id;
    console.log(postId);
    Post.blockPost(postId, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Post blocked successfully.' });
    });
};

exports.reactivatePost = (req, res) => {
    const postId = req.params.id;
    Post.reactivatePost(postId, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Post reactivated successfully.' });
    });
};
exports.getGroupPosts = (req, res) => {
    const groupId = req.params.groupId;
    Post.getAllGroupPosts(groupId, (err, posts) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(posts);
    });
};
exports.getAllCreatedPosts = (req, res) => {
    const userId = req.user.id;
    Post.getAllCreatedPosts(userId, (err, posts) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(posts);
    });
};
exports.getAllAllowedPosts = (req, res) => {
    Post.getAllAllowedPosts((err, posts) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(posts);
    });
};
exports.getPostsByUserId = (req, res) => {
    const userId = req.params.userId;

    Post.getPostsByUserId(userId, (err, posts) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching posts for the user' });
        }
        res.json(posts);
    });
};
// Get post by ID
exports.getPostById = (req, res) => {
    const postId = req.params.postId;
    Post.getPostById(postId, (err, post) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(post);
    });
};

// Update post
exports.updatePost = (req, res) => {
    const postId = req.params.postId;
    const { title, content } = req.body;
    Post.updatePost(postId, title, content, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Post updated successfully' });
    });
};

// Delete post
exports.deletePost = (req, res) => {
    const postId = req.params.postId;
    Post.deletePost(postId, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Post deleted successfully' });
    });
};

// Like a post
exports.likePost = (req, res) => {
    const postId = req.params.postId;
    const userId = req.user.id; // Extract user ID from JWT token

    Post.likePost(postId, userId, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Post liked successfully' });
    });
};
exports.dislikePost = (req, res) => {
    const postId = req.params.postId;
    const userId = req.user.id; // Extract user ID from JWT token

    Post.dislikePost(postId, userId, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error disliking post' });
        }
        res.status(200).json({ message: 'Post disliked successfully' });
    });
};
exports.getLikesForPost = (req, res) => {
    const postId = req.params.postId;

    Post.getLikesForPost(postId, (err, comments) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(comments);
    });
};
// Comment on a post
exports.commentOnPost = (req, res) => {
    const postId = req.params.postId;
    const userId = req.user.id; // Extract user ID from JWT token
    const { content } = req.body;
    console.log(req.body);
    Post.commentOnPost(postId, userId, content, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Comment added successfully' });
    });
};


// Get comments for a post
exports.getCommentsForPost = (req, res) => {
    const postId = req.params.postId;

    Post.getCommentsForPost(postId, (err, comments) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(comments);
    });
};

// Get like count for a post
exports.getLikeCountForPost = (req, res) => {
    const postId = req.params.postId;
    Post.getLikeCountForPost(postId, (err, likeCount) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ likeCount });
    });
};

// Get users who liked a post
exports.getUsersWhoLikedPost = (req, res) => {
    const postId = req.params.postId;
    Post.getUsersWhoLikedPost(postId, (err, users) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(users);
    });
};
