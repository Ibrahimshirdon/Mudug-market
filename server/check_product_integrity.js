const mongoose = require('mongoose');
require('dotenv').config();

const Shop = require('./models/Shop');
const Product = require('./models/Product');
const Category = require('./models/Category'); // Just to ensure models are registered

const checkIntegrity = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const products = await Product.find().populate('shop_id');

        console.log(`Found ${products.length} products.`);

        let badProducts = 0;
        products.forEach(p => {
            if (!p.shop_id) {
                console.log(`❌ Product "${p.name}" (ID: ${p._id}) has missing/null shop_id!`);
                badProducts++;
            } else {
                console.log(`✅ Product "${p.name}" linked to shop: ${p.shop_id.name}`);
            }
        });

        if (badProducts === 0) {
            console.log('All products have valid shop references.');
        } else {
            console.log(`Found ${badProducts} products with broken shop references.`);
        }

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
};

checkIntegrity();
