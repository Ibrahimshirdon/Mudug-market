const db = require('../config/db');

class Shop {
    static async create(data) {
        const { owner_id, name, description, location, phone, license, logo_url } = data;
        const [result] = await db.execute(
            'INSERT INTO shops (owner_id, name, description, location, phone, license, logo_url, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [owner_id, name, description, location, phone, license, logo_url, 'pending']
        );
        return this.findById(result.insertId);
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM shops WHERE id = ?', [id]);
        return rows[0];
    }

    static async findOne(query) {
        // Basic implementation for owner_id
        if (query.owner_id) {
            const [rows] = await db.execute('SELECT * FROM shops WHERE owner_id = ?', [query.owner_id]);
            return rows[0];
        }
        return null;
    }

    static async incrementViews(id) {
        // Increment total views
        await db.execute('UPDATE shops SET views = COALESCE(views, 0) + 1 WHERE id = ?', [id]);

        // Upsert daily views (increment if exists, insert 1 if not)
        await db.execute(`
            INSERT INTO shop_daily_views (shop_id, view_date, view_count) 
            VALUES (?, CURDATE(), 1) 
            ON DUPLICATE KEY UPDATE view_count = view_count + 1
        `, [id]);
    }

    static async getDailyViews(shopId) {
        // Get last 7 days of data
        const [rows] = await db.execute(`
            SELECT view_date, view_count 
            FROM shop_daily_views 
            WHERE shop_id = ? AND view_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            ORDER BY view_date ASC
        `, [shopId]);
        return rows;
    }

    static async findByIdAndUpdate(id, data, options) {
        // 'options' like { new: true } ignored in SQL (we return fetches)
        let fields = [];
        let values = [];

        // Handle numeric increments (e.g. { $inc: { balance: -10 } })
        if (data.$inc) {
            for (const [key, value] of Object.entries(data.$inc)) {
                fields.push(`${key} = ${key} + ?`);
                values.push(value);
            }
        }

        // Handle normal sets
        for (const [key, value] of Object.entries(data)) {
            if (key === '$inc') continue;
            fields.push(`${key} = ?`);
            values.push(value);
        }

        if (fields.length > 0) {
            values.push(id);
            await db.execute(`UPDATE shops SET ${fields.join(', ')} WHERE id = ?`, values);
        }
        return this.findById(id);
    }

    static async findByIdAndDelete(id) {
        await db.execute('DELETE FROM shops WHERE id = ?', [id]);
        return true;
    }

    static async find(query = {}) {
        let sql = 'SELECT * FROM shops';
        let params = [];

        if (query.status) {
            sql += ' WHERE status = ?';
            params.push(query.status);
        } else if (query.location) {
            // Handle regex object { $regex: ... } from controller
            if (typeof query.location === 'object' && query.location.$regex) {
                sql += ' WHERE location LIKE ?';
                params.push(`%${query.location.$regex}%`);
            }
        }

        const [rows] = await db.execute(sql, params);
        return rows;
    }

    static async countDocuments() {
        const [rows] = await db.execute('SELECT COUNT(*) as count FROM shops');
        return rows[0].count;
    }
}

module.exports = Shop;
