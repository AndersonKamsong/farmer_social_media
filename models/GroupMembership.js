const db = require('../config/db');

// Join a group
exports.joinGroup = (userId, groupId, callback) => {
    const query = 'INSERT INTO group_membership (user_id, group_id) VALUES (?, ?)';
    db.query(query, [userId, groupId], (error, result) => {
        if (error) return callback(error);
        callback(null, result);
    });
};

// Leave a group
exports.leaveGroup = (userId, groupId, callback) => {
    const query = 'DELETE FROM group_membership WHERE user_id = ? AND group_id = ?';
    db.query(query, [userId, groupId], (error, result) => {
        if (error) return callback(error);
        callback(null, result);
    });
};

// Get all members of a group
exports.getGroupMembers = (groupId, callback) => {
    const query = `
        SELECT u.id, u.name, u.email 
        FROM group_membership gm 
        JOIN users u ON gm.user_id = u.id 
        WHERE gm.group_id = ?
    `;
    db.query(query, [groupId], (error, results) => {
        if (error) return callback(error);
        callback(null, results);
    });
};

// Check if user is a member of a group
exports.isUserMember = (userId, groupId, callback) => {
    const query = 'SELECT * FROM group_membership WHERE user_id = ? AND group_id = ?';
    db.query(query, [userId, groupId], (error, results) => {
        if (error) return callback(error);
        if (results.length > 0) {
            const isAdmin = results[0].role === 'admin';
            callback(null, { isMember: true, isAdmin });
        } else {
            callback(null, { isMember: false, isAdmin: false });
        }
        // callback(null, results.length > 0);
    });
};

// Set a member as admin
exports.setMemberAsAdmin = (role, userId, groupId, callback) => {
    const query = 'UPDATE group_membership SET role = ? WHERE user_id = ? AND group_id = ?';
    db.query(query, [role, userId, groupId], (error, result) => {
        if (error) return callback(error);
        console.log(result);
        callback(null, result);
    });
};

// Remove a member from the group
exports.removeMember = (userId, groupId, callback) => {
    const query = 'DELETE FROM group_membership WHERE user_id = ? AND group_id = ?';
    db.query(query, [userId, groupId], (error, result) => {
        if (error) return callback(error);
        callback(null, result);
    });
};