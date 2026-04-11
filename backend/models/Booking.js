const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    timeSlot: { type: String },
    tickets: { type: Number, default: 1 },
    addOns: [{ type: String }],
    total: { type: Number, required: true },
    status: { type: String, enum: ['Confirmed', 'Pending', 'Cancelled'], default: 'Confirmed' },
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
