const mysql = require('mysql2/promise');

async function runAdmin() {
    const url = process.argv[2];
    const email = process.argv[3];
    const action = process.argv[4]; // 'promote' or 'get-otp'

    if (!url || !email || !action) {
        console.log('Usage: node server/db-admin.js "URL" "EMAIL" "promote|get-otp"');
        process.exit(1);
    }

    try {
        const db = await mysql.createConnection(url);

        if (action === 'promote') {
            await db.execute("UPDATE users SET role = 'admin', is_verified = 1 WHERE email = ?", [email]);
            console.log(`✅ User ${email} is now an ADMIN and VERIFIED!`);
        } else if (action === 'get-otp') {
            const [rows] = await db.execute("SELECT otp_code FROM users WHERE email = ?", [email]);
            if (rows.length > 0) {
                console.log(`🔑 OTP Code for ${email} is: ${rows[0].otp_code}`);
            } else {
                console.log('❌ User not found.');
            }
        }

        await db.end();
    } catch (err) {
        console.error('❌ Error:', err.message);
    }
}

runAdmin();
