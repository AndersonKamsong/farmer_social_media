const bcrypt = require('bcryptjs');
const db = require('../config/db');

// Create a new user (farmer, normal user, or admin)
exports.createUser = (name, email, password, role, callback) => {
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return callback(err);
        }
        const query = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
        db.query(query, [name, email, hash, role], (error, result) => {
            if (error) return callback(error);
            callback(null, result);
        });
    });
};

// Authenticate user (login)
exports.authenticateUser = (email, password, callback) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err || results.length === 0) {
            return callback(err || 'User not found');
        }
        const user = results[0];
        bcrypt.compare(password, user.password, (error, isMatch) => {
            if (error || !isMatch) {
                return callback('Password incorrect');
            }
            callback(null, user);
        });
    });
};

// Create a new user (farmer or regular user)
exports.createUser = (name, email, password, role, callback) => {
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return callback(err);
        }
        const query = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
        db.query(query, [name, email, hash, role], (error, result) => {
            if (error) return callback(error);
            callback(null, result);
        });
    });
};

// Create an admin user
exports.createAdmin = (name, email, password, callback) => {
    this.createUser(name, email, password, 'admin', callback);
};

// Authenticate user (login)
exports.authenticateUser = (email, password, callback) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err || results.length === 0) {
            return callback(err || 'User not found');
        }
        const user = results[0];
        bcrypt.compare(password, user.password, (error, isMatch) => {
            if (error || !isMatch) {
                return callback('Password incorrect');
            }
            callback(null, user);
        });
    });
};

// Get all users
exports.getAllUsers = (callback) => {
    const query = 'SELECT id, name, email, role, is_certified, created_at FROM users';
    db.query(query, (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

// Get all farmers
exports.getAllFarmers = (callback) => {
    const query = 'SELECT id, name, email, is_certified, created_at FROM users WHERE role = "farmer"';
    db.query(query, (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

// Get user by ID
exports.getUserById = (userId, callback) => {
    const query = 'SELECT id, name, email, role, is_certified, bio, created_at FROM users WHERE id = ?';
    db.query(query, [userId], (err, results) => {
        if (err || results.length === 0) {
            return callback(err || 'User not found');
        }
        callback(null, results[0]);
    });
};

// Update user profile
exports.updateUserProfile = (userId, name, email, bio, callback) => {
    const query = 'UPDATE users SET name = ?, email = ?, bio = ? WHERE id = ?';
    db.query(query, [name, email, bio, userId], (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};

// Follow a farmer
exports.followFarmer = (followerId, followedId, callback) => {
    const query = 'INSERT INTO follows (follower_id, followed_id) VALUES (?, ?)';
    db.query(query, [followerId, followedId], (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};

// Unfollow a farmer
exports.unfollowFarmer = (followerId, followedId, callback) => {
    const query = 'DELETE FROM follows WHERE follower_id = ? AND followed_id = ?';
    db.query(query, [followerId, followedId], (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};

// Get followers of a farmer
exports.getFollowers = (farmerId, callback) => {
    const query = `
        SELECT u.id, u.name 
        FROM follows f 
        JOIN users u ON f.follower_id = u.id 
        WHERE f.followed_id = ?
    `;
    db.query(query, [farmerId], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

// Get farmers that a user is following
exports.getFollowing = (userId, callback) => {
    const query = `
        SELECT u.id, u.name 
        FROM follows f 
        JOIN users u ON f.followed_id = u.id 
        WHERE f.follower_id = ?
    `;
    db.query(query, [userId], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

// Check if a user is following a farmer
exports.isFollowing = (followerId, followedId, callback) => {
    const query = 'SELECT * FROM follows WHERE follower_id = ? AND followed_id = ?';
    db.query(query, [followerId, followedId], (err, results) => {
        if (err) return callback(err);
        callback(null, results.length > 0); // Returns true if following
    });
};
