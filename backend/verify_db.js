const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
console.log('Attempting to connect to:', uri.replace(/:([^:@]+)@/, ':****@')); // Hide password in logs

mongoose.connect(uri)
  .then(() => {
    console.log(`✅ SUCCESS: Connected to MongoDB!`);
    console.log(`   Host: ${mongoose.connection.host}`);
    console.log(`   Database: ${mongoose.connection.name}`);
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ ERROR: Could not connect to MongoDB');
    console.error(err);
    process.exit(1);
  });
