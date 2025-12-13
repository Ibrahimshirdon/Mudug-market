const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, getUnreadCount } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getNotifications);
router.get('/unread', getUnreadCount);
router.put('/:id/read', markAsRead);

module.exports = router;
