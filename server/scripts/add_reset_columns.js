const db = require('../config/db');

const addResetColumns = async () => {
    try {
        console.log('Attempting to add reset_password_token column...');
        await db.execute('ALTER TABLE users ADD COLUMN reset_password_token VARCHAR(255)');
        console.log('Added reset_password_token successfully.');
    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('reset_password_token column already exists.');
        } else {
            console.error('Error adding reset_password_token:', error.message);
        }
    }

    try {
        console.log('Attempting to add reset_password_expires column...');
        await db.execute('ALTER TABLE users ADD COLUMN reset_password_expires DATETIME');
        console.log('Added reset_password_expires successfully.');
    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('reset_password_expires column already exists.');
        } else {
            console.error('Error adding reset_password_expires:', error.message);
        }
    }

    process.exit();
};

addResetColumns();
