const express = require('express');
const router = express.Router();
const { updateProfile, updatePassword } = require('../controllers/userController');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

// Multer Config (Memory Storage for Base64)
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }
});


// Middleware to verify token
const protect = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Use upload.single('profilePicture') middleware for profile update
router.put('/profile', protect, upload.single('profilePicture'), updateProfile);
router.put('/password', protect, updatePassword);

module.exports = router;
