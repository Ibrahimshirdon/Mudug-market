const db = require('../config/db');

const fixColumns = async () => {
    console.log('Starting migration...');
    try {
        // Method 1: Check if column exists
        const [columns] = await db.execute("SHOW COLUMNS FROM users LIKE 'reset_password_token'");
        if (columns.length === 0) {
            console.log('Adding reset_password_token...');
            await db.execute('ALTER TABLE users ADD COLUMN reset_password_token VARCHAR(255)');
            console.log('reset_password_token added.');
        } else {
            console.log('reset_password_token already exists.');
        }

        const [columns2] = await db.execute("SHOW COLUMNS FROM users LIKE 'reset_password_expires'");
        if (columns2.length === 0) {
            console.log('Adding reset_password_expires...');
            await db.execute('ALTER TABLE users ADD COLUMN reset_password_expires DATETIME');
            console.log('reset_password_expires added.');
        } else {
            console.log('reset_password_expires already exists.');
        }

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        console.log('Migration finished.');
        process.exit();
    }
};

fixColumns();
