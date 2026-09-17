const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/profile', authenticateToken, authController.getProfile);

// Admin User & Staff Role Management
router.get('/users', authenticateToken, requireAdmin, authController.getAllUsers);
router.patch('/users/:id/role', authenticateToken, requireAdmin, authController.updateUserRole);

module.exports = router;
