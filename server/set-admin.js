const mysql = require('mysql2/promise');

async function setAdmin() {
    // YOU MUST PASTE YOUR MYSQL URL BELOW
    const url = "mysql://root:ppqMAJjNsmJKFIXOwjEhFHNMoVvdmCSr@tramway.proxy.rlwy.net:40951/railway";
    const email = "ibra@gmail.com";
    const newHashedPassword = "$2a$10$tKvdhYMT3gpGTE2ANlKOUOObBYydz8v1q2IUA6.o11UayV4YK.lXS"; // Hash for galkacyo2025

    try {
        console.log('⏳ Connecting to Railway database...');
        const db = await mysql.createConnection(url);

        console.log(`⏳ Updating user: ${email}...`);
        await db.execute(`
            UPDATE users 
            SET password = ?, role = 'admin', is_verified = 1 
            WHERE email = ?
        `, [newHashedPassword, email]);

        console.log('✅ SUCCESS! You are now an Admin.');
        console.log('🗝️  Login with: ibra@gmail.com');
        console.log('🗝️  Password: galkacyo2025');

        await db.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ FAILED:', error.message);
        process.exit(1);
    }
}

setAdmin();
