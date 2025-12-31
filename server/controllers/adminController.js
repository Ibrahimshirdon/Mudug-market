const Shop = require('../models/Shop');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const ActivityLog = require('../models/ActivityLog');
const Report = require('../models/Report');
const Fine = require('../models/Fine');
const Notification = require('../models/Notification');
const Product = require('../models/Product');

exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find().populate('shop_id', 'name').sort('-createdAt');
        res.json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.adjustShopBalance = async (req, res) => {
    try {
        const { shopId } = req.params;
        const { amount, description } = req.body;

        if (!amount || isNaN(amount)) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        const numAmount = Number(amount);
        const type = numAmount >= 0 ? 'credit' : 'debit';

        // 1. Update Shop Balance
        const shop = await Shop.findByIdAndUpdate(shopId, { $inc: { balance: numAmount } }, { new: true });

        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        // 2. Create Transaction Record
        await Transaction.create({
            shop_id: shopId,
            amount: Math.abs(numAmount),
            type: type,
            description: description || 'Manual Adjustment by Admin'
        });

        res.json({ message: 'Balance adjusted successfully', shop });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getAnalytics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalShops = await Shop.countDocuments({ is_active: true });
        const totalProducts = await Product.countDocuments({ is_active: true });
        const totalBalance = await Shop.aggregate([{ $group: { _id: null, total: { $sum: "$balance" } } }]);

        res.json({
            totalUsers,
            totalShops,
            totalProducts,
            totalBalance: totalBalance.length > 0 ? totalBalance[0].total : 0
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort('-createdAt');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);

        await ActivityLog.create({
            user_id: req.user._id,
            action: 'DELETE_USER',
            details: `Deleted user ID: ${req.params.id}`
        });

        res.json({ message: 'User deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getLogs = async (req, res) => {
    try {
        const logs = await ActivityLog.find().populate('user_id', 'name email').sort('-createdAt');
        res.json(logs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteShop = async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id);
        if (!shop) return res.status(404).json({ message: 'Shop not found' });

        shop.is_active = false;
        await shop.save();

        await ActivityLog.create({
            user_id: req.user._id,
            action: 'DEACTIVATE_SHOP_ADMIN',
            details: `Admin deactivated shop ID: ${req.params.id}`
        });

        res.json({ message: 'Shop deactivated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deactivateShop = async (req, res) => {
    try {
        const shopId = req.params.id;

        const shop = await Shop.findByIdAndUpdate(shopId, { status: 'deactivated' }, { new: true });
        if (!shop) return res.status(404).json({ message: 'Shop not found' });

        const resolvedReports = await Report.countDocuments({ shop_id: shopId, status: 'resolved' });

        const message = `Your shop "${shop.name}" has been deactivated due to policy violations. Total Resolved Reports: ${resolvedReports}. Please contact support for more information.`;

        await Notification.create({
            user_id: shop.owner_id,
            message: message
        });

        await ActivityLog.create({
            user_id: req.user._id,
            action: 'DEACTIVATE_SHOP',
            details: `Deactivated shop ID: ${shopId}. Notified owner.`
        });

        res.json({ message: 'Shop deactivated and owner notified' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.activateShop = async (req, res) => {
    try {
        await Shop.findByIdAndUpdate(req.params.id, { status: 'approved' });

        await ActivityLog.create({
            user_id: req.user._id,
            action: 'ACTIVATE_SHOP',
            details: `Activated shop ID: ${req.params.id}`
        });

        res.json({ message: 'Shop activated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
