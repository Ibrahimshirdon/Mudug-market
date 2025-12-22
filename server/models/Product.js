const db = require('../config/db');

class Product {
    static async create(data) {
        const { shop_id, category_id, name, brand, model, description, price, discount_price, stock, condition, delivery_info, delivery_fee, is_black_friday, is_out_of_stock } = data;

        const [result] = await db.execute(
            `INSERT INTO products 
            (shop_id, category_id, name, brand, model, description, price, discount_price, stock, \`condition\`, delivery_info, delivery_fee, is_black_friday, is_out_of_stock) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [shop_id, category_id, name, brand, model, description, price, discount_price || null, stock || 0, condition || 'new', delivery_info, delivery_fee || 0, is_black_friday ? 1 : 0, is_out_of_stock ? 1 : 0]
        );

        const productId = result.insertId;

        // Handle Images
        if (data.images && data.images.length > 0) {
            for (const img of data.images) {
                await db.execute(
                    'INSERT INTO product_images (product_id, image_url, display_order) VALUES (?, ?, ?)',
                    [productId, img.image_url, img.display_order]
                );
            }
        }

        return this.findById(productId);
    }

    static async findById(id) {
        const [rows] = await db.execute(`
            SELECT p.*, 
            s.name as shop_name, s.logo_url as shop_logo, s.location as shop_location, s.phone as shop_phone,
            c.name as category_name
            FROM products p
            LEFT JOIN shops s ON p.shop_id = s.id
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?
        `, [id]);

        if (rows.length === 0) return null;

        const product = rows[0];

        // Fetch images
        const [images] = await db.execute('SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order ASC', [id]);
        product.images = images;

        // Format for controller compatibility (Mongoose-like structure)
        product.shop_id = {
            id: product.shop_id,
            _id: product.shop_id, // Backward compat
            name: product.shop_name,
            logo_url: product.shop_logo,
            location: product.shop_location,
            phone: product.shop_phone
        };
        product.category_id = {
            id: product.category_id,
            _id: product.category_id, // Backward compat
            name: product.category_name
        };

        return product;
    }

    static async update(id, data) {
        let fields = [];
        let values = [];

        for (const [key, value] of Object.entries(data)) {
            if (key === 'images') continue; // Handled separately
            fields.push(`\`${key}\` = ?`); // backticks for reserved words like condition
            values.push(value);
        }

        if (fields.length > 0) {
            values.push(id);
            const sql = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
            console.log('DEBUG: update SQL:', sql);
            console.log('DEBUG: update values:', values);
            await db.execute(sql, values);
        }

        // If we need to add images (append only for now based on logic)
        if (data.images && data.images.length > 0) {
            for (const img of data.images) {
                await db.execute(
                    'INSERT INTO product_images (product_id, image_url, display_order) VALUES (?, ?, ?)',
                    [id, img.image_url, img.display_order]
                );
            }
        }

        return this.findById(id);
    }

    static async findByIdAndDelete(id) {
        await db.execute('DELETE FROM products WHERE id = ?', [id]);
        return true;
    }

    static async find(query = {}, sort = {}) {
        // Build dynamic query
        let sql = `
            SELECT p.*, 
            s.name as shop_name, s.logo_url as shop_logo, s.location as shop_location,
            c.name as category_name
            FROM products p
            LEFT JOIN shops s ON p.shop_id = s.id
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE 1=1
        `;
        let params = [];

        if (query.search) {
            sql += ` AND (p.name LIKE ? OR p.brand LIKE ? OR p.description LIKE ?)`;
            params.push(`%${query.search}%`, `%${query.search}%`, `%${query.search}%`);
        }

        if (query.category_id) {
            sql += ` AND p.category_id = ?`;
            params.push(query.category_id);
        }

        if (query.shop_id) {
            // Handle $in array if passed (common in Mongoose)
            if (typeof query.shop_id === 'object' && query.shop_id.$in) {
                const placeholders = query.shop_id.$in.map(() => '?').join(',');
                sql += ` AND p.shop_id IN (${placeholders})`;
                params.push(...query.shop_id.$in);
            } else {
                sql += ` AND p.shop_id = ?`;
                params.push(query.shop_id);
            }
        }

        if (query.price && query.price.$gte) {
            sql += ` AND p.price >= ?`;
            params.push(query.price.$gte);
        }
        if (query.price && query.price.$lte) {
            sql += ` AND p.price <= ?`;
            params.push(query.price.$lte);
        }

        const [rows] = await db.execute(sql, params);

        // Note: Fetching images for ALL products here might be slow (N+1). 
        // For list views, maybe just get the first image or join?
        // Let's attach just the first image via a subquery or separate call if critical, 
        // but for now, the frontend expects full objects. 
        // OPTIMIZATION: Get all images for these products in one query.
        if (rows.length > 0) {
            const productIds = rows.map(r => r.id);
            const placeholders = productIds.map(() => '?').join(',');
            const [allImages] = await db.execute(`SELECT * FROM product_images WHERE product_id IN (${placeholders}) ORDER BY display_order ASC`, productIds);

            rows.forEach(p => {
                p.images = allImages.filter(img => img.product_id === p.id);
                // Backward compat structure
                p.shop_id = {
                    id: p.shop_id,
                    _id: p.shop_id,
                    name: p.shop_name,
                    logo_url: p.shop_logo,
                    location: p.shop_location
                };
                p.category_id = {
                    id: p.category_id,
                    _id: p.category_id,
                    name: p.category_name
                };
            });
        }

        return rows;
    }

    static async countDocuments() {
        const [rows] = await db.execute('SELECT COUNT(*) as count FROM products');
        return rows[0].count;
    }
}

module.exports = Product;
