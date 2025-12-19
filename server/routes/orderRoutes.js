const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getShopOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, seller, admin } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/shop/:shopId', protect, seller, getShopOrders);
router.put('/:id/status', protect, seller, updateOrderStatus); // Or admin

module.exports = router;
