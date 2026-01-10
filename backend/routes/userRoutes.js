const express = require('express');
const router = express.Router();
const { updateProfile, updatePassword } = require('../controllers/userController');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Ensure this directory exists or create it.
        // For simplicity, we assume 'uploads' folder exists in root. 
        // In production, use fs.mkdirSync or similar to ensure it exists.
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
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
