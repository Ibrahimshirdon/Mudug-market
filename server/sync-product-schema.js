const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const fixSchema = async () => {
    const port = process.env.DB_PORT || 3306;
    const connectionUrl = process.env.MYSQL_URL || `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${port}/${process.env.DB_NAME}`;

    if (!process.env.MYSQL_URL && !process.env.DB_HOST) {
        console.error('❌ Error: No database credentials found in .env file!');
        return;
    }

    const connection = await mysql.createConnection(connectionUrl);

    try {
        console.log('Syncing products table schema...');

        const columnsToAdd = [
            { name: 'is_black_friday', type: 'BOOLEAN DEFAULT FALSE', after: 'stock' },
            { name: 'is_out_of_stock', type: 'BOOLEAN DEFAULT FALSE', after: 'is_black_friday' },
            { name: 'delivery_info', type: 'VARCHAR(255)', after: 'is_out_of_stock' },
            { name: 'delivery_fee', type: 'DECIMAL(10, 2) DEFAULT 0.00', after: 'delivery_info' }
        ];

        for (const col of columnsToAdd) {
            try {
                await connection.execute(`ALTER TABLE products ADD COLUMN ${col.name} ${col.type} AFTER ${col.after}`);
                console.log(`✔ Column ${col.name} added`);
            } catch (err) {
                if (err.code === 'ER_DUP_COLUMN_NAME' || err.code === 'ER_DUP_FIELDNAME') {
                    console.log(`✔ Column ${col.name} already exists`);
                } else {
                    console.error(`❌ Error adding column ${col.name}:`, err.message);
                }
            }
        }

        // Also check if image_url exists (we should keep it for backward compat or remove if unused)
        // From database.sql it exists, but model doesn't use it.

        console.log('Schema sync completed!');
    } catch (error) {
        console.error('Error syncing schema:', error);
    } finally {
        await connection.end();
    }
};

fixSchema();
