const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register User (farmer, normal user)
router.post('/register', (req, res) => {
    const { name, email, password, role } = req.body;
    User.createUser(name, email, password, role, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'User created successfully' });
    });
});

// Login User
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    User.authenticateUser(email, password, (err, user) => {
        if (err) return res.status(400).json({ error: err });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    });
});

module.exports = router;
