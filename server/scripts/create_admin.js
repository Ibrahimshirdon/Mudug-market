const db = require('../config/db');
const bcrypt = require('bcryptjs');

const createAdmin = async () => {
    try {
        console.log('Connecting to DB...');
        // Test connection
        await db.query('SELECT 1');

        const hashedPassword = await bcrypt.hash('123456', 10);
        // Check if admin exists
        const [users] = await db.query("SELECT * FROM users WHERE email = 'admin@gmail.com'");
        if (users.length > 0) {
            console.log('Admin user exists, updating password...');
            await db.query("UPDATE users SET password = ?, role = 'admin' WHERE email = 'admin@gmail.com'", [hashedPassword]);
        } else {
            console.log('Creating admin user...');
            await db.query("INSERT INTO users (name, email, password, role) VALUES ('Admin', 'admin@gmail.com', ?, 'admin')", [hashedPassword]);
        }
        console.log('Admin user ready: admin@gmail.com / 123456');
    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        process.exit();
    }
};

createAdmin();
