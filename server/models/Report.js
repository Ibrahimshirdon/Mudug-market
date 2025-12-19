const db = require('../config/db');

class Report {
    static async create(data) {
        const { reporter_id, shop_id, reason, description } = data;
        await db.execute(
            'INSERT INTO reports (reporter_id, shop_id, reason, description, status) VALUES (?, ?, ?, ?, ?)',
            [reporter_id, shop_id, reason, description, 'pending']
        );
    }

    static async find() {
        // Support .populate('reporter_id') and .populate('shop_id') by joining
        const [rows] = await db.execute(`
            SELECT r.*, 
            u.name as reporter_name, u.email as reporter_email,
            s.name as shop_name
            FROM reports r
            LEFT JOIN users u ON r.reporter_id = u.id
            LEFT JOIN shops s ON r.shop_id = s.id
            ORDER BY r.created_at DESC
        `);

        return rows.map(r => ({
            ...r,
            reporter_id: { id: r.reporter_id, name: r.reporter_name, email: r.reporter_email },
            shop_id: { id: r.shop_id, name: r.shop_name }
        }));
    }

    static async findByIdAndUpdate(id, data, options) {
        if (data.status) {
            await db.execute('UPDATE reports SET status = ? WHERE id = ?', [data.status, id]);
        }
        const [rows] = await db.execute('SELECT * FROM reports WHERE id = ?', [id]);
        return rows[0];
    }

    static async countDocuments(query) {
        let sql = 'SELECT COUNT(*) as count FROM reports WHERE 1=1';
        let params = [];
        if (query.shop_id) { sql += ' AND shop_id = ?'; params.push(query.shop_id); }
        if (query.status) { sql += ' AND status = ?'; params.push(query.status); }

        const [rows] = await db.execute(sql, params);
        return rows[0].count;
    }
}

module.exports = Report;
