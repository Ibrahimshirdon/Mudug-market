const express = require('express');
const router = express.Router();
const { createShop, getMyShop, getAllShops, updateShopStatus, updateShop, getShopById } = require('../controllers/shopController');
const { protect, admin, seller } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .post(protect, upload.single('logo'), createShop) // Any auth user can request to open a shop
    .get(getAllShops); // Public or Admin? "View all shops selling same product" implies public access to shop info.

router.get('/my-shop', protect, getMyShop);
router.put('/my-shop', protect, upload.single('logo'), updateShop); // Update own shop

router.put('/:id/status', protect, admin, updateShopStatus);
router.get('/:id', getShopById);

module.exports = router;
