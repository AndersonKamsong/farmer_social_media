const db = require('../config/db');

// Create a new admin action
exports.createAdminAction = (adminId, actionType, targetUserId, postId, callback) => {
    const query = `
        INSERT INTO admin_actions (admin_id, action_type, target_user_id, post_id) 
        VALUES (?, ?, ?, ?)
    `;
    db.query(query, [adminId, actionType, targetUserId, postId], (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};

// Get all actions performed by a specific admin
exports.getActionsByAdmin = (adminId, callback) => {
    const query = `
        SELECT * FROM admin_actions 
        WHERE admin_id = ? 
        ORDER BY created_at DESC
    `;
    db.query(query, [adminId], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

// Get all actions related to a specific user
exports.getActionsByUser = (userId, callback) => {
    const query = `
        SELECT * FROM admin_actions 
        WHERE target_user_id = ? 
        ORDER BY created_at DESC
    `;
    db.query(query, [userId], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

// Get all actions related to a specific post
exports.getActionsByPost = (postId, callback) => {
    const query = `
        SELECT * FROM admin_actions 
        WHERE post_id = ? 
        ORDER BY created_at DESC
    `;
    db.query(query, [postId], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};
