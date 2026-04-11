const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
    try {
        const sortedLeaderboard = await User.find()
            .select('name avatar points')
            .sort({ points: -1 })
            .limit(10);
        
        // Map to match the previous frontend structure if necessary
        const results = sortedLeaderboard.map(u => ({
            userId: u._id,
            points: u.points,
            name: u.name,
            avatar: u.avatar
        }));
            
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Get user badges and progress
router.get('/badges/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const points = user.points || 0;
        
        // Logic for badges based on points
        const badges = [];
        if (points >= 50) badges.push({ name: "Bronze Novice", icon: "🥉", color: "#CD7F32" });
        if (points >= 150) badges.push({ name: "Silver Participant", icon: "🥈", color: "#C0C0C0" });
        if (points >= 300) badges.push({ name: "Gold Event Goer", icon: "🥇", color: "#FFD700" });

        const nextTier = points < 50 ? 50 : points < 150 ? 150 : points < 300 ? 300 : 500;
        const progress = Math.min((points / nextTier) * 100, 100);

        res.json({
            points,
            badges,
            progressToNextTier: progress
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;
