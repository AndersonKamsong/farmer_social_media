const AdminAction = require('../models/AdminAction');


// Create a new admin action
exports.createAdminAction = (req, res) => {
    const { actionType, targetUserId, postId } = req.body; // Assuming these come from the request body
    const adminId = req.user.id; // Assuming req.user is set by authentication middleware
    AdminAction.createAdminAction(adminId, actionType, targetUserId, postId, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Admin action logged successfully.' });
    });
};

// Get all actions performed by a specific admin
exports.getActionsByAdmin = (req, res) => {
    const adminId = req.user.id; // Assuming req.user is set by authentication middleware
    AdminAction.getActionsByAdmin(adminId, (err, actions) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(actions);
    });
};

// Get all actions related to a specific user
exports.getActionsByUser = (req, res) => {
    const userId = req.params.userId;
    AdminAction.getActionsByUser(userId, (err, actions) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(actions);
    });
};

// Get all actions related to a specific post
exports.getActionsByPost = (req, res) => {
    const postId = req.params.postId;
    AdminAction.getActionsByPost(postId, (err, actions) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(actions);
    });
};
