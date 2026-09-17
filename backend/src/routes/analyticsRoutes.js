const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// Admin-protected analytics endpoint
router.get('/dashboard', authenticateToken, requireAdmin, analyticsController.getAdminAnalytics);

module.exports = router;
