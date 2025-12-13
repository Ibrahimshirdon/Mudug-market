const db = require('../config/db');

const checkShopColumns = async () => {
    try {
        const [rows] = await db.execute('DESCRIBE shops');
        console.log('Shops Table Columns:');
        rows.forEach(row => console.log(`- ${row.Field} (${row.Type})`));

        const [rows2] = await db.execute('DESCRIBE reports');
        console.log('\nReports Table Columns:');
        rows2.forEach(row => console.log(`- ${row.Field} (${row.Type})`));
    } catch (error) {
        console.error('Error describing table:', error);
    }
    process.exit();
};

checkShopColumns();
