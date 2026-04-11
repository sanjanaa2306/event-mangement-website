const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const User = require('../models/User');

// Get bookings for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const userBookings = await Booking.find({ userId: req.params.userId }).populate('eventId');
        res.json(userBookings);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Create a booking
router.post('/', async (req, res) => {
    try {
        const { userId, eventId, timeSlot, addOns, total, tickets } = req.body;
        
        // Validate event
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });

        // Validate seats
        const numTickets = parseInt(tickets) || 1;
        if (event.seats < numTickets) {
            return res.status(400).json({ message: "Not enough seats available" });
        }

        // Create booking
        const newBooking = new Booking({
            userId,
            eventId,
            timeSlot,
            tickets: numTickets,
            addOns: addOns || [],
            total: parseFloat(total),
            status: "Confirmed",
            timestamp: new Date()
        });
        
        await newBooking.save();

        // Decrement seats and save event
        event.seats -= numTickets;
        await event.save();
        
        // Add points for gamification (50 points per ticket)
        const pointsToAdd = 50 * numTickets;
        await User.findByIdAndUpdate(userId, { $inc: { points: pointsToAdd } });

        res.status(201).json({ message: "Booking successful", booking: newBooking });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;
