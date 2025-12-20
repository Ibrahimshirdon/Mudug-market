const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function initDB() {
    const url = process.argv[2];
    if (!url) {
        console.error('Usage: node init-db.js "mysql://..."');
        process.exit(1);
    }

    try {
        console.log('⏳ Connecting to database...');
        const connection = await mysql.createConnection(url + '?multipleStatements=true');
        console.log('✅ Connected!');

        console.log('⏳ Reading database.sql...');
        const sql = fs.readFileSync(path.join(__dirname, 'database.sql'), 'utf8');

        console.log('⏳ Executing schema (this might take a few seconds)...');
        await connection.query(sql);

        console.log('🚀 Database initialized successfully!');
        await connection.end();
    } catch (error) {
        console.error('❌ Initialization failed:', error.message);
        process.exit(1);
    }
}

initDB();
