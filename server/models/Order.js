const db = require('../config/db');

class Order {
    static async create(data) {
        const { user_id, shop_id, total_amount, payment_method, payment_status, status, shipping_address, phone } = data;
        const [result] = await db.execute(
            'INSERT INTO orders (user_id, shop_id, total_amount, payment_method, payment_status, status, shipping_address, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [user_id, shop_id, total_amount, payment_method, payment_status, status || 'pending', JSON.stringify(shipping_address), phone]
        );
        return result.insertId;
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM orders WHERE id = ?', [id]);
        return rows[0];
    }

    static async findByUserId(userId) {
        const [rows] = await db.execute(`
            SELECT O.*, S.name as shop_name 
            FROM orders O
            LEFT JOIN shops S ON O.shop_id = S.id
            WHERE O.user_id = ?
            ORDER BY O.created_at DESC
        `, [userId]);
        return rows;
    }

    static async findByShopId(shopId) {
        const [rows] = await db.execute(`
            SELECT O.*, U.name as customer_name, U.email as customer_email
            FROM orders O
            LEFT JOIN users U ON O.user_id = U.id
            WHERE O.shop_id = ?
            ORDER BY O.created_at DESC
        `, [shopId]);
        return rows;
    }

    static async updateStatus(id, status) {
        await db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
        return this.findById(id);
    }
}

module.exports = Order;
