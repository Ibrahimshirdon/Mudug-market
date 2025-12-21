const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const fixSchema = async () => {
    // Robust connection string construction
    const port = process.env.DB_PORT || 3306;
    const connectionUrl = process.env.MYSQL_URL || `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${port}/${process.env.DB_NAME}`;

    if (!process.env.MYSQL_URL && !process.env.DB_HOST) {
        console.error('❌ Error: No database credentials found in .env file!');
        console.log('Please ensure your server/.env file has DB_USER, DB_PASSWORD, etc.');
        return;
    }
    const connection = await mysql.createConnection(connectionUrl);

    try {
        console.log('Applying schema changes to products table...');

        // 1. Add is_out_of_stock (standard syntax)
        try {
            await connection.execute(`
                ALTER TABLE products 
                ADD COLUMN is_out_of_stock BOOLEAN DEFAULT FALSE 
                AFTER is_black_friday
            `);
            console.log('✔ Column is_out_of_stock added');
        } catch (err) {
            if (err.code === 'ER_DUP_COLUMN_NAME' || err.code === 'ER_DUP_FIELDNAME') {
                console.log('✔ Column is_out_of_stock already exists');
            } else {
                throw err;
            }
        }

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
