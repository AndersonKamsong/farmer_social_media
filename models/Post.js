const db = require('../config/db');

// Create a new post
exports.createPost = (title, content, farmerId, groupId, callback) => {
    const query = 'INSERT INTO posts (title, content, created_by, group_id) VALUES (?, ?, ?, ?)';
    db.query(query, [title, content, farmerId, groupId], (error, result) => {
        if (error) return callback(error);
        callback(null, result);
    });
};

// Get all posts
exports.getAllPosts = (callback) => {
    const query = `
        SELECT p.id, p.title, p.content, p.created_at, u.name AS farmer_name, p.group_id 
        FROM posts p 
        JOIN users u ON p.created_by = u.id 
        ORDER BY p.created_at DESC
    `;
    db.query(query, (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};
exports.getAllCreatedPosts = (userId, callback) => {
    const query = `
        SELECT p.id, p.title, p.content, p.created_at, u.name AS farmer_name, p.group_id 
        FROM posts p 
        JOIN users u ON p.created_by = u.id  where created_by = ${userId}
        ORDER BY p.created_at DESC
    `;
    db.query(query, (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};
exports.getAllGroupPosts = (groupId, callback) => {
    const query = `
        SELECT p.id, p.title, p.content, p.created_at, u.name AS farmer_name, p.group_id 
        FROM posts p 
        JOIN users u ON p.created_by = u.id  where group_id = ${groupId}
        ORDER BY p.created_at DESC
    `;
    db.query(query, (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};
exports.getAllAllowedPosts = (callback) => {
    const query = `
        SELECT p.id, p.title, p.content, p.created_at, u.name AS farmer_name, p.group_id 
        FROM posts p 
        JOIN users u ON p.created_by = u.id WHERE status = 'allowed' 
        ORDER BY p.created_at DESC
    `;
    db.query(query, (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};
// Get post by ID
exports.getPostById = (postId, callback) => {
    const query = 'SELECT * FROM posts WHERE id = ?';
    db.query(query, [postId], (err, results) => {
        if (err || results.length === 0) {
            return callback(err || 'Post not found');
        }
        callback(null, results[0]);
    });
};

// Update post
exports.updatePost = (postId, title, content, callback) => {
    const query = 'UPDATE posts SET title = ?, content = ? WHERE id = ?';
    db.query(query, [title, content, postId], (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};

// Delete post
exports.deletePost = (postId, callback) => {
    const query = 'DELETE FROM posts WHERE id = ?';
    db.query(query, [postId], (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};

// Like a post
exports.likePost = (postId, userId, callback) => {
    const query = 'INSERT INTO likes (post_id, user_id) VALUES (?, ?)';
    db.query(query, [postId, userId], (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};

// Unlike a post
exports.unlikePost = (postId, userId, callback) => {
    const query = 'DELETE FROM likes WHERE post_id = ? AND user_id = ?';
    db.query(query, [postId, userId], (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};

// Comment on a post
exports.commentOnPost = (postId, userId, content, callback) => {
    const query = 'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)';
    db.query(query, [postId, userId, content], (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};

// Get comments for a post
exports.getCommentsForPost = (postId, callback) => {
    const query = `
        SELECT c.id, c.content, c.created_at, u.name AS commenter_name 
        FROM comments c 
        JOIN users u ON c.user_id = u.id 
        WHERE c.post_id = ?
    `;
    db.query(query, [postId], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

// Get like count for a post
exports.getLikeCountForPost = (postId, callback) => {
    const query = 'SELECT COUNT(*) AS like_count FROM likes WHERE post_id = ?';
    db.query(query, [postId], (err, results) => {
        if (err) return callback(err);
        callback(null, results[0].like_count);
    });
};

// Get users who liked a post
exports.getUsersWhoLikedPost = (postId, callback) => {
    const query = `
        SELECT u.id, u.name 
        FROM likes l 
        JOIN users u ON l.user_id = u.id 
        WHERE l.post_id = ?
    `;
    db.query(query, [postId], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};
