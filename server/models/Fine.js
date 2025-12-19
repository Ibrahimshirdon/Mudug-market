const db = require('../config/db');

class Fine {
    static async create(data) {
        const { shop_id, amount, reason } = data;
        await db.execute(
            'INSERT INTO fines (shop_id, amount, reason) VALUES (?, ?, ?)',
            [shop_id, amount, reason]
        );
    }

    static async find(query) {
        if (query.shop_id) {
            const [rows] = await db.execute('SELECT * FROM fines WHERE shop_id = ?', [query.shop_id]);
            return rows;
        }
        return [];
    }
}

module.exports = Fine;
