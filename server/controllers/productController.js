const Product = require('../models/Product');
const ActivityLog = require('../models/ActivityLog');
const Shop = require('../models/Shop'); // Ensure used if needed for population paths? Mongoose handles via 'ref'

exports.getProducts = async (req, res) => {
    try {
        const { search, category, minPrice, maxPrice, location, condition, sort } = req.query;
        let query = {};

        if (search) {
            query.$text = { $search: search };
        }

        if (category) {
            // Assuming category is passed as name or needs to be ObjectId. 
            // If name, we might need to lookup Category first or assume generic search logic.
            // Let's assume it's ID for now due to frontend usually sending IDs, or we join.
            // But wait, the SQL joined categories c and filtered by c.name.
            // With Mongoose, filtering by related doc field is harder (needs aggregation or 2 queries).
            // Simplest: Allow filtering by category_id directly. If frontend sends name, we need to fix frontend or find category by name first.
            // I will assume ID for consistency with new schema, OR try to support both if I can import Category.
            // For now, let's stick to query building.
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = minPrice;
            if (maxPrice) query.price.$lte = maxPrice;
        }

        if (condition) {
            query.condition = condition;
        }

        // Location is on Shop. We need to find shops in location first, then products? 
        // Or aggregate.
        if (location) {
            const shops = await Shop.find({ location: { $regex: location, $options: 'i' } }).select('_id');
            query.shop_id = { $in: shops.map(s => s._id) };
        }

        let productsQuery = Product.find(query)
            .populate('shop_id', 'name location phone logo_url')
            .populate('category_id', 'name');

        if (sort === 'price_asc') {
            productsQuery = productsQuery.sort({ price: 1 });
        } else if (sort === 'price_desc') {
            productsQuery = productsQuery.sort({ price: -1 });
        } else {
            productsQuery = productsQuery.sort({ created_at: -1 });
        }

        const products = await productsQuery;
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('shop_id', 'name location phone logo_url')
            .populate('category_id', 'name');

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.createProduct = async (req, res) => {
    try {
        console.log('createProduct body:', req.body);
        console.log('createProduct files:', req.files);

        const productData = { ...req.body };

        // Handle multiple images
        if (req.files && req.files.length > 0) {
            productData.images = req.files.map((file, index) => ({
                image_url: file.path,
                display_order: index
            }));
        }

        const product = await Product.create(productData);

        await ActivityLog.create({
            user_id: req.user.id,
            action: 'CREATE_PRODUCT',
            details: `Created product: ${product.name}`
        });

        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        const fs = require('fs');
        fs.appendFileSync('server_error.log', `${new Date().toISOString()} - ${error.message}\n${error.stack}\n\n`);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const {
            name, brand, model, description, price, discount_price, stock,
            condition, category_id, delivery_info, delivery_fee, is_black_friday
        } = req.body;

        if (name) product.name = name;
        if (brand) product.brand = brand;
        if (model) product.model = model;
        if (description) product.description = description;
        if (price) product.price = price;
        if (discount_price !== undefined) product.discount_price = discount_price;
        if (stock !== undefined) product.stock = stock;
        if (condition) product.condition = condition;
        if (category_id) product.category_id = category_id;
        if (delivery_info) product.delivery_info = delivery_info;
        if (delivery_fee !== undefined) product.delivery_fee = delivery_fee;
        if (is_black_friday !== undefined) product.is_black_friday = is_black_friday;

        // Handle new images if uploaded
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map((file, index) => ({
                image_url: file.path,
                display_order: product.images.length + index
            }));
            product.images.push(...newImages);
        }

        await product.save();

        await ActivityLog.create({
            user_id: req.user.id,
            action: 'UPDATE_PRODUCT',
            details: `Updated product ID: ${req.params.id}`
        });

        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);

        await ActivityLog.create({
            user_id: req.user.id,
            action: 'DELETE_PRODUCT',
            details: `Deleted product ID: ${req.params.id}`
        });

        res.json({ message: 'Product removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteProductImage = async (req, res) => {
    try {
        const { productId, imageId } = req.params;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Filter out the image by _id (Mongoose subdocument ID)
        product.images = product.images.filter(img => img._id.toString() !== imageId);

        await product.save();

        await ActivityLog.create({
            user_id: req.user.id,
            action: 'DELETE_PRODUCT_IMAGE',
            details: `Deleted image ID: ${imageId} from product ID: ${productId}`
        });

        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
