const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profession: { type: String },
    interests: [{ type: String }],
    goals: [{ type: String }],
    avatar: { type: String },
    badges: [{
        name: String,
        icon: String,
        color: String
    }],
    points: { type: Number, default: 0 },
    connections: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: { type: String, enum: ['accepted', 'skipped', 'saved', 'new'], default: 'new' }
    }],
    privacy: {
        visibility: { type: String, enum: ['public', 'event', 'ghost'], default: 'public' }
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
