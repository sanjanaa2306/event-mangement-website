require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/event-db';

// Database Connection
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log(MONGODB_URI);
        console.log('✅ MongoDB Connected');
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Import Routes
const authRoutes = require('./routes/auth');
const eventsRoutes = require('./routes/events');
const bookingsRoutes = require('./routes/bookings');
const moodRoutes = require('./routes/mood');
const gamificationRoutes = require('./routes/gamification');
const networkingRoutes = require('./routes/networking');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/networking', networkingRoutes);
app.use('/api/seed', require('./routes/seed'));

// Root
app.get('/', (req, res) => {
    res.send('Event Management API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
