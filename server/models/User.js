const db = require('../config/db');

class User {
    static async create({ name, email, password, phone, role, profile_image }) {
        const [result] = await db.execute(
            'INSERT INTO users (name, email, password, phone, role, profile_image) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, password, phone, role || 'user', profile_image || null]
        );
        return { id: result.insertId, name, email, role: role || 'user' };
    }

    static async findByEmail(email) {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    static async findByEmailOrName(identifier) {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ? OR name = ?', [identifier, identifier]);
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    }

    static async findByIdAndUpdate(id, updateData) {
        // Construct dynamic query
        const fields = [];
        const values = [];
        for (const [key, value] of Object.entries(updateData)) {
            fields.push(`${key} = ?`);
            values.push(value);
        }

        if (fields.length === 0) return this.findById(id);

        values.push(id);
        await db.execute(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
        return this.findById(id);
    }

    static async findByIdAndDelete(id) {
        await db.execute('DELETE FROM users WHERE id = ?', [id]);
        return true;
    }

    static async countDocuments() {
        const [rows] = await db.execute('SELECT COUNT(*) as count FROM users');
        return rows[0].count;
    }

    static async find() {
        // Warning: This returns ALL users. Should be paginated in production.
        const [rows] = await db.execute('SELECT * FROM users');
        return rows;
    }
}

module.exports = User;
