const db = require('../config/db');

class Favorite {
    static async findOne(query) {
        const { user_id, product_id } = query;
        const [rows] = await db.execute(
            'SELECT * FROM favorites WHERE user_id = ? AND product_id = ?',
            [user_id, product_id]
        );
        return rows[0];
    }

    static async create(data) {
        const { user_id, product_id } = data;
        await db.execute(
            'INSERT INTO favorites (user_id, product_id) VALUES (?, ?)',
            [user_id, product_id]
        );
    }

    static async findByIdAndDelete(id) {
        await db.execute('DELETE FROM favorites WHERE id = ?', [id]);
    }

    static async find(query) {
        // Need to populate product > shop
        if (query.user_id) {
            const [rows] = await db.execute(`
                SELECT f.id as fav_id, p.*, 
                s.name as shop_name, s.logo_url as shop_logo
                FROM favorites f
                JOIN products p ON f.product_id = p.id
                JOIN shops s ON p.shop_id = s.id
                WHERE f.user_id = ?
            `, [query.user_id]);

            // Map to match controller expectation: { product_id: { ...product, shop_id: { ...shop } } }
            // Controller expects: array of objects where we map f.product_id
            // My controller.js logic: favorites.map(f => f.product_id)
            // So I should return array of objects with structure { product_id: productObject }

            return rows.map(r => ({
                product_id: {
                    id: r.id, // product id
                    name: r.name,
                    price: r.price,
                    description: r.description,
                    shop_id: { name: r.shop_name, logo_url: r.shop_logo },
                    images: [] // TODO: images logic if needed
                }
            }));
        }
        return [];
    }
}

module.exports = Favorite;
