const db = require('../config/db');

class Category {
    static async find(query = {}) {
        const [rows] = await db.execute('SELECT * FROM categories ORDER BY name ASC');
        return rows;
    }

    static async create(data) {
        const { name, image_url, icon } = data;
        const [result] = await db.execute(
            'INSERT INTO categories (name, image_url, icon) VALUES (?, ?, ?)',
            [name, image_url, icon]
        );
        return { id: result.insertId, ...data };
    }

    static async findOne(query) {
        if (query.name) {
            const [rows] = await db.execute('SELECT * FROM categories WHERE name = ?', [query.name]);
            return rows[0];
        }
        return null;
    }
}

module.exports = Category;
