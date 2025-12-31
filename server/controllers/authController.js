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

    // Fix: Frontend might send 'buyer' or 'seller', but schema expects 'user' or 'seller'
    if (role === 'buyer') {
        role = 'user';
    } else if (role === 'seller') {
        // Keeping 'seller' as per Mongoose enum if updated, or user if that's the base
        role = 'seller';
    }

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password, // Password hashing is handled by User model pre-save hook
            phone,
            role: role || 'user',
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profile_image: user.profile_image,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Query by email OR name (using the static method I added to User model)
        const user = await User.findByEmailOrName(email);

        if (user && (await user.matchPassword(password))) {
            // Log activity
            try {
                await ActivityLog.create({
                    user_id: user._id,
                    action: 'LOGIN',
                    details: 'User logged in'
                });
            } catch (logError) {
                console.error('Activity Log Error:', logError);
            }

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profile_image: user.profile_image,
                token: generateToken(user._id),
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
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 3600000; // 1 hour

        await user.save({ validateBeforeSave: false });

        // Send Email
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
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
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
        }

        // Set new password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.json({ message: 'Password updated successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.user.id).select('+password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Set new password
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


