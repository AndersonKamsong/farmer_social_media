const db = require('../config/db');

// Create a new group
exports.createGroup = (name, description, farmerId, callback) => {
    const query = 'INSERT INTO groups (name, description, created_by) VALUES (?, ?, ?)';
    db.query(query, [name, description, farmerId], (error, result) => {
        if (error) return callback(error);
        callback(null, result);
    });
};

// Get all groups
exports.getAllGroups = (callback) => {
    const query = 'SELECT g.id, g.name, g.description, g.created_by, u.name AS farmer_name FROM groups g JOIN users u ON g.created_by = u.id';
    db.query(query, (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

exports.getAllCreatedGroups = (userId, callback) => {
    const query = `SELECT g.id, g.name, g.description, g.created_by, 
    u.name AS farmer_name FROM groups g 
    JOIN users u ON g.created_by = u.id where g.created_by = ${userId}`;
    db.query(query, (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};
// Get group by ID
// exports.getGroupById = (groupId, callback) => {
//     const query = 'SELECT * FROM groups WHERE id = ?';
//     db.query(query, [groupId], (err, results) => {
//         if (err || results.length === 0) {
//             return callback(err || 'Group not found');
//         }
//         callback(null, results[0]);
//     });
// };
exports.getGroupById = (groupId, callback) => {
    const query = `
        SELECT g.*, u.id AS memberId, u.name AS memberName ,gm.role as role
        FROM groups g
        LEFT JOIN group_membership gm ON g.id = gm.group_id
        LEFT JOIN users u ON gm.user_id = u.id
        WHERE g.id = ?
    `;
    
    db.query(query, [groupId], (err, results) => {
        if (err || results.length === 0) {
            return callback(err || 'Group not found');
        }

        // Format results to include members in a structured way
        const group = {
            id: results[0].id,
            name: results[0].name,
            description: results[0].description,
            members: results.map(result => ({
                id: result.memberId,
                name: result.memberName,
                role: result.role
            })).filter(member => member.id) // Filter out any null members
        };

        callback(null, group);
    });
};


// Update group
exports.updateGroup = (groupId, name, description, callback) => {
    const query = 'UPDATE groups SET name = ?, description = ? WHERE id = ?';
    db.query(query, [name, description, groupId], (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};

// Delete group
exports.deleteGroup = (groupId, callback) => {
    const query = 'DELETE FROM groups WHERE id = ?';
    db.query(query, [groupId], (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};

// Add post to group
exports.addPostToGroup = (groupId, postId, callback) => {
    const query = 'INSERT INTO group_posts (group_id, post_id) VALUES (?, ?)';
    db.query(query, [groupId, postId], (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};

// Get posts from a group
exports.getPostsFromGroup = (groupId, callback) => {
    const query = `
        SELECT p.id, p.title, p.content, p.created_at 
        FROM posts p 
        JOIN groups gp ON p.id = gp.id 
        WHERE p.group_id = ?
    `;
    db.query(query, [groupId], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};
