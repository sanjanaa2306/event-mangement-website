require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/event-db';

console.log('--- Connecting to Database... ---');

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('\x1b[32m%s\x1b[0m', '✅ MongoDB Connected Successfully!');
        console.log('Target:', MONGODB_URI.includes('cluster') ? 'MongoDB Atlas (Cloud)' : 'Local MongoDB');
        process.exit(0);
    })
    .catch(err => {
        console.error('\x1b[31m%s\x1b[0m', '❌ Connection Failed!');
        console.error(err.message);
        process.exit(1);
    });
