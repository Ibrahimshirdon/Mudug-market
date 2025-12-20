const mysql = require('mysql2/promise');

async function fixRole() {
    const url = process.argv[2];
    if (!url) {
        console.error('Please provide the MySQL URL');
        process.exit(1);
    }

    try {
        console.log('⏳ Connecting to database to fix role ENUM...');
        const db = await mysql.createConnection(url);

        await db.execute(`
            ALTER TABLE users 
            MODIFY COLUMN role ENUM('user', 'shop_owner', 'admin') 
            DEFAULT 'user'
        `);

        console.log('✅ Database Role Fixed Successfully!');
        await db.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error fixing role:', error.message);
        process.exit(1);
    }
}

fixRole();
