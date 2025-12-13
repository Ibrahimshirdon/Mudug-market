const db = require('../config/db');

const setupFinanceDB = async () => {
    console.log('Starting Finance DB Setup...');

    // 1. Add 'strikes' to shops
    try {
        const [columns] = await db.execute("SHOW COLUMNS FROM shops LIKE 'strikes'");
        if (columns.length === 0) {
            console.log('Adding strikes column to shops...');
            await db.execute('ALTER TABLE shops ADD COLUMN strikes INT DEFAULT 0');
            console.log('strikes column added.');
        } else {
            console.log('strikes column already exists.');
        }
    } catch (error) {
        console.error('Error adding strikes column:', error);
    }

    // 2. Create transactions table
    try {
        console.log('Creating transactions table...');
        await db.execute(`
            CREATE TABLE IF NOT EXISTS transactions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                shop_id INT NOT NULL,
                amount DECIMAL(10, 2) NOT NULL,
                type ENUM('RENT', 'FINE', 'DEPOSIT', 'WITHDRAWAL', 'SALE') NOT NULL,
                description VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE
            )
        `);
        console.log('transactions table created/verified.');
    } catch (error) {
        console.error('Error creating transactions table:', error);
    }

    process.exit();
};

setupFinanceDB();
