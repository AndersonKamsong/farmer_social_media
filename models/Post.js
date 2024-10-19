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
exports.getPostsByUserId = (userId, callback) => {
    const query = `
        SELECT 
            p.id, 
            p.title, 
            p.content, 
            p.created_at, 
            g.name AS group_name,
            COUNT(DISTINCT l.id) AS total_likes,  -- Get total likes for each post
            COUNT(DISTINCT c.id) AS total_comments,  -- Get total comments for each post
            GROUP_CONCAT(DISTINCT l.user_id) AS liked_by_users -- Get a list of users who liked this post
        FROM 
            posts p
        LEFT JOIN 
            groups g ON p.group_id = g.id
        LEFT JOIN 
            likes l ON p.id = l.post_id
        LEFT JOIN 
            comments c ON p.id = c.post_id
        WHERE 
            p.created_by = ?  -- Get posts by a specific user
        GROUP BY 
            p.id
        ORDER BY 
            p.created_at DESC
    `;

    db.query(query, [userId], (err, results) => {
        if (err) return callback(err);
        
        // Convert the `liked_by_users` field from a comma-separated string to an array
        const updatedResults = results.map(post => ({
            ...post,
            liked_by_users: post.liked_by_users ? post.liked_by_users.split(',').map(Number) : []
        }));

        callback(null, updatedResults);
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
        SELECT 
            p.id, 
            p.title, 
            p.content, 
            p.created_at, 
            u.name AS farmer_name, 
            p.group_id,
            COUNT(l.user_id) AS total_likes,
            GROUP_CONCAT(DISTINCT u_likes.id) AS liked_by_users
        FROM 
            posts p 
        JOIN 
            users u ON p.created_by = u.id 
        LEFT JOIN 
            likes l ON p.id = l.post_id 
        LEFT JOIN 
            users u_likes ON l.user_id = u_likes.id
        WHERE 
            p.group_id = ${groupId}
        GROUP BY 
            p.id 
        ORDER BY 
            p.created_at DESC
    `;
    db.query(query, (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};
exports.getAllAllowedPosts = (callback) => {
    const query = `
        SELECT 
            p.id, 
            p.title, 
            p.content, 
            p.created_at, 
            u.name AS farmer_name, 
            p.group_id,
            COUNT(l.user_id) AS total_likes,
            GROUP_CONCAT(DISTINCT u_likes.id) AS liked_by_users
        FROM 
            posts p 
        JOIN 
            users u ON p.created_by = u.id 
        LEFT JOIN 
            likes l ON p.id = l.post_id 
        LEFT JOIN 
            users u_likes ON l.user_id = u_likes.id
        WHERE 
            p.status = 'allowed' 
        GROUP BY 
            p.id 
        ORDER BY 
            p.created_at DESC
    `;
    db.query(query, (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

// Get post by ID with user details, total likes, and list of users who liked the post
exports.getPostById = (postId, callback) => {
    const query = `
        SELECT 
            p.id, 
            p.title, 
            p.content, 
            p.created_at, 
            u.name AS farmer_name, 
            u.id AS farmer_id, 
            p.group_id,
            g.name AS group_name,  -- Group name
            g.description AS group_description,  -- Group description
            COUNT(DISTINCT l.user_id) AS total_likes,  -- Total unique likes for the post
            GROUP_CONCAT(DISTINCT u_likes.id) AS liked_by_users_ids,  -- Concatenate user IDs who liked the post
            GROUP_CONCAT(DISTINCT u_likes.name) AS liked_by_users_name  -- Concatenate user names who liked the post
        FROM 
            posts p 
        JOIN 
            users u ON p.created_by = u.id 
        LEFT JOIN 
            groups g ON p.group_id = g.id  -- Join with groups table to get group details
        LEFT JOIN 
            likes l ON p.id = l.post_id 
        LEFT JOIN 
            users u_likes ON l.user_id = u_likes.id
        WHERE 
            p.id = ?  -- Fetch by specific post ID
        GROUP BY 
            p.id
    `;

    db.query(query, [postId], (err, results) => {
        if (err || results.length === 0) {
            return callback(err || 'Post not found');
        }

        // Process liked_by_users to return an array of user IDs and names
        const post = {
            ...results[0],
            liked_by_users_ids: results[0].liked_by_users_ids ? results[0].liked_by_users_ids.split(',') : [],  // Split comma-separated user IDs into an array
            liked_by_users_name: results[0].liked_by_users_name ? results[0].liked_by_users_name.split(',') : []  // Split comma-separated user names into an array
        };

        // Add group details
        post.group_details = {
            id: post.group_id,
            name: post.group_name,
            description: post.group_description,
        };

        // Clean up the post object to remove redundant group_id and group_name fields
        delete post.group_id;
        delete post.group_name;
        delete post.group_description;

        callback(null, post);
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
// In your likes model file
exports.dislikePost = (postId, userId, callback) => {
    const query = 'DELETE FROM likes WHERE post_id = ? AND user_id = ?';
    db.query(query, [postId, userId], (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};

// Get likes for a post
exports.getLikesForPost = (postId, callback) => {
    const query = `
        SELECT l.id, l.created_at, u.id AS user_id, u.name AS user_name, u.email AS user_email
        FROM likes l
        JOIN users u ON l.user_id = u.id
        WHERE l.post_id = ?
    `;
    db.query(query, [postId], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
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
        SELECT c.id, c.content, c.created_at, u.name AS commenter_name , u.id AS commenter_id 
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
