const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    date: { type: String, required: true },
    time: { type: String, required: true },
    price: { type: Number, default: 0 },
    image: { type: String },
    mood: { type: String },
    category: { type: String },
    location: { type: String },
    food: { type: String },
    seats: { type: Number, required: true },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
