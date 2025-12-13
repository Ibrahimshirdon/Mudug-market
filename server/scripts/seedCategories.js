const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');
const connectDB = require('../config/db');

dotenv.config({ path: '../.env' });

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
    try {
        await connectDB();

        // Clear existing categories
        await Category.deleteMany();
        console.log('Categories cleared');

        // Insert new categories
        await Category.insertMany(categories);
        console.log('Categories added successfully');

        process.exit();
    } catch (error) {
        console.error('Error seeding categories:', error);
        process.exit(1);
    }
};

seedCategories();
