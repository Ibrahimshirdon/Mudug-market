const db = require('../config/db');

const checkColumns = async () => {
    try {
        const [rows] = await db.execute('DESCRIBE users');
        console.log('Users Table Columns:');
        rows.forEach(row => console.log(`- ${row.Field} (${row.Type})`));
    } catch (error) {
        console.error('Error describing table:', error);
    }
    process.exit();
};

checkColumns();
