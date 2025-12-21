const mysql = require('mysql2/promise');
require('dotenv').config();

const fixSchema = async () => {
    const connectionUrl = process.env.MYSQL_URL || `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

    console.log('Connecting to database to fix product schema...');
    const connection = await mysql.createConnection(connectionUrl);

    try {
        console.log('Applying schema changes to products table...');

        // 1. Add is_out_of_stock if it doesn't exist
        await connection.execute(`
            ALTER TABLE products 
            ADD COLUMN IF NOT EXISTS is_out_of_stock BOOLEAN DEFAULT FALSE 
            AFTER is_black_friday
        `);
        console.log('✔ Column is_out_of_stock checked/added');

        // 2. Expand condition ENUM
        await connection.execute(`
            ALTER TABLE products 
            MODIFY COLUMN \`condition\` ENUM('new', 'used', 'refurbished') NOT NULL
        `);
        console.log('✔ Column condition expanded');

        console.log('Schema fix completed successfully!');
    } catch (error) {
        console.error('Error fixing schema:', error);
    } finally {
        await connection.end();
    }
};

fixSchema();
