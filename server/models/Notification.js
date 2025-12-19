const db = require('../config/db');

class Notification {
    static async create(data) {
        const { user_id, message } = data;
        await db.execute(
            'INSERT INTO notifications (user_id, message, is_read) VALUES (?, ?, ?)',
            [user_id, message, false]
        );
    }

    static async find(query) {
        if (query.user_id) {
            const [rows] = await db.execute('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC', [query.user_id]);
            return rows;
        }
        return [];
    }

    static async findByIdAndUpdate(id, data) {
        if (data.is_read) {
            await db.execute('UPDATE notifications SET is_read = 1 WHERE id = ?', [id]);
        }
    }

    static async countDocuments(query) {
        if (query.user_id && query.is_read === false) {
            const [rows] = await db.execute('SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0', [query.user_id]);
            return rows[0].count;
        }
        return 0;
    }
}

module.exports = Notification;
