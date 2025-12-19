const db = require('../config/db');

class Transaction {
    static async create(data) {
        const { shop_id, amount, type, description } = data;
        await db.execute(
            'INSERT INTO transactions (shop_id, amount, type, description) VALUES (?, ?, ?, ?)',
            [shop_id, amount, type, description]
        );
    }

    static async find(query = {}) {
        let sql = `
            SELECT t.*, s.name as shop_name
            FROM transactions t
            LEFT JOIN shops s ON t.shop_id = s.id
            ORDER BY t.created_at DESC
        `;
        const [rows] = await db.execute(sql);
        return rows.map(r => ({
            ...r,
            shop_id: { id: r.shop_id, name: r.shop_name }
        }));
    }
}

module.exports = Transaction;
