const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET_KEY = process.env.JWT_SECRET || "event_management_secret";

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        
        const newUser = await User.create({ name, email, password, badges: [] });
        
        const token = jwt.sign({ id: newUser._id, name: newUser.name }, SECRET_KEY, { expiresIn: '1h' });
        res.status(201).json({ message: "Registration successful", token, user: { id: newUser._id, name: newUser.name } });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        const token = jwt.sign({ id: user._id, name: user.name }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ message: "Login successful", token, user: { id: user._id, name: user.name, avatar: user.avatar } });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;
