const cron = require('node-cron');
const Shop = require('../models/Shop');
const Transaction = require('../models/Transaction');

const RENT_AMOUNT = 50.00;

// Run every day at midnight: '0 0 * * *'
// For testing, can use '* * * * *' (every minute)
const rentScheduler = () => {
    console.log('Initializing Rent Scheduler (Daily at Midnight)...');

    cron.schedule('0 0 * * *', async () => {
        console.log('Running Daily Rent Check...');
        try {
            // Logic:
            // 1. Find shops where status is approved (active)
            const shops = await Shop.find({ status: 'approved' });
            const now = new Date();

            for (const shop of shops) {
                // Check if expiry is present and past
                if (shop.subscription_expiry && new Date(shop.subscription_expiry) < now) {

                    console.log(`Processing Rent for Shop ${shop.id} (${shop.name})...`);

                    if (shop.balance >= RENT_AMOUNT) {
                        // 1. Deduct Rent
                        shop.balance -= RENT_AMOUNT;

                        // 2. Extend Expiry (30 days)
                        const newExpiry = new Date(now);
                        newExpiry.setDate(newExpiry.getDate() + 30);
                        shop.subscription_expiry = newExpiry;
                        shop.subscription_status = 'active';

                        await shop.save();

                        // 3. Log Transaction
                        await Transaction.create({
                            shop_id: shop.id,
                            amount: RENT_AMOUNT,
                            type: 'RENT',
                            description: 'Monthly Shop Rent'
                        });

                        console.log(`Rent Collected from Shop ${shop.id}. New Expiry: ${newExpiry}`);

                    } else {
                        // Insufficient Funds
                        console.log(`Shop ${shop.id} NSF. Deactivating...`);

                        shop.status = 'deactivated';
                        shop.subscription_status = 'expired';
                        await shop.save();

                        // Optional: Notify Owner (Could skip for migration simplicity or add Notification model call)
                    }
                }
            }

        } catch (error) {
            console.error('Rent Scheduler Error:', error);
        }
    });
};

module.exports = rentScheduler;
