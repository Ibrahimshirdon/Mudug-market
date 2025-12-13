const db = require('../config/db');

const migrate = async () => {
    try {
        console.log('Checking for profile_image column in users table...');
        const [columns] = await db.execute("SHOW COLUMNS FROM users LIKE 'profile_image'");
        if (columns.length === 0) {
            console.log('Adding profile_image column...');
            await db.execute('ALTER TABLE users ADD COLUMN profile_image VARCHAR(255)');
            console.log('profile_image column added.');
        } else {
            console.log('profile_image column already exists.');
        }
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        process.exit();
    }
};

migrate();
