const express = require('express');
const router = express.Router();
const { getAnalytics, getAllUsers, deleteUser, getLogs, deleteShop, deactivateShop, activateShop, getTransactions, adjustShopBalance } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect, admin);

router.get('/transactions', getTransactions);

router.get('/analytics', getAnalytics);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/logs', getLogs);
router.delete('/shops/:id', deleteShop);
router.put('/shops/:id/deactivate', deactivateShop);
router.put('/shops/:id/activate', activateShop);
router.post('/shops/:shopId/balance', adjustShopBalance);

module.exports = router;
