const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');

// Load env vars
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mudug_market');
        console.log('✅ MongoDB Connected for Seeding');
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

const categories = [
    { name: 'Electronics', icon: '📱' },
    { name: 'Fashion', icon: '👕' },
    { name: 'Home & Garden', icon: '🏠' },
    { name: 'Sports', icon: '⚽' },
    { name: 'Books', icon: '📚' },
    { name: 'Toys', icon: '🧸' },
    { name: 'Automotive', icon: '🚗' },
    { name: 'Beauty', icon: '💄' }
];

const seedCategories = async () => {
    await connectDB();

    try {
        console.log('🌱 Seeding categories...');

        for (const category of categories) {
            // Check if category exists
            const existingCategory = await Category.findOne({ name: category.name });

            if (!existingCategory) {
                await Category.create(category);
                console.log(`✅ Inserted category: ${category.name}`);
            } else {
                console.log(`⚠️  Category already exists: ${category.name}`);
            }
        }

        console.log('🎉 Categories seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding categories:', error);
        process.exit(1);
    }
};

seedCategories();
