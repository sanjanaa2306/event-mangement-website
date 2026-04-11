const mongoose = require('mongoose');
const User = require('../models/User');
const Event = require('../models/Event');
const Match = require('../models/Match');
const Booking = require('../models/Booking');
const Message = require('../models/Message');
const dbRaw = require('../db');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/event-db';

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Event.deleteMany({});
        await Match.deleteMany({});
        await Booking.deleteMany({});
        await Message.deleteMany({});
        console.log('Cleared existing collections.');

        const userMap = {}; // oldId -> newId

        // 1. Seed Users (Expanded)
        console.log(`Seeding ${dbRaw.users.length} users...`);
        for (const u of dbRaw.users) {
            const newUser = await User.create({
                name: u.name,
                email: u.email || `${u.name.toLowerCase().replace(/ /g, '.')}@example.com`,
                password: u.password || "password123",
                profession: u.profession,
                interests: u.interests,
                goals: u.goals,
                avatar: u.avatar || `https://i.pravatar.cc/150?u=${u.id}`,
                badges: u.badges ? u.badges.map(b => (typeof b === 'string' ? { name: b, icon: '🏆', color: '#888' } : b)) : [],
                points: Math.floor(Math.random() * 500) + 50, // More points for impressive leaderboard
                privacy: u.privacy || { visibility: 'public' }
            });
            userMap[u.id] = newUser._id;
        }

        // Add 10 more random users
        for (let i = 26; i <= 35; i++) {
            const newUser = await User.create({
                name: `User ${i}`,
                email: `user${i}@example.com`,
                password: "password123",
                profession: ["Engineer", "Designer", "Founder", "Investor"][i % 4],
                interests: ["AI", "SaaS", "UX", "Music", "Fitness"].slice(0, 3),
                goals: ["Networking"],
                avatar: `https://i.pravatar.cc/150?u=${i}`,
                points: Math.floor(Math.random() * 200)
            });
            userMap[i] = newUser._id;
        }

        // 2. Patch Connections
        console.log('Mapping user connections...');
        for (const u of dbRaw.users) {
            if (u.connections && u.connections.length > 0) {
                const newConnections = u.connections.map(conn => ({
                    userId: userMap[conn.userId],
                    status: conn.status
                })).filter(conn => conn.userId);
                await User.findByIdAndUpdate(userMap[u.id], { connections: newConnections });
            }
        }

        // 3. Seed Events (Expanded)
        console.log(`Seeding events...`);
        const eventIds = [];
        const extraEvents = [
            { title: "Gourmet Food Tour", description: "A curated walking tour through the best eateries in the city.", category: "Food", mood: "😋", price: 65, location: "Downtown Markets", date: "2026-06-10", time: "12:00", seats: 25, food: "Everything included", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80" },
            { title: "Deep House Rooftop", description: "An electric night of deep house music with the city skyline as your backdrop.", category: "Music", mood: "💃", price: 30, location: "The Penthouse", date: "2026-06-14", time: "22:00", seats: 80, food: "Cocktails available", image: "https://images.unsplash.com/photo-1571266752075-9e7abfb4b82d?w=800&q=80" },
            { title: "Yoga at Sunrise", description: "Start your day with guided sunrise yoga on the ocean front.", category: "Wellness", mood: "🧘", price: 20, location: "Ocean Front", date: "2026-06-05", time: "06:30", seats: 20, food: "Herbal tea provided", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80" },
            { title: "Hackathon 48h", description: "48 hours of intense building. Form a team, ship a product, win prizes.", category: "Technology", mood: "💻", price: 0, location: "Tech Lab", date: "2026-07-04", time: "09:00", seats: 200, food: "Meals & snacks included", image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&q=80" },
            { title: "Classic Jazz Night", description: "An intimate evening of classic jazz performed by world-class musicians.", category: "Music", mood: "🎷", price: 40, location: "The Basement", date: "2026-05-28", time: "20:00", seats: 60, food: "Cocktail hour included", image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&q=80" }
        ];

        for (const e of [...dbRaw.events, ...extraEvents]) {
            const newEvent = await Event.create({
                title: e.title,
                description: e.description || `Special ${e.category} event featuring amazing guests and curated experiences.`,
                date: e.date || "2026-05-30",
                time: e.time || "18:00",
                price: e.price,
                image: e.image || `https://images.unsplash.com/photo-${Math.floor(Math.random()*1000000)}?w=800&q=80`,
                mood: e.mood,
                category: e.category,
                location: e.location || "City Center Venue",
                food: e.food || "Refreshments available",
                seats: e.seats || 100,
                attendees: (e.attendees || []).map(aId => userMap[aId]).filter(id => id)
            });
            eventIds.push(newEvent._id);
        }

        // 4. Seed Bookings for Sanja (User 1)
        console.log('Seeding sample bookings for main user...');
        const sanjaId = userMap[1];
        if (sanjaId) {
            for (let i = 0; i < 4; i++) {
                await Booking.create({
                    userId: sanjaId,
                    eventId: eventIds[i],
                    tickets: 1,
                    total: 50,
                    status: "Confirmed",
                    timestamp: new Date()
                });
            }
        }

        // 5. Seed Matches and Messages
        console.log('Seeding matches and messages...');
        const targets = [userMap[2], userMap[3], userMap[4]];
        for (const targetId of targets) {
            if (sanjaId && targetId) {
                const match = await Match.create({ users: [sanjaId, targetId] });
                await Message.create({
                    from: targetId,
                    to: sanjaId,
                    text: "Hey! Looking forward to meeting you at the Tech Conference!"
                });
                await Message.create({
                    from: sanjaId,
                    to: targetId,
                    text: "Me too! See you there."
                });
            }
        }

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
}

seed();
