const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Get all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Get event by ID
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Create new event
router.post('/', async (req, res) => {
    try {
        const { title, description, date, time, price, image, mood, category, location, food, seats } = req.body;
        const newEvent = new Event({
            title,
            description,
            date,
            time,
            price: parseFloat(price),
            image: image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
            mood,
            category,
            location,
            food,
            seats: parseInt(seats)
        });
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;
