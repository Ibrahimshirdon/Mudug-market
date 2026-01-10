const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB Connection...');
console.log('URI:', process.env.MONGODB_URI ? 'Found' : 'Missing');

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log(`SUCCESS: Connected to host: ${mongoose.connection.host}`);
        process.exit(0);
    })
    .catch((err) => {
        console.error('FAILURE: Connection error:', err);
        process.exit(1);
    });
