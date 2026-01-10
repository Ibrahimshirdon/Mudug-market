const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const createAdmin = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mudug_market';
        console.log('Connecting to MongoDB at:', mongoURI);

        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');

        const adminEmail = 'admin@mudug.com';
        const adminPassword = 'adminpassword123';

        let admin = await User.findOne({ email: adminEmail });
        if (admin) {
            console.log('Admin user already exists. Updating role to admin...');
            admin.role = 'admin';
            admin.password = await bcrypt.hash(adminPassword, 10); // Ensure password is set
            await admin.save();
            console.log('Admin user updated.');
        } else {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            admin = new User({
                name: 'System Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin'
            });
            await admin.save();
            console.log(`Admin user created. Email: ${adminEmail}, Password: ${adminPassword}`);
        }

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
