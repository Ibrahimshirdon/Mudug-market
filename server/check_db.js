const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const check = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'mudug_market'
        });

        console.log('Connected to:', process.env.DB_NAME);
        const [rows] = await connection.execute('DESCRIBE products');
        console.log('Columns:', rows.map(r => r.Field));
        await connection.end();
    } catch (err) {
        console.error('Error:', err.message);
    }
};

check();
