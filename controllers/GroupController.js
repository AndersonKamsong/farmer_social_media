const Group = require('../models/Group');
const GroupMembership = require('../models/GroupMembership');

// Create a new group
exports.createGroup = (req, res) => {
    const { name, description } = req.body;
    const farmerId = req.user.id; // Extract farmer ID from JWT token
    Group.createGroup(name, description, farmerId, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        let groupId = result.insertId
        GroupMembership.joinGroup(farmerId, groupId, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            GroupMembership.setMemberAsAdmin("admin", farmerId, groupId, (error, result) => {
                if (error) return res.status(500).json({ message: error.message });
                res.status(201).json({ message: 'Group created successfully', groupId: groupId });
            });
        });
    });
};

// Get all groups
exports.getAllGroups = (req, res) => {
    Group.getAllGroups((err, groups) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(groups);
    });
};

exports.getUserGroups = (req, res) => {
    const userId = req.params.userId; // Get userId from request parameters

    Group.getUserGroups(userId, (err, groups) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching user groups', error: err.message });
        }
        return res.status(200).json(groups);
    });
}
exports.getAllCreatedGroups = (req, res) => {
    console.log(req.user);
    const userId = req.user.id;
    Group.getAllCreatedGroups(userId, (err, groups) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(groups);
    });
};

// Get group by ID
exports.getGroupById = (req, res) => {
    const groupId = req.params.groupId;
    Group.getGroupById(groupId, (err, group) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(group);
    });
};

// Update group
exports.updateGroup = (req, res) => {
    const groupId = req.params.groupId;
    const { name, description } = req.body;
    Group.updateGroup(groupId, name, description, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Group updated successfully' });
    });
};

// Delete group
exports.deleteGroup = (req, res) => {
    const groupId = req.params.groupId;
    Group.deleteGroup(groupId, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Group deleted successfully' });
    });
};

// Add post to group
exports.addPostToGroup = (req, res) => {
    const { groupId, postId } = req.body;
    Group.addPostToGroup(groupId, postId, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Post added to group successfully' });
    });
};

// Get posts from group
exports.getPostsFromGroup = (req, res) => {
    const groupId = req.params.groupId;
    Group.getPostsFromGroup(groupId, (err, posts) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(posts);
    });
};
