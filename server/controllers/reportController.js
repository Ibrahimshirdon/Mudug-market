const Report = require('../models/Report');
const Fine = require('../models/Fine');
const Shop = require('../models/Shop');
const Transaction = require('../models/Transaction');
const ActivityLog = require('../models/ActivityLog');
const Notification = require('../models/Notification');

exports.createReport = async (req, res) => {
    try {
        const { shopId, reason, description } = req.body;
        const reporterId = req.user._id;

        await Report.create({
            reporter_id: reporterId,
            shop_id: shopId,
            reason,
            description
        });

        res.status(201).json({ message: 'Report submitted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getAllReports = async (req, res) => {
    try {
        const reports = await Report.find()
            .populate('reporter_id', 'name email')
            .populate('shop_id', 'name logo_url')
            .sort('-createdAt');
        res.json(reports);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateReportStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const reportId = req.params.id;

        const report = await Report.findByIdAndUpdate(reportId, { status }, { new: true });

        if (!report) return res.status(404).json({ message: 'Report not found' });

        if (status === 'resolved') {
            // Strikes Logic
            const shop = await Shop.findByIdAndUpdate(report.shop_id, { $inc: { strikes: 1 } }, { new: true });

            if (shop) {
                const newStrikes = shop.strikes;
                console.log(`Shop ${shop.name} now has ${newStrikes} strikes.`);

                // Check Rule: 3 Strikes = $10 Fine + Deactivation
                if (newStrikes > 0 && newStrikes % 3 === 0) {
                    const fineAmount = 10.00;

                    // 1. Deduct Balance and Deactivate
                    shop.balance -= fineAmount;
                    shop.status = 'deactivated';
                    await shop.save();

                    // 2. Log into Transactions
                    await Transaction.create({
                        shop_id: shop._id,
                        amount: fineAmount,
                        type: 'debit',
                        description: `Penalty for reaching ${newStrikes} strikes.`
                    });

                    // 3. Notify Seller
                    const message = `URGENT: Your shop "${shop.name}" has been deactivated due to receiving ${newStrikes} reports. A penalty fee of $10 has been charged to your account. Please contact support to reactivate.`;
                    await Notification.create({
                        user_id: shop.owner_id,
                        message: message
                    });

                    // Log Activity
                    await ActivityLog.create({
                        user_id: req.user._id,
                        action: 'PENALTY_APPLIED',
                        details: `Applied $10 fine and deactivated shop ${shop.name} for strike ${newStrikes}`
                    });
                }
            }
        }

        res.json({ message: 'Report status updated', report });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
