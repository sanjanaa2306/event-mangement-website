require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('../models/Event');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/event-db';

// Targeted fixes for music events with reliable Unsplash photo IDs
const fixes = [
    { title: "Summer Music Festival",  image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80" },
    { title: "Deep House Rooftop",     image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80" },
    { title: "Classic Jazz Night",      image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&q=80" },
];

async function fix() {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected. Patching music event images...');
    for (const { title, image } of fixes) {
        const result = await Event.updateOne({ title }, { $set: { image } });
        console.log(result.matchedCount > 0 ? `✅ Fixed: ${title}` : `⚠️  Not found: ${title}`);
    }
    console.log('Done!');
    process.exit(0);
}

fix().catch(err => { console.error(err); process.exit(1); });
