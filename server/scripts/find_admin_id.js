const db = require('../config/db');

const findAdmin = async () => {
    try {
        const [users] = await db.query("SELECT id, email FROM users WHERE email = 'admin@gmail.com'");
        console.log('Admin User:', users);
    } catch (error) {
        console.error(error);
    } finally {
        process.exit();
    }
};

findAdmin();
