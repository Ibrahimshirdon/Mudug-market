const Shop = require('../models/Shop');
const User = require('../models/User');

exports.createShop = async (req, res) => {
    try {
        const existingShop = await Shop.findOne({ owner_id: req.user.id });
        if (existingShop) {
            return res.status(400).json({ message: 'User already has a shop' });
        }

        const shopData = {
            owner_id: req.user.id,
            name: req.body.name,
            description: req.body.description,
            // Frontend sends 'location' input as address. Map it to address.
            address: req.body.address || req.body.location,
            location: req.body.location,
            phone: req.body.phone,
            license: req.body.license,
            logo_url: req.body.logo_url // Fallback if sent as text
        };

        if (req.file) {
            shopData.logo_url = req.file.path;
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
        let shop = await Shop.findOne({ owner_id: req.user.id });
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        const { name, description, location, phone } = req.body;

        // Update fields
        if (name) shop.name = name;
        if (description) shop.description = description;
        if (location) shop.location = location;
        if (phone) shop.phone = phone;

        if (req.file) {
            shop.logo_url = req.file.path;
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
        const shop = await Shop.findOne({ owner_id: req.user.id });
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
        let query = {};

        if (status) {
            query.status = status;
        } else {
            // Default only approved? Or show all if not specified? 
            // Original code didn't specify, but usually only approved for users.
            // Let's assume query handles it or defaults to all if admin.
        }

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const shops = await Shop.find(query).sort({ created_at: -1 });
        res.json(shops);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateShopStatus = async (req, res) => {
    try {
        const { status } = req.body; // 'approved', 'rejected'
        console.log(`Updating shop ${req.params.id} to ${status}`);

        const shop = await Shop.findByIdAndUpdate(req.params.id, { status }, { new: true });

        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        res.json({ message: `Shop ${status}`, shop });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getShopById = async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id);
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
