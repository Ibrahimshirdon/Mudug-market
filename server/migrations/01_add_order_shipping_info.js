require('dotenv').config({ path: './server/.env' }); // Adjust path if needed, or just .env if running from root
const db = require('../config/db');

async function migrate() {
    try {
        console.log('Running migration: Add shipping_address and phone to orders table...');

        // Add shipping_address column
        try {
            await db.execute(`
                ALTER TABLE orders 
                ADD COLUMN shipping_address JSON;
            `);
            console.log('Added shipping_address column.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('shipping_address column already exists.');
            } else {
                throw err;
            }
        }

        // Add phone column
        try {
            await db.execute(`
                ALTER TABLE orders 
                ADD COLUMN phone VARCHAR(20);
            `);
            console.log('Added phone column.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('phone column already exists.');
            } else {
                throw err;
            }
        }

        console.log('Migration successful!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
