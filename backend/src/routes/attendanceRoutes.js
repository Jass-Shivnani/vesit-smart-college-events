const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { authenticateToken, requireScannerOrAdmin } = require('../middleware/authMiddleware');

// Attendance endpoints (accessible by Gate Volunteers / Scanners and Admins)
router.post('/scan', authenticateToken, requireScannerOrAdmin, attendanceController.markAttendanceByQR);
router.patch('/:registration_id', authenticateToken, requireScannerOrAdmin, attendanceController.toggleAttendance);

module.exports = router;
