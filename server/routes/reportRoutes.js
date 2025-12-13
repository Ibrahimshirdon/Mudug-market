const express = require('express');
const router = express.Router();
const { createReport, getAllReports, updateReportStatus } = require('../controllers/reportController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, createReport);
router.get('/', protect, admin, getAllReports);
router.put('/:id/status', protect, admin, updateReportStatus);

module.exports = router;
