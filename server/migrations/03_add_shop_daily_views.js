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

        console.log('Creating shop_daily_views table...');

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS shop_daily_views (
                id INT AUTO_INCREMENT PRIMARY KEY,
                shop_id INT NOT NULL,
                view_date DATE NOT NULL,
                view_count INT DEFAULT 1,
                FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
                UNIQUE KEY unique_daily_view (shop_id, view_date)
            )
        `);

        console.log('Table "shop_daily_views" created successfully.');

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    } finally {
        if (connection) await connection.end();
    }
}

up();
