const User = require('../models/User');
const jwt = require('jsonwebtoken');
const db = require('../config/db');


// Create an admin
exports.createAdmin = (req, res) => {
    const { name, email, password } = req.body;
    User.createAdmin(name, email, password, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Admin created successfully' });
    });
};

// Register a user (farmer or normal user)
exports.registerUser = (req, res) => {
    const { name, email, password, role } = req.body;
    User.createUser(name, email, password, role, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'User registered successfully' });
    });
};

// Login user
exports.loginUser = (req, res) => {
    const { email, password } = req.body;
    User.authenticateUser(email, password, (err, user) => {
        if (err) return res.status(400).json({ error: err });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '90h' });
        res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
    });
};

// Get all users
exports.getAllUsers = (req, res) => {
    User.getAllUsers((err, users) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(users);
    });
};

// Get all farmers
exports.getAllFarmers = (req, res) => {
    User.getAllFarmers((err, farmers) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(farmers);
    });
};

// Get user profile
exports.getUserProfile = (req, res) => {
    const userId = req.params.userId;
    User.getUserById(userId, (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(user);
    });
};
exports.getFollowersForUser = (req, res) => {
    const userId = req.params.userId;
    User.getFollowersForUser(userId, (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(user);
    });
};
// Update user profile
exports.updateUserProfile = (req, res) => {
    const userId = req.user.id; // Extract from JWT token
    const { name, email, bio } = req.body;
    User.updateUserProfile(userId, name, email, bio, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'User profile updated successfully' });
    });
};

// Follow a farmer
exports.followFarmer = (req, res) => {
    const followerId = req.user.id; // Assuming req.user is set by authentication middleware
    const followedId = req.params.farmerId;
    User.followFarmer(followerId, followedId, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Successfully followed the farmer.' });
    });
};

// Unfollow a farmer
exports.unfollowFarmer = (req, res) => {
    const followerId = req.user.id;
    const followedId = req.params.farmerId;
    User.unfollowFarmer(followerId, followedId, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Successfully unfollowed the farmer.' });
    });
};

// Get followers of a farmer
exports.getFollowers = (req, res) => {
    const farmerId = req.params.farmerId;
    User.getFollowers(farmerId, (err, followers) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(followers);
    });
};

// Get farmers that a user is following
exports.getFollowing = (req, res) => {
    const userId = req.user.id;
    User.getFollowing(userId, (err, following) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(following);
    });
};

// Check if a user is following a farmer
exports.checkIfFollowing = (req, res) => {
    const followerId = req.user.id;
    const followedId = req.params.farmerId;
    User.isFollowing(followerId, followedId, (err, isFollowing) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ isFollowing });
    });
};


exports.blockUser = (req, res) => {
    const userId = req.params.id;
    console.log(userId);
    const query = 'UPDATE users SET isBlocked = true WHERE id = ?';
    db.query(query, [userId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'User blocked successfully.' });
    });
};

exports.reactivateUser = (req, res) => {
    const userId = req.params.id;
    console.log(userId);
    const query = 'UPDATE users SET isBlocked = false WHERE id = ?';
    db.query(query, [userId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'User reactivated successfully.' });
    });
};