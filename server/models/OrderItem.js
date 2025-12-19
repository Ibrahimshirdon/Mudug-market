const db = require('../config/db');

class OrderItem {
    static async create(data) {
        const { order_id, product_id, quantity, price } = data;
        await db.execute(
            'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
            [order_id, product_id, quantity, price]
        );
    }

    static async findByOrderId(orderId) {
        const [rows] = await db.execute(`
            SELECT OI.*, P.name, 
            (SELECT image_url FROM product_images WHERE product_id = P.id ORDER BY display_order ASC LIMIT 1) as image_url
            FROM order_items OI
            JOIN products P ON OI.product_id = P.id
            WHERE OI.order_id = ?
        `, [orderId]);
        // Handle image_url logic in controller or frontend, ensuring consistency
        return rows;
    }
}

module.exports = OrderItem;
