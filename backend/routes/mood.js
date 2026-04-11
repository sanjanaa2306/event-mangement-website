const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Suggest events based on mood emoji
router.post('/recommend', async (req, res) => {
    try {
        const { mood } = req.body;
        if (!mood) return res.status(400).json({ message: "Mood emoji is required" });

        // Filter events matching mood.
        let recommended = await Event.find({ mood });
        
        if (recommended.length === 0) {
            // Fallback: return top 2 events
            recommended = await Event.find().limit(2);
        }
        
        res.json(recommended);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;
