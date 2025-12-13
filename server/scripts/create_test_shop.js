const db = require('../config/db');

const createShop = async () => {
    try {
        const adminId = 8; // Correct ID for admin@gmail.com (from find_admin_id.js output)

        // Check if shop exists for this owner
        const [shops] = await db.query("SELECT * FROM shops WHERE name = 'Admin Test Shop' AND owner_id = ?", [adminId]);
        if (shops.length > 0) {
            console.log('Test shop already exists for admin ID 8.');
            if (shops[0].status !== 'approved') {
                await db.query("UPDATE shops SET status = 'approved' WHERE id = ?", [shops[0].id]);
                console.log('Shop approved.');
            }
        } else {
            console.log('Creating test shop for admin ID 8...');
            await db.query(`
                INSERT INTO shops (owner_id, name, description, location, phone, status, balance)
                VALUES (?, 'Admin Test Shop', 'A shop for testing admin features', 'Admin City', '1234567890', 'approved', 100.00)
            `, [adminId]);
            console.log('Test shop created for admin ID 8.');
        }
    } catch (error) {
        console.error('Error creating shop:', error);
    } finally {
        process.exit();
    }
};

createShop();
