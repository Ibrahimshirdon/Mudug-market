const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

exports.registerUser = async (req, res) => {
    let { name, email, password, phone, role } = req.body;

    // Fix: Frontend might send 'buyer' or 'seller', but schema expects 'user' or 'shop_owner'
    if (role === 'buyer') {
        role = 'user';
    } else if (role === 'seller') {
        role = 'shop_owner';
    }

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role: role || 'user',
        });

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            profile_image: user.profile_image,
            token: generateToken(user.id),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                profile_image: user.profile_image,
                token: generateToken(user.id),
            });
            // Log activity
            await ActivityLog.create({
                user_id: user.id,
                action: 'LOGIN',
                details: 'User logged in'
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate token
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

        // Save to DB
        user.reset_password_token = resetToken;
        user.reset_password_expires = resetPasswordExpires;
        await user.save();

        // Send Email
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

        // Create Transporter (Using a simple config, preferably from ENV)
        const transporter = nodemailer.createTransport({
            service: 'gmail', // or host/port from env
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const message = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            text: `You are receiving this email because you (or someone else) have requested the reset of a password for your account.\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            ${resetUrl}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        try {
            if (process.env.EMAIL_USER) {
                await transporter.sendMail(message);
                res.json({ message: 'Email sent' });
            } else {
                console.log('RESET LINK (DEV):', resetUrl);
                res.json({ message: 'Email sent (Dev Mode: Check Console)' });
            }
        } catch (emailError) {
            console.error('Email send error:', emailError);
            res.status(500).json({ message: 'Email could not be sent' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({
            reset_password_token: token,
            reset_password_expires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update User
        user.password = hashedPassword;
        user.reset_password_token = undefined;
        user.reset_password_expires = undefined;
        await user.save();

        res.json({ message: 'Password updated successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

