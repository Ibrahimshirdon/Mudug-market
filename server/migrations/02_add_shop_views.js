const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

async function up() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected!');

        console.log('Adding views column to shops table...');

        // Check if column exists first to be safe
        const [columns] = await connection.execute(`
            SHOW COLUMNS FROM shops LIKE 'views'
        `);

        if (columns.length === 0) {
            await connection.execute(`
                ALTER TABLE shops
                ADD COLUMN views INT DEFAULT 0
            `);
            console.log('Column "views" added successfully.');
        } else {
            console.log('Column "views" already exists.');
        }

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    } finally {
        if (connection) await connection.end();
    }
}

up();
