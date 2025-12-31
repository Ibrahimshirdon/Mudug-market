const Shop = require('../models/Shop');
const User = require('../models/User');

exports.createShop = async (req, res) => {
    try {
        const existingShop = await Shop.findOne({ owner_id: req.user._id });
        if (existingShop) {
            return res.status(400).json({ message: 'User already has a shop' });
        }

        const shopData = {
            owner_id: req.user._id,
            name: req.body.name,
            description: req.body.description,
            location: req.body.location,
            phone: req.body.phone,
            license: req.body.license,
            logo_url: req.body.logo_url
        };

        if (req.file) {
            shopData.logo_url = `/uploads/${req.file.filename}`;
        }

        const shop = await Shop.create(shopData);
        res.status(201).json(shop);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateShop = async (req, res) => {
    try {
        let shop = await Shop.findOne({ owner_id: req.user._id });
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        const { name, description, location, phone } = req.body;

        if (name) shop.name = name;
        if (description) shop.description = description;
        if (location) shop.location = location;
        if (phone) shop.phone = phone;

        if (req.file) {
            shop.logo_url = `/uploads/${req.file.filename}`;
        }

        await shop.save();
        res.json(shop);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getMyShop = async (req, res) => {
    try {
        const shop = await Shop.findOne({ owner_id: req.user._id }).populate('owner_id', 'name email');
        if (shop) {
            res.json(shop);
        } else {
            res.status(404).json({ message: 'Shop not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getAllShops = async (req, res) => {
    try {
        const { status, search } = req.query;
        let query = { is_active: true };

        if (status) {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }

        const shops = await Shop.find(query).populate('owner_id', 'name email');
        res.json(shops);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateShopStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const shop = await Shop.findById(req.params.id);

        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        shop.status = status;
        await shop.save();

        // Promote user to seller if approved
        if (status === 'verified') {
            await User.findByIdAndUpdate(shop.owner_id, { role: 'seller' });
        }

        res.json({ message: `Shop updated to ${status}`, shop });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getShopStats = async (req, res) => {
    try {
        const shop = await Shop.findOne({ owner_id: req.user._id });
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        // Simulating the view stats for now or using a simplified version
        // In a real Mongo app, we'd have a separate View collection or daily buckets.
        res.json({
            views: shop.views,
            balance: shop.balance,
            createdAt: shop.createdAt
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getShopById = async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id).populate('owner_id', 'name email');
        if (shop) {
            // Increment views
            shop.views += 1;
            await shop.save();

            res.json(shop);
        } else {
            res.status(404).json({ message: 'Shop not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteShop = async (req, res) => {
    try {
        const shop = await Shop.findOne({ owner_id: req.user._id });
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        shop.is_active = false;
        await shop.save();

        // Also revert user role to 'user'
        await User.findByIdAndUpdate(req.user._id, { role: 'user' });

        res.json({ message: 'Shop deactivated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteShopById = async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id);
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        shop.is_active = false;
        await shop.save();

        // Revert owner role if necessary
        await User.findByIdAndUpdate(shop.owner_id, { role: 'user' });

        res.json({ message: 'Shop deactivated by admin' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
