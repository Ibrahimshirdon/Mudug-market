const Product = require('../models/Product');
const ActivityLog = require('../models/ActivityLog');
const Shop = require('../models/Shop');

exports.getProducts = async (req, res) => {
    try {
        const { search, category, minPrice, maxPrice, location, condition, sort } = req.query;
        let query = { is_active: true };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } }
            ];
        }

        if (category) query.category_id = category;
        if (condition) query.condition = condition;

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = minPrice;
            if (maxPrice) query.price.$lte = maxPrice;
        }

        // Location filtering (Advanced - requires shop lookup)
        if (location) {
            const shops = await Shop.find({ location: { $regex: location, $options: 'i' } });
            const shopIds = shops.map(s => s._id);
            query.shop_id = { $in: shopIds };
        }

        let productsQuery = Product.find(query).populate('shop_id', 'name logo_url location').populate('category_id', 'name');

        // Sorting
        if (sort === 'price-low') {
            productsQuery = productsQuery.sort('price');
        } else if (sort === 'price-high') {
            productsQuery = productsQuery.sort('-price');
        } else {
            productsQuery = productsQuery.sort('-createdAt');
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
            .populate('shop_id', 'name logo_url location phone description')
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
        const productData = { ...req.body };

        // Handle multiple images
        if (req.files && req.files.length > 0) {
            productData.images = req.files.map((file, index) => ({
                image_url: `/uploads/${file.filename}`,
                display_order: index
            }));
        }

        const product = await Product.create(productData);

        await ActivityLog.create({
            user_id: req.user._id,
            action: 'CREATE_PRODUCT',
            details: `Created product: ${product.name}`
        });

        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const {
            name, brand, model, description, price, discount_price, stock,
            condition, category_id, delivery_info, delivery_fee, is_black_friday, is_out_of_stock
        } = req.body;

        // Using set() and save() for Mongoose validation and hooks
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
        if (is_out_of_stock !== undefined) product.is_out_of_stock = is_out_of_stock;

        // Handle new images if uploaded
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map((file, index) => ({
                image_url: `/uploads/${file.filename}`,
                display_order: product.images.length + index
            }));
            product.images.push(...newImages);
        }

        const updatedProduct = await product.save();

        await ActivityLog.create({
            user_id: req.user._id,
            action: 'UPDATE_PRODUCT',
            details: `Updated product ID: ${product._id}`
        });

        res.json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Soft delete
        product.is_active = false;
        await product.save();

        await ActivityLog.create({
            user_id: req.user._id,
            action: 'DELETE_PRODUCT',
            details: `Soft deleted product ID: ${req.params.id}`
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

        // Remove image from array using Mongoose pull
        product.images = product.images.filter(img => img._id.toString() !== imageId);
        await product.save();

        await ActivityLog.create({
            user_id: req.user._id,
            action: 'DELETE_PRODUCT_IMAGE',
            details: `Deleted image ID: ${imageId} from product ID: ${productId}`
        });

        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
