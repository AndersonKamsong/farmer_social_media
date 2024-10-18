const GroupMembership = require('../models/GroupMembership');

// Join a group
exports.joinGroup = (req, res) => {
    const userId = req.user.id; // Extract user ID from JWT token
    const { groupId } = req.body;

    GroupMembership.joinGroup(userId, groupId, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Successfully joined the group' });
    });
};

// Leave a group
exports.leaveGroup = (req, res) => {
    const userId = req.user.id; // Extract user ID from JWT token
    const { groupId } = req.body;

    GroupMembership.removeMember(userId, groupId, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Successfully left the group' });
    });
};

// Get all members of a group
exports.getGroupMembers = (req, res) => {
    const groupId = req.params.groupId;

    GroupMembership.getGroupMembers(groupId, (err, members) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(members);
    });
};

// Check if user is a member of a group
exports.isUserMember = (req, res) => {
    const userId = req.user.id; // Extract user ID from JWT token
    const { groupId } = req.body;
    console.log(req.body);

    GroupMembership.isUserMember(userId, groupId, (err, isMember) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(isMember);
    });
};


// Set a member as admin
exports.setMemberAsAdmin = (req, res) => {
    const { role, memberId, groupId } = req.body;
    console.log(req.body);
    // Check if the requester is an admin before allowing the action
    const requesterId = req.user.id; // Assuming you are using JWT and user ID is stored in req.user
    GroupMembership.isUserMember(requesterId, groupId, (err, membershipStatus) => {
        if (err) return res.status(500).json({ message: err.message });
        console.log("membershipStatus");
        console.log(membershipStatus);
        if (!membershipStatus.isAdmin) {
            return res.status(403).json({ message: 'You do not have permission to perform this action.' });
        }

        GroupMembership.setMemberAsAdmin(role, memberId, groupId, (error, result) => {
            if (error) return res.status(500).json({ message: error.message });
            // console.log(result);
            res.status(200).json({ message: 'Member promoted to admin' });
        });
    });
};

// Remove a member from the group
exports.removeMember = (req, res) => {
    const { memberId, groupId } = req.body;

    // Check if the requester is an admin before allowing the action
    const requesterId = req.user.id; // Assuming you are using JWT and user ID is stored in req.user
    GroupMembership.isUserMember(requesterId, groupId, (err, membershipStatus) => {
        if (err) return res.status(500).json({ message: err.message });

        if (!membershipStatus.isAdmin) {
            return res.status(403).json({ message: 'You do not have permission to perform this action.' });
        }

        GroupMembership.removeMember(memberId, groupId, (error, result) => {
            if (error) return res.status(500).json({ message: error.message });
            res.status(200).json({ message: 'Member removed from group' });
        });
    });
};
