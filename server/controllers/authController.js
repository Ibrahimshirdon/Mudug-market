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
        const userExists = await User.findByEmail(email);

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 10 * 60000); // 10 minutes

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role: role || 'user',
            otp_code: otpCode,
            otp_expires_at: otpExpiresAt
        });

        // Send OTP Email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Galkacyo Market - Verify Your Account',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #00A884; text-align: center;">Welcome to Galkacyo Market!</h2>
                    <p style="font-size: 16px;">Hello <strong>${name}</strong>,</p>
                    <p style="font-size: 16px;">Please use the following code to verify your account. This code will expire in 10 minutes.</p>
                    <div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333;">${otpCode}</span>
                    </div>
                    <p style="font-size: 14px; color: #666; text-align: center;">If you didn't request this, please ignore this email.</p>
                </div>
            `
        };

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            await transporter.sendMail(mailOptions);
        } else {
            console.log('--- OTP CODE (DEV) ---');
            console.log(`USER: ${email}`);
            console.log(`CODE: ${otpCode}`);
            console.log('-----------------------');
        }

        res.status(201).json({
            message: 'Registration successful. Please verify your email.',
            email: user.email
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findByEmailOrName(email);

        if (user && (await bcrypt.compare(password, user.password))) {
            // Check if verified
            if (!user.is_verified) {
                return res.status(403).json({
                    message: 'Please verify your email before logging in.',
                    isUnverified: true,
                    email: user.email
                });
            }

            // Log activity
            try {
                await ActivityLog.create({
                    user_id: user.id,
                    action: 'LOGIN',
                    details: 'User logged in'
                });
            } catch (logError) {
                console.error('Activity Log Error:', logError);
                // Continue login even if logging fails
            }

            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                profile_image: user.profile_image,
                token: generateToken(user.id),
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
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate token
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

        // Save to DB
        // Use manual update for these fields as they might be new cols in SQL
        const [result] = await require('../config/db').execute(
            'UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE id = ?',
            [resetToken, resetPasswordExpires, user.id]
        );

        // Send Email
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

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
        // Need to query by token and expiry
        const [rows] = await require('../config/db').execute(
            'SELECT * FROM users WHERE reset_password_token = ? AND reset_password_expires > NOW()',
            [token]
        );

        const user = rows[0];

        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update User
        await require('../config/db').execute(
            'UPDATE users SET password = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE id = ?',
            [hashedPassword, user.id]
        );

        res.json({ message: 'Password updated successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        // Get user from database
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        await require('../config/db').execute(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, user.id]
        );

        res.json({ message: 'Password updated successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.verifyOTP = async (req, res) => {
    const { email, code } = req.body;

    try {
        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.is_verified) {
            return res.status(400).json({ message: 'User is already verified' });
        }

        // Check code and expiry
        if (user.otp_code !== code) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        if (new Date() > new Date(user.otp_expires_at)) {
            return res.status(400).json({ message: 'Verification code has expired. Please request a new one.' });
        }

        // Mark as verified
        await require('../config/db').execute(
            'UPDATE users SET is_verified = 1, otp_code = NULL, otp_expires_at = NULL WHERE id = ?',
            [user.id]
        );

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id),
            message: 'Account verified successfully!'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.resendOTP = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.is_verified) {
            return res.status(400).json({ message: 'Account is already verified' });
        }

        // Generate new OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 10 * 60000);

        // Update DB
        await require('../config/db').execute(
            'UPDATE users SET otp_code = ?, otp_expires_at = ? WHERE id = ?',
            [otpCode, otpExpiresAt, user.id]
        );

        // Send Email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Galkacyo Market - New Verification Code',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #00A884; text-align: center;">New Verification Code</h2>
                    <p style="font-size: 16px;">Your new verification code is below. It will expire in 10 minutes.</p>
                    <div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333;">${otpCode}</span>
                    </div>
                </div>
            `
        };

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            await transporter.sendMail(mailOptions);
        } else {
            console.log('--- RESENT OTP CODE (DEV) ---');
            console.log(`USER: ${email}`);
            console.log(`CODE: ${otpCode}`);
            console.log('------------------------------');
        }

        res.json({ message: 'New verification code sent!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


