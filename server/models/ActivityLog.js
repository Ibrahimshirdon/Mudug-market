const db = require('../config/db');

class ActivityLog {
    static async create(data) {
        const { user_id, action, details } = data;
        await db.execute(
            'INSERT INTO activity_logs (user_id, action, details) VALUES (?, ?, ?)',
            [user_id, action, details]
        );
    }

    static async find() {
        const [rows] = await db.execute(`
            SELECT l.*, u.name as user_name, u.email as user_email
            FROM activity_logs l
            LEFT JOIN users u ON l.user_id = u.id
            ORDER BY l.created_at DESC
        `);
        // Format for populate compatibility
        return rows.map(r => ({
            ...r,
            user_id: { id: r.user_id, name: r.user_name, email: r.user_email }
        }));
    }
}

module.exports = ActivityLog;
